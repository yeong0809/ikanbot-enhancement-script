# Dark Mode + Spacebar Toggle Userscript for ikanbot.com

A modular, single-file userscript that enhances the [ikanbot.com](https://v.ikanbot.com) viewing experience with:

- **Dark Mode** for better night-time viewing  
- **Spacebar key** to toggle video play/pause  
- **Auto-pause** video on page load  
- **Toggle button** fixed at top-right to enable/disable dark mode  
- **Auto-scroll** to last episode on page load  

---

## Features

- Uses CSS variables for easy and consistent dark mode styling  
- Works with the Video.js player on ikanbot.com (`#ikanbot-player`)  
- Preserves input usability — spacebar does not trigger toggle when typing in inputs or textareas  
- The toggle button updates text and style based on current dark mode state  
- Auto-scrolls to last episode in the episode list on page load  
- Modular design within a single file for easy maintenance and readability  

---

## Installation

1. Install a userscript manager like:

   - [Violentmonkey](https://violentmonkey.github.io/)  
   - [Tampermonkey](https://www.tampermonkey.net/)  

2. Create a new userscript and paste the entire script content into it (the `.user.js` code provided).  
3. Save and enable the script.  
4. Reload [https://v.ikanbot.com](https://v.ikanbot.com) to see it in action.  

---

## Usage

- The **dark mode toggle button** appears fixed at the top-right corner. Click to switch dark mode on/off.  
- Press the **Spacebar** key to toggle video play/pause (when not focused on form elements).  
- Videos **auto-pause on page load** to prevent unexpected playback.  
- The page **auto-scrolls to the last episode** in the episode list on load.  

---

## Development & Customization

- The script is modularized using immediately-invoked function expressions (IIFE) for clear separation of concerns.  
- You can customize dark mode colors in the `DarkMode` module's CSS string.  
- To adjust the toggle button style, modify the styles in the `ToggleButton` module.  
- The `VideoController` module manages video interactions and keyboard shortcuts.  
- Auto-scroll logic is in a simple utility function that can be adjusted for selector or scroll behavior.  

---

## License

MIT License  
Author: [yeong0809](https://github.com/yeong0809)  
