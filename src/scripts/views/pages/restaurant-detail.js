// restaurant-detail.js
import RestaurantSource from '../../data/restaurant-source';
import UrlParser from '../../utils/url-parser';
import { createRestaurantDetailTemplate } from '../templates/template-creator';
import FavoriteRestaurantIdb from '../../data/favorite-restaurant-idb';

const RestaurantDetail = {
  async render() {
    return `
      <div id="restaurant-detail" class="restaurant-detail">
        <div class="restaurant-detail__loading">Loading restaurant details...</div>
      </div>
      <div id="likeButtonContainer"></div>
    `;
  },

  async afterRender() {
    try {
      const url = UrlParser.parseActiveUrlWithoutCombiner();
      const restaurantContainer = document.querySelector('#restaurant-detail');

      // Show loading state
      restaurantContainer.innerHTML = '<div class="loading-indicator">Loading...</div>';

      const restaurant = await RestaurantSource.getRestaurantDetail(url.id);

      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      restaurantContainer.innerHTML = createRestaurantDetailTemplate(restaurant);

      // Initialize favorite button
      await this._initializeFavoriteButton(restaurant);

      // Initialize review form
      this._initializeReviewForm(restaurant.id);

      // Add offline support
      this._initializeOfflineSupport(restaurant);
    } catch (error) {
      const restaurantContainer = document.querySelector('#restaurant-detail');
      restaurantContainer.innerHTML = `
        <div class="error-container">
          <h2>Error Loading Restaurant</h2>
          <p>${error.message}</p>
          <button class="retry-button" onclick="window.location.reload()">Try Again</button>
        </div>
      `;
    }
  },

  async _initializeFavoriteButton(restaurant) {
    const favoriteButton = document.querySelector('#favoriteButton');

    if (!restaurant) {
      if (favoriteButton) {
        favoriteButton.style.display = 'none';
      }
      return;
    }

    const isRestaurantFavorited = await FavoriteRestaurantIdb.getRestaurant(restaurant.id);

    this._renderFavoriteButton(favoriteButton, isRestaurantFavorited);

    favoriteButton.addEventListener('click', async () => {
      if (isRestaurantFavorited) {
        await FavoriteRestaurantIdb.deleteRestaurant(restaurant.id);
      } else {
        await FavoriteRestaurantIdb.putRestaurant(restaurant);
      }

      this._renderFavoriteButton(favoriteButton, !isRestaurantFavorited);
    });
  },

  _renderFavoriteButton(button, isFavorited) {
    button.innerHTML = isFavorited ? '<i class="fas fa-heart" aria-hidden="true"></i> Remove from Favorites' : '<i class="far fa-heart" aria-hidden="true"></i> Add to Favorites';

    button.setAttribute('aria-label', isFavorited ? 'Remove from favorites' : 'Add to favorites');
  },

  _initializeOfflineSupport(restaurant) {
    if (!navigator.onLine) {
      const offlineNotice = document.createElement('div');
      offlineNotice.classList.add('offline-notice');
      offlineNotice.textContent = 'You are currently offline. Some features may be limited.';
      document.querySelector('#restaurant-detail').prepend(offlineNotice);
    }
  },

  _initializeReviewForm(restaurantId) {
    const reviewForm = document.querySelector('#reviewForm');
    if (!reviewForm) return;

    reviewForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const nameInput = document.querySelector('#reviewerName');
      const reviewInput = document.querySelector('#reviewText');

      try {
        const reviewData = {
          id: restaurantId,
          name: nameInput.value,
          review: reviewInput.value,
        };

        const response = await RestaurantSource.addReview(reviewData);

        if (response.error) {
          throw new Error(response.message);
        }

        // Update reviews list
        const reviewsList = document.querySelector('#reviewsList');
        const newReview = {
          name: reviewData.name,
          review: reviewData.review,
          date: new Date().toLocaleDateString(),
        };

        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-card';
        reviewElement.innerHTML = `
          <div class="review-header">
            <i class="fas fa-user-circle"></i>
            <div class="review-info">
              <h3>${newReview.name}</h3>
              <span class="review-date">${newReview.date}</span>
            </div>
          </div>
          <p class="review-text">${newReview.review}</p>
        `;

        reviewsList.insertBefore(reviewElement, reviewsList.firstChild);

        // Reset form
        reviewForm.reset();

        // Show success message
        alert('Review added successfully!');
      } catch (error) {
        console.error('Error adding review:', error);
        alert(`Failed to add review: ${error.message}`);
      }
    });
  },
};

export default RestaurantDetail;
