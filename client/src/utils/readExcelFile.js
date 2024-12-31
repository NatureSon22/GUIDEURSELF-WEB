import readXlsxFile from "read-excel-file";

const readExcelFile = async (file) => {
  try {
    // Check file size (client-side)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(
        "File size is too large. Please upload a file less than 5MB.",
      );
    }

    const rows = await readXlsxFile(file);

    if (!rows || rows.length === 0) {
      throw new Error("The uploaded file is empty or not a valid Excel file.");
    }

    // Map the rows to your desired format (assuming the first row is a header)
    const formattedData = rows.slice(1).map((row) => ({
      user_number: row[0],
      email: row[1],
      firstname: row[2],
      middlename: row[3],
      lastname: row[4],
    }));

    return formattedData;
  } catch {
    throw new Error("Failed to process the uploaded file. Please try again.");
  }
};

export default readExcelFile;
