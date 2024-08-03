// src/components/FilterSidebar.tsx
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaTimes } from "react-icons/fa";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";

interface FilterOption {
  key: string;
  label: string;
}

interface FilterSidebarProps {
  showFilter: boolean;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  filters: {
    [key: string]: string;
    jobTitle: string;
    department: string;
    pastCompany: string;
  };
  handleFilterChange: (key: string, value: string) => void;
  clearFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  showFilter,
  setShowFilter,
  filters,
  handleFilterChange,
  clearFilters,
}) => {
  const [jobTitleCollapsed, setJobTitleCollapsed] = useState(true);
  const [departmentCollapsed, setDepartmentCollapsed] = useState(true);
  const [pastCompanyCollapsed, setPastCompanyCollapsed] = useState(true);
  const [options, setOptions] = useState([]);

  const toggleCollapse = (section: string) => {
    switch (section) {
      case "jobTitle":
        setJobTitleCollapsed(!jobTitleCollapsed);
        break;
      case "department":
        setDepartmentCollapsed(!departmentCollapsed);
        break;
      case "pastCompany":
        setPastCompanyCollapsed(!pastCompanyCollapsed);
        break;
      default:
        break;
    }
  };

  const renderFilterOptions = (options: FilterOption[], filterKey: string) => {
    return (
      <div className="relative">
        <div className="border rounded-md flex items-center p-1">
          <input className="w-full focus:outline-none" />
          <CiSearch />
        </div>
        {options.length > 0 && (
          <div className="absolute top-10 left-0">
            {options.map((option) => (
              <div key={option.key}>{option.label}</div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`relative  h-full w-64 overflow-y-auto bg-white rounded-md z-10 transition-all transform ${
        showFilter ? "translate-x-0 mr-3" : "-translate-x-80 w-0 "
      }`}
    >
      <div className="m-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Filters</h2>

          <div>
            <button
              onClick={clearFilters}
              className="border p-1 rounded text-sm bg-gray-200 hover:bg-gray-300 "
            >
              Clear Filters
            </button>
          </div>
        </div>
        <div className="mb-4">
          <h3
            className="text-sm font-semibold mb-2 cursor-pointe flex items-center justify-between"
            onClick={() => toggleCollapse("jobTitle")}
          >
            Job Title
            {jobTitleCollapsed ? <GoTriangleDown /> : <GoTriangleUp />}
          </h3>
          {!jobTitleCollapsed && (
            <ul className="list-none p-0 m-0">
              {renderFilterOptions(options, "jobTitle")}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <h3
            className="text-sm font-semibold mb-2 cursor-pointer flex items-center justify-between "
            onClick={() => toggleCollapse("department")}
          >
            Department
            {departmentCollapsed ? <GoTriangleDown /> : <GoTriangleUp />}
          </h3>
          {!departmentCollapsed && (
            <ul className="list-none p-0 m-0">
              {renderFilterOptions(options, "department")}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <h3
            className="text-sm font-semibold mb-2 cursor-pointer flex items-center justify-between"
            onClick={() => toggleCollapse("pastCompany")}
          >
            Past Companies{" "}
            {pastCompanyCollapsed ? <GoTriangleDown /> : <GoTriangleUp />}
          </h3>
          {!pastCompanyCollapsed && (
            <ul className="list-none p-0 m-0">
              {renderFilterOptions(options, "pastCompany")}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
