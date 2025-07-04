import ordersData from '@/services/mockData/orders.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const orderService = {
  async getAll() {
    await delay(300);
    return [...ordersData];
  },
  
  async getById(id) {
    await delay(200);
    const order = ordersData.find(o => o.Id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    return { ...order };
  },
  
  async create(order) {
    await delay(500);
    const newOrder = {
      ...order,
      Id: Math.max(...ordersData.map(o => o.Id)) + 1,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    ordersData.push(newOrder);
    return { ...newOrder };
  },
  
  async update(id, data) {
    await delay(350);
    const index = ordersData.findIndex(o => o.Id === id);
    if (index === -1) {
      throw new Error('Order not found');
    }
    ordersData[index] = { ...ordersData[index], ...data };
    return { ...ordersData[index] };
  },
  
  async delete(id) {
    await delay(300);
    const index = ordersData.findIndex(o => o.Id === id);
    if (index === -1) {
      throw new Error('Order not found');
    }
    ordersData.splice(index, 1);
    return { success: true };
  }
};