import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { z } from 'zod';
import path from 'path';




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

    const page = parseInt(req.query.page as string, 10) || 1; // Default page 1
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10; // Default page size 10

    let classrooms;

    if (user.role === 'TEACHER') {
      // Teacher: get classrooms they created
      const [classroomsData, totalCount] = await prisma.$transaction([
        prisma.classroom.findMany({
          where: { creatorId: userId },
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.classroom.count({
          where: { creatorId: userId },
        }),
      ]);
      classrooms = classroomsData;

      return res.status(200).json({
        success: true,
        data:  {
            classrooms,
            totalCount,
            page,
            pageSize,
            totalPages: Math.ceil(totalCount / pageSize),
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
            skip: (page - 1) * pageSize,
            take: pageSize,
          },
        },
      });

      const totalCount = student?.enrolledClassrooms?.length ?? 0;
      classrooms = student?.enrolledClassrooms ?? [];

      return res.status(200).json({
        success: true,
        data:  {
            classrooms,
            totalCount,
            page,
            pageSize,
            totalPages: Math.ceil(totalCount / pageSize),
        },
      });
    } else {
      return res.status(403).json({ success: false, message: 'Invalid user role.' });
    }
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
      // Validate the classroomId from the URL parameter
      const result = getStudentsSchema.safeParse(req.params);  // Use `req.params` for route parameters
      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error.errors[0].message });
      }
  
      const { classroomId } = result.data;  // Get classroomId from params
  
      // Ensure user is authenticated
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
  
      const userId = parseInt(req.user.id, 10);
  
      // Check if the user exists and is a teacher
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
  
      // Get pagination parameters (default to page 1 and page size 10)
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const skip = (page - 1) * pageSize;
  
      // Fetch the enrolled students with pagination
      const classroomWithStudents = await prisma.classroom.findUnique({
        where: { id: classroomId },
        include: {
          enrolledStudents: {
            select: {
              id: true,
              username: true,
              email: true,
            },
            skip,  // Skip students based on pagination
            take: pageSize,  // Limit the number of students per page
          },
        },
      });
  
  

     
  
      // Count the total number of enrolled students (without pagination)
      const totalStudents = classroomWithStudents?.enrolledStudents.length || 0;
  
      // Pagination response
      const totalPages = Math.ceil(totalStudents / pageSize);
  
      return res.status(200).json({
        success: true,
        students: classroomWithStudents?.enrolledStudents || [],
        pagination: {
          currentPage: page,
          totalPages,
          totalStudents,
          pageSize,
        },
      });
    } catch (error) {
      console.error('Get students error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };


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

  const postAnnouncementSchema = z.object({
  classroomId: z.preprocess(
    (val) => (val !== '' && val !== undefined ? Number(val) : undefined),
    z.number({ required_error: 'Classroom ID is required' })
      .int('Classroom ID must be an integer')
      .positive('Classroom ID must be a positive number')
  ),  title: z.string().min(1),
  body: z.string().optional(),
  fileUrl: z.string().optional(),
  fileType: z.string().optional(),
});


export const postAnnouncement = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { classroomId, title, body } = req.body;
    const file = req.file;

    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const parsedClassroomId = parseInt(classroomId, 10);
    
    if (isNaN(parsedClassroomId)) {
      return res.status(400).json({ success: false, message: 'Invalid classroomId' });
    }

    const userId = parseInt(req.user.id, 10);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.role !== 'TEACHER') {
      return res.status(403).json({ success: false, message: 'Only teachers can post announcements.' });
    }

    const classroom = await prisma.classroom.findUnique({ where: { id: parsedClassroomId } });

    if (!classroom || classroom.creatorId !== userId) {
      return res.status(403).json({ success: false, message: 'You are not authorized to post in this classroom.' });
    }

    let fileUrl: string | undefined = undefined;
    let fileType: string | undefined = undefined;

    if (file) {
      fileUrl = `/uploads/${file.filename}`; // or full URL if hosting separately
      fileType = path.extname(file.originalname).substring(1); // e.g., 'pdf', 'png'
    }

    const announcement = await prisma.announcement.create({
      data: {
        classroomId: parsedClassroomId,
        title,
        body,
        fileUrl,
        fileType,
      },
    });

    return res.status(201).json({ success: true, message: 'Announcement posted.', data: announcement });
  } catch (error) {
    console.error('Post Announcement error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getAnnouncements = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {

    const classroomIdStr = req.query.classroomId as string;
    const classroomId = parseInt(classroomIdStr, 10);


    if (isNaN(classroomId)) {
      return res.status(400).json({ success: false, message: 'Invalid classroom ID.' });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const skip = (page - 1) * pageSize;

    const announcements = await prisma.announcement.findMany({
      where: { classroomId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      select: {
        id: true,
        title: true,
        body: true,
        fileUrl: true,
        fileType: true,
        createdAt: true,
      },
    });

    const totalCount = await prisma.announcement.count({
      where: { classroomId },
    });

    return res.status(200).json({
      success: true,
      data: {
        announcements,
        totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error('Get Announcements error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
