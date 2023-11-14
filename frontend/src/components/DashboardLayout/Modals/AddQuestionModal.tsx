// Import react
import React, { useState } from 'react';

// Import MUI
import { 
  Box,
  Button,
  FormControl,
  InputLabel,
  Stack,
  TextField,
  Typography,
  Modal,
  Select,
  MenuItem,
  OutlinedInput,
} from '@mui/material';

import { SelectChangeEvent } from '@mui/material/Select';

// Import redux
import { useDispatch, useSelector } from 'react-redux';
import { addQuestion } from '../../../redux/slices/questionSlice';
import { RootState } from '../../../redux/store';

// Import local components
import CustomButton from '../../Button/Button';

// Import types
import { QuestionCategories, QuestionComplexity } from '../../../utils/types';
import { toast } from 'react-toastify';

type AddQuestionModalProps = {
    questionModalOpen: boolean,
    setQuestionModalOpen: Function
}
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const AddQuestionModal = (props: AddQuestionModalProps) => {
    const { questionModalOpen, setQuestionModalOpen} = props;
    //----------------------------------------------------------------//
    //                          HOOKS                                 //
    //----------------------------------------------------------------//
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState(false);
    const [description, setDescription] = useState('');
    const [descriptionError, setDescriptionError] = useState(false);
    const [complexity, setComplexity] = useState('');
    const [complexityError, setComplexityError] = useState(false);
    const [category, setCategory] = useState<string[]>([]);
    const [categoryError, setCategoryError] = useState(false);
    const questions = useSelector((state: RootState) => state.questions);
    
    //----------------------------------------------------------------//
    //                         HANDLERS                               //
    //----------------------------------------------------------------//
    const questionTitleExists = (t: string) => {
      return questions.data.some((question) => question.title.toLowerCase() === t.toLowerCase());
    }
    const handleAddQuestionModalClose = () => {
        setQuestionModalOpen(false);
        setTitleError(false);
        setDescriptionError(false);
        setComplexityError(false);
        setCategoryError(false);
        setTitle('');
        setDescription('');
        setComplexity('');
        setCategory([]);
    }
    const handleAddQuestion = (e: React.FormEvent) => {
      e.preventDefault();
      setTitleError(!title);
      setDescriptionError(!description);
      setComplexityError(!complexity);
      setCategoryError(!category.length);
      if (!title || !description || !complexity || !category) return;
      if (questionTitleExists(title)) {
        setTitleError(true);
        toast.error('Question already exists!');
        return;
      }
      const complexityCasted = complexity as QuestionComplexity;
      const date = new Date();
      dispatch(addQuestion({ 
        id: String(questions.data.length + 1),
        title,
        description,
        category,
        complexity: complexityCasted,
        createdAt: date.toLocaleDateString('en-gb'),
        updatedAt: date.toLocaleDateString('en-gb'),
        createdBy: "USER1"
      }));
      toast.success(`${title} added!`)
      setTitle('');
      setDescription('');
      setComplexity('');
      setCategory([]);
      setQuestionModalOpen(false);
    };

    const handleCategoryChange = (event: SelectChangeEvent<typeof category>) => {
      const {
        target: { value },
      } = event;
      setCategory(
        typeof value === 'string' ? value.split(',') : value,
      );
    };

    //----------------------------------------------------------------//
    //                          RENDER                                //
    //----------------------------------------------------------------//
    return (
      <Modal
        open={questionModalOpen}
        onClose={handleAddQuestionModalClose}
      >
        <Box 
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            fontFamily: 'Poppins',
            borderRadius: 5,
            p: 4
          }}
          component="form"
        >
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{paddingTop: 2, paddingBottom: 2, fontFamily: 'Poppins'}}>
            Create Question
          </Typography>
          <form onSubmit={handleAddQuestion}>
            <FormControl sx={{ width: '100%'}}>
              <Stack spacing={5} sx={{backgroundColor: 'transparent'}}>
                <TextField 
                  id="title"
                  label="Title"
                  onChange={e => setTitle(e.target.value)}
                  value={title}
                  error={titleError}
                  required
                />
                <TextField
                  id="description"
                  label="Description"
                  sx={{ maxHeight: 300 }}
                  onChange={e => setDescription(e.target.value)}
                  value={description}
                  error={descriptionError}
                  required
                  multiline
                  maxRows={5}
                />
                <FormControl>
                  <InputLabel 
                    id="complexity-label"
                    required
                    error={complexityError}
                  >
                    Complexity
                  </InputLabel>
                  <Select
                    id="complexity"
                    label="Complexity"
                    value={complexity}
                    onChange={e => setComplexity(e.target.value)}
                    error={complexityError}
                    required
                  >
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                  </Select>
                </FormControl>
                <FormControl>
                <InputLabel
                    id="category-label"
                    required
                    error={categoryError}
                  >
                    Category
                  </InputLabel>
                <Select
                  labelId="Category"
                  id="category"
                  multiple
                  value={category}
                  onChange={handleCategoryChange}
                  input={<OutlinedInput label="Category" />}
                  MenuProps={MenuProps}
                  error={categoryError}
                >
                  {QuestionCategories.map((category) => (
                    <MenuItem
                      key={category}
                      value={category}
                    >
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                </FormControl>

              </Stack>
              
            </FormControl>
          </form>
          <Button
            sx={{ marginTop: 2, p: 2, width: '100%', textAlign: 'center', backgroundColor: 'transparent', "&:hover": {
              backgroundColor: "transparent"
            }}}
            disableRipple
          >
            <CustomButton
              title="Create"
              event={(e) => handleAddQuestion(e)}
            />
          </Button>
        </Box>
      </Modal>
  );
}

export default AddQuestionModal;