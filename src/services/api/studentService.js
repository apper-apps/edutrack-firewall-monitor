class StudentService {
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
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "gradeLevel" } },
          { field: { Name: "section" } },
          { field: { Name: "enrollmentDate" } },
          { field: { Name: "status" } }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('student', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "gradeLevel" } },
          { field: { Name: "section" } },
          { field: { Name: "enrollmentDate" } },
          { field: { Name: "status" } }
        ]
      };

      const response = await this.apperClient.getRecordById('student', id, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching student with ID ${id}:`, error);
      throw error;
    }
  }

  async create(studentData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: studentData.name,
          email: studentData.email,
          phone: studentData.phone,
          gradeLevel: studentData.gradeLevel,
          section: studentData.section,
          enrollmentDate: studentData.enrollmentDate,
          status: studentData.status
        }]
      };

      const response = await this.apperClient.createRecord('student', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create student');
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    }
  }

  async update(id, studentData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: id,
          Name: studentData.name,
          email: studentData.email,
          phone: studentData.phone,
          gradeLevel: studentData.gradeLevel,
          section: studentData.section,
          enrollmentDate: studentData.enrollmentDate,
          status: studentData.status
        }]
      };

      const response = await this.apperClient.updateRecord('student', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update student');
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord('student', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete student');
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  }
}

export const studentService = new StudentService();