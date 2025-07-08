class ClassService {
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
          { field: { Name: "gradeLevel" } },
          { field: { Name: "section" } },
          { field: { Name: "capacity" } }
        ],
        orderBy: [
          {
            fieldName: "gradeLevel",
            sorttype: "ASC"
          },
          {
            fieldName: "section",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('class', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching classes:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "gradeLevel" } },
          { field: { Name: "section" } },
          { field: { Name: "capacity" } }
        ]
      };

      const response = await this.apperClient.getRecordById('class', id, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching class with ID ${id}:`, error);
      throw error;
    }
  }

  async create(classData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: classData.name,
          gradeLevel: classData.gradeLevel,
          section: classData.section,
          capacity: classData.capacity
        }]
      };

      const response = await this.apperClient.createRecord('class', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create class');
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating class:", error);
      throw error;
    }
  }

  async update(id, classData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: id,
          Name: classData.name,
          gradeLevel: classData.gradeLevel,
          section: classData.section,
          capacity: classData.capacity
        }]
      };

      const response = await this.apperClient.updateRecord('class', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update class');
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating class:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord('class', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete class');
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting class:", error);
      throw error;
    }
  }
}

export const classService = new ClassService();