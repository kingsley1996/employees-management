"use client";
// src/components/EmployeeCard.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

interface Image {
  id: number;
  cdnUrl: string;
  displayOrder: number;
}

interface ToolLanguage {
  id: number;
  toolLanguageResourceId: number;
  displayOrder: number;
  from: number;
  to: number;
  description: string;
  images: Image[];
}

interface Position {
  id: number;
  positionResourceId: number;
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
  getPositionName: (positionResourceId: number) => string;
  getToolLanguageName: (toolLanguageResourceId: number) => string;
  onDelete: (id: string) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  getPositionName,
  getToolLanguageName,
  onDelete,
}) => {
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
    <div className="border p-4 my-2 relative group">
      <Link href={`/edit/${employee.id}`}>
        <h3 className="font-bold text-xl">{employee.name}</h3>
      </Link>
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
                  <p>{tool.description}</p>
                  <div className="carousel space-x-2">
                    <Carousel {...carouselConfig}>
                      {tool.images.map((image) => (
                        <Image
                          width={250}
                          height={250}
                          key={image.id}
                          src={image.cdnUrl}
                          alt="Tool"
                          className="object-cover w-full h-72"
                        />
                      ))}
                    </Carousel>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => onDelete(employee.id)}
        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hidden group-hover:block"
      >
        Delete
      </button>
    </div>
  );
};

export default EmployeeCard;
