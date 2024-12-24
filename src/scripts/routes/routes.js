// src/scripts/routes/routes.js
import Home from '../views/pages/home';
import Favorite from '../views/pages/favorite-restaurants';
import Detail from '../views/pages/restaurant-detail';

const routes = {
  '/': Home,
  '/home': Home,
  '/favorite': Favorite,
  '/detail/:id': Detail,
};

export default routes;
