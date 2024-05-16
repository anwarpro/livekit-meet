import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import {
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import moment from 'moment';
import { useRouter } from 'next/router';
import { debounce } from 'lodash';
import SearchIcon from '@mui/icons-material/Search';
import { IMeet } from '../../types/meet';
import ScheduleParticipantModal from '../schedule/ScheduleParticipantModal';

type IProps = {
  fetchData: Dispatch<SetStateAction<void>>;
  fields: object[];
  items: object[];
  total: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
};

const PreviousMeetListTable = (props: IProps) => {
  const router = useRouter();
  const [debounceSearch, setDebounceSearch] = useState('');
  const [openParticipantModal, setOpenParticipantModal] = useState<{ edit: boolean }>({
    edit: false,
  });
  const [editable, setEditable] = useState<IMeet>();
  const getDuration = (value: any) => {
    const seconds = value / 1000;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);
    let time;
    if (hours >= 1) {
      if (minutes > 0) {
        time = `${hours} hr : ${minutes} min`;
      } else {
        time = `${hours} hr`;
      }
    } else {
      time = `${minutes} min`;
    }
    return time;
  };

  const handleSearch = (e: any) => {
    props?.setPage(1);
    setDebounceSearch(e.target.value);
  };

  const searchApi = () => {
    if (debounceSearch !== null) {
      props?.setSearchText(debounceSearch);
    }
  };

  const delayedQuery = useCallback(debounce(searchApi, 500), [debounceSearch]);

  useEffect(() => {
    delayedQuery();
    return delayedQuery.cancel;
  }, [debounceSearch, delayedQuery]);

  const handleChangePage = (event: any, newPage: any) => {
    props?.setPage(newPage + 1);
    setDebounceSearch('');
  };

  const handleChangeRowsPerPage = (event: any) => {
    props?.setLimit(+event.target.value);
    setDebounceSearch('');
    props?.setPage(1);
    props?.setSearchText('');
  };

  return (
    <>
      <div className="search mb-3 d-flex align-items-center justify-content-between">
        <TextField
          id="input-with-icon-textfield"
          hiddenLabel
          placeholder="Search..."
          size="small"
          value={debounceSearch}
          style={{ backgroundColor: '#f7f7f8', color: '#100324B2' }}
          onChange={(e: any) => handleSearch(e)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      </div>
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
                              <Tooltip title="Show Joined Participants List">
                                <IconButton
                                  onClick={() => router.push(`/dashboard/report/${row._id}`)}
                                  aria-label="delete"
                                  color="info"
                                >
                                  <InfoIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Show Invited Participants List">
                                <IconButton
                                  onClick={() => {
                                    setOpenParticipantModal({ edit: true });
                                    setEditable(row);
                                  }}
                                  aria-label="delete"
                                  color="info"
                                >
                                  <AccountCircleIcon />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </TableCell>
                        ) : column.id === 'startTime' ? (
                          <TableCell className="pe-auto">
                            {moment(value).format('hh:mm A')}
                          </TableCell>
                        ) : column.id === 'endTime' ? (
                          <TableCell className="pe-auto">
                            {moment(value).format('hh:mm A')}
                          </TableCell>
                        ) : column.id === 'duration' ? (
                          <TableCell className="pe-auto">{getDuration(value)}</TableCell>
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
      <ScheduleParticipantModal
        openParticipantModal={openParticipantModal}
        editable={editable!}
        canAdd={false}
        // fetchData={fetchData}
        // setSuccessModal={setSuccessModal}
        // reschedule
      />
    </>
  );
};

export default PreviousMeetListTable;
