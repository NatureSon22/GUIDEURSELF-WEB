import Header from "@/components/Header";
import InformationField from "./InformationField";
import ProfileField from "./ProfileField";
import SessionsField from "./SessionsField";
import { useQuery } from "@tanstack/react-query";
import { loggedInUser } from "@/api/auth";
import PasswordField from "./PasswordField";

const AccountManagement = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: loggedInUser,
  });

  if (isError) {
    return <p>An error has been found</p>;
  }

  return (
    <div className="space-y-5">
      <Header
        title="Account Management"
        subtitle="Control account settings, security, and login management"
      />

      <ProfileField isLoading={isLoading} {...data} />

      <InformationField isLoading={isLoading} {...data} />

      <PasswordField isLoading={isLoading} {...data} />

      <SessionsField isLoading={isLoading} {...data} />
    </div>
  );
};

export default AccountManagement;
