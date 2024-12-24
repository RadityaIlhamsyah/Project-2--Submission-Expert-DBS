/* eslint-disable quotes */
// src/scripts/views/app.js
import DrawerInitiator from '../utils/drawer-initiator';
import UrlParser from '../utils/url-parser';
import routes from '../routes/routes';

// app.js
class App {
  constructor({ button, drawer, content }) {
    this._button = button;
    this._drawer = drawer;
    this._content = content;

    this._initialAppShell();
  }

  _initialAppShell() {
    // Initialize DrawerInitiator
    DrawerInitiator.init({
      button: this._button,
      drawer: this._drawer,
      content: this._content,
    });
  }

  async renderPage() {
    try {
      const url = UrlParser.parseActiveUrlWithCombiner();
      const page = routes[url];

      if (!page) {
        this._content.innerHTML = `<div class="error">Page Not Found</div>`;
        return;
      }

      this._content.innerHTML = await page.render();
      await page.afterRender();

      // Add skip to content functionality
      this._initSkipToContent();

      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error rendering page:', error);
      this._content.innerHTML = `
        <div class="error">
          <h2>Error Loading Page</h2>
          <p>${error.message}</p>
        </div>
      `;
    }
  }

  _initSkipToContent() {
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.querySelector('#mainContent');

    if (skipLink && mainContent) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }
}

export default App;
