"use client";
import React, { useEffect, useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuid4 } from "uuid";
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { ICreateEmployeeForm } from "../app/(employees)/create/page";
import FieldArrayImages from "./FieldArrayImages";
import { toast } from "react-toastify";

export function FieldArrayToolLanguages({
  positionIndex,
  positionResourceId,
}: {
  isEdit?: boolean;
  positionIndex: number;
  positionResourceId: string;
}) {
  const { positionResources, editEmployee } = useAppSelector(
    (state: RootState) => state.employees
  );

  const {
    register,
    control,
    getValues,
    setValue,
    formState: { errors, isSubmitted },
  } = useFormContext<ICreateEmployeeForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `positions.${positionIndex}.toolLanguages`,
  });

  const formValues = getValues();

  useEffect(() => {
    if (editEmployee && (editEmployee.positions[positionIndex].positionResourceId !== positionResourceId)) {
      formValues.positions[positionIndex].toolLanguages.map((_, index) => {
        setValue(`positions.${positionIndex}.toolLanguages.${index}.toolLanguageResourceId`, "")
      })
    }
  },[positionResourceId])

  const toolLanguageResources: any =  useMemo(() => {
    if (positionResourceId && positionResources.length > 0) {
      const currentPositionResources = positionResources.filter(
        (item) => item.positionResourceId === positionResourceId
      )[0];
      const toolLanguages = [...currentPositionResources.toolLanguageResources];
      return toolLanguages;
    }
    return [];
  }, [positionResourceId, positionResources])

  const removeToolLanguage = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast.error("Must have at least 1 tool/language");
    }
  };

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
                <button
                  className="ml-4 mb-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
                  onClick={() => removeToolLanguage(index)}
                >
                  Delete Tool
                </button>
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
                    {toolLanguageResources?.length > 0 &&
                      toolLanguageResources.map((item: any) => (
                        <option
                          value={item?.toolLanguageResourceId}
                          key={`${positionIndex}-${index}-${item?.toolLanguageResourceId}-${item?.name}`}
                        >
                          {item?.name}
                        </option>
                      ))}
                  </select>
                  {errors?.positions
                    ?.at(positionIndex)
                    ?.toolLanguages?.at(index)?.toolLanguageResourceId && (
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
                  {errors?.positions
                    ?.at(positionIndex)
                    ?.toolLanguages?.at(index)?.from && (
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
                  {errors?.positions
                    ?.at(positionIndex)
                    ?.toolLanguages?.at(index)?.to && (
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
                  rows={4}
                  placeholder="Description"
                  className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                />
                {isSubmitted &&
                  errors?.positions?.at(positionIndex)?.toolLanguages?.at(index)
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
                <FieldArrayImages
                  isEdit={true}
                  positionIndex={positionIndex}
                  toolIndex={index}
                />
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
                from: "2023",
                to: "2024",
                description: "",
                images: [{ id: uuid4(), cdnUrl: "" }],
              })
            }
            className="mt-4 mb-4 bg-slate-50 hover:bg-slate-100 border border-blue-500 text-blue-400 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Tool/Language
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}
