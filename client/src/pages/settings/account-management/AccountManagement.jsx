import Header from "@/components/Header";
import InformationField from "./InformationField";
import ProfileField from "./ProfileField";
import SessionsField from "./SessionsField";
import { useQuery } from "@tanstack/react-query";
import { loggedInUser } from "@/api/auth";

const AccountManagement = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: loggedInUser,
  });

  return (
    <div className="space-y-5">
      <Header
        title="Account Management"
        subtitle="Control account settings, security, and login management"
      />

      <ProfileField isLoading={isLoading} {...data} />

      <InformationField />

      <SessionsField />
    </div>
  );
};

export default AccountManagement;
