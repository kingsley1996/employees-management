"use client";
import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  getEmployeeById,
  updateEmployeeById,
} from "@/lib/features/employees/employeeSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FieldArrayPositions } from "@/components/FieldArrayPositions";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { v4 as uuid4 } from "uuid";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { EmployeeFormSchema } from "../../create/page";
import FormSkeleton from "@/components/FormSkeleton";

export type IEditEmployeeForm = z.infer<typeof EmployeeFormSchema>;

const defaultValues = {
  name: "",
  positions: [
    {
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
    },
  ],
};

export default function CreateEmployeeForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { id } = params;

  const { loading, loadingSubmit, editEmployee } = useAppSelector(
    (state: RootState) => state.employees
  );

  const methods = useForm<IEditEmployeeForm>({
    defaultValues: defaultValues,
    resolver: zodResolver(EmployeeFormSchema),
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (id) {
      dispatch(getEmployeeById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (editEmployee?.id) {
      setValue("name", editEmployee.name);
      setValue("positions", editEmployee.positions);
    }
  }, [editEmployee, setValue]);

  const onSubmit = async (data: any) => {
    const { positions, name } = data;
    try {
      await dispatch(updateEmployeeById({ id, positions, name }));
      toast.success("Employee updated successfully!");
      setTimeout(() => {
        router.push("/");
      }, 300);
    } catch (error) {
      toast.error("Failed to update employee!");
    }
  };

  const onValid = (e: any) => {
    console.log("errors: ", e);
  };

  return (
    <div className="w-full md:w-2/3 p-8 md:p-12">
      <div className="flex items-center mb-8">
        <Link href="/">
          <ArrowLeftIcon className="h-6 w-6" />
        </Link>
        <h1 className="text-md md:text-2xl font-bold ml-4">
          Edit Employee Form
        </h1>
      </div>
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onValid)}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                {...register("name")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
              />
              {errors.name && (
                <p className="text-red-500 text-xs italic">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <FieldArrayPositions isEdit={true} />
            </div>
            <button
              type="submit"
              disabled={loadingSubmit === "pending"}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
