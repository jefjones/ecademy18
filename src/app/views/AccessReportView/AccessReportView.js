import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './AccessReportView.css';
const p = 'AccessReportView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import Checkbox from '../../components/Checkbox';
import Icon from '../../components/Icon';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/MessageModal';
import Loading from '../../components/Loading';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';

export default class AccessReportView extends Component {
  constructor(props) {
    super(props);

    this.state = {
        localHeadings: [],
        localData: [],
        peerGroupId: '',
        peerGroup_workId: '',
        errorPeerGroup: '',
        masterWorkId: '',
        groupChosen: '',
        isShowingPeerGroupInfo: false,
        isShowingJumpToAssign: false,
    }

    this.handlePathLink = this.handlePathLink.bind(this);
    this.handleColumnClick = this.handleColumnClick.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.createCheckmarkIcon = this.createCheckmarkIcon.bind(this);
    this.createNoAccessIcon = this.createNoAccessIcon.bind(this);
    this.createLockedAccessIcon = this.createLockedAccessIcon.bind(this);
    this.handleCompareChanges = this.handleCompareChanges.bind(this);
    this.processForm = this.processForm.bind(this);
    this.handlePeerGroupInfoClose = this.handlePeerGroupInfoClose.bind(this);
    this.handlePeerGroupInfoOpen = this.handlePeerGroupInfoOpen.bind(this);
    this.handleJumpToAssignClose = this.handleJumpToAssignClose.bind(this);
    this.handleJumpToAssignOpen = this.handleJumpToAssignOpen.bind(this);
    this.onChangePeerGroup = this.onChangePeerGroup.bind(this);
    this.onChangePeerGroupAssignment = this.onChangePeerGroupAssignment.bind(this);
    this.setData = this.setData.bind(this);
  }

  onChangePeerGroupAssignment(event) {
      this.setState({ peerGroup_workId: event.target.value, errorPeerGroup: '' });
  }

  onChangePeerGroup(event) {
      this.setState({ peerGroupId: event.target.value, errorPeerGroup: '' });
  }

  processForm(stayOrFinish) {
      //Loop through the records to look for the difference created by handleCompareChanges
      //Send back the records with the directives to 'deleteAccess' or 'addAccess'
      const {personId, groupModifyWorkAccess, groupChosen} = this.props;
      const {localData, peerGroupId, peerGroup_workId} = this.state;
      let workAssign = [];
      let newAssign = {};
      let hasError = false;

      if (peerGroupId && peerGroupId !== '0' && !peerGroup_workId) {
          this.setState({ errorPeerGroup: <L p={p} t={`Peer group is chosen but assignment not specified`}/>})
          hasError = true;
      }
      localData.forEach(row => row.forEach(cell => {
          if (cell.cellColor === 'green') {
              newAssign = {
                  modify: 'addAccess',
                  personId: cell.id,
                  workId: cell.headingId,
              }
              workAssign = workAssign ? workAssign.concat(newAssign) : [newAssign];
          } else if (cell.cellColor === 'red') {
              newAssign = {
                  modify: 'removeAccess',
                  personId: cell.id,
                  workId: cell.headingId,
              }
              workAssign = workAssign ? workAssign.concat(newAssign) : [newAssign];
          }
      }));

      if (!hasError && !!workAssign) {
          groupModifyWorkAccess(personId, workAssign, groupChosen, peerGroupId, peerGroup_workId);
          this.setState({ peerGroupId: '', peerGroup_workId: '' });
      }
      this.handleCompareChanges(localData, true);

      if (!hasError && stayOrFinish === "FINISH") {
          browserHistory.push("/assignmentDashboard");
      }

  }

  handleCompareChanges(paramData, forceClear=false) {
      //Using the original reportTable.data, look at the current localData to see what has changed.
      //Red: If the student had access before and now it is marked as 'no access'
      //Green: If the student is getting access now and didn't have it before.
      const {reportTable} = this.props;
      let cellColor = '';
      let newData = paramData.map(localRow => localRow.map(localCell => {
          cellColor = '';
          reportTable.data.forEach(origRow => {
              origRow.forEach(origCell => {
                  if (!forceClear && localCell.id === origCell.id && localCell.headingId === origCell.headingId) {
                      if (localCell.boolValue && origCell.value === "0") cellColor = 'green';
                      if (!localCell.boolValue && origCell.value === "1") cellColor = 'red';
                  }
              });
          });
          return {
            ...localCell,
            cellColor,
            id: localCell.id,
            headingId: localCell.headingId,
            value: cellColor === 'red' ? this.createLockedAccessIcon(localCell.id, localCell.headingId) : localCell.value,
          }
      }));
      this.setState({ localData: newData });
  }

