const express = require("express");
const {
  extractTextFromDocument,
  verifyDocument,
  getDocuments,
  getDocument,
  deleteUserDocument,
} = require("../controllers/documentationController");
const { isAuth } = require("../middleware/is-Auth");
const router = express.Router();

// POST request to extract text from a document
router.post("/extract-text", isAuth, extractTextFromDocument);
// POST request to verify a document
router.put("/documents/:id/verify", isAuth, verifyDocument);

// GET request to get all documents (optional, for admin view)
router.get("/documents", isAuth, getDocuments);

router.get("/user-document", isAuth, getDocument);

router.delete("/user-document", isAuth, deleteUserDocument);
module.exports = router;
