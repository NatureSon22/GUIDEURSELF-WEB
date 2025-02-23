import PropTypes from "prop-types";

const DeleteMarkerConfirmationDialog = ({ isOpen, onCancel, onProceed }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex w-[400px] flex-col gap-3 rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <h2 className="text-lg font-semibold">
            Do you want to remove this marker?
          </h2>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onProceed}
            className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteMarkerConfirmationDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onProceed: PropTypes.func.isRequired,
};

export default DeleteMarkerConfirmationDialog;
