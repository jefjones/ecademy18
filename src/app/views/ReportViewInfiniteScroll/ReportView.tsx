import React, {Component} from 'react'
import { Column, Table } from 'react-virtualized'
import styles from './ReportView.css'
import MemberCard from '../../components/MemberCard/MemberCard'
import {doSort} from '../../utils/sort'
import {formatDayShortMonthYear} from '../../utils/dateFormat'
import PageTitle from '../../components/PageTitle/PageTitle'
import TabPage from '../../components/TabPage/TabPage'
import FilterOptions from '../../components/FilterOptions/FilterOptions'

const SortDirection = {
  ASC: 'ASC',
  DESC: 'DESC'
}

function ReportView(props) {
  const [list, setList] = useState(props.data)
  const [prevSortBy, setPrevSortBy] = useState('name')
  const [sortBy, setSortBy] = useState(prevSortBy)

  const {tabs=[], data=[], headings=[], orgSections=[], sortByHeadings={}, columnsToHide=[], pageTitle="", pageDescription="",
                              activeTab="", subOrgs=[], subOrgId, searchText, filterControls, setActiveTab, sortRecords} = props
  
      return (
          <div className={styles.outerContainer}>
              <PageTitle title={pageTitle} description={pageDescription} printURL={() => {}}/>
              {filterControls && <FilterOptions controls={filterControls} />}
              {tabs && <TabPage tabs={tabs} chosenTab={activeTab} onClick={setActiveTab}/>}
                <Table
                  sort={_sort}
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
                        cellRenderer={column.isFastScrollMemberCard ? includeMemberCard :
                                  (column.isFastScrollDate ? formatDate :
                                  (column.hasFastScrollLineBreak ? includeLineBreak :
                                  (column.isFastScrollHidden? doNotShow : column.cellRenderer)))}
                        disableSort={column.notLink ? true : false}
                      />
                  )}
                </Table>
                <span className={styles.countText}>Count: {data.length}</span>
          </div>
      )
}
export default ReportView
