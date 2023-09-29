import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tableCellClasses } from "@mui/material/TableCell";

import { 
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Toolbar,
} from '@mui/material';

import './Dashboard.scss';
import { RootState } from '../../redux/store';
import AddIcon from '@mui/icons-material/Add';
interface Column {
  id: 'title' | 'category' | 'complexity' | 'createdAt' | 'updatedAt' | 'createdBy';
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'title', label: 'Title', minWidth: 120 },
  // { id: 'category', label: 'Category', minWidth: 120, align: 'center', },
  { id: 'complexity', label: 'Complexity', minWidth: 120, align: 'right', },
  // { id: 'createdAt', label: 'Created', minWidth: 170, align: 'right', },
  // { id: 'updatedAt', label: 'Updated', minWidth: 170, align: 'right', }, 
  // { id: 'createdBy', label: 'Created By', minWidth: 150, align: 'right', }, 
];

type QuestionTableProps = {
    handleClickQuestion: Function,
    setQuestionModalOpen: Function,
}
const QuestionsTable = (props: QuestionTableProps) => {
  const { setQuestionModalOpen, handleClickQuestion, } = props;
  let counter = 0;

  //----------------------------------------------------------------//
  //                          HOOKS                                 //
  //----------------------------------------------------------------//
  const questions = useSelector((state: RootState) => state.questions);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //----------------------------------------------------------------//
  //                         HANDLERS                               //
  //----------------------------------------------------------------//
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //----------------------------------------------------------------//
  //                          RENDER                                //
  //----------------------------------------------------------------//
  return (
      <div className="dashboard_body">
        <Paper 
          sx={{
            width: '100%',
            minHeight: 500,
            overflow: 'hidden',
            borderRadius: 5,
            paddingBottom: 3,
            paddingTop: 3,
            paddingLeft: 5,
            paddingRight: 5,
          }}
        >
          <Toolbar disableGutters className='dashboard_header__toolbar' sx={{justifyContent: "spaceBetween"}}>
            <div className="question_bank__title">
              Question Bank
            </div>
            <IconButton onClick={() => setQuestionModalOpen(true)}  sx={{ p: 0 }}>
              <AddIcon />
            </IconButton>
          </Toolbar>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table
              stickyHeader
              aria-label="sticky table"
              sx={{
                [`& .${tableCellClasses.root}`]: {
                borderBottom: "none"
                },
              }}
            >
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((question) => {
                  const isOdd = counter++ % 2 == 0;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={question.id}
                      sx={{
                        backgroundColor: isOdd ? '#ffd90033' : '#ffffff',
                        '&.MuiTableRow-root td:first-child': {
                          'border-top-left-radius': '10px',
                          'border-bottom-left-radius': '10px'
                        },
                        '&.MuiTableRow-root td:last-child': {
                          'border-top-right-radius': '10px',
                          'border-bottom-right-radius': '10px'
                        }
                      }}
                    >
                      {columns.map((column) => {
                        const value = question[column.id];
                        if (column.id === 'title') {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Button
                                sx={{
                                  textTransform: 'none',
                                  "&:hover": { backgroundColor: "transparent" }
                                }}
                                disableRipple
                                disableFocusRipple
                                disableTouchRipple
                                disableElevation
                                onClick={e => handleClickQuestion(e, question)}
                              >
                                {value}
                              </Button>
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        }
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          sx={{
            '& .MuiTablePagination-selectLabel': {
              height: '6px'
            },
            '& .MuiTablePagination-displayedRows': {
              height: '6px'
            } 
          }}
          count={questions.data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default QuestionsTable;