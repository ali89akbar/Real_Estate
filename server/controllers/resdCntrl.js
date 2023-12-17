// resdCntrl.js
import { ResidencyModel } from "../index.js"; // Import the ResidencyModel

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export { asyncHandler };



export const createResidency = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    address,
    country,
    city,
    facilities,
    image,
    userEmail,
  } = req.body.data;

  try {
    const residency = await ResidencyModel.create({
      title,
      description,
      price,
      address,
      country,
      city,
      facilities,
      image,
      userEmail,
    });

    res.send({ message: "Residency created successfully", residency });
  } catch (err) {
    if (err.code === "P2002") {
      throw new Error("A residency with address already exists");
    }
    throw new Error(err.message);
  }
});

export const getAllResidencies = asyncHandler(async (req, res) => {
  try {
    const residencies = await Residencymodel.find().sort({ createdAt: 'desc' });
    res.send(residencies);
  } catch (err) {
    throw new Error(err.message);
  }
});

export const getResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const residency = await ResidencyModel.findById(id);
    res.send(residency);
  } catch (err) {
    throw new Error(err.message);
  }
});
