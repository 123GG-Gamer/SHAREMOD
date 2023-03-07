// ==UserScript==
// @name         Shame Counter
// @description  JUST SIMPLE SKRIPT BY [GG]GAMER
// @version      v0.69.420
// @author       X-X | Splex#2228
// @match        *://*.moomoo.io/*
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @grant        none
// ==/UserScript==
/* global msgpack */

let gameTick = 0;
// Use Promise constructor to wait for the WebSocket connection to be established before resolving it
let ws = await new Promise(async (resolve) => {
    let { send } = WebSocket.prototype;

    WebSocket.prototype.send = function(...x) {
        // Call original WebSocket.send method
        send.apply(this, x);
        // Reset the patched send method
        this.send = send;
        // Patch the WebSocket instance to send binary data using msgpack
        this._send = function (...datas) {
            const [packet, ...data] = datas;
            this.send(new Uint8Array(Array.from(msgpack.encode([packet, data]))));
        }
        // Add an event listener to handle incoming WebSocket messages
        this.addEventListener("message", handleData);
        resolve(this);
    }
});

class ClownManager {
    constructor() {
        this.init();
    }

    onHealthUpdate(isDMG) {
        if (isDMG) {
            this.hitTime = gameTick;
        } else {
            if (gameTick - this.hitTime <= 1) {
                ++this.Count;
                this.onUpdate?.(this.Count)
            } else {
                // Decrease the clown count by 2 every second
                this.Count = Math.max(this.Count - 2, 0);
                this.onUpdate?.(this.Count);
            }
        }
    }

    init() {
        // Initialize the clown count to 0
        this.Count = 0;
        // Initialize the hit time to the current game tick
        this.hitTime = gameTick;
        this.State = 0;
        this.Timer = 0;
    }
}

const myPlayer = {
    sid: -1,
    health: 100,
    shame: new ClownManager(),
};
const clockImg = new Image();
clockImg.src = "https://media.discordapp.net/attachments/1082392671827525672/1082699961583538176/alarm_FILL0_wght400_GRAD0_opsz48.png?width=43&height=43"
clockImg.onload = function() {
    this.loaded = true;
    console.log(`url(${this.src})`);
}
myPlayer.shame.onUpdate = updateShameCounter;
function handleData({ data: DATA }) {
    // Parse the incoming WebSocket message using msgpack
    const [packet, data] = msgpack.decode(new Uint8Array(DATA));
    switch (packet) {
        case '1':
            // Store the player's session ID
            myPlayer.sid = data[0];
            break;
        case "33":
            // Increase the clown count and activate shame mode if the player collects a clown while the clown count is not 0
            gameTick++
            for (let i = 0; i < data[0].length; i+= 13) {
                if (data[0][i] === myPlayer.sid && data[0][i + 9] == 45 && myPlayer.shame.Count) {
                    myPlayer.shame.State = 1;
                    myPlayer.shame.Timer = Date.now() + 30000;
                    myPlayer.shame.Count = 0;
                    const shameCounter = document.getElementById('shameCounter');
                    // Set the shame counter element's background image to the shame hat
                    if (clockImg.loaded) shameCounter.style.backgroundImage = `url(${clockImg.src})`;
                }
            }
            if (myPlayer.shame.State === 1) {
                updateShameCounter();
            }
            break;
        case 'h':
            // Update the player's health and clown count
            if (data[0] === myPlayer.sid) {
                myPlayer.shame.onHealthUpdate(data[1] < myPlayer.health);
                myPlayer.health = data[1];
            }
            break;
        case "11":
            // Reset the clown count
            myPlayer.shame.init();
            break;
        case "pp":
            break;
    }
}

// Create a style element and set its type to 'text/css'
const style = document.createElement('style');
style.type = 'text/css';

// Add the CSS rules to the style element
style.innerHTML = `
  .redAnimation {
    animation-name: redPulse;
    animation-duration: 1s;
    animation-iteration-count: 1;
  }

  .greenAnimation {
    animation-name: greenPulse;
    animation-duration: 1s;
    animation-iteration-count: 1;
  }

  @keyframes redPulse {
    from { background-color: rgba(255, 0, 0, 0.5); }
    to { background-color: rgba(0, 0, 0, 0.25); }
  }

  @keyframes greenPulse {
    from { background-color: rgba(0, 255, 0, 0.5); }
    to { background-color: rgba(0, 0, 0, 0.25); }
  }
`;

// Add the style element to the head of the document
document.head.appendChild(style);

// Select the #topInfoHolder element
const topInfoHolder = document.getElementById('topInfoHolder');

// Create a new element for the #shameCounter
const shameCounter = document.createElement('div');

// Set the ID and class for the #shameCounter
shameCounter.id = 'shameCounter';
shameCounter.className = 'resourceDisplay';
shameCounter.style.backgroundImage = 'url(../img/hats/hat_45.png)';

// Set the initial value and inline styles for the #shameCounter
shameCounter.innerText = '0';
shameCounter.style.right = '72px';
shameCounter.style.marginTop = '10px';
shameCounter.style.color = '#fff';
shameCounter.style.fontSize = '28px';
shameCounter.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
shameCounter.style.webkitBorderRadius = '4px';
shameCounter.style.mozBorderRadius = '4px';
shameCounter.style.borderRadius = '4px';

// Append the #shameCounter element to the #topInfoHolder element
topInfoHolder.appendChild(shameCounter);

function updateShameCounter(newValue) {
    // Get the shame counter element
    const shameCounter = document.getElementById('shameCounter');
    // Check if the player has a shame hat
    if (myPlayer.shame.State === 1) {

        // Check if the shame timer has reached 0
        if (myPlayer.shame.Timer < Date.now()) {
            // Reset the shame timer and count, and remove the shame hat
            myPlayer.shame.init();
            shameCounter.style.backgroundImage = 'url(../img/hats/hat_45.png)';
            shameCounter.innerText = myPlayer.shame.Count;
        } else {
            // Calculate the remaining time until the shame timer reaches 0
            const remainingTime = Math.ceil((myPlayer.shame.Timer - Date.now()) / 1000);

            // Set the shame counter element's text to the remaining time
            shameCounter.innerText = remainingTime;
        }
    } else {
        const shameCounter = document.getElementById('shameCounter');
        const currentValue = parseInt(shameCounter.innerText);

        if (newValue > currentValue) {
            // Add a red animation when the value increases
            shameCounter.classList.add('redAnimation');
            setTimeout(() => {
                shameCounter.classList.remove('redAnimation');
            }, 1000);
        } else if (newValue < currentValue) {
            // Add a green/lime animation when the value decreases
            shameCounter.classList.add('greenAnimation');
            setTimeout(() => {
                shameCounter.classList.remove('greenAnimation');
            }, 1000);
        }

        shameCounter.innerText = newValue;
    }
}
