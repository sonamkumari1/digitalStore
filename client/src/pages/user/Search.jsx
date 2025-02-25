import React, { useState, useEffect, useCallback } from "react";
import Filter from "./Filter";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { useSearchProjectsQuery } from "@/redux/api/projectApi";
import SearchResult from "./SearchResult";

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");


  // const { data, isLoading } = useSearchProjectsQuery({
    const { data, isLoading } = useSearchProjectsQuery({
      searchQuery: query,
      categories: selectedCategories.length ? selectedCategories : [], // Ensure it's an array
      sortByPrice,
  }, { refetchOnMountOrArgChange: true });
  

  const isEmpty = !isLoading && data?.projects?.length === 0;

  // Memoized filter handler to prevent unnecessary re-renders
  const handleFilterChange = (categories, price) => {
    setSelectedCategories(categories);
    setSortByPrice(price);
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-black text-white min-h-screen">
      {/* Search Header */}
      <div className="flex justify-between items-center">
        <div className="my-6">
          <h1 className="font-bold text-xl md:text-2xl">Results for Query</h1>
          <p>
            Showing results for{" "}
            <span className="text-blue-400 font-bold italic">{query}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <Filter handleFilterChange={handleFilterChange} />
        <div className="flex-1">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => <CourseSkeleton key={idx} />)
          ) : isEmpty ? (
            <CourseNotFound />
          ) : (
            <div className="bg-black">
              <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {data?.projects?.map((project) => 
                    <SearchResult key={project._id} project={project} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;

/* ------------------------------ Course Not Found ------------------------------ */
const CourseNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-32 bg-gray-900 p-6 rounded-lg">
      <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
      <h1 className="font-bold text-2xl md:text-4xl text-white mb-2">
        Project Not Found
      </h1>
      <p className="text-lg text-gray-400 mb-4">
        Sorry, we couldn't find the project you're looking for.
      </p>
      <Link to="/" className="italic">
        <Button variant="link" className="text-blue-400">
          Browse All Projects
        </Button>
      </Link>
    </div>
  );
};

/* ------------------------------ Skeleton Loader ------------------------------ */
const CourseSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col md:flex-row justify-between border-b border-gray-700 py-4">
      <div className="h-32 w-full md:w-64 bg-gray-800">
        <Skeleton className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-col gap-2 flex-1 px-4">
        <Skeleton className="h-6 w-3/4 bg-gray-700" />
        <Skeleton className="h-4 w-1/2 bg-gray-700" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-1/3 bg-gray-700" />
        </div>
        <Skeleton className="h-6 w-20 mt-2 bg-gray-700" />
      </div>

      <div className="flex flex-col items-end justify-between mt-4 md:mt-0">
        <Skeleton className="h-6 w-12 bg-gray-700" />
      </div>
    </div>
  );
};
