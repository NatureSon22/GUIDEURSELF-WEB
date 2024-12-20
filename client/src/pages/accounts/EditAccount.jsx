import { useParams } from "react-router-dom";

const EditAccount = () => {
  const { accountId } = useParams();
  console.log(accountId);
  return <div>EditAccount</div>;
};

export default EditAccount;
