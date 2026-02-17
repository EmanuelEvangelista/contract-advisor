"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchProperty } from "@/utils/request";
import { PropertyType } from "@/models/Property";
import PropertyHeaderImage from "@/components/PropertyHeaderImage";
import Link from "next/link";
import PropertyDetails from "@/components/PropertyDetails";
import PropertyImages from "@/components/PropertyImages";
import { FaArrowLeft } from "react-icons/fa";
import Spinner from "@/components/Spinner";
import BookMarkButton from "@/components/BookMarkButton";
import ShareButtons from "@/components/ShareButtons";
import PropertyConctactForm from "@/components/PropertyConctactForm";

const PropertyPage = () => {
  const { id } = useParams<{ id: string }>();

  const [property, setProperty] = useState<PropertyType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!id) return;
      try {
        const property = await fetchProperty(id);
        setProperty(property);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    if (property === null) {
      fetchPropertyData();
    }
  }, [id]);

  if (!property && !loading) {
    return (
      <h1 className="p-8 text-center text-3xl font-bold text-red-500">
        Property not found.
      </h1>
    );
  }

  return (
    <>
      {loading && <Spinner loading={loading} />}
      {!loading && property && (
        <>
          {property.images && property.images.length > 0 && (
            <PropertyHeaderImage
              image={property.images[0]}
              name={property.name}
            />
          )}

          <section>
            <div className="container m-auto py-6 px-6">
              <Link
                href="/properties"
                className="text-blue-500 hover:text-blue-600 flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Back to Properties
              </Link>
            </div>
          </section>

          <section className="bg-blue-50">
            <div className="container m-auto py-10 px-6">
              <div className="grid grid-cols-1 md:grid-cols-[70%_28%] w-full gap-6">
                <PropertyDetails property={property} />

                {/* Sidebar */}
                <aside className="space-y-4">
                  <BookMarkButton property={property} />
                  <ShareButtons property={property} />
                  <PropertyConctactForm property={property} />
                </aside>
              </div>
            </div>
          </section>
          <PropertyImages images={property.images} />
        </>
      )}
    </>
  );
};
export default PropertyPage;
