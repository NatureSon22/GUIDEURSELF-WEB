import  { useState } from "react";

const DocView = () => {
  const [file, setFile] = useState([
    {
      uri: "https://ucarecdn.com/91498344-d781-4441-bb1c-72af7edb231b/",
    },
  ]);

  return (
    <embed
      src={file[0].uri}
      type="application/pdf"
      width="100%"
      height="600px"
    />
  );
};

export default DocView;
