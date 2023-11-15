// Import react
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

// Import types
import { ClientEvents, Message, ServerErrors, ServerEvents } from "../../utils/types";
import { OnChange } from "@monaco-editor/react";

// Import socket
import { SocketContext } from "../../contexts";
import { Socket } from "socket.io-client";

// Import local components
import QuestionBox from '../../components/Collaboration/QuestionBox';
import Editor from '../../components/Collaboration/Editor';
import ChatBox from '../../components/Collaboration/ChatBox';
import Terminal from '../../components/Collaboration/Terminal';

// Import firebase
import { getAuth } from "@firebase/auth";

// Import api
import { useGetQuestionsQuery } from "../../redux/api";

// Import utils
import { find } from "lodash";
import { codeOutputType } from "../../utils/types";

// Import style
import './Collaboration.scss';
import { Box } from "@mui/system";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions } from "@mui/material";
import { toast } from "react-toastify";
import Button from "../../components/Button/Button";

//Button style
const buttonStyle = {
  fontSize: "0.8rem", 
  fontWeight: '500', 
  color:'white', 
  border: "none", 
  borderRadius: "5px", 
  height:'100%',
  width: '76px',
  margin: '0 .5rem',
};
const submitButtonStyle = {
  ...buttonStyle,
  backgroundColor:'#83DA58'
}

const restoreButtonStyle = {
  ...buttonStyle,

  backgroundColor:'#ad8713',
};

