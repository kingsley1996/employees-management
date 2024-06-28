'use client'
import React, { createContext, useContext, useState, ReactNode } from "react";

interface UploadImageContextType {
  isUploading: boolean;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadImageContext = createContext<UploadImageContextType>({
  isUploading: false,
  setIsUploading: () => {},
});

export const useUploadImageContext = () => useContext(UploadImageContext);

export const UploadImageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <UploadImageContext.Provider value={{ isUploading, setIsUploading }}>
      {children}
    </UploadImageContext.Provider>
  );
};
