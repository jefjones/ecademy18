import React, {Component} from 'react';
import LearnerAddView from '../views/LearnerAddView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionLearners from '../actions/learners.js';
import * as actionStudent from '../actions/student.js';
import * as actionGradeLevel from '../actions/grade-level';
import * as loginUser from '../actions/login';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectStudents, selectUsers, selectCompanyConfig, selectGradeLevels, selectTheStudent } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
		let me = selectMe(state);
    let student = selectTheStudent(state);
    if (student && student.id) {
        student.studentId = student.externalId;
        student.birthDate = student.birthDate.indexOf('T') > -1 ? student.birthDate.substring(0, student.birthDate.indexOf('T')) : student.birthDate;
    }

    return {
				loginData: me,
				langCode: me.langCode,
        studentPersonId: props.params.studentPersonId,
        student,
        companyConfig: selectCompanyConfig(state),
        personId: selectMe(state) && selectMe(state).personId,
        existingLearners: selectStudents(state),
        mentors: selectUsers(state, 'Mentor'),
				gradeLevels: selectGradeLevels(state),
        tabsData: {chosenTab: 'FieldEntry', tabs: [{id: 'FieldEntry', label: 'Field Entry'}, {id: 'BulkPaste', label: 'Bulk Paste'}]},
        bulkDelimiterOptions: [{id: 'comma', label: ', comma'},
            {id: 'semicolon', label: '; semicolon'},
            {id: 'hyphen', label: '- hyphen'},
            {id: 'tab', label: 'tab'},
        ],
        fieldOptions: [
            {id: 'firstName', label: 'first name'},
            {id: 'lastName', label: 'last name'},
            {id: 'fullNameLastFirst', label: 'full name (last name first)'},
            {id: 'fullNameFirstFirst', label: 'full name (first name first)'},
            {id: 'birthDate', label: 'birth date'},
            {id: 'emailAddress', label: 'email address'},
						{id: 'externalId', label: 'student id (for other school systems)'},
						{id: 'gradeLevelCode', label: 'grade level'}, //This is the number, except for kindergarten which would be K (and also preK2days, preK4days)
            {id: 'mentor', label: 'learning coach'},
            {id: 'firstNameParent1', label: 'primary guardian first name'},
						{id: 'lastNameParent1', label: 'primary guardian last name'},
            {id: 'phoneParent1', label: 'primary guardian phone'},
            {id: 'fullNameLastFirstParent1', label: 'primary guardian full name (last name first)'},
            {id: 'fullNameFirstFirstParent1', label: 'primary guardian full name (first name first)'},
            {id: 'emailAddressParent1', label: 'primary guardian email address'},
            {id: 'firstNameParent2', label: 'secondary guardian first name'},
            {id: 'lastNameParent2', label: 'secondary guardian last name'},
						{id: 'phoneParent2', label: 'secondary guardian phone'},
            {id: 'fullNameLastFirstParent2', label: 'secondary guardian full name (last name first)'},
            {id: 'fullNameFirstFirstParent2', label: 'secondary guardian full name (first name first)'},
						{id: 'emailAddressParent2', label: 'secondary guardian email address'},
						{id: 'studentPhone', label: 'student cell phone'},
        ],
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getTheStudent: (personId, studentPersonId) => dispatch(actionStudent.getTheStudent(personId, studentPersonId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    addLearner: (personId, learners) => dispatch(actionLearners.addLearner(personId, learners)),
    updateLearner: (personId, learner) => dispatch(actionLearners.updateLearner(personId, learner)),
    removeLearner: (personId, member_personId) => dispatch(actionLearners.removeLearner(personId, member_personId)),
		getGradeLevels: () => dispatch(actionGradeLevel.init()),
		isDuplicateUsername: (username) => dispatch(loginUser.isDuplicateUsername(username)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
		componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, personId, getGradeLevels, getTheStudent, studentPersonId} = this.props;
        getPageLangs(personId, langCode, 'LearnerAddView');
				getGradeLevels();
        getTheStudent(personId, studentPersonId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Add Student`});
		}

    render() {
        return <LearnerAddView {...this.props} />
    }
}

export default storeConnector(Container);
