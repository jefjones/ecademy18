import React, {Component} from 'react';
import ReactExport from '../ReactDataExport'//"react-data-export";
import styles from './ExcelStudents.css';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default class extends Component {
    render() {
				const {report} = this.props;

				const dataSet1 = report && report.length > 0 && report.map(m => ({
						studentFirstName: m.firstName,
						studentLastName: m.lastName,
						parentFirstName: m.firstNameParent1,
						parentLastName: m.lasstNameParent1,
						city: m.city,
						state: m.stateName,
						gradeLevel: m.gradeLevelName,
						iep: m.iep,
						carsonSmith: m.carsonSmith,
						studentType: m.studentType,
						externalId: m.externalId,
				}));

        return (
            <ExcelFile className={styles.change}>
                <ExcelSheet data={dataSet1} name={`Course Name with Student Count`}>
										<ExcelColumn label={`Student First Name`} value="studentFirstName"/>
										<ExcelColumn label={`Student Last Name`} value="studentLastName"/>
										<ExcelColumn label={`Parent First Name`} value="parentFirstName"/>
										<ExcelColumn label={`Parent Last Name`} value="parentLastName"/>
										<ExcelColumn label={`City`} value="city"/>
										<ExcelColumn label={`State`} value="state"/>
										<ExcelColumn label={`GradeLevel`} value="gradeLevel"/>
										<ExcelColumn label={`IEP`} value="iep"/>
										<ExcelColumn label={`Carson Smith`} value="carsonSmith"/>
										<ExcelColumn label={`Student Type`} value="studentType"/>
										<ExcelColumn label={`ExternalId`} value="externalId"/>
                </ExcelSheet>
            </ExcelFile>
        );
    }
}


//<ExcelColumn key={i} label={<div className={styles.row}><div>{m.title} {(m.totalPoints && ' (' + m.totalPoints + ')')} {m.dueDate && ' ['}</div> <DateMoment date={m.dueDate} format={'D MMM'}/><div> {m.dueDate && ']'}</div></div>} value={m.assignmentId}/>
