// src/pages/People.tsx
import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaSort,
  FaFilter,
  FaLinkedinIn,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { axiosInstance } from "../../context/Auth";
import Filter from "../../components/Filter";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";

export interface Lead {
  _id: string;
  linkedInUrl: { value: string };
  firstName: { value: string };
  lastName: { value: string };
  email: { value: string };
  company: { value: string };
  jobTitle: { value: string };
  country: { value: string };
  // Add other fields as needed
}

const People: React.FC = () => {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFilter, setShowFilter] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
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
      setTotalPages(response.data.totalPages);
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
    <div className="flex  w-full">
      <Filter
        clearFilters={clearFilter}
        filters={filters}
        handleFilterChange={handleFilterChange}
        setShowFilter={setShowFilter}
        showFilter={showFilter}
      />
      <div className="bg-white rounded-md p-3 w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-10 items-center">
            {showFilter ? (
              <div
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-2 border p-2 rounded-md cursor-pointer"
              >
                <FaFilter
                  onClick={() => setShowFilter(!showFilter)}
                  size={12}
                  className="cursor-pointer"
                />
                <span>Hide Filter</span>
              </div>
            ) : (
              <div
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-2 border p-2 rounded-md cursor-pointer"
              >
                <FaFilter size={12} className="cursor-pointer" />
                <span>Show Filter</span>
              </div>
            )}
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
        <div className="overflow-auto h-[calc(100vh-300px)] w-full">
          <table className="min-w-full bg-white">
            <thead className="border sticky -top-1 z-20 h-full bg-white">
              <tr>
                <th
                  onClick={() => handleSort("firstName")}
                  className="cursor-pointer sticky left-0 bg-white  "
                >
                  <div className="flex items-center gap-2 border-r-2">
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

                <th
                  onClick={() => handleSort("phone")}
                  className="cursor-pointer p-2"
                >
                  <div className="flex items-center gap-2">
                    Phone <FaSort />
                  </div>
                </th>
                <th className="cursor-pointer p-2">
                  <div className="flex items-center gap-2">
                    Contact Location
                  </div>
                </th>
                <th>Actions</th>
                {/* Add other headers as needed */}
              </tr>
            </thead>
            <tbody className="border">
              {!leads ? (
                <div className="h-full w-full flex justify-center items-center p-5">
                  <Loading />
                </div>
              ) : leads.length === 0 ? (
                <div>No data found</div>
              ) : (
                leads.map((lead, index) => (
                  <tr key={index} className="border p-2">
                    <td className="font-medium capitalize p-2 border-r-2 flex items-start sticky left-0 bg-white">
                      <input type="checkbox" className="mr-2 mt-2" />
                      <div>
                        <Link
                          className={`whitespace-nowrap text-blue-400`}
                          to={`/lead/${lead._id}`}
                        >
                          {lead.firstName.value + " " + lead.lastName.value}
                        </Link>
                        <Link
                          to={lead?.linkedInUrl?.value}
                          aria-label="LinkedIn"
                          className="text-blue-700 hover:text-blue-900"
                        >
                          <FaLinkedinIn />
                        </Link>
                      </div>
                    </td>
                    <td>
                      <span className="px-2 capitalize">
                        {lead.jobTitle.value}
                      </span>
                    </td>
                    <td>
                      <Link to={`/company/${lead?.linkedInUrl?.value}`}>
                        {lead?.company?.value}
                      </Link>
                    </td>
                    <td>
                      <button className="flex items-center gap-2 border p-2 rounded-md mx-2">
                        <FaEnvelope /> Access email
                      </button>
                    </td>
                    <td>
                      <button className="flex items-center gap-2 border p-2 rounded-md mx-2">
                        <FaPhone /> Access Mobile
                      </button>
                    </td>
                    <td>{lead.country.value}</td>
                    <td></td>
                    {/* Add other fields as needed */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default People;
