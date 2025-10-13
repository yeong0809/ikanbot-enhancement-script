# Dark Mode + Spacebar Toggle Userscript for ikanbot.com

A modular, single-file userscript that enhances your [ikanbot.com](https://v.ikanbot.com) viewing experience with:

- **Dark Mode** for comfortable night-time viewing  
- **Spacebar key** to toggle video play/pause easily  
- **Auto-pause** video on page load to avoid surprise playback  
- **Toggle button** fixed at the top-right corner to switch dark mode on/off  
- **Auto-scroll** to the last episode in the episode list on page load  

---

## Features

- Uses CSS variables for consistent and easily customizable dark mode styling  
- Integrates with the Video.js player on ikanbot.com (`#ikanbot-player`)  
- Prevents spacebar toggling when typing in inputs or textareas to preserve typing behavior  
- Toggle button text and state update dynamically based on dark mode status  
- Automatically scrolls to the last or currently active episode on page load for convenience  
- Modular, maintainable code organized into separate logical modules within one file  

---

## Installation

1. Install a userscript manager, such as:  
   - [Violentmonkey](https://violentmonkey.github.io/)  
   - [Tampermonkey](https://www.tampermonkey.net/)  

2. Add a new userscript by pasting this URL:  
   `https://raw.githubusercontent.com/yeong0809/ikanbot-tools/refs/heads/main/plugin.js`  

3. Save and enable the script.  
4. Reload [https://v.ikanbot.com](https://v.ikanbot.com) and enjoy the enhanced experience!  

---

## Usage

- Click the **dark mode toggle button** at the top-right corner to enable or disable dark mode.  
- Press the **Spacebar** key to toggle play/pause of the video — works only when not focused on form elements.  
- Videos **automatically pause on page load** to prevent unwanted playback.  
- The page **auto-scrolls** to the last or active episode in the episode list on load for quick navigation.  

---

## Development & Customization

- The script uses immediately-invoked function expressions (IIFE) for modular design and clarity.  
- Customize dark mode colors easily by editing the CSS variables inside the `DarkMode` module.  
- Modify toggle button appearance and behavior inside the `ToggleButton` module.  
- Video playback controls and keyboard shortcuts are managed by the `VideoController` module.  
- Scroll behavior is handled by the `ScrollController` module, adjustable to fit UI changes or preferences.  

---

## License

MIT License  
Author: [yeong0809](https://github.com/yeong0809) (modularized & fixed by ChatGPT)  
