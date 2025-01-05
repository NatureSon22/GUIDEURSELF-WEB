import PropTypes from "prop-types";
import XLS from "@/assets/XLS.png";
import PDF from "@/assets/PDF.png";
import DOCS from "@/assets/DOCS.png";

const fileIcons = {
  docs: DOCS,
  pdf: PDF,
  xlsx: XLS,
};

const TemplateIcon = ({ name }) => {
  const filename = name.split(".")[0].substring(0, 10).toLowerCase() + "...";
  const filetype = name.split(".").pop().toLowerCase();

  const getFileIcon = (fileName) => {
    const fileType = fileName.split(".").pop().toLowerCase();
    return fileIcons[fileType] || DOCS;
  };

  return (
    <div className="flex flex-col flex-wrap items-center gap-2">
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

TemplateIcon.propTypes = {
  name: PropTypes.string,
};

export default TemplateIcon;
