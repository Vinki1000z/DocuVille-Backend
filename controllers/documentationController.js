const fetch = require("node-fetch");
const Document = require("../models/Documentation");

const extractTextFromDocument = async (req, res) => {
  try {
    const { documentType, extractedInfo } = req.body; // Expecting extracted info from the frontend
    const userId = req.user.id; // Changed to req.userId to match your middleware

    if (!extractedInfo || !documentType) {
      return res
        .status(400)
        .json({ error: "No extracted information or document type provided." });
    }

    // Convert the date string to a Date object
    const dob = new Date(extractedInfo.dob.split("/").reverse().join("-")); // Converts "31/07/2002" to "2002-07-31"

    // Save the extracted text and document info to the database
    const documentData = new Document({
      userId,
      documentType,
      documentNumber: extractedInfo.documentNumber,
      name: extractedInfo.name,
      fatherName: extractedInfo.fatherName,
      dob, // Use the parsed Date object here
      status: "Pending",
    });

    await documentData.save();

    res.json({
      message: "Document info saved successfully",
      extractedInfo,
    });
  } catch (error) {
    console.error("Error processing document:", error);
    return res
      .status(500)
      .json({ error: "Error processing document: " + error.message });
  }
};

const verifyDocument = async (req, res) => {
  const documentId = req.params.id;
  const { status, comments, verificationErrors } = req.body;
  // console.log("here"+status,comments,verificationErrors);
  try {
    // Check if the requesting user is an admin
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ error: "Access denied. Only admins can verify documents." });
    }

    // Find the document by ID
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ error: "Document not found." });
    }

    // Update the document's status, comments, verification errors, and verifiedBy fields
    document.status = status; // "Verified" or "Rejected"
    document.comments = comments;
    document.verificationErrors = verificationErrors;
    document.verifiedBy = req.user.id; // Set the admin's ID

    // Save the updated document
    await document.save();
    // console.log(document);
    // Respond with the updated document
    res.json({ message: "Document verified successfully.", document });
  } catch (error) {
    console.error("Error verifying document:", error);
    res.status(500).json({ error: "Error verifying document." });
  }
};

// Optional function to get all documents (for admin view)
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find().populate("userId", "name email");
    res.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Error fetching documents." });
  }
};
const getDocument = async (req, res) => {
  try {
    const userId = req.user.id; // Assumes user ID is stored in the request by middleware (like after auth verification)

    // Find document associated with the user
    const document = await Document.findOne({ userId });

    if (document) {
      // Document found, send it back
      return res.status(200).json({ success: true, document });
    } else {
      // No document found for this user
      return res
        .status(200)
        .json({ success: false, message: "No document found." });
    }
  } catch (error) {
    console.error("Error fetching user document:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
const deleteUserDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await Document.findOneAndDelete({ userId });

    if (!result) {
      return res.status(404).json({ message: "No document found to delete." });
    }

    return res.status(200).json({ message: "Document deleted successfully." });
  } catch (error) {
    console.error("Error deleting user document:", error);
    res.status(500).json({ message: "Server error during deletion." });
  }
};
module.exports = {
  extractTextFromDocument,
  verifyDocument,
  getDocuments,
  getDocument,
  deleteUserDocument,
};
