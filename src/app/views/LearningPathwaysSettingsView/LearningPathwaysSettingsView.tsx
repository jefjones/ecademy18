import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './LearningPathwaysSettingsView.css'
const p = 'LearningPathwaysSettingsView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import InputText from '../../components/InputText'
import Icon from '../../components/Icon'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import OneFJefFooter from '../../components/OneFJefFooter'

function LearningPathwaysSettingsView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [learningPathwayId, setLearningPathwayId] = useState('')
  const [learningPathway, setLearningPathway] = useState({
        name: '',
        description: '',
      })
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({
        name: '',
        description: '',
      })
  const [p, setP] = useState(undefined)
  const [isShowingModal_usedIn, setIsShowingModal_usedIn] = useState(undefined)
  const [listUsedIn, setListUsedIn] = useState(undefined)

  useEffect(() => {
    
        //document.getElementById('name').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
      
  }, [])

  const handleChange = (event) => {
    
    	    const field = event.target.name
    	    let learningPathway = learningPathway
    	    let errors = Object.assign({}, errors)
    	    learningPathway[field] = event.target.value
    	    errors[field] = ''
    
    	    setLearningPathway(learningPathway); setErrors(errors)
      
  }

  const processForm = (stayOrFinish) => {
    
          const {addOrUpdateLearningPathway, personId} = props
          
          let hasError = false
    
          if (!learningPathway.name) {
              hasError = true
              setErrors({ ...errors, name: <L p={p} t={`Code is required`}/> })
          }
    
    			if (!learningPathway.description) {
              hasError = true
              setErrors({ ...errors, description: <L p={p} t={`Name is required`}/> })
          }
    
          if (!hasError) {
              addOrUpdateLearningPathway(personId, learningPathway)
              setLearningPathway({
                      name: '',
                      description: '',
                  })
    					if (stayOrFinish === "FINISH") {
    		          navigate(`/schoolSettings`)
    		      }
          }
      
  }

  const handleShowUsedInOpen = (usedIn) => {
    
    	
  }

  const handleShowUsedInClose = () => {
    return setIsShowingModal_usedIn(false); setListUsedIn([])
    
    			if (usedIn && usedIn.length > 0) {
    					handleShowUsedInOpen(usedIn)
  }

  const handleRemoveItemOpen = (learningPathwayId, usedIn) => {
    
    			if (usedIn && usedIn.length > 0) {
    					handleShowUsedInOpen(usedIn)
    			} else {
    					setIsShowingModal_remove(true); setLearningPathwayId(learningPathwayId)
    			}
    	
  }

  const handleRemoveItemClose = () => {
    return setIsShowingModal_remove(false)

  }
  }
  const handleRemoveItem = () => {
    
          const {removeLearningPathway, personId} = props
          
          removeLearningPathway(personId, learningPathwayId)
          handleRemoveItemClose()
      
  }

  const handleEdit = (learningPathwayId) => {
    
    			const {learningPathways} = props
    			if (learningPathway && learningPathway.name)
    					setLearningPathway(learningPathway)
    	
  }

  const {learningPathways, fetchingRecord} = props
      
  
      let headings = [{}, {},
  			{label: 'Code', tightText: true},
  			{label: 'Name', tightText: true},
  			{label: 'Used In', tightText: true}]
  
      let data = []
  
      if (learningPathways && learningPathways.length > 0) {
          data = learningPathways.map(m => {
              return ([
  							{value: <a onClick={() => handleEdit(m.learningPathwayId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
                {value: <a onClick={() => handleRemoveItemOpen(m.learningPathwayId, m.usedIn)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
  							{value: m.name},
  							{value: m.description},
                {value: m.usedIn && m.usedIn.length, clickFunction: () => handleShowUsedInOpen(m.usedIn)},
              ])
          })
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Discipline (Content Areas) Settings`}/>
              </div>
  						<InputText
  								id={`name`}
  								name={`name`}
  								size={"medium"}
  								label={<L p={p} t={`Code`}/>}
  								value={learningPathway.name || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={learningPathway.name}
  								error={errors.name} />
  						<InputText
  								id={`description`}
  								name={`description`}
  								size={"long"}
  								label={<L p={p} t={`Name`}/>}
  								value={learningPathway.description || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={learningPathway.description} />
              <div className={styles.rowRight}>
  								<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
              </div>
              <hr />
              <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.learningPathwaySettings}
                  data={data} noCount={true} firstColumnClass={styles.firstColumnClass} sendToReport={handlePathLink}/>
              <hr />
              <OneFJefFooter />
              {isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this discipline (content area)?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this discipline (content area)?`}/>} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
  						{isShowingModal_usedIn &&
                  <MessageModal handleClose={handleShowUsedInClose} heading={<L p={p} t={`This Discipline is used in these Courses`}/>}
  										explainJSX={<L p={p} t={`In order to delete this discipline, please reassign the following courses with a different discipline setting:<br/><br/>`}/> + listUsedIn}
  										onClick={handleShowUsedInClose}/>
              }
        </div>
      )
}
export default LearningPathwaysSettingsView
