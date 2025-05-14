// "use client";

import { Announcement, Classroom } from '../common/types';
import { apiClient } from './client';
import { ENDPOINTS } from './config';
import { ApiResponse, ClassroomsResponse, AnnouncementResponse } from './types';

/**
 * Classrooms service for managing classroom-related operations
 */
export class ClassroomsService {


  public async createClassroom(
    name: string,
  ): Promise<ApiResponse<Classroom>> {
    return apiClient.post(ENDPOINTS.CLASSROOMS.CREATE, {
      name: name,
    }, true);
  }




  /**
   * Get announcements for a classroom with pagination
   * @param classroomId ID of the classroom
   * @param page Page number
   * @param pageSize Items per page
   */
  public async getAnnouncements(
    classroomId: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<AnnouncementResponse>> {
    const query = new URLSearchParams({
      classroomId: classroomId.toString(),
      page: page.toString(),
      pageSize: pageSize.toString()
    }).toString();

    const endpoint = `${ENDPOINTS.CLASSROOMS.GET_ANNOUNCEMENTS}?${query}`;
    return apiClient.get<AnnouncementResponse>(endpoint, true);
  }

    public async postAnnouncement(formData: FormData): Promise<ApiResponse<Announcement>> {
    return apiClient.post(ENDPOINTS.CLASSROOMS.POST_ANNOUNCEMENT, formData, true);
  }

  /**
   * Get all classrooms for the authenticated user with pagination
   * @param page The page number to fetch (starts at 1)
   * @param pageSize Number of items per page
   */
  public async getAllClassrooms(
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<ClassroomsResponse>> {
    // Build the query string for pagination
    const query = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString()
    }).toString();

    const endpoint = `${ENDPOINTS.CLASSROOMS.GET_ALL}?${query}`;
    return apiClient.get<ClassroomsResponse>(endpoint, true);
  }


}

// Export a default instance
export const classroomsService = new ClassroomsService();