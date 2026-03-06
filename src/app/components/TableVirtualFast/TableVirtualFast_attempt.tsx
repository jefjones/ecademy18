
//import PropTypes from 'prop-types';
import clsx from 'clsx'
import { withStyles } from '@mui/styles'
import TableCell from '@mui/material/TableCell'
//import Paper from '@mui/material/Paper';
import { AutoSizer, Column, Table } from 'react-virtualized'

const styles = theme => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
			marginLeft: '1px !important',
			padding: '0px !important',
			alignItems: 'flex-start !important',
			textTransform: 'none !important',
      flip: false,
      //paddingRight: theme.direction === 'rtl' ? '0px !important' : undefined,
    },
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
		padding: '0px !important',
		alignItems: 'flex-start !important',
    flex: 1,
		marginLeft: '1px !important',
  },
  noClick: {
    cursor: 'initial',
  },
})

function MuiVirtualizedTable(props) {
  const { classes, columns, rowHeight, headerHeight, ...tableProps } = props
      return (
        <AutoSizer>
          {({ height, width }) => (
            <Table
              height={height}
              width={width}
              rowHeight={rowHeight}
              gridStyle={{
                direction: 'inherit',
              }}
              headerHeight={headerHeight}
              className={classes.table}
              {...tableProps}
              rowClassName={getRowClassName}
            >
              {columns.map(({ dataKey, ...other }, index) => {
                return (
                  <Column
                    key={dataKey}
                    headerRenderer={headerProps =>
                      headerRenderer({
                        ...headerProps,
                        columnIndex: index,
                      })
                    }
                    className={classes.flexContainer}
                    cellRenderer={cellRenderer}
                    dataKey={dataKey}
                    {...other}
                  />
                )
              })}
            </Table>
          )}
        </AutoSizer>
      )
}

// MuiVirtualizedTable.propTypes = {
//   classes: PropTypes.object.isRequired,
//   columns: PropTypes.arrayOf(
//     PropTypes.shape({
//       dataKey: PropTypes.string.isRequired,
//       label: PropTypes.string.isRequired,
//       numeric: PropTypes.bool,
//       width: PropTypes.number.isRequired,
//     }),
//   ).isRequired,
//   headerHeight: PropTypes.number,
//   onRowClick: PropTypes.func,
//   rowHeight: PropTypes.number,
// };

export default withStyles(styles)(MuiVirtualizedTable)

// ---

// const sample = [
//   ['Frozen yoghurt', 159, 6.0, 24, 4.0],
//   ['Ice cream sandwich', 237, 9.0, 37, 4.3],
//   ['Eclair', 262, 16.0, 24, 6.0],
//   ['Cupcake', 305, 3.7, 67, 4.3],
//   ['Gingerbread', 356, 16.0, 49, 3.9],
// ];
//
// function createData(id, dessert, calories, fat, carbs, protein) {
//   return { id, dessert, calories, fat, carbs, protein };
// }
//
// const rows = [];
//
// for (let i = 0; i < 20000; i += 1) {
//   const randomSelection = sample[Math.floor(Math.random() * sample.length)];
//   rows.push(createData(i, ...randomSelection));
// }
//
// export default function ReactVirtualizedTable() {
//   return (
//     <Paper style={{ height: 400, width: '100%' }}>
//       <VirtualizedTable
//         rowCount={rows.length}
//         rowGetter={({ index }) => rows[index]}
//         columns={[
//           {
//             width: 200,
//             label: 'Dessert',
//             dataKey: 'dessert',
//           },
//           {
//             width: 120,
//             label: 'Calories\u00A0(g)',
//             dataKey: 'calories',
//             numeric: true,
//           },
//           {
//             width: 120,
//             label: 'Fat\u00A0(g)',
//             dataKey: 'fat',
//             numeric: true,
//           },
//           {
//             width: 120,
//             label: 'Carbs\u00A0(g)',
//             dataKey: 'carbs',
//             numeric: true,
//           },
//           {
//             width: 120,
//             label: 'Protein\u00A0(g)',
//             dataKey: 'protein',
//             numeric: true,
//           },
//         ]}
//       />
//     </Paper>
//   );
// }
