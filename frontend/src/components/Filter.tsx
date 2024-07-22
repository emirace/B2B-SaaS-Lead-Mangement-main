// src/components/FilterSidebar.tsx
import React, { useState } from "react";
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

const jobTitleOptions: FilterOption[] = [
  { key: "", label: "All Job Titles" },
  { key: "Manager", label: "Manager" },
  { key: "Developer", label: "Developer" },
  { key: "Designer", label: "Designer" },
  // Add more options as needed
];

const departmentOptions: FilterOption[] = [
  { key: "", label: "All Departments" },
  { key: "IT", label: "IT" },
  { key: "Marketing", label: "Marketing" },
  { key: "Sales", label: "Sales" },
  // Add more options as needed
];

const pastCompanyOptions: FilterOption[] = [
  { key: "", label: "All Past Companies" },
  { key: "Company A", label: "Company A" },
  { key: "Company B", label: "Company B" },
  { key: "Company C", label: "Company C" },
  // Add more options as needed
];

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

  const renderFilterOptions = (options: FilterOption[], filterKey: string) =>
    options.map((option) => (
      <li
        className={`mb-2 text-xs px-2 ${
          filters[filterKey] === option.key ? "text-bold text-primary" : ""
        } `}
        key={option.key}
        onClick={() => handleFilterChange(filterKey, option.key)}
      >
        {option.label}
      </li>
    ));

  return (
    <div
      className={`absolute top-0 left-0 bottom-0 min-w-64 h-full p-4 overflow-y-auto bg-gray-100 z-10 transition-transform transform ${
        showFilter ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <FaTimes
        onClick={() => setShowFilter(false)}
        className="absolute top-4 right-4"
      />
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
            {renderFilterOptions(jobTitleOptions, "jobTitle")}
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
            {renderFilterOptions(departmentOptions, "department")}
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
            {renderFilterOptions(pastCompanyOptions, "pastCompany")}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;
