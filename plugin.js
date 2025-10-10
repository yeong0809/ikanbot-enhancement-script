// ==UserScript==
// @name         Dark Mode + Space Toggle for ikanbot.com
// @namespace    Violentmonkey Scripts
// @match        https://v.ikanbot.com/*
// @grant        none
// @version      1.2
// @author       yeong0809
// @description  Dark theme + Spacebar toggles video play/pause
// @license      MIT
// @run-at       document-end
// @icon         https://v.ikanbot.com/favicon.ico
// ==/UserScript==

(function () {
  'use strict';

  const css = `
    :root {
      --bg-color: rgba(0, 0, 0, 0.9);
      --text-color: #ffffff;
      --link-color: #4ea8ff;
      --highlight-color: #00c853;
      --border-color: #555;
      --input-bg: #222;
      --input-border: #666;
      --selection-bg: #555;
    }

    html, body {
      background-color: var(--bg-color) !important;
      color: var(--text-color) !important;
    }

    *, *::before, *::after {
      background-color: transparent !important;
      color: var(--text-color) !important;
      border-color: var(--border-color) !important;
    }

    a, a * {
      color: var(--link-color) !important;
    }

    a:hover {
      color: #88ccff !important;
    }

    ::selection {
      background: var(--selection-bg) !important;
      color: var(--text-color) !important;
    }

    input, textarea, select, button {
      background-color: var(--input-bg) !important;
      color: var(--text-color) !important;
      border: 1px solid var(--input-border) !important;
    }

    .vjs-progress-holder {
      background-color: lightyellow !important;
    }

    .vjs-load-progress {
      background-color: orange !important;
    }

    .vjs-play-progress {
      background-color: green !important;
    }

    .active {
      background-color: var(--highlight-color) !important;
    }

    .result-info {
      background-color: transparent !important;
    }

    .card, .container, .box, .modal, .dropdown {
      box-shadow: none !important;
    }
  `;

  function injectStyles() {
    if (document.getElementById('global-dark-mode-style')) return;

    const style = document.createElement('style');
    style.id = 'global-dark-mode-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function waitForEpisodesAndScroll() {
    let attempts = 0;
    const maxAttempts = 30;

    const interval = setInterval(() => {
      const episodes = document.querySelectorAll('[name="lineData"]');
      if (episodes.length) {
        episodes[episodes.length - 1].scrollIntoView({ behavior: 'auto' });
        clearInterval(interval);
      }
      if (++attempts > maxAttempts) clearInterval(interval);
    }, 200);
  }

  function observeDOM() {
    const observer = new MutationObserver(() => {
      injectStyles(); // Reapply styles on DOM changes
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  function setupSpacebarToggle() {
    document.addEventListener('keydown', (event) => {
      // Prevent default scroll when spacebar is pressed (if not in input)
      if (event.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        event.preventDefault();

        const playerEl = document.getElementById('ikanbot-player');
        if (!playerEl) return;

        const video = playerEl.querySelector('video');

        if (video) {
          if (video.paused) {
            video.play();
            playerEl.classList.remove('vjs-paused');
            playerEl.classList.add('vjs-playing');
          } else {
            video.pause();
            playerEl.classList.remove('vjs-playing');
            playerEl.classList.add('vjs-paused');
          }
        }
      }
    });
  }

  function start() {
    if (!document.head) {
      requestAnimationFrame(start);
      return;
    }
    injectStyles();
    waitForEpisodesAndScroll();
    observeDOM();
    setupSpacebarToggle();
  }

  start();
})();
