import React from "react";

const SkeletonCard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="bg-white shadow rounded-lg p-4 animate-pulse"
          style={{ height: "360px", width: "100%" }}
        >
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mt-2"></div>
          <div className="h-6 bg-gray-200 rounded w-2/3 mt-2"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonCard;