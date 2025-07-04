import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const cakeService = {
  async getAll() {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category" } },
          { field: { Name: "base_price" } },
          { field: { Name: "description" } },
          { field: { Name: "images" } },
          { field: { Name: "available_sizes" } },
          { field: { Name: "available_flavors" } },
          { field: { Name: "customizable" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('cake', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Transform database fields to match component expectations
      return response.data.map(cake => ({
        Id: cake.Id,
        name: cake.Name,
        category: cake.category,
        basePrice: cake.base_price,
        description: cake.description,
        images: JSON.parse(cake.images || '[]'),
        availableSizes: cake.available_sizes?.split(',') || [],
        availableFlavors: cake.available_flavors?.split(',') || [],
        customizable: cake.customizable
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching cakes:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },
  
  async getById(id) {
    try {
      await delay(200);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category" } },
          { field: { Name: "base_price" } },
          { field: { Name: "description" } },
          { field: { Name: "images" } },
          { field: { Name: "available_sizes" } },
          { field: { Name: "available_flavors" } },
          { field: { Name: "customizable" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.getRecordById('cake', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error('Cake not found');
      }
      
      // Transform database fields to match component expectations
      const cake = response.data;
      return {
        Id: cake.Id,
        name: cake.Name,
        category: cake.category,
        basePrice: cake.base_price,
        description: cake.description,
        images: JSON.parse(cake.images || '[]'),
        availableSizes: cake.available_sizes?.split(',') || [],
        availableFlavors: cake.available_flavors?.split(',') || [],
        customizable: cake.customizable
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching cake with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },
  
  async create(cake) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: cake.name,
          category: cake.category,
          base_price: cake.basePrice,
          description: cake.description,
          images: JSON.stringify(cake.images || []),
          available_sizes: cake.availableSizes?.join(',') || '',
          available_flavors: cake.availableFlavors?.join(',') || '',
          customizable: cake.customizable || false
        }]
      };
      
      const response = await apperClient.createRecord('cake', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} cakes:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdCake = successfulRecords[0].data;
          return {
            Id: createdCake.Id,
            name: createdCake.Name,
            category: createdCake.category,
            basePrice: createdCake.base_price,
            description: createdCake.description,
            images: JSON.parse(createdCake.images || '[]'),
            availableSizes: createdCake.available_sizes?.split(',') || [],
            availableFlavors: createdCake.available_flavors?.split(',') || [],
            customizable: createdCake.customizable
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating cake:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },
  
  async update(id, data) {
    try {
      await delay(350);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateData = {
        Id: id
      };
      
      if (data.name !== undefined) updateData.Name = data.name;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.basePrice !== undefined) updateData.base_price = data.basePrice;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.images !== undefined) updateData.images = JSON.stringify(data.images);
      if (data.availableSizes !== undefined) updateData.available_sizes = data.availableSizes.join(',');
      if (data.availableFlavors !== undefined) updateData.available_flavors = data.availableFlavors.join(',');
      if (data.customizable !== undefined) updateData.customizable = data.customizable;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('cake', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} cakes:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedCake = successfulUpdates[0].data;
          return {
            Id: updatedCake.Id,
            name: updatedCake.Name,
            category: updatedCake.category,
            basePrice: updatedCake.base_price,
            description: updatedCake.description,
            images: JSON.parse(updatedCake.images || '[]'),
            availableSizes: updatedCake.available_sizes?.split(',') || [],
            availableFlavors: updatedCake.available_flavors?.split(',') || [],
            customizable: updatedCake.customizable
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating cake:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },
  
  async delete(id) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord('cake', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} cakes:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting cake:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },
  
  async getSuggestions(searchTerm) {
    try {
      await delay(200);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category" } },
          { field: { Name: "base_price" } }
        ],
        where: [
          {
            FieldName: "Name",
            Operator: "Contains",
            Values: [searchTerm],
            Include: true
          }
        ],
        pagingInfo: {
          limit: 5,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords('cake', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(cake => ({
        Id: cake.Id,
        name: cake.Name,
        category: cake.category,
        basePrice: cake.base_price
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching suggestions:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};