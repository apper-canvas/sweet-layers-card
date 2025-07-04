import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const orderService = {
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
          { field: { Name: "items" } },
          { field: { Name: "delivery_type" } },
          { field: { Name: "scheduled_date" } },
          { field: { Name: "scheduled_time" } },
          { field: { Name: "customer_info" } },
          { field: { Name: "special_instructions" } },
          { field: { Name: "total" } },
          { field: { Name: "subtotal" } },
          { field: { Name: "tax" } },
          { field: { Name: "delivery_fee" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('order', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Transform database fields to match component expectations
      return response.data.map(order => ({
        Id: order.Id,
        name: order.Name,
        items: JSON.parse(order.items || '[]'),
        deliveryType: order.delivery_type,
        scheduledDate: order.scheduled_date,
        scheduledTime: order.scheduled_time,
        customerInfo: JSON.parse(order.customer_info || '{}'),
        specialInstructions: order.special_instructions,
        total: order.total,
        subtotal: order.subtotal,
        tax: order.tax,
        deliveryFee: order.delivery_fee,
        status: order.status,
        createdAt: order.created_at
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching orders:", error?.response?.data?.message);
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
          { field: { Name: "items" } },
          { field: { Name: "delivery_type" } },
          { field: { Name: "scheduled_date" } },
          { field: { Name: "scheduled_time" } },
          { field: { Name: "customer_info" } },
          { field: { Name: "special_instructions" } },
          { field: { Name: "total" } },
          { field: { Name: "subtotal" } },
          { field: { Name: "tax" } },
          { field: { Name: "delivery_fee" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } }
        ]
      };
      
      const response = await apperClient.getRecordById('order', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error('Order not found');
      }
      
      // Transform database fields to match component expectations
      const order = response.data;
      return {
        Id: order.Id,
        name: order.Name,
        items: JSON.parse(order.items || '[]'),
        deliveryType: order.delivery_type,
        scheduledDate: order.scheduled_date,
        scheduledTime: order.scheduled_time,
        customerInfo: JSON.parse(order.customer_info || '{}'),
        specialInstructions: order.special_instructions,
        total: order.total,
        subtotal: order.subtotal,
        tax: order.tax,
        deliveryFee: order.delivery_fee,
        status: order.status,
        createdAt: order.created_at
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching order with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },
  
  async create(order) {
    try {
      await delay(500);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: order.name || `Order ${Date.now()}`,
          items: JSON.stringify(order.items || []),
          delivery_type: order.deliveryType,
          scheduled_date: order.scheduledDate,
          scheduled_time: order.scheduledTime,
          customer_info: JSON.stringify(order.customerInfo || {}),
          special_instructions: order.specialInstructions || '',
          total: order.total,
          subtotal: order.subtotal,
          tax: order.tax,
          delivery_fee: order.deliveryFee,
          status: 'confirmed',
          created_at: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('order', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} orders:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdOrder = successfulRecords[0].data;
          return {
            Id: createdOrder.Id,
            name: createdOrder.Name,
            items: JSON.parse(createdOrder.items || '[]'),
            deliveryType: createdOrder.delivery_type,
            scheduledDate: createdOrder.scheduled_date,
            scheduledTime: createdOrder.scheduled_time,
            customerInfo: JSON.parse(createdOrder.customer_info || '{}'),
            specialInstructions: createdOrder.special_instructions,
            total: createdOrder.total,
            subtotal: createdOrder.subtotal,
            tax: createdOrder.tax,
            deliveryFee: createdOrder.delivery_fee,
            status: createdOrder.status,
            createdAt: createdOrder.created_at
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating order:", error?.response?.data?.message);
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
      if (data.items !== undefined) updateData.items = JSON.stringify(data.items);
      if (data.deliveryType !== undefined) updateData.delivery_type = data.deliveryType;
      if (data.scheduledDate !== undefined) updateData.scheduled_date = data.scheduledDate;
      if (data.scheduledTime !== undefined) updateData.scheduled_time = data.scheduledTime;
      if (data.customerInfo !== undefined) updateData.customer_info = JSON.stringify(data.customerInfo);
      if (data.specialInstructions !== undefined) updateData.special_instructions = data.specialInstructions;
      if (data.total !== undefined) updateData.total = data.total;
      if (data.subtotal !== undefined) updateData.subtotal = data.subtotal;
      if (data.tax !== undefined) updateData.tax = data.tax;
      if (data.deliveryFee !== undefined) updateData.delivery_fee = data.deliveryFee;
      if (data.status !== undefined) updateData.status = data.status;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('order', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} orders:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedOrder = successfulUpdates[0].data;
          return {
            Id: updatedOrder.Id,
            name: updatedOrder.Name,
            items: JSON.parse(updatedOrder.items || '[]'),
            deliveryType: updatedOrder.delivery_type,
            scheduledDate: updatedOrder.scheduled_date,
            scheduledTime: updatedOrder.scheduled_time,
            customerInfo: JSON.parse(updatedOrder.customer_info || '{}'),
            specialInstructions: updatedOrder.special_instructions,
            total: updatedOrder.total,
            subtotal: updatedOrder.subtotal,
            tax: updatedOrder.tax,
            deliveryFee: updatedOrder.delivery_fee,
            status: updatedOrder.status,
            createdAt: updatedOrder.created_at
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating order:", error?.response?.data?.message);
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
      
      const response = await apperClient.deleteRecord('order', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} orders:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting order:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};