"use client";
import { useState, useEffect } from "react";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";
import { PropertyModelTypes } from "@/types/models-types";

const SavedPropertiesPage = () => {
  const [properties, setProperties] = useState<PropertyModelTypes[] | []>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const res = await fetch("/api/bookmarks");

        if (res.status === 200) {
          const data = await res.json();
          setProperties(data);
        } else {
          toast.error("Failed to fetch saved properties");
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch saved properties");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, []);

  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        <h1 className="dark:text-zinc-400 text-2xl mb-4">Saved Properties</h1>
        {properties.length === 0 ? (
          <p className="dark:text-zinc-400">No saved properties</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id.toString()} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
export default SavedPropertiesPage;
