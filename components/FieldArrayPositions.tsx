"use client";
import React, { useEffect, useState } from "react";
import { fetchPositionResources } from "@/lib/features/employees/employeeSlice";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuid4 } from "uuid";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { ICreateEmployeeForm } from "../app/(employees)/create/page";
import { FieldArrayToolLanguages } from "./FieldArrayToolLanguages";

export function FieldArrayPositions() {
  const [positionsActive, setPositionsActive] = useState<any>({});
  const dispatch = useAppDispatch();
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useFormContext<ICreateEmployeeForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "positions",
  });

  const { positionResources } = useAppSelector(
    (state: RootState) => state.employees
  );

  useEffect(() => {
    if (positionResources.length === 0) {
      dispatch(fetchPositionResources());
    }
  }, [dispatch, positionResources]);

  const handleSelectChange = (index: number, value: string) => {
    setValue(`positions.${index}.positionResourceId`, value);
    setPositionsActive((prev: any) => ({
      ...prev,
      [index]: value,
    }));
  };

  return (
    <div>
      {fields.map((item, index) => {
        return (
          <React.Fragment key={item.id}>
            <label className="block text-gray-700 text-xl font-bold mb-2">
              Positions
            </label>
            <div className="mt-2">
              <div className="flex justify-between mb-4">
                <select
                  {...register(`positions.${index}.positionResourceId`)}
                  className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                  onChange={(e) => handleSelectChange(index, e.target.value)}
                >
                  <option value="" disabled>
                    Select Option
                  </option>
                  {positionResources.map((item: any) => (
                    <option key={item.id} value={item.positionResourceId}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {fields.length > 1 && (
                  <button
                    className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
                    onClick={() => (fields.length > 1 ? remove(index) : null)}
                  >
                    Delete
                  </button>
                )}
              </div>
              {errors?.positions?.at(index)?.positionResourceId && (
                <p className="text-red-500 text-xs italic mt-4">
                  {errors.positions?.at(index)?.positionResourceId?.message}
                </p>
              )}
              {/* Conditionally render FieldArrayToolLanguages if positionResourceId is selected */}
              {positionsActive[index] && (
                <FieldArrayToolLanguages positionResourceId={positionsActive[index]} positionIndex={index} />
              )}
              <hr className="mb-4" />
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
              positionResourceId: "",
              toolLanguages: [
                {
                  id: uuid4(),
                  toolLanguageResourceId: "",
                  from: '2023',
                  to: '2024',
                  description: "",
                  images: [{ id: uuid4(), cdnUrl: "" }],
                },
              ],
            })
          }
          className="mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Position
        </button>
      </div>
    </div>
  );
}