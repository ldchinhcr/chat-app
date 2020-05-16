import React, { useRef, useEffect } from "react";
import OldMsg from "./OldMsg";
import NewMsg from "./NewMsg";
export default function Content() {
  const divRef = useRef(null);

  const scrollToBottom = () => {
    divRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [divRef]);

  return (
    <div className="chat__messages">
      <div id="message-template">
        <OldMsg />
        <NewMsg />
        <div ref={divRef}></div>
      </div>
    </div>
  );
}
