import React, {Component} from 'react';
import { Column, Table } from 'react-virtualized';
import styles from './ReportView.css';
import MemberCard from '../../components/MemberCard/MemberCard.js';
import {doSort} from '../../utils/sort.js';
import {formatDayShortMonthYear} from '../../utils/dateFormat.js';
import PageTitle from '../../components/PageTitle/PageTitle.js';
import TabPage from '../../components/TabPage/TabPage.js';
import FilterOptions from '../../components/FilterOptions/FilterOptions.js';

const SortDirection = {
  ASC: 'ASC',
  DESC: 'DESC'
};

export default class ReportView extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
        list: props.data
    }

    this._sort = this._sort.bind(this);

  }


  // componentWillUpdate (nextProps, nextState) {
//     const {
//       sortBy: prevSortBy,
//       sortDirection: prevSortDirection
//     } = this.state
//     if (
//       nextState.sortBy !== prevSortBy ||
//       nextState.sortDirection !== prevSortDirection
//     ) {
//       const { sortBy, sortDirection } = nextState
//       let { list } = this.props
//     }
  // }

  // componentDidMount() {
  //     this.setState({list: this.props.data});
  // }

  includeLineBreak ({
      cellData,
      columnData,
      columnIndex,
      dataKey,
      isScrolling,
      rowData,
      rowIndex
    }: CellRendererParams): string {
      if (cellData == null) {
        return ''
      } else {
        var divided = cellData.split("<br />");
        return <span>{divided[0]}<br />{divided[1]}</span>
      }
    }

includeMemberCard ({
    cellData,
    columnData,
    columnIndex,
    dataKey,
    isScrolling,
    rowData,
    rowIndex
  }: CellRendererParams): string {
    if (cellData == null) {
      return ''
    } else {
      return <MemberCard member={cellData}>{cellData.title.label}</MemberCard>

    }
  }

  doNotShow ({
      cellData,
      columnData,
      columnIndex,
      dataKey,
      isScrolling,
      rowData,
      rowIndex
    }: CellRendererParams): string {
        return ''
    }


  formatDate ({
      cellData,
      columnData,
      columnIndex,
      dataKey,
      isScrolling,
      rowData,
      rowIndex
    }: CellRendererParams): string {
      if (cellData == null) {
        return ''
      } else {
        return formatDayShortMonthYear(cellData);
      }
    }

  render() {
    const { list, sortBy="name", sortDirection=SortDirection.ASC } = this.state

    const {tabs=[], data=[], headings=[], orgSections=[], sortByHeadings={}, columnsToHide=[], pageTitle="", pageDescription="",
                            activeTab="", subOrgs=[], subOrgId, searchText, filterControls, setActiveTab, sortRecords} = this.props;

    return (
        <div className={styles.outerContainer}>
            <PageTitle title={pageTitle} description={pageDescription} printURL={() => {}}/>
            {filterControls && <FilterOptions controls={filterControls} />}
            {tabs && <TabPage tabs={tabs} chosenTab={activeTab} onClick={setActiveTab}/>}
              <Table
                sort={this._sort}
                sortBy={sortBy}
                sortDirection={sortDirection}
                className={styles.table}
                headerClassName={styles.tableHeader}
                rowClassName={styles.tableRows}
                width={1200}
                height={450}
                headerHeight={20}
                rowHeight={50}
                rowCount={data.length}
                rowGetter={({ index }) => data[index]}
              >
                {headings.map((column, i) =>
                    columnsToHide.indexOf(column.id) === -1 &&
                    <Column key={i}
                      label={column.isFastScrollHidden ? ' ' : column.label}
                      dataKey={column.id}
                      width={column.width}
                      headerClassName={column.isFastScrollHidden ? styles.nameHeader : (column.notLink ? styles.notLinkText : '')}
                      cellRenderer={column.isFastScrollMemberCard ? this.includeMemberCard :
                                (column.isFastScrollDate ? this.formatDate :
                                (column.hasFastScrollLineBreak ? this.includeLineBreak :
                                (column.isFastScrollHidden? this.doNotShow : column.cellRenderer)))}
                      disableSort={column.notLink ? true : false}
                    />
                )}
              </Table>
              <span className={styles.countText}>Count: {data.length}</span>
        </div>
    )
  }

  _sort ({ sortBy, sortDirection }) {
        //notice that the sortRecords which is not local is called but we are also seting the local sortBy and sortDirection sa well
        //  so that the local-data asc/desc arrow shows up as we affect the non-local version of the data.
        sortBy = sortBy === 'cardData' ? 'name' : sortBy;
        this.props.sortRecords(sortBy);
        const {
          sortBy: prevSortBy,
          sortDirection: prevSortDirection
      } = this.state;

        if (prevSortBy === 'cardData') {
            this.setState({prevSortBy: 'name'});
        }

        sortDirection = sortBy === prevSortBy ? (prevSortDirection === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC) : SortDirection.ASC;
        let newList = this.state.list;

        newList = doSort(newList, {
            sortField: sortBy,
            isAsc: sortDirection === SortDirection.ASC ? true : false,
            isNumber: sortBy === "age" ? true : false
        });

        this.setState({ list: newList, sortBy, sortDirection })

  }}
