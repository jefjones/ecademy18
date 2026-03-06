import React, {Component} from 'react';
import styles from './GalleryListView.css';
const p = 'GalleryListView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import InputText from '../../components/InputText';
import CommentListModal from '../../components/CommentListModal';
import Icon from '../../components/Icon';
import Loading from '../../components/Loading';
import DateTimePicker from '../../components/DateTimePicker';
import GalleryImageDisplay from '../../components/GalleryImageDisplay';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import InputDataList from '../../components/InputDataList';
import classes from 'classnames';
import ReactToPrint from "react-to-print";

class GalleryListView extends Component {
    constructor(props) {
	      super(props);

	      this.state = {
	      }
    }

		handleChange = (courseScheduledId, attendanceDate, AttendanceTypeCode) => {
				const {personId, setCourseAttendance} = this.props;
				const {studentPersonId} = this.state;
				setCourseAttendance(personId, AttendanceTypeCode, studentPersonId, courseScheduledId, attendanceDate, !AttendanceTypeCode);
		}

		handlePrintOpen = () => this.setState({ printOpen: true });
		handlePrintClose = () => this.setState({ printOpen: false });

		handleInstructionsOpen = (note) => this.setState({isShowingModal_instructions: true, note })
		handleInstructionsClose = () => this.setState({isShowingModal_instructions: false, note: '' })

    dataListChange = (field, values) => {
				let result = values && values.length > 0 && values.reduce((acc, m) => {
						if (m.id) acc = acc += (acc && acc.length > 0 ? ',' : '') + m.id;
						return acc;
				}, "");
        this.setState({ filter: {...this.state.filter, [field]: result }})
		}

    removeStudent = (id) => {
				const {filter} = this.state;
				let studentFilter = Object.assign([], filter.students);
				if (studentFilter && studentFilter.length > 0) {
						let result = studentFilter.reduce((acc, m) => {
								if (id !== m.id) {
										acc = acc += (acc && acc.length > 0 ? ',' : '') + m.id;
								}
								return acc;
						}, "");
						this.setState({ filter: {...this.state.filter, students: result }})
				}
		}

    removeCourse = (id) => {
        const {filter} = this.state;
        let courseFilter = Object.assign([], filter.coursesScheduled);
        if (courseFilter && courseFilter.length > 0) {
            let result = courseFilter.reduce((acc, m) => {
                if (id !== m.id) {
                    acc = acc += (acc && acc.length > 0 ? ',' : '') + m.id;
                }
                return acc;
            }, "");
            this.setState({ filter: {...this.state.filter, coursesScheduled: result }})
        }
    }

    handleCommentListOpen = (comments) => this.setState({ isShowingModal_comment: true, comments });
    handleCommentListClose = () => this.setState({ isShowingModal_comment: false, comments: [] });

    render() {
      const {personId, myFrequentPlaces, setMyFrequentPlace, galleryList, students, fetchingRecord, coursesScheduled} = this.props;
      const {filter={},  isShowingModal_comment, comments} = this.state;

      return (
        <div className={styles.container}>
            <div className={styles.marginLeft}>
								<div className={classes(globalStyles.pageTitle, styles.moreBottomMargin)}>
										<L p={p} t={`Gallery Photos List`}/>
								</div>
								<div className={styles.row}>
										<div>
                        <InputText
      											id={`description`}
      											name={`description`}
      											size={"medium"}
      											label={<L p={p} t={`Description (partial text search)`}/>}
      											value={filter.description || ''}
      											onChange={this.changeFilter}/>
										</div>
										<div className={styles.topPosition}>
                        <InputDataList
                            label={<L p={p} t={`Students in photo`}/>}
                            name={'studentsInPhoto'}
                            options={students}
                            value={filter.studentsInPhoto || []}
                            multiple={true}
                            height={`medium`}
                            onChange={(values) => this.dataListChange('studentsInPhoto', values)}
                            removeFunction={this.removeStudent}/>
										</div>
                    <div className={styles.topPosition}>
                        <InputDataList
                            label={<L p={p} t={`Classes`}/>}
                            name={'coursesScheduled'}
                            options={coursesScheduled}
                            value={filter.coursesScheduled || []}
                            multiple={true}
                            height={`medium`}
                            onChange={(values) => this.dataListChange('coursesScheduled', values)}
                            removeFunction={this.removeCourse}/>
										</div>
                    <div className={classes(styles.moreTop, styles.moreRight, styles.row)}>
    										<div className={classes(styles.dateRow, styles.moreRight)}>
    												<DateTimePicker id={`fromDate`} label={<L p={p} t={`From date`}/>} value={filter.fromDate} maxDate={filter.toDate}
    														required={true} whenFilled={filter.fromDate || filter.toDate}
    														onChange={(event) => this.changeDate('fromDate', event)}/>
    										</div>
    										<div className={classes(styles.dateRow, styles.moreTop, styles.muchRight)}>
    												<DateTimePicker id={`toDate`} value={filter.toDate} label={<L p={p} t={`To date (optional)`}/>} minDate={filter.fromDate ? filter.fromDate : ''}
    														onChange={(event) => this.changeDate('toDate', event)}/>
    										</div>
    								</div>
										<div onMouseOver={this.handlePrintOpen} onMouseOut={this.handlePrintClose} className={styles.moveUpLittle}>
												<ReactToPrint trigger={() => <a href="#" className={classes(styles.moveDownRight, styles.link, styles.row)}><Icon pathName={'printer'} premium={true} className={styles.icon}/><L p={p} t={`Print`}/></a>} content={() => this.componentRef}/>
										</div>
								</div>
								<hr/>
                <Loading isLoading={fetchingRecord.galleryList} />
                <div ref={el => (this.componentRef = el)} className={classes(styles.centered, styles.componentPrint, styles.maxWidth)}>
    								{galleryList && galleryList.length > 0 && galleryList.map((m, i) =>
                        <GalleryImageDisplay url={m.fileUrl} deleteFunction={this.removeImage} isOwner={personId === m.entryPersonId} onClick={this.handleCommentListOpen}
                            keyIndex={i} description={m.description} handleCommentListOpen={this.handleCommentListOpen}/>
    								)}
                </div>
						</div>
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Gallery Photos`}/>} path={'galleryList'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
            {isShowingModal_comment &&
								<CommentListModal handleClose={this.handleCommentListClose} comments={comments}/>
						}
        </div>
    )};
}

export default GalleryListView;
