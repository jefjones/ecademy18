import React, {Component} from 'react';
import globalStyles from '../../utils/globalStyles.css';
import {Link} from 'react-router';
import styles from './FacilitatorMentorSetView.css';
import EditTable from '../../components/EditTable';
import Checkbox from '../../components/Checkbox';
import OneFJefFooter from '../../components/OneFJefFooter';

class FacilitatorMentorSetView extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  selectAll = () => {
      //Loop through all of the data and send off any records that need to be Set
      //We can't just send off all of them to be set one-by-one because it has a toggle effect.  If it is set in the database, it unsets it in the database.
      const {facilitators, personId, addFacilitatorAsMentor} = this.props;
      facilitators && facilitators.length > 0 && facilitators.forEach(m => {
          if (!document.getElementById(m.personId).checked) {
              addFacilitatorAsMentor(personId, m.personId);
          }
      })
  }

  clearAll = () => {
      //Loop through all of the data and send off any records that need to be Set
      //We can't just send off all of them to be set one-by-one because it has a toggle effect.  If it is set in the database, it unsets it in the database.
      const {facilitators, personId, addFacilitatorAsMentor} = this.props;
      facilitators && facilitators.length > 0 && facilitators.forEach(m => {
          if (document.getElementById(m.personId).checked) {
              addFacilitatorAsMentor(personId, m.personId);
          }
      })
  }

  render() {
    const {mentors, facilitators, personId, addFacilitatorAsMentor, companyConfig={}} = this.props;

    let headings = [{label: 'Learning Coach?', tightText: true}, {label: companyConfig.isMcl ? 'Facilitator' : 'Teacher', tightText: true}];
    let data = [[{value: 'Loading...'}]];

    if (facilitators && facilitators.length > 0) {
        data = facilitators && facilitators.length > 0 && facilitators.map(m => {

            let isMentor = mentors && mentors.length > 0 && mentors.filter(d => d.personId === m.personId)[0];
            isMentor = isMentor && isMentor.personId ? true : false;

            return ([
              {id: m.id,
                value: <Checkbox
                          id={m.personId}
                          label={``}
                          checked={isMentor}
                          onClick={() => addFacilitatorAsMentor(personId, m.personId)}
                          className={styles.checkbox} />},
              {id: m.id, value: m.lastName + ', ' + m.firstName},
            ])
        });
    }

    return (
        <section className={styles.container}>
            <div className={globalStyles.pageTitle}>
                {companyConfig.isMcl ? `Set Facilitator as Learning Coach` : `Set Teacher as Learning Coach`}
            </div>
            <div className={styles.selectAll}>
                <Link className={styles.linkText} onClick={this.selectAll}>Select All</Link>
                <span className={styles.separator}>|</span>
                <Link className={styles.linkText} onClick={this.clearAll}>Clear All</Link>
            </div>
            <div className={styles.marginLeft}>
                <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}/>
            </div>
            <OneFJefFooter />
        </section>
    );
  }
}

export default FacilitatorMentorSetView;
