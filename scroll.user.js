// ==UserScript==
// @name         YouTube Shorts Auto Scroll
// @namespace    domenik1023
// @version      1.3
// @description  Automatically scroll to the next YouTube Shorts video after it ends.
// @author       ChatGPT, domenik1023
// @match        https://www.youtube.com/shorts/*
// @homepageURL  https://domenik1023.de
// @supportURL   https://github.com/domenik1023/Youtube-Shorts-Auto-Scroller/issues
// @updateURL    https://github.com/domenik1023/Youtube-Shorts-Auto-Scroller/raw/main/scroll.meta.js
// @downloadURL  https://github.com/domenik1023/Youtube-Shorts-Auto-Scroller/raw/main/scroll.user.js
// @grant        none
// ==/UserScript==

(function () {
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
        const video = document.querySelector('video');
        if (!video) return;

        removeLoop(video);
        startRemovingLoop(video);

        const goNext = () => {
            // Instant jump inside the Shorts scroller container
            const scroller = video.closest('#shorts-container');
            if (scroller) {
                scroller.scrollTop += window.innerHeight;
                scroller.dispatchEvent(new Event('scroll')); // Notify YouTube’s internal scroll listener
            } else {
                // Fallback: emulate Arrow-Down key as before
                ['keydown', 'keyup'].forEach(type =>
                    document.dispatchEvent(new KeyboardEvent(type, {
                        key: 'ArrowDown',
                        code: 'ArrowDown',
                        keyCode: 40,
                        which: 40,
                        bubbles: true,
                        cancelable: true
                    }))
                );
            }
        };

        // Fire once when the current video ends
        video.addEventListener('ended', () => setTimeout(goNext, 50), { once: true });

        // Keep wiping any loop attribute
        video.addEventListener('play', () => removeLoop(video));
        video.addEventListener('loadeddata', () => removeLoop(video));
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
