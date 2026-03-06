import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './WorkSettingsView.css';
const p = 'WorkSettingsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import { Link } from 'react-router';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import OneFJefFooter from '../../components/OneFJefFooter';
import WorkAddOrUpdate from '../../components/WorkAddOrUpdate';
import MessageModal from '../../components/MessageModal';
import classes from 'classnames';

class WorkSettingsView extends Component {
    constructor(props) {
      super(props);

      this.state = {
					isShowingModal_comment: false,
      };
    }

    componentDidMount() {
        const {workSummary} = this.props;
        this.setState({workName: workSummary.title});
    }

    onChangeSection = (event) => {
        const {setWorkCurrentSelected, personId, workSummary} = this.props;
        event.preventDefault();
        setWorkCurrentSelected(personId, workSummary.workId, event.target.value, workSummary.languageId_current, "STAY");
    }

    handleDeleteWorkOpen = () => this.setState({isShowingModal_comment: true})
		handleDeleteWorkClose = () => this.setState({isShowingModal_comment: false})
    handleDeleteWork = () => {
				const {deleteWork, workSummary, personId} = this.props;
        deleteWork(personId, workSummary.workId);
				this.handleDeleteWorkClose();
				browserHistory.push('/myWorks');
    }

    render() {
			const {personId, workSummary, groupList, addOrUpdateDocument} = this.props;
      const {isShowingModal_comment} = this.state;

      let chapterOptions = Object.assign([], workSummary.chapterOptions);
      chapterOptions = chapterOptions && chapterOptions.length > 0 && chapterOptions.map(m => {
          m.label = m.label && m.label.length > 35 ? m.label.substring(0,35) + '...' : m.label;
          return m;
      })

      return (
        <div className={styles.chapterer}>
            <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                <L p={p} t={`Document Settings`}/>
            </div>
            <WorkAddOrUpdate submitOuterPage={() => {}} languageList={workSummary.languageOptions} groupList={groupList}
                workSummary={workSummary} personId={personId} workId={workSummary.workId} groupChosen={workSummary.groupId}
                isNotEditMode={true} showButton={true} addOrUpdateDocument={addOrUpdateDocument} showMoreInfo={true}/>
            {chapterOptions && chapterOptions.length > 1 &&
                <div className={styles.selectListClass}>
                    <SelectSingleDropDown
                        id={`workSections`}
                        label={<L p={p} t={`Section`}/>}
                        indexName={'inLineSection'}
                        value={workSummary.chapterId_current}
                        options={chapterOptions}
                        noBlank={true}
                        error={''}
                        height={`medium`}
                        onChange={this.onChangeSection} />
                </div>
            }
            <ul className={styles.unorderedList}>
                <li><hr /></li>
                <li><Link to={`/workSections`} className={styles.menuItem}>
                        <L p={p} t={`Sections / Chapters`}/>
                        <span className={styles.marginLeft}><L p={p} t={`(add, merge, split or delete)`}/></span>
                    </Link>
                </li>
                <li><hr /></li>
                {workSummary.authorPersonId === personId && <li><Link to={`/giveAccessToEditors`} className={styles.menuItem}><L p={p} t={`Give Access to your Editors`}/></Link></li>}
                {workSummary.authorPersonId === personId &&
								<li><hr /></li>}
                {workSummary.authorPersonId === personId && <li><Link to={`/workDownload`} className={styles.menuItem}><L p={p} t={`Download (Export)`}/></Link></li>}
                {workSummary.authorPersonId === personId && <li><Link to={`/draftSettings`} className={styles.menuItem}><L p={p} t={`Draft Comparisons`}/></Link></li>}
                <li><hr /></li>
								{workSummary.authorPersonId === personId && <li><a onClick={this.handleDeleteWorkOpen} className={styles.menuItem}><L p={p} t={`Delete this document`}/></a></li>}
            </ul>
            <OneFJefFooter />
						{isShowingModal_comment &&
							<MessageModal key={'acceptAll'} handleClose={this.handleDeleteWorkClose} heading={<L p={p} t={`Delete this document permanently?`}/>}
								 explainJSX={<L p={p} t={`Are you sure you want to delete this document permanently?`}/>} isConfirmType={true}
								 onClick={this.handleDeleteWork} />
						}
        </div>
    )};
}

export default WorkSettingsView;
