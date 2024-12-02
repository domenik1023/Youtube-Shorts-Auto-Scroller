# YouTube Shorts Auto Scroll

## Overview
YouTube Shorts Auto Scroll is a Tampermonkey userscript that automatically scrolls to the next YouTube Shorts video after the current video ends. This script removes the loop attribute that YouTube occasionally adds to the video, allowing for an uninterrupted experience.

## Features
- **Auto Scroll**: Automatically moves to the next YouTube Shorts video after the current one ends.
- **Loop Removal**: Removes the `loop` attribute that YouTube might add, ensuring the next video plays without repeating.
- **Debug Mode**: Optional debug logging can be enabled to see detailed console messages for troubleshooting.

## Installation
1. Install the [Tampermonkey browser extension](https://www.tampermonkey.net/).
2. Create a new userscript and paste the content of `scroll.js`.
3. Save the script and make sure it is enabled in Tampermonkey.

## Usage
- The script runs automatically when you visit YouTube Shorts (`https://www.youtube.com/shorts/*`).
- By default, debug messages are turned off. To enable them, change the value of `debug` to `true` in the script.

## Debugging
If you experience issues, you can enable debugging by setting `const debug = true;` at the top of the script. This will output detailed logs to the browser console for troubleshooting purposes.

## ChatGPT
That Code is enterly written by ChatGPT. I couldn't find a working version so i asked ChatGPT to create it. It works still works (02/12/2024)

## License
This script is open source and available under the MIT License.

