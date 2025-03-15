import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import {connectDB} from './config/db.js';
import StData from './models/sData.model.js';

const app = express();
dotenv.config();
app.use(cors());

console.log(process.env.MONGO_URI);


app.listen(5000, () => {
    connectDB();
    console.log('Server is running on port 5000');
} );



app.use(express.json());

app.post('/api/student-data', async(req, res) => {
    const studentData = req.body;
    
    if(!studentData.Date || !studentData.StudentName || !studentData.Class || !studentData.sIndexNum || !studentData.Reason || !studentData.TeacherID || !studentData.Agreement || !studentData.AgreementEndDate || !studentData.ObserverTeacherID) {
        return res.status(400).json({success:false, message: 'All fields are required'});
    }
    const newStudentData = new StData(studentData);
    try {
        await newStudentData.save();
        res.status(201).json({success:true, data: newStudentData});
    } catch (error) {
        console.log(error, message);
        res.status(500).json({success:false, message: 'Internal server error'});
        
    }
} );


app.delete('/api/student-data/:id', async(req, res) => {
    const id = req.params.id;
   try {
    await StData.findByIdAndDelete(id);
    res.status(200).json({success:true, message: 'Data deleted successfully'});
   } catch (error) {
       console.log(error.message);
       res.status(500).json({success:false, message: 'Internal server error'});
    
   }
    
});


app.get('/api/student-data',async (req, res) => {
    try {
        const studentData = await StData.find();
        res.status(200).json({success:true, data: studentData});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false, message: 'Internal server error'});
        
    }
} );


app.delete('/api/student-data/delete/:sIndexNum',async (req, res) => {
    try {
        const studentData = await StData.find({sIndexNum: req.params.sIndexNum});
        res.status(200).json({success:true, data: studentData});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false, message: 'Internal server error'});
        
    }
} );


app.put('/api/student-data/:id', async(req, res) => {
    const id = req.params.id;
    const studentData = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({success:false, message: 'Invalid id'});
    }
    try {
        const updatedData = await StData.findByIdAndUpdate  (id, studentData, {new:true});
        res.status(200).json({success:true, data: updatedData});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false, message: 'Internal server error'});
        
    }
} );


