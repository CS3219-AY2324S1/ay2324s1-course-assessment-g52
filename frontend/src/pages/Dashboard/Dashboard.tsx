// Import react
import { useEffect, useState } from 'react';

// Import MUI
import { 
  Stack,
} from '@mui/material';

// Import types
import { Question, QuestionComplexity } from '../../utils/types';

// Import components
import AddQuestionModal from '../../components/DashboardLayout/Modals/AddQuestionModal';
import QuestionDetailsModal from '../../components/DashboardLayout/Modals/QuestionDetailsModal';
import QuestionsTable from '../../components/DashboardLayout/QuestionsTable';
import UserCard from '../../components/User/UserCard';

// Import utils
import { includes, map } from 'lodash';

// Import style
import './Dashboard.scss';
import { useGetQuestionsQuery } from '../../redux/api';
import { getAuth } from 'firebase/auth';

const Dashboard = () => {
 
  //----------------------------------------------------------------//
  //                          HOOKS                                 //
  //----------------------------------------------------------------//
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [questionDetailsOpen, setQuestionDetailsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [admin, setAdmin] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string[]>([]);
  const [complexity, setComplexity] = useState<QuestionComplexity>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  useEffect(() => {
    getAuth().currentUser?.getIdTokenResult().then((idTokenResult) => {
      const claims: any = idTokenResult.claims;
      if (includes(claims?.roles, 'ADMIN')) {
        setAdmin(true);
      }
    })
  }, [])
  
  const { data: questionData }  = useGetQuestionsQuery();
  const [id, setId] = useState<string>('');
  useEffect(() => {
    if (questionData?.questions) {
      const questionsList = map(questionData.questions, (q: any) => {
        return {
          id: q.questionId,
          title: q.questionTitle,
          category: q.questionCategories,
          complexity: q.questionComplexity,
          description: q.questionDescription,
        }
      });
      setQuestions(questionsList);
    }
  }, [questionData]);
  
  //----------------------------------------------------------------//
  //                         HANDLERS                               //
  //----------------------------------------------------------------//
  const handleClickQuestion = (e: any, question: Question) => {
    e.preventDefault();
    setQuestionDetailsOpen(true);
    setTitle(question.title);
    setDescription(question.description);
    setCategory(question.category);
    setId(question.id)
    setComplexity(question.complexity);
  }

  const questionsDetailsCloseHandler = () => {
    setTitle('');
    setDescription('');
    setQuestionDetailsOpen(false);
  }

  //----------------------------------------------------------------//
  //                          RENDER                                //
  //----------------------------------------------------------------//
  return (
    <div>
      {admin && 
        <AddQuestionModal
          questionModalOpen={questionModalOpen}
          setQuestionModalOpen={setQuestionModalOpen}
          questions={questions}
        />
      }
      
      <QuestionDetailsModal
        questionDetailsOpen={questionDetailsOpen}
        questionsDetailsCloseHandler={questionsDetailsCloseHandler}
        title={title}
        description={description}
        category={category}
        complexity={complexity}
        id={id}
        setTitle={setTitle}
        setDescription={setDescription}
        setComplexity={setComplexity}
        setCategory={setCategory}
        admin={admin}
        questions={questions}
      />
      <Stack
        direction={'row'}
        justifyContent={'center'}
        sx={{
          paddingTop: 5,
          width: '100%',
          height: '80%',
        }}
      >
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          spacing={5}
          sx={{
            width: '85%',
          }}
        >
         <Stack
            direction={'column'}
            width={'fit-content'}
            spacing={3}
          >
              <UserCard admin={admin} />
            </Stack>
          <Stack
            direction={'column'}
            width={'70%'}
            spacing={3}
          >
            <QuestionsTable
              setQuestionModalOpen={setQuestionModalOpen}
              handleClickQuestion={handleClickQuestion}
              questions={questions}
              admin={admin}
            />
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
}
export default Dashboard;
