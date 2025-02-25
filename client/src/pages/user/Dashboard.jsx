import React, { useState } from "react";
import { useGetAllProjectsQuery } from "@/redux/api/projectApi";
import { useNavigate } from "react-router-dom";
import SearchResult from "./SearchResult";
function Dashboard() {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchInput.trim() !== "") {
      navigate(`/projects/search?query=${searchInput}`);
    }
    setSearchInput("");
  };

  const { data, isLoading } = useGetAllProjectsQuery();
 
  return (
    <div className="bg-black text-white">
      <div className="flex justify-center items-center p-10">
        <input
          type="text"
          placeholder="Search"
          className="bg-black border-2 border-white rounded-full p-2 w-[500px] mr-5 text-white"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <button className="bg-white text-black rounded-full p-2 w-20" onClick={searchHandler}>
          Search
        </button>
      </div>

      <div className="bg-black">
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.map((project) => (
              <SearchResult key={project._id} project={project} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