  handleCellClick(personId, workId) {
      //Find the cell that matches the personId and workId (id and headingId, respectively)
      //  and toggle the value from whatever it currently is.
      const {localData} = this.state;
      let newData = localData.map(row => row.map((cell, index) =>
        cell.id === personId && cell.headingId === workId
            ? {
                ...cell,
                id: cell.id,
                headingId: cell.headingId,
                value: !cell.boolValue ? this.createCheckmarkIcon(cell.id, cell.headingId) : this.createNoAccessIcon(cell.id, cell.headingId),
                boolValue: !cell.boolValue,

              }
            : cell));
      this.setState({ localData: newData });
      this.handleCompareChanges(newData);
  }

  handleJumpToAssign(masterWorkId, groupChosen) {
    browserHistory.push("/groupWorkAssign/" + groupChosen + "/" + masterWorkId);
  }

  handleColumnClick(workId) {
      //Force the jump to the GroupWorkAssign page instead where the peer group can be assigned.
      const {groupChosen} = this.props;
      this.handleJumpToAssignOpen();
      this.setState({ masterWorkId: workId, groupChosen });
  }

  handleRowClick(personId) {
      //1. Find the row that matches the personId (id)
      //2. First, find out if any of the boxes are checked.  Uncheck them all if there is even just one.
      //   Otherwise, check them all if not one of them is set.
      const {localData} = this.state;
      let isOneSet = false;
      localData.forEach(row => row.forEach((cell, index) => { if (cell.id === personId && cell.boolValue && index >= 2) isOneSet = true; } ));

      let newData = localData.map(row => row.map((cell, index) =>
        cell.id && cell.id === personId && index >= 2
            ? {
                ...cell,
                id: cell.id,
                headingId: cell.headingId,
                value: !isOneSet ? this.createCheckmarkIcon(cell.id, cell.headingId) : this.createNoAccessIcon(cell.id, cell.headingId),
                boolValue: !isOneSet,
                clickFunction: () => this.handleCellClick(cell.id, cell.headingId),
                cellColor: !isOneSet ? 'green' : 'red',
              }
            : cell));
      this.setState({ localData: newData });
      this.handleCompareChanges(newData);
  }

  createCheckmarkIcon(personId, workId) {
      return <a onClick={() => this.handleCellClick(personId, workId)}><Icon pathName={`checkmark`}/></a>;
  }

  createNoAccessIcon(workId, personId) {
      return <a onClick={() => this.handleCellClick(personId, workId)}><Icon pathName={``}/></a>;
  }

  createLockedAccessIcon(workId, personId, fillColor) {
      return <a onClick={() => this.handleCellClick(personId, workId)}><Icon pathName={`locked0`} fillColor={fillColor} premium={true}/></a>;
  }

  componentDidUpdate(prevProps) {
      const {reportTable} = this.props;
      if (prevProps.reportTable.data !== reportTable.data) {
          reportTable && reportTable.data && reportTable.data.length > 0 && this.setData();
      }
  }

  setData() {
      const {reportTable, group} = this.props;
      //Provide the handleCellClick for the cells
      //Include the InputText for the first row across which will toggle that assignemnt or document to be all on for everyone or all off.
      //Include the InputText for the second column after the names which will toggle the controls to be all on or all off for a person.
      let colIndex = 0;
      let firstRow = reportTable.headings.reduce((acc, m) => {
          if (colIndex === 0) {
              acc = [{
                  ...m,
                  value: group.groupTypeName === 'FACILITATORLEARNER' ? <L p={p} t={`LEARNERS`}/> : <L p={p} t={`MEMBERS`}/>
              }];
          } else {
              if (colIndex === 1) acc = acc.concat({id: 0, value: ''});
              acc = acc.concat({
                  ...m,
                  value: <Checkbox className={styles.checkbox} onClick={() => this.handleColumnClick(m.headingId)}/>,
              });
          }
          colIndex++;
          return acc;
      }, []);

      let newData = reportTable.data.map(row => {
          colIndex = 0;
          return row && row.length > 0 && row.reduce((acc, cell) => {
              //When it is the second column, inject a blank column.
              if (colIndex === 0) {
                  acc = [cell]; //Take the first cell without any changes since it is the name of the student or group member.
              } else {
                  if (colIndex === 1) acc = acc.concat({ id: 0, value: <Checkbox onClick={() => this.handleRowClick(cell.id)}/> });

                  acc = acc.concat({
                      ...cell,
                      id: cell.id,
                      headingId: cell.headingId,
                      value: cell.value === "1" && !cell.locked
                            ? this.createCheckmarkIcon(cell.id, cell.headingId)
                            : cell.locked
                                ? this.createLockedAccessIcon(cell.id, cell.headingId, 'maroon')
                                : this.createNoAccessIcon(cell.id, cell.headingId),
                      boolValue: cell.value === "1" ? true : false,
                      clickFunction: () => this.handleCellClick(cell.id, cell.headingId)
                  });
              }
              colIndex++;
              return acc;
          },[]);
      });

      colIndex = 0;
      let newHeadings = reportTable.headings.reduce((acc, heading) => {
          if (colIndex === 1) acc = acc.concat({id: 0, label: ''}); //This is the column for the checkboxes in the second column for the editors/members of the group.
          let newHeading = { ...heading, headingId: heading.headingId, clickFunction: () => this.handleColumnClick(heading.headingId) };
          acc = acc ? acc.concat(newHeading) : [newHeading];
          colIndex++;
          return acc;
      },[]);
      //Add the first row of data that is the row of checkboxes to use to 'set all' or 'clear all' of the records of a singld column with a single click.
      newData.unshift(firstRow);
      this.setState({ localData: newData, localHeadings: newHeadings });
  }

