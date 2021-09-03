import React from 'react'

const HorizontalLine: React.FC<{ style: React.CSSProperties }> = ({
  style
}) => {
  return (
    <div style={style} className="skeleton-shine skeleton-horizontal-line" />
  )
}

const SkeletonLoading: React.FC<{ lineStyle?: React.CSSProperties }> = (
  props
) => {
  const mapToFive = new Array(5).fill(0)
  const { lineStyle = {} } = props
  return (
    <div className="skeleton-loading">
      {mapToFive.map((_, index) => (
        <HorizontalLine key={index} style={{ width: '90%', ...lineStyle }} />
      ))}
    </div>
  )
}

export default React.memo(SkeletonLoading)
