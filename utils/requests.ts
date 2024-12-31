import { PropertyModelTypes, PropertyTotal } from "@/types/models-types";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";


const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

// Fetch all properties
async function fetchProperties({ showFeatured = false } : {showFeatured?: boolean} = {}): Promise<PropertyTotal | PropertyModelTypes[]> {
    try {
        // Handle the case where the domain is not available yet
        if (!apiDomain) {
            return [];
        }

        const res = await fetch(`${apiDomain}/properties${showFeatured ? "/featured" : ""}`, {cache: 'no-store'});

        if (!res.ok) {
          throw new Error('Failed to fetch properties data');
    }
        return res.json();
    } catch (error) {
        if (isDynamicServerError(error)) {
            throw error;
          }
        console.log(error);
        return [];
    }  
  }

  // Fetch single property
  async function fetchProperty(id: string): Promise<PropertyModelTypes | null> {
    try {
        // Handle the case where the domain is not available yet
        if (!apiDomain) {
            return null;
        }
        const res = await fetch(`${apiDomain}/properties/${id}`);
  
        if (!res.ok) {
          throw new Error('Failed to fetch property data');
    }
  
        return res.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

  export { fetchProperties, fetchProperty };