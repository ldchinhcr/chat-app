import React from "react";

const HorizontalLine = ({ style }) => {
  return (
    <div style={style} className="skeleton-shine skeleton-horizontal-line" />
  );
};

function SkeletonLoading(props) {
  const mapToFive = new Array(5).fill(0);
  const { lineStyle } = props;
  return (
    <div className="skeleton-loading">
      {mapToFive.map((_, index) => (
        <HorizontalLine key={index}  style={{ width: '90%', ...lineStyle }} />
      ))}
    </div>
  );
}

export default React.memo(SkeletonLoading);
