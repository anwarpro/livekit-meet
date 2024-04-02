import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  InputBase,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  alpha,
} from '@mui/material';
import DeleteIcon from '../assets/icons/trust.png';
import EditIcon from '../assets/icons/edit.png';
import Image from 'next/image';
import styled from '@emotion/styled';
import SearchIcon from '@mui/icons-material/Search';
import UserDetails from './UserDetails';

type IProps = {
  fields: object[];
  items: object[];
  total: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
  setSearch: Dispatch<SetStateAction<string>>;
};

const UserListTable = (props: IProps) => {
  const [openModal, setOpenModal] = useState<{ edit: boolean }>({ edit: false });

  const handleChangePage = (event: any, newPage: any) => {
    // props?.setPage(newPage + 1);
    console.log(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    props?.setLimit(+event.target.value);
    props?.setPage(1);
  };

  const handleSearch = (e: any) => {
    // let filterTimeout;
    // clearTimeout(filterTimeout);
    // filterTimeout = setTimeout(() => {
    //   props?.setSearch(e.target.value);
    //   props?.setPage(1);
    // }, 500);
  };

  //   const deleteContact = useMutation((id) => contactService.deleteContactInfo(id), {
  //     onSuccess() {
  //       queryClient.invalidateQueries('contact_form');
  //       swal('', 'contact deleted!', 'success');
  //     },
  //     onError(err) {
  //       if (err.response?.status === 401) {
  //         swal('Error', err.response?.data?.msg, 'error');
  //       }
  //     },
  //   });
  const handleDelete = (id: string) => {
    // swal({
    //   title: 'Are you sure?',
    //   text: '',
    //   icon: 'warning',
    //   buttons: true,
    //   dangerMode: true,
    // })
    //   .then((isSure) => {
    //     if (isSure) {
    //       deleteContact.mutateAsync(id);
    //     }
    //   })
    //   .catch((error) => {
    //     swal('', 'Delete failed', 'error');
    //   });
  };
  const handleEdit = (id: string) => {
    setOpenModal({ edit: true });
  };
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: 10,
    backgroundColor: '#dde2ec',
    '&:hover': {
      backgroundColor: '#dde2ec',
    },
    marginLeft: 0,
    width: '25%',
  }));
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: '10px',
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
      padding: '12px',
      paddingLeft: '40px',
    },
  }));
  return (
    <div>
      <div className="search mb-3">
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
        </Search>
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
                    fontWeight: 500,
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
                              <Image
                                onClick={() => handleEdit(row?._id)}
                                className="me-2"
                                src={EditIcon}
                                width={24}
                                height={24}
                                alt="edit"
                              />
                              <Image
                                onClick={() => handleDelete(row?._id)}
                                src={DeleteIcon}
                                width={20}
                                height={20}
                                alt="delete"
                              />
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

      <UserDetails openModal={openModal} />
    </div>
  );
};

export default UserListTable;
