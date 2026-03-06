[Route("ebi/courseFile/upload/{personId}/{schoolYearInt}")]
[HttpPost]
public IActionResult uploadFile(List<IFormFile> ebiFile, Guid? personId, Guid? schoolYearInt)
{
    _assignmentsService.uploadFile(ebiFile, personId ?? Guid.Empty, schoolYearInt);
    return Ok();
}


public async void uploadCourses(List<IFormFile> ebiFile, Guid personId, int schoolYearInt)
{
    long size = ebiFile.Sum(f => f.Length);

    foreach (var formFile in ebiFile)
    {
        if (formFile.Length > 0)
        {
            try
            {
                byte[] fileBytes = new byte[0];
                using (var uploadedFileStream = formFile.OpenReadStream())
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        uploadedFileStream.CopyTo(ms);
                        fileBytes = ms.ToArray();
                    }
                }
                //Loop through the records
                //  If the courseEntry doesn't exist,
                //      Create the courseEntry record.
                //      Set the CourseEntryGradeLevels
                //  otherwise,
                //      Pick up the courseEntryId for the courseScheduled record.
                //  end if
                //
                //   If the course is not already entered,
                //      add the new courseScheduled - include the term start and term end as created by the intervals.
                //      Set the TeacherCourseAssign records (as well as the first FacilitatorPersonId record for legacy purposes)
                //      Set the DaysScheduled records
                //      Set the CourseIntervalAssign records
                //  end if
                var companyId = _context.PersonAccessRoleAssign.Where(m => m.PersonId == personId).Select(m => m.CompanyId).FirstOrDefault();

                TextReader reader = new StreamReader(fileBytes);
                var csvReader = new CsvReader(reader);
                //var isRecordBad = false;
                csvReader.Configuration.TrimOptions = TrimOptions.Trim;
                csvReader.Configuration.DetectColumnCountChanges = true;
                csvReader.Configuration.ReadingExceptionOccurred = null;
                csvReader.Configuration.MissingFieldFound = null;
                csvReader.Configuration.BadDataFound = null;

                var loop = 0;
                while (csvReader.Read())
                {
                    Console.WriteLine(loop++);
                    var section = csvReader.GetRecord<ManheimSectionInsert>();
                        var courseEntry = _context.CourseEntry.Where(m => m.ExternalId == section.CourseId).FirstOrDefault();

                        if (courseEntry == null)
                        {
                            courseEntry = new CourseEntry
                            {
                                CourseName = section.courseName,
                                CompanyId = companyId,
                                LearningPathwayId = _context.LearningPathway.Where(m => m.CompanyId == companyId && m.Name == section.SubjectDiscipline).Select(m => m.LearningPathwayId).FirstOrDefault(),
                                EntryDate = DateTime.Now,
                                Credits = section.Credits,
                                Description = section.Description,
                                ExternalId = section.CourseId,
                                IsActive = Inactive == 'Inactive' ? true : false,
                            };
                            _context.CourseEntry.Add(courseEntry);
                            _context.SaveChanges();
                        }

                        var gradeLevels = section.GradeLevels.split(",");
                        foreach( var gradeLevel in gradeLevels) {
                            var gradeLevelId = _context.GradeLevel.Where(m => m.Name == gradeLevel).Select(m => m.GradeLevelId).FirstOrDefault();
                            if (gradeLevelId != null) {
                                _context.CourseEntryGradeLevel.Add(new CourseEntryGradeLevel {
                                    CourseEntryId = courseEntry.CourseEntryId,
                                    GradeLevelId = gradeLevelId,
                                });
                            }
                        }

                        var courseScheduled = _context.CourseScheduled.Where(m => m.ExternalId == section.SECTION_ID && m.SchoolYearId == Guid.Parse("6B64B061-8E35-403F-A16E-B4A7F1318439")).FirstOrDefault();

                        if (courseScheduled == null)
                        {
                            var fromDate = moment();
                            var toDate = moment();
                            var firstLoop = true;
                            var intervals = _context.Intervals.Where(m => m.CompanyId == companyId).OrderBy(m => m.Sequence).ToList();
                            foreach(var interval in intervals) {
                                if (firstLoop && section.Intervals.indexOf(interval.code) > -1) {
            												fromDate = (interval.fromMonth >= 7 ? schoolYearInt-1*1 : schoolYearInt) + '-' + this.twoDigit(interval.fromMonth) + '-' + this.twoDigit(interval.fromDay);
            										}
            										if (intervalChoices.indexOf(interval.intervalId) > -1) {
            												toDate = (interval.toMonth < 7 ? schoolYearInt : schoolYearInt-1*1) + '-' + this.twoDigit(interval.toMonth) + '-' + this.twoDigit(interval.toDay);
            										}
                            }

                            var courseSched = new CourseScheduled
                            {
                                CourseEntryId = courseEntry.CourseEntryId,
                                FacilitatorPersonId = facilitatorPersonId == null ? Guid.Empty : facilitatorPersonId,
                                FromDate = DateTime.Parse(section.TERM_START),
                                ToDate = DateTime.Parse(section.TERM_END),
                                CompanyId = companyId,
                                EntryDate = DateTime.Now,
                                Section = section.SectionId,
                                CourseTypeId = Guid.Parse("A7A3610B-AB79-48BB-BE64-35661023D2DB"), //Block type
                                MaxSeats = section.MaxSeats,
                                Online = Online.ToLower() == 'online' ? true : false,
                                SchoolYearId = Guid.Parse("6B64B061-8E35-403F-A16E-B4A7F1318439"),  //!!!!!!!!!!!!!!!!!!!   this is CURRENT year!
                            };
                            _context.CourseScheduled.Add(courseSched);
                            _context.SaveChanges();

                            var teacherIds = section.TeacherId;
                            foreach(var teacherId in teacherIds) {
                                var facilitatorPersonId  = _context.PersonAccessRoleAssign.Where(m => m.CompanyId == companyId && m.ExternalId == teacherId).Select(m => m.PersonId).FirstOrDefault();
                                if (facilitatorPersonId != null) {
                                    _context.TeacherCourseAssign.Add(new TeacherCourseAssign {
                                        PersonId = facilitatorPersonId,
                                        CourseScheduledId = courseSched.CourseScheduledId,
                                    });
                                }
                            }

                            var preReqTables = section.Prerequisites.split("and");
                            foreach(var preReqTable in preReqTables) {
                                var preReqTableEntry = new CoursePreRequisiteTable {
                                    CourseId = section.CourseId,
                                    CompanyId = companyId,
                                };
                                _context.CoursePreRequisiteTable.Add(preReqTableEntry);
                                _context.SaveChanges();

                                var preReqDetails = preReqTable.Replace("(", "").Replace(")", "").Replace(" ", "").split(",");
                                foreach(var preReqDetail in preReqDetails) {
                                    _context.CoursePreRequisiteDetail.Add(new CoursePreRequisiteDetail {
                                        CoursePreRequisiteTableId = CoursePreRequisiteTable.CoursePreRequisiteTableId,
                                        CourseId = preReqDetail,
                                    });
                                }
                            }

                            var intervals = _context.Intervals.Where(m => m.CompanyId == companyId).OrderBy(m => m.Sequence).ToList();
                            foreach(var interval in intervals) {
                                if (section.Intervals.indexOf(interval.code) > -1) {
                                    _context.CourseIntervalAssign.Add(new CourseIntervalAssign
                                    {
                                        CourseScheduledId = courseSched.CourseScheduledId,
                                        IntervalId = interval.IntervalId,
                                    });
                                }
                            }

                            if (section.Monday != "") {
                                var classPeriodId = _context.ClassPeriod.Where(m => m.CompanyId == companyId && m.PeriodNumber == section.Monday).Select(m => m.ClassPeriodId).FirstOrDefault();

                                if (classPeriodId != null && classPeriodId != Guid.Empty)
                                {
                                    _context.DaysScheduled.Add(new DaysScheduled
                                    {
                                        CourseScheduledId = courseSched.CourseScheduledId,
                                        DayOfTheWeek = "monday",
                                        ClassPeriodId = classPeriodId,
                                        EntryPersonId = Guid.Empty,
                                        EntryDate = DateTime.Now,
                                    });
                                }
                            }

                            if (section.Tuesday != "") {
                                var classPeriodId = _context.ClassPeriod.Where(m => m.CompanyId == companyId && m.PeriodNumber == section.Tuesday).Select(m => m.ClassPeriodId).FirstOrDefault();

                                if (classPeriodId != null && classPeriodId != Guid.Empty)
                                {
                                    _context.DaysScheduled.Add(new DaysScheduled
                                    {
                                        CourseScheduledId = courseSched.CourseScheduledId,
                                        DayOfTheWeek = "tuesday",
                                        ClassPeriodId = classPeriodId,
                                        EntryPersonId = Guid.Empty,
                                        EntryDate = DateTime.Now,
                                    });
                                }
                            }

                            if (section.Wednesday != "") {
                                var classPeriodId = _context.ClassPeriod.Where(m => m.CompanyId == companyId && m.PeriodNumber == section.Wednesday).Select(m => m.ClassPeriodId).FirstOrDefault();

                                if (classPeriodId != null && classPeriodId != Guid.Empty)
                                {
                                    _context.DaysScheduled.Add(new DaysScheduled
                                    {
                                        CourseScheduledId = courseSched.CourseScheduledId,
                                        DayOfTheWeek = "wednesday",
                                        ClassPeriodId = classPeriodId,
                                        EntryPersonId = Guid.Empty,
                                        EntryDate = DateTime.Now,
                                    });
                                }
                            }

                            if (section.Thursday != "") {
                                var classPeriodId = _context.ClassPeriod.Where(m => m.CompanyId == companyId && m.PeriodNumber == section.Thursday).Select(m => m.ClassPeriodId).FirstOrDefault();

                                if (classPeriodId != null && classPeriodId != Guid.Empty)
                                {
                                    _context.DaysScheduled.Add(new DaysScheduled
                                    {
                                        CourseScheduledId = courseSched.CourseScheduledId,
                                        DayOfTheWeek = "thursday",
                                        ClassPeriodId = classPeriodId,
                                        EntryPersonId = Guid.Empty,
                                        EntryDate = DateTime.Now,
                                    });
                                }
                            }

                            if (section.Friday != "") {
                                var classPeriodId = _context.ClassPeriod.Where(m => m.CompanyId == companyId && m.PeriodNumber == section.Friday).Select(m => m.ClassPeriodId).FirstOrDefault();

                                if (classPeriodId != null && classPeriodId != Guid.Empty)
                                {
                                    _context.DaysScheduled.Add(new DaysScheduled
                                    {
                                        CourseScheduledId = courseSched.CourseScheduledId,
                                        DayOfTheWeek = "friday",
                                        ClassPeriodId = classPeriodId,
                                        EntryPersonId = Guid.Empty,
                                        EntryDate = DateTime.Now,
                                    });
                                }
                            }

                            _context.SaveChanges();
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("MY ERROR: " + e);
            }
        }
