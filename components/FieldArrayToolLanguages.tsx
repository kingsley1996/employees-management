"use client";
import React, { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuid4 } from "uuid";
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { ICreateEmployeeForm } from "../app/(employees)/create/page";
import { ToolLanguageResource } from "@/lib/features/employees/employeeSlice";
import FieldArrayImages from "./FieldArrayImages";

export function FieldArrayToolLanguages({
  positionIndex,
  positionResourceId
}: {
  positionIndex: number;
  positionResourceId: string;
}) {
  const [toolLanguages, setToolLanguages] = useState<ToolLanguageResource[]>([]);
  const { positionResources } = useAppSelector(
    (state: RootState) => state.employees
  );

  const {
    register,
    control,
    formState: { errors, isSubmitted },
  } = useFormContext<ICreateEmployeeForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `positions.${positionIndex}.toolLanguages`,
  });

  useEffect(() => {
    if (positionResourceId && positionResources.length > 0) {
        const currentPositionResources = positionResources.filter(item => item.positionResourceId === positionResourceId)[0];
        const toolLanguages = [...currentPositionResources.toolLanguageResources];
        setToolLanguages(toolLanguages);
    }
   

  }, [positionResources, positionResourceId]);

  return (
    <React.Fragment>
      <div className="ml-5">
        {fields.map((item, index) => {
          return (
            <React.Fragment key={item.id}>
              <div className="flex justify-between items-center">
                <label className="block text-gray-700 text-md font-bold mb-2">
                  Tool/Language
                </label>
                {fields.length > 1 && (
                  <button
                    className="ml-4 mb-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
                    onClick={() => (fields.length > 1 ? remove(index) : null)}
                  >
                    Delete
                  </button>
                )}
              </div>

              <div className="relative md:flex gap-4">
                <div className="mb-4 w-full md:w-1/3">
                  <select
                    {...register(
                      `positions.${positionIndex}.toolLanguages.${index}.toolLanguageResourceId`
                    )}
                    className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                  >
                    <option value="" disabled>
                      Select Option
                    </option>
                    {toolLanguages?.length > 0 &&
                    toolLanguages.map((item: any) => (
                      <option
                        value={item?.toolLanguageResourceId}
                        key={`${item?.toolLanguageResourceId}-${item?.name}`}
                      >
                        {item?.name}
                      </option>
                    ))}
                  </select>
                  {errors?.positions?.at(positionIndex)?.toolLanguages?.at(index)
                    ?.toolLanguageResourceId && (
                    <p className="text-red-500 text-xs italic mt-4">
                      {
                        errors?.positions
                          ?.at(positionIndex)
                          ?.toolLanguages?.at(index)?.toolLanguageResourceId
                          .message
                      }
                    </p>
                  )}
                </div>
                <div className="mb-4 w-full md:w-1/3">
                  <select
                    {...register(
                      `positions.${positionIndex}.toolLanguages.${index}.from`
                    )}
                    className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                  >
                    <option value="" disabled>
                      Select Option
                    </option>
                    {Array.from(
                      { length: new Date().getFullYear() - 1899 },
                      (_, i) => (
                        <option
                          key={`${positionIndex}-${index}-from-${i}`}
                          value={new Date().getFullYear() - i}
                        >
                          {new Date().getFullYear() - i}
                        </option>
                      )
                    )}
                  </select>
                  {errors?.positions?.at(positionIndex)?.toolLanguages?.at(index)
                    ?.from && (
                    <p className="text-red-500 text-xs italic mt-4">
                      {
                        errors?.positions
                          ?.at(positionIndex)
                          ?.toolLanguages?.at(index)?.from?.message
                      }
                    </p>
                  )}
                </div>
                <div className="mb-4 w-full md:w-1/3">
                  <select
                    {...register(
                      `positions.${positionIndex}.toolLanguages.${index}.to`
                    )}
                    className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                  >
                    <option value="" disabled>
                      Select Option
                    </option>
                    {Array.from(
                      { length: new Date().getFullYear() - 1899 },
                      (_, i) => (
                        <option
                          key={`${positionIndex}-${index}-to-${i}`}
                          value={new Date().getFullYear() - i}
                        >
                          {new Date().getFullYear() - i}
                        </option>
                      )
                    )}
                  </select>
                  {errors?.positions?.at(positionIndex)?.toolLanguages?.at(index)
                    ?.to && (
                    <p className="text-red-500 text-xs italic mt-4">
                      {
                        errors?.positions
                          ?.at(positionIndex)
                          ?.toolLanguages?.at(index)?.to?.message
                      }
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <textarea
                  {...register(
                    `positions.${positionIndex}.toolLanguages.${index}.description`
                  )}
                  placeholder="Description"
                  className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                />
                {isSubmitted && errors?.positions?.at(positionIndex)?.toolLanguages?.at(index)
                  ?.description && (
                  <p className="text-red-500 text-xs italic mt-4">
                    {
                      errors?.positions
                        ?.at(positionIndex)
                        ?.toolLanguages?.at(index)?.description?.message
                    }
                  </p>
                )}
              </div>
              <div className="mb-4">
              <FieldArrayImages isEdit={true} positionIndex={positionIndex} toolIndex={index} />
            </div>
            </React.Fragment>
          );
        })}
        <div>
          <button
            type="button"
            onClick={() =>
              append({
                id: uuid4(),
                toolLanguageResourceId: "",
                from: '2023',
                to: '2024',
                description: "",
                images: [{ id: uuid4(), cdnUrl: "" }],
              })
            }
            className="mt-4 mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Tool/Language
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}
