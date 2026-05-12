const indiaPopulationData = require("../data/indiaPopulationData");

const getDataset = async (req, res) => {
  const states = [...new Set(indiaPopulationData.map((item) => item.state))].sort();
  return res.status(200).json({
    sourceLabel: "Census 2011 Base Data",
    records: indiaPopulationData,
    states
  });
};

const createPrediction = async (req, res) => {
  try {
    const {
      state,
      district,
      city,
      currentPopulation,
      growthRate,
      startYear,
      targetYear
    } = req.body;

    if (
      !state ||
      !district ||
      !city ||
      currentPopulation === undefined ||
      growthRate === undefined ||
      !startYear ||
      !targetYear
    ) {
      return res.status(400).json({ message: "All prediction inputs are required" });
    }

    const currentPopulationNumber = Number(currentPopulation);
    const growthRateNumber = Number(growthRate);
    const startYearNumber = Number(startYear);
    const targetYearNumber = Number(targetYear);

    if (
      Number.isNaN(currentPopulationNumber) ||
      Number.isNaN(growthRateNumber) ||
      Number.isNaN(startYearNumber) ||
      Number.isNaN(targetYearNumber)
    ) {
      return res.status(400).json({ message: "Prediction inputs must be valid numbers" });
    }

    if (currentPopulationNumber <= 0) {
      return res.status(400).json({ message: "Current population must be greater than 0" });
    }

    if (targetYearNumber <= startYearNumber) {
      return res
        .status(400)
        .json({ message: "Target year must be greater than start year" });
    }

    const yearsDifference = targetYearNumber - startYearNumber;
    const predictedPopulation =
      currentPopulationNumber *
      Math.pow(1 + growthRateNumber / 100, yearsDifference);
    const growthPercentage =
      ((predictedPopulation - currentPopulationNumber) / currentPopulationNumber) * 100;
    const growthAmount = predictedPopulation - currentPopulationNumber;

    return res.status(200).json({
      location: { state, district, city },
      sourceLabel: "Census 2011 Base Data",
      currentPopulation: currentPopulationNumber,
      predictedPopulation: Math.round(predictedPopulation),
      growthAmount: Math.round(growthAmount),
      growthPercentage: Number(growthPercentage.toFixed(2)),
      growthRate: growthRateNumber,
      startYear: startYearNumber,
      targetYear: targetYearNumber,
      yearsDifference
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during prediction" });
  }
};

module.exports = {
  getDataset,
  createPrediction
};
