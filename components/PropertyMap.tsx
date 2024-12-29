"use client";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { PropertyModelTypes } from "@/types/models-types";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  LayersControl,
} from "react-leaflet";

const { BaseLayer } = LayersControl;

const PropertyMap = ({ property }: { property: PropertyModelTypes }) => {
  const [lat, setLat] = useState<null | number>(null);
  const [lng, setLng] = useState<null | number>(null);
  const [loading, setLoading] = useState(true);
  const [mapProviderError, setMapProviderError] = useState(false);

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const provider = new OpenStreetMapProvider();
      const results = await provider.search({
        query: `${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`,
      });
        //Check for results
        if(results.length === 0) {
          //No results found
          setMapProviderError(true);
          setLoading(false);
          return;
        }
      setLat( results[0].y ? results[0].y : results[1].y );
      setLng(results[0].x ? results[0].x : results[1].x);
      setLoading(false);
      } catch (error) {
        console.log(error);
        setMapProviderError(true);
        setLoading(false);
      }
    };
    fetchCoords();
  }, []);

  if (loading) return <Spinner loading={loading} />;
  //Handle case when provider (openStreetMapProvider) returns no results
  if (mapProviderError) {
    return <div className="text-xl">No location data found</div>;
  }
  return (
    !loading && (
      <MapContainer //@ts-ignore
        center={[lat, lng]}
        zoom={17}
        scrollWheelZoom={false}
        style={{ height: "500px", width: "100%" }}
      >
        <LayersControl position="topright">
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              // @ts-ignore
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <BaseLayer name="Esri World Imagery">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              // maxNativeZoom={19}
            />
          </BaseLayer>
          <BaseLayer name="Esri">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 201"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
              // maxNativeZoom={19}
            />
          </BaseLayer>
          <BaseLayer name="Stadia Maps">
            <TileLayer
              attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> contributors'
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
              maxNativeZoom={20}
            />
          </BaseLayer>
          <Marker position={[lat as number, lng as number]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </LayersControl>
      </MapContainer>
    )
  );
};

export default PropertyMap;