  handlePathLink(pathLink) {
      pathLink && browserHistory.push(pathLink);
  }

  handlePeerGroupInfoClose = () => this.setState({isShowingPeerGroupInfo: false})
  handlePeerGroupInfoOpen = () => this.setState({isShowingPeerGroupInfo: true})
  handleJumpToAssignClose = () => this.setState({isShowingJumpToAssign: false})
  handleJumpToAssignOpen = () => this.setState({isShowingJumpToAssign: true})


  render() {
    const {group, fetchingRecord} = this.props;
    const {localHeadings, localData, isShowingPeerGroupInfo, isShowingJumpToAssign, masterWorkId, groupChosen} = this.state;

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Access Report`}/>
            </div>
            <div className={classes(styles.subTitle, styles.row)}>
                <L p={p} t={`For group:`}/> {group && group.groupName}
            </div>
            <hr />
            <Loading loadingText={`Loading`} isLoading={fetchingRecord && fetchingRecord.accessReport} />
            {fetchingRecord && !fetchingRecord.accessReport && localData &&
                <div className={classes(styles.row, styles.moreLeft)}>
                    <ButtonWithIcon icon={'checkmark_circle'} label={<L p={p} t={`Save & Stay`}/>} className={styles.button} onClick={(event) => this.processForm("STAY", event)}/>
                    <ButtonWithIcon icon={'checkmark_circle'} label={<L p={p} t={`Save & Finish`}/>} className={styles.button} onClick={(event) => this.processForm("FINISH", event)}/>
                </div>
            }
            {fetchingRecord && !fetchingRecord.accessReport &&
                <EditTable labelClass={styles.tableLabelClass} headings={localHeadings}
                    data={localData} noCount={true} firstColumnClass={styles.firstColumnClass}
                    sendToReport={this.handlePathLink}/>
            }
            <br/>
            <br/>
            <OneFJefFooter />
            {isShowingPeerGroupInfo &&
                <MessageModal handleClose={this.handlePeerGroupInfoClose} heading={<L p={p} t={`How to use peer groups with an assignment`}/>} showPeerGroupInfo={true}
                    explainJSX={[<L p={p} t={`Peer groups will allow members of each sub group to view and edit each other's assignments.`}/>,<br/>,<br/>,
                        <L p={p} t={`If you have not yet created a peer group for this group, choose 'Add a new peer group.'`}/>,
                        <L p={p} t={`Once you have at least one peer group and you have returned to this access report, click on an assignment in the report heading.`}/>,
                        <L p={p} t={`You will be taken to a page to decide which peer group to apply to the chosen assignment.`}/>]}
                    onClick={this.handlePeerGroupInfoClose}/>
            }
            {isShowingJumpToAssign &&
                <MessageModal handleClose={this.handleJumpToAssignClose} heading={<L p={p} t={`I'm taking you to the single assignment page`}/>} showPeerGroupInfo={true}
                    explainJSX={<L p={p} t={`We found that it is better to grant access to an assignment to everyone on a different page.  In that page you can choose to split up your class into peer groups, but that is just an option. I'm going to take you there now, is that okay?`}/>}
                    isConfirmType={true}
                    onClick={() => this.handleJumpToAssign(masterWorkId, groupChosen)}/>
            }
      </div>
    );
  }
}
