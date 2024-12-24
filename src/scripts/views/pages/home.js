import RestaurantSource from '../../data/restaurant-source';
import { createRestaurantItemTemplate } from '../templates/template-creator';

const Home = {
  async render() {
    return `
      <div class="hero">
        <div class="hero__inner">
          <h1 class="hero__title">Welcome to Burger Apps</h1>
          <p class="hero__tagline">Discover the best restaurants near you</p>
        </div>
      </div>
      <div class="content">
        <h2 class="content__heading">Explore Restaurants</h2>
        <div id="restaurants" class="restaurants">
          <div class="restaurants-loading">Loading restaurants...</div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    try {
      const restaurantsContainer = document.querySelector('#restaurants');
      if (!restaurantsContainer) {
        throw new Error('Restaurants container not found');
      }

      restaurantsContainer.innerHTML = '<div class="loading">Loading restaurants...</div>';

      const restaurants = await RestaurantSource.getAllRestaurants();

      // Add a default restaurant if less than 3 restaurants
      const defaultRestaurant = {
        id: 'default-restaurant',
        name: 'Featured Restaurant',
        description: 'A cozy place with amazing food and great atmosphere. Perfect for family gatherings and special occasions.',
        pictureId: 'default-image.jpg',
        city: 'Featured City',
        rating: 4.5,
        categories: [{ name: 'Featured' }, { name: 'Special' }],
      };

      const displayRestaurants = [...restaurants];
      while (displayRestaurants.length < 3) {
        displayRestaurants.push(defaultRestaurant);
      }

      restaurantsContainer.innerHTML = displayRestaurants.map((restaurant) => createRestaurantItemTemplate(restaurant)).join('');
    } catch (error) {
      console.error('Error in afterRender:', error);
      const restaurantsContainer = document.querySelector('#restaurants');
      if (restaurantsContainer) {
        restaurantsContainer.innerHTML = `
          <div class="error">
            <p>Failed to load restaurants</p>
            <p>${error.message}</p>
            <button onclick="window.location.reload()">Try Again</button>
          </div>
        `;
      }
    }
  },
};

export default Home;
