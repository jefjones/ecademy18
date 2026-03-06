import { useEffect } from 'react'
import AttendanceSchoolView from '../views/AttendanceSchoolView'
import {doSort} from '../utils/sort'
import * as actionPageLang from '../actions/language-list'
import { useSelector, useDispatch } from 'react-redux'
import * as actionAttendanceSchool from '../actions/attendance-school'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectAttendanceSchool, selectAccessRoles, selectCompanyConfig, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let attendanceSchool = selectAttendanceSchool(state)
		let companyConfig = selectCompanyConfig(state)
		let studentList = []
		attendanceSchool && attendanceSchool.length > 0 && attendanceSchool.forEach(m => {
				let foundRecord = false
				studentList && studentList.length > 0 && studentList.forEach(v => {
						if (v.id === m.studentPersonId) foundRecord = true
				})
				if (!foundRecord)
						studentList = studentList.concat({
								id: m.studentPersonId,
								label: companyConfig.studentNameFirst === 'FIRSTNAME' ? m.studentFirstName + ' ' + m.studentLastName : m.studentLastName + ', ' + m.studentFirstName
						})
		})

		studentList = doSort(studentList, { sortField: 'label', isAsc: true, isNumber: false })

    return {
        personId: me.personId,
        langCode: me.langCode,
				attendanceSchool,
				studentList,
				accessRoles: selectAccessRoles(state),
				companyConfig,
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getAttendanceSchool: (personId) => dispatch(actionAttendanceSchool.init(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, langCode, personId, setMyVisitedPage, getAttendanceSchool} = props
    				getPageLangs(personId, langCode, 'AttendanceSchoolView')
    				getAttendanceSchool(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Attendance (school)`})
    		
  }, [])

  return <AttendanceSchoolView {...props} />
}
export default Container
