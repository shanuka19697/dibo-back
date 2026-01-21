import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import StData from './models/sData.model.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let isConnected = false;

async function dbConnectOnce() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
}

/* GET */
app.get('/api/student-data', async (req, res) => {
  await dbConnectOnce();
  try {
    const studentData = await StData.find();
    res.status(200).json({ success: true, data: studentData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* POST */
app.post('/api/student-data', async (req, res) => {
  await dbConnectOnce();
  try {
    const newStudentData = new StData(req.body);
    await newStudentData.save();
    res.status(201).json({ success: true, data: newStudentData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* DELETE */
app.delete('/api/student-data/:id', async (req, res) => {
  await dbConnectOnce();
  try {
    await StData.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

/* PUT */
app.put('/api/student-data/:id', async (req, res) => {
  await dbConnectOnce();
  try {
    const updated = await StData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

/* EXPORT FOR VERCEL */
export default app;
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
