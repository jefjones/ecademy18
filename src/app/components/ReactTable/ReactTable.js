import React, {Component} from 'react';
import styles from './ReactTable.css';
import ReactTable from 'react-table';

//The left-side columns that need to be frozen need to have the "fixed: true" in their object data.

export default class extends Component {
  constructor ( props ) {
        super( props );

        this.state = {
        }
    }

    render() {
      const {data, headings, hideTip} = this.props;
      return (
          <div className={styles.maxWidth}>
              <ReactTable
                data={data}
                columns={headings}
                pageSize={data.length}
                showPagination={false}
              />
              <br />
              {!hideTip && <em>Tip: Hold shift key while clicking a table header in order to sort by more than one column!</em>}
          </div>
      )
    }
}
//defaultPageSize={defaultRowCount}
