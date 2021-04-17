import * as React from "react";
const TICK = 500;

const TEXT = "On loading ";
const PHASE_3 = `${TEXT}...`;

const Loading = (props) => {
  const elemRef = React.useRef();
  const { styles, isMobile } = props

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (elemRef.current) {
        if (elemRef.current.innerHTML === PHASE_3) {
          elemRef.current.innerHTML = TEXT;
        } else {
          elemRef.current.innerHTML = elemRef.current.innerHTML + ".";
        }
      }
    }, TICK);
    return () => clearInterval(timer);
  }, []);

  const textStyles = {
    position: 'absolute',
    top: '40%',
    left: isMobile ? '30%' : '40%'
  }

  return (
    <div style={{ ...styles, position: 'relative' }}>
      <span ref={elemRef} style={textStyles}>{TEXT}</span>
    </div>
  );
}

export default Loading;
