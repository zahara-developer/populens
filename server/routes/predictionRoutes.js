const express = require("express");
const {
  getDataset,
  createPrediction
} = require("../controllers/predictionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dataset", protect, getDataset);
router.post("/", protect, createPrediction);

module.exports = router;
