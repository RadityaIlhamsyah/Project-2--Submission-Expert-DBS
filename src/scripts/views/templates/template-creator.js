/* eslint-disable indent */
/* eslint-disable prefer-template */
import CONFIG from '../../globals/config';

const createRestaurantItemTemplate = (restaurant = {}) => {
  if (!restaurant) return '<div>Data restaurant tidak ditemukan</div>';

  return `
    <article class="restaurant-item">
      <div class="restaurant-item__header">
        <img class="restaurant-item__image lazyload"
          src="${restaurant.pictureId ? CONFIG.BASE_IMAGE_URL + restaurant.pictureId : 'images/placeholder.jpg'}"
          alt="${restaurant.name || 'Restaurant image'}"
        />
        <div class="restaurant-item__rating">
          <i class="fas fa-star"></i>
          <span>${restaurant.rating || '-'}</span>
        </div>
        <div class="restaurant-item__city">
          <i class="fas fa-map-marker-alt"></i> ${restaurant.city || 'Location not available'}
        </div>
      </div>
      <div class="restaurant-item__content">
        <h3 class="restaurant-item__title">
          <a href="#/detail/${restaurant.id || '#'}">${restaurant.name || 'Restaurant Name'}</a>
        </h3>
        <p class="restaurant-item__description">${restaurant.description ? restaurant.description.slice(0, 150) + '...' : 'No description available'}</p>
        <div class="restaurant-item__footer">
          <div class="categories">
            ${restaurant.categories ? restaurant.categories.map((category) => `<span class="category-tag">${category.name}</span>`).join('') : '<span class="category-tag">Uncategorized</span>'}
          </div>
          <a href="#/detail/${restaurant.id || '#'}" class="view-detail">View Details</a>
        </div>
      </div>
    </article>
  `;
};

const createRestaurantDetailTemplate = (restaurant = {}) => {
  if (!restaurant) return '<div>Restaurant data not found</div>';

  return `
    <div class="restaurant-detail">
      <div class="restaurant-detail__hero">
        <img 
          src="${restaurant.pictureId ? CONFIG.BASE_IMAGE_URL + restaurant.pictureId : 'images/placeholder.jpg'}"
          alt="${restaurant.name}"
          class="restaurant-detail__image"
        />
        <div class="restaurant-detail__hero-content">
          <h1>${restaurant.name}</h1>
          <div class="restaurant-detail__info">
            <div class="info-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>${restaurant.address}, ${restaurant.city}</span>
            </div>
            <div class="info-item">
              <i class="fas fa-star"></i>
              <span>${restaurant.rating} / 5.0</span>
            </div>
          </div>
        </div>
      </div>

      <div class="restaurant-detail__content">
        <section class="restaurant-detail__main">
          <div class="restaurant-detail__categories">
            ${restaurant.categories ? restaurant.categories.map((category) => `<span class="category-tag">${category.name}</span>`).join('') : '<span class="category-tag">Uncategorized</span>'}
          </div>
          
          <div class="restaurant-detail__description">
            <h2>About the Restaurant</h2>
            <p>${restaurant.description}</p>
          </div>

          <div class="restaurant-detail__menu">
            <div class="menu-section">
              <h2><i class="fas fa-utensils"></i> Foods</h2>
              <div class="menu-grid">
                ${
                  restaurant.menus?.foods
                    ?.map(
                      (food) => `
                  <div class="menu-item">
                    <i class="fas fa-hamburger"></i>
                    <span>${food.name}</span>
                  </div>
                `
                    )
                    .join('') || '<p>No food menu available</p>'
                }
              </div>
            </div>

            <div class="menu-section">
              <h2><i class="fas fa-cocktail"></i> Drinks</h2>
              <div class="menu-grid">
                ${
                  restaurant.menus?.drinks
                    ?.map(
                      (drink) => `
                  <div class="menu-item">
                    <i class="fas fa-glass-martini-alt"></i>
                    <span>${drink.name}</span>
                  </div>
                `
                    )
                    .join('') || '<p>No drinks menu available</p>'
                }
              </div>
            </div>
          </div>

          <div class="restaurant-detail__reviews">
            <h2>Customer Reviews</h2>
            
            <!-- Review Form -->
            <div class="review-form">
              <h3>Add Your Review</h3>
              <form id="reviewForm">
                <input type="hidden" id="restaurantId" value="${restaurant.id}">
                <div class="form-group">
                  <label for="reviewerName">Name</label>
                  <input type="text" id="reviewerName" name="name" required>
                </div>
                <div class="form-group">
                  <label for="reviewText">Review</label>
                  <textarea id="reviewText" name="review" required></textarea>
                </div>
                <button type="submit" class="submit-review">Submit Review</button>
              </form>
            </div>

            <!-- Reviews List -->
            <div class="reviews-grid" id="reviewsList">
              ${
                restaurant.customerReviews
                  ?.map(
                    (review) => `
                <div class="review-card">
                  <div class="review-header">
                    <i class="fas fa-user-circle"></i>
                    <div class="review-info">
                      <h3>${review.name}</h3>
                      <span class="review-date">${review.date}</span>
                    </div>
                  </div>
                  <p class="review-text">${review.review}</p>
                </div>
              `
                  )
                  .join('') || '<p>No reviews yet</p>'
              }
            </div>
          </div>
        </section>

        <aside class="restaurant-detail__sidebar">
          <div id="favoriteButtonContainer" class="favorite-btn-container">
            <button id="favoriteButton" class="favorite-btn" aria-label="Add to favorites">
              <i class="far fa-heart"></i> Add to Favorites
            </button>
          </div>
          <div class="restaurant-detail__location">
            <h2>Location</h2>
            <p><i class="fas fa-map-marked-alt"></i> ${restaurant.address}</p>
            <p><i class="fas fa-city"></i> ${restaurant.city}</p>
          </div>
          <div class="restaurant-detail__hours">
            <h2>Opening Hours</h2>
            <p>Monday - Sunday</p>
            <p>10:00 AM - 10:00 PM</p>
          </div>
        </aside>
      </div>
    </div>
  `;
};

export { createRestaurantItemTemplate, createRestaurantDetailTemplate };
