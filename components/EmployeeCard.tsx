"use client";
import React from "react";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useRouter } from "next/navigation";
import { Employee } from "@/constants/employees";

interface EmployeeCardProps {
  employee: Employee;
  getPositionName: (positionResourceId: string) => string;
  getToolLanguageName: (toolLanguageResourceId: string) => string;
  onDelete: (id: string) => void;
}

const CustomRightArrow = ({ onClick }) => {
  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick();
  };

  return <button className="react-multiple-carousel__arrow react-multiple-carousel__arrow--right " onClick={handleOnClick} aria-label="Carousel right button"></button>;
};

const CustomLeftArrow = ({ onClick }) => {
  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 
    onClick();
  };

  return <button className="react-multiple-carousel__arrow react-multiple-carousel__arrow--left" onClick={handleOnClick} aria-label="Carousel left button"></button>;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  getPositionName,
  getToolLanguageName,
  onDelete,
}) => {
  const router = useRouter();
  const allImages = employee?.positions?.flatMap((position) =>
    position?.toolLanguages?.flatMap((tool) => tool.images)
  );
  // Configuration for carousel
  const carouselConfig = {
    responsive: {
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1,
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1,
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
      },
    },
    showDots: false,
    arrows: true,
    swipeable: true,
    draggable: true,
    centerMode: false,
  };

  const handleGoToEdit = () => {
    router.push(`/edit/${employee.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete(employee.id);
  };

  const calculateYearExperience = (employee: Employee) => {
    let totalYears = 0;
    const calculatedToolLanguages: { [key: string]: boolean } = {};

    employee?.positions?.forEach((position) => {
      position?.toolLanguages?.forEach((tool) => {
        if (!calculatedToolLanguages[tool.toolLanguageResourceId]) {
          totalYears += tool.to - tool.from;
          calculatedToolLanguages[tool.toolLanguageResourceId] = true;
        }
      });
    });

    return `${totalYears} year${totalYears !== 1 ? "s" : ""}`;
  };

  const totalExperience = calculateYearExperience(employee);
  const firstPosition = employee?.positions[0];
  const firstToolLanguage = firstPosition?.toolLanguages[0];

  return (
    <div
      onClick={() => handleGoToEdit()}
      className="max-w-sm bg-white border shadow-sm rounded-xl relative group cursor-pointer transition duration-500"
    >
      <div className="w-full">
        <Carousel
          customLeftArrow={<CustomLeftArrow onClick={() => {}} />}
          customRightArrow={<CustomRightArrow onClick={() => {}} />}
          {...carouselConfig}
        >
          {allImages.map((image) => (
            <Image
              key={image.id}
              width={200}
              height={200}
              src={image.cdnUrl}
              alt="Tool/language"
              className="rounded-t-lg object-cover w-full h-[220px]"
              loading="eager"
            />
          ))}
        </Carousel>
      </div>
      <div className="p-4 md:p-5">
        <div className="flex justify-between">
          <h3 className="font-bold text-lg text-blue-400 truncate break-words w-52">{employee.name}</h3>
          <div className="font-semibold">{totalExperience}</div>
        </div>
        <div>
          {firstPosition && (
            <div className="my-2">
              <p className="truncate break-words font-semibold">
                {getPositionName(firstPosition.positionResourceId)}
              </p>
              {firstToolLanguage && (
                <div className="pl-4">
                  <p className="mb-4">
                    {getToolLanguageName(
                      firstToolLanguage.toolLanguageResourceId
                    )}
                  </p>
                  <pre className="font-sans truncate break-words text-gray-400">
                    {firstToolLanguage.description}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <button
        onClick={handleDeleteClick}
        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 "
      >
        Delete
      </button>
    </div>
  );
};

export default EmployeeCard;
