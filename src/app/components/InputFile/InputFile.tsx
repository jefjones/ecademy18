
import styles from './InputFile.css'
import classes from 'classnames'
import MessageModal from '../MessageModal'
import Required from '../Required'
import ImageTools from '../../utils/ImageTools'
const p = 'component'
import L from '../../components/PageLanguage'

function InputFile(props) {
  const setFile = (event) => {
    
    			const {onChange, isResize} = props
    			if (isResize) {
    					let fileName = event.target.files && event.target.files.length > 0 && event.target.files[0] && event.target.files[0].name
    					ImageTools.resize(event.target.files[0], {
    			        width: 320, // maximum width
    			        height: 240 // maximum height
    			    }, (blob, didItResize) => {
    							blob.fileName = fileName
    							//blob.name = fileName;  Can't write to a read-only value.
    							onChange(blob)
    					})
    			} else {
    					event.target.files && event.target.files.length > 0 && onChange(event.target.files[0])
    			}
    	
  }

  const {id, name, label, error, className="", instructions, instructionsBelow, labelClass, required=false, whenFilled, boldText,
  							isCamera, accept} = props
  
  		  return (
  		    <div className={classes(styles.container, className)}>
  		        <div className={styles.row}>
  		            {label && <span htmlFor={name} className={classes(styles.label, labelClass, required ? styles.lower : '')}>{label}</span>}
  		            <Required setIf={required} setWhen={whenFilled}/>
  		        </div>
  						<div className={instructionsBelow ? styles.column : styles.row}>
  								<input
  										id={name || id}
  										name={name || id}
  										type={"file"}
  										accept={isCamera ? "image/*" : accept}
  										capture={"camera"}
  										onChange={setFile}
  										className={classes(styles.fileInput, (boldText ? styles.bold : ''))} />
  		            <span className={styles.instructions}>{instructions}</span>
  		        </div>
  		        {error && <div className={styles.alertMessage}>{error}</div>}
  						{isShowingModal_greaterThan &&
  								<MessageModal handleClose={handleGreaterThanMaxClose} heading={<L p={p} t={`Text length limit`}/>}
  									 explainJSX={<L p={p} t={`The text you entered is onger than the maximum allowed.`}/>} onClick={handleGreaterThanMaxClose} />
  	          }
  		    </div>
  		  )
}
export default InputFile
