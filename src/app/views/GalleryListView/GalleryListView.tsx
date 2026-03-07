import { useState } from 'react'
import * as styles from './GalleryListView.css'
const p = 'GalleryListView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import InputText from '../../components/InputText'
import CommentListModal from '../../components/CommentListModal'
import Icon from '../../components/Icon'
import Loading from '../../components/Loading'
import DateTimePicker from '../../components/DateTimePicker'
import GalleryImageDisplay from '../../components/GalleryImageDisplay'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import InputDataList from '../../components/InputDataList'
import classes from 'classnames'
import ReactToPrint from "react-to-print"

function GalleryListView(props) {
  const [printOpen, setPrintOpen] = useState(true)
  const [isShowingModal_instructions, setIsShowingModal_instructions] = useState(true)
  const [note, setNote] = useState('')
  const [filter, setFilter] = useState({...this.state.filter, [field]: result })
  const [students, setStudents] = useState(result)
  const [coursesScheduled, setCoursesScheduled] = useState(result)
  const [isShowingModal_comment, setIsShowingModal_comment] = useState(true)
  const [comments, setComments] = useState([])

  
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
        											onChange={changeFilter}/>
  										</div>
  										<div className={styles.topPosition}>
                          <InputDataList
                              label={<L p={p} t={`Students in photo`}/>}
                              name={'studentsInPhoto'}
                              options={students}
                              value={filter.studentsInPhoto || []}
                              multiple={true}
                              height={`medium`}
                              onChange={(values) => dataListChange('studentsInPhoto', values)}
                              removeFunction={removeStudent}/>
  										</div>
                      <div className={styles.topPosition}>
                          <InputDataList
                              label={<L p={p} t={`Classes`}/>}
                              name={'coursesScheduled'}
                              options={coursesScheduled}
                              value={filter.coursesScheduled || []}
                              multiple={true}
                              height={`medium`}
                              onChange={(values) => dataListChange('coursesScheduled', values)}
                              removeFunction={removeCourse}/>
  										</div>
                      <div className={classes(styles.moreTop, styles.moreRight, styles.row)}>
      										<div className={classes(styles.dateRow, styles.moreRight)}>
      												<DateTimePicker id={`fromDate`} label={<L p={p} t={`From date`}/>} value={filter.fromDate} maxDate={filter.toDate}
      														required={true} whenFilled={filter.fromDate || filter.toDate}
      														onChange={(event) => changeDate('fromDate', event)}/>
      										</div>
      										<div className={classes(styles.dateRow, styles.moreTop, styles.muchRight)}>
      												<DateTimePicker id={`toDate`} value={filter.toDate} label={<L p={p} t={`To date (optional)`}/>} minDate={filter.fromDate ? filter.fromDate : ''}
      														onChange={(event) => changeDate('toDate', event)}/>
      										</div>
      								</div>
  										<div onMouseOver={handlePrintOpen} onMouseOut={handlePrintClose} className={styles.moveUpLittle}>
  												<ReactToPrint trigger={() => <a href="#" className={classes(styles.moveDownRight, styles.link, styles.row)}><Icon pathName={'printer'} premium={true} className={styles.icon}/><L p={p} t={`Print`}/></a>} content={() => componentRef}/>
  										</div>
  								</div>
  								<hr/>
                  <Loading isLoading={fetchingRecord.galleryList} />
                  <div ref={el => (componentRef = el)} className={classes(styles.centered, styles.componentPrint, styles.maxWidth)}>
      								{galleryList && galleryList.length > 0 && galleryList.map((m, i) =>
                          <GalleryImageDisplay url={m.fileUrl} deleteFunction={removeImage} isOwner={personId === m.entryPersonId} onClick={handleCommentListOpen}
                              keyIndex={i} description={m.description} handleCommentListOpen={handleCommentListOpen}/>
      								)}
                  </div>
  						</div>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Gallery Photos`}/>} path={'galleryList'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
              {isShowingModal_comment &&
  								<CommentListModal handleClose={handleCommentListClose} comments={comments}/>
  						}
          </div>
      )
}

export default GalleryListView
