/* Open the existing playable world once per page load. Its existing exit control returns to the menus. */
(() => {
  'use strict';
  function enterWorld() {
    const play = document.getElementById('livingWorldStart');
    if (play) play.click();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enterWorld, { once: true });
  } else {
    enterWorld();
  }
})();
