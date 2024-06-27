"use client";
import React, { useEffect, useState } from "react";
import { fetchPositionResources } from "@/lib/features/employees/employeeSlice";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuid4 } from "uuid";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { ICreateEmployeeForm } from "../app/(employees)/create/page";
import { FieldArrayToolLanguages } from "./FieldArrayToolLanguages";

export function FieldArrayPositions({ isEdit = false }: { isEdit?: boolean }) {
  const dispatch = useAppDispatch();
  const [positionsActive, setPositionsActive] = useState<any>({});
  const { positionResources, editEmployee, loadingPositionResources } = useAppSelector(
    (state: RootState) => state.employees
  );

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

  useEffect(() => {
    if (isEdit && editEmployee) {
      const activePositions: { [key: number]: string } = {};
      editEmployee.positions.forEach((position, index) => {
        activePositions[index] = position.positionResourceId;
      });
      setPositionsActive(activePositions);
    }
  }, [isEdit, editEmployee]);

  useEffect(() => {
    if (positionResources.length === 0 && loadingPositionResources === 'idle') {
      dispatch(fetchPositionResources());
    }
  }, [positionResources, loadingPositionResources, dispatch]);

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
              <div className="md:flex justify-between mb-4">
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
                    className="mt-4 md:mt-0 w-52 ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
                    onClick={() => (fields.length > 1 ? remove(index) : null)}
                  >
                    Delete Position
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
                <FieldArrayToolLanguages
                  positionResourceId={positionsActive[index]}
                  positionIndex={index}
                />
              )}
              <hr className="mb-4" />
            </div>
          </React.Fragment>
        );
      })}
      <div>
        {errors?.positions?.at(errors.positions.length - 1)?.message && (
          <p className="text-red-500 text-xs italic mt-4">
            {errors?.positions?.at(errors.positions.length - 1)?.message}
          </p>
        )}
      </div>
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
                  from: "2023",
                  to: "2024",
                  description: "",
                  images: [{ id: uuid4(), cdnUrl: "" }],
                },
              ],
            })
          }
          className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Position
        </button>
      </div>
    </div>
  );
}
