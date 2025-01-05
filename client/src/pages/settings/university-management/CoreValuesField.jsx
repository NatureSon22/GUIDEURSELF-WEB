import { useState } from "react";
import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { IoMdAdd } from "react-icons/io";


const CoreValuesField = ({ isLoading, universityCoreValues }) => {
  const [edit, setEdit] = useState(false);
  const [coreValues, setCoreValues] = useState([...universityCoreValues]); // Initialize with core values

  // Handle change for individual core value
  const handleValueChange = (index, newValue) => {
    const updatedValues = [...coreValues];
    updatedValues[index] = newValue;
    setCoreValues(updatedValues);
  };

  // Add new value
  const handleAddValue = () => {
    setCoreValues([...coreValues, ""]); // Add empty value for new input
  };

  // Remove value
  const handleRemoveValue = (index) => {
    const updatedValues = coreValues.filter((_, i) => i !== index);
    setCoreValues(updatedValues);
  };

  // Send update request to backend
  const handleUpdate = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/university/675cdd9756f690410f1473b8",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            university_core_values: coreValues,
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        setEdit(false); 
      } else {
        alert("Failed to update core values");
      }
    } catch (error) {
      console.error("Error updating core values:", error);
      alert("Error updating core values");
    }
  };

  return (
    <Layout
      title={"University Core Values"}
      subtitle={"The core values of the university"}
      setEdit={setEdit}
    >
      {isLoading ? (
        <div>Loading...</div> // Replace with actual Skeleton component
      ) : (
        <div className="space-y-4">
          {edit ? (
            <div className="flex flex-col space-y-2">
              {coreValues.map((value, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleValueChange(index, e.target.value)}
                    className="p-2 border rounded-md w-full"
                    placeholder="Enter core value"
                  />
                  <Button onClick={() => handleRemoveValue(index)} variant="destructive">
                    Remove
                  </Button>
                </div>
              ))}
              <Button onClick={handleAddValue} className="mt-2">
                Add Value
              </Button>
            </div>
          ) : (
            <ul className="list-disc list-inside">
              {coreValues.map((value, index) => (
                <li className="list-none" key={index}>{value}</li>
              ))}
            </ul>
          )}

          {edit && (
            <Button onClick={handleUpdate} className="mt-4">
              Update
            </Button>
          )}
        </div>
      )}
    </Layout>
  );
};


CoreValuesField.propTypes = {
  isLoading: PropTypes.bool,
  universityCoreValues: PropTypes.arrayOf(PropTypes.string)
};

export default CoreValuesField;
