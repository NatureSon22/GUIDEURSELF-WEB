import { MapContainer, ImageOverlay, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getUniversityData } from "@/api/component-info";
import { useQuery } from "@tanstack/react-query";
import L from "leaflet"; // Import Leaflet to use L.CRS.Simple

const MapViewer = ({ selectedFloor }) => {
  const { data: university } = useQuery({
    queryKey: ["universitysettings"],
    queryFn: getUniversityData,
  });

  if (!university) {
    // Handle the case when university data is not loaded yet.
    return <div>Loading...</div>;
  }

  return selectedFloor ? (
    <MapContainer
      bounds={[
        [110, 110],
        [1000, 1000],
      ]}
      maxZoom={4}
      style={{
        height: "100vh",
        width: "100%",
        backgroundColor: "white",
        zIndex: "1",
      }}
      crs={L.CRS.Simple}
    >
      <ImageOverlay
        url={selectedFloor.floor_photo_url}
        bounds={[
          [110, 110],
          [1000, 1000],
        ]}
      />
      {selectedFloor.markers?.map((marker, index) => (
        <Marker
          key={index}
          position={[parseFloat(marker.latitude), parseFloat(marker.longitude)]}
        >
          <Popup>
            <p>
              <strong>{marker.marker_name}</strong>
            </p>
            <p>{marker.marker_description}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  ) : (
    <div className="flex min-h-screen flex-col gap-6 justify-center items-center">
      <div className="w-[30%] flex items-center justify-center">
        <img
          className="h-[100%]"
          src={university.university_vector_url || "/default-vector.png"}
          alt="University vector"
        />
        <img
          className="h-[100%]"
          src={university.university_logo_url || "/default-logo.png"}
          alt="University logo"
        />
      </div>
      <div className="w-[70%] flex flex-col justify-center items-center justify-center">
        <h2 className="font-bold text-xl">UNIVERSITY OF RIZAL SYSTEM</h2>
        <h3 className="text-md">NURTURING TOMORROW'S NOBLEST</h3>
      </div>
    </div>
  );
};

export default MapViewer;
