import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import React, { useState, useEffect } from "react";

const categories = [
  { id: "web development", label: "Web Development" },
  { id: "mobile apps", label: "Mobile Apps" },
  { id: "ai projects", label: "AI Projects" },
  { id: "game development", label: "Game Development" },
  { id: "data science", label: "Data Science" },
  { id: "blockchain", label: "Blockchain" },
  { id: "other", label: "Other" },
];

const price = [
  { value: "low", name: "Low to High" },
  { value: "high", name: "High to Low" },
];

const Filter = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId];

        handleFilterChange(newCategories, sortByPrice);
        console.log(newCategories)
        return newCategories;
        // console.log(newCategories)
    });
  };

  const selectByPriceHandler = (selectedValue) => {
    setSortByPrice(selectedValue);
    handleFilterChange(selectedCategories, selectedValue);
  }

  useEffect(() => {
    handleFilterChange(selectedCategories, sortByPrice);
  }, [selectedCategories, sortByPrice]);
  

  return (
    <div className="w-full md:w-[20%] bg-black text-white p-4 rounded-lg shadow-lg">
      <h1 className="font-semibold text-lg md:text-xl mb-4">Filter Options</h1>

      {/* Sorting Options */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col space-y-4">
          {price.map((item) => (
            <label key={item.value} className="flex items-center space-x-3 text-white w-48 cursor-pointer">
              <input
                type="radio"
                className="form-checkbox h-5 w-5 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                checked={sortByPrice === item.value}
                onChange={() => selectByPriceHandler(item.value)}
              />
              <span className="text-md">{item.name}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator className="my-4 border-gray-600" />

      {/* Category Selection */}
      <h1 className="font-semibold text-lg md:text-xl mb-4">Category</h1>
      <div className="flex flex-col space-y-4">
        {categories.map((category) => (
         <div key={category.label} className="flex items-center space-x-2 my-2">
            <Checkbox
              id={category.label}
              onCheckedChange={() => handleCategoryChange(category.label)}
            />
            <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {category.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;
