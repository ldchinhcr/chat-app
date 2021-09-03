import * as React from 'react'

interface LoadingProps {
  styles?: React.CSSProperties
  isMobile?: boolean
}

const Loading: React.FC<LoadingProps> = (props) => {
  const { styles = {} } = props

  return (
    <div style={{ ...styles, position: 'relative', border: 'none' }}>
      <div className="spinner">
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
      </div>
    </div>
  )
}

export default Loading
