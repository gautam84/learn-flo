import express from 'express';
import { 
    getClassrooms,
     createClassroom, enroll, getEnrolledStudents, deleteClassroom, getAnnouncements, postAnnouncement   } from './classrooms.controller';
import { upload } from '../../middleware/upload.middleware';

const router = express.Router();

router.get('/getClassrooms', getClassrooms);
router.post('/create',  createClassroom);
router.post('/enroll', enroll);
router.get('/getEnrolledStudents', getEnrolledStudents);
router.delete('/delete/:id', deleteClassroom);

router.get('/getAnnouncements', getAnnouncements)
router.post('/postAnnouncement', upload.single('file'), postAnnouncement);



export default router;
