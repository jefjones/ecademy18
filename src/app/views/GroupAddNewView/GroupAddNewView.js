import React, {Component} from 'react';
import styles from './GroupAddNewView.css';
import globalStyles from '../../utils/globalStyles.css';
import InputText from '../../components/InputText';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import OneFJefFooter from '../../components/OneFJefFooter';
import Loading from '../../components/Loading';

export default class GroupAddNewView extends Component {
    constructor ( props ) {
        super( props );

        this.state = {
        	groupName: this.props.groupName || '',
            languageChosen: this.props.languageChosen || 1,
            internalId: '',
            description: '',
            groupNameError: '',
            languageError: '',
            showNextButton: true,
        }

        this.handleLanguageChange = this.handleLanguageChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleInternalIdChange = this.handleInternalIdChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.checkForKeypress = this.checkForKeypress.bind(this);
    }

    componentDidMount () {
        //document.getElementById('groupName').focus();  //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
        document.getElementById('groupName').addEventListener('keydown', this.checkForKeypress);
    }

    checkForKeypress(evt) {
        if (evt.key === 'Enter') {
            evt.stopPropagation();
            evt.preventDefault();
            this.handleSubmit();
            return false;
        }
    }

    handleNameChange(event) {
        this.setState({ groupName: event.target.value})
    }

    handleInternalIdChange(event) {
        this.setState({ internalId: event.target.value})
    }

    handleDescriptionChange(event) {
        this.setState({ description: event.target.value})
    }

    handleLanguageChange(event) {
        this.setState({
            languageChosen: event.target.value
        });
    }

    handleSubmit() {
        const {addNewGroup, groupTypeName, personId} = this.props;
        const {groupName, languageChosen, description, internalId} = this.state;
        var isValid = true;
        if (!groupName) {
            this.setState({ groupNameError: "Please enter a group name" });
            isValid = false;
        }

        if (!languageChosen || languageChosen === '- -') {
            this.setState({ languageError: "Please choose a native text language" });
            isValid = false;
        }
        isValid && addNewGroup(personId, groupTypeName, groupName, languageChosen, internalId, description);
        this.setState({ showNextButton: false });
    }

    render() {
          let {languageList, groupTypeDescription} = this.props;
          let {languageChosen, groupName, groupNameError, languageError, description, internalId, showNextButton} = this.state;

          return (
            <div className={styles.container}>
                <form method="post" encType="multipart/form-data" id="my-awesome-dropzone" className={styles.form}>
                    <div className={globalStyles.pageTitle}>
                        Create New
                    </div>
                    <div className={styles.subTitle}>
                        {groupTypeDescription}
                    </div>
                    <div className={styles.containerName}>
                        <InputText
                            value={groupName}
                            size={"medium-long"}
                            name={"groupName"}
                            label={"Group name"}
                            onChange={this.handleNameChange}
                            error={groupNameError}/>
                        <InputText
                            value={internalId}
                            size={"medium"}
                            name={"internalId"}
                            label={"Internal id"}
                            onChange={this.handleInternalIdChange}/>
                        <div className={styles.column}>
                            <span className={styles.label}>Description (optional)</span>
                            <textarea rows={5} cols={42} value={description} onChange={(event) => this.handleDescriptionChange(event)}
                                className={styles.messageBox}></textarea>
                        </div>
                    </div>
                    <div className={styles.languageDiv}>
                        <SelectSingleDropDown
                            label={`Native Text Language`}
                            value={languageChosen}
                            options={languageList || []}
                            error={''}
                            height={`medium`}
                            className={styles.singleDropDown}
                            id={`languageChosen`}
                            onChange={this.handleLanguageChange} />
                        <div className={styles.errorLanguage}>{languageError}</div>
                    </div>
                    <hr />
                    <div className={styles.row}>
                        {showNextButton && <span onClick={this.handleSubmit} className={styles.button}>{`Next ->`}</span>}
                        <Loading loadingText={`Loading`} isLoading={!showNextButton}/>
                    </div>
                    <OneFJefFooter />
                </form>
            </div>
        )
    }
};

//    djsConfig={djsConfig} />
