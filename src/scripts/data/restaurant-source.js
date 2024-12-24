// src/scripts/data/restaurant-source.js
import API_ENDPOINT from '../globals/api-endpoint';

class RestaurantSource {
  static async getAllRestaurants() {
    try {
      const response = await fetch(API_ENDPOINT.LIST);
      const responseJson = await response.json();
      return responseJson.restaurants;
    } catch (error) {
      throw new Error(`Error fetching restaurants: ${error.message}`);
    }
  }

  static async getRestaurantDetail(id) {
    try {
      const response = await fetch(API_ENDPOINT.DETAIL(id));
      const responseJson = await response.json();
      return responseJson.restaurant;
    } catch (error) {
      throw new Error(`Error fetching restaurant detail: ${error.message}`);
    }
  }

  static async addReview(review) {
    try {
      const response = await fetch(API_ENDPOINT.ADD_REVIEW, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      throw new Error(`Error adding review: ${error.message}`);
    }
  }
}

export default RestaurantSource;
