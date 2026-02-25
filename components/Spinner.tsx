"use client";
import PulseLoader from "react-spinners/PulseLoader";
import React from "react";

interface LoadingProps {
  loading: boolean;
}

const override: React.CSSProperties = {
  display: "block",
  margin: "100px auto",
  borderColor: "red",
};

const Spinner = ({ loading }: LoadingProps) => {
  return (
    <div className="flex justify-center items-center w-full">
      <PulseLoader
        color="#3b82f6"
        loading={loading}
        cssOverride={override}
        size={20} // Tamaño mucho más estético para puntos
        margin={5} // Espacio entre los puntos
        aria-label="Loading Spinner"
      />
    </div>
  );
};

export default Spinner;
