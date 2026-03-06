import React, {Component} from 'react';
import ReactExport from '../ReactDataExport'//"react-data-export";
import styles from './ExcelRecommendCourseCount.css';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default class extends Component {
    render() {
				const {report} = this.props;

				const dataSet1 = report && report.length > 0 && report.map(m => ({
						courseName: m.courseName,
						externalId: m.externalId,
						studentCount: m.studentCount
				}));

        return (
            <ExcelFile className={styles.change}>
                <ExcelSheet data={dataSet1} name={`Course Name with Student Count`}>
										<ExcelColumn label={`Course Name`} value="courseName"/>
										<ExcelColumn label={`Course Code`} value="externalId"/>
                    <ExcelColumn label={`Student Count`} value="studentCount"/>
                </ExcelSheet>
            </ExcelFile>
        );
    }
}


//<ExcelColumn key={i} label={<div className={styles.row}><div>{m.title} {(m.totalPoints && ' (' + m.totalPoints + ')')} {m.dueDate && ' ['}</div> <DateMoment date={m.dueDate} format={'D MMM'}/><div> {m.dueDate && ']'}</div></div>} value={m.assignmentId}/>
