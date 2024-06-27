// src/components/Loading.tsx
import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray bg-opacity-50 z-50">
      <div className="flex flex-col items-center justify-center">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        <h2 className="text-center text-zinc-800 text-xl font-semibold">Loading...</h2>
      </div>
    </div>
  );
};

export default Loading;
