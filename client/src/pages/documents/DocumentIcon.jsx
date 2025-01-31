import PropTypes from "prop-types";
import XLS from "@/assets/XLS.png";
import PDF from "@/assets/PDF.png";
import DOCS from "@/assets/DOCS.png";

const fileIcons = {
  docs: DOCS,
  pdf: PDF,
  xlsx: XLS,
};

const DocumentIcon = ({ name, setOpen }) => {
  const filename = name.split(".")[0].substring(0, 20).toLowerCase() + "...";
  const filetype = name.split(".").pop().toLowerCase();

  const getFileIcon = (fileName) => {
    const fileType = fileName.split(".").pop().toLowerCase();
    return fileIcons[fileType] || DOCS;
  };

  return (
    <div
      className="flex w-fit cursor-pointer flex-col items-center gap-2 my-4"
      onClick={setOpen}
    >
      <div className="flex aspect-square h-24 w-20 overflow-hidden">
        <img
          src={getFileIcon(name)}
          alt={`${name} icon`}
          className="h-full w-full object-cover"
        />
      </div>

      <p className="text-[0.8rem]">{`${filename}.${filetype}`}</p>
    </div>
  );
};

DocumentIcon.propTypes = {
  name: PropTypes.string,
  setOpen: PropTypes.func,
};

export default DocumentIcon;
