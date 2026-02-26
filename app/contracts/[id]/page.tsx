"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchContract } from "@/utils/request";
import { ContractType } from "@/models/Contract";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import Spinner from "@/components/Spinner";
import ContractDetails from "@/components/ContractDetails";
import contractsData from "@/contracts.json";

const ContractPage = () => {
  const { id } = useParams<{ id: string }>();

  const data = Array.isArray(contractsData)
    ? contractsData
    : (contractsData as any).default || [];

  const [contract, setContract] = useState<ContractType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContractData = async () => {
      if (!id) return;
      try {
        const contract = await fetchContract(id);
        setContract(contract);
      } catch (error) {
        console.error("Error fetching Contracts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (contract === null) {
      fetchContractData();
    }
  }, [id]);

  if (!contract && !loading) {
    return (
      <h1 className="p-8 text-center text-3xl font-bold text-red-500">
        Contract not found.
      </h1>
    );
  }

  return (
    <>
      {loading && <Spinner loading={loading} />}
      {!loading && (
        <>
          {/* {property.images && property.images.length > 0 && (
            <PropertyHeaderImage
              image={property.images[0]}
              name={property.name}
            />
          )} */}

          <section>
            <div className="container m-auto py-6 px-6">
              <Link
                href="/contracts"
                className="text-blue-500 hover:text-blue-600 flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Back to Contracts
              </Link>
            </div>
          </section>

          <section className="bg-blue-50">
            <div className="container m-auto py-10 px-6">
              <div className="grid grid-cols-1 md:grid-cols-[70%_28%] w-full gap-6">
                <ContractDetails contract={contract} />
              </div>
            </div>
          </section>
          {/* <PropertyImages images={property.images} /> */}
        </>
      )}
    </>
  );
};
export default ContractPage;
