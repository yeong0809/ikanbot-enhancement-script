// ==UserScript==
// @name         Dark Mode + Space Toggle for ikanbot.com (Modular)
// @namespace    Violentmonkey Scripts
// @match        https://v.ikanbot.com/*
// @grant        none
// @version      1.5
// @author       yeong0809 (modularized by ChatGPT)
// @description  Modular dark theme + space toggle video + pause video on load + toggle button + efficient load handlers
// @license      MIT
// @run-at       document-end
// @icon         https://v.ikanbot.com/favicon.ico
// ==/UserScript==

(function () {
  'use strict';

  /*** CONSTANTS ***/
  const CONSTANTS = {
    DARK_MODE_KEY: 'ikanbot-dark-mode-enabled',
    STYLE_ID: 'global-dark-mode-style',
    TOGGLE_BTN_ID: 'dark-mode-toggle-btn',
    PLAYER_ID: 'ikanbot-player',
  };

  /*** UTILS MODULE ***/
  const Utils = (() => {
    function waitForBody(callback) {
      if (document.body) callback();
      else {
        const observer = new MutationObserver(() => {
          if (document.body) {
            observer.disconnect();
            callback();
          }
        });
        observer.observe(document.documentElement, { childList: true });
      }
    }

    return { waitForBody };
  })();

  /*** DARK MODE MODULE ***/
  const DarkMode = (() => {
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

    let styleEl = null;

    function createStyleElement() {
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = CONSTANTS.STYLE_ID;
        styleEl.textContent = css;
        document.head.appendChild(styleEl);
      }
      return styleEl;
    }

    function enable() {
      createStyleElement().disabled = false;
    }

    function disable() {
      if (styleEl) styleEl.disabled = true;
    }

    function isEnabled() {
      const val = localStorage.getItem(CONSTANTS.DARK_MODE_KEY);
      return val === null ? true : val === 'true';
    }

    function setEnabled(enabled) {
      if (enabled) enable();
      else disable();
      localStorage.setItem(CONSTANTS.DARK_MODE_KEY, enabled ? 'true' : 'false');
      ToggleButton.update(enabled);
    }

    function toggle() {
      setEnabled(!isEnabled());
    }

    return { enable, disable, isEnabled, setEnabled, toggle, createStyleElement };
  })();

  /*** TOGGLE BUTTON MODULE ***/
  const ToggleButton = (() => {
    let btn = null;

    function create() {
      if (btn) return btn;

      btn = document.createElement('button');
      btn.id = CONSTANTS.TOGGLE_BTN_ID;
      btn.title = 'Toggle Dark Mode';
      btn.setAttribute('aria-pressed', 'false');

      Object.assign(btn.style, {
        position: 'fixed',
        top: '12px',
        right: '12px',
        zIndex: '9999',
        padding: '6px 10px',
        backgroundColor: '#444',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '13px',
        opacity: '0.8',
        transition: 'opacity 0.2s ease',
        userSelect: 'none',
        lineHeight: '1.2',
        textAlign: 'center',
      });

      btn.addEventListener('mouseenter', () => (btn.style.opacity = '1'));
      btn.addEventListener('mouseleave', () => (btn.style.opacity = '0.8'));
      btn.addEventListener('click', () => {
        DarkMode.toggle();
        btn.setAttribute('aria-pressed', DarkMode.isEnabled() ? 'true' : 'false');
      });

      Utils.waitForBody(() => {
        if (!document.body.contains(btn)) document.body.appendChild(btn);
      });

      update(DarkMode.isEnabled());

      return btn;
    }

    function update(enabled) {
      if (!btn) return;
      btn.textContent = enabled ? '🌙 Dark On' : '☀️ Dark Off';
      btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    }

    return { create, update };
  })();

  /*** VIDEO CONTROLLER MODULE ***/
  const VideoController = (() => {
    function getPlayer() {
      return document.getElementById(CONSTANTS.PLAYER_ID);
    }

    function getVideo() {
      const player = getPlayer();
      if (!player) return null;
      return player.querySelector('video');
    }

    function pauseVideo() {
      const video = getVideo();
      if (!video) return false;

      if (!video.paused) video.pause();

      const player = getPlayer();
      if (player) {
        player.classList.add('vjs-paused');
        player.classList.remove('vjs-playing');
      }
      return true;
    }

    function playVideo() {
      const video = getVideo();
      if (!video) return false;

      if (video.paused) video.play();

      const player = getPlayer();
      if (player) {
        player.classList.remove('vjs-paused');
        player.classList.add('vjs-playing');
      }
      return true;
    }

    function togglePlayPause() {
      const video = getVideo();
      if (!video) return;

      if (video.paused) playVideo();
      else pauseVideo();
    }

    function handleSpacebar(event) {
      if (event.code !== 'Space') return;
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      event.preventDefault();
      togglePlayPause();
    }

    function setupShortcut() {
      document.addEventListener('keydown', handleSpacebar);
    }

    // Efficient pauseVideoWhenReady using MutationObserver + loadeddata event
    function pauseVideoWhenReady() {
      const video = getVideo();
      if (video) {
        const onReady = () => {
          pauseVideo();
          video.removeEventListener('loadeddata', onReady);
          console.log('[VideoController] Video paused on load (immediate)');
        };
        video.addEventListener('loadeddata', onReady);
        if (video.readyState >= 2) onReady();
        return;
      }

      // Video not found yet - observe DOM mutations
      const observer = new MutationObserver((mutations, obs) => {
        const video = getVideo();
        if (video) {
          const onReady = () => {
            pauseVideo();
            video.removeEventListener('loadeddata', onReady);
            obs.disconnect();
            console.log('[VideoController] Video paused on load (observer)');
          };
          video.addEventListener('loadeddata', onReady);
          if (video.readyState >= 2) onReady();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }

    return { setupShortcut, pauseVideoWhenReady };
  })();

  /*** SCROLL CONTROLLER MODULE ***/
  const ScrollController = (() => {
    // Efficient scrollToLastEpisode using MutationObserver
    function scrollToLastEpisode() {
      const episodes = document.querySelectorAll('[name="lineData"]');
      if (episodes.length > 0) {
        episodes[episodes.length - 1].scrollIntoView({ behavior: 'auto' });
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        return;
      }

      const observer = new MutationObserver((mutations, obs) => {
        const episodes = document.querySelectorAll('[name="lineData"]');
        if (episodes.length > 0) {
          episodes[episodes.length - 1].scrollIntoView({ behavior: 'auto' });
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
          obs.disconnect();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }

    return { scrollToLastEpisode };
  })();

  /*** MAIN INIT FUNCTION ***/
  function init() {
    if (!document.head || !document.body) {
      requestAnimationFrame(init);
      return;
    }

    DarkMode.setEnabled(DarkMode.isEnabled());

    ToggleButton.create();

    VideoController.pauseVideoWhenReady();

    VideoController.setupShortcut();

    ScrollController.scrollToLastEpisode();

    // Observe DOM changes to re-inject dark mode styles if enabled
    const observer = new MutationObserver(() => {
      if (DarkMode.isEnabled()) DarkMode.createStyleElement();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  // Start everything
  init();

})();
