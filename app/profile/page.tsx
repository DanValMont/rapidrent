"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Spinner from "@/components/Spinner";
import { PropertyModelTypes } from "@/types/models-types";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;
  const profileName = session?.user?.name;
  const profileEmail = session?.user?.email;

  const [properties, setProperties] = useState<PropertyModelTypes[] | []>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUserProperties = async (userId: string) => {
      if (!userId) return;
      try {
        const res = await fetch(`/api/properties/user/${userId}`);
        if (res.status === 200) {
          const properties = await res.json();
          setProperties(properties);
        }
      } catch (error) {
        console.error("Failed to fetch user properties:", error);
      } finally {
        setLoading(false);
      }
    };
    // fetch user properties when session is available
    if (session?.user?.id) {
      fetchUserProperties(session.user.id.toString());
    }
  }, [session]);

  const handleDeleteProperty = async ({ _id }: { _id: string }) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/properties/${_id}`, {
        method: "DELETE",
      });

      if (res.status === 200) {
        //Remove property from state
        const updatedProperties = properties.filter(
          (property) => property._id !== _id
        );
        setProperties(updatedProperties);
        toast.success("Property deleted successfully");
      } else {
        toast.error("Failed to delete property");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete property");
    }
  };


  return (
    <section className="bg-blue-50 dark:bg-[#161c20]">
      <div className="container m-auto py-24">
        <div className="bg-white dark:bg-[#161c20] px-6 py-8 mb-4 dark:shadow-[rgba(62,62,62,0.3)] shadow-md rounded-md border m-4 md:m-0">
          <h1 className="dark:text-zinc-400 text-3xl font-bold mb-4">
            Your Profile
          </h1>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mx-0 md:mx-20 mt-10">
              <div className="mb-4">
                {profileImage ? (<Image
                    className="h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto md:mx-0"
                    src={profileImage}
                    alt={profileName ? `Profile image of ${profileName}` : "User image"}
                    width={200}
                    height={200}
                  />                  ) : (
                    <div className="rounded-full bg-[#1da1f2] w-32 h-32 flex items-center justify-center">
            <h2 className="text-white text-5xl uppercase">
              {profileName?.charAt(0).toUpperCase()}
            </h2>
          </div>
                  )}   
              </div>
              <h2 className="dark:text-zinc-400 text-2xl mb-4">
                <span className="font-bold block">Name | Username: </span>{" "}
                {profileName}
              </h2>
              <h2 className="dark:text-zinc-400 text-2xl">
                <span className="font-bold block">Email: </span> {profileEmail}
              </h2>
            </div>

            <div className="md:w-3/4 md:pl-4">
              <h2 className="dark:text-zinc-400 text-xl font-semibold mb-4">
                Your Listings
              </h2>
              {!loading && properties.length === 0 && (
                <p className="dark:text-zinc-400">
                  You have no property listings
                </p>
              )}
              {loading ? (
                <Spinner loading={loading} />
              ) : (
                properties.map((property) => (
                  <div key={property._id.toString()} className="mb-10">
                    <Link href={`/properties/${property._id}`}>
                      <Image
                        className="h-32 w-full rounded-md object-cover"
                        src={property.images[0]}
                        alt={`Image of ${property.name}`}
                        width={500}
                        height={100}
                        priority={true}
                      />
                    </Link>
                    <div className="mt-2">
                      <p className="dark:text-zinc-400 text-lg font-semibold">
                        {property.name}
                      </p>
                      <p className="text-gray-600">
                        Address: {property.location.street}{" "}
                        {property.location.city} {property.location.state}{" "}
                        {property.location.zipcode}{" "}
                      </p>
                    </div>
                    <div className="mt-2">
                      <button className="bg-blue-500 text-white px-3 py-2 rounded-md mr-2 hover:bg-blue-600">
                      <Link
                        href={`/properties/${property._id}/edit`}
                      >
                        Edit
                      </Link>
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteProperty({
                            _id: property._id.toString(),
                          })
                        }
                        className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
