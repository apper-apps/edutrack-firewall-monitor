class AttendanceService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "reason" } },
          {
            field: { name: "studentId" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [
          {
            fieldName: "date",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('attendance', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "reason" } },
          {
            field: { name: "studentId" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await this.apperClient.getRecordById('attendance', id, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance with ID ${id}:`, error);
      throw error;
    }
  }

  async create(attendanceData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: `Attendance - ${attendanceData.date}`,
          date: attendanceData.date,
          status: attendanceData.status,
          reason: attendanceData.reason || "",
          studentId: attendanceData.studentId
        }]
      };

      const response = await this.apperClient.createRecord('attendance', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create attendance record');
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating attendance:", error);
      throw error;
    }
  }

  async update(id, attendanceData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: id,
          Name: `Attendance - ${attendanceData.date}`,
          date: attendanceData.date,
          status: attendanceData.status,
          reason: attendanceData.reason || "",
          studentId: attendanceData.studentId
        }]
      };

      const response = await this.apperClient.updateRecord('attendance', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update attendance record');
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating attendance:", error);
      throw error;
    }
  }

  async updateByStudentAndDate(studentId, date, status, reason = "") {
    try {
      // First, try to find existing record
      const existingParams = {
        fields: [
          { field: { Name: "Name" } }
        ],
        where: [
          {
            FieldName: "studentId",
            Operator: "EqualTo",
            Values: [studentId]
          },
          {
            FieldName: "date",
            Operator: "EqualTo",
            Values: [date]
          }
        ]
      };

      const existingResponse = await this.apperClient.fetchRecords('attendance', existingParams);

      if (existingResponse.success && existingResponse.data && existingResponse.data.length > 0) {
        // Update existing record
        return await this.update(existingResponse.data[0].Id, {
          date,
          status,
          reason,
          studentId
        });
      } else {
        // Create new record
        return await this.create({
          date,
          status,
          reason,
          studentId
        });
      }
    } catch (error) {
      console.error("Error updating attendance by student and date:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord('attendance', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete attendance record');
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting attendance:", error);
      throw error;
    }
  }
}

export const attendanceService = new AttendanceService();