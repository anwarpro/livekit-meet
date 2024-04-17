import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  alpha,
} from '@mui/material';
// import DeleteIcon from '../assets/icons/trust.png';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '../assets/icons/edit.png';
import Image from 'next/image';
import styled from '@emotion/styled';
import SearchIcon from '@mui/icons-material/Search';
import { debounce } from 'lodash';
import SuccessPopUp from './SuccessPopUp';
import meetService from '../../service/meet/meetService';
import { IMeet } from '../../types/meet';
import swal from 'sweetalert';
import ParticipantDeleteModal from './ParticipantDeleteModal';

type IProps = {
  fields: object[];
  items: object[];
  total: number;
  page: number;
  searchText: string;
  setPage: Dispatch<SetStateAction<number>>;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
  setSearchText: Dispatch<SetStateAction<string>>;
  fetchData: Dispatch<SetStateAction<void>>;
  fetchMeetData: Dispatch<SetStateAction<void>>;
  data: IMeet;
  tabName: string;
  isLoading: boolean;
};

const ParticipantListTable = (props: IProps) => {
  const [successModal, setSuccessModal] = useState<{ edit: boolean }>({ edit: false });
  const [debounceSearch, setDebounceSearch] = useState('');
  const [internalUsers, setInternalUsers] = useState([] as string[]);
  const [externalUsers, setExternalUsers] = useState([] as string[]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState('');
  const handleSearch = (e: any) => {
    props?.setPage(1);
    setDebounceSearch(e.target.value);
  };

  const handleSelect = (e: any, newValue: any) => {
    if (props.tabName == 'internal') setInternalUsers(newValue);
    else setExternalUsers(newValue);
  };

  const handleClickDeleteDialogOpen = (email: string) => {
    setOpenDeleteDialog(true);
    setDeleteEmail(email);
  };

  const handleDelete = () => {
    if (props.tabName === 'internal') {
      meetService
        .removerInternalParticipant(props.data?._id as string, {
          internalParticipantList: [deleteEmail],
        })
        .then((res: any) => {
          console.log('res ==>', res.data?.data);
          props.fetchData();
          props.fetchMeetData();
        })
        .catch((err) => {
          console.log('err', err);
          swal('Oops...', err?.response?.data.message, 'error');
        });
    } else {
      meetService
        .removerExternalParticipant(props.data?._id as string, {
          externalParticipantList: [deleteEmail],
        })
        .then((res: any) => {
          console.log('res ==>', res.data?.data);
          props.fetchData();
          props.fetchMeetData();
        })
        .catch((err) => {
          console.log('err', err);
          swal('Oops...', err?.response?.data.message, 'error');
        });
    }
  };
  const handleAddParticipant = () => {
    if (props.tabName === 'internal') {
      meetService
        .addInternalParticipant(props.data?._id as string, {
          internalParticipantList: internalUsers,
        })
        .then((res: any) => {
          console.log('res ==>', res.data?.data);
          props.fetchData();
          props.fetchMeetData();
          setInternalUsers([]);
        })
        .catch((err) => {
          console.log('err', err);
          swal('Oops...', err?.response?.data.message, 'error');
        });
    } else {
      meetService
        .addExternalParticipant(props.data?._id as string, {
          externalParticipantList: externalUsers,
        })
        .then((res: any) => {
          console.log('res ==>', res.data?.data);
          props.fetchData();
          props.fetchMeetData();
          setExternalUsers([]);
        })
        .catch((err) => {
          console.log('err', err);
          swal('Oops...', err?.response?.data.message, 'error');
        });
    }
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
    <div style={{ maxHeight: '500px' }}>
      <div className="search mb-3">
        <Grid container className="mb-3" justifyContent="center" alignItems="center">
          {/* <label className="mb-2" htmlFor="externalParticipantList">
            Add New Email
          </label> */}
          <Grid item xs={10}>
            <Autocomplete
              multiple
              size="small"
              filterSelectedOptions
              id="tags-filled"
              options={[{ email: 'israfil@programming-hero.com' }].map((option) => option.email)}
              defaultValue={props.tabName === 'internal' ? internalUsers : externalUsers}
              freeSolo
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <div key={index}>
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  </div>
                ))
              }
              onChange={(e, newValue) => handleSelect(e, newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="externalParticipantList"
                  placeholder="type and press enter to add email"
                />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <Button onClick={() => handleAddParticipant()} variant="contained" className="ms-2">
              ADD
            </Button>
          </Grid>
        </Grid>
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

      {props.isLoading ? (
        <Skeleton variant="rounded" height={350} />
      ) : (
        <Box>
          <TableContainer sx={{ height: 350 }}>
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
                        const value = row;
                        return (
                          <>
                            {column.id === 'action' ? (
                              <TableCell className="pe-auto">
                                <Tooltip title="Remove this user">
                                  <IconButton>
                                    <DeleteIcon
                                      onClick={() => handleClickDeleteDialogOpen(row)}
                                      color="error"
                                      style={{ cursor: 'pointer' }}
                                    />
                                  </IconButton>
                                </Tooltip>
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
        </Box>
      )}

      <SuccessPopUp openModal={successModal} />
      <ParticipantDeleteModal
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        handleDelete={handleDelete}
        deleteEmail={deleteEmail}
      />
    </div>
  );
};

export default ParticipantListTable;