const Collaboration = () => {
  const { questionId, otherUserId } = useParams();
  const soc: Socket | null = useContext(SocketContext);
  const auth = getAuth();
  const [userId, setUserId] = useState<string | null>(null); // TODO: get from redux
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { data: questionsData }  = useGetQuestionsQuery();
  
  const [code, setCode] = useState<string>("");
  const [codeOutput, setCodeOutput] = useState<codeOutputType | null>(null);
  const [initialCode, setInitialCode] = useState<string>("");
  const [peerCode, setPeerCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [peerLanguage, setPeerLanguage] = useState<string>("javascript");
  const [question, setQuestion] = useState<any | null>(null);
  const [tab, setTab] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [doesUserStartRefresh, setDoesUserStartRefresh] = useState(false)
//  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    if (questionsData?.questions && questionId) {
      setQuestion(find(questionsData?.questions, (q: any) => q.questionId === parseInt(questionId)));
    }
  }, [questionsData?.questions])

  useEffect (() => {
    if (auth.currentUser) {
      setUserId(auth.currentUser.uid);
    }
  }, [auth.currentUser]);

  if (question && userId && questionId && otherUserId && soc && !roomId) {
    soc.on(ServerEvents.JOINED_ROOM, (data) => {
      const { room, userId: joiningUserId} = data;
      setRoomId(room.id);
      setPeerCode(room.code[otherUserId].code);
      setPeerLanguage(room.code[otherUserId].language);
      setMessages(room.messages);
      setLanguage(room.code[userId].language);
      setInitialCode(room.code[userId].code);
      setCode(room.code[userId].code);
      if (joiningUserId !== userId) {
        console.log("user joined room", joiningUserId, room);
      }
    });

    soc.on(ServerEvents.LANGUAGE, (data) => {
      if (data.userId === otherUserId) {
        setPeerLanguage(data.code[otherUserId].language);
        setPeerCode(data.code[otherUserId].code);
      } else {
        setLanguage(data.code[userId].language);
        setCode(data.code[userId].code);
      }
    })

    soc.on(ServerEvents.CODE, (data) => {
      if (data.userId === otherUserId) {
        setPeerCode(data.code[otherUserId].code);
      } else {
        setCode(data.code[userId].code);
      }
    })
    soc.on(ServerEvents.MESSAGE, (data) => {
      const { messages: newMessages } = data;
      setMessages(newMessages);
    })
    soc.emit(ClientEvents.JOIN_ROOM, {
      otherUserId,
      questionId
    });
  }

  const handleChangeLanguage: OnChange = (value: any | undefined) => {
    if (soc) {
      soc.emit(ClientEvents.LANGUAGE, {
        roomId,
        language: value!.value,
      });
    }
  }

  const handleChangePeerLanguage: OnChange = (value: string | undefined) => {
    console.log(value);
  }
  const handleEditorChange: OnChange = (value: string | undefined) => {
    setCode(value || "");
    if (soc) {
      soc.emit(ClientEvents.CODE, {
        roomId,
        code: value,
      })
    }
  }

  const handlePeerEditorChange: OnChange = (value: string | undefined) => {
    console.log(value);
  }

  const handleTabChange = (event: React.SyntheticEvent, tabValue: number) => {
    console.log(event);
    setTab(tabValue);
  };

  const handleTerminalOutput = (output: codeOutputType) => {
    setCodeOutput(output);
    setTab(1);
  }

  const selectTab = (tab: number) => {
    switch (tab) {
      case 0:
        return <ChatBox roomId={roomId} conversation={messages} currentUser={userId}/>;
      case 1:
        return (
        <div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
          <Terminal output={codeOutput}/>
        </div>);
      default:
        return <></>;
    }
  }

  //Refresh question
  // useEffect(() => {
  //   if (questionsData?.questions && questionId) {
  //     setQuestion(find(questionsData?.questions, (q: any) => q.questionId === parseInt(questionId)));
  //   }
  // }, [refresh])
  const navigate = useNavigate();
  const navigateAction = (newQuestionId: string | undefined, otherUserId: string | undefined) => {
    
    console.log("redirecting")
    console.log(otherUserId)
    navigate(`/app/collaboration/${newQuestionId}/${otherUserId}`);
    window.location.reload();
  };

  if (soc) {
    soc.removeAllListeners(ServerEvents.QUESTION_CHANGED);
    soc.removeAllListeners(ServerEvents.CHANGE_REQUEST);
    soc.removeAllListeners(ServerEvents.CANCEL_CHANGE_REQUEST);
    soc.removeAllListeners(ServerErrors.NO_NEW_QUESTION);
    //confirm change question event from server
    soc.on(ServerEvents.QUESTION_CHANGED, (data) => {
      const { newQuestionId} = data;
      console.log("newid: " + newQuestionId)
      setIsDialogOpen(false);
      setDoesUserStartRefresh(false);
      navigateAction(newQuestionId, otherUserId);
    });

    //receive change question event from server
    soc.on(ServerEvents.CHANGE_REQUEST, (data) => {
      const startingUserId = data.userId;
      console.log(startingUserId)
      if (startingUserId == userId) {
        setDoesUserStartRefresh(true);
      }
      setIsDialogOpen(true);
      
    });

    // handle server confirm cancel
    soc.on(ServerEvents.CANCEL_CHANGE_REQUEST, () => {
      setIsDialogOpen(false);
      setDoesUserStartRefresh(false);
      console.log("cancel change");
      toast.error("An user cancel change question request");
    });

    // handle no new question
    soc.on(ServerErrors.NO_NEW_QUESTION, () => {
      setIsDialogOpen(false);
      setDoesUserStartRefresh(false);
      console.log("no new question");
      toast.error("Cannot refresh question, please try again!");
    });
  }

  //cancel change question

  //by close the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    soc?.emit(ClientEvents.CANCEL_CHANGE_QN, {
      otherUserId,
      roomId
    });
  };

  //confirm change question
  const handleConfirmChange = () => {
    soc?.emit(ClientEvents.CONFIRM_CHANGE_QN, {
      otherUserId,
      roomId
    });
    setIsDialogOpen(false);
    toast.success("you have confirm to change the question, please wait for the page to refresh")
  };

  return (
    <div className="collaboration_container">
      {questionId && otherUserId && question ? 
        <>
        <QuestionBox title={question?.questionTitle} complexity={question?.questionComplexity} description={question?.questionDescription} otherUserId={otherUserId} roomId={roomId}/>
          <div className="editor_container">
            <Editor 
              code={code}
              initialCode={initialCode}
              language={language}
              isMainEditor={true}
              handleChangeLanguage={handleChangeLanguage}
              handleEditorChange={handleEditorChange}
              handleTerminalOutput={handleTerminalOutput}
              setInitialCode={setInitialCode}
              setCode={setCode}
            />
            <Editor 
              isMainEditor={false}
              code={peerCode}
              language={peerLanguage}
              handleChangeLanguage={handleChangePeerLanguage}
              handleEditorChange={handlePeerEditorChange}
              handleTerminalOutput={() => {}}
              initialCode=""
              setInitialCode={() => {}}
              setCode={() => {}}
            />
          </div>
          <Box className="output_section">
            <Tabs 
              value={tab} 
              onChange={handleTabChange} 
              centered={true} 
              textColor='inherit' 
              sx={{
                height: 33, 
                '& .MuiButtonBase-root': { fontWeight:'700', color:'grey' }, 
                '& .MuiTabs-indicator': {backgroundColor: '#FFD900'}, 
                '& .Mui-selected': {color: '#FFD900'}
              }}
            >
              <Tab label="chat"/>
              <Tab label="terminal"/>
            </Tabs>
            <Box style={{width:'100%', height:'95%'}}>
              {selectTab(tab)}
            </Box>
          </Box>
          <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>
              <h2 style={{fontFamily: "Poppins", fontWeight: 600}}>An user want to refresh and get new question</h2>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <p style={{fontFamily: "Poppins", fontWeight: 600, whiteSpace:'pre-line'}}>If you want to cancel request, press Cancel</p> 
              </DialogContentText>
              {!doesUserStartRefresh && 
                <DialogContentText>
                <p style={{fontFamily: "Poppins", fontWeight: 600, whiteSpace:'pre-line', marginTop:'1rem'}}>If you want to confirm request, press Confirm</p> 
                  </DialogContentText>
              }
              <DialogActions>
                <Button title={'Cancel'} event={handleCloseDialog} style={restoreButtonStyle}/>
                {!doesUserStartRefresh && 
                <Button title={'Confirm'} event={handleConfirmChange} style={submitButtonStyle}/>
                }
              </DialogActions>
              
            </DialogContent>
          </Dialog>
        </>  : 
        <>Please Join a room!</>
      } 
    </div>
    
  );
};
export default Collaboration;
