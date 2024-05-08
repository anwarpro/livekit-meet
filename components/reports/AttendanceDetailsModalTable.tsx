import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import moment from 'moment';
import React from 'react';
type IProps = {
  fields: object[];
  items: {
    identity: string;
    attendanceInfo: string[];
  };
};
const AttendanceDetailsModalTable = (props: IProps) => {
  return (
    <div>
      <TableContainer sx={{ maxHeight: 440}}>
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
            {props?.items?.attendanceInfo?.map((row: any) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {props?.fields?.map((column: any) => {
                    const value = row[column.id];
                    return (
                      <>
                        {column.id === 'identity' ? (
                          <TableCell className="pe-auto">{props?.items?.identity}</TableCell>
                        ) : column.id === 'createdAt' ? (
                          <TableCell className="pe-auto">
                            {moment(value).format('hh:mm A')}
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
    </div>
  );
};

export default AttendanceDetailsModalTable;
