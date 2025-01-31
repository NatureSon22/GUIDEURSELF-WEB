import Bin from "@/assets/bin.png"; // Your bin icon

const DeleteMarkerConfirmationDialog = ({ isOpen, onCancel, onProceed }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] flex flex-col gap-3">
        <div className="text-center">
          <h2 className="text-lg font-semibold">
            Do you want to remove this marker?
          </h2>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onProceed}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMarkerConfirmationDialog;
