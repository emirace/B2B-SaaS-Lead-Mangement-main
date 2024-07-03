"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";
import axios, { CancelTokenSource } from "axios";
import { CSVRow } from "@/components/csv-upload";

interface DataContextType {
  leadResults: any[];
  companyResults: any[];
  isUploading: boolean;
  progress: number;
  total: number;
  showProgressPopup: boolean;
  isMinimized: boolean;
  startUpload: (
    csvData: CSVRow[],
    fieldMappings: { [key: string]: string }
  ) => void;
  cancelUpload: () => void;
  closeModal: () => void;
  minimizeModal: () => void;
  setLeadResults: React.Dispatch<React.SetStateAction<any[]>>;
  setCompanyResults: React.Dispatch<React.SetStateAction<any[]>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [leadResults, setLeadResults] = useState<any[]>([]);
  const [companyResults, setCompanyResults] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [showProgressPopup, setShowProgressPopup] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [cancelSource, setCancelSource] = useState<CancelTokenSource | null>(
    null
  );

  const startUpload = async (
    csvData: CSVRow[],
    fieldMappings: { [key: string]: string }
  ) => {
    const CHUNK_SIZE = 500;
    setIsUploading(true);
    setShowProgressPopup(true);
    setProgress(0);

    const totalChunks = Math.ceil(csvData.length / CHUNK_SIZE);
    setTotal(csvData.length);

    const chunks = [];
    for (let i = 0; i < totalChunks; i++) {
      chunks.push(csvData.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE));
    }

    const source = axios.CancelToken.source();
    setCancelSource(source);

    try {
      let count = 1;
      const results = await Promise.all(
        chunks.map(async (chunk, index) => {
          const response = await axios.post(
            "https://b2b-saas-lead-mangement-main.onrender.com/api/upload-csv",
            {
              csvData: chunk,
              fieldMappings,
            },
            {
              cancelToken: source.token,
            }
          );
          setProgress((count / totalChunks) * 100);
          count += 1;
          return response.data;
        })
      );

      const leadResults: any[] = [];
      const companyResults: any[] = [];

      results.forEach(
        ({ leadResults: leadRes, companyResults: companyRes }) => {
          leadResults.push(...leadRes);
          companyResults.push(...companyRes);
        }
      );

      setLeadResults(leadResults);
      setCompanyResults(companyResults);
    } catch (error) {
      console.error("Error uploading CSV:", error);
    } finally {
      setIsUploading(false);
      setProgress(100);
    }
  };

  const cancelUpload = () => {
    if (cancelSource) {
      cancelSource.cancel("Upload cancelled by user");
    }
    setShowProgressPopup(false);
    setIsUploading(false);
    setProgress(0);
  };

  const closeModal = () => {
    setShowProgressPopup(false);
  };

  const minimizeModal = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <DataContext.Provider
      value={{
        leadResults,
        companyResults,
        isUploading,
        progress,
        total,
        showProgressPopup,
        isMinimized,
        startUpload,
        cancelUpload,
        closeModal,
        minimizeModal,
        setLeadResults,
        setCompanyResults,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
