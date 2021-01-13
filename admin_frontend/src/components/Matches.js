import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';;
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Grid } from "@material-ui/core";


import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { Container } from '@material-ui/core';
import {
    Card,
    CardContent,
    TextField,
    InputAdornment,
    SvgIcon,
  } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import SavedBtn from './SavedBtn';
import MenuItem from '@material-ui/core/MenuItem';

//Pagination
const useStyles1 = makeStyles((theme) => ({
    root: {
      flexShrink: 0,
    },
  }));
  
  function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onChangePage(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onChangePage(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onChangePage(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <div className={classes.root}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
  
  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };
  
//End Pagination

const rows = [
    {
        id: 1,
        player1: 'Gia Lợi',
        player2: 'Phi Long',
        winner: 'Win',
        status: 'Saved'
    },
    {
        id: 2,
        player1: 'Gia Lợi',
        player2: 'Phi Long',
        winner: 'Loss',
        status: 'Unsaved'
    },
    {
        id: 3,
        player1: 'Gia Lợi',
        player2: 'Phi Long',
        winner: 'Draw',
        status: 'Saved'
    },
    {
        id: 4,
        player1: 'Phi Long',
        player2: 'BlackPink',
        winner: 'Loss',
        status: 'Unsaved'
    },
    {
        id: 5,
        player1: 'Gia Lợi',
        player2: 'IU',
        winner: 'Win',
        status: 'Saved'
    },
    {
        id: 6,
        player1: 'IU',
        player2: 'Phi Long',
        winner: 'Win',
        status: 'Unsaved'
    },
    {
        id: 7,
        player1: 'BlackPink',
        player2: 'Gia Lợi',
        winner: 'Draw',
        status: 'Unsaved'
    },
    {
        id: 8,
        player1: 'IU',
        player2: 'BlackPink',
        winner: 'Draw',
        status: 'Saved'
    },
    {
      id: 9,
      player1: 'test',
      player2: 'Gia Lợi',
      winner: 'Draw',
      status: 'Unsaved'
  },
  ];

const selections = [
  {
    value: 'All',
    label: 'All',
  },
  {
    value: 'Saved',
    label: 'Saved',
  },
  {
    value: 'Unsaved',
    label: 'Unsaved',
  },
];

const useStyles = makeStyles((theme) => ({
  margin: {
    marginBottom: 30,
},
button:{
    marginLeft: 5,
    marginRight: 5,
    width: 100,
    height: 40,
},
inputSelection : {
    marginTop: 15,
    marginRight: 55,
    width: 220,
    float: 'right',
},
  }));

export default function Matches() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [selection, setSelection] = React.useState('All');
    const [searchValue, setSearchValue] = React. useState("");

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeSelection = (event) => {
      setSelection(event.target.value);
    };

    const handleSearch = (event) => {
      setSearchValue(event.target.value);
    };

    function Search (rows) {
      return rows.filter(
        (row) => (row.player1).toLowerCase().indexOf(searchValue) > -1 || (row.player2).toLowerCase().indexOf(searchValue) > -1
      );
    };
  return (
    <Container>
    {/* Search tool */}
    <Box className = {classes.margin} mt={3}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Tìm kiếm người chơi"
                variant="outlined"
                value = {searchValue}
                onChange = {handleSearch}
              />
            </Box>
          </CardContent>
        </Card>
    </Box>
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell align="center"><strong>Mã trận</strong></TableCell>
            <TableCell align="center"><strong>Người chơi 1</strong></TableCell>
            <TableCell align="center"><strong>Người chơi 2</strong></TableCell>
            <TableCell align="center"><strong>Người chơi thắng</strong></TableCell>
            <TableCell align="center"><strong>Lựa chọn</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {(rowsPerPage > 0
            ? Search(rows).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : Search(rows)
          ).map((row) => (
            <TableRow key={row.id}>
              <TableCell align="center" component="th">
                {row.id}
              </TableCell>
              <TableCell align="center">{row.player1}</TableCell>
              <TableCell align="center">{row.player2}</TableCell>
              <TableCell align="center">{row.winner}</TableCell>
              <TableCell align="center">
                <Button  variant="contained" color="primary">
                    Xem Lịch sử   
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
    </Container>
  );
}

