import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import StData from './models/sData.model.js';

dotenv.config();

const app = express();

// Only allow requests from your Cloudflare Pages frontend
app.use(cors({
  origin: 'https://dibo-front.pages.dev', // replace with your actual Pages URL
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

app.use(express.json());

// Connect to Database
connectDB();

// Routes (GET, POST, PUT, DELETE remain the same)
app.get('/api/student-data', async (req, res) => {
  try {
    const studentData = await StData.find();
    res.status(200).json({ success: true, data: studentData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/student-data', async (req, res) => {
  try {
    const newStudentData = new StData(req.body);
    await newStudentData.save();
    res.status(201).json({ success: true, data: newStudentData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/student-data/:id', async (req, res) => {
  try {
    await StData.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.put('/api/student-data/:id', async (req, res) => {
  try {
    const updated = await StData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

export default app;
