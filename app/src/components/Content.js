import React from "react";
import Messages from "./Messages";

function Content(props) {
  return (
    <div className="chat__messages">
      <div id="message-template">
        <Messages {...props} />
      </div>
    </div>
  );
}

export default React.memo(Content);
