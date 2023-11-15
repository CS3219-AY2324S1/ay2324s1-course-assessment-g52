import React, { useState } from "react";
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
  TableSortLabel,
  Paper,
  Toolbar,
} from "@mui/material";

import "./Dashboard.scss";
import AddIcon from "@mui/icons-material/Add";

interface Column {
  id:
    | "title"
    | "category"
    | "complexity"
    | "createdAt"
    | "updatedAt"
    | "createdBy";
  label: string;
  minWidth?: number;
  align?: "left" | "center" | "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "title", label: "Title", minWidth: 120 },
  // { id: "category", label: "Category", minWidth: 120 },
  { id: "complexity", label: "Complexity", minWidth: 120, align: "right" },
];

type QuestionTableProps = {
  handleClickQuestion: Function;
  setQuestionModalOpen: Function;
  questions: any[];
  admin: boolean;
};
const QuestionsTable = (props: QuestionTableProps) => {
  const { admin, questions, setQuestionModalOpen, handleClickQuestion } = props;
  let counter = 0;
  // 你好！ 天气好热啊， 我们去游泳吧！
  //----------------------------------------------------------------//
  //                          HOOKS                                 //
  //----------------------------------------------------------------//
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState("asc");
  const [valueToOrderBy, setValueToOrderBy] = useState("");

  //----------------------------------------------------------------//
  //                         HANDLERS                               //
  //----------------------------------------------------------------//
  const handleChangePage = (event: unknown, newPage: number) => {
    console.log(event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    console.log(event);
    const isAsc = valueToOrderBy === property && sortOrder === "asc";
    setValueToOrderBy(property);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  const getSortDirection = (columnId: string) => {
    if (valueToOrderBy === columnId) {
      return sortOrder === "asc" ? "asc" : "desc";
    }
    return undefined;
  };

  // Comparator function for sorting by title
  const compareByTitle = (a: any, b: any) => {
    if (sortOrder === "asc") {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  };

  // Comparator function for sorting by category
  const compareByCategory = (a: any, b: any) => {
    const categoryA = String(a.category);
    const categoryB = String(b.category);

    if (sortOrder === "asc") {
      return categoryA.localeCompare(categoryB);
    } else {
      return categoryB.localeCompare(categoryA);
    }
  };

  // Comparator function for sorting by complexity
  const compareByComplexity = (a: any, b: any) => {
    const complexityOrder = ["Easy", "Medium", "Hard"];
    const complexityA = complexityOrder.indexOf(a.complexity);
    const complexityB = complexityOrder.indexOf(b.complexity);

    if (sortOrder === "asc") {
      return complexityA - complexityB;
    } else {
      return complexityB - complexityA;
    }
  };

  const getComparator = (order: any, orderBy: any) => {
    console.log(order);
    if (orderBy === "complexity") {
      return compareByComplexity;
    } else if (orderBy === "title") {
      return compareByTitle;
    } else {
      return compareByCategory;
    }
  };

  const sortedQuestions = questions.slice().sort((a, b) => {
    const comparator = getComparator(sortOrder, valueToOrderBy);
    return comparator(a, b);
  });

  //----------------------------------------------------------------//
  //                          RENDER                                //
  //----------------------------------------------------------------//
  return (
    <div className="dashboard_body">
      <Paper
        sx={{
          width: "100%",
          minHeight: 500,
          overflow: "hidden",
          borderRadius: 5,
          paddingBottom: 3,
          paddingTop: 3,
          paddingLeft: 5,
          paddingRight: 5,
        }}
      >
        <Toolbar
          disableGutters
          className="dashboard_header__toolbar"
          sx={{ justifyContent: "spaceBetween" }}
        >
          <div className="question_bank__title">Question Bank</div>
          {admin && (
            <IconButton
              onClick={() => setQuestionModalOpen(true)}
              sx={{ p: 0 }}
            >
              <AddIcon />
            </IconButton>
          )}
        </Toolbar>
        <TableContainer sx={{ maxHeight: "70vh" }}>
          <Table
            stickyHeader
            aria-label="sticky table"
            sx={{
              [`& .${tableCellClasses.root}`]: {
                borderBottom: "none",
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
                    <TableSortLabel
                      active={valueToOrderBy === column.id}
                      direction={getSortDirection(column.id)}
                      onClick={(e) => handleRequestSort(e, column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedQuestions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((question) => {
                  const isOdd = counter++ % 2 == 0;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={question.id}
                      onClick={(e) => {
                        handleClickQuestion(e, question);
                      }}
                      sx={{
                        backgroundColor: isOdd ? "#ffd90033" : "#ffffff",
                        "&.MuiTableRow-root td:first-child": {
                          "border-top-left-radius": "10px",
                          "border-bottom-left-radius": "10px",
                        },
                        "&.MuiTableRow-root td:last-child": {
                          "border-top-right-radius": "10px",
                          "border-bottom-right-radius": "10px",
                        },
                      }}
                    >
                      {columns.map((column) => {
                        const value = question[column.id];
                        if (column.id === "title") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Button
                                sx={{
                                  textTransform: "none",
                                  "&:hover": { backgroundColor: "transparent" },
                                }}
                                disableRipple
                                disableFocusRipple
                                disableTouchRipple
                                disableElevation
                              >
                                {value}
                              </Button>
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
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
            "& .MuiTablePagination-selectLabel": {
              height: "6px",
            },
            "& .MuiTablePagination-displayedRows": {
              height: "6px",
            },
          }}
          count={questions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default QuestionsTable;
