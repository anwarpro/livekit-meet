import React, { SetStateAction, Dispatch } from 'react';
import {
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import moment from 'moment';

type IProps = {
  fields: object[];
  items: object[];
  total: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
  handleEdit: Dispatch<SetStateAction<void>>;
  handleDelete: Dispatch<SetStateAction<void>>;
  //   setChecked: Dispatch<SetStateAction<boolean>>;
};
const MaintenanceTable = (props: IProps) => {
  const handleChangePage = (event: any, newPage: any) => {
    props?.setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: any) => {
    props?.setLimit(+event.target.value);
    props?.setPage(1);
  };

  //   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     props.setChecked(event.target.checked);
  //   };

  return (
    <div>
      <>
        <TableContainer sx={{ maxHeight: 840 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {props?.fields?.map((column: any) => (
                  <TableCell
                    sx={{
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      fontWeight: 800,
                      backgroundColor: '#f7f7f8',
                      color: '#100324B2',
                    }}
                    key={column.id}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '& td': {
                  color: '#100324B2',
                },
              }}
            >
              {props?.items?.map((row: any) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {props?.fields?.map((column: any) => {
                      const value = row[column.id];
                      return (
                        <>
                          {column.id === 'action' ? (
                            <TableCell className="pe-auto">
                              <div className="d-flex">
                                <IconButton
                                  aria-label="delete"
                                  color="info"
                                  onClick={() => props.handleEdit(row?._id)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  aria-label="delete"
                                  color="info"
                                  onClick={() => props.handleDelete(row?._id)}
                                >
                                  <DeleteForeverIcon />
                                </IconButton>
                              </div>
                            </TableCell>
                          ) : column.id === 'createdAt' ? (
                            <TableCell className="pe-auto">
                              {moment(row.createdAt).format('DD MMM yyy')}
                            </TableCell>
                          ) : column.id === 'status' ? (
                            <TableCell className="pe-auto">
                              <Switch
                                checked={row.status}
                                // onChange={handleChange}
                                inputProps={{ 'aria-label': 'controlled' }}
                              />
                            </TableCell>
                          ) : (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                          )}
                        </>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          sx={{
            '& p': {
              m: 0,
            },
          }}
          className="mt-4"
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={props?.total}
          rowsPerPage={props?.limit}
          page={props?.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </>
    </div>
  );
};

export default MaintenanceTable;
