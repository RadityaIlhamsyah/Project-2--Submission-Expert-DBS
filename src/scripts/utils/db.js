// src/scripts/utils/db.js
import { openDB } from 'idb';
import CONFIG from '../globals/config';

const DATABASE_NAME = CONFIG.DATABASE_NAME;
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'restaurants';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    database.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
  },
});

const FavoriteRestaurantIdb = {
  async getRestaurant(id) {
    if (!id) {
      return;
    }
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },

  async getAllRestaurants() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  async putRestaurant(restaurant) {
    if (!restaurant.hasOwnProperty('id')) {
      return;
    }
    return (await dbPromise).put(OBJECT_STORE_NAME, restaurant);
  },

  async deleteRestaurant(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },

  async searchRestaurants(query) {
    const restaurants = await this.getAllRestaurants();
    return restaurants.filter((restaurant) => {
      const loweredCaseQuery = query.toLowerCase();
      return restaurant.name.toLowerCase().includes(loweredCaseQuery);
    });
  },
};

export default FavoriteRestaurantIdb;
