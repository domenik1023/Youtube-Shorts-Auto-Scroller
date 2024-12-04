// ==UserScript==
// @name         YouTube Shorts Auto Scroll
// @namespace    https://domenik1023.de/
// @version      1.2
// @description  Automatically scroll to the next YouTube Shorts video after it ends.
// @author       ChatGPT, domenik1023
// @match        https://www.youtube.com/shorts/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const debug = false; // Set to true to enable debug logging

    // Debug log function
    function debugLog(message) {
        if (debug) {
            console.log(message);
        }
    }

    // Function to remove the loop attribute from the video
    function removeLoop(video) {
        if (video.hasAttribute('loop')) {
            video.removeAttribute('loop');
            debugLog('Scroll_Dumbo: Removed loop attribute from video');
        } else {
            debugLog('Scroll_Dumbo: No loop attribute found on video');
        }
    }

    // Function to continuously remove the loop attribute if it reappears
    function startRemovingLoop(video) {
        // Use MutationObserver to watch for attribute changes on the video element
        const observer = new MutationObserver(() => {
            if (video.hasAttribute('loop')) {
                debugLog('Scroll_Dumbo: Loop attribute detected, removing it');
                removeLoop(video);
            }
        });

        observer.observe(video, { attributes: true, attributeFilter: ['loop'] });

        // Also, keep trying to remove loop attribute periodically just in case
        const intervalId = setInterval(() => {
            if (video.hasAttribute('loop')) {
                debugLog('Scroll_Dumbo: Loop attribute still present, removing it');
                removeLoop(video);
            }
        }, 1000);

        // Stop observing and interval when video ends
        video.addEventListener('ended', () => {
            observer.disconnect();
            clearInterval(intervalId);
        });
    }

    // Function to detect when the video ends and scroll to the next short
    function autoScrollNext() {
        debugLog('Scroll_Dumbo: autoScrollNext function called');
        const video = document.querySelector('video');
        if (video) {
            debugLog('Scroll_Dumbo: Video element found');
            removeLoop(video); // Remove loop attribute if present whenever video is found
            startRemovingLoop(video); // Start monitoring loop attribute
        }
        if (!video) {
            debugLog('Scroll_Dumbo: No video element found');
            return;
        }

        video.addEventListener('ended', () => {
            removeLoop(video);
            debugLog('Scroll_Dumbo: Video ended');
            // Wait a bit before scrolling to simulate natural behavior
            setTimeout(() => {
                debugLog('Scroll_Dumbo: Attempting to scroll to the next Shorts video');
                debugLog('Scroll_Dumbo: Pressing the arrow down key to move to the next video');
                const arrowDownEvent = new KeyboardEvent('keydown', {
                    key: 'ArrowDown',
                    code: 'ArrowDown',
                    keyCode: 40,
                    which: 40,
                    bubbles: true,
                    cancelable: true
                });
                document.dispatchEvent(arrowDownEvent);
                debugLog('Scroll_Dumbo: Finished scrolling to the next Shorts video');
            }, 500);
        });

        video.addEventListener('play', () => {
            debugLog('Scroll_Dumbo: Video started playing');
            removeLoop(video); // Remove loop attribute if present whenever video starts playing
        });

        video.addEventListener('loadeddata', () => {
            debugLog('Scroll_Dumbo: Video data loaded');
            removeLoop(video); // Remove loop attribute if present whenever video data is loaded
        });
    }

    // Run the function when the page is loaded or when navigating between shorts
    window.addEventListener('yt-navigate-finish', () => {
        const video = document.querySelector('video');
        if (video) {
            removeLoop(video);
            startRemovingLoop(video);
        }
        debugLog('Scroll_Dumbo: yt-navigate-finish event detected');
        autoScrollNext();
    });
    debugLog('Scroll_Dumbo: Initial call to autoScrollNext');
    autoScrollNext();
})();
