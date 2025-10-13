// ==UserScript==
// @name         Dark Mode + Space Toggle for ikanbot.com
// @namespace    Violentmonkey Scripts
// @match        https://v.ikanbot.com/*
// @grant        none
// @version      1.3
// @author       yeong0809
// @description  Modular dark theme + space toggle video + pause video on load + toggle button
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

  /*** UTILS ***/
  const Utils = {
    waitForBody(callback) {
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
    },
  };

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
      const style = createStyleElement();
      style.disabled = false;
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
      btn.addEventListener('click', () => DarkMode.toggle());

      Utils.waitForBody(() => {
        if (!document.body.contains(btn)) document.body.appendChild(btn);
      });

      update(DarkMode.isEnabled());

      return btn;
    }

    function update(enabled) {
      if (!btn) return;
      btn.textContent = enabled ? '🌙 Dark On' : '☀️ Dark Off';
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
      const player = getPlayer();
      const video = getVideo();
      if (!player || !video) return false;

      if (!video.paused) video.pause();

      player.classList.add('vjs-paused');
      player.classList.remove('vjs-playing');
      return true;
    }

    function playVideo() {
      const player = getPlayer();
      const video = getVideo();
      if (!player || !video) return false;

      if (video.paused) video.play();

      player.classList.remove('vjs-paused');
      player.classList.add('vjs-playing');
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

    function pauseVideoWhenReady(maxRetries = 100, intervalMs = 100) {
      let retries = 0;
      const timer = setInterval(() => {
        if (pauseVideo()) {
          clearInterval(timer);
          console.log('[VideoController] Video paused on load');
        } else if (++retries >= maxRetries) {
          clearInterval(timer);
          console.warn('[VideoController] Could not find video to pause');
        }
      }, intervalMs);
    }

    return { setupShortcut, pauseVideoWhenReady };
  })();

  /*** SCROLL UTILITY ***/
  function scrollToLastEpisode(maxAttempts = 100, intervalMs = 100) {
    let attempts = 0;
    const interval = setInterval(() => {
      const episodes = document.querySelectorAll('[name="lineData"]');
      if (episodes.length > 0) {
        episodes[episodes.length - 1].scrollIntoView({ behavior: 'auto' });
        clearInterval(interval);
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
      if (++attempts >= maxAttempts) clearInterval(interval);
    }, intervalMs);
  }

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

    scrollToLastEpisode();

    // Observe DOM changes to re-inject dark mode styles if enabled
    const observer = new MutationObserver(() => {
      if (DarkMode.isEnabled()) DarkMode.createStyleElement();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  // Start everything
  init();

})();
