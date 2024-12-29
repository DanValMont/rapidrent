"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchProperty } from "@/utils/requests";
import { PropertyModelTypes } from "@/types/models-types";
import Image from "next/image";

const PropertyEditForm = () => {
  const { id } = useParams();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [fields, setFields] = useState<PropertyModelTypes>({
    _id: id,
    owner: "",
    type: "",
    name: "",
    description: "",
    location: {
      street: "",
      city: "",
      state: "",
      zipcode: "",
    },
    beds: 0,
    baths: 0,
    square_feet: 0,
    amenities: [""],
    rates: {
      weekly: 0,
      monthly: 0,
      nightly: 0,
    },
    seller_info: {
      name: "",
      email: "",
      phone: "",
    },
    images: [],
    is_featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [imageFields, setImageFields] = useState<string[]>(['']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Fetch property data for form
    const fetchPropertyData = async () => {
      try {
        if (Array.isArray(id)) {
          throw new Error("ID must be a single string");
        }

        const propertyData = await fetchProperty(id.toString());

        // Check rates for null, if so then make empty string
        if (propertyData && propertyData.rates) {
          const defaultRates = { ...propertyData.rates } as {
            weekly: number;
            monthly?: number | undefined;
            nightly?: number | undefined;
          };
          for (const rate in defaultRates) {
            if ((defaultRates as any)[rate] === null) {
              (defaultRates as any)[rate] = "";
            }
          }
          propertyData.rates = {
            ...defaultRates,
            monthly: defaultRates.monthly || 0,
            nightly: defaultRates.nightly || 0,
          };
        }

        setFields(propertyData);

        if (propertyData.images && propertyData.images.length > 0) {
          setImageFields(propertyData.images);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Check if nested property
    if (name.includes(".")) {
      const [outerKey, innerKey] = name.split(".");

      setFields((prevFields) => ({
        ...prevFields,
        [outerKey]: {
          ...(prevFields as any)[outerKey],
          [innerKey]: value,
        },
      }));
    } else {
      // Not nested
      setFields((prevFields) => ({
        ...prevFields,
        [name]: value,
      }));
    }
  };
  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    // Clone the current array
    const updatedAmenites = [...fields.amenities];

    if (checked) {
      // Add value to array
      updatedAmenites.push(value);
    } else {
      // Remove value from array
      const index = updatedAmenites.indexOf(value);

      if (index !== -1) {
        updatedAmenites.splice(index, 1);
      }
    }

    // Update state with updated array
    setFields((prevFields) => ({
      ...prevFields,
      amenities: updatedAmenites,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    const existingUrl = imageFields[index];

    try {
      const formData = new FormData();
      if (existingUrl) {
        formData.append('existingUrl', existingUrl);
      }
    
      if (file) {
        formData.append('image', file);
      }

      // If neither existingUrl nor file exists, skip the upload
      if (!existingUrl && !file) {
        return;
      }
      const res = await fetch(`/api/upload/${id}`, {
        method: 'POST',
        body: formData,
      });
  
      if (!res.ok) throw new Error('Failed to upload image');
  
      const data = await res.json();
      const newImageFields = [...imageFields];
      
      if (data.secure_url) {
        newImageFields[index] = data.secure_url; // Use the URL (existing or new)
      } else {
        newImageFields.splice(index, 1); // Remove the image if deleted
      }
      
      setImageFields(newImageFields);
      setFields(prev => ({
        ...prev,
        images: newImageFields.filter(url => url),
      }));
    } catch (error) {
      console.error('Error handling image:', error);
      toast.error('Error handling image');
    }
  };
  
  const addImageField = () => {
    if (imageFields.length < 4) {
      setImageFields([...imageFields, '']);
    }
  };
  
  const removeImageField = async (index: number) => {
    if (imageFields.length > 1) {

      const existingUrl = imageFields[index];
      if (existingUrl) {
        const res = await fetch(`/api/upload/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'},
          body: JSON.stringify(existingUrl),
        });
      }

      const newImageFields = imageFields.filter((_, i) => i !== index);
      setImageFields(newImageFields);
      
      // Update the main form fields
      setFields(prev => ({
        ...prev,
        images: newImageFields.filter(url => url),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      
      // Add the images array to formData
      fields.images.forEach((url) => {
        if (url) formData.append('images', url);
      });
  
      const res = await fetch(`/api/properties/${id}`, {
        method: "PUT",
        body: formData,
      });
  
      if (res.status === 200) {
        router.push(`/properties/${id}`);
      } else if (res.status === 401 || res.status === 403) {
        toast.error("Permission denied");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    mounted &&
    !loading && (
      <form onSubmit={handleSubmit}>
        <h2 className="dark:text-zinc-400 text-3xl text-center font-semibold mb-6">
          Edit Property
        </h2>

        <div className="mb-4">
          <label htmlFor="type" className="block text-gray-700 font-bold mb-2">
            Property Type
          </label>
          <select
            id="type"
            name="type"
            className="border rounded w-full py-2 px-3"
            required
            value={fields.type}
            onChange={handleChange}
          >
            <option value="Apartment">Apartment</option>
            <option value="Condo">Condo</option>
            <option value="House">House</option>
            <option value="Cabin Or Cottage">Cabin or Cottage</option>
            <option value="Room">Room</option>
            <option value="Studio">Studio</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Listing Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="eg. Beautiful Apartment In Miami"
            required
            value={fields.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-bold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="border rounded w-full py-2 px-3"
            rows={4}
            placeholder="Add an optional description of your property"
            value={fields.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-4 bg-blue-50 dark:bg-[#161c20] dark:shadow-[rgba(62,62,62,0.3)] ">
          <label className="block text-gray-700 font-bold mb-2">Location</label>
          <input
            type="text"
            id="street"
            name="location.street"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="Street"
            value={fields.location.street}
            onChange={handleChange}
          />
          <input
            type="text"
            id="city"
            name="location.city"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="City"
            required
            value={fields.location.city}
            onChange={handleChange}
          />
          <input
            type="text"
            id="state"
            name="location.state"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="State"
            required
            value={fields.location.state}
            onChange={handleChange}
          />
          <input
            type="text"
            id="zipcode"
            name="location.zipcode"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="Zipcode"
            value={fields.location.zipcode}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-5">
          <div className="w-full sm:w-[31%]">
            <label
              htmlFor="beds"
              className="block text-gray-700 font-bold mb-2"
            >
              Beds
            </label>
            <input
              type="number"
              id="beds"
              name="beds"
              className="border rounded w-full py-2 px-3"
              required
              value={fields.beds}
              onChange={handleChange}
            />
          </div>
          <div className="w-full sm:w-[31%]">
            <label
              htmlFor="baths"
              className="block text-gray-700 font-bold mb-2"
            >
              Baths
            </label>
            <input
              type="number"
              id="baths"
              name="baths"
              className="border rounded w-full py-2 px-3"
              required
              value={fields.baths}
              onChange={handleChange}
            />
          </div>
          <div className="w-full sm:w-[31%]">
            <label
              htmlFor="square_feet"
              className="block text-gray-700 font-bold mb-2"
            >
              Square Feet
            </label>
            <input
              type="number"
              id="square_feet"
              name="square_feet"
              className="border rounded w-full py-2 px-3"
              required
              value={fields.square_feet}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div>
              <input
                type="checkbox"
                id="amenity_wifi"
                name="amenities"
                value="Wifi"
                className="mr-2"
                checked={fields.amenities.includes("Wifi")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_wifi">Wifi</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_kitchen"
                name="amenities"
                value="Full Kitchen"
                className="mr-2"
                checked={fields.amenities.includes("Full Kitchen")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_kitchen">Full kitchen</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_washer_dryer"
                name="amenities"
                value="Washer & Dryer"
                className="mr-2"
                checked={fields.amenities.includes("Washer & Dryer")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_washer_dryer">Washer & Dryer</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_free_parking"
                name="amenities"
                value="Free Parking"
                className="mr-2"
                checked={fields.amenities.includes("Free Parking")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_free_parking">Free Parking</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_pool"
                name="amenities"
                value="Swimming Pool"
                className="mr-2"
                checked={fields.amenities.includes("Swimming Pool")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_pool">Swimming Pool</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_hot_tub"
                name="amenities"
                value="Hot Tub"
                className="mr-2"
                checked={fields.amenities.includes("Hot Tub")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_hot_tub">Hot Tub</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_24_7_security"
                name="amenities"
                value="24/7 Security"
                className="mr-2"
                checked={fields.amenities.includes("24/7 Security")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_24_7_security">24/7 Security</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_wheelchair_accessible"
                name="amenities"
                value="Wheelchair Accessible"
                className="mr-2"
                checked={fields.amenities.includes("Wheelchair Accessible")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_wheelchair_accessible">
                Wheelchair Accessible
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_elevator_access"
                name="amenities"
                value="Elevator Access"
                className="mr-2"
                checked={fields.amenities.includes("Elevator Access")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_elevator_access">Elevator Access</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_dishwasher"
                name="amenities"
                value="Dishwasher"
                className="mr-2"
                checked={fields.amenities.includes("Dishwasher")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_dishwasher">Dishwasher</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_gym_fitness_center"
                name="amenities"
                value="Gym/Fitness Center"
                className="mr-2"
                checked={fields.amenities.includes("Gym/Fitness Center")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_gym_fitness_center">
                Gym/Fitness Center
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_air_conditioning"
                name="amenities"
                value="Air Conditioning"
                className="mr-2"
                checked={fields.amenities.includes("Air Conditioning")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_air_conditioning">Air Conditioning</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_balcony_patio"
                name="amenities"
                value="Balcony/Patio"
                className="mr-2"
                checked={fields.amenities.includes("Balcony/Patio")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_balcony_patio">Balcony/Patio</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_smart_tv"
                name="amenities"
                value="Smart TV"
                className="mr-2"
                checked={fields.amenities.includes("Smart TV")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_smart_tv">Smart TV</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_coffee_maker"
                name="amenities"
                value="Coffee Maker"
                className="mr-2"
                checked={fields.amenities.includes("Coffee Maker")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_coffee_maker">Coffee Maker</label>
            </div>
          </div>
        </div>

        <div className="mb-4 bg-blue-50 dark:bg-[#161c20] dark:shadow-[rgba(62,62,62,0.3)] ">
          <label className="block text-gray-700 font-bold mb-2">
            Rates (Leave blank if not applicable)
          </label>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex items-center">
              <label htmlFor="weekly_rate" className="mr-2">
                Weekly
              </label>
              <input
                type="number"
                id="weekly_rate"
                name="rates.weekly"
                className="border rounded w-full py-2 px-3"
                value={fields.rates.weekly}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="monthly_rate" className="mr-2">
                Monthly
              </label>
              <input
                type="number"
                id="monthly_rate"
                name="rates.monthly"
                className="border rounded w-full py-2 px-3"
                value={fields.rates.monthly}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="nightly_rate" className="mr-2">
                Nightly
              </label>
              <input
                type="number"
                id="nightly_rate"
                name="rates.nightly"
                className="border rounded w-full py-2 px-3"
                value={fields.rates.nightly}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="seller_name"
            className="block text-gray-700 font-bold mb-2"
          >
            Seller Name
          </label>
          <input
            type="text"
            id="seller_name"
            name="seller_info.name"
            className="border rounded w-full py-2 px-3"
            placeholder="Name"
            value={fields.seller_info.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="seller_email"
            className="block text-gray-700 font-bold mb-2"
          >
            Seller Email
          </label>
          <input
            type="email"
            id="seller_email"
            name="seller_info.email"
            className="border rounded w-full py-2 px-3"
            placeholder="Email address"
            required
            value={fields.seller_info.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="seller_phone"
            className="block text-gray-700 font-bold mb-2"
          >
            Seller Phone
          </label>
          <input
            type="tel"
            id="seller_phone"
            name="seller_info.phone"
            className="border rounded w-full py-2 px-3"
            placeholder="Phone"
            value={fields.seller_info.phone}
            onChange={handleChange}
          />
        </div>

        {/* Image Upload Section */}
<div className="mb-4">
  <label className="block text-gray-700 font-bold mb-2">
    Property Images
  </label>
  <div className="space-y-4">
    {imageFields.map((imageUrl, index) => (
      <div key={index} className="flex items-center space-x-4">
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => handleImageChange(e, index)}
          className="w-full border rounded py-2 px-3 min-w-0"
        />
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={`Property ${index + 1}`}
            className="h-20 w-20 object-cover rounded"
            width={0}
            height={0}
            sizes="100vw"
            priority
          />
        )}
        <button
          type="button"
          onClick={() => removeImageField(index)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          disabled={imageFields.length <= 1}
        >
          Remove
        </button>
      </div>
    ))}
  </div>
  {imageFields.length < 4 && (
    <button
      type="button"
      onClick={addImageField}
      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Add Image
    </button>
  )}
</div>

        <div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Update Property
          </button>
        </div>
      </form>
    )
  );
};
export default PropertyEditForm;
