"use client";
import BarLoader from "react-spinners/BarLoader";
import React from "react";

interface LoadingProps {
  loading: boolean;
}

const override: React.CSSProperties = {
  display: "block",
  margin: "100px auto",
  borderColor: "red",
};

const LoadingPage = ({ loading }: LoadingProps) => {
  return (
    <div className="flex justify-center items-center w-full">
      <BarLoader
        color="#3b82f6"
        loading={loading}
        cssOverride={override}
        width={450}
        height={15}
        aria-label="Loading Spinner"
      />
    </div>
  );
};

export default LoadingPage;
