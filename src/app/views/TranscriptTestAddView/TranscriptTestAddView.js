import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import globalStyles from '../../utils/globalStyles.css';
const p = 'globalStyles';
import L from '../../components/PageLanguage';
import styles from './TranscriptTestAddView.css';
import InputText from '../../components/InputText';
import DateTimePicker from '../../components/DateTimePicker';
import DateMoment from '../../components/DateMoment';
import Icon from '../../components/Icon';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import EditTable from '../../components/EditTable';
import InputDataList from '../../components/InputDataList';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';

export default class TranscriptTestAddView extends Component {
  constructor(props) {
    super(props);

    this.state = {
			isShowingModal_remove: false,
			transcriptTest: {
				transcriptTestId:'',
				name: '',
				testDate: '',
				english: '',
				math: '',
				reading: '',
				science: '',
				composite: '',
				englishWriting: '',
			},
			errors: {
				name: '',
				testDate: '',
			}
    }
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateTranscriptTest, personId} = this.props;
			const {transcriptTest, selectedStudent} = this.state;
			let errors = Object.assign({}, this.state.errors);
      let hasError = false;
			let missingInfoMessage = [];

			if (!selectedStudent) {
					hasError = true;
					errors.student = <L p={p} t={`Student is required`}/>
          missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Student`}/></div>
					this.setState ({errors: errors})
			}

			if (!transcriptTest.name) {
					hasError = true;
					errors.name = <L p={p} t={`Test name is required`}/>
          missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Test name`}/></div>
					this.setState ({errors: errors})
			}

			if (!transcriptTest.testDate) {
					hasError = true;
					errors.testDate = <L p={p} t={`Test date is required`}/>
          missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Test date`}/></div>
					this.setState ({errors: errors})
			}

      if (!hasError) {
					transcriptTest.studentPersonId = selectedStudent && selectedStudent.id;
          addOrUpdateTranscriptTest(personId, transcriptTest);

          this.setState({
							transcriptTest: {
									transcriptTestId:'',
									name: '',
									testDate: '',
									english: '',
									math: '',
									reading: '',
									science: '',
									composite: '',
									englishWriting: '',
							},
					})
			} else {
					this.handleMissingInfoOpen(missingInfoMessage);
      }
  }

		handleChange = (event) => {
				let transcriptTest = Object.assign({}, this.state.transcriptTest);
				transcriptTest[event.target.name] = event.target.value;
				if (event.target.name === 'firstInterval' || event.target.name === 'secondInterval' || event.target.name === 'thirdInterval' || event.target.name === 'fourthInterval')
						transcriptTest[event.target.name] = event.target.value.toUpperCase();
				else
						transcriptTest[event.target.name] = event.target.value;
				this.setState({ transcriptTest })
		}

    getrecord = (record) => {
      	this.setState({transcriptTest: Object.assign({}, record)})
    }

		handleRemoveOpen = (transcriptTestId) => this.setState({isShowingModal_remove: true, transcriptTestId })
		handleRemoveClose = () => this.setState({isShowingModal_remove: false, transcriptTestId: ''})
    handleRemove = () => {
				const {personId, removeTranscriptTest} = this.props;
				const {transcriptTestId} = this.state;
				removeTranscriptTest(personId, transcriptTestId);
        this.handleRemoveClose();
  	}

		handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
		handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

		handleSelectedStudent = (selectedStudent) => {
				const {personId, getTranscripts} = this.props;
				this.setState({ selectedStudent });
				selectedStudent && selectedStudent.id && getTranscripts(personId, selectedStudent.id);
		}

		changeDate = (field, event) => {
				let transcriptTest = Object.assign({}, this.state.transcriptTest);
				transcriptTest[field] = event.target.value
        this.setState({ transcriptTest });
		}

		handleEdit = (transcriptTest) => this.setState({ transcriptTest })

  render() {
		const {personId, myFrequentPlaces, setMyFrequentPlace, students, transcripts=[], fetchingRecord} = this.props;
		const {transcriptTest={}, errors, isShowingModal_remove, messageInfoIncomplete, isShowingModal_missingInfo, selectedStudent} = this.state;

		let headings = [{},{},
				{label: <L p={p} t={`Name`}/>, tightText: true},
				{label: <L p={p} t={`Date`}/>, tightText: true},
				{label: <L p={p} t={`English`}/>, tightText: true},
				{label: <L p={p} t={`Math`}/>, tightText: true},
				{label: <L p={p} t={`Reading`}/>, tightText: true},
				{label: <L p={p} t={`Science`}/>, tightText: true},
				{label: <L p={p} t={`Composite`}/>, tightText: true},
				{label: <L p={p} t={`English/Writing`}/>, tightText: true},
		]

		let data = []
		transcripts && transcripts.tests && transcripts.tests.length > 0 && transcripts.tests.forEach(m => {
				let row = [
						{value: <div onClick={() => this.handleEdit(m)}>
												<Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
										</div>
						},
						{value: <a onClick={() => this.handleRemoveOpen(m.transcriptTestId)} className={styles.remove}>
												<Icon pathName={'trash2'} premium={true} className={styles.icon}/>
										</a>
						},
						{value: m.name},
						{value: <DateMoment date={m.testDate} format={'D MMM YYYY'} minusHours={6}/>},
						{value: m.english},
						{value: m.math},
						{value: m.reading},
						{value: m.science},
						{value: m.composite},
						{value: m.englishWriting},
				];
				data.push(row);
		});

    return (
        <div className={styles.container}>
						<div className={globalStyles.pageTitle}>{`Transcript Test/Exam Entry`}</div>
						<div>
								<InputDataList
										label={<L p={p} t={`Student`}/>}
										name={'student'}
										options={students}
										value={selectedStudent}
										height={`medium`}
										onChange={this.handleSelectedStudent}
										required={true}
										whenFilled={selectedStudent}
										error={errors.student}/>
						</div>
						<InputText
								id={`name`}
								name={`name`}
								size={"medium-long"}
								label={<L p={p} t={`Name`}/>}
								value={transcriptTest.name || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={transcriptTest.name}
								error={errors.name} />
						<div className={styles.dateTimeSpace}>
								<DateTimePicker id={`parentContactDate`} label={<L p={p} t={`Date`}/>} value={transcriptTest.testDate || ''} onChange={(event) => this.changeDate('testDate', event)}
										required={true} whenFilled={transcriptTest.testDate} className={styles.dateTime} error={errors.testDate}/>
						</div>
						<div className={styles.rowWrap}>
								<InputText
										id={`english`}
										name={`english`}
										size={"super-short"}
										numberOnly={true}
										label={<L p={p} t={`English`}/>}
										value={transcriptTest.english || ''}
										onChange={this.handleChange}
										inputClassName={styles.input} />
								<InputText
										id={`math`}
										name={`math`}
										size={"super-short"}
										numberOnly={true}
										label={<L p={p} t={`Math`}/>}
										value={transcriptTest.math || ''}
										onChange={this.handleChange}
										inputClassName={styles.input} />
								<InputText
										id={`reading`}
										name={`reading`}
										size={"super-short"}
										numberOnly={true}
										label={<L p={p} t={`Reading`}/>}
										value={transcriptTest.reading || ''}
										onChange={this.handleChange}
										inputClassName={styles.input} />
								<InputText
										id={`science`}
										name={`science`}
										size={"super-short"}
										numberOnly={true}
										label={<L p={p} t={`Science`}/>}
										value={transcriptTest.science || ''}
										onChange={this.handleChange}
										inputClassName={styles.input} />
								<InputText
										id={`composite`}
										name={`composite`}
										size={"super-short"}
										numberOnly={true}
										label={<L p={p} t={`Composite`}/>}
										value={transcriptTest.composite || ''}
										onChange={this.handleChange}
										inputClassName={styles.input} />
								<InputText
										id={`englishWriting`}
										name={`englishWriting`}
										size={"super-short"}
										numberOnly={true}
										label={<L p={p} t={`English/Writing`}/>}
										value={transcriptTest.englishWriting || ''}
										onChange={this.handleChange}
										inputClassName={styles.input} />
						</div>
						<div className={classes(styles.dialogButtons, styles.row, styles.muchLeft)}>
                <a className={styles.cancelLink} onClick={() => browserHistory.push('/firstNav')}><L p={p} t={`Close`}/></a>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
            </div>
						<hr/>
						{selectedStudent && selectedStudent.label &&
								<div className={classes(globalStyles.pageTitle, styles.centered, styles.moreBottom)}>
										<L p={p} t={`Tests for {selectedStudent.label}`}/>
								</div>
						}
						<EditTable data={data} headings={headings} noColorStripe={true} isFetchingRecord={fetchingRecord.transcripts}/>
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Transcript Test Add`}/>} path={'transcriptTestAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
						<OneFJefFooter />
						{isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveClose} heading={<L p={p} t={`Remove this Transcript Test?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to remove this transcript test?`}/>} isConfirmType={true}
                   onClick={this.handleRemove} />
            }
						{isShowingModal_missingInfo &&
								<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
									 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
						}
      	</div>
    );
  }
}
