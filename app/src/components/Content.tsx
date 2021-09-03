import React from 'react'
import { ChatProps } from 'views/Chat'
import Messages from './Messages'

export interface ContentProps extends ChatProps {
  isChoosingRoom: boolean
  setIsChoosingRoom: React.Dispatch<React.SetStateAction<boolean>>
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const Content: React.FC<ContentProps> = (props) => {
  return (
    <div className="chat__messages">
      <div id="message-template">
        <Messages {...props} />
      </div>
    </div>
  )
}

export default React.memo(Content)
