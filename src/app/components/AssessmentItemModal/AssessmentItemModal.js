import React, {Component} from 'react';
import {apiHost} from '../../api_host.js';
import axios from 'axios';
import styles from './AssessmentItemModal.css';
import globalStyles from '../../utils/globalStyles.css';
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index.js';
import classes from 'join-classnames';
import InputDataList from '../InputDataList';
import TextDisplay from '../TextDisplay';
import InputText from '../InputText';
import MessageModal from '../MessageModal';
import SelectSingleDropDown from '../SelectSingleDropDown';
import InputTextArea from '../InputTextArea';
import ImageDisplay from '../ImageDisplay';
import AssessmentEssayKeyword from '../AssessmentEssayKeyword';
import AssessmentAnswerVariation from '../AssessmentAnswerVariation';
import AssessmentMatching from '../AssessmentMatching';
import FileUploadModalWithCrop from '../FileUploadModalWithCrop';
import VoiceRecordingModal2 from '../../components/VoiceRecordingModal2';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import RadioGroup from '../RadioGroup';
import Checkbox from '../Checkbox';
import AudioDisplay from '../AudioDisplay';
import Icon from '../Icon';
import {guidEmpty} from '../../utils/guidValidate.js';
import MicRecorder from 'mic-recorder-to-mp3';
const recorder = new MicRecorder({ bitRate: 128 });
const p = 'component';
import L from '../../components/PageLanguage';

const alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

export default class AssessmentItemModal extends Component {
  constructor(props) {
      super(props);

      let question = props && props.assessmentItem && props.assessmentItem.assessmentQuestionId
          ? this.props.assessmentItem
          : {
              assessmentQuestionId: '',
              questionTypeCode: '',
              pointsPossible: '',
              learnerOutcomeList: [],
              questionText: '',
              answers: [],
              correctAnswer: '',
              keywordPhrases: '',
              keywordCountAccuracy: '',
							answerVariations: '',
							solutionText: '',
          };

      this.state = {
          file: {},
					multipleChoiceCorrectAnswer: '',
          isSubmitted: false,
          isFileChosen: false,
          openFileAttach: false,
					isShowingModal_keywordCount: false,
					isShowingModal_missingInfo: false,
					isShowingFileUpload: false,
					isShowingVoiceRecording: false,
          multipleChoiceAnswers: question && question.answers ? question.answers : [{answerText: ''}, {answerText: ''}, {answerText: ''}],
          multipleAnswerAnswers: question && question.answers ? question.answers : [{answerText: ''}, {answerText: ''}, {answerText: ''}],
          multipleCount: question && question.answers ? question.answers.length : 3,
          question,
					hasOrigUpdate: false,
					matchingEntries: 6,
          errors: {
	            questionTypeCode: '',
	            pointsPossible: '',
	            learnerOutcomeList: '',
	            questionText: '',
	            answers: '',
	            correctAnswer: '',
	            keywordPhrase: '',
	            keywordCountAccuracy: '',
          },
      }
  }

	componentDidMount() {
			const {assessmentItem} = this.props;
			this.setState({ question: assessmentItem });
			assessmentItem && assessmentItem.questionTypeCode === 'FILLBLANK' && this.blankOutWord(null, assessmentItem); //This is to set the fillBlanksChosen variable.
	}

	componentDidUpdate() {
			let assessmentItem = Object.assign({}, this.props.assessmentItem);
			const {question} = this.state;
			if (!this.state.isInit && assessmentItem && assessmentItem.assessmentQuestionId && question.assessmentQuestionId) {
					assessmentItem.questionTypeCode === 'FILLBLANK' && this.blankOutWord(null, assessmentItem); //This is to set the fillBlanksChosen variable.
					if (assessmentItem.standards && assessmentItem.standards.length > 0) {
							assessmentItem['standardIds'] = assessmentItem.standards.reduce((acc, m) => acc && acc.length ? acc.concat(m.id) : [m.id], []);
					}
					this.setState({ question: assessmentItem, standardIds: assessmentItem.standards, isInit: true });
			}
	}

  toggleFileAttach = () => this.setState({ openFileAttach: !this.state.openFileAttach });

  changeItem = ({target}) => {
      let question = Object.assign({}, this.state.question);
			if (!question) {
					question  = {
	              assessmentQuestionId: '',
	              questionTypeCode: '',
        	      pointsPossible: '',
	              learnerOutcomeList: [],
        	      questionText: '',
	              answers: [],
        	      correctAnswer: '',
	              keywordPhrases: '',
        	      keywordCountAccuracy: '',
								answerVariations: '',
								solutionText: '',
					}
      }
			question[target.name] = target.value;
			if (target.name === 'questionText') question['fillBlankPhrase'] = target.value;
      this.setState({ question, hasOrigUpdate: true });
  }

