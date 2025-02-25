import React from "react";
import Projects from "./Projects";
import { useGetAllProjectsQuery } from "@/redux/api/projectApi";

function Project() {
    const { data, isLoading, isError } = useGetAllProjectsQuery();
      console.log(data)
    if(isLoading) return <div>Loading...</div>
    if(isError) return <div>Error...</div>

  const projectArray = new Array(8).fill(null); // Create an array with 6 empty elements

  return (
    <div className="bg-black">
      <div className="max-w-7xl mx-auto p-6">
        {/* <h2 className="font-bold text-3xl text-center mb-10 text-white">Our Projects</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {/* Map over the array and render Projects 6 times */}
          {projectArray.map((_, index) => (
                <Projects key={index} project={data[index]} />  
          ))}
        </div>
      </div>
    </div>
  );
}

export default Project;
