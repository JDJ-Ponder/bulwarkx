// This file contains functions for interacting with the backend API.

async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
function submitOrder(order) {
  console.log("Order submitted:", order);
}

export { submitOrder, fetchData };
