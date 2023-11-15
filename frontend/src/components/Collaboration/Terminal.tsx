// Import utils
import { codeOutputType } from '../../utils/types';

import './Terminal.scss';

type TerminalProps = {
  output: codeOutputType | null,
}

const Terminal = (props: TerminalProps) => {
  const { output } = props;

  return (
    <div className='terminal_container'>
      <div className='terminal_style'>
        {output ? 
          <p>{output.status.id == 3 ? output.stdout : output.stderr}</p> :
          <p>No output</p>
        }
      </div>
      {output && <p className='time_style'>{`Time taken: ${output.time}s`}</p>}
    </div>
  )
}

export default Terminal;