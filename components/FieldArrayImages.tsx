import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuid4 } from "uuid";
import Image from "next/image";
import { ArrowUpTrayIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import { ICreateEmployeeForm } from "@/app/(employees)/create/page";

interface FieldArrayImagesProps {
  isEdit?: boolean;
  positionIndex: number;
  toolIndex: number;
}

interface ImagePreview {
  [index: number]: string;
}

interface LoadingState {
  [index: number]: boolean;
}

const FieldArrayImages: React.FC<FieldArrayImagesProps> = ({
  isEdit = false,
  positionIndex,
  toolIndex,
}) => {
  const [imagesPreview, setImagesPreview] = useState<ImagePreview>({});
  const [loading, setLoading] = useState<LoadingState>({});

  const {
    control,
    getValues,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<ICreateEmployeeForm>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `positions.${positionIndex}.toolLanguages.${toolIndex}.images`,
  });

  useEffect(() => {
    if (isEdit) {
      const formValues = getValues();
      const newImagesPreview: ImagePreview = {};
      formValues.positions[positionIndex].toolLanguages[
        toolIndex
      ].images.forEach((item: any, i: number) => {
        newImagesPreview[i] = item.cdnUrl || "";
      });
      setImagesPreview(newImagesPreview);

      const newLoading: LoadingState = {};
      formValues.positions[positionIndex].toolLanguages[
        toolIndex
      ].images.forEach((_, i: number) => {
        newLoading[i] = false;
      });
      setLoading(newLoading);
    }
  }, [isEdit, getValues, positionIndex, toolIndex]);

  const handleImageUpload = async (file: File, index: number) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mvbygjsu");

    setLoading((prev) => ({ ...prev, [index]: true }));

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dwhaokd0c/image/upload`,
        formData
      );
      const imageUrl = response.data.secure_url;
      const newImagesPreview = {
        ...imagesPreview,
        [index]: imageUrl,
      };
      setImagesPreview(newImagesPreview);
      setValue(
        `positions.${positionIndex}.toolLanguages.${toolIndex}.images.${index}.cdnUrl`,
        imageUrl
      );
      toast.success("Upload image succeed", {
        autoClose: 500,
      });
    } catch (error) {
      toast.error("Error uploading image!");
    } finally {
      setLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageUpload(e.target.files[0], index);
    }
  };

  const removeImage = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      const formValues = getValues();
      const newImagesPreview: ImagePreview = {};
      formValues.positions[positionIndex].toolLanguages[
        toolIndex
      ].images.forEach((item: any, i: number) => {
        newImagesPreview[i] = item.cdnUrl || "";
      });
      setImagesPreview(newImagesPreview);
    } else {
      toast.error("Must have at least 1 photo!")
    }
  };

  const appendImage = () => {
    append({
      id: uuid4(),
      cdnUrl: "",
    });
    setImagesPreview((prevState) => ({ ...prevState, [fields.length]: "" }));
  };

  return (
    <div className="ml-5">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Images
      </label>
      <div className="flex flex-wrap gap-4 mb-4 min-h-[220px]">
        {fields.map((item, index) => (
          <React.Fragment key={item.id}>
            <div className="relative mb-2 group">
              {loading[index] ? (
                <div className="flex items-center justify-center w-[240px] h-[184px] border border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50">
                  <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
                </div>
              ) : imagesPreview[index] ? (
                <div>
                  <Image
                    width={240}
                    height={184}
                    style={{ height: "184px", width: "240px" }}
                    src={imagesPreview[index]}
                    alt="Image"
                    className="object-fit rounded-2xl"
                  />
                  <XCircleIcon
                    onClick={() => removeImage(index)}
                    className="h-6 w-6 text-red-500 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  />
                </div>
              ) : (
                <>
                  <div className="w-full md:w-60 mb-5">
                    <label
                      htmlFor={`dropzone-file-${index}`}
                      className="flex flex-col items-center justify-center px-4 py-9 w-full border border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 "
                    >
                      <div className="mb-3 flex items-center justify-center">
                        <ArrowUpTrayIcon className="h-6 w-6" />
                      </div>
                      <h2 className="text-center text-gray-400   text-xs font-normal leading-4 mb-1">
                        PNG, JPG or JPEG, smaller than 5MB
                      </h2>
                      <h4 className="text-center text-gray-900 text-sm font-medium leading-snug">
                        Drag and Drop your file here or choose file
                      </h4>
                      <input
                        id={`dropzone-file-${index}`}
                        type="file"
                        onChange={(e) => handleFileChange(e, index)}
                        className="sr-only hidden"
                      />
                      <XCircleIcon
                        onClick={() => removeImage(index)}
                        className="h-6 w-6 text-red-500 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                      />
                    </label>
                  </div>
                  {errors?.positions
                    ?.at(positionIndex)
                    ?.toolLanguages?.at(toolIndex)
                    ?.images?.at(index)?.cdnUrl && (
                    <p className="text-red-500 text-xs italic mt-4">
                      {
                        errors?.positions
                          ?.at(positionIndex)
                          ?.toolLanguages?.at(toolIndex)
                          ?.images?.at(index)?.cdnUrl?.message
                      }
                    </p>
                  )}
                </>
              )}
              <input
                type="text"
                {...register(
                  `positions.${positionIndex}.toolLanguages.${toolIndex}.images.${index}.cdnUrl`
                )}
                className="border border-gray-300 p-2 ml-2"
                hidden
              />
            </div>
          </React.Fragment>
        ))}
      </div>

      <button
        type="button"
        onClick={() => appendImage()}
        className="bg-slate-50 hover:bg-slate-100 border border-green-500 text-green-400 font-bold p-2 rounded focus:outline-none focus:shadow-outline"
      >
        Add Image
      </button>
    </div>
  );
};

export default FieldArrayImages;
