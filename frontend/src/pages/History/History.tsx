import {
    Paper,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    Table,
    TablePagination,
    TableBody,
 } from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { useEffect, useState } from "react";
import SubmissionDetailsModal from "./SubmissionDetailsModal";
import { useGetAllSubmissionsQuery, useGetQuestionsQuery } from "../../redux/api";
import { languageOptions } from './languages';
import { filter, forEach, map } from "lodash";
import Loading from "../../components/Loading/Loading";

interface Column {
  id: 'title' | 'category' | 'date' | 'language' | 'complexity';
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  format?: (value: number) => string;
}
const columns: readonly Column[] = [
  { id: 'title', label: 'Title', minWidth: 120 },
  { id: 'category', label: 'Category', minWidth: 120, align: 'right', },
  { id: 'complexity', label: 'Complexity', minWidth: 120, align: 'right', },
  { id: 'language', label: 'Language', minWidth: 120, align: 'right', },
  { id: 'date', label: 'Date', minWidth: 120, align: 'right', },
];

const History = () => {
  const languagesDict: { [key: number]: any } = languageOptions;
  const [submissionDetailsModalOpen, setSubmissionDetailsModalOpen] = useState(false);
  const {data: submissionData } = useGetAllSubmissionsQuery();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const {data: questions } = useGetQuestionsQuery();
  const [code, setCode] = useState<string | undefined>(undefined);
  const [languageValue, setLanguageValue] = useState<string | undefined>(undefined);
  const [languageLabel, setLanguageLabel] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const getTime = (date: string) => {
    const d = new Date(date)
    const localeString = d.toLocaleString('en', {timeZone: 'Asia/Hong_Kong'});
    const arr = localeString.split(' ')
    const time = arr[0].slice(0, -1) + " " + arr[1].split(':')[0] + ':' + arr[1].split(':')[1] + ' ' + arr[2]
    return time
  }
  const [loaded, setLoaded] = useState(false);
  const [questionsDict, setQuestionsDict] = useState<{ [key: number]: any }>({}) 

  useEffect(() => {
    if (questions?.questions) {
      const temp: { [key: number]: any } = {}
      forEach(questions.questions, (question: any) => {
        const id: number = question.questionId;
        temp[id] = question;
      })
      setQuestionsDict(temp);
      setLoaded(true);
    }
  }, [questions?.questions])
  
  useEffect(() => {
    if (submissionData && Object.keys(questionsDict).length > 0) {
      const a = (filter(submissionData, (submission: any) => submission.questionid in questionsDict))
      const b = (map(a, (submission: any) => {
        let categoryString = '';
        const questionId: number = submission.questionid;
        const languageId: number = submission.languageid;
        const question = questionsDict[questionId];
        forEach(question!.questionCategories, cat => categoryString += cat + ', ')
        if (categoryString.length > 0) categoryString = categoryString.slice(0, -2);
        return {
          id: submission.id,
          title: question.questionTitle,
          category: categoryString,
          complexity: question.questionComplexity,
          language: languagesDict[languageId].label,
          date: getTime(submission.updated_at),
          code: submission.code,
          languageValue: languagesDict[languageId].value
        }
      }
      ))
      setSubmissions(b);
    }
  }, [submissionData, questionsDict])
  
  let counter = 0
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
    
    //----------------------------------------------------------------//
    //                         HANDLERS                               //
    //----------------------------------------------------------------//
    const handleChangePage = (event: unknown, newPage: number) => {
      console.log(event)
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
    const handleRowClicked = (submission: any) => {
      setSubmissionDetailsModalOpen(true);
      setCode(submission.code);
      setLanguageValue(submission.languageValue);
      setTitle(submission.title);
      setLanguageLabel(submission.language)
    }
    const sortedData = submissions.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    return (
      <>
      <SubmissionDetailsModal
        submissionDetailsModalOpen={submissionDetailsModalOpen}
        setSubmissionDetailsModalOpen={setSubmissionDetailsModalOpen}
        code={code}
        language={languageValue}
        languageLabel={languageLabel}
        title={title}
      />
      <div
        style={{
          width: "100%",
          marginTop: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
      {!loaded ? <Loading />:
        <Paper
          sx={{
            width: "80%",
            height: "fit-content",
            padding: 5,
            borderRadius: 5,
          }}  
        >
          <TableContainer sx={{ maxHeight: '70vh' }}>
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
              {sortedData && (sortedData as unknown as any[])
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((submission) => {
                  const isOdd = counter++ % 2 == 0;
                  console.log("ASD", submission)
                  return (
                    <TableRow
                      onClick={() => handleRowClicked(submission)}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={submission.id}
                      sx={{
                        cursor: 'pointer',
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
                        const value = submission[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                        // if (column.id === 'title') {
                        //   return (
                        //     <TableCell key={column.id} align={column.align}>
                        //       <Button
                        //         sx={{
                        //           textTransform: 'none',
                        //           "&:hover": { backgroundColor: "transparent" }
                        //         }}
                        //         disableRipple
                        //         disableFocusRipple
                        //         disableTouchRipple
                        //         disableElevation
                        //         // onClick={e => {
                        //         //   handleClickSubmission(e, submission)
                        //         // }}
                        //       >
                        //         {value}
                        //       </Button>
                        //     </TableCell>
                        //   );
                        // } else {
                          
                        // }
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
        count={submissions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>  }
  </div>
  </>
    )
}
export default History;