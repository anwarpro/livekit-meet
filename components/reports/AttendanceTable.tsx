import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Image from 'next/image';
import React, { Dispatch, SetStateAction } from 'react';
type IProps = {
  fetchData: Dispatch<SetStateAction<void>>;
  fields: object[];
  items: object[];
};

const AttendanceTable = (props: IProps) => {
  return (
    <TableContainer sx={{ maxHeight: 440 }}>
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
                            {/* <Image
                              onClick={() => handleEdit(row)}
                              className="me-2"
                              style={{ cursor: 'pointer' }}
                              src={EditIcon}
                              width={24}
                              height={24}
                              alt="edit"
                            /> */}
                          </div>
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
  );
};

export default AttendanceTable;
