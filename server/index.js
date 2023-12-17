import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { userRoute } from './routes/userRoute.js';
import { residencyRoute } from './routes/residencyRoute.js';
dotenv.config()

const app = express();

import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
    _id: String,
    name: String,
    email: { type: String, unique: true },
    image: String,
    bookedVisits: [mongoose.Schema.Types.Mixed],
    favResidenciesID: [mongoose.Schema.Types.ObjectId],
    ownedResidencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Residency' }]
  });
  
  const ResidencySchema = new mongoose.Schema({
    _id: String,
    title: String,
    description: String,
    price: Number,
    address: String,
    city: String,
    country: String,
    image: String,
    facilities: mongoose.Schema.Types.Mixed,
    userEmail: String,
    owner: { type: String, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  // Define models based on the schemas
  const UserModel = mongoose.model('User', UserSchema);
  const ResidencyModel = mongoose.model('Residency', ResidencySchema);





// Establish connection to MongoDB
mongoose.connect("mongodb+srv://aligoodboy800:ali800@cluster0.fy4i1hl.mongodb.net/Residency?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});



const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});

app.use('/api/user', userRoute)
app.use("/api/residency", residencyRoute)

export default { UserModel };
export {ResidencyModel};