  processForm = () => {
      const {handleSubmit, handleClose, gradingType}  = this.props;
      const {question, selectedFile_question, selectedRecording_question} = this.state;
			let missingInfoMessage = [];

      if (!question.questionTypeCode) {
          this.setState({ errors: { ...this.state.errors, questionTypeCode: <L p={p} t={`Question type is required`}/>}});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Question type`}/></div>
      }
      if (!question.pointsPossible && question.questionTypeCode !== 'PASSAGE') {
          this.setState({ errors: { ...this.state.errors, pointsPossible: 'Points are required'}});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Points`}/></div>
      }
      if (((question.questionTypeCode === 'FILLBLANK' && !question.questionText)
							|| (!question.questionText && !selectedFile_question && !selectedRecording_question && question.questionTypeCode !== 'MATCHING'))) {
          this.setState({ errors: { ...this.state.errors, questionText: 'Question text is required'}});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Question text`}/></div>
      }
			if (question.questionTypeCode === 'ESSAY' && question.keywordPhrases && question.keywordPhrases.length > 0 && !question.keywordCountAccuracy) {
          this.handleKeywordCountOpen();
      }
      if (question.questionTypeCode !== 'ESSAY' && question.questionTypeCode !== 'PICTURERESPONSE' && question.questionTypeCode !== 'PASSAGE' && question.questionTypeCode !== 'MATCHING' && question.questionTypeCode !== 'FILLBLANK') {
					let hasCorrectAnswer = false;
					if (question.questionTypeCode === 'TRUEFALSE' || question.questionTypeCode === 'SINGLEENTRY') {
							hasCorrectAnswer = !question.correctAnswer || question.correctAnswer.length === 0 ? false : true;
					} else {
							hasCorrectAnswer =  question.answers && question.answers.length > 0 && question.answers.filter(m => m.isCorrect)[0] ? true : false;
					}
					if (!hasCorrectAnswer) {
		          this.setState({ errors: { ...this.state.errors, correctAnswer: 'Correct answer is required'}});
							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Correct answer`}/></div>
					}
      }
			if (question.questionTypeCode === 'FILLBLANK' && (!question.correctAnswer || question.correctAnswer.length === 0)) {
          this.setState({ errors: { ...this.state.errors, correctAnswer: 'Choose at least one blank'}});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Choose at least one blank`}/></div>
      }

			if (question.questionTypeCode === 'MATCHING' && this.validateMatching() !== '') {
					missingInfoMessage = this.validateMatching();
			}

			if (gradingType === 'STANDARDSRATING' && question.questionTypeCode !== 'PASSAGE' && (!question.standardIds || question.standardIds.length === 0)) {
	        this.setState({errorTotalPoints: "You must choose at least one standard" });
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`At least one standard`}/></div>
      }

      if (missingInfoMessage && missingInfoMessage.length > 0) {
					this.handleMissingInfoOpen(missingInfoMessage);
			} else {
				  //It is possible that the keywordCountAccuracy changed by force due to the change of the keywordPhrases.  It can even be blank.
					//So we are going to force the keywordcountAccuracy here if this is an Essay assessment question.
					//This will also help to make sure that the student has a chance at the question to be graded because if the count is higher than
					//	the actual number of keywordPhrases, they will never have a chance to get 100%.
					if (question.questionTypeCode === 'ESSAY') {
							let keywordPhraseCount = question.keywordPhrases && question.keywordPhrases.length ? question.keywordPhrases && question.keywordPhrases.length : 0;
							if (Number(question.keywordCountAccuracy) > keywordPhraseCount) question.keywordCountAccuracy = keywordPhraseCount;
					}
          handleSubmit(question);
          handleClose();
      }
  }
  
   

	validateMatching = () => {
			//1. See if there are any blanks from the highest index of the correctAnswers, questionText(s) and toMatchText(s)
			//2. See if there are any duplicate answers and provide that message.
			//3. See if there are any answers that don't have a toMatchText entry.
			const {question={}} = this.state;
			let missingInfoMessage = '';
			let maxIndex = question.correctAnswer &&  question.correctAnswer.length-1;
			if (question.questionText && question.questionText.length > 0 && question.questionText.length-1 > maxIndex) maxIndex = question.questionText &&  question.questionText.length-1;
			if (question.toMatchText && question.toMatchText.length > 0 && question.toMatchText.length-1 > maxIndex) maxIndex = question.toMatchText &&  question.toMatchText.length-1;

			//1. See if there are any blanks from the highest index of the correctAnswers, questionText(s) and toMatchText(s)
			for(let i = 0; i < maxIndex; i++) {
          if (question.correctAnswer[i] || question.questionText[i] || question.toMatchText[i]) {
    					if (!question.correctAnswer[i] || question.correctAnswer[i] === '' || question.correctAnswer[i] === '-1')
    							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`An answer is missing`}/></div>
    					if (!question.questionText[i] || question.questionText[i] === '' || question.questionText[i] === '-1')
    							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`A left entry is missing`}/></div>
    					if (!question.toMatchText[i] || question.toMatchText[i] === '' || question.toMatchText[i] === '-1')
    							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`A right entry is missing`}/></div>
          }
			}

			//2. See if there are any duplicate answers and provide that message.
			let hasDuplicate = false;
			for(let i = 0; i <= maxIndex; i++) {
					if (question && question.correctAnswer && question.correctAnswer[i] && question.correctAnswer[i] !== '0') {
							let indexValue = question.correctAnswer[i];
							if (question.correctAnswer.indexOf(indexValue) > -1 && question.correctAnswer.indexOf(indexValue) !== i) hasDuplicate = true;
					}
			}
			if (hasDuplicate) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Duplicate answer`}/></div>

			//3. See if there are any answers that don't have a toMatchText entry.
			let hasNoAnswerEntry = false;
			for(let i = 0; i <= maxIndex; i++) {
					if (question.correctAnswer && question.correctAnswer.length > 0 && question.correctAnswer[i] && question.correctAnswer[i] !== '0') {
							let chosenAnswerIndex = alpha.indexOf(question.correctAnswer[i])
							let indexValue = question.toMatchText[chosenAnswerIndex];
							if (!indexValue) hasNoAnswerEntry = true;
					}
			}
			if (hasNoAnswerEntry) missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`An answer chosen has blank text`}/></div>;

			return missingInfoMessage;
	}

  handleTrueFalse = (value) => {
      let question = Object.assign({}, this.state.question);
      question['correctAnswer'] = value;
      this.setState({ question });
  }

  handleMultipleChoiceAnswer = ({target}, index) => {
	    let multipleChoiceAnswers = Object.assign([], this.state.multipleChoiceAnswers);
			if (!multipleChoiceAnswers[index]) {
					for(var i = 0; i <= index; i++) {
							if (!multipleChoiceAnswers[i]) {
									multipleChoiceAnswers = multipleChoiceAnswers && multipleChoiceAnswers.length > 0
											? multipleChoiceAnswers.concat({sequence: i})
											: [{sequence: i}];
							}
					}
			}
			multipleChoiceAnswers[index].answerText = target.value;
	    this.setState({ question: { ...this.state.question, answers: multipleChoiceAnswers }, multipleChoiceAnswers});
  }

	handleRemoveMultipleChoiceAnswer = (index) => {
			const {removeAnswerOption, assessmentQuestionId} = this.props;
			removeAnswerOption(assessmentQuestionId, index);
	}

  handleMultipleChoiceCorrectAnswer = ({target}) => {
		let multipleChoiceAnswers = Object.assign([], this.state.multipleChoiceAnswers);
		//Clear all of the answers' correct setting, if any, to start with and then let the new one be chosen independently below
		multipleChoiceAnswers = multipleChoiceAnswers && multipleChoiceAnswers.length > 0 && multipleChoiceAnswers.map(m => {
				m.isCorrect = false;
				return m;
		});
		if (!multipleChoiceAnswers[target.value]) {
				let index = Number(target.value);
				for(var i = 0; i <= index; i++) {
						if (!multipleChoiceAnswers[i]) {
								multipleChoiceAnswers = multipleChoiceAnswers && multipleChoiceAnswers.length > 0
										? multipleChoiceAnswers.concat(index === i ? {isCorrect: true, sequence: i} : {sequence: i})
										: [index === i ? {isCorrect: true, sequence: i} : {sequence: i}];
						}
				}
		} else {
				multipleChoiceAnswers[target.value].isCorrect = true;
		}
		this.setState({ question: { ...this.state.question, answers: multipleChoiceAnswers }, multipleChoiceAnswers});
  }

  handleMultipleAnswerAnswer = ({target}) => {
			let multipleAnswerAnswers = Object.assign([], this.state.multipleAnswerAnswers);
			let index = alpha.indexOf(target.name);
			if (!multipleAnswerAnswers[alpha.indexOf(target.name)]) {
					for(var i = 0; i <= index; i++) {
							if (!multipleAnswerAnswers[i]) {
									multipleAnswerAnswers = multipleAnswerAnswers && multipleAnswerAnswers.length > 0
											? multipleAnswerAnswers.concat({sequence: i})
											: [{sequence: i}];
							}
					}
			}
			multipleAnswerAnswers[alpha.indexOf(target.name)].answerText = target.value;
			multipleAnswerAnswers[alpha.indexOf(target.name)].sequence = index;
			this.setState({ question: { ...this.state.question, answers: multipleAnswerAnswers }, multipleAnswerAnswers});
  }

  handleMultipleAnswerCorrectAnswer = ({target}) => {
			let multipleAnswerAnswers = Object.assign([], this.state.multipleAnswerAnswers);
			if (!multipleAnswerAnswers[target.value]) {
					let index = Number(target.value);
					for(var i = 0; i <= index; i++) {
							if (!multipleAnswerAnswers[i]) {
									multipleAnswerAnswers = multipleAnswerAnswers && multipleAnswerAnswers.length > 0
											? multipleAnswerAnswers.concat(index === i
													? {isCorrect: true, sequence: i}
													: {sequence: i})
											: [index === i
													? {isCorrect: true, sequence: i}
													: {sequence: i}];
							}
					}
			} else {
					multipleAnswerAnswers[target.value].isCorrect = multipleAnswerAnswers[target.value].isCorrect ? !multipleAnswerAnswers[target.value].isCorrect : true;
			}
			this.setState({ question: { ...this.state.question, answers: multipleAnswerAnswers }, multipleAnswerAnswers});
  }

	handleMatchingCorrectAnswers = (event, index) => {
			let question = Object.assign([], this.state.question);
			let correctAnswer = question && question.correctAnswer ? question.correctAnswer : [];
			correctAnswer[index] = event.target.value;
			question.correctAnswer = correctAnswer;
			this.setState({ question })
	}

	handleMatchingQuestionText = (event, index) => {
			let question = Object.assign([], this.state.question);
			let questionText = question && question.questionText ? question.questionText : [];
			questionText[index] = event.target.value;
			question.questionText = questionText;
			this.setState({ question })
	}

	handleMatchingToMatchText = (event, index) => {
			let question = Object.assign([], this.state.question);
			let toMatchText = question && question.toMatchText ? question.toMatchText : [];
			toMatchText[index] = event.target.value;
			question.toMatchText = toMatchText;
			this.setState({ question })
	}

	removeMatchingRemoveLine = (removeIndex) => {
			let question = Object.assign([], this.state.question);
			if (question.correctAnswer && question.correctAnswer.length >= removeIndex+1) question.correctAnswer.splice(removeIndex, 1);
			if (question.questionText && question.questionText.length >= removeIndex+1) question.questionText.splice(removeIndex, 1);
			if (question.toMatchText && question.toMatchText.length >= removeIndex+1) question.toMatchText.splice(removeIndex, 1);
			this.setState({ question });
	}

  incrementMultipleCount = () => {
			const {multipleCount} = this.state;
      let newCount = multipleCount >= 3 ? multipleCount : 3
	    newCount++;
	    this.setState({ multipleCount: newCount });
  }

	handleAddKeywordPhrase = (keywordPhrase) => {
			let question = Object.assign({}, this.state.question);
			if (!question.keywordPhrases || !question.keywordPhrases.length === 0 || question.keywordPhrases.indexOf(keywordPhrase) === -1) {
					let keywordPhrases = question && question.keywordPhrases ? question.keywordPhrases : [];
					keywordPhrases = keywordPhrases ? keywordPhrases.concat(keywordPhrase) : [keywordPhrase];
					question.keywordPhrases = keywordPhrases;
					this.setState({ question });
			}
	}

	handleRemoveKeywordPhrase = (keywordIndex) => {
			let question = Object.assign({}, this.state.question);
			question.keywordPhrases.splice(keywordIndex, 1);
			this.setState({ question });
	}

	handleKeywordCountOpen = () => this.setState({isShowingModal_keywordCount: true})
	handleKeywordCountClose = () => this.setState({isShowingModal_keywordCount: false})
	handleKeywordCountSave = () => {
			const {handleSubmit, handleClose} = this.props;
			const {question} = this.state;
			handleSubmit(question);
			handleClose();
	}

	handleAddAnswerVariation = (answerVariation) => {
			let question = Object.assign({}, this.state.question);
			if (!question.answerVariations || !question.answerVariations.length === 0 || question.answerVariations.indexOf(answerVariation) === -1) {
					let answerVariations = question && question.answerVariations ? question.answerVariations : [];
					answerVariations = answerVariations ? answerVariations.concat(answerVariation) : [answerVariation];
					question.answerVariations = answerVariations;
					this.setState({ question });
			}
	}

	handleRemoveAnswerVariation = (variationIndex) => {
			let question = Object.assign({}, this.state.question);
			question.answerVariations.splice(variationIndex, 1);
			this.setState({ question });
	}

	handleFileUploadOpen = (isQuestionFile, answerIndex, isSolutionFile, isMatchingFile) => this.setState({isShowingFileUpload: true, isQuestionFile, answerIndex, isSolutionFile, isMatchingFile })
	handleFileUploadClose = () => this.setState({isShowingFileUpload: false, isQuestionFile: '', answerIndex: '', isSolutionFile: '', isMatchingFile: ''})
	handleFileUploadSubmit = () => {
			const {personId, assessmentId} = this.props;
			const {question, selectedFile_question, selectedFile_solution, isQuestionFile, answerIndex, isSolutionFile, isMatchingFile} = this.state;
			let data = new FormData();
			data.append('file', isQuestionFile
					? selectedFile_question
					: isSolutionFile
							? selectedFile_solution
							: isMatchingFile
									? question.matches && question.matches.length > 0 && question.matches[answerIndex].file
									: question.answers && question.answers.length > 0 && question.answers[answerIndex].file)

			let url = isQuestionFile
					? `${apiHost}ebi/assessmentQuestions/addQuestionFile/${personId}/${assessmentId}/${question.assessmentQuestionId || guidEmpty}/${question.questionTypeCode}/${encodeURIComponent(question.questionText || 'EMPTY')}`
					: isSolutionFile
							? `${apiHost}ebi/assessmentQuestions/addSolutionFile/${personId}/${assessmentId}/${question.assessmentQuestionId || guidEmpty}/${question.questionTypeCode}/${encodeURIComponent(question.questionText || 'EMPTY')}`
							: isMatchingFile
									? `${apiHost}ebi/assessmentQuestions/addToMatchFile/${personId}/${assessmentId}/${answerIndex}/${question.assessmentQuestionId || guidEmpty}/${question.questionTypeCode}`
									: `${apiHost}ebi/assessmentQuestions/addAnswerFile/${personId}/${assessmentId}/${answerIndex}/${question.assessmentQuestionId || guidEmpty}/${question.questionTypeCode}`

			axios.post(url, data,
					{
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
							'Access-Control-Allow-Credentials' : 'true',
							"Access-Control-Allow-Origin": "*",
							"Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
							"Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
							"Authorization": "Bearer " + localStorage.getItem("authToken"),
					}})
					.catch(function (error) {
						//Show error here.
				  })
					.then(response => {
							let question = Object.assign({}, this.state.question);
							if (!question || !question.assessmentQuestionId || question.assessmentQuestionId === guidEmpty) {
									question.assessmentQuestionId = response.data.assessmentQuestionId;
									this.setState({ question });
							}
					})
			this.handleFileUploadClose();
	}

	startRecording = () => {
    recorder.start().then(() => {
    }).catch((e) => {
      console.error(e);
    });
		this.setState({ onTheAir: true })
  }

  stopRecording = () => {
    recorder.stop().getMp3().then(([buffer, blob]) => {
			const {question, isQuestionFile, answerIndex, isSolutionFile, isMatchingFile} = this.state;
			if (isQuestionFile) {
					this.setState({ selectedRecording_question: blob, blobUrl: window.URL.createObjectURL(blob), onTheAir: false })
			} else if (isSolutionFile) {
					this.setState({ selectedRecording_solution: blob, blobUrl: window.URL.createObjectURL(blob), onTheAir: false })
			} else if (isMatchingFile) {
					this.setState({ selectedRecording_toMatch: blob, blobUrl: window.URL.createObjectURL(blob), onTheAir: false })
			} else {
					if (question && (question.questionTypeCode === 'MULTIPLEANSWER')) {
							let multipleAnswerAnswers = Object.assign([], this.state.multipleAnswerAnswers);
							if (!multipleAnswerAnswers[answerIndex]) {
									for(let i = 0; i <= answerIndex; i++) {
											if (!multipleAnswerAnswers[i]) {
													multipleAnswerAnswers = multipleAnswerAnswers && multipleAnswerAnswers.length > 0
															? multipleAnswerAnswers.concat({sequence: i})
															: [{sequence: i}];
											}
									}
							}
							multipleAnswerAnswers[answerIndex].recording = blob;
							this.setState({
									question: { ...this.state.question, answers: multipleAnswerAnswers },
									multipleAnswerAnswers,
									blobUrl: window.URL.createObjectURL(blob),
									onTheAir: false
							});
					} else if (question && question.questionTypeCode === 'MULTIPLECHOICE') {
							let multipleChoiceAnswers = Object.assign([], this.state.multipleChoiceAnswers);
							if (!multipleChoiceAnswers[answerIndex]) {
									for(let i = 0; i <= answerIndex; i++) {
											if (!multipleChoiceAnswers[i]) {
													multipleChoiceAnswers = multipleChoiceAnswers && multipleChoiceAnswers.length > 0
															? multipleChoiceAnswers.concat({sequence: i})
															: [{sequence: i}];
											}
									}
							}
							multipleChoiceAnswers[answerIndex].recording = blob;
							this.setState({
									question: { ...this.state.question, answers: multipleChoiceAnswers },
									multipleChoiceAnswers,
									blobUrl: window.URL.createObjectURL(blob),
									onTheAir: false
							});
					} else if (question && question.questionTypeCode === 'MATCHING') {
							if (!isMatchingFile) {  //This would be the regular answer type (the left side)
									let multipleAnswerAnswers = Object.assign([], this.state.multipleAnswerAnswers);
									if (!multipleAnswerAnswers[answerIndex]) {
											for(let i = 0; i <= answerIndex; i++) {
													if (!multipleAnswerAnswers[i]) {
															multipleAnswerAnswers = multipleAnswerAnswers && multipleAnswerAnswers.length > 0
																	? multipleAnswerAnswers.concat({sequence: i})
																	: [{sequence: i}];
													}
											}
									}
									multipleAnswerAnswers[answerIndex].recording = blob;
									this.setState({
											question: { ...this.state.question, answers: multipleAnswerAnswers },
											multipleAnswerAnswers,
											blobUrl: window.URL.createObjectURL(blob),
											onTheAir: false
									});
							} else if (isMatchingFile) { //This would be the right side of the matchingolumns.
									let multipleMatchingAnswers = Object.assign([], this.state.multipleMatchingAnswers);
									if (!multipleMatchingAnswers[answerIndex]) {
											for(let i = 0; i <= answerIndex; i++) {
													if (!multipleMatchingAnswers[i]) {
															multipleMatchingAnswers = multipleMatchingAnswers && multipleMatchingAnswers.length > 0
																	? multipleMatchingAnswers.concat({sequence: i})
																	: [{sequence: i}];
													}
											}
									}
									multipleMatchingAnswers[answerIndex].recording = blob;
									this.setState({
											question: { ...this.state.question, answers: multipleMatchingAnswers },
											multipleMatchingAnswers,
											blobUrl: window.URL.createObjectURL(blob),
											onTheAir: false
									});
							}
					}
			}
    }).catch((e) => {
      console.error(e);
    });
  }


	handleVoiceRecordingOpen = (isQuestionFile, answerIndex, isSolutionFile, isMatchingFile, matchingType) => this.setState({isShowingVoiceRecording: true, isQuestionFile, answerIndex, isSolutionFile, isMatchingFile, matchingType })
	handleVoiceRecordingClose = () => this.setState({isShowingVoiceRecording: false, isQuestionFile: '', answerIndex: '', isSolutionFile: '', isMatchingFile: ''})
	handleVoiceRecordingSubmit = () => {
			const {personId, assessmentId} = this.props;
			const {question, selectedRecording_question, selectedRecording_solution, isQuestionFile, answerIndex, isSolutionFile, isMatchingFile} = this.state;
			let data = new FormData();
			data.append('audio', isQuestionFile
					? selectedRecording_question
					: isSolutionFile
							? selectedRecording_solution
							: isMatchingFile
									? question.matches && question.matches.length > 0 && question.matches[answerIndex].recording
									: question.answers && question.answers.length > 0 && question.answers[answerIndex].recording)

			let url = isQuestionFile
					? `${apiHost}ebi/assessmentQuestions/addQuestionRecording/${personId}/${assessmentId}/${question.assessmentQuestionId || guidEmpty}/${question.questionTypeCode}/${encodeURIComponent(question.questionText || 'EMPTY')}`
					: isSolutionFile
							? `${apiHost}ebi/assessmentQuestions/addSolutionRecording/${personId}/${assessmentId}/${question.assessmentQuestionId || guidEmpty}/${question.questionTypeCode}/${encodeURIComponent(question.questionText || 'EMPTY')}`
							: isMatchingFile
									? `${apiHost}ebi/assessmentQuestions/addToMatchRecording/${personId}/${assessmentId}/${answerIndex}/${question.assessmentQuestionId || guidEmpty}/${question.questionTypeCode}`
									: `${apiHost}ebi/assessmentQuestions/addAnswerRecording/${personId}/${assessmentId}/${answerIndex}/${question.assessmentQuestionId || guidEmpty}/${question.questionTypeCode}`

			axios.post(url, data,
					{
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
							'Access-Control-Allow-Credentials' : 'true',
							"Access-Control-Allow-Origin": "*",
							"Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
							"Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
							"Authorization": "Bearer " + localStorage.getItem("authToken"),
					}})
					.catch(function (error) {
						//Show error here.
				  })
					.then(response => {
							let question = Object.assign({}, this.state.question);
							if (!question || !question.assessmentQuestionId || question.assessmentQuestionId === guidEmpty) {
									question.assessmentQuestionId = response.data.assessmentQuestionId;
									this.setState({ question });
							}
					})

			this.handleVoiceRecordingClose();
	}

	handleInputFile_question = (file) => {
			this.setState({ selectedFile_question: file });
			var img = this.imageViewer;
			var reader = new FileReader();
			reader.onloadend = function() {
			    img.src = reader.result;
			}
			reader.readAsDataURL(file);
			this.questionFile.after(img);
	}

	handleInputFile_answer = (file) => {
			const {answerIndex} = this.state;
			let question  = Object.assign({}, this.state.question);
			let answers = question.answers || [];
			if (!answers || !answers[answerIndex]) {
					for(var i = 0; i <= answerIndex; i++) {
							if (!answerIndex[i]) {
									answers = answers && answers.length > 0
											? answers.concat({sequence: i})
											: [{sequence: i}];
							}
					}
			}
			answers[answerIndex].file = file;
			question.answers = answers;
			this.setState({ question });
			var img = document.getElementById(`imageViewer${question.questionTypeCode}${answerIndex}`);
			var reader = new FileReader();
			reader.onloadend = function() {
			    img.src = reader.result;
			}
			reader.readAsDataURL(file);
			//this[`answerFile${answerIndex}`].after(img);   I don't think that this is actually being used, anyway.
	}

	handleInputFile_toMatch = (file) => {
			const {answerIndex} = this.state;
			let question  = Object.assign({}, this.state.question);
			let matches = question.matches || [];
			if (!matches || !matches[answerIndex]) {
					for(var i = 0; i <= answerIndex; i++) {
							if (!answerIndex[i]) {
									matches = matches && matches.length > 0
											? matches.concat({sequence: i})
											: [{sequence: i}];
							}
					}
			}
			matches[answerIndex].file = file;
			question.matches = matches;
			this.setState({ question });
			var img = document.getElementById(`imageViewerMatch${question.questionTypeCode}${answerIndex}`);
			var reader = new FileReader();
			reader.onloadend = function() {
			    img.src = reader.result;
			}
			reader.readAsDataURL(file);
			//this[`toMatchFile${answerIndex}`].after(img);   This actually in the AssessmentMatching component which can't be seen from here.  I don't think that this works anyway.
	}

	handleInputFile_solution = (file) => {
			this.setState({ selectedFile_solution: file });
			var img = this.imageViewerSolution;
			var reader = new FileReader();
			reader.onloadend = function() {
			    img.src = reader.result;
			}
			reader.readAsDataURL(file);
			this.solutionFile.after(img);
	}

	handleRemoveInputFile_question = () => {
			this.setState({ selectedFile_question: null });
			var img = this.imageViewer;
	    img.src = '';
			this.questionFile.after(img);
	}

	handleRemoveInputFile_answer = () => {
			const {answerIndex, question} = this.state;
			let answers = Object.assign([], this.state.answers);
			answers = answers && answers.length > 0
					? answers
					: [{answerText: '', file: {}}, {answerText: '', file: {}}, {answerText: '', file: {}}];
			answers[answerIndex].file = '';
			var img = document.getElementById(`imageViewer${question.questionTypeCode}${answerIndex}`);
	    img.src = '';
			//this.questionFile.after(img);
	}

	handleRemoveInputFile_toMatch = () => {
			const {answerIndex, question} = this.state;
			let matches = Object.assign([], this.state.matches);
			matches = matches && matches.length > 0
					? matches
					: [{answerText: '', file: {}}, {answerText: '', file: {}}, {answerText: '', file: {}}];
			matches[answerIndex].file = '';
			var img = document.getElementById(`imageViewer${question.questionTypeCode}${answerIndex}`);
	    img.src = '';
			//this.questionFile.after(img);
	}

	handleRemoveInputFile_solution = () => {
			this.setState({ selectedFile_solution: null });
			var img = this.imageViewerSolution;
	    img.src = '';
			this.solutionFile.after(img);
	}

	handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
	handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

	toggleAnswerNumberOnly = () => {
			let question = Object.assign([], this.state.question);
			question.answerNumberOnly = !question.answerNumberOnly;
			this.setState({ question });
	}

	fillInTheBlankDisplay = () => {
			const {question={}} = this.state;
			let correctAnswers = typeof question.correctAnswer === 'string'
					? !question.correctAnswer
							? []
							: question.correctAnswer.split(',')
					: question.correctAnswer
							? question.correctAnswer
							: [];

			correctAnswers = correctAnswers && correctAnswers.length > 0 && correctAnswers.map(m => Number(m));

			let arrayWords = question.questionText && question.questionText.split(' ');
			let result = <div className={styles.row}>
											{arrayWords && arrayWords.length > 0 && arrayWords.map((word, index) => {
													if (correctAnswers && correctAnswers.length > 0 && correctAnswers.indexOf(index) > -1) {
															return <input key={index} type={'text'} className={classes(styles.wordSpace, styles.shortTextInput)}
																				onClick={() => this.blankOutWord(index)}/>
													} else {
														  return <div key={index} className={classes(globalStyles.link, styles.wordSpace)} onClick={() => this.blankOutWord(index)}>
																				{word}
																		 </div>
													}
											})}
									 </div>

			return result;
	}

	blankOutWord = (index, assessIncoming) => {
			const question = assessIncoming ? assessIncoming :	this.state.question
			let fillBlanksChosen = typeof question.correctAnswer === 'string'
					? !question.correctAnswer
							? []
							: question.correctAnswer.split(',')
					: question.correctAnswer
			//If this index exists, then delete it.
			//Otherwise add it.
			if (fillBlanksChosen && fillBlanksChosen.length > 0 && fillBlanksChosen.indexOf(index) > -1) {
					fillBlanksChosen = fillBlanksChosen.filter(m => m !== index);
			} else {
					fillBlanksChosen = fillBlanksChosen && fillBlanksChosen.length > 0 ? fillBlanksChosen.concat(index) : [index]
			}
			fillBlanksChosen = fillBlanksChosen && fillBlanksChosen.length > 0 && fillBlanksChosen.map(m => !m && m !== 0 && m !== '0' ? null : Number(m));
			let fillInTheBlankPhrases = this.getFillInTheBlankPhrases(fillBlanksChosen);
			this.setState({ fillInTheBlankPhrases, question: { ...this.state.question, correctAnswer: fillBlanksChosen } });
	}

	getFillInTheBlankPhrases = (fillBlanksChosen) => {
			const question = Object.assign({}, this.state.question) || {};

			let arrayWords = question.questionText && question.questionText.split(' ');
			// let fillBlanksChosen = typeof question.correctAnswer === 'string'
			// 		? question.correctAnswer.split(',')
			// 		: question.correctAnswer
			let fillInTheBlankPhrases = []

			//Reset the consecutive phrases
			if (fillBlanksChosen && fillBlanksChosen.length > 0) {
					fillBlanksChosen = fillBlanksChosen.sort();
					let phraseCount = '';
					let prevIndex = '';
					let space = '';
					fillBlanksChosen.forEach(m => {
							if (m || m === 0) {
									if (((prevIndex  || prevIndex === 0) && m === prevIndex+1*1) || (!prevIndex && prevIndex !== 0)) {
											phraseCount = phraseCount || 0;
											fillInTheBlankPhrases[phraseCount] = fillInTheBlankPhrases[phraseCount]
													? fillInTheBlankPhrases[phraseCount] += space + arrayWords[m]
													: arrayWords[m];
											space = ' ';
									} else {
											fillInTheBlankPhrases[++phraseCount] = arrayWords[m];
									}
							}
							prevIndex = m;
					})
			}
			return fillInTheBlankPhrases;
	}

	handleRemoveQuestionRecordingOpen = (assessmentQuestionId, recordingFileUploadId) => this.setState({isShowingModal_removeQuestionRecording: true, assessmentQuestionId, recordingFileUploadId })
  handleRemoveQuestionRecordingClose = () => this.setState({isShowingModal_removeQuestionRecording: false })
  handleRemoveQuestionRecording = () => {
      const {removeAssessmentQuestionQuestionRecording, personId} = this.props;
			const {assessmentQuestionId, recordingFileUploadId} = this.state;
			let question = Object.assign({}, this.state.question);
      removeAssessmentQuestionQuestionRecording(personId, assessmentQuestionId, recordingFileUploadId);
      this.handleRemoveQuestionRecordingClose();
			question.questionRecordingFileUrl = '';
			this.setState({ deleted_recordingFileUploadId: recordingFileUploadId, selectedRecording_question: '', question });
  }

	handleRemoveAnswerRecordingOpen = (assessmentQuestionId, fileUploadId, answerIndex, multipleAnswerType) => this.setState({isShowingModal_removeAnswerRecording: true, assessmentQuestionId, fileUploadId, answerIndex, multipleAnswerType })
  handleRemoveAnswerRecordingClose = () => this.setState({isShowingModal_removeAnswerRecording: false, answerIndex: '', multipleAnswerType: '' })
  handleRemoveAnswerRecording = () => {
      const {removeAssessmentQuestionAnswerRecording, personId} = this.props;
			const {assessmentQuestionId, fileUploadId, answerIndex, multipleAnswerType} = this.state;
			let question = Object.assign({}, this.state.question);
			let multipleChoiceAnswers = Object.assign([], this.state.multipleChoiceAnswers);
			let multipleAnswerAnswers = Object.assign([], this.state.multipleAnswerAnswers);
      removeAssessmentQuestionAnswerRecording(personId, assessmentQuestionId, fileUploadId);
      this.handleRemoveAnswerRecordingClose();
			if (multipleAnswerType === 'multipleChoice') {
					 multipleChoiceAnswers[answerIndex].recording	= '';
			} else if (multipleAnswerType === 'multipleAnswer') {
					 multipleAnswerAnswers[answerIndex].recording	= '';
			}
			question.answers[answerIndex].recordingFileUrl = '';
			this.setState({ deleted_fileUploadId: fileUploadId, question, multipleChoiceAnswers, multipleAnswerAnswers });
  }

	handleRemoveSolutionRecordingOpen = (assessmentQuestionId, fileUploadId) => this.setState({isShowingModal_removeSolutionRecording: true, assessmentQuestionId, fileUploadId })
  handleRemoveSolutionRecordingClose = () => this.setState({isShowingModal_removeSolutionRecording: false })
  handleRemoveSolutionRecording = () => {
      const {removeAssessmentQuestionSolutionRecording, personId} = this.props;
			const {assessmentQuestionId, fileUploadId} = this.state;
			let question = Object.assign({}, this.state.question);
      removeAssessmentQuestionSolutionRecording(personId, assessmentQuestionId, fileUploadId);
      this.handleRemoveSolutionRecordingClose();
			question.solutionRecordingFileUrl = ''
			this.setState({ deleted_fileUploadId: fileUploadId, selectedRecording_solution: '', question });
  }

	chooseStandards = (standardIds) => {
			let question = Object.assign({}, this.state.question);
			question['standardIds'] = standardIds && standardIds.length > 0 && standardIds.reduce((acc, m) => acc && acc.length ? acc.concat(m.id) : [m.id], []);
			this.setState({ question, standardIds })
	}

  render() {
      const {personId, handleClose, className, questionTypes, assessment, handleRemoveFileOpen, gradingType, removeAnswerFileOpen, handleRemoveSolutionFileOpen,
              accessRoles, handleSubmit, removeToMatchFileOpen, standards=[]} = this.props;
      const {question={}, errors, multipleChoiceAnswers, multipleAnswerAnswers, isShowingModal_keywordCount, isShowingFileUpload, messageInfoIncomplete,
		 					selectedFile_question, selectedFile_solution, deleted_fileUploadId, isQuestionFile, isSolutionFile, isMatchingFile, answerIndex,
							isShowingModal_missingInfo, isShowingVoiceRecording, selectedRecording_question, selectedRecording_solution,
							record, matchingEntries, fillInTheBlankPhrases, blobUrl, onTheAir, isShowingModal_removeAnswerRecording, standardIds,
							isShowingModal_removeQuestionRecording, isShowingModal_removeSolutionRecording, multipleMatchingAnswers} = this.state;
			let newState = Object.assign({}, this.state);
      let multipleCount = newState.multipleCount >= 3 ? newState.multipleCount : 3;

			let answerOptions = [];

			for (let i = 0; i < matchingEntries; i++) {
					let option = {id: alpha[i], label: alpha[i]};
					answerOptions = answerOptions && answerOptions.length > 0 ? answerOptions.concat(option) : [option];
			}

      return (
          <div className={classes(styles.container, className)}>
              <ModalContainer onClose={handleClose}>
                  <ModalDialog onClose={handleClose}>
                      <div className={styles.center}>
                          <div className={styles.heading}>
															{question.assessmentQuestionId && question.assessmentQuestionId !== guidEmpty
																	? <L p={p} t={`Edit Question`}/>
																	: <L p={p} t={`Add Question`}/>
															}
													</div>
                          <div className={styles.moreTop}>
                              <TextDisplay label={<L p={p} t={`Assessment`}/>} text={assessment && assessment.name} />
                          </div>
                      </div>
                      <ul className={styles.unorderedList}>
                          <li>
															{question.assessmentQuestionId
																	? <TextDisplay label={<L p={p} t={`Question Type`}/>} text={questionTypes && questionTypes.length > 0 && questionTypes.filter(m => m.id === question.questionTypeCode)[0].label} />
																	: <div>
			                                  <SelectSingleDropDown
			                                      id={`questionTypeCode`}
			                                      name={`questionTypeCode`}
			                                      label={<L p={p} t={`Question Type`}/>}
			                                      value={question.questionTypeCode || ''}
			                                      options={questionTypes}
			                                      className={styles.moreBottomMargin}
			                                      height={`medium`}
			                                      onChange={this.changeItem}
			                                      disabled={question.assessmentQuestionId}
																						required={true}
																						whenFilled={question.questionTypeCode}
			                                      error={errors.questionTypeCode}/>
			                              </div>
															}
                              {question.assessmentQuestionId &&
                                 <div className={classes(styles.instructions, styles.muchLeft)}>If you want to change the question type, delete and start again.</div>
                              }
                          </li>
                          {question.questionTypeCode && question.questionTypeCode !== '0' && question.questionTypeCode !== 'PASSAGE' &&
                              <li>
                                  <InputText
                                      id={`pointsPossible`}
                                      name={`pointsPossible`}
                                      size={'super-short'}
                                      label={<L p={p} t={`Points`}/>}
																			numberOnly={true}
                                      value={question.pointsPossible || ''}
                                      onChange={this.changeItem}
																			required={true}
																			whenFilled={question.pointsPossible}
																			autoComplete={'dontdoit'}
                                      error={errors.pointsPossible}/>
                              </li>
                          }
													{gradingType === 'STANDARDSRATING' && question.questionTypeCode !== 'PASSAGE' &&
															<li>
																	<div className={styles.listPosition}>
																			<InputDataList
																					label={<L p={p} t={`Standards`}/>}
																					name={'standardIds'}
																					options={standards || [{id: '', value: ''}]}
																					value={standardIds}
																					multiple={true}
																					height={`medium`}
																					className={styles.moreTop}
																					onChange={this.chooseStandards}/>
										              </div>
															</li>
													}
                          {question.questionTypeCode && question.questionTypeCode !== '0' && question.questionTypeCode !== 'MATCHING' &&
                              <li>
																	<InputTextArea
																			label={question.questionTypeCode === 'PASSAGE' ? <L p={p} t={`Enter the passage`}/> : <L p={p} t={`Enter the question`}/>}
																			name={'questionText'}
																			value={question.questionText || ''}
																			autoComplete={'dontdoit'}
																			onChange={this.changeItem}
																			required={true}
																			whenFilled={(question.questionTypeCode === 'FILLBLANK' && question.questionText)
																							|| (question.questionTypeCode !== 'FILLBLANK' && (question.questionText || selectedFile_question || selectedRecording_question))}
																			error={errors.questionText}/>
																	<div className={classes(styles.row, styles.includePicture)} ref={(ref) => (this.questionFile = ref)}>
																			{/*<div className={globalStyles.instructionsBigger}>Enter a question above and / or</div>*/}
																			<div className={styles.row} onClick={() => this.handleFileUploadOpen(true)}>
																					<Icon pathName={'camera2'} premium={true} className={styles.icon}/>
																					<div className={classes(globalStyles.link, styles.littleTop)}><L p={p} t={`Picture`}/></div>
																			</div>
																			<div className={styles.row} onClick={() => this.handleVoiceRecordingOpen(true)}>
																					<Icon pathName={'microphone'} premium={true} className={styles.iconPosition}/>
																					<div className={classes(globalStyles.link, styles.littleTop)}><L p={p} t={`Voice recording`}/></div>
																			</div>
																	</div>
																	<img src={''} alt={'New'} ref={(ref) => (this.imageViewer = ref)} />
																	{!selectedRecording_question && question.questionRecordingFileUrl &&
																			<AudioDisplay src={question.questionRecordingFileUrl} preload={'auto'} controls="controls" className={styles.audioLeftQuestion}
																					isSmall={true} isOwner={question.isOwner}
																					deleteFunction={(event) => this.handleRemoveQuestionRecordingOpen(question.assessmentQuestionId, question.questionRecordingFileUploadId)} />
																	}
																	{selectedRecording_question &&
																			<AudioDisplay src={selectedRecording_question && window.URL.createObjectURL(selectedRecording_question)} preload={'auto'} controls="controls" className={styles.audioLeftQuestion}
																					isSmall={true} isOwner={question.isOwner}
																					deleteFunction={(event) => this.handleRemoveQuestionRecordingOpen(question.assessmentQuestionId, question.questionRecordingFileUploadId)} />
																	}
																	{question.questionFileUrl &&
																			<ImageDisplay key={'questionFile'} linkText={''} url={question.questionFileUrl} isOwner={question.isOwner}
																					deleteFunction={() => handleRemoveFileOpen(question.assessmentQuestionId, question.questionFileUploadId)}/>
																  }
																	<hr/>
                              </li>
                          }
                          {question.questionTypeCode === 'TRUEFALSE' &&
                            <li>
	                                <RadioGroup
                                    data={[{ label: <L p={p} t={`True`}/>, id: 'true' }, { label: <L p={p} t={`False`}/>, id: 'false' }, ]}
                                    name={`answerTrueFalse`}
                                    horizontal={true}
                                    className={styles.radio}
                                    initialValue={question.correctAnswer}
                                    onClick={this.handleTrueFalse}/>
                            </li>
                          }
													{question.questionTypeCode === 'SINGLEENTRY' &&
                            <li>
																<Checkbox
																		id={'answerNumberOnly'}
																		name={'answerNumberOnly'}
																		label={<L p={p} t={`Number only`}/>}
																		labelClass={styles.checkboxLabel}
																		checked={question.answerNumberOnly || false}
																		onClick={this.toggleAnswerNumberOnly}
																		className={styles.button}/>
																<InputText
																		id={`correctAnswer`}
																		name={`correctAnswer`}
																		size={question.answerNumberOnly ? 'super-short' : 'medium-long'}
																		label={<L p={p} t={`Answer`}/>}
																		value={question.correctAnswer || ''}
																		onChange={this.changeItem}
																		numberOnly={question.answerNumberOnly}
																		autoComplete={'dontdoit'}
																		required={true}
																		whenFilled={question.correctAnswer} />
                            </li>
                          }
													{question.questionTypeCode === 'SINGLEENTRY' &&
                            <li>
																<AssessmentAnswerVariation answerVariations={question.answerVariations} addAnswerVariation={this.handleAddAnswerVariation}
																		removeAnswerVariation={this.handleRemoveAnswerVariation} />
                            </li>
                          }
													{question.questionText && question.questionTypeCode === 'FILLBLANK' &&
                            <li>
																<TextDisplay label={<L p={p} t={`Full phrase`}/>} text={question.questionText} />
                            </li>
                          }
													{question.questionText && question.questionTypeCode === 'FILLBLANK' &&
                            <li>
																<TextDisplay label={
																				<div className={styles.row}>
																						<div><L p={p} t={`Blank-out phrase`}/></div>
																						<div className={classes(globalStyles.instructionsBigger, styles.liftUp)}><L p={p} t={`Click on a word to blank it out`}/></div>
																				</div>
																		} text={this.fillInTheBlankDisplay()} />
                            </li>
                          }
													{fillInTheBlankPhrases && fillInTheBlankPhrases.length > 0 && question.questionTypeCode === 'FILLBLANK' &&
															<li>
																	{fillInTheBlankPhrases.map((m, i) => !m
																					? null
																					: <TextDisplay label={fillInTheBlankPhrases.length === 1 ? <L p={p} t={`Answer`}/> : <L p={p} t={`Answer #${i+1*1}`}/>} text={m} key={i} />
																	)}
																	<div className={styles.positionVariations}>
																			<AssessmentAnswerVariation answerVariations={question.answerVariations} addAnswerVariation={this.handleAddAnswerVariation}
																					removeAnswerVariation={this.handleRemoveAnswerVariation} />
																	</div>
															</li>
                          }
													{question.questionTypeCode === 'MATCHING' &&
                            <li>
																<AssessmentMatching viewMode={'AddOrUpdate'} question={question} accessRoles={accessRoles} handleSubmit={handleSubmit}
																		removeQuestionFileOpen={this.handleRemoveQuestionFileOpen}
																		removeSolutionFileOpen={this.handleRemoveSolutionFileOpen}
																		removeAnswerRecordingOpen={this.handleRemoveAnswerRecordingOpen}
																		removeSolutionRecordingOpen={this.handleRemoveSolutionRecordingOpen}
																		handleMatchingCorrectAnswers={this.handleMatchingCorrectAnswers}
																		handleMatchingQuestionText={this.handleMatchingQuestionText}
																		handleMatchingToMatchText={this.handleMatchingToMatchText}
																		removeMatchingRemoveLine={this.removeMatchingRemoveLine}
																		removeAnswerFileOpen={removeAnswerFileOpen}
																		handleFileUploadOpen={this.handleFileUploadOpen}
																		handleVoiceRecordingOpen={this.handleVoiceRecordingOpen}
																		removeToMatchFileOpen={removeToMatchFileOpen}
																		multipleAnswerAnswers={multipleAnswerAnswers}
																		multipleMatchingAnswers={multipleMatchingAnswers} />
                            </li>
                          }
                          {question.questionTypeCode === 'ESSAY' &&
                            <li>
																<AssessmentEssayKeyword keywordPhrases={question.keywordPhrases} addKeywordPhrase={this.handleAddKeywordPhrase}
																		removeKeywordPhrase={this.handleRemoveKeywordPhrase} keywordCountAccuracy={question.keywordCountAccuracy}
																		updateKeywordCountAccuracy={this.changeItem}/>
                            </li>
                          }
                          {question.questionTypeCode === 'PASSAGE' &&
                            <li>
                                <span className={styles.labelNotice}><L p={p} t={`This is intended to be a reading or example of a problem which will be followed by two or more questions.`}/></span><br/>
                            </li>
                          }
                          {question.questionTypeCode === 'MULTIPLECHOICE' &&
                            <li>
                                {alpha.map((alph, index) => {  //eslint-disable-line
                                  if (multipleCount >= index + 1) {
                                    return <div key={index}>
																							<div className={styles.row}>
		                                              <input type={`radio`} name={'multipleChoice'} id={'multipleChoice'} value={index}
																											checked={(multipleChoiceAnswers[index] && multipleChoiceAnswers[index].isCorrect) || false}
		                                                  onClick={this.handleMultipleChoiceCorrectAnswer} onChange={() => {}}/>
		                                              <span className={styles.label}>{alph}</span>
		                                              <InputTextArea
																											label={''}
																											id={alpha[index]}
		                                                  name={alpha[index]}
																											value={(multipleChoiceAnswers[index] && multipleChoiceAnswers[index].answerText) || ''}
																											autoComplete={'dontdoit'}
																											onChange={(event) => this.handleMultipleChoiceAnswer(event, index)}/>
																									{multipleCount > 3 &&
																											<Icon pathName={`trash2`} premium={true} className={styles.icon} onClick={() => this.handleRemoveMultipleChoiceAnswer(index)}/>
																									}
		                                          </div>
																							<div className={classes(styles.row, styles.muchMoreLeft)} ref={(ref) => (this[`answerFile${index}`] = ref)}>
																									{/*<div className={globalStyles.instructionsBigger}>Enter an answer above and / or</div>
                                                  Removed text due to simplicity of page and to clean up modal. It's self explanitory*/}
																									<div className={styles.row} onClick={() => this.handleFileUploadOpen(false, index)}>
																											<Icon pathName={'camera2'} premium={true} className={styles.icon}/>
																											<div className={classes(globalStyles.link, styles.littleTop)}><L p={p} t={`Picture`}/></div>
																									</div>
																									<div className={styles.row} onClick={() => this.handleVoiceRecordingOpen(false, index)}>
																											<Icon pathName={'microphone'} premium={true} className={styles.iconPosition}/>
																											<div className={classes(globalStyles.link, styles.littleTop)}><L p={p} t={`Voice recording`}/></div>
																									</div>
																							</div>
																							<img src={''} alt={'New'} id={`imageViewer${question.questionTypeCode}${index}`} />
																							{(!(multipleChoiceAnswers[index] && multipleChoiceAnswers[index].recording)
																													&& (question && question.answers && question.answers.length > 0 && question.answers[index] && question.answers[index].recordingFileUrl)) &&
																									<AudioDisplay src={question.answers[index].recordingFileUrl} preload={'auto'} controls="controls" className={styles.audioLeftQuestion}
																											isSmall={true} isOwner={question.isOwner}
																											deleteFunction={(event) => this.handleRemoveAnswerRecordingOpen(question.assessmentQuestionId, question.answers[index].recordingFileUploadId, index, 'multipleChoice')} />
																							}
																							{multipleChoiceAnswers[index] && multipleChoiceAnswers[index].recording
																									&& deleted_fileUploadId !== multipleChoiceAnswers[index].recordingFileUploadId &&
																											<AudioDisplay src={window.URL.createObjectURL(multipleChoiceAnswers[index].recording)} preload={'auto'} controls="controls" className={styles.audioLeftQuestion}
																													isSmall={true} isOwner={question.isOwner}
																													deleteFunction={(event) => this.handleRemoveAnswerRecordingOpen(question.assessmentQuestionId, multipleChoiceAnswers[index].fileUploadId, index, 'multipleChoice')} />
																							}
																							{multipleChoiceAnswers[alpha.indexOf(alph)] && multipleChoiceAnswers[alpha.indexOf(alph)].fileUrl
																									&& deleted_fileUploadId !== multipleChoiceAnswers[alpha.indexOf(alph)].fileUploadId &&
																											<ImageDisplay linkText={''} url={multipleChoiceAnswers[alpha.indexOf(alph)].fileUrl} isOwner={question.isOwner}
																													deleteFunction={() => removeAnswerFileOpen(question.assessmentQuestionId, multipleChoiceAnswers[alpha.indexOf(alph)].fileUploadId)}/>
																							}
																							<hr/>
																					</div>
                                }})}
                                <a onClick={this.incrementMultipleCount} className={styles.link}><L p={p} t={`Add another multiple choice answer`}/></a>
                            </li>
                          }
                          {question.questionTypeCode === 'MULTIPLEANSWER' &&
                            <li>
                                {alpha.map((alph, index) => {  //eslint-disable-line
                                  if (multipleCount >= index+1) {
                                    return <div key={index}>
																							<div className={styles.row}>
		                                              <input type={`checkbox`} id={alph} name={alph} value={index}
		                                                  checked={(multipleAnswerAnswers[index] && multipleAnswerAnswers[index].isCorrect) || false}
		                                                  onClick={this.handleMultipleAnswerCorrectAnswer} onChange={() => {}}/>
		                                              <span className={styles.label}>{alph}</span>
																									<InputTextArea
																											label={''}
																											id={alpha[index]}
		                                                  name={alpha[index]}
																											autoComplete={'dontdoit'}
																											value={(multipleAnswerAnswers[alpha.indexOf(alph)] && multipleAnswerAnswers[alpha.indexOf(alph)].answerText) || ''}
		                                                  onChange={this.handleMultipleAnswerAnswer}
																											error={errors.correctAnswer}/>
																									{multipleCount > 3 &&
																											<Icon pathName={`trash2`} premium={true} className={styles.icon} onClick={() => this.handleRemoveMultipleChoiceAnswer(index)}/>
																									}
																							</div>
																							<div className={classes(styles.row, styles.includePicture, styles.muchMoreLeft)} ref={(ref) => (this[`answerFile${index}`] = ref)}>
                                                  {/*<div className={globalStyles.instructionsBigger}>Enter a question above and / or</div>
                                                  Removed text due to simplicity of page and to clean up modal. It's self explanitory*/}
																									<div className={styles.row} onClick={() => this.handleFileUploadOpen(false, index)}>
																											<Icon pathName={'camera2'} premium={true} className={styles.icon}/>
																											<div className={classes(globalStyles.link, styles.littleTop)}><L p={p} t={`Picture`}/></div>
																									</div>
																									<div className={styles.row} onClick={() => this.handleVoiceRecordingOpen(false, index)}>
																											<Icon pathName={'microphone'} premium={true} className={styles.iconPosition}/>
																											<div className={classes(globalStyles.link, styles.littleTop)}><L p={p} t={`Voice recording`}/></div>
																									</div>
																							</div>
																							<img src={''} alt={'New'} id={`imageViewer${question.questionTypeCode}${index}`} />
																							{(!(multipleAnswerAnswers[index] && multipleAnswerAnswers[index].recording)
																													&& (question && question.answers && question.answers.length > 0 && question.answers[index] && question.answers[index].recordingFileUrl)) &&
																									<AudioDisplay src={question.answers[index].recordingFileUrl} preload={'auto'} controls="controls" className={styles.audioLeftQuestion} isSmall={true} isOwner={question.isOwner}
																											deleteFunction={(event) => this.handleRemoveAnswerRecordingOpen(question.assessmentQuestionId, question.answers[index].recordingFileUploadId, index, 'multipleAnswer')} />
																							}
																							{multipleAnswerAnswers[index] && multipleAnswerAnswers[index].recording
																									&& deleted_fileUploadId !== multipleAnswerAnswers[index].recordingFileUploadId &&
																											<AudioDisplay src={window.URL.createObjectURL(multipleAnswerAnswers[index].recording)} preload={'auto'} controls="controls" className={styles.audioLeftQuestion} isSmall={true} isOwner={question.isOwner}
																													deleteFunction={(event) => this.handleRemoveAnswerRecordingOpen(question.assessmentQuestionId, multipleAnswerAnswers[index].fileUploadId, index, 'multipleAnswer')} />
																							}
																							{multipleAnswerAnswers[alpha.indexOf(alph)] && multipleAnswerAnswers[alpha.indexOf(alph)].fileUrl
																									&& deleted_fileUploadId !== multipleChoiceAnswers[alpha.indexOf(alph)].fileUploadId &&
																											<ImageDisplay linkText={''} url={multipleChoiceAnswers[alpha.indexOf(alph)].fileUrl} isOwner={question.isOwner}
																													deleteFunction={() => removeAnswerFileOpen(question.assessmentQuestionId, multipleChoiceAnswers[alpha.indexOf(alph)].fileUploadId)}/>
																							}
																							<hr/>
                                          </div>
                                }})}
                                <a onClick={this.incrementMultipleCount} className={styles.link}><L p={p} t={`Add another multiple choice answer`}/></a>
                            </li>
                          }
													{question.questionTypeCode && question.questionTypeCode !== 'PASSAGE' &&
															<li>
																	<hr/>
																	<div className={styles.headerLabel}><L p={p} t={`Solution (optional)`}/></div>
																	<div className={styles.moreTop}>
																			<InputTextArea
																					label={<L p={p} t={`After the quiz is corrected, this explanation or picture will be displayed`}/>}
																					id={'solutionText'}
																					name={'solutionText'}
																					value={question.solutionText || ''}
																					onChange={this.changeItem}
																					autoComplete={'dontdoit'}/>
																	</div>
																	<div className={classes(styles.row, styles.includePicture)} ref={(ref) => (this.solutionFile = ref)}>
                                      {/*<div className={globalStyles.instructionsBigger}>Enter a question above and / or</div>*/}
																			<div className={styles.row} onClick={() => this.handleFileUploadOpen(false, null, true)}>
																					<Icon pathName={'camera2'} premium={true} className={styles.icon}/>
																					<div className={classes(globalStyles.link, styles.littleTop)}><L p={p} t={`Picture`}/></div>
																			</div>
																			<div className={styles.row} onClick={() => this.handleVoiceRecordingOpen(false, null, true)}>
																					<Icon pathName={'microphone'} premium={true} className={styles.iconPosition}/>
																					<div className={classes(globalStyles.link, styles.littleTop)}><L p={p} t={`Voice recording`}/></div>
																			</div>
																	</div>
																	<img src={''} alt={'New'}  ref={(ref) => (this.imageViewerSolution = ref)}/>
																	{!selectedRecording_solution && question.solutionRecordingFileUrl &&
																			<AudioDisplay src={question.solutionRecordingFileUrl} preload={'auto'} controls="controls" className={styles.audioLeftQuestion} isSmall={true} isOwner={question.isOwner}
																					deleteFunction={(event) => this.handleRemoveSolutionRecordingOpen(question.assessmentQuestionId, question.solutionRecordingFileUploadId)} />
																	}
																	{selectedRecording_solution &&
																			<AudioDisplay src={window.URL.createObjectURL(selectedRecording_solution)} preload={'auto'} controls="controls" className={styles.audioLeftQuestion} isSmall={true} isOwner={question.isOwner}
																					deleteFunction={(event) => this.handleRemoveSolutionRecordingOpen(question.assessmentQuestionId, question.solutionRecordingFileUploadId)} />
																	}
																	{question.solutionFileUploadId && question.solutionFileUrl
																			&& deleted_fileUploadId !== question.solutionFileUploadId &&
																					<ImageDisplay linkText={''} url={question.solutionFileUrl} isOwner={question.isOwner}
																							deleteFunction={() => handleRemoveSolutionFileOpen(question.assessmentQuestionId, question.solution.fileUploadId)}/>
																	}
																	<hr/>
															</li>
													}
                          <li>
                              <span className={styles.error}>{errors.correctAnswer}</span>
                          </li>
                          <li>
															<div className={classes(styles.rowRight)}>
																	<div className={styles.cancelLink} onClick={handleClose}>
																			Close
																	</div>
																	<div>
							                    		<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
																	</div>
							                </div>
                          </li>
                      </ul>
                  </ModalDialog>
              </ModalContainer>
							{isShowingModal_keywordCount &&
									<MessageModal handleClose={this.handleKeywordCountClose} heading={<L p={p} t={`Missing keyword count accuracy?`}/>}
										 explainJSX={<L p={p} t={`You have entered a keyword for this essay, but you didn't indicate how many keywords that need to be present in the essay to get full credit. Do you want to save this entry anyway?`}/>} isConfirmType={true}
										 onClick={this.handleKeywordCountSave} />
							}
							{isShowingFileUpload &&
									<FileUploadModalWithCrop handleClose={this.handleFileUploadClose} title={<L p={p} t={`Choose Assessment Picture`}/>}
											personId={personId} submitFileUpload={this.handleFileUploadSubmit} answerIndex={answerIndex}
											file={isQuestionFile
														? selectedFile_question
														: isSolutionFile
																?	selectedFile_solution
																: isMatchingFile
																		? question.matches && question.matches.length > 0 && question.matches[answerIndex] && question.matches[answerIndex].file
																		: question.answers && question.answers.length > 0 && question.answers[answerIndex] && question.answers[answerIndex].file
											}
											handleInputFile={isQuestionFile
														? this.handleInputFile_question
														: isSolutionFile
																? this.handleInputFile_solution
																: isMatchingFile
																		? this.handleInputFile_toMatch
																		: this.handleInputFile_answer}
											acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .docx, .doc, .pdf"}
											handleCancelFile={isQuestionFile
													? this.handleRemoveInputFile_question
													: isSolutionFile
															? this.handleRemoveInputFile_solution
															: isMatchingFile
																	? this.handleRemoveInputFile_toMatch
																	: this.handleRemoveInputFile_answer
											}/>
							}
							{isShowingVoiceRecording &&
	                <VoiceRecordingModal2 handleClose={this.handleVoiceRecordingClose} title={<L p={p} t={`Assessment Question`}/>} label={<L p={p} t={`File for`}/>}
	                    personId={personId}
											record={record}
											submitFileUpload={this.handleVoiceRecordingSubmit}
											recordedBlob={isQuestionFile
														? selectedRecording_question
														: isSolutionFile
																?	selectedRecording_solution
																: isMatchingFile
																		? question.matches && question.matches.length > 0 && question.matches[answerIndex] && question.matches[answerIndex].recording
																		: question.answers && question.answers.length > 0 && question.answers[answerIndex] && question.answers[answerIndex].recording
											}
											handleCancelFile={isQuestionFile
													? this.handleRemoveInputRecording_question
													: isSolutionFile
															? this.handleRemoveInputRecording_solution
															: isMatchingFile
																	? this.handleRemoveInputRecording_toMatch
																	: this.handleRemoveInputRecording_answer}
											startRecording={this.startRecording}
										  stopRecording={this.stopRecording}
										  blobUrl={blobUrl}
											onTheAir={onTheAir}/>
	            }
							{isShowingModal_missingInfo &&
									<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
										 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
							}
							{isShowingModal_removeQuestionRecording &&
	                <MessageModal handleClose={this.handleRemoveQuestionRecordingClose} heading={<L p={p} t={`Remove this question recording?`}/>}
	                   explainJSX={<L p={p} t={`Are you sure you want to delete this question recording?`}/>} isConfirmType={true}
	                   onClick={this.handleRemoveQuestionRecording} />
	            }
							{isShowingModal_removeAnswerRecording &&
	                <MessageModal handleClose={this.handleRemoveAnswerRecordingClose} heading={<L p={p} t={`Remove this answer recording?`}/>}
	                   explainJSX={<L p={p} t={`Are you sure you want to delete this answer recording?`}/>} isConfirmType={true}
	                   onClick={this.handleRemoveAnswerRecording} />
	            }
							{isShowingModal_removeSolutionRecording &&
	                <MessageModal handleClose={this.handleRemoveSolutionRecordingClose} heading={<L p={p} t={`Remove this solution recording?`}/>}
	                   explainJSX={<L p={p} t={`Are you sure you want to delete this solution recording?`}/>} isConfirmType={true}
	                   onClick={this.handleRemoveSolutionRecording} />
	            }
          </div>
      )
    }
}
