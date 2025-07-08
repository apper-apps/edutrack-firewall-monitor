class GradeService {
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
          { field: { Name: "subject" } },
          { field: { Name: "score" } },
          { field: { Name: "maxScore" } },
          { field: { Name: "gradeType" } },
          { field: { Name: "semester" } },
          { field: { Name: "date" } },
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

      const response = await this.apperClient.fetchRecords('grade', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "subject" } },
          { field: { Name: "score" } },
          { field: { Name: "maxScore" } },
          { field: { Name: "gradeType" } },
          { field: { Name: "semester" } },
          { field: { Name: "date" } },
          {
            field: { name: "studentId" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await this.apperClient.getRecordById('grade', id, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching grade with ID ${id}:`, error);
      throw error;
    }
  }

  async create(gradeData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: `${gradeData.subject} - ${gradeData.gradeType}`,
          subject: gradeData.subject,
          score: gradeData.score,
          maxScore: gradeData.maxScore,
          gradeType: gradeData.gradeType,
          semester: gradeData.semester,
          date: gradeData.date,
          studentId: gradeData.studentId
        }]
      };

      const response = await this.apperClient.createRecord('grade', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create grade');
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating grade:", error);
      throw error;
    }
  }

  async update(id, gradeData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: id,
          Name: `${gradeData.subject} - ${gradeData.gradeType}`,
          subject: gradeData.subject,
          score: gradeData.score,
          maxScore: gradeData.maxScore,
          gradeType: gradeData.gradeType,
          semester: gradeData.semester,
          date: gradeData.date,
          studentId: gradeData.studentId
        }]
      };

      const response = await this.apperClient.updateRecord('grade', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update grade');
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating grade:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord('grade', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete grade');
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting grade:", error);
      throw error;
    }
  }
}

export const gradeService = new GradeService();