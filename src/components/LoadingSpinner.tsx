
import React from 'react';

const LoadingSpinner: React.FC<{ size?: string; color?: string }> = ({
  size = '6',
  color = 'border-primary',
}) => {
  return (
    <div className={`flex justify-center items-center`}>
      <div
        className={`animate-spin rounded-full h-${size} w-${size} border-t-2 border-b-2 ${color}`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
