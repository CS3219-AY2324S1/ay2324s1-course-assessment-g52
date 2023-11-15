import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Fab from '@mui/material/Fab';
import SendIcon from '@mui/icons-material/Send';

import { SocketContext } from '../../contexts';
import './ChatBox.scss';
import { useContext, useState } from 'react';
import { ClientEvents } from '../../utils/types';
import { Socket } from 'socket.io-client';

type ChatType = {
  currentUser: string | null,
  conversation: { 
    userId: string, 
    message: string
    date: number
  }[],
  roomId: string | null,
}

const ChatBox = (props: ChatType) => {
  const { currentUser, conversation, roomId } = props;
  const soc = useContext<Socket | null>(SocketContext);
  const [message, setMessage] = useState<string>("");
  const handleSendMessage = () => {
    if (soc) {
      setMessage("");
      soc.emit(ClientEvents.MESSAGE, { roomId, message });
    }
  }
  const renderConversation = () => conversation.map(respond => 
    <ListItem key={respond.date}>
      <Grid container className='chat_bubble_container' style={{justifyContent: respond.userId === currentUser ? 'end' : 'start'}}>
        <Grid item className='chat_bubble' style={{backgroundColor: respond.userId === currentUser ? "#FFD900" : "#E5E5E5"}}>
          <ListItemText primary={respond.message}></ListItemText>
          <p className='time_stamp'>{new Date(respond.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        </Grid>
      </Grid>
    </ListItem>
  );
  const handleChangeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }
  const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  }
  return (
    <div className="chat_container">
      <Grid container className="chat_grid_container">
        <List className="chat_list">
          {renderConversation()}
        </List>
        <Divider light={true} className="divider_style"/>
        <Grid container className="chat_input_container">
          <Grid item xs={10}>
            <TextField 
              sx={{
                "& .MuiOutlinedInput-root":{
                  borderRadius: '1rem',
                  '&:hover fieldset': {
                    borderColor: '#B89C00',
                    transition: '200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FFD900',
                    transition: '200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms'
                  },
                }
              }}
              id="outlined-basic-email" 
              value={message} 
              label="" 
              fullWidth 
              onKeyDown={handleEnterKeyDown}
              onChange={handleChangeMessage}
            />
          </Grid>
          <Grid
            item 
            xs={1} 
            sx={{
              textAlign: "right",
              marginTop: "auto",
            }}
          >
            <Fab sx={{backgroundColor: '#FFD900', '&:hover': {backgroundColor:'#FFD900'}}} aria-label="add" onClick={handleSendMessage}><SendIcon /></Fab>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default ChatBox;