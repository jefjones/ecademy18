import { useEffect } from 'react'
import AssignmentDashboardView from '../views/AssignmentDashboardView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import Icon from '../components/Icon'
import * as actionGroupEditReport from '../actions/group-edit-report'
import * as actionGroups from '../actions/groups'
import * as actionWorks from '../actions/works'
import * as fromGroupEditReport from '../reducers/group-edit-report'
import * as actionPersonConfig from '../actions/person-config'
import * as actionPageLang from '../actions/language-list'
import { selectMe, selectLanguageList, selectGroups, selectGroupIdCurrent, selectFetchingRecord, selectPersonConfig } from '../store'

const mapStateToProps = (state, props) => {
    const {groupChosen} = props.params
    let groupId = groupChosen ? groupChosen : selectGroupIdCurrent(state)
    let me = selectMe(state)
    let group = selectGroups(state) && selectGroups(state).length > 0 && selectGroups(state).filter(m => m.groupId === groupId)[0]
    let reportTable = fromGroupEditReport.selectEditWorkResponseEditorsCounts(state.groupEditReport, group.masterWorkId)
    let statusLegend = [
        {
            subject: <Icon pathName={'hourglass'} premium={true}/>,
            body: 'Pending learner submission',
        },
        {
            subject: <Icon pathName={'inbox0'} premium={true}/>,
            body: 'Submitted by learner',
        },
        {
            subject: <Icon pathName={'compare_docs'} premium={true}/>,
            body: 'Reviewed by facilitator',
        },
        {
            subject: <Icon pathName={'check_document'} premium={true}/>,
            body: 'Completed',
        },
    ]

    return {
        personId: me.personId,
        langCode: me.langCode,
        languageChosen: 1,
        languageList: selectLanguageList(state),
        groupSummary: group,
        subHeadTitle: reportTable.subHeadTitle,
        headTitle: reportTable.headTitle,
        headings: reportTable.headings,
        data: reportTable.data,
        currentGroupId: selectGroupIdCurrent(state),
        fetchingRecord: selectFetchingRecord(state),
        statusLegend,
        personConfig: selectPersonConfig(state),
    }
}

const bindActionsToDispatch = dispatch => ({
    updateGroupWorkStatus: (personId, groupId, memberWorkId, groupWorkStatusName) => dispatch(actionWorks.updateGroupWorkStatus(personId, groupId, memberWorkId, groupWorkStatusName)),
    initGroupEditReport: (personId, groupId) => dispatch(actionGroupEditReport.init(personId, groupId)),
    initWorkWithAssignmentWorkId: (personId, includeAssignmentWorkId) => dispatch(actionWorks.init(personId, includeAssignmentWorkId)),
    setGroupCurrentSelected: (personId, groupId, masterWorkId, memberWorkId, goToPage) => dispatch(actionGroups.setGroupCurrentSelected(personId, groupId, masterWorkId, memberWorkId, goToPage)),
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
    groupInit: (personId) => dispatch(actionGroups.init(personId)),
    updatePersonConfig: (personId, field, value)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setGroupCurrentSelected, initGroupEditReport, personId, currentGroupId, groupSummary} = props
            initGroupEditReport(personId, currentGroupId)
              //Due to the way that the report is set up that calls this page, there isn't any other place where the new group is set, so this is it for setting the current groupId.
            setGroupCurrentSelected(personId, groupSummary.groupId, groupSummary.masterWorkId, groupSummary.memberWorkId, "STAY")
            getPageLangs(personId, langCode, 'AssignmentDashboardView')
        
  }, [])

  const {groupSummary} = props
          return !!groupSummary ? <AssignmentDashboardView {...props} /> : null
}

export default Container
