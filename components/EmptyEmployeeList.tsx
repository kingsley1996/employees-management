// src/components/EmptyState.tsx
import Image from "next/image";
import React from "react";

const EmptyEmployeeList: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Image
        width={200}
        height={200}
        src="/empty.svg"
        alt="Empty state"
        className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4"
      />
      <p className="text-gray-500 text-lg text-center">
        No employees found.
      </p>
    </div>
  );
};

export default EmptyEmployeeList;
