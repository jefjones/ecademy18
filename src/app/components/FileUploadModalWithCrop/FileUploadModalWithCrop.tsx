// import React, {Component} from 'react';
// import * as styles from './FileUploadModalWithCrop.css';
// import * as globalStyles from '../../utils/globalStyles.css';
// import {image64toCanvasRef, extractImageFileExtensionFromBase64, base64StringtoFile} from '../../utils/javascriptUtils';
// import InputFile from '../InputFile';
// import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index';
// import ReactCrop from 'react-image-crop';
// const acceptedFileTypes = 'images/x-png, image/png, image/jpg, image/jpeg, image/gif'
// const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => {return item.trim()})
// const imageMaxSize = 1000000000; //bytes
// const p = 'component';
// import L from '../../components/PageLanguage';
//
// export default class extends Component {
//     constructor ( props ) {
//     super( props );
//
// 		this.imagePreviewCanvasRef = React.createRef()
// 		this.fileInputRef = React.createRef()
//
//     this.state = {
// 				imgSrc: null,
// 				crop: {
// 						aspect: 1/1
// 				}
//     }
// 	}
//
// 	verifyFile = (currentFile) => {
// 			const currentFileType = currentFile.type
// 			const currentFileSize = currentFile.size
// 			if (currentFileSize > imageMaxSize) {
// 					alert(<L p={p} t={`This file is too large: ${currentFileSize} bytes.`}/>)
// 					return false
// 			}
// 			if (! acceptedFileTypesArray.includes(currentFileType)) {
// 					alert(<L p={p} t={`Only image file types are allowed.`}/>)
// 					return false
// 			}
// 			return true
// 	}
//
// 	handleInputFile = (currentFile) => {
// 			const {handleInputFile} = this.props;
// 			const isVerified = this.verifyFile(currentFile)
// 			if (isVerified) {
// 					const reader = new FileReader()
// 					reader.addEventListener("load", () => {
// 							this.setState({ imgSrc: reader.result })
// 					}, false);
// 					reader.readAsDataURL(currentFile)
// 					handleInputFile(currentFile);
//
// 					// const img = this.imageViewer;
// 					// const reader = new FileReader();
// 					// reader.onloadend = function() {
// 					// 		img.src = reader.result;
// 					// }
// 					// reader.readAsDataURL(files);
// 					// this.questionFile.after(img);
// 			}
// 	}
//
// 	handleImageLoaded = (image) => {
// 			return false;
// 	}
//
// 	handleOnCropChange = (crop) => {
// 		console.log('crop', crop);
// 		this.setState({ crop });
// 	}
//
// 	handleOnCropComplete = (crop, pixelCrop) => {
// 			const canvasRef = this.imagePreviewCanvasRef.current
// 			image64toCanvasRef(canvasRef, imgSrc, pixelCrop)
// 	}
//
// 	handleSaveClick = (event) => {
// 			event.preventDefault();
// 			const {submitFileUpload, handleInputFile} = this.props;
// 			if (imgSrc) {
// 					const fileExtension = extractImageFileExtensionFromBase64(imgSrc)
// 					const canvasRef = this.imagePreviewCanvasRef.current
// 					const imageData64 = canvasRef.toDataURL('image/' + fileExtension)
// 					const myFilename = "previewFile." + fileExtension;
// 					const myNewCroppedFile = base64StringtoFile(imageData64, myFilename)
// 					handleInputFile(myNewCroppedFile);
// 					submitFileUpload();
// 					//downloadBase64File(imageData64, myFilename)
// 			}
// 	}
//
// 	handleFileSelect = event => {
//          // console.log(event)
//          const files = event.target.files
//          if (files && files.length > 0){
//                const isVerified = true; //this.verifyFile(files)
//               if (isVerified){
//                   // imageBase64Data
//                   const currentFile = files[0]
//                   const myFileItemReader = new FileReader()
//                   myFileItemReader.addEventListener("load", ()=>{
//                       // console.log(myFileItemReader.result)
//                       const myResult = myFileItemReader.result
//                       this.setState({
//                           imgSrc: myResult,
//                           imgSrcExt: extractImageFileExtensionFromBase64(myResult)
//                       })
//                   }, false)
//
//                   myFileItemReader.readAsDataURL(currentFile)
//
//               }
//          }
//      }
//
// 	render() {
//       const {handleClose, title, handleCancelFile} = this.props;
// 			const {imgSrc, crop} = this.state;
//       return (
//         <div className={styles.container}>
//             <ModalContainer onClose={handleClose}>
//                 <ModalDialog onClose={handleClose}>
//                     <form method="post" encType="multipart/form-data" className={styles.form}>
//                         <div className={globalStyles.pageTitle}>
//                             {title}
//                         </div>
// 												{imgSrc !== null
// 														?  <div>
// 																	<ReactCrop
// 																			src={imgSrc}
// 																			crop={crop}
// 																			onImageLoaded={this.handleImageLoaded}
// 																			onComplete={this.handleOnCropComplete}
// 																			onChange={this.handleOnCropChange}/>
// 																	<p><L p={p} t={`Preview Canvas Crop`}/></p>
// 																	<canvas ref={this.imagePreviewCanvasRef}></canvas>
// 															 </div>
// 														:  <input ref={this.fileInputRef} type='file' accept={acceptedFileTypes} multiple={false} onChange={this.handleFileSelect} />
// 												}
// 												<InputFile label={<L p={p} t={`Include a picture`}/>} multiple={false} isCamera={true} onChange={this.handleInputFile} isResize={true}
// 												 			 accept={acceptedFileTypes}/>
//                         <div className={styles.buttonDiv}>
//                             <a onClick={() => {handleClose(); handleCancelFile()}} className={styles.cancelLink}>Cance<L p={p} t={`Include a picture`}/>l</a>
//                             {true && //file &&
//                                 <a onClick={this.handleSaveClick} className={styles.buttonStyle}><L p={p} t={`Save`}/></a>
//                             }
//                         </div>
//                     </form>
//                 </ModalDialog>
//             </ModalContainer>
//         </div>
//     )}
// };


import * as styles from './FileUploadModalWithCrop.css'
import * as globalStyles from '../../utils/globalStyles.css'
import InputFile from '../InputFile'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
const p = 'component'
import L from '../../components/PageLanguage'

function FileUploadModalWithCrop(props) {
  const {handleClose, title, handleInputFile, file, submitFileUpload, handleCancelFile} = props
  
        return (
          <div className={styles.container}>
              <ModalContainer onClose={handleClose}>
                  <ModalDialog onClose={handleClose}>
                      <form method="post" encType="multipart/form-data" className={styles.form}>
                          <div className={globalStyles.pageTitle}>
                              {title}
                          </div>
  												<InputFile label={`Include a picture`} isCamera={false} onChange={handleInputFile} isResize={true}/>
                          <div className={styles.buttonDiv}>
                              <a onClick={() => {handleClose(); handleCancelFile()}} className={styles.cancelLink}><L p={p} t={`Cancel`}/></a>
                              {file &&
                                  <a onClick={submitFileUpload} className={styles.buttonStyle}><L p={p} t={`Save`}/></a>
                              }
                          </div>
                      </form>
                  </ModalDialog>
              </ModalContainer>
          </div>
      )
}
export default FileUploadModalWithCrop
