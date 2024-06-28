"use client";
import { useState } from "react";

const AlertMessage = () => {
  const [showAlert, setShowAlert] = useState(true);

  const handleClose = () => {
    setShowAlert(false);
  };

  return (
    <>
      {showAlert && (
        <div
          className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 sticky top-0 z-50"
          role="alert"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Warning:</p>
              <p>This is a demo application hosted on a free platform. It may experience slowness.</p>
            </div>
            <button
              className="text-orange-700 hover:text-orange-900"
              onClick={handleClose}
            >
              <svg
                className="h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.646 2.646a.5.5 0 0 1 .708 0L10 9.293l6.646-6.647a.5.5 0 1 1 .708.708L10.707 10l6.647 6.646a.5.5 0 0 1-.708.708L10 10.707l-6.646 6.647a.5.5 0 0 1-.708-.708L9.293 10 2.646 3.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertMessage;

