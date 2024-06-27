"use client";
// src/components/EmployeeCard.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

interface Image {
  id: string;
  cdnUrl: string;
  displayOrder: number;
}

interface ToolLanguage {
  id: string;
  toolLanguageResourceId: string;
  displayOrder: number;
  from: number;
  to: number;
  description: string;
  images: Image[];
}

interface Position {
  id: string;
  positionResourceId: string;
  displayOrder: number;
  toolLanguages: ToolLanguage[];
}

interface Employee {
  id: string;
  name: string;
  positions: Position[];
}

interface EmployeeCardProps {
  employee: Employee;
  getPositionName: (positionResourceId: string) => string;
  getToolLanguageName: (toolLanguageResourceId: string) => string;
  onDelete: (id: string) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  getPositionName,
  getToolLanguageName,
  onDelete,
}) => {
  // Gather all images from all positions and toolLanguages
  const allImages = employee.positions.flatMap((position) =>
    position.toolLanguages.flatMap((tool) => tool.images)
  )
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
  return (
    <div className="border rounded-md shadow-md p-4 my-2 relative group cursor-pointer transition duration-500 hover:scale-105">
      <Link href={`/edit/${employee.id}`}>
        <h3 className="font-bold text-xl">{employee.name}</h3>
      </Link>
      <div className="mt-4">
        <Carousel {...carouselConfig}>
          {allImages.map((image) => (
            <Image
              key={image.id}
              width={200}
              height={200}
              src={image.cdnUrl}
              alt="Tool/language"
              className="object-cover w-full h-72"
            />
          ))}
        </Carousel>
      </div>
      <div>
        {employee.positions.map((position) => (
          <div key={position.id} className="my-2">
            <p className="font-semibold">
              {getPositionName(position.positionResourceId)}
            </p>
            <div className="pl-4">
              {position.toolLanguages.map((tool) => (
                <div key={tool.id} className="mb-2">
                  <p>{getToolLanguageName(tool.toolLanguageResourceId)}</p>
                  <p>
                    {tool.from} - {tool.to}
                  </p>
                  <pre className="truncate whitespace-pre-wrap break-words">{tool.description}</pre>
                  <div className="carousel space-x-2"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => onDelete(employee.id)}
        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded transition transform ease-in-out invisible group-hover:visible"
      >
        Delete
      </button>
    </div>
  );
};

export default EmployeeCard;
