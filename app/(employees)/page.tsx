"use client";
import React, { useState, useEffect, useCallback } from "react";
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
import { useInView } from "react-intersection-observer";
import SkeletonCard from "@/components/GridCardsSkeleton";

const PAGE_SIZE = 10;

export default function EmployeeList() {
  const dispatch = useAppDispatch();
  const { employees, positionResources, loading, error, totalPages } =
    useAppSelector((state: RootState) => state.employees);

  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const hasMore = pageNumber < totalPages;
  const [scrollTrigger, isInView] = useInView();

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

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

  const fetchMoreEmployees = useCallback(() => {
    dispatch(
      fetchEmployees({
        search: searchTerm,
        pageNumber: pageNumber + 1,
        pageSize: PAGE_SIZE,
        append: true,
      })
    );
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  }, [dispatch, pageNumber, searchTerm]);

  useEffect(() => {
    if (isInView && hasMore) {
      fetchMoreEmployees();
    }
  }, [isInView, hasMore, fetchMoreEmployees]);

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
    setPageNumber(1); // Reset page number to 1 when searching
    dispatch(
      fetchEmployees({
        search: searchTerm,
        pageNumber: 1,
        pageSize: PAGE_SIZE,
        append: false,
      })
    );
  };

  const handleDelete = (id: string) => {
    dispatch(deleteEmployeeById(id));
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

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
      {loading === 'pending' ? (
        <SkeletonCard />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {employees.map((employee) => (
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

      <div className="...">
        {(hasMore && <div ref={scrollTrigger}>Loading...</div>) || (
          <p className="...">No more posts to load</p>
        )}
      </div>
    </div>
  );
}
