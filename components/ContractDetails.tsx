import {
  FaCalendarAlt,
  FaFilePdf,
  FaMoneyBillWave,
  FaSeedling,
  FaIdCard,
  FaUserTie,
  FaMapMarkerAlt,
} from "react-icons/fa";

const ContractDetails = ({ contract }: { contract: any }) => {
  if (!contract) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-slate-500 font-medium animate-pulse">
          Loading contract details...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header: Title, Type and Status */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <span className="inline-block text-blue-600 text-xs font-bold uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              {contract.contractType}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-3">
              {contract.contractName}
            </h1>
            <p className="text-slate-500 mt-2 flex items-center gap-2 text-sm">
              Contract ID:{" "}
              <span className="font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                {contract._id}
              </span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-3 w-full md:w-auto">
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                contract.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {contract.status}
            </span>
            {contract.pdfUrl && (
              <a
                href={contract.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors bg-red-50 px-4 py-2 rounded-xl"
              >
                <FaFilePdf size={18} /> View Original PDF
              </a>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 1: Involved Parties */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="flex items-center gap-2 text-slate-800 font-bold mb-4 border-b pb-3 text-lg">
              <FaIdCard className="text-blue-500" /> Involved Parties
            </h3>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Contractor (Owner)
                </p>
                <p className="text-sm font-bold text-slate-800">
                  {contract.contractor_details.name}
                </p>
                <div className="text-xs text-slate-500 space-y-0.5 mt-1">
                  <p>{contract.contractor_details.email}</p>
                  <p>{contract.contractor_details.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Contractee (Entity/Farm)
                </p>
                <p className="text-sm font-bold text-slate-800">
                  {contract.contractee_details.name}
                </p>
                <div className="text-xs text-slate-500 space-y-0.5 mt-1">
                  <p>
                    {contract.contractee_details.email || "No email provided"}
                  </p>
                  <p>{contract.contractee_details.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Payment Terms */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="flex items-center gap-2 text-slate-800 font-bold mb-4 border-b pb-3 text-lg">
              <FaMoneyBillWave className="text-green-500" /> Payment Conditions
            </h3>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400">
                Method: {contract.paymentMethod}
              </p>
              <p className="text-2xl font-black text-slate-900 mt-2">
                {contract.paymentMethod === "In-Kind"
                  ? `${contract.paymentDetails.quantity} ${contract.paymentDetails.unit} of ${contract.paymentDetails.commodity}`
                  : `${contract.paymentDetails.currency} ${contract.paymentDetails.amount?.toLocaleString()}`}
              </p>
              <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm italic font-medium">
                {contract.paymentDetails.frequency}
              </div>
            </div>
          </div>

          {/* Section 3: Technical & Agro Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="flex items-center gap-2 text-slate-800 font-bold mb-4 border-b pb-3 text-lg">
              <FaSeedling className="text-emerald-500" /> Technical Details
            </h3>
            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                  <FaMapMarkerAlt size={10} /> Location / Model
                </p>
                <p className="text-sm text-slate-800 font-semibold italic">
                  {contract.agroDetails.location ||
                    contract.agroDetails.equipmentModel ||
                    "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Area / Insurance
                </p>
                <p className="text-sm text-slate-800 font-semibold">
                  {contract.agroDetails.area ||
                    (contract.agroDetails.insuranceIncluded
                      ? "Included"
                      : "Not Included")}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Crop Type / Parcel ID
                </p>
                <p className="text-sm text-slate-800 font-semibold">
                  {contract.agroDetails.cropType || "N/A"}
                  {contract.agroDetails.parcelId
                    ? ` (${contract.agroDetails.parcelId})`
                    : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Timeline & Management */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="flex items-center gap-2 text-slate-800 font-bold mb-4 border-b pb-3 text-lg">
              <FaCalendarAlt className="text-orange-500" /> Timeline & Manager
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">
                    Effective Date
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {new Date(contract.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">
                    Expiration Date
                  </p>
                  <p className="text-sm font-bold text-red-600">
                    {new Date(contract.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <FaUserTie size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">
                    Assigned Manager
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {contract.assignedEmployee.name}{" "}
                    <span className="text-xs font-normal text-slate-500">
                      ({contract.assignedEmployee.role})
                    </span>
                  </p>
                  <p className="text-[10px] text-slate-400">
                    ID: {contract.assignedEmployee.employeeId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;
