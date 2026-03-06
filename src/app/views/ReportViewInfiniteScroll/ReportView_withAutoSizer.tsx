import { useEffect, useState } from 'react'
import styles from './ReportView.css'
import Immutable from 'immutable'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader'

const STATUS_LOADING = 1
const STATUS_LOADED = 2

function ReportView(props) {
  const [loadedRowCount, setLoadedRowCount] = useState(0)
  const [loadedRowsMap, setLoadedRowsMap] = useState({})
  const [loadingRowCount, setLoadingRowCount] = useState(0)

  useEffect(() => {
    return () => {
      
          Object.keys(_timeoutIdMap).forEach(timeoutId => {
            clearTimeout(timeoutId)
          })
        
    }
  }, [])

  const { data } = context
      let list = ['jim', 'jan', 'jill', 'jimmer', 'arnold','julie','jillyn','jeannie','jannie','jimmy','Chad','peter','simpson']
  
      return (
          <InfiniteLoader
            isRowLoaded={_isRowLoaded}
            loadMoreRows={_loadMoreRows}
            rowCount={list.length}
          >
            {({ onRowsRendered, registerChild }) => (
              <AutoSizer disableHeight>
                {({ width }) => (
                  <List
                    ref={registerChild}
                    className={styles.List}
                    height={200}
                    onRowsRendered={onRowsRendered}
                    rowCount={list.length}
                    rowHeight={30}
                    rowRenderer={_rowRenderer}
                    width={width}
                  />
                )}
              </AutoSizer>
            )}
          </InfiniteLoader>
      )
}
export default ReportView
