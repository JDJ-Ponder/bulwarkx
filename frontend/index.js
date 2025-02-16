import { fetchData, submitOrder } from './apiService.js';

async function init() {
  try {
    const data = await fetchData();
    console.log('Data fetched:', data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

init();

function handleOrder() {
  const order = { item: 'Example Item', quantity: 1 }; 
  submitOrder(order);
}

handleOrder();