import express from 'express';
import {
    getClassrooms,
     createClassroom, enroll, getClassroom, getEnrolledStudents, deleteClassroom, getAnnouncements, postAnnouncement   } from './classrooms.controller';
import { upload } from '../../middleware/upload.middleware';

const router = express.Router();

router.get('/getClassrooms', getClassrooms);
router.post('/create',  createClassroom);
router.post('/enroll', enroll);
router.get('/getEnrolledStudents', getEnrolledStudents);
router.delete('/delete/:id', deleteClassroom);

router.get('/getAnnouncements', getAnnouncements)
router.post('/postAnnouncement', upload.single('file'), postAnnouncement);

// Declared last so it does not shadow the literal GET routes above.
router.get('/:id', getClassroom);



export default router;
