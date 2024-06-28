"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  fetchEmployees,
  fetchPositionResources,
  deleteEmployeeById,
} from "@/lib/features/employees/employeeSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import SearchBar from "@/components/SearchBar";
import EmployeeCard from "@/components/EmployeeCard";
import Link from "next/link";
import SkeletonCard from "@/components/GridCardsSkeleton";
import EmptyEmployeeList from "@/components/EmptyEmployeeList";
import { sortEmployeesByExperience } from "@/utils/helps";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;

export default function EmployeeList() {
  const dispatch = useAppDispatch();
  const { employees, positionResources, loading, error, totalPages } =
    useAppSelector((state: RootState) => state.employees);

  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (pageNumber < totalPages) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }
  }, [pageNumber, totalPages]);

  useEffect(() => {
    if (isMounted) {
      dispatch(
        fetchEmployees({
          search: searchTerm,
          pageNumber,
          pageSize: PAGE_SIZE,
          append: false,
        })
      );
      dispatch(fetchPositionResources());
    }
  }, [dispatch, isMounted]);

  const observerTarget = useRef(null);

  useEffect(() => {
    if (pageNumber > 1 && hasMore) {
      dispatch(
        fetchEmployees({
          search: searchTerm,
          pageNumber: pageNumber,
          pageSize: PAGE_SIZE,
          append: true,
        })
      );
    }
  }, [pageNumber, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          reachedBottomList();
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, hasMore]);

  const reachedBottomList = () => {
    setPageNumber((prevState) => {
      return prevState + 1;
    });
  };

  const getPositionName = (positionResourceId: string) => {
    const position = positionResources.find(
      (res) => res.positionResourceId === positionResourceId
    );
    return position ? position.name : "";
  };

  const getToolLanguageName = (toolLanguageResourceId: string): string => {
    for (const position of positionResources) {
      const tool = position.toolLanguageResources.find(
        (res) => res.toolLanguageResourceId === toolLanguageResourceId
      );
      if (tool) {
        return tool.name;
      }
    }
    return "";
  };

  const handleSearch = () => {
    setPageNumber(1);
    dispatch(
      fetchEmployees({
        search: searchTerm,
        pageNumber: 1,
        pageSize: PAGE_SIZE,
        append: false,
      })
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteEmployeeById({id, triggerGetData: true}));
      toast.success("Deleted employee", {
        autoClose: 300
      });
    } catch (error) {
      toast.error("Failed to delete employee!");
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const sortedEmployees = sortEmployeesByExperience(employees);

  return (
    <div className="w-full p-12">
      <h1 className="text-2xl font-bold">List employees</h1>
      <div className="md:flex justify-between items-start mb-4 mt-4">
        <div className="flex space-x-2 mb-4">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
          />
        </div>
        <Link
          href="/create"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add employee
        </Link>
      </div>
      {loading === "pending" || loading === "idle" ? (
        <SkeletonCard />
      ) : sortedEmployees.length === 0 ? (
        <EmptyEmployeeList />
      ) : (
        // <p className="text-gray-500">No employees found.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {sortedEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              getPositionName={getPositionName}
              getToolLanguageName={getToolLanguageName}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      <div ref={observerTarget}></div>
    </div>
  );
}
