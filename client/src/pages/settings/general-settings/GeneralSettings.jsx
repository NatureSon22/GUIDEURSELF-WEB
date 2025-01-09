import Header from "@/components/Header";
import SystemLogoField from "./SystemLogoField";
import AboutField from "./AboutField";
import { useQuery } from "@tanstack/react-query";
import { loggedInUser } from "@/api/auth";
import { useState, useEffect } from "react";

const GeneralSettings = () => {
  const [general, setGeneral] = useState(null);

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/general/675cdd2056f690410f1473b7",
          {
            method: "get",
            credentials: "include",
          },
        );
        const data = await response.json();
        setGeneral(data);
      } catch (error) {
        console.error("Error fetching university data:", error);
      }
    };

    fetchGeneralData();
  }, []);

  const { data, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: loggedInUser,
  });

  if (!general) {
    return <div>Loading university data...</div>;
  }

  return (
    <div className="scroll flex h-[1000px] flex-col space-y-5 pr-4">
      <Header
        title="University Management"
        subtitle="Set up university details, branding, and administrative roles."
      />
      <SystemLogoField
        isLoading={userLoading}
        generallogo={general.general_logo_url}
        {...data}
      />
      <AboutField
        isLoading={userLoading}
        systemabout={general.general_about}
        {...data}
        onAboutUpdate={(newAbout) =>
          setGeneral((prev) => ({
            ...prev,
            general_about: newAbout,
          }))
        }
      />
    </div>
  );
};

export default GeneralSettings;
