import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as globalStyles from '../../utils/globalStyles.css'
import styles from './BenchmarkTestListMenu.css'
import classes from 'classnames'
import Icon from '../Icon'
import { withAlert } from 'react-alert'
import MessageModal from '../../components/MessageModal'
import MultiSelect from '../../components/MultiSelect'
import {guidEmpty} from '../../utils/guidValidate'
const p = 'component'
import L from '../../components/PageLanguage'

function BenchmarkTestListMenu(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isInit, setIsInit] = useState(true)
  const [benchmarkTestId, setBenchmarkTestId] = useState(benchmarkTest.benchmarkTestId)
  const [selectedSharedTeachers, setSelectedSharedTeachers] = useState(undefined)
  const [isShowingModal_delete, setIsShowingModal_delete] = useState(true)
  const [localModalOpen, setLocalModalOpen] = useState(true)
  const [isShowingModal_share, setIsShowingModal_share] = useState(true)
  const [isShowingModal_rateTest, setIsShowingModal_rateTest] = useState(true)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {benchmarkTest={}} = props
    				
    				if (benchmarkTest.benchmarkTestId && benchmarkTestId !== benchmarkTest.benchmarkTestId) {
    						let selectedSharedTeachers = benchmarkTest.sharedTeachers && benchmarkTest.sharedTeachers.length > 0 && benchmarkTest.sharedTeachers.reduce((acc, m) => acc && acc.length > 0 ? acc.concat(m.id) : [m.id], [])
    						setIsInit(true); setSelectedSharedTeachers(selectedSharedTeachers); setBenchmarkTestId(benchmarkTest.benchmarkTestId)
    
    				}
    		
  }, [])

  const {personId, className="", benchmarkTest={}, facilitators, addOrUpdateBenchmarkTestOpen, ownerPersonId, assessmentId,
  								modalOpen} = props
  				
  
  				let hasRecordChosen = benchmarkTestId && benchmarkTestId !== guidEmpty ? true : false
  
          return (
              <div className={classes(styles.container, className)}>
  								{personId === ownerPersonId &&
  										<a onClick={!hasRecordChosen ? chooseBenchmarkTest : () => navigate(`/assessmentQuestions/${assessmentId}`)}
  														data-rh={'Add or modify the test questions'}>
  												<Icon pathName={'list3'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
  										</a>
  								}
  								{personId !== ownerPersonId &&
  										<a onClick={!hasRecordChosen ? chooseBenchmarkTest : () => handleRateTestOpen(benchmarkTestId)}
  														data-rh={'Rate the chosen benchmark test'}>
  												<Icon pathName={'medal_first'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
  										</a>
  								}
  								<a onClick={!hasRecordChosen ? chooseBenchmarkTest : () => addOrUpdateBenchmarkTestOpen('edit')}
  												data-rh={'Edit benchmark test'}>
  										<Icon pathName={'pencil0'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
  								</a>
  								<a onClick={() => addOrUpdateBenchmarkTestOpen('add')} data-rh={'Add a benchmark test'}>
  										<Icon pathName={'plus'} fillColor={'green'} className={classes(styles.image, styles.moreTopMargin)}/>
  								</a>
  								<a onClick={!hasRecordChosen ? chooseBenchmarkTest : () => navigate(`/benchmarkTestLibrary`)}
  												data-rh={'Choose a benchmark test from the library'}>
  										<Icon pathName={'books_library'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
  								</a>
  								<a onClick={!hasRecordChosen ? chooseBenchmarkTest : () => navigate(`/benchmarkTestClassComparison/${benchmarkTestId}`)}
  												data-rh={'Compare benchmark tests between classes'}>
  										<Icon pathName={'equalizer'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
  								</a>
  								<a onClick={!hasRecordChosen ? chooseBenchmarkTest : handleDeleteOpen} data-rh={'Delete this benchmarkTest'}>
  										<Icon pathName={'trash2'} premium={true} fillColor={hasRecordChosen ? 'maroon' : ''}
  												className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))} />
  								</a>
  								{hasRecordChosen && !modalOpen && !localModalOpen &&
  										<div className={styles.multiSelect} data-rh={'Share this test with one or more teachers'}>
  												<MultiSelect
  														name={'selectedSharedTeachers'}
  														options={facilitators || []}
  														onSelectedChanged={handleSelectedSharedTeachers}
  														valueRenderer={facilitatorsValueRenderer}
  														getJustCollapsed={() => {}}
  														selected={selectedSharedTeachers || []}/>
  										</div>
  								}
  								{isShowingModal_delete &&
  		                <MessageModal handleClose={handleDeleteClose} heading={<L p={p} t={`Remove this benchmarkTest?`}/>}
  		                   explainJSX={<L p={p} t={`Are you sure you want to remove this benchmarkTest? Access to any homeowrk and grades turned in for this homework will be lost.`}/>} isConfirmType={true}
  		                   onClick={handleDelete} />
  		            }
              </div>
          )
}

export default withAlert(BenchmarkTestListMenu)
