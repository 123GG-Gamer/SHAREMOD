// ==UserScript==
// @name         Hat Macro
// @description  JUST SIMPLE SKRIPT BY [GG]GAMER
// @version      v0.69.420
// @author       X-X | Splex#2228
// @match        *://*.moomoo.io/*
// @grant        none
// ==/UserScript==

const hatMacro = [
    {
        id: 6,
        name: "Soldier Helmet",
        price: 4000,
        code: "KeyC"
    },
    {
        id: 53,
        name: "Turret Gear",
        topSprite: true,
        price: 10000,
        code: "KeyK"
    },
    {
        id: 7,
        name: "Bull Helmet",
        price: 6000,
        code: "KeyJ"
    },
    {
        id: 40,
        name: "Tank Gear",
        price: 15000,
        code: "KeyZ"
    }
]


document.addEventListener("keydown", ({code}) => {
    for (let i = 0; i < hatMacro.length; i++) {
        hatMacro[i].code == code && window.storeEquip(hatMacro[i].id, 0)
    }
});
