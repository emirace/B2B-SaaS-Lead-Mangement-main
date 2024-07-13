// src/pages/Leads.tsx
import React, { useEffect, useState } from "react";
import { FaSearch, FaSort, FaFilter } from "react-icons/fa";
import { axiosInstance } from "../../context/Auth";
import Filter from "../../components/Filter";
import { Link } from "react-router-dom";

interface Lead {
  linkedInUrl: { value: string };
  firstName: { value: string };
  lastName: { value: string };
  email: { value: string };
  company: { value: string };
  // Add other fields as needed
}

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<{
    country: string;
    jobTitle: string;
    department: string;
    pastCompany: string;
  }>({
    country: "",
    jobTitle: "",
    department: "",
    pastCompany: "",
  });

  useEffect(() => {
    fetchLeads();
  }, [searchTerm, sortField, sortOrder, currentPage, pageSize, filters]);

  const fetchLeads = async () => {
    try {
      const response = await axiosInstance.get("/leads", {
        params: {
          search: searchTerm,
          sort: sortField,
          order: sortOrder,
          page: currentPage,
          size: pageSize,
          filter: filters,
        },
      });
      setLeads(response.data.leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };
  console.log(filters);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  const clearFilter = () => {};

  return (
    <div className="container relative h-[calc(100vh-190px)] w-screen  mx-auto p-4">
      <div className="text-xl md:text-3xl font-bold mb-4">Leads</div>

      <Filter
        clearFilters={clearFilter}
        filters={filters}
        handleFilterChange={handleFilterChange}
        setShowFilter={setShowFilter}
        showFilter={showFilter}
      />
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-10 items-center mb-4">
          <FaFilter
            onClick={() => setShowFilter(true)}
            size={18}
            className="cursor-pointer"
          />
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="border p-2 rounded"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className="absolute top-2 right-2 text-gray-500" />
          </div>
        </div>
        <div>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border p-2 rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>
      <div className="min-h-full w-full overflow-x-auto">
        <table className="min-w-full  bg-white ">
          <thead className="border ">
            <tr className="">
              <th
                onClick={() => handleSort("firstName")}
                className="cursor-pointer p-2"
              >
                <div className="flex items-center gap-2">
                  Name <FaSort />
                </div>
              </th>
              <th
                onClick={() => handleSort("title")}
                className="cursor-pointer p-2 w-32"
              >
                <div className="flex items-center gap-2">
                  Title <FaSort />
                </div>
              </th>

              <th
                onClick={() => handleSort("company")}
                className="cursor-pointer p-2"
              >
                <div className="flex items-center gap-2">
                  Company <FaSort />
                </div>
              </th>
              <th
                onClick={() => handleSort("email")}
                className="cursor-pointer p-2"
              >
                <div className="flex items-center gap-2">
                  Email <FaSort />
                </div>
              </th>
              <th>LinkedIn</th>
              {/* Add other headers as needed */}
            </tr>
          </thead>
          <tbody className="border">
            {leads.map((lead, index) => (
              <tr key={index} className="border p-2">
                <td className="font-medium capitalize p-2 border-r-2 flex">
                  <input type="checkbox" className="mr-2" />
                  <Link className="whitespace-nowrap text-blue-400" to="#">
                    {lead.firstName.value + " " + lead.lastName.value}
                  </Link>
                </td>
                <td></td>
                <td>{lead?.company?.value}</td>
                <td>{lead.email.value}</td>
                <td>
                  <a
                    href={lead.linkedInUrl.value}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </td>
                {/* Add other fields as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="border p-2 rounded"
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="border p-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Leads;
