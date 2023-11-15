import Divider from '@mui/material/Divider';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useContext } from 'react';
import { SocketContext } from '../../contexts';
import { ClientEvents, } from '../../utils/types';
import { Socket } from 'socket.io-client';

const getDifficultyColorCode = (difficulty: string | null) => {
  switch (difficulty) {
    case "Easy":
      return "#83DA58";
    case "Medium":
      return "#FFB800";
    case "Hard":
      return "#FF0000";
    default:
      return "#83DA58";
  }
}

type QuestionBoxProps = {
  title: string | null,
  complexity: string | null,
  description: string | null,
  otherUserId: string | null,
  roomId: string | null,
}

const QuestionBox = (props: QuestionBoxProps) => {
  const { title, complexity, description, otherUserId, roomId} = props;
  const soc: Socket | null = useContext(SocketContext);
  const resetQuestion = () => {
    console.log("Initiate refresh question");
    if (soc) {
      soc.emit(ClientEvents.CHANGE_QUESTION, { otherUserId, roomId});
    }
  }


  return (
    <div style={{height:'95%', width:'30%', backgroundColor:'white',}}>
      <div style={{margin:'3rem', textAlign:'start'}}>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <h2 style={{fontWeight:'600'}}>{title}</h2>
          <RefreshIcon style={{fontSize:'1.3rem', cursor:'pointer'}} onClick={resetQuestion}/>
        
        </div>
        <h6 style={{fontWeight:'600', color:getDifficultyColorCode(complexity)}}>{complexity}</h6>
        <Divider light={true} style={{background:'grey', marginTop:'1rem'}}/>
        <p style={{fontWeight:'500', whiteSpace:'pre-line', marginTop:'3rem'}}>{description}</p>
      </div>
    </div>
  );
};
export default QuestionBox;