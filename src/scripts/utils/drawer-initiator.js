const DrawerInitiator = {
  init({ button, drawer, content }) {
    button.addEventListener('click', (event) => {
      this._toggleDrawer(event, drawer);
    });

    // Add click event to close drawer when clicking outside
    document.addEventListener('click', (event) => {
      if (!drawer.contains(event.target) && !button.contains(event.target)) {
        this._closeDrawer(event, drawer);
      }
    });

    // Add specific content click handler
    content.addEventListener('click', (event) => {
      this._closeDrawer(event, drawer);
    });

    // Add ESC key handler
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this._closeDrawer(event, drawer);
      }
    });
  },

  _toggleDrawer(event, drawer) {
    event.stopPropagation();
    drawer.classList.toggle('open');
  },

  _closeDrawer(event, drawer) {
    event.stopPropagation();
    drawer.classList.remove('open');
  },
};

export default DrawerInitiator;
