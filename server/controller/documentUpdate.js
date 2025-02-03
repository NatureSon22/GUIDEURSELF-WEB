const updateUploadDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { visibility } = req.body;

    const updatedDocument = await DocumentModel.findByIdAndUpdate(
      documentId,
      { visibility },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({ message: "Document not found." });
    }

    return res.status(200).json({
      message: "Document updated successfully.",
      document: updatedDocument,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error occurred." });
  }
};

export { updateUploadDocument };
