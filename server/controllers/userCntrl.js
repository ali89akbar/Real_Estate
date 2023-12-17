import asyncHandler from "express-async-handler";

import UserModel from '../index.js';


// userCntrl.js
export const getAllBookings = async (req, res) => {
  try {
    // Your logic to retrieve all bookings

    const { email } = req.body;

    const user = await UserModel.findOne({ email }); // Assuming UserModel is imported properly

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const bookings = user.bookedVisits;

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error retrieving bookings:', error);
    res.status(500).json({ message: 'Failed to retrieve bookings', error: error.message });
  }
};
export const cancelBooking = async (req, res) => {
  try {
    // Your cancellation logic here
    // Example: retrieving data from request body and performing cancellation

    const { email } = req.body;
    const { id } = req.params;

    const user = await UserModel.findOne({ email }); // Assuming UserModel is imported properly

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = user.bookedVisits.findIndex((visit) => visit.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    user.bookedVisits.splice(index, 1);

    await user.save();

    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Failed to cancel booking', error: error.message });
  }
};


export const createUser = async (req, res) => {
  console.log('Creating a user');

  try {
    const { email } = req.body;
    const userExists = await UserModel.findOne({ email });

    if (!userExists) {
      const user = await UserModel.create(req.body);
      res.status(201).json({ message: 'User registered successfully', user });
    } else {
      res.status(201).json({ message: 'User already registered' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

export const bookVisit = async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;

  try {
    const user = await UserModel.findOne({ email });
    
    if (user.bookedVisits.some((visit) => visit.id === id)) {
      res.status(400).json({ message: 'This residency is already booked by you' });
    } else {
      user.bookedVisits.push({ id, date });
      await user.save();
      res.send('Your visit is booked successfully');
    }
  } catch (error) {
    res.status(500).json({ message: 'Error booking visit', error: error.message });
  }
};



export const toFav = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { rid } = req.params;

  try {
    const user = await UserModel.findUnique({
      where: { email },
    });

    if (user.favResidenciesID.includes(rid)) {
      const updateUser = await UserModel.update({
        where: { email },
        data: {
          favResidenciesID: {
            set: user.favResidenciesID.filter((id) => id !== rid),
          },
        },
      });

      res.send({ message: "Removed from favorites", user: updateUser });
    } else {
      const updateUser = await UserModel.update({
        where: { email },
        data: {
          favResidenciesID: {
            push: rid,
          },
        },
      });
      res.send({ message: "Updated favorites", user: updateUser });
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// function to get all favorites
export const getAllFavorites = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const favResd = await UserModel.findUnique({
      where: { email },
      select: { favResidenciesID: true },
    });
    res.status(200).send(favResd);
  } catch (err) {
    throw new Error(err.message);
  }
});
