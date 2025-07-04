import cakesData from '@/services/mockData/cakes.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const cakeService = {
  async getAll() {
    await delay(300);
    return [...cakesData];
  },
  
  async getById(id) {
    await delay(200);
    const cake = cakesData.find(c => c.Id === id);
    if (!cake) {
      throw new Error('Cake not found');
    }
    return { ...cake };
  },
  
  async create(cake) {
    await delay(400);
    const newCake = {
      ...cake,
      Id: Math.max(...cakesData.map(c => c.Id)) + 1
    };
    cakesData.push(newCake);
    return { ...newCake };
  },
  
  async update(id, data) {
    await delay(350);
    const index = cakesData.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error('Cake not found');
    }
    cakesData[index] = { ...cakesData[index], ...data };
    return { ...cakesData[index] };
  },
  
async delete(id) {
    await delay(300);
    const index = cakesData.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error('Cake not found');
    }
    cakesData.splice(index, 1);
    return { success: true };
  },
  
  async getSuggestions(searchTerm) {
    await delay(200);
    const term = searchTerm.toLowerCase();
    const suggestions = cakesData.filter(cake => 
      cake.name.toLowerCase().includes(term) ||
      cake.description.toLowerCase().includes(term) ||
      cake.availableFlavors.some(flavor => flavor.toLowerCase().includes(term))
    ).slice(0, 5); // Limit to 5 suggestions
    
    return suggestions.map(cake => ({
      Id: cake.Id,
      name: cake.name,
      category: cake.category,
      basePrice: cake.basePrice
    }));
  }
};