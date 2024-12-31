import { memo } from "react";
import columns from "@/components/columns/FileData";
import DataTable from "@/components/DataTable";
import PropTypes from "prop-types";

const TableImport = ({ fileData }) => {
  return <DataTable data={fileData} columns={columns} pageSize={20} />;
};

TableImport.propTypes = {
  fileData: PropTypes.array,
};

export default memo(TableImport);
