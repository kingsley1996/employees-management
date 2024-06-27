import React from "react";

const FormSkeleton = () => {
  return (
    <div className="w-full md:w-2/3 p-8 md:p-12">
      <div className="animate-pulse flex items-center mb-8">
        <div className="h-6 w-6 bg-gray-300 rounded-full mr-2"></div>
        <div className="h-4 w-20 bg-gray-300 rounded-full"></div>
      </div>
      <div className="animate-pulse mb-8">
        <div className="h-6 w-24 bg-gray-300 rounded-full mb-4"></div>
        <div className="h-8 w-full bg-gray-300 rounded-full"></div>
      </div>
      <div className="animate-pulse mb-4">
        <div className="h-6 w-1/2 bg-gray-300 rounded-full mb-4"></div>
        <div className="h-8 w-full bg-gray-300 rounded-full"></div>
      </div>
      <div className="animate-pulse mb-4">
        <div className="h-6 w-1/2 bg-gray-300 rounded-full mb-4"></div>
        <div className="h-8 w-full bg-gray-300 rounded-full"></div>
      </div>
      <div className="animate-pulse mb-4">
        <div className="h-6 w-1/2 bg-gray-300 rounded-full mb-4"></div>
        <div className="h-8 w-full bg-gray-300 rounded-full"></div>
      </div>
      <div className="animate-pulse mb-4">
        <div className="h-6 w-1/2 bg-gray-300 rounded-full mb-4"></div>
        <div className="h-8 w-full bg-gray-300 rounded-full"></div>
      </div>
      <div className="animate-pulse mb-4">
        <div className="h-6 w-1/2 bg-gray-300 rounded-full mb-4"></div>
        <div className="h-8 w-full bg-gray-300 rounded-full"></div>
      </div>
      <div className="animate-pulse mb-4">
        <div className="h-6 w-1/2 bg-gray-300 rounded-full mb-4"></div>
        <div className="h-8 w-full bg-gray-300 rounded-full"></div>
      </div>
      <div className="animate-pulse flex justify-between items-center mb-4">
        <div className="h-8 w-1/3 bg-gray-300 rounded-full"></div>
        <div className="h-8 w-1/3 bg-gray-300 rounded-full"></div>
      </div>
      <div className="animate-pulse flex justify-center">
        <div className="h-10 w-1/4 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};

export default FormSkeleton;
