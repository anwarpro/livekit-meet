import React, { Dispatch, SetStateAction } from 'react';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import moment from 'moment';

type IProps = {
  fetchData: Dispatch<SetStateAction<void>>;
  fields: object[];
  items: object[];
};

const EventsTable = (props: IProps) => {
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
                            <IconButton
                              // onClick={() => handleEdit(row)}
                              aria-label="delete"
                              color="info"
                            >
                              <InfoIcon />
                            </IconButton>
                          </div>
                        </TableCell>
                      ) : column.id === 'startTime' ? (
                        <TableCell className="pe-auto">{moment(value).format('hh:mm A')}</TableCell>
                      ) : column.id === 'endTime' ? (
                        <TableCell className="pe-auto">{moment(value).format('hh:mm A')}</TableCell>
                      ) : column.id === 'duration' ? (
                        <TableCell className="pe-auto">
                          {/* {moment.utc(value).format('HH:mm')} */}
                          {moment(value).format('HH:mm:ss')}
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

export default EventsTable;
