// favorite-restaurants.js
import FavoriteRestaurantIdb from '../../data/favorite-restaurant-idb';
import { createRestaurantItemTemplate } from '../templates/template-creator';

const FavoriteRestaurants = {
  async render() {
    return `
      <div class="content">
        <h2 class="content__heading">Your Favorite Restaurants</h2>
        <div class="search-container">
          <input 
            type="search" 
            id="searchInput" 
            placeholder="Search favorite restaurants..."
            aria-label="Search favorite restaurants"
          >
        </div>
        <div id="restaurants" class="restaurants">
          <div class="restaurants-loading">Loading favorites...</div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const restaurantsContainer = document.querySelector('#restaurants');

    try {
      const restaurants = await FavoriteRestaurantIdb.getAllRestaurants();
      this._restaurants = restaurants;

      if (restaurants.length === 0) {
        restaurantsContainer.innerHTML = this._getEmptyRestaurantsTemplate();
        return;
      }

      this._displayRestaurants(restaurants);
      this._initializeSearch();
    } catch (error) {
      console.error('Error loading favorites:', error);
      restaurantsContainer.innerHTML = `
        <div class="error-container">
          <p>Failed to load favorite restaurants</p>
          <button onclick="window.location.reload()">Try Again</button>
        </div>
      `;
    }
  },

  _displayRestaurants(restaurants) {
    const restaurantsContainer = document.querySelector('#restaurants');
    restaurantsContainer.innerHTML = '';

    if (restaurants.length === 0) {
      restaurantsContainer.innerHTML = this._getEmptyRestaurantsTemplate();
      return;
    }

    restaurants.forEach((restaurant) => {
      const restaurantItem = createRestaurantItemTemplate(restaurant);
      restaurantsContainer.innerHTML += restaurantItem;
    });
  },

  _getEmptyRestaurantsTemplate() {
    return `
      <div class="restaurants-empty">
        <i class="fas fa-heart-broken"></i>
        <p>You haven't added any restaurants to your favorites yet.</p>
        <a href="#/home" class="button-primary">Discover Restaurants</a>
      </div>
    `;
  },

  _initializeSearch() {
    const searchInput = document.querySelector('#searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase();
        const filteredRestaurants = this._restaurants.filter((restaurant) => restaurant.name.toLowerCase().includes(query) || restaurant.description.toLowerCase().includes(query));
        this._displayRestaurants(filteredRestaurants);
      });
    }
  },
};

export default FavoriteRestaurants;
