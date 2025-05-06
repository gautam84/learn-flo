import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { z } from 'zod';

export const getClassrooms = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userId = parseInt(req.user.id, 10);

    // Find the user and check role
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let classrooms;

    if (user.role === 'TEACHER') {
      // Teacher: get classrooms they created
      classrooms = await prisma.classroom.findMany({
        where: { creatorId: userId },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      });
    } else if (user.role === 'STUDENT') {
      // Student: get classrooms they're enrolled in
      const student = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          enrolledClassrooms: {
            select: {
              id: true,
              name: true,
              createdAt: true,
            },
          },
        },
      });

      classrooms = student?.enrolledClassrooms ?? [];
    } else {
      return res.status(403).json({ success: false, message: 'Invalid user role.' });
    }

    return res.status(200).json({
      success: true,
      data: classrooms,
    });

  } catch (error) {
    console.error('Get Classrooms error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const createClassroomSchema = z.object({
    name: z.string({ required_error: "name is required." }).min(2),
  });
  
  export const createClassroom = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
      const result = createClassroomSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error.errors[0].message });
      }
  
      const { name } = result.data;
  
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
  
      const userId = parseInt(req.user.id, 10);
  
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.role !== 'TEACHER') {
        return res.status(403).json({ success: false, message: 'Only teachers can create classrooms.' });
      }
  
      const classroom = await prisma.classroom.create({
        data: {
          name,
          creatorId: userId,
        },
      });
  
      return res.status(201).json({ success: true, message: 'Classroom created', data: classroom });
    } catch (error) {
      console.error('Create classroom error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  const enrollSchema = z.object({
    classroomId: z.number({ required_error: 'Classroom ID is required' }),
  });
  
  export const enroll = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
      const result = enrollSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error.errors[0].message });
      }
  
      const { classroomId } = result.data;
  
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
  
      const userId = parseInt(req.user.id, 10);
  
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.role !== 'STUDENT') {
        return res.status(403).json({ success: false, message: 'Only students can enroll in classrooms.' });
      }
  
      // Check if classroom exists
      const classroom = await prisma.classroom.findUnique({ where: { id: classroomId } });
      if (!classroom) {
        return res.status(404).json({ success: false, message: 'Classroom not found.' });
      }
  
      // Check if already enrolled
      const isEnrolled = await prisma.classroom.findFirst({
        where: {
          id: classroomId,
          enrolledStudents: {
            some: { id: userId },
          },
        },
      });
  
      if (isEnrolled) {
        return res.status(400).json({ success: false, message: 'Already enrolled in this classroom.' });
      }
  
      // Enroll student
      await prisma.classroom.update({
        where: { id: classroomId },
        data: {
          enrolledStudents: {
            connect: { id: userId },
          },
        },
      });
  
      return res.status(200).json({ success: true, message: 'Successfully enrolled in classroom.' });
  
    } catch (error) {
      console.error('Enroll error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  

  const getStudentsSchema = z.object({
    classroomId: z.number({ required_error: 'Classroom ID is required' }),
  });
  
  export const getEnrolledStudents = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
      const result = getStudentsSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error.errors[0].message });
      }
  
      const { classroomId } = result.data;
  
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
  
      const userId = parseInt(req.user.id, 10);
  
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.role !== 'TEACHER') {
        return res.status(403).json({ success: false, message: 'Only teachers can access student lists.' });
      }
  
      // Verify teacher is the creator of the classroom
      const classroom = await prisma.classroom.findUnique({
        where: { id: classroomId },
        select: {
          id: true,
          creatorId: true,
        },
      });
  
      if (!classroom) {
        return res.status(404).json({ success: false, message: 'Classroom not found.' });
      }
  
      if (classroom.creatorId !== userId) {
        return res.status(403).json({ success: false, message: 'You are not authorized to view this classroom.' });
      }
  
      // Fetch enrolled students
      const students = await prisma.classroom.findUnique({
        where: { id: classroomId },
        select: {
          enrolledStudents: {
            where: { role: 'STUDENT' },
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
  
      return res.status(200).json({
        success: true,
        students: students?.enrolledStudents || [],
      });
  
    } catch (error) {
      console.error('Get students error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  const deleteClassroomSchema = z.object({
    classroomId: z.number({ required_error: 'Classroom ID is required' }),
  });
  
  export const deleteClassroom = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const classroomId = parseInt(req.params.id, 10);


  
  
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
  
      const userId = parseInt(req.user.id, 10);
  
      const user = await prisma.user.findUnique({ where: { id: userId } });
  
      if (!user || user.role !== 'TEACHER') {
        return res.status(403).json({ success: false, message: 'Only teachers can delete classrooms.' });
      }
  
      const classroom = await prisma.classroom.findUnique({
        where: { id: classroomId },
      });
  
      if (!classroom) {
        return res.status(404).json({ success: false, message: 'Classroom not found.' });
      }
  
      if (classroom.creatorId !== userId) {
        return res.status(403).json({ success: false, message: 'You are not authorized to delete this classroom.' });
      }
  
      // Perform deletion
      await prisma.classroom.delete({
        where: { id: classroomId },
      });
  
      return res.status(200).json({ success: true, message: 'Classroom deleted successfully.' });
    } catch (error) {
      console.error('Delete classroom error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };