// ==UserScript==
// @name        MooScript
// @version     1.7
// @description Best leading hack for moomoo.io
// @author      Bl4cky
// @match       *://*.moomoo.io/*
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require     https://mooscriptrequire.polat-isikisik.repl.co/variables.js
// @require     https://mooscriptrequire.polat-isikisik.repl.co/canvas2Dvariables.js
// @require     https://mooscriptrequire.polat-isikisik.repl.co/websocketvariables.js
// @require     https://mooscriptrequire.polat-isikisik.repl.co/arrayvariables.js
// @require     https://mooscriptrequire.polat-isikisik.repl.co/functionvariables.js
// @run-at      document-start
// ==/UserScript==
var skinConditios;
var tailConditios;
var canStore;
if (typeof (Storage) !== "undefined") {
    canStore = true;
}
function saveVal(name, val) {
    if (canStore) localStorage.setItem(name, val);
}
function deleteVal(name) {
    if (canStore) localStorage.removeItem(name);
}
function getSavedVal(name) {
    if (canStore) return localStorage.getItem(name);
    return null;
}
var utils = {
    lineInRect: function (recX, recY, recX2, recY2, x1, y1, x2, y2) {
        var minX = x1;
        var maxX = x2;
        if (x1 > x2) {
            minX = x2;
            maxX = x1;
        }
        if (maxX > recX2) maxX = recX2;
        if (minX < recX) minX = recX;
        if (minX > maxX) return false;
        var minY = y1;
        var maxY = y2;
        var dx = x2 - x1;
        if (Math.abs(dx) > 0.0000001) {
            var a = (y2 - y1) / dx;
            var b = y1 - a * x1;
            minY = a * minX + b;
            maxY = a * maxX + b;
        }
        if (minY > maxY) {
            var tmp = maxY;
            maxY = minY;
            minY = tmp;
        }
        if (maxY > recY2) maxY = recY2;
        if (minY < recY) minY = recY;
        if (minY > maxY) return false;
        return true;
    },
    getAngleDist: function (a, b) {
        var p = Math.abs(b - a) % (Math.PI * 2);
        return (p > Math.PI ? (Math.PI * 2) - p : p);
    },
}
var isSandbox = location.href.includes("sandbox");
window.ws = null;
[undefined, null].includes(getSavedVal("force")) && saveVal("force", false);
!getSavedVal("mooscript_version") && saveVal("mooscript_version", GM_info.script.version);
for (let i in store) {
    let array = [];
    for (let a in store[i]) {
        array[store[i][a].id] = store[i][a];
    }
    store[i] = array;
};

function createHook(target, prop, callback) {
    const symbol = Symbol(prop);
    Object.defineProperty(target, prop, {
        get() {
            return this[symbol];
        },
        set(value) {
            callback(this, symbol, value);
        },
        configurable: true
    })
}
if (localStorage.getItem("force") == "true") {
    createHook(Object.prototype, "maxPlayers", function(that, symbol, value) {
        delete Object.prototype.maxPlayers;
        that.maxPlayers = value + 10;
    });
}
createHook(Object.prototype, "groups", function(that, symbol, value) {
    delete Object.prototype.groups;
    that.groups = value;
    for (let values of that.groups) {
        if (values.limit != undefined && isSandbox) {
            values.limit = 99;
        }
    }
});
for (let values of items.groups) {
    if (values.limit != undefined && isSandbox) {
        values.limit = 99;
    }
}
createHook(Object.prototype, "list", function(that, symbol, value) {
    delete Object.prototype.list;
    that.list = value;
    for (let values of that.list) {
        if (values.group.limit != undefined && isSandbox) {
            values.group.limit = 99;
        }
    }
});
for (let values of items.objects) {
    if (values.group.limit != undefined && isSandbox) {
        values.group.limit = 99;
    }
}
var mooscript_user = JSON.parse(getSavedVal("mooscript_user"));
var mooscript_server = new WebSocket("wss://mooscriptws.glitch.me");
var mooscript_history = {
    "1.7": ["Returned to better version"],
    "1.6": ["Added auto emp module", "Fixed auto insta", "Defined auto fast heal again", "Defined auto chat and coordinates modules"],
    "1.5": ["Added building health bars", "Added turret shoot rate bars", "Added emp while not moving"],
    "1.4": ["Added auto-pilot", "Optimized packets", "Updated no safe replacer", "Added auto offense hat", "Made auto offense hat working"],
    "1.3": ["Tried to fix bugs", "Fixed instas", "Added more modules", "Optimized packets", "Defined no safe replacer"],
    "1.2": ["Fixed auto aim", "Fixed auto functions", "Fixed Auto Placer module", "Optimized packets"],
    "1.1": ["Defined Auto Trap Breaker module", "Fixed Projectile Blocker"],
    "1.0": ["Fixed force connection", "Optimized packets", "Changed item limits (In game codes too)", "Updated kicked/server full alerts", "Added categories", "Defined Auto Replacer module"],
    "0.9": ["Special thanks to <a class = 'settingRadio' href = 'https://www.youtube.com/channel/UCgsq0lshxEKDH37lGvD37uQ'>Dayte</a> for making special logo", "Optimized packets"],
    "0.8": ["Created database for accounts", "Had a mix with 'MooMod'"],
    "0.7": ["Had a mix with 'Cloudy Mod'", "Added connection to MooScript's special server", "Added account system", "Added account menu", "Fixed menu bugs"],
    "0.6": ["Added projectile blocker", "Added object mapper", "Added auto biome hat"],
    "0.5": ["Had a mix with 'Moomoo Enhancement Script'", "Added tracers", "Added toggles to menu"],
    "0.4": ["Added bull/plague/tank click"],
    "0.3": ["Added visuals", "Improved auto healer"],
    "0.2": ["Added macro placers", "Added auto healer", "Added kick counter"],
    "0.1": ["The script has been created.", "Added WS", "Added main stuffs"],
};
var ranks = {
    moderator: "???",
    admin: "???",
    helper2: "???",
    helper: "???",
};
var featuredMooHackers = [
    ["Bl4cky", "https://www.youtube.com/channel/UCg1OAeWIUtyW6XQ-u1H1psg", "moderator"],
    ["[GG]Gamer", "https://www.youtube.com/@GGGAMER_Yt", "admin"],
    ["Dayte", "https://www.youtube.com/channel/UCgsq0lshxEKDH37lGvD37uQ", "helper2"],
    ["typedecker", "", "helper"],
];
var moohacker = featuredMooHackers.randomChoose();
var sP = [], sPManager = {
    add: function(packet, action) {
        sP.push({
            packet: packet,
            action: action,
        })
    }
};
var darkOutlineColor = "#3d3f42";
var elements = {
    gameCanvas: null,
    mapDisplay: null,
    openAccountMenu: null,
    serverAlert: null,
    accountSign: null,
    equipChangeAlert: null,
}, draw = {
    gameCanvas: null,
    mapDisplay: null,
};
var screen = {
    max: {
        width: 783,
        height: 665,
    },
    current: {
        width: 783,
        height: 665,
    },
};
var mouse = {
    x: 0,
    y: 0,
    direction: function() {
        return Math.atan2(mouse.y - screen.current.height / 2, mouse.x - screen.current.width / 2);
    },
    down: false,
    which: null,
};
var script = {
    start: false,
    projectile_blocker: {
        timer: 100,
        active: false,
    },
    insta_kill: {
        working: false,
        toggle: false
    },
    killer_hit: {
        working: false,
    },
    killer_shot: {
        working: false,
    },
    object_map: {
        targets: [],
    },
    auto_hit_toggle: false,
    auto_placer: {
        timer: 0
    },
    auto_grind: {
        timer: 0,
        hit_started: 0,
        hit_angle: false,
    },
    auto_pilot: [false, false],
    nearest: {
        player: [],
        enemy: [],
        teammate: [],
        building: [],
    },
};
var keyboard;
var config = JSON.parse(localStorage.getItem("mooscript_config")) || {};
var camX, camY;
var tickCount = 0;
var packetSystem = {
    perSec: {
        resetTime: 0,
        current: 0,
        max: 120,
        resetAt: 1000,
    },
    perMin: {
        resetTime: 0,
        current: 0,
        max: 5600,
        resetAt: 60000,
    },
    kickRate: function() {
        return {
            total: Math.max(Math.min(this.perMin.current / this.perMin.max, 1), Math.min(this.perSec.current / this.perSec.max, 1)),
            perMin: Math.min(this.perMin.current / this.perMin.max, 1),
            perSec: Math.min(this.perSec.current / this.perSec.max, 1),
        };
    }
};
var auto;
var game;
var macro = {
    placer: {
        keys: {
            "q": 0,
            "v": 2,
            "n": 3,
            "f": 4,
            "h": 5,
        },
        toggle: false,
        item: null,
    },
    hats: {
        keys: {},
        equiped: 0,
    },
};
var user;
var message_user = {
    lastTry: {
        equip: {
            skinIndex: 0,
            tailIndex: 0,
        },
        buy: {
            skinIndex: 0,
            tailIndex: 0,
        },
    },
    skins: [],
    tails: [],
};
var inv = {
    weapons: [0],
    items: [0, 3, 6, 10],
    itemCounts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};
var myPlayer = null,
    myPlayerSid = null;
var players = [],
    buildings = [],
    projectiles = [];
var alliancePlayers = [];
var playerManager = {
    add: function(datas) {
        var player = new Player();
        Object.assign(player, datas);
        players.push(player);
        return player;
    },
    removeBySid: function(sid) {
        return players.splice(players.indexOf(players.find(tmpObj => tmpObj.sid == sid)), 1);
    },
    removeByObject: function(object) {
        return players.splice(players.indexOf(object), 1);
    },
};
var buildingManager = {
    add: function(datas) {
        var building = new Build();
        Object.assign(building, datas);
        if (building.id) {
            if (!players.find(tmpObj => tmpObj.sid == this.ownerSid)) {
                playerManager.add({
                    sid: building.ownerSid,
                    isVisible: false
                });
            }
            Object.assign(building, items.objects[building.id]);
            building.maxHealth = building.health;
            if(building.id == 17){
                building.shootRate = 2200;
                building.shootCount = 0;
                building.predictiveShootCount = 0;
            }
        }
        buildings.push(building);
        return building;
    },
    checkItemLocation: function(x, y, scale, idk1, id, obj, l) {
        for (let tmpObj of buildings) {
            let cantPlaceScale = tmpObj.blocker ? tmpObj.blocker : tmpObj.scale * (tmpObj.resourceType == "wood" ? 0.6 : 1);
            if (tmpObj.isActive && tmpObj.to({
                x,
                y
            }).distance < scale + cantPlaceScale) return false;
        }
        return !(!obj && 18 != id && y >= 14400 / 2 - 724 / 2 && y <= 14400 / 2 + 724 / 2);
    },
    removeAllBuildings: function(sid) {
        var removeList = [];
        for (var tmpObj of buildings) {
            if (tmpObj.isActive && tmpObj.owner && tmpObj.ownerSid == sid) {
                removeList.push(tmpObj);
            }
        }
        removeList.forEach(tmpObj => buildingManager.removeByObject(tmpObj));
        return removeList;
    },
    removeBySid: function(sid) {
        return buildings.splice(buildings.indexOf(buildings.find(tmpObj => tmpObj.sid == sid)), 1);
    },
    removeByObject: function(object) {
        return buildings.splice(buildings.indexOf(object), 1);
    },
};
var projectileManager = {
    add: function(datas) {
        let projectile = new Projectile();
        Object.assign(projectile, datas, {
            x: datas.startX,
            y: datas.startY
        }, items.projectiles[projectile.index]);
        if ([1000, 1200, 1400, 700].includes(projectile.range)) {
            var projectileID = projectile.index == 0 ? 9 : projectile.index == 1 ? 53 : projectile.index == 2 ? 12 : projectile.index == 3 ? 13 : projectile.index == 5 && (15);
            var pos = {
                x: projectile.startX - Math.cos(projectile.dir) * 35,
                y: projectile.startY - Math.sin(projectile.dir) * 35,
            };
            let dist = 70;
            players.filter(tmpObj => tmpObj.to(pos).distance <= dist && (projectile.index == 1 ? tmpObj.skinIndex == 53 : tmpObj.weaponIndex == projectileID)).forEach(tmpObj => {
                projectile.ownerSid = tmpObj.sid
                if (projectile.index == 1) tmpObj.shootCount = tmpObj.shootRate;
                else tmpObj.reloads[projectileID] = items.weapons[projectileID].speed;
            });
        }
        myPlayerSid && (myPlayer = players.find(tmpObj => tmpObj.sid == myPlayerSid));
        let removeFromSP = [];
        sP.forEach((each, index) => {
            if (each.packet == "18") {
                each.action() && removeFromSP.push(index);
            }
        });
        projectiles.push(projectile);
        return projectile;
    },
    removeBySid: function(sid) {
        return projectiles.splice(projectiles.indexOf(projectiles.find(tmpObj => tmpObj.sid == sid)), 1);
    },
    removeByObject: function(object) {
        return projectiles.splice(projectiles.indexOf(object), 1);
    },
};
var core;
var oldAimDirection = 0;
var oldMoveDirection = 0;
var canAllowNewAuto;
document.addEventListener('DOMContentLoaded', function() {
    appendStyles();
    deleteElements();
    editElements();
    appendElements();
    fireContentLoadedEvent();
}, false);

function fireContentLoadedEvent() {
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    window._alert = window.alert;
    window.alert = function(message) {
        if (message.includes("Server is already full.")) {
            disconnectAlert(false);
        } else this._alert(message);
    }
    function handleWebsocket(method) {
        const set = Object.getOwnPropertyDescriptor(WebSocket.prototype, method).set;
        Object.defineProperty(WebSocket.prototype, method, {
            set(callback) {
                return set.call(this, new Proxy(callback, {
                    apply(target, _this, args) {
                        disconnectAlert(true);
                        return target.apply(_this, args);
                    }
                }))
            }
        })
    }
    handleWebsocket("onclose");
    handleWebsocket("onerror");

    if (localStorage.getItem("force") == "true") {
        localStorage.setItem("force", false);
        document.getElementsByClassName("menuHeader")[0].innerHTML = `Servers <span style="color: red;">Force (${location.href.split("server=")[1]})</span>`;
    }
    Object.keys(elements).forEach(key => {
        elements[key] = document.getElementById(key);
    });
    Object.keys(draw).forEach(key => {
        draw[key] = elements[key].getContext('2d');
    });
    script.updateDatas = function(player) {
        script.nearest.player.push(player);
        player != myPlayer && ((!myPlayer.team.id || player.team.id != myPlayer.team.id) ? script.nearest.enemy.push(player) : script.nearest.teammate.push(player));
    };
    canAllowNewAuto = () => {
        return Object.values(script).filter(ez => ez.working != undefined).every(obj => {
            if (obj.working) return false;
            else return true;
        });
    }
    keyboard = {
        down: function(keyDatas) {
            let quickFunc = {
                r: () => {
                    if (config.insta_kill.enabled) {
                        script.insta_kill.toggle = !script.insta_kill.toggle;
                    }
                },
                Escape: () => {
                    if (elements.openAccountMenu.toggle) {
                        elements.openAccountMenu.onclick();
                    }
                },
            };
            var {
                key
            } = keyDatas;
            var placer = macro.placer.keys[key];
            placer != undefined && (macro.placer.item = placer, macro.placer.toggle = true);
            quickFunc[key] && quickFunc[key]();
        },
        up: function(keyDatas) {
            var {
                key
            } = keyDatas;
            var placer = macro.placer.keys[key];
            placer != undefined && (macro.placer.item = null, macro.placer.toggle = false);
        },
    };
    skinConditios = function(...args){
        for(let skin of args){
            if(user.skins[skin]) return skin;
        }
    }
    tailConditios = function(...args){
        for(let tail of args){
            if(user.tails[tail]) return tail;
        }
    }
    game = {
        place: function(item, direction = mouse.direction(), loop = 1) {
            if(packetSystem.perSec.max - packetSystem.perSec.current <= 12) return;
            if (!inv.items?.includes(item)) return;
            let objectData = items.objects[item];
            if(item > 2 && !myPlayer.canBuild(objectData, direction)) return;
            let canPlace = true;
            for (let index = 0; index < objectData.req.length;) {
                let datas = [objectData.req[index], objectData.req[index + 1]];
                if (user[datas[0]] < datas[1]) {
                    canPlace = false;
                    break;
                }
                index += 2;
            }
            isSandbox && (canPlace = true);
            canPlace && objectData.group.limit && (canPlace = (inv.itemCounts[objectData.group.id] || 0) < objectData.group.limit);
            if (loop && canPlace) {
                send('5', item);
                send('c', 1, direction);
                send('5', user.weaponIndex, true);
                loop > 1 ? game.place(item, direction, Math.max(1, loop - 1)) : auto.aim.allowCount && typeof auto.aim.direction == "function" && send('c', 0, auto.aim.direction());
            }
        },
        choose: function(index, isWeapon) {
            (isWeapon ? inv.weapons.includes(index) : inv.items.includes(index)) && user[isWeapon ? "weaponIndex" : "buildIndex"] != index && send('5', index, isWeapon);
        },
        upgrade: function(index, isWeapon) {
            !(isWeapon ? inv.weapons.includes(index) : inv.items.includes(index)) && send('6', index + (isWeapon ? 0 : 16));
        },
        hit: function(direction, toggle) {
            send('c', toggle, direction);
        },
        move: function(direction) {
            oldMoveDirection != direction && (oldMoveDirection = direction, send("33", direction));
        },
        watch: function(direction) {
            !(Math.abs(oldAimDirection - direction) <= 35 * Math.PI / 180) && (oldAimDirection = direction, send("2", direction));
        },
        chat: function(text) {
            text = text.slice(0, 30);
            send('ch', text);
        },
        buy: function(index, isTail) {
            if(message_user.lastTry.buy[(isTail ? "tail" : "skin") + "Index"] == index) return;
            if(!message_user[isTail ? "tails" : "skins"][index] && store[isTail ? "tails" : "skins"][index].price <= user.points) {
                send('13c', 1, index, isTail);
                return true;
            }
        },
        equip: function(index, isTail) {
            if(message_user.lastTry.equip[(isTail ? "tail" : "skin") + "Index"] == index) return;
            if (index == 0){
                return user[(isTail ? "tail" : "skin") + "Index"] != index && send('13c', 0, 0, isTail);
            }
            if (myPlayer.shame.count == "-" && !isTail) return;
            game.buy(index, isTail);
            message_user[isTail ? "tails" : "skins"][index] && user[(isTail ? "tail" : "skin") + "Index"] != index && (send('13c', 0, index, isTail),
                                                                                                                       isTail && user.tailIndex == 11 && index != 11 && send('13c', 0, 0, 1));
        },
        killer_hit: function(){
            if(script.killer_hit.working) return;
            if (!config.auto_killer_hit.enabled) return;
            if (auto.equip.allowCount) return;
            if (!script.nearest.enemy.length) return;
            let checkRange = (other, weapon) => {
                return myPlayer.to(other).distance <= items.weapons[weapon].range + 32 * 1.8;
            };
            let calculateDamages = (...args) => {
                let total = 0;
                for(let arg of args){
                    total += items.weapons[arg[0]].dmg * (store.skins[arg[1]]?.dmgMultO || 1);
                }
                return total
            };
            for(let enemy of script.nearest.enemy){
                let enemyDmgMult = (store.skins[enemy.hat]?.dmgMult || 1);
                let skin = skinConditios(7 + Number(enemy.skinIndex == 11) * 14, 6, 0);
                if(!myPlayer.reloads[10] && inv.weapons[1] == 10 && checkRange(enemy, 10) && enemy.health <= calculateDamages([10, skin]) * enemyDmgMult){
                    script.killer_hit.working++;
                    return game.bull_hit(true, () => {
                        return myPlayer.to(enemy).direction;
                    }, () => {
                        script.killer_hit.working--;
                    }, skin);
                } else if(checkRange(enemy, inv.weapons[0]) && enemy.health <= calculateDamages([inv.weapons[0], skin]) * enemyDmgMult){
                    if (myPlayer.reloads[inv.weapons[0]]) return;
                    script.killer_hit.working++;
                    return game.bull_hit(false, () => {
                        return myPlayer.to(enemy).direction;
                    }, () => {
                        script.killer_hit.working--;
                    }, skin);
                }
            }
        },
        killer_shot: function(){
            if(script.killer_shot.working) return;
            if (auto.equip.allowCount) return;
            if (!script.nearest.enemy.length) return;
            if (!inv.weapons[1] || items.weapons[inv.weapons[1]].projectile == undefined) return;
            if (myPlayer.reloads[inv.weapons[1]]) return;
            for(let enemy of script.nearest.enemy){
                if(myPlayer.canShotTo(enemy, items.weapons[inv.weapons[1]].projectile)){
                    script.killer_shot.working++;
                    auto.choose.start(() => {
                        return inv.weapons[1];
                    }, true);
                    auto.aim.start();
                    auto.aim.direction = () => {
                        return myPlayer.to(enemy).direction;
                    }
                    game.watch(auto.aim.direction());
                    auto.hit.start();
                    return sPManager.add("18", () => {
                        if (myPlayer.reloads[inv.weapons[1]]) {
                            auto.choose.stop();
                            auto.hit.stop();
                            auto.aim.stop();
                            script.killer_shot.working--;
                            return true;
                        }
                    });
                }
            }
        },
        insta_kill: function() {
            if(!config.insta_kill.enabled) return;
            if(!script.insta_kill.toggle) return
            if (myPlayer.reloads[inv.weapons[0]]) return;
            let auto_canInsta = (weapon, ...indexs) => {
                return config.insta_kill.auto_insta_kill ? script.nearest.enemy.length && myPlayer.to(script.nearest.enemy[0]).distance <= items.weapons[weapon].range + 32 * 1.8 && myPlayer.canShotTo(script.nearest.enemy[0], ...indexs) : true;
            };
            if (inv.weapons[1]) {
                if([undefined, null, 11, 14].includes(inv.weapons[1])) return;
                if (myPlayer.reloads[inv.weapons[1]]) return;
                if (inv.weapons[1] == 10) {
                    if(!user.skins[53] && user.points < 10000) return;
                    if (myPlayer.shootCount) return;
                    if(config.insta_kill.auto_insta_kill){
                        if (!auto_canInsta(10, 1)) return;
                        if (![4, 5].includes(inv.weapons[0])) return;
                        if (script.nearest.enemy[0].skinIndex == 6) return;
                    }
                    let removeExtraBull = myPlayer.weapons[0].variantIndex > 0;
                    if (removeExtraBull) {
                        script.insta_kill.toggle = false;
                        auto.equip.start();
                        game.equip(53);
                        game.equip(0, 1);
                        auto.choose.start(() => {
                            return inv.weapons[1];
                        }, true);
                        auto.aim.start();
                        auto.aim.direction = () => {
                            return myPlayer.to(script.nearest.enemy[0]).direction;
                        }
                        game.watch(auto.aim.direction());
                        auto.hit.start();
                        sPManager.add("7", () => {
                            if (myPlayer.reloads[inv.weapons[1]]) {
                                auto.choose.stop();
                                auto.hit.stop();
                                auto.equip.stop();
                                auto.aim.stop();
                                game.bull_hit(false, () => {
                                    return myPlayer.to(script.nearest.enemy[0]).direction;
                                }, function() {
                                    if (myPlayer.reloads[inv.weapons[0]]) {
                                        auto.choose.stop();
                                        auto.hit.stop();
                                        auto.aim.stop();
                                        auto.equip.stop();
                                        return true;
                                    }
                                });
                                return true;
                            }
                        });
                    } else {
                        script.insta_kill.toggle = false;
                        game.bull_hit(true, () => {
                            return myPlayer.to(script.nearest.enemy[0]).direction;
                        }, function() {
                            if (myPlayer.reloads[inv.weapons[1]]) {
                                auto.choose.stop();
                                auto.hit.stop();
                                auto.equip.stop();
                                auto.aim.stop();
                                game.bull_hit(false, () => {
                                    return myPlayer.to(script.nearest.enemy[0]).direction;
                                }, function() {
                                    if (myPlayer.reloads[inv.weapons[0]]) {
                                        auto.choose.stop();
                                        auto.hit.stop();
                                        auto.aim.stop();
                                        game.equip(53);
                                        sPManager.add("33", () => {
                                            if (myPlayer.shootCount) {
                                                auto.equip.stop();
                                                return true;
                                            }
                                        });
                                        return true;
                                    }
                                });
                                return true;
                            }
                        });
                    }
                } else if (auto_canInsta(inv.weapons[0], 1, items.weapons[inv.weapons[1]].projectile)) {
                    script.insta_kill.toggle = false;
                    game.bull_hit(false, () => {
                        return myPlayer.to(script.nearest.enemy[0]).direction;
                    }, function() {
                        if (myPlayer.reloads[inv.weapons[0]]) {
                            auto.choose.stop();
                            auto.aim.direction = () => {
                                return myPlayer.to(script.nearest.enemy[0]).direction;
                            };
                            game.watch(auto.aim.direction());
                            auto.choose.start(() => {
                                return inv.weapons[1];
                            }, true);
                            game.equip(53);
                            sPManager.add("18", () => {
                                if (myPlayer.reloads[inv.weapons[1]]) {
                                    auto.choose.stop();
                                    auto.hit.stop();
                                    auto.equip.stop();
                                    auto.aim.stop();
                                    return true;
                                }
                            });
                            return true;
                        }
                    });
                }
            } else if (true) {}
        },
        bull_hit: function(hammer, dir, action, skin) {
            hammer = hammer && inv.weapons[1] == 10;
            if (myPlayer.reloads[inv.weapons[Number(hammer)]]) return;
            auto.equip.start();
            game.equip(skin == undefined ? 7 : skin);
            game.equip(0, 1);
            auto.choose.start(() => {
                return inv.weapons[Number(hammer)];
            }, true);
            auto.aim.start();
            auto.aim.direction = dir;
            game.watch(auto.aim.direction());
            auto.hit.start();
            sPManager.add("7", () => {
                if (myPlayer.reloads[inv.weapons[Number(hammer)]]) {
                    if (typeof action == "function") action();
                    else {
                        auto.choose.stop();
                        auto.hit.stop();
                        auto.equip.stop();
                        auto.aim.stop();
                    }
                    return true;
                }
            });
        },
        tank_hit: function(hammer, dir, action, skin) {
            hammer = hammer && inv.weapons[1] == 10;
            if (myPlayer.reloads[inv.weapons[Number(hammer)]]) return;
            auto.equip.start();
            game.equip(skin == undefined ? 40 : skin);
            auto.choose.start(() => {
                return inv.weapons[Number(hammer)];
            }, true);
            auto.aim.start();
            auto.aim.direction = dir;
            game.watch(auto.aim.direction());
            auto.hit.start();
            sPManager.add("7", () => {
                if (myPlayer.reloads[inv.weapons[Number(hammer)]]) {
                    if (typeof action == "function") action();
                    else {
                        auto.choose.stop();
                        auto.hit.stop();
                        auto.equip.stop();
                        auto.aim.stop();
                    }
                    return true;
                }
            });
        },
    };
    auto = {
        aim: {
            allowCount: 0,
            directions: [],
            direction: null,
            start: function() {
                auto.aim.allowCount++;
            },
            stop: function() {
                auto.aim.directions.pop();
                auto.aim.direction = auto.aim.directions[auto.aim.directions.length - 1];
                auto.aim.allowCount--;
                auto.aim.allowCount < 0 && (auto.aim.allowCount = 0);
            },
        },
        hit: {
            allowCount: 0,
            start: function() {
                if (!auto.hit.allowCount) {
                    send("7", 1);
                }
                auto.hit.allowCount++;
            },
            stop: function() {
                if (auto.hit.allowCount == 1) {
                    send("7", 1);
                }
                auto.hit.allowCount--;
                auto.hit.allowCount < 0 && (auto.hit.allowCount = 0);
            },
        },
        choose: {
            allowCount: 0,
            items: [],
            item: undefined,
            start: function(index, isWeapon) {
                game.choose(index, isWeapon);
                auto.choose.item = function() {
                    return {
                        index: index(),
                        isWeapon: isWeapon,
                    };
                };
                auto.choose.items.push(auto.choose.item);
                auto.choose.allowCount++;
            },
            stop: function() {
                auto.choose.items.pop();
                auto.choose.item = auto.choose.items[auto.choose.items.length - 1];
                auto.choose.allowCount--;
                auto.choose.allowCount < 0 && (auto.choose.allowCount = 0);
            },
        },
        equip: {
            allowCount: 0,
            start: function() {
                auto.equip.allowCount++;
            },
            stop: function() {
                auto.equip.allowCount--;
                auto.equip.allowCount < 0 && (auto.equip.allowCount = 0);
            },
        },
    };
    core = {
        handleWS: {
            manage: function({
                data: x
            }) {
                let [packet, data] = msgpack.decode(new Uint8Array(x));
                let parent = core.handleWS;
                myPlayerSid && (myPlayer = players.find(tmpObj => tmpObj.sid == myPlayerSid));
                parent[packet] && parent[packet](...data);
                myPlayerSid && (myPlayer = players.find(tmpObj => tmpObj.sid == myPlayerSid));
                let removeFromSP = [];
                sP.forEach((each, index) => {
                    if (each.packet == packet && packet != "18") {
                        each.action() && removeFromSP.push(index);
                    }
                });
                removeFromSP.forEach(index => sP.splice(index, 1));
            },
            "io-init": function() {
                console.log("connected");
                document.addEventListener("keydown", keyDatas => {
                    if (document.getElementById("allianceMenu").style.display == "block" || document.getElementById("chatHolder").style.display == "block") return;
                    keyboard.down(keyDatas);
                });
                document.addEventListener("keyup", keyDatas => {
                    keyboard.up(keyDatas);
                });
                screen.current.width = elements.gameCanvas.width;
                screen.current.height = elements.gameCanvas.height;
                $(window).resize(function() {
                    screen.current.width = elements.gameCanvas.width;
                    screen.current.height = elements.gameCanvas.height;
                    let mapDisplay = document.getElementById("mapDisplay").getBoundingClientRect();
                    for (let target of script.object_map.targets) {
                        $(target[0]).css("left", mapDisplay.x + target[1][0]);
                        $(target[0]).css("top", mapDisplay.y + target[1][1]);
                    }
                });
                elements.gameCanvas.addEventListener("mousemove", mouse2 => {
                    if (mouse2.auto) return;
                    mouse.x = mouse2.clientX;
                    mouse.y = mouse2.clientY;
                });
                elements.gameCanvas.addEventListener("mousedown", ({
                    button
                }) => {
                    if (!mouse.down) {
                        mouse.down = true;
                        mouse.which = button;
                    }
                });
                elements.gameCanvas.addEventListener("mouseup", () => {
                    if (mouse.down) {
                        mouse.down = false;
                        mouse.which = null;
                    }
                });
            },
            "d": function() {
                disconnectAlert(true);
            },
            "1": function(sid) {
                if (!myPlayerSid) {
                    update.frame.action();
                    user = Object.assign(new Player(), {
                        food: 100,
                        wood: 100,
                        stone: 100,
                        points: 100,
                        kills: 0,
                    });
                    myPlayerSid = sid;
                    myPlayer = playerManager.add({
                        sid: myPlayerSid
                    });
                }
                Object.assign(myPlayer, {
                    alive: true,
                    forcePos: false,
                    isVisible: true,
                });
            },
            "2": function(data, isMe) {
                let tempObj = players.find(tmpObj => data[1] === tmpObj.sid)
                if (!tempObj) tempObj = playerManager.add({
                    id: data[0],
                    sid: data[1]
                }).setData(data);
                else tempObj.setData(data);
                myPlayerSid && (myPlayer = players.find(tmpObj => tmpObj.sid == myPlayerSid));
                if (data[1] == myPlayer.sid) {
                    camX = myPlayer.smooth.x;
                    camY = myPlayer.smooth.y;
                }
            },
            "ch": function(sid, message) {
                if (sid == myPlayerSid) {}
            },
            "18": function(startX, startY, dir, range, speed, index, layer, sid) {
                sPManager.add("33", () => {
                    projectileManager.add({
                        startX,
                        startY,
                        dir,
                        range,
                        speed,
                        index,
                        layer,
                        sid,
                    });
                    return true;
                });
            },
            "19": function(sid, range) {
                let projectile = projectiles.find(obj => obj.sid == sid);
                if (projectile) projectile.range = range;
            },
            "7": function(sid, didHit, weaponIndex) {
                let tempObj = players.find(e => e.sid == sid);
                if (!tempObj) return;
                tempObj.gather(weaponIndex, didHit);
            },
            "h": function(sid, newValue) {
                let tmpObj = players.find(e => e.sid == sid);
                if (!tmpObj) return;
                let difference = newValue - tmpObj.health;
                tmpObj.changeHealth(newValue);
                myPlayerSid && (myPlayer = players.find(player => player.sid == myPlayerSid));
                let possibleDamages = [45, 49.50000000000001, 53.099999999999994, 10, 11, 11.799999999999999, 35, 26.25, 52.5, 30, 30 * 0.75, 25];
                let maxHeal = function(damage = 100 - myPlayer.health) {
                    game.place(inv.items[0], null, Math.ceil(damage / items.objects[inv.items[0]].consume));
                    interval && clearInterval(interval);
                };
                if (tmpObj == myPlayer && myPlayer.shame.count != "-" && myPlayer.health < 100) {
                    if(!interval){
                        var interval = setInterval(() => {
                            let now = Date.now();
                            if (myPlayer.alive && myPlayer.health < 100 && myPlayer.shame.count != "-") {
                                if (now - myPlayer.last.bleed.time > 120) {
                                    maxHeal();
                                };
                            } else clearInterval(interval);
                        }, 10);
                    }
                    !config.auto_heal.enabled && clearInterval(interval);
                    if(myPlayer.shame.count < 5){
                        if (config.auto_fast_heal.enabled && possibleDamages.includes(-difference) && script.nearest.enemy.length && myPlayer.to(script.nearest.enemy[0]).distance < 300) {
                            maxHeal(Math.min(100-myPlayer.health, 60));
                        } else if(myPlayer.health <= 53.5375) maxHeal(Math.min(100-myPlayer.health, 60));
                    }
                }
            },
            "8": function(dir, objSid){
                let tmpObj = buildings.find(({sid}) => sid == objSid);
                if(!tmpObj) return;
                tmpObj.lastWiggle = Date.now();
            },
            "sp": function(objSid, dir){
                let tmpObj = buildings.find(({sid}) => sid == objSid);
                if(!tmpObj) return;
                tmpObj.dir = dir;
                tmpObj.shootCount = tmpObj.shootRate;
                tmpObj.predictiveShootCount = tmpObj.shootRate;
            },
            "33": function(playerDatas) {
                tickCount++;
                script.nearest.player.length = [];
                script.nearest.teammate.length = [];
                script.nearest.enemy.length = [];
                players.forEach(tmpObj => {
                    tmpObj.forcePos = !tmpObj.isVisible;
                    tmpObj.isVisible = false;
                });
                let Players = playerDatas.split(13);
                for (let datas of Players) {
                    let tmpObj = players.find(player => player.sid == datas[0]);
                    tmpObj.updatePlayer(datas);
                    script.updateDatas(tmpObj);
                }
                myPlayerSid && (myPlayer = players.find(player => player.sid == myPlayerSid));
                for (let key of ["player", "enemy", "teammate"]) script.nearest[key].length && (script.nearest[key] = script.nearest[key].sort((a, b) => myPlayer.to(a).distance - myPlayer.to(b).distance));
                macro.placer.toggle && game.place(inv.items[macro.placer.item]);
            },
            "6": function(loadedBuildings) {
                let Buildings = loadedBuildings.split(8);
                for (let datas of Buildings) {
                    buildingManager.add(Object.assign({
                        sid: datas[0],
                        x: datas[1],
                        y: datas[2],
                        dir: datas[3],
                    }, datas[5] == null ? {
                        id: datas[6],
                        ownerSid: datas[7],
                    } : {
                        scale: datas[4],
                        type: datas[5],
                        resourceType: datas[5] == 0 ? "wood" : datas[5] == 1 ? "food" : datas[5] == 2 ? "stone" : datas[5] == 3 && ("gold"),
                    }));
                    if (datas[5] == null) {
                        let tmpObj = buildings.find(obj => obj.sid == datas[0]);
                        if (tmpObj.ownerSid == myPlayerSid) {
                            let imgURL = document.getElementById(`actionBarItem${tmpObj.id+16}`).style.backgroundImage.toString().match(/url\("(.+)?(?=")/)[1];
                            let mapDisplay = document.getElementById("mapDisplay").getBoundingClientRect();
                            let targets = [tmpObj.x, tmpObj.y].map(item => (130 * item) / 14400);
                            let x = mapDisplay.x + targets[0] - 6;
                            let y = mapDisplay.y + targets[1] - 6;
                            let newTarget = Object.assign(document.createElement("div"), {
                                rawX: targets[0],
                                rawY: targets[1],
                                rimgURL: imgURL,
                                style: `
                                    background-image: url("${imgURL}");
                                    background-size: 12px 12px;
                                    width:12px; height:12px;
                                    position: absolute;
                                    left: ${x}px;
                                    top: ${y}px;
                                    opacity: 0;
                                    z-index: 100;
                                    cursor: pointer;
                                `,
                                className: "mapTarget",
                                id: "target_" + tmpObj.sid,
                            });
                            document.getElementsByTagName("body")[0].appendChild(newTarget);
                            script.object_map.targets.push([newTarget, targets.map(item => item - 6)]);
                            if (config.object_map.enabled) $(newTarget).animate({
                                opacity: 1
                            });
                        }
                    }
                }
            },
            "4": function(sid) {
                let tempObj = players.find(tmpObj => tmpObj.sid == sid);
                tempObj && playerManager.removeByObject(tempObj);
            },
            "13": function(sid) {
                myPlayer && buildingManager.removeAllBuildings(sid);
            },
            "12": function(sid) {
                let tempObj = buildings.find(tmpObj => tmpObj.sid == sid);
                if (tempObj) {
                    buildingManager.removeByObject(tempObj);
                    let target = document.getElementById("target_" + sid);
                    if (target) {
                        $(target).animate({
                            opacity: 0
                        });
                        setTimeout(() => target.remove(), 100);
                        script.object_map.targets.splice(script.object_map.targets.indexOf(script.object_map.targets.find(ez => ez[0] == target)), 1);
                    }
                    if (config.auto_replacer.enabled) {
                        if(myPlayer.to(tempObj).distance < 200 && script.nearest.enemy.length && myPlayer.to(script.nearest.enemy[0]).distance < 500){
                            let direction = myPlayer.to(script.nearest.enemy[0]).direction;
                            if (config.auto_replacer.safe_auto_replacer) {
                                if (myPlayer.to(script.nearest.enemy[0]).distance < 250) {
                                    [tempObj, script.nearest.enemy[0]].forEach(obj => {
                                        game.place(inv.items[2], myPlayer.to(obj).direction);
                                    });
                                } else game.place(inv.items[4], myPlayer.to(script.nearest.enemy[0]).direction);
                            } else {
                                if (myPlayer.to(script.nearest.enemy[0]).distance < 250) {
                                    for (let angle = 0; angle < 180; angle += 18) {
                                        game.place(inv.items[2], direction + (angle - 90) * Math.PI / 180);
                                    }
                                } else {
                                    for (let angle = 0; angle < 360; angle += 45) {
                                        game.place(inv.items[4], direction + angle * Math.PI / 180);
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "17": function(data, isWeapon) {
                data && (inv[isWeapon ? 'weapons' : "items"] = data, user.weaponIndex = inv.weapons[Number(user.weaponIndex > 8)]);
            },
            "us": function(isEquiped, index, isTail) {
                if (isTail) {
                    if (isEquiped) user.tailIndex = index;
                    else user.tails[index] = true;
                } else if (isEquiped) user.skinIndex = index;
                else user.skins[index] = true;
            },
            "11": function() {
                Object.assign(players[players.indexOf(players.find(tmpObj => tmpObj.sid == myPlayerSid))], {
                    alive: false,
                    forcePos: true,
                    isVisible: false,
                    differenceBetweenUpdate: 0,
                    updateTime: 0,
                    oldUpdateTime: 0,
                    y: 0,
                    x: 0,
                    dir: 0,
                    smooth: {
                        x: 0,
                        oldX: 0,
                        y: 0,
                        oldY: 0,
                        dir: 0,
                        oldDir: 0,
                    },
                    iconIndex: null,
                    skinIndex: 0,
                    tailIndex: 0,
                    skin: {},
                    tail: {},
                    last: {
                        bleed: {
                            value: 0,
                            time: 0,
                            healed: true,
                        },
                        regen: {
                            value: 0,
                            time: 0,
                        },
                    },
                    shame: {
                        count: 0,
                        timer: 30.000,
                    },
                    maxHealth: 100,
                    reloads: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    weaponIndex: 0,
                    weaponVariant: 0,
                    weapons: [{
                        index: 0,
                        variantIndex: 0,
                    }, {
                        index: null,
                        variantIndex: 0,
                    }, ],
                });
                myPlayerSid && (myPlayer = players.find(tmpObj => tmpObj.sid == myPlayerSid));
                Object.assign(inv, {
                    weapons: [0],
                    items: [0, 3, 6, 10]
                });
                Object.assign(user, {
                    weaponIndex: 0,
                    buildIndex: -1,
                    skinIndex: 0,
                    tailIndex: 0,
                    skin: {},
                    tail: {},
                    last: {
                        bleed: {
                            healed: true,
                        },
                    },
                });
                Object.assign(script, {
                    projectile_blocker: {
                        active: false,
                        timer: 100
                    }
                });
                Object.assign(message_user, {
                    lastTry: {
                        equip: {
                            skinIndex: 0,
                            tailIndex: 0,
                        },
                        buy: {
                            skinIndex: 0,
                            tailIndex: 0,
                        },
                    },
                });
                sP = [];
                for (let key of ["aim", "hit", "choose", "equip"]) Object.assign(auto[key], {
                    allowCount: 0
                });
                console.log('user dead');
            },
            "9": function(item, value, unknown) {
                myPlayer?.alive && (user[item] = value);
            },
            "st": function(team, isOwner) {
                if (myPlayer) {
                    myPlayer.team.id = team;
                    isOwner && (myPlayer.team.leader = myPlayer);
                }
            },
            "sa": function(data) {
                alliancePlayers = [];
            },
            "14": function(index, value) {
                myPlayer?.alive && (inv.itemCounts[index] = value);
            }
        },
        handleMessage: {
            manage: function(x) {
                var [packet, data] = msgpack.decode(new Uint8Array(x));
                var parent = core.handleMessage;
                parent[packet] && parent[packet](...data);
            },
            "5": function(index, isWeapon) {
                user[isWeapon ? "weaponIndex" : "buildIndex"] = index;
            },
            "9": function() {
                alliancePlayers = [];
            },
            "c": function(isTrue, direction){
                isTrue && ![null, undefined].includes(direction) && (oldAimDirection = direction);
            },
            "13c": function(isBuy, index, isTail){
                if(isBuy) {
                    message_user.lastTry.buy[(isTail ? "tail" : "skin")+"Index"] = index;
                    message_user[(isTail ? "tails" : "skins")][index] = true;
                } else {
                    message_user.lastTry.equip[(isTail ? "tail" : "skin")+"Index"] = index;
                }
            },
        },
    };
    var update = {
        packetSystem: function(now, delta) {
            for (let each of ["perSec", "perMin"]) {
                var per = packetSystem[each];
                per.resetTime += delta;
                if (per.resetTime >= per.resetAt) {
                    per.resetTime = 0;
                    per.current = 0;
                }
            }
        },
        game: {
            renderProjectiles: function(delta, layer) {
                for (let obj of projectiles.filter(obj => obj.isActive && obj.layer == layer)) {
                    obj.update(delta);
                }
            },
        },
        script: function(now, delta) {
            let resetPromises = sP.filter(promise => promise.action.toString().match("(myPlayer.shootCount)"));
            let oldShootCount = myPlayer.shootCount;
            myPlayer.shootCount = 1;
            resetPromises.forEach(promise => {
                if (!script.nearest.enemy.length || !script.nearest.enemy.find(e => myPlayer.to(e).distance <= 700 && e.skinIndex != 22)) {
                    promise.action();
                    sP.splice(sP.indexOf(promise), 1);
                }
            });
            myPlayer.shootCount = oldShootCount;
            let auto_emp = false;
            buildings.forEach(tmpObj => {
                if(config.auto_emp.enabled && tmpObj.isActive && myPlayer.to(tmpObj).distance <= 700 && tmpObj.id == 17){
                    if(config.auto_emp.safe_auto_emp) auto_emp = true;
                    else if(tmpObj.predictiveShootCount < 175){
                        if(tmpObj.predictiveShootCount <= delta){
                            tmpObj.predictiveShootCount = tmpObj.shootRate;
                        }
                        auto_emp = true;
                    }
                }
            });
            if (script.projectile_blocker.active) {
                script.projectile_blocker.projectile = projectiles.find(obj => obj.sid == script.projectile_blocker.projectile.sid);
                auto.aim.direction = () => {
                    return myPlayer.to(script.projectile_blocker.projectile).direction;
                };
                game.watch(auto.aim.direction());
                game.choose(inv.weapons[1], true);
                script.projectile_blocker.timer -= delta;
                script.projectile_blocker.timer <= 0 && (auto.aim.stop(), auto.choose.stop(), game.choose(inv.weapons[0], 1), Object.assign(script.projectile_blocker, {
                    timer: 100,
                    active: false
                }));
            } else {
                if (auto.choose.allowCount) {
                    game.choose(auto.choose.item().index, auto.choose.item().isWeapon);
                }
                script.insta_kill.working && (script.insta_kill.toggle = false);
                script.insta_kill.toggle && game.insta_kill();
                script.nearest.enemy.length && (game.killer_hit(), game.killer_shot());
                if (auto.equip.allowCount == 0) {
                    let auto_bull = [false, [false, null]];
                    if(auto.aim.allowCount && typeof auto.aim.direction == "function" && myPlayer.inTrap && config.auto_trap_breaker.enabled){
                        if(config.auto_bull_in_ab.enabled){
                            let enemy_possible_to_hit = script.nearest.enemy.find(e => myPlayer.to(e).distance <= items.weapons[inv.weapons[0]].range + 63 && utils.getAngleDist(auto.aim.direction(), myPlayer.to(e).direction) <= Math.PI/2.6);
                            if(enemy_possible_to_hit){
                                auto_bull[0] = enemy_possible_to_hit ? true : false;
                                if(config.auto_bull_in_ab.auto_aim_to_enemy){
                                    auto_bull[1] = [utils.getAngleDist(myPlayer.to(enemy_possible_to_hit).direction, auto.aim.direction()) <= Math.PI/2.6 ? true : false,
                                                    myPlayer.to(enemy_possible_to_hit).direction];
                                }
                            }
                        }
                    }
                    if (mouse.down || myPlayer.inTrap && config.auto_trap_breaker.enabled) {
                        if(!script.auto_hit_toggle) {
                            auto.aim.start();
                            auto.hit.start();
                            if(myPlayer.inTrap && config.auto_anti_trap.enabled){
                                let placeItem = script.nearest.enemy.length && myPlayer.to(script.nearest.enemy[0]).distance < 250 ? 2 : 4;
                                let direction = myPlayer.to(myPlayer.inTrap).distance + Math.PI;
                                for (let angle = 0; angle < 180; angle += 36) {
                                    game.place(inv.items[placeItem], direction + (angle - 90) * Math.PI / 180);
                                }
                            }
                        }
                        script.auto_hit_toggle = true;
                        game.choose(inv.weapons[1] == 10 && (mouse.which == 2 || myPlayer.inTrap && config.auto_trap_breaker.enabled && !auto_bull[0]) ? 10 : inv.weapons[0], true);
                    }
                    !(mouse.down || myPlayer.inTrap && config.auto_trap_breaker.enabled) && script.auto_hit_toggle && (auto.aim.stop(), auto.hit.stop(), script.auto_hit_toggle = false);
                    if ((mouse.down || myPlayer.inTrap && config.auto_trap_breaker.enabled) && !myPlayer.reloads[user.weaponIndex]) {
                        if (myPlayer.inTrap && config.auto_trap_breaker.enabled) {
                            auto.aim.direction = () => {
                                return myPlayer.to(myPlayer.inTrap).direction;
                            };
                            auto_bull[0] && (game.equip(0, 1));
                            game.equip(auto_bull[0] ? 7 : 40);
                            game.watch(auto_bull[1][0] ? auto_bull[1][1] : auto.aim.direction());
                        } else if (mouse.which == 0) {
                            auto.aim.direction = () => {
                                return myPlayer.to(script.nearest.enemy[0]).direction;
                            };
                            game.equip(0, 1)
                            game.equip(7);
                            game.watch(auto.aim.direction());
                        } else if (mouse.which == 1) {
                            auto.aim.direction = () => {
                                return myPlayer.to(script.nearest.enemy[0]).direction;
                            };
                            game.equip(0, 1)
                            game.equip(21);
                            game.watch(auto.aim.direction());
                        } else if (mouse.which == 2) {
                            auto.aim.direction = mouse.direction;
                            game.equip(40);
                            game.watch(auto.aim.direction());
                        }
                    } else if(config.auto_grind.enabled){
                        !script.auto_grind.hit_started && (script.auto_grind.hit_started = true, auto.aim.start(), auto.hit.start());
                        auto.aim.direction = () => {
                            return script.auto_grind.hit_angle ? Math.PI/4 : -Math.PI/4*3;
                        };
                        game.watch(auto.aim.direction());
                        game.equip(40);
                        if(script.auto_grind.timer > 200){
                            script.auto_grind.hit_angle = !script.auto_grind.hit_angle;
                            script.auto_grind.timer = 0;
                            for(let angle = 0;angle<=Math.PI;angle+=Math.PI/2){
                                game.place(inv.items[5] || inv.items[3], angle);
                                game.place(inv.items[5] || inv.items[3], -angle);
                            }
                        } else script.auto_grind.timer += delta;
                    } else if (config.smart_hat.enabled) {
                        if (myPlayer.shame.count == "-") {
                            game.equip(13);
                            game.equip(13, 1);
                        } else if (myPlayer.shame.count > 2) {
                            game.equip(7);
                            game.equip(13, 1);
                        } else if (script.nearest.enemy.length && myPlayer.to(script.nearest.enemy[0]).distance < 300) {
                            let offenseCondition = (e) => {
                                let array = [Date.now()-e.lastHit, items.weapons[e.weapons[0].index].speed];
                                return array[0] > array[1] && array[0] < array[1] + 200;
                            };
                            if(config.auto_offense_hat.enabled && script.nearest.enemy.find(e => offenseCondition(e) && !e.reloads[e.weapons[0].index] && myPlayer.to(e).distance <= items.weapons[e.weapons[0].index].range + 35 * 1.8)) {
                                game.equip(11);
                                game.equip(21, 1);
                            } else {
                                game.equip(6);
                            }
                        } else {
                            if(auto_emp || myPlayer.to({x: myPlayer.smooth.oldX, y: myPlayer.smooth.oldY}).distance <= 15) game.equip(22);
                            else game.equip(myPlayer.y <= 2400 ? 15 : myPlayer.y < 14400 / 2 + 724 / 2 && myPlayer.y >= 14400 / 2 - 724 / 2 ? 31 : 12);
                            game.equip(11, 1);
                        }
                    }
                }
            }
            !config.auto_grind.enabled && script.auto_grind.hit_started && (script.auto_grind.hit_started = false, auto.aim.stop(), auto.hit.stop());
            if (config.auto_placer.enabled) {
                if (script.nearest.enemy.length && script.auto_placer.timer > 300) {
                    script.auto_placer.timer = 0;
                    if(myPlayer.inTrap){
                        let direction = myPlayer.to(myPlayer.inTrap).direction + Math.PI;
                        game.place(inv.items[4], direction);
                    } else {
                        let direction = myPlayer.to(script.nearest.enemy[0].inTrap || script.nearest.enemy[0]).direction;
                        if (script.nearest.enemy[0].inTrap) {
                            if (myPlayer.to(script.nearest.enemy[0].inTrap).distance < 250) {
                                game.place(inv.items[4], direction);
                                for (let angle = 0; angle < 180; angle += 60) {
                                    let placerDatas = [inv.items[2], direction + (120 + angle) * Math.PI / 180];
                                    game.place(...placerDatas);
                                }
                            }
                        } else if (myPlayer.to(script.nearest.enemy[0]).distance < 400) {
                            for (let angle = 0; angle < 360; angle += 120) {
                                let placerDatas = [inv.items[4], direction + angle * Math.PI / 180];
                                game.place(...placerDatas);
                            }
                        }
                    }
                }
            }
            script.auto_placer.timer += delta;
        },
        visuals: {
            datas: function(now, delta) {
                if (myPlayer) {
                    var tmpDist = Math.hypot(camX - myPlayer.smooth.x, camY - myPlayer.smooth.y);
                    var tmpDir = Math.atan2(myPlayer.smooth.y - camY, myPlayer.smooth.x - camX);
                    var camSpd = Math.min(tmpDist * 0.01 * delta, tmpDist);
                    if (tmpDist > 0.05) {
                        camX += camSpd * Math.cos(tmpDir);
                        camY += camSpd * Math.sin(tmpDir);
                    } else {
                        camX = myPlayer.smooth.x;
                        camY = myPlayer.smooth.y;
                    }
                    var lastTime = now - (1000 / 9);
                    var tmpDiff;
                    for (var tmpObj of players) {
                        if (tmpObj && tmpObj.isVisible) {
                            if (tmpObj.forcePos) {
                                tmpObj.smooth.x = tmpObj.x;
                                tmpObj.smooth.y = tmpObj.y;
                                tmpObj.smooth.dir = tmpObj.dir;
                            } else {
                                var total = tmpObj.updateTime - tmpObj.oldUpdateTime;
                                var fraction = lastTime - tmpObj.oldUpdateTime;
                                var ratio = (fraction / total);
                                var rate = 170;
                                tmpObj.differenceBetweenUpdate += delta;
                                var tmpRate = Math.min(1.7, tmpObj.differenceBetweenUpdate / rate);
                                tmpDiff = (tmpObj.x - tmpObj.smooth.oldX);
                                tmpObj.smooth.x = tmpObj.smooth.oldX + (tmpDiff * tmpRate);
                                tmpDiff = (tmpObj.y - tmpObj.smooth.oldY);
                                tmpObj.smooth.y = tmpObj.smooth.oldY + (tmpDiff * tmpRate);
                                tmpObj.smooth.dir = Math.lerpAngle(tmpObj.dir, tmpObj.smooth.oldDir, Math.min(1.2, ratio));
                                if (tmpObj.buildIndex == -1) tmpObj.reloads[tmpObj.weaponIndex] = Math.max(0, tmpObj.reloads[tmpObj.weaponIndex] - delta);
                                tmpObj.shootCount = Math.max(0, tmpObj.shootCount - delta);
                            }
                        }
                    }
                    for(let tmpObj of buildings){
                        if(tmpObj.isActive && tmpObj.id == 17){
                            tmpObj.shootCount = Math.max(0, tmpObj.shootCount - delta);
                            tmpObj.predictiveShootCount = Math.max(0, tmpObj.predictiveShootCount - delta);
                        }
                    }
                } else {
                    camX = 14400 / 2;
                    camY = 14400 / 2;
                }
            },
            action: function(now, delta) {
                var xOffset = camX - (1920 / 2);
                var yOffset = camY - (1080 / 2);
                let tmpText, healthBarWidth = 50,
                    barPad = 4.5,
                    reloadBarWidth = 100 / 3,
                    player = {
                        nameY: 34,
                        scale: 35,
                    };
                let tracerConfig = config.tracers;
                let hitableBuildings = [];
                let seeableTurretBuildings = [];
                for (let tmpObj of players) {
                    if (tmpObj.isVisible) {
                        buildings.forEach(obj => {
                            if(!hitableBuildings.includes(obj) && obj.health != obj.maxHealth && obj.isActive && obj.id && tmpObj.to(obj).distance <= 300){
                                hitableBuildings.push(obj);
                            }
                            if(!seeableTurretBuildings.includes(obj) && obj.isActive && obj.id == 17 && tmpObj.to(obj).distance <= 700){
                                seeableTurretBuildings.push(obj);
                            }
                        });
                        if (myPlayer != tmpObj && tracerConfig.enabled) {
                            for (let key in tracerConfig) {
                                if (key != "enabled") {
                                    let tracer = tracerConfig[key];
                                    if (script.nearest[key.split("_")[0]].some(({
                                        sid
                                    }) => {
                                        if (tmpObj.sid == sid) {
                                            return true;
                                        }
                                    })) {
                                        draw.gameCanvas.drawTracer(
                                            "round",
                                            tracer,
                                            3, {
                                                x: myPlayer.smooth.x - xOffset,
                                                y: myPlayer.smooth.y - yOffset,
                                            }, {
                                                x: tmpObj.smooth.x - xOffset,
                                                y: tmpObj.smooth.y - yOffset,
                                            });
                                    }
                                }
                            }
                        }
                        tmpText = (tmpObj.team.id ? "[" + tmpObj.team.id + "] " : "") + (tmpObj.name || "");
                        draw.gameCanvas.font = 32 + "px Hammersmith One";
                        draw.gameCanvas.fillStyle = "red";
                        draw.gameCanvas.beginPath();
                        draw.gameCanvas.strokeStyle = darkOutlineColor;
                        draw.gameCanvas.beginPath();
                        draw.gameCanvas.textBaseline = "middle";
                        draw.gameCanvas.textAlign = "center";
                        draw.gameCanvas.lineWidth = 8;
                        draw.gameCanvas.lineJoin = "round";
                        draw.gameCanvas.strokeText(
                            tmpObj.shame.count,
                            tmpObj.smooth.x - xOffset + draw.gameCanvas.measureText(tmpText).width / 2 + 32,
                            tmpObj.smooth.y - yOffset - player.nameY - player.scale,
                        );
                        draw.gameCanvas.fillText(
                            tmpObj.shame.count,
                            tmpObj.smooth.x - xOffset + draw.gameCanvas.measureText(tmpText).width / 2 + 32,
                            tmpObj.smooth.y - yOffset - player.nameY - player.scale,
                        );
                        if (tmpObj.health > 0) {
                            if (tmpObj.isPlayer) {
                                draw.gameCanvas.drawBar(
                                    darkOutlineColor,
                                    tmpObj.smooth.x - xOffset - healthBarWidth - barPad,
                                    tmpObj.smooth.y - yOffset + player.scale + player.nameY - 17 + barPad,
                                    healthBarWidth * 2 + barPad * 2,
                                    17,
                                    8,
                                );
                                let primary = tmpObj == myPlayer ? inv.weapons[0] : tmpObj.weapons[0].index;
                                draw.gameCanvas.drawBar(
                                    tmpObj.reloads[tmpObj.weapons[0].index] == 0 ? "#51CCBF" : "#cc5151",
                                    tmpObj.smooth.x - xOffset - healthBarWidth,
                                    tmpObj.smooth.y - yOffset + player.scale + player.nameY + 4.5 * 2 - 17,
                                    (![null, undefined].includes(primary) ? reloadBarWidth - tmpObj.reloads[primary] / items.weapons[primary].speed * reloadBarWidth : reloadBarWidth),
                                    17 - barPad * 2,
                                    7,
                                );
                                draw.gameCanvas.drawBar(
                                    tmpObj.shootCount == 0 ? "#51CCBF" : "#cc5151",
                                    tmpObj.smooth.x - xOffset - healthBarWidth / 3,
                                    tmpObj.smooth.y - yOffset + player.scale + player.nameY + barPad * 2 - 17,
                                    reloadBarWidth - tmpObj.shootCount / tmpObj.shootRate * reloadBarWidth,
                                    17 - barPad * 2,
                                    7,
                                );
                                let secondary = tmpObj == myPlayer ? inv.weapons[1] : tmpObj.weapons[1].index;
                                draw.gameCanvas.drawBar(
                                    !secondary || tmpObj.reloads[secondary] == 0 ? "#51CCBF" : "#cc5151",
                                    tmpObj.smooth.x - xOffset + healthBarWidth / 3,
                                    tmpObj.smooth.y - yOffset + player.scale + player.nameY + barPad * 2 - 17,
                                    (secondary ? reloadBarWidth - tmpObj.reloads[secondary] / items.weapons[secondary].speed * reloadBarWidth : reloadBarWidth),
                                    17 - barPad * 2,
                                    7,
                                );
                            }
                        }
                        if(myPlayer == tmpObj){
                            let underText = `[${Math.round(packetSystem.kickRate().perSec * 100)}${config.coordinates.enabled ? `, [${myPlayer.x + ", "+myPlayer.y}]` : ""}${config.insta_kill.auto_insta_kill ? ", "+script.insta_kill.toggle : ""}]`
                            draw.gameCanvas.font = "16px Hammersmith One";
                            draw.gameCanvas.fillStyle = "white";
                            draw.gameCanvas.beginPath();
                            draw.gameCanvas.strokeStyle = darkOutlineColor;
                            draw.gameCanvas.beginPath();
                            draw.gameCanvas.textBaseline = "middle";
                            draw.gameCanvas.textAlign = "center";
                            draw.gameCanvas.lineWidth = 8;
                            draw.gameCanvas.lineJoin = "round";
                            draw.gameCanvas.strokeText(
                                underText,
                                tmpObj.smooth.x - xOffset,
                                tmpObj.smooth.y - yOffset + player.nameY + player.scale + 17 + 2 + 8,
                            );
                            draw.gameCanvas.fillText(
                                underText,
                                tmpObj.smooth.x - xOffset,
                                tmpObj.smooth.y - yOffset + player.nameY + player.scale + 17 + 2 + 8,
                            );
                        }
                    }
                }
                for(let tmpObj of hitableBuildings){
                    let downBar = seeableTurretBuildings.find(({sid}) => sid == tmpObj.sid);
                    draw.gameCanvas.drawBar(
                        darkOutlineColor,
                        tmpObj.x - xOffset - healthBarWidth / 2 - barPad,
                        tmpObj.y - yOffset - (downBar ? 0 : 17/2),
                        healthBarWidth + barPad * 2,
                        17,
                        8,
                    );
                    draw.gameCanvas.drawBar(
                        "#B2CC51",
                        tmpObj.x - xOffset - healthBarWidth / 2,
                        tmpObj.y - yOffset - (downBar ? 0 : 17/2) + 4.5,
                        (tmpObj.health / tmpObj.maxHealth) * healthBarWidth,
                        17 - barPad * 2,
                        7,
                    );
                }
                for(let tmpObj of seeableTurretBuildings){
                    let upBar = hitableBuildings.find(({sid}) => sid == tmpObj.sid);
                    draw.gameCanvas.drawBar(
                        darkOutlineColor,
                        tmpObj.x - xOffset - healthBarWidth / 2 - barPad,
                        tmpObj.y - yOffset - (upBar ? 17 : 17/2),
                        healthBarWidth + barPad * 2,
                        17,
                        8,
                    );
                    draw.gameCanvas.drawBar(
                        "#CC8751",
                        tmpObj.x - xOffset - healthBarWidth / 2,
                        tmpObj.y - yOffset - (upBar ? 17 : 17/2) + 4.5,
                        healthBarWidth - tmpObj.shootCount / tmpObj.shootRate * healthBarWidth,
                        17 - barPad * 2,
                        7,
                    );
                }
            },
        },
        frame: {
            lastUpdate: Date.now(),
            action: function() {
                var now = Date.now();
                var delta = now - update.frame.lastUpdate;
                update.frame.lastUpdate = now;
                update.packetSystem(now, delta);
                if (myPlayer?.alive) {
                    update.script(now, delta);
                }
                update.game.renderProjectiles(delta, 0);
                update.game.renderProjectiles(delta, 1);
                update.visuals.datas(now, delta);
                update.visuals.action(now, delta);
                window.requestAnimationFrame(update.frame.action);
            },
        }
    };
    var accountMenu = Object.assign(document.createElement("div"), {
        id: "accountMenu",
    });
    document.body.appendChild(accountMenu);
    $("#accountMenu").css({
        position: "absolute",
        opacity: 0,
        display: "none",
        top: "0px",
        left: "50%",
        width: "600px",
        height: "600px",
        transform: "translate(-50%, -50%)",
        "border-radius": "10px",
        "background-color": "rgba(255, 255, 255, 1)",
        "box-shadow": "0 2px 5px 0 rgba(0, 0, 0, 0.08), 0 2px 10px 0 rgba(0, 0, 0, 0.06)",
        "z-index": 2147000000,
    });
    if (mooscript_user) {
        accountMenu.innerHTML = `<div id="flextop">
            <h1 class = "menuHeader">Account</h1>
            </div>
			<h3 class = "settingRadio" style = "text-align: center;margin-top: 5.5px;">
            Here you can see information about your account.
            </h3>
            <label class = "settingRadio" style = "text-align: center;margin-top: 5.5px;margin-left: 10px;">
            Name: ${mooscript_user.name}</label><br>
            <label class = "settingRadio" style = "text-align: center;margin-top: 5.5px;margin-left: 10px;">
            ID: ${mooscript_user.id}</label>`;
    }
    elements.openAccountMenu.onclick = function() {
        elements.openAccountMenu.toggle = !elements.openAccountMenu.toggle;
        setTimeout(() => accountMenu.style.display = elements.openAccountMenu.toggle ? "block" : "none", 300 * Number(!elements.openAccountMenu.toggle));
        $("#accountMenu").animate({
            opacity: elements.openAccountMenu.toggle,
            top: elements.openAccountMenu.toggle ? "50%" : "0px"
        });
    }
    $("#mapDisplay").on("click", (event) => {
        if (!script.auto_pilot.every(x=>x===false)) return;

        $("#spotDiv").css({zIndex: 10000});
        var xpos = event.pageX - $("#mapDisplay").offset().left;
        var ypos = event.pageY - $("#mapDisplay").offset().top;
        var mapWidth = $("#mapDisplay").width();
        var mapHeight = $("#mapDisplay").height();
        var shiftX = (xpos/mapWidth)*14365;
        var shiftY = (ypos/mapHeight)*14365;
        script.auto_pilot = [shiftX, shiftY];
        var infoDiv = document.createElement("div");
        infoDiv.innerHTML = `<h1 id="autotitle">You are currently in auto-pilot.</h1>
     <h3 id="arrivalest">You will arrive in <span id="timeest">30 seconds...</span></h3>

     <button type="button" id="cancelTrip">Cancel</button>`;
        infoDiv.id = "infoDiv";
        document.body.prepend(infoDiv);

        let spotDiv = document.createElement("div");
        spotDiv.id = "spotDiv";
        spotDiv.className = "spotDiv";
        document.body.prepend(spotDiv);
        $("#spotDiv").css({left: event.pageX, top: event.pageY});
        $("#spotDiv").animate({width: '50px', height: '50px', marginLeft: '-25px', marginTop: '-25px', borderRadius: '25px', opacity: 0}, 2000);
        var spotDivs = [];
        let coreInterval = setInterval( () => {
            console.log('looping');
            if (script.auto_pilot.every(x=>x===false)){
                clearInterval(coreInterval);
                console.log('clearing');
                for (let elementDiv of document.getElementsByClassName("spotDiv")){
                    document.body.removeChild(elementDiv);
                }

            } else {
                let spotDiv = document.createElement("div");
                spotDiv.id = "spotDiv";
                spotDiv.className = "spotDiv";
                document.body.prepend(spotDiv);
                $("#spotDiv").css({left: event.pageX, top: event.pageY});
                $("#spotDiv").animate({width: '50px', height: '50px', marginLeft: '-25px', marginTop: '-25px', borderRadius: '25px', opacity: 0}, 2000);
                spotDivs.push(spotDiv);
            }
        }, 700);
        let moveInterval = setInterval(() => {
            if (script.auto_pilot.every(x => x==false)) clearInterval(moveInterval);
            else {
                let [x, y] = script.auto_pilot;
                let correctAngle = myPlayer.to({x, y}).direction;
                send("33", correctAngle);
                //For every 1 second of travel, you go forward 320 pixels!
                let totalDist = myPlayer.to({x, y}).distance;
                let spdMult = (myPlayer.skin?.spdMult || 1) *
                    (myPlayer.tail?.spdMult || 1) *
                    (myPlayer.y<=2400? (myPlayer.skin?.coldM ? 1 : 0.75) : 1) *
                    (items.weapons[myPlayer.weaponIndex]?.spdMult || 1);
                let totalTime = Math.ceil(totalDist/(265 * spdMult));
                document.getElementById("timeest").innerHTML = `${totalTime} seconds...`
                console.log(totalDist);
                if (totalDist < 100){
                    script.auto_pilot = [false, false];
                    clearInterval(moveInterval);
                    send("33", undefined);
                    setTimeout(() => document.getElementById("infoDiv").style.display = "none", 300);
                    $("#infoDiv").animate({opacity: 0});
                }
            }
        }, 300);
    });
    $(document).on("click", "#cancelTrip", () => {
        script.auto_pilot = [false, false];
        send("33", undefined);
        setTimeout(() => document.getElementById("infoDiv").style.display = "none", 300);
        $("#infoDiv").animate({opacity: 0});
    })
    function send(item, ...args) {
        window.ws && window.ws.send(new Uint8Array(Array.from(msgpack.encode([item, args, "mooscript_message"]))));
    }
    new Promise(res => window.ws = res).then(ws => (window.ws = ws).addEventListener("message", core.handleWS.manage));
    WebSocket.prototype.send = function(x) {
        window?.ws(this);
        this.send = function(x) {
            packetSystem.perSec.current++;
            packetSystem.perMin.current++;
            let decoded = msgpack.decode(new Uint8Array(x));
            core.handleMessage.manage(x);
            if (decoded[2] != "mooscript_message" && ["2"].includes(decoded[0])) return;
            this._send(x)
        }
        this.send(x);
    }
    class Collection {
        constructor(array = []) {
            this.__array = array;
        }
        fromID(id) {
            return this.__array.filter(thing => thing.id === id);
        }
        get(id) {
            return this.fromID(id)[0];
        }
        has(id) {
            return this.fromID(id).length > 0;
        }
        forEach(callback) {
            this.__array.forEach(callback);
        }
    }

    function randInt(min, max) {
        const mini = Math.ceil(min);
        return Math.floor(Math.random() * (Math.floor(max) - mini + 1)) + mini;
    }

    function randItem(array) {
        return array[randInt(0, array.length - 1)];
    }

    function getModule(id) {
        return modules.find(module => module.id == id);
    }
    const quick_modules = new Collection([{
        id: "auto_grind",
        name: "Auto Grind",
    }]);
    const categories = new Collection([{
        id: "main",
        name: "Main",
        description: "",
    }, {
        id: "offense",
        name: "Offense",
        description: "",
    }, {
        id: "defense",
        name: "Defense",
        description: "",
    }, {
        id: "support",
        name: "Support",
        description: "",
    }, {
        id: "visuals",
        name: "Visuals",
        description: "",
    }, {
        id: "map",
        name: "Map",
        description: "",
    }]);
    const modules = new Collection([{
        id: "tracers",
        name: "Tracers",
        category: "visuals",
        settings: [{
            id: "enemy_tracer",
            type: "color",
            name: "Enemy tracer",
            description: "The color of the enemy tracer.",
            default: "#ff0000"
        }, {
            id: "teammate_tracer",
            type: "color",
            name: "Teammate tracer",
            description: "The color of the teammate tracer.",
            default: "#00ff00",
        }],
        toggle: () => {},
    }, {
        id: "auto_chat",
        name: "Automatic Chat",
        description: "Automatically chats certain messages.",
        category: "main",
        settings: [{
            id: "messages",
            name: "Message List",
            hover: "You can insert multiple messages with a comma; if you want to say both '1' and '2', put '1,2'.",
            default: "Hello!,Git gud!",
            type: "text",
        }, {
            id: "randomize_messages",
            name: "Randomize Messages",
            default: true,
            type: "checkbox",
        }],
        toggle: () => {},
        init: () => {
            let index = 0;
            setInterval(()=>{
                if(window.ws && myPlayer?.alive){
                    let messages = config.auto_chat.messages.split(",");
                    if(config.auto_chat.enabled){
                        game.chat(config.auto_chat.randomize_messages ? randItem(messages) : messages[index]);
                        index++;
                        index >= messages.length && (index = 0);
                    }
                }
            }, 3e3);
        },
    }, {
        id: "smart_hat",
        name: "Smart Hats",
        description: "This module allows you to equip certain hats at certain times to get the most out of those actions.",
        category: "support",
        toggle: () => {},
    }, {
        id: "auto_bull_in_ab",
        name: "Auto Bull In AB",
        description: "With this module it will equip bull helmet automaticly if can hit to enemy (Only if auto trap breaker works)",
        category: "offense",
        settings: [{
            id: "auto_aim_to_enemy",
            name: "Auto Aim To Enemy",
            default: false,
            type: "checkbox",
        }],
        toggle: () => {},
    }, {
        id: "auto_emp",
        name: "Auto Emp",
        description: "This module allows you to equip emp when user near enemy turrets (Only if smart hats toggled).",
        category: "defense",
        settings: [{
            id: "safe_auto_emp",
            name: "Safe Auto Emp",
            default: false,
            type: "checkbox",
        }],
        toggle: () => {},
    }, {
        id: "auto_heal",
        name: "Auto Heal",
        description: "With this module, you can automatically heal when you get damaged.",
        category: "support",
        toggle: () => {},
    }, {
        id: "auto_fast_heal",
        name: "Auto Fast Heal",
        description: "With this module, you can automatically heal high damages.",
        category: "defense",
        toggle: () => {},
    }, {
        id: "anti_insta",
        name: "Anti Insta",
        description: "It will heal possible insta-kills.",
        category: "defense",
        toggle: () => {},
    }, {
        id: "insta_kill",
        name: "Insta Kill",
        description: "With this module, you can do insta-kill. (r)",
        category: "offense",
        settings: [{
            id: "auto_insta_kill",
            name: "Auto Insta Kill",
            default: false,
            type: "checkbox",
        }, {
            id: "spike_insta_kill",
            name: "Spike Insta Kill (space)",
            default: true,
            type: "checkbox",
        }],
        toggle: () => {},
    }, {
        id: "auto_killer_hit",
        name: "Auto Killer Hit",
        description: "This module will kill low health players normal weapons.",
        category: "offense",
        toggle: () => {},
    }, {
        id: "auto_killer_shot",
        name: "Auto Killer Shot",
        description: "This module will kill low health players with projectile weapons.",
        category: "offense",
        toggle: () => {},
    }, {
        id: "auto_trap_breaker",
        name: "Auto Trap Breaker",
        description: "With this module, you can automatically break enemy traps when you are trapped.",
        category: "support",
        toggle: () => {},
    }, {
        id: "auto_anti_trap",
        name: "Auto Anti Trap",
        description: "This will place buildings around when you are trapped.",
        category: "defense",
        toggle: () => {},
    }, {
        id: "auto_replacer",
        name: "Auto Replacer",
        description: "With this module, you can automatically replace broken buildings.",
        category: "defense",
        settings: [{
            id: "safe_auto_replacer",
            name: "Safe Auto Replacer",
            default: false,
            type: "checkbox",
        }],
        toggle: () => {},
    }, {
        id: "auto_placer",
        name: "Auto Placer",
        description: "With this module, you can automatically place traps/spikes.",
        category: "offense",
        toggle: () => {},
    }, {
        id: "auto_offense_hat",
        name: "Auto Offense Hat",
        description: "Equips spike gear and corrupt x wing when enemy gonna hit you (Only if smart hats toggled)",
        category: "offense",
        toggle: () => {},
    }, {
        id: "object_map",
        name: "Object Mapper",
        description: "Maps the position of objects to your minimap.",
        category: "map",
        toggle: (key, value) => {
            let mapDisplay = document.getElementById("mapDisplay").getBoundingClientRect();
            for (let target of script.object_map.targets) {
                $(target[0]).css("left", mapDisplay.x + target[1][0]);
                $(target[0]).css("top", mapDisplay.y + target[1][1]);
                $(target[0]).animate({
                    opacity: value
                });
            }
        },
    }, {
        id: "projectile_blocker",
        name: "Arrow Blocking",
        description: "When you have a shield, this module will prevent arrows from hitting you by equipping it and blocking the arrow.",
        category: "defense",
        toggle: (key, value) => {
        },
    }, {
        id: "coordinates",
        name: "Coordinates",
        description: "Shows your coordinates.",
        category: "visuals",
        toggle: () => {

        },
    }, {
        id: "minimap_biomes",
        name: "Biomes on Minimap",
        description: "Shows the different biomes on the minimap by coloring each region.",
        category: "map",
        init: () => {
            if(config.minimap_biomes.enabled){
                $("#mapDisplay").css({background: `url('https://i.imgur.com/fgFsQJp.png')`});
            }
        },
        toggle: (key, value) => {
            if(value) document.getElementById("mapDisplay").style["background-image"] = "url('https://i.imgur.com/fgFsQJp.png')";
            else {
                document.getElementById("mapDisplay").style["background-image"] = "url('')";
                document.getElementById("mapDisplay").style["background-color"] = 'rgba(0, 0, 0, .25)';
            }
        },
    }, {
        id: "custom_text",
        name: "Custom Text",
        description: "This module lets you change the text of many things.",
        category: "main",
        settings: [{
            id: "death",
            name: "Death",
            default: "YOU DIED",
            type: "text",
        }, {
            id: "title",
            name: "Title",
            default: "Moo Moo",
            type: "text",
        }],
        toggle: () => {},
    }, {
        id: "ping_display",
        name: "Show Ping",
        description: "Adds the ping counter in-game.",
        category: "main",
        toggle: () => {}
    }]);

    function setConfig(moduleID, key, value) {
        if (!config[moduleID] /* || localStorage.getItem("mooscript_version") != GM_info.script.version*/ ) {
            config[moduleID] = {
                enabled: false
            };
        }
        if (modules.get(moduleID).settings) {
            let object = {};
            for (let setting of modules.get(moduleID).settings) {
                if (config[moduleID][setting.id] == undefined) {
                    object[setting.id] = setting.default;
                }
            }
            Object.assign(config[moduleID], object);
        }

        if (!(key === undefined || value === undefined)) {
            config[moduleID][key] = value;
            modules.get(moduleID).toggle(key, value);
        }

        return localStorage.setItem("mooscript_config", JSON.stringify(config));
    }
    modules.forEach(module => {
        setConfig(module.id);
    });
    quick_modules.forEach(module => {
        config[module.id] = {
            enabled: false,
        };
        localStorage.setItem("mooscript_config", JSON.stringify(config));
        document['toggle_module_'+module.id] = function(){
            config[module.id].enabled = !config[module.id].enabled;
        }
        document.getElementById("infoMenu").innerHTML += `
        <label class="settingRadio">
        <input type="checkbox" onclick = "document['toggle_module_${module.id}']()" id = "${module.id}" title="Toggles all functionality in this module." style="margin: 5px; max-width: 25px;">${module.name}
        </label>
        <br>`
    });
    localStorage.setItem("mooscript_version", GM_info.script.version)
    let menuOpen = false;

    const gameUI = $("#gameUI");

    const menuButton = $("#allianceButton").clone(false);
    menuButton.children()[0].innerText = "touch_app";
    menuButton.css("right", "390px");
    menuButton.attr("title", `MooScript v${GM_info.script.version}`);

    menuButton.on("click", toggleMenu);

    gameUI.append(menuButton);

    const menuWrapper = $("<div/>").css({
        display: "none",
        width: "400px",
        left: "50%",
        position: "absolute",
        top: "0px",
        transform: "translate(-50%, -50%)",
        "text-align": "center",
        "pointer-events": "initial",
    });

    const hackMenu = $("<div/>").attr("id", "hackMenu");

    const settingsBox = $("<div/>").attr("id", "settingsBox");
    const moduleChoose = $("<select/>");
    moduleChoose.css("width", "30%");
    moduleChoose.append("<option disabled>Choose Module</option>");

    modules.forEach(module => {
        if (module.category == "main") {
            const moduleOpt = $("<option/>");

            moduleOpt.attr("value", module.id);
            moduleOpt.text(module.name)

            moduleChoose.append(moduleOpt);
        }
    });

    function makeInput(setting, configVal) {
        const input = $(`<input/>`);

        input.attr("type", setting.type);
        input.attr("name", setting.id);

        input.css("margin", "5px");
        input.css("max-width", "25px");

        const label = $(`<label class="settingRadio" />`);

        label.text(setting.name);
        input.attr("title", setting.hover);

        switch (setting.type) {
            case "text":
                input.css("width", "170px");
                input.css("max-width", "170px");

                input.attr("placeholder", `Default: ${setting.default}`);
                input.val(configVal);

                label.text(setting.name + ":");

                break;
            case "checkbox":
                input.prop("checked", configVal);
                break;
            default:
                input.val(configVal);
        }

        if (setting.type === "text") {
            label.append(input);
        } else {
            label.prepend(input);
        }

        return label;
    }

    moduleChoose.on("change", event => {
        const module = modules.get(event.target.value);
        if (!module) return;
        settingsBox.empty();

        const desc = $(`<legend class = "mooscript_descriptiontext"/>`);
        desc.text(module.description || `You can change settings for the ${module.name} module here.`);
        settingsBox.append(desc);

        if (!module.required) {
            const enabledToggle = makeInput({
                type: "checkbox",
                id: "enabled",
                name: "Enable Module",
                hover: "Toggles all functionality in this module.",
            }, config[module.id].enabled);
            settingsBox.append(enabledToggle);
        }

        if (module.settings) {
            module.settings.forEach(setting => {
                settingsBox.append("<br/>");
                settingsBox.append(makeInput(setting, config[module.id][setting.id]));
            });
        }
    });

    settingsBox.on("change", event => {
        const target = $(event.target);

        switch (target.attr("type")) {
            case "checkbox":
                return setConfig(moduleChoose.val(), target.attr("name"), target.prop("checked"));
            default:
                return setConfig(moduleChoose.val(), target.attr("name"), target.val());
        }
    });

    const categoryChoose = $("<select/>");
    categoryChoose.css("width", "30%");
    categoryChoose.append("<option disabled>Choose Category</option>");

    categories.forEach(module => {
        const moduleOpt = $("<option/>");

        moduleOpt.attr("value", module.id);
        moduleOpt.text(module.name)

        categoryChoose.append(moduleOpt);
    });
    categoryChoose.on("change", event => {
        const category = categories.get(event.target.value);
        settingsBox.empty();

        const desc = $(`<legend class = "mooscript_descriptiontext"/>`);
        desc.text(category.description || `You can change modules settings for ${category.name} here.`);
        settingsBox.append(desc);
        moduleChoose.empty();
        modules.forEach(module => {
            if (module.category == category.id) {
                const moduleOpt = $("<option/>");

                moduleOpt.attr("value", module.id);
                moduleOpt.text(module.name)

                moduleChoose.append(moduleOpt);
            }
        });
        moduleChoose.val("information").change();
    });

    categoryChoose.val("main").change();

    hackMenu.append("<legend class = 'mooscript_title' >Options</legend>");
    hackMenu.append(categoryChoose);
    hackMenu.append(moduleChoose);
    hackMenu.append(settingsBox);

    menuWrapper.append(hackMenu);
    gameUI.append(menuWrapper);

    function toggleMenu() {
        menuOpen = !menuOpen;
        setTimeout(() => menuWrapper.css("display", menuOpen ? "block" : "none"), 300 * Number(!menuOpen));
        menuWrapper.animate({
            opacity: menuOpen,
            top: menuOpen ? "50%" : "0%"
        });
    }

    modules.forEach(module => {
        if (module.init) {
            module.init();
        } else {
            console.warn(`Module ${module.id} has no initialization.`);
        }
    });
    for (let key of ["store", "alliance", "menu"]) {
        $(document.getElementById(key + "Button")).on("click", () => {});
    }

    function triggerEquipAlert(name, id) {
        elements.equipChangeAlert.innerHTML = `<div id="flextop"><img id="hatimgmain" src="http://moomoo.io/img/hats/hat_${id}.png">
		             	         <h1 id="changeAlert">Biome Hat Changed!</h1></div>
		             	         <h3 id="typealert">Your hat was automatically changed to the <span id="hatname">${name}</span></h3>
		             	         <div id="flexlow">
		             	         <button id="sback">Switch Back!</button> <button id="okbtn">OK</button>
		             	         </div>`;
        $("#equipChangeAlert").animate({
            opacity: 1,
            top: '20px'
        });
        setTimeout(() => {
            $("#equipChangeAlert").animate({
                opacity: 0,
                top: -300
            });
        }, 5000);
    }

    function disconnectAlert(kicked) {
        $("#accountSign")?.animate({
            opacity: 0,
            top: "0px"
        });
        document.getElementById("accountSign") && setTimeout(() => document.getElementById("accountSign").style.display = "none", 300);
        document.forceConnect = function() {
            localStorage.setItem("force", true);
            window.location.reload();
        }
        elements.serverAlert.innerHTML = `<div id="flextop">
            <h1 class = "menuHeader">${kicked ? "You Are Kicked!" : "Full Server!"}</h1>
            </div>
			<h3 class = "settingRadio" style = "text-align: center;margin-top: 5.5px;">
            ${kicked ? "You are kicked! Would you like to join back?" : "This server is full! Would you like to force connect?"}
            </h3>
			<div style = "display: flex;justify-content: space-evenly;align-items: center;width: 100%;">
            ${kicked ? "" : `<button class = 'mooscript_leftbutton'
            onclick='window.location.reload()'>Back</button>`}
            <button class = "mooscript_rightbutton"
            onclick=${kicked ? "window.location.reload()" : "document.forceConnect()"}>${kicked ? "Join again" : "Yes"}</button>
            </div>`;
        elements.serverAlert.style.display = "block";
        $("#serverAlert").animate({
            opacity: 1,
            top: "50%"
        });
    }
    /*mooscript_server.onopen = function() {
        [null, undefined].includes(localStorage.getItem("mooscript_user")) && function() {
            document.accesSign = function() {
                mooscript_user = {
                    name: $("#userName").val(),
                    id: $("#userID").val(),
                };
                localStorage.setItem("mooscript_user", JSON.stringify(mooscript_user));
                $("#accountSign").animate({
                    opacity: 0,
                    top: "100%"
                });
                setTimeout($("#accountSign").remove, 300);
                mooscript_server._send(JSON.stringify(mooscript_user));
                mooscript_server.onmessage = function({
                    data
                }) {
                    if (data == true) {
                        script.start = true;
                    }
                };
            }
            $("#accountSign").css("display", "block");
            $("#accountSign").animate({
                opacity: 1,
                top: "50%",
                transform: "translate(-50%, -50%)"
            });
        }();
    }*/
}

function appendElements() {
    $("body").after(`

<button onclick="InfoMenu()" id="button-name">Quick Menu</button>
<div id="infoMenu">
</div>
<style>
#button-name {
  position: absolute;
  font-family: 'Hammersmith One';
  font-size: 17.5px;
  color: white;
  background-color: rgba(0, 0, 0, 0);
  width: 120px;
  height: 35px;
  border: 1px solid white;
  border-radius: 25px;
  transform: translate(-50%, -50%);
  top: 20px;
  left: 62.5px;
  transition: 0.3s;
}
#button-name:hover {
  width: 125px;
  height: 40px;
  background-color: rgba(78, 197, 196, 0.2);
}
#infoMenu {
overflow-y: scroll;
overflow-x: hidden;
padding: 20px;
position: absolute;
display: none;
background: rgba(0, 0, 0, 0.25);
border-radius: 4px;
width: 275px;
height: 300px;
top: 50px;
left: 20px;
z-index: 1;
}
</style>
<script>
function InfoMenu() {
let display = document.getElementById("infoMenu").style.display;
document.getElementById("infoMenu").style.display = display == "block" ? "none" : "block"
}
</script>
`);
    let equipChangeAlert = Object.assign(document.createElement("div"), {
        id: "equipChangeAlert",
    });
    document.body.prepend(equipChangeAlert);
    let serverAlert = Object.assign(document.createElement("div"), {
        id: "serverAlert",
    });
    document.body.appendChild(serverAlert);
    $("#serverAlert").css({
        position: "absolute",
        opacity: 0,
        display: "none",
        top: "0",
        left: "50%",
        width: "400px",
        height: "160px",
        transform: "translate(-50%, -50%)",
        "border-radius": "10px",
        "background-color": "rgba(255, 255, 255, 1)",
        "box-shadow": "0 2px 5px 0 rgba(0, 0, 0, 0.08), 0 2px 10px 0 rgba(0, 0, 0, 0.06)",
        "z-index": 2147000000,
    });
    let card = document.querySelector("#setupCard");
    let menuChange = Object.assign(document.createElement("div"), {
        className: "menuCard",
        id: "mooscriptHistory",
        innerHTML: `<div id = "versionHistory">
                                                          <h1 id="historyTitle">MooScript History</h1>
                                                          </div>
                                                          <hr/>
                                                          <div id="endwrap">
                                                          <h3 id="createdEnd">Created by blacky#0020 | <a href="https://discordapp.com/invite/s4F4wZh">Join My Discord</a></h3>
                                                          </div>`,
    });
    document.querySelector("#menuCardHolder").prepend(menuChange);
    for (let key in mooscript_history) {
        let text = `<h3 class="menuPrompt">v${key}:</h3><br><label class = "settingRadio">`;
        mooscript_history[key].reverse().forEach(update => text += `${"> "+update}<br>`);
        text += "</label>";
        document.getElementById("versionHistory").innerHTML += text;
    }
    let openAccountMenu = document.createElement("div");
    card.appendChild(document.createElement("br"));
    openAccountMenu.classList.add("menuButton");
    openAccountMenu.textContent = "Account";
    openAccountMenu.id = "openAccountMenu";
    openAccountMenu.style.width = "48%";
    openAccountMenu.style["background-color"] = "#cc5151";
    openAccountMenu.toggle = false;
    openAccountMenu.onmouseover = function() {
        openAccountMenu.style["background-color"] = "#A43535";
    }
    openAccountMenu.onmouseout = function() {
        openAccountMenu.style["background-color"] = "#cc5151";
    }
    card.appendChild(openAccountMenu);
    let menusButton = document.createElement("div");
    menusButton.classList.add("menuButton");
    menusButton.textContent = "Menu";
    menusButton.id = "_menuButton";
    menusButton.style.width = "48%";
    menusButton.style["background-color"] = "#51CCB2";
    menusButton.onmouseover = function() {
        menusButton.style["background-color"] = "#34AA91";
    }
    menusButton.onmouseout = function() {
        menusButton.style["background-color"] = "#51CCB2";
    }
    menusButton.style["margin-left"] = "158px";
    menusButton.style["margin-top"] = "-41.5px";
    card.appendChild(menusButton);
    var accountSign = Object.assign(document.createElement("div"), {
        id: "accountSign",
    });
    document.body.appendChild(accountSign);
    $("#accountSign").css({
        position: "absolute",
        opacity: 0,
        top: "0px",
        left: "50%",
        width: "400px",
        height: "300px",
        display: "none",
        opacity: 1,
        transform: "translate(-50%, -50%)",
        "border-radius": "10px",
        "background-color": "rgba(255, 255, 255, 1)",
        "box-shadow": "0 2px 5px 0 rgba(0, 0, 0, 0.08), 0 2px 10px 0 rgba(0, 0, 0, 0.06)",
        "z-index": 2147000000,
    });
    accountSign.innerHTML = `<div id="flextop">
            <h1 class = "menuHeader">Do Access To Script</h1>
            </div>
            <h3 class = "settingRadio" style = "text-align: left; margin-left: 2.5%;">
            It is very important for us that you enter the server we have opened. We will add more useful tools with this server in the future.
            </h3>
			<label class = "settingRadio" style = "text-align: left; margin-left: 2.5%;">
            Name:</label><input class = "mooscript_text" value="MooScriptUser" id="userName" maxlength="12" type="text"/><br>
            <label class = "settingRadio" style = "text-align: left; margin-left: 2.5%;">
            ID:</label><input class = "mooscript_text" value="mooscriptuser" id="userID" maxlength="12" type="text"/>
            <br><br>
			<div style = "display: flex;justify-content: space-evenly;align-items: center;width: 100%;">
            <button class = "mooscript_rightbutton"
            onclick="document.accesSign()">Sign</button>
            </div>`;
}

function editElements() {
    document.getElementById("gameName").innerHTML = "MooScript";
    document.getElementById("featuredYoutube").id = "featuredCoders"
    Object.assign(document.getElementById("youtuberOf"), {
        id: "coderOf",
        innerHTML: `
Featured MooCoder:
<br>
<div class="spanLink" id="featuredCoders">
<a id = "featuredCoder" target="_blank" class="ytLink" style = "color: rgb(78, 197, 196);" href="${moohacker[1]}">
<i class="material-icons" style="vertical-align: top;">${ranks[moohacker[2]]}</i> ${moohacker[0]}</a>
</div>
`,
    });
    document.getElementById("featuredCoder").onmouseover = function() {
        document.getElementById("featuredCoder").style.color = "#A43535"
    };
    document.getElementById("featuredCoder").onmouseout = function() {
        document.getElementById("featuredCoder").style.color = "rgb(204, 81, 81)"
    };
}

function deleteElements() {
    document.getElementById("chatButton").remove();
    $("#menuCard").css({
        display: "none"
    });
    $("#promoImgHolder").css({
        display: "none"
    });
    $("#adCard").css({
        display: "none"
    });
}

function appendStyles() {
    $("head").append(`
<style>
.mooscript_rightbutton{font-family: sans-serif;font-weight: 300;border: none;outline: none;font-size: 15px;border-radius: 5px;padding: 9px;cursor: pointer;margin-top: -1.5px;background-color: #73D675;color: white;}
.mooscript_rightbutton:hover{background-color: #4D9C4F}
.mooscript_leftbutton{font-family: sans-serif;font-weight: 300;border: none;outline: none;font-size: 15px;border-radius: 5px;padding: 9px;cursor: pointer;margin-top: -1.5px;background-color: #D67373;color: white;}
.mooscript_leftbutton:hover{background-color: #AF3737}
.mooscript_text{margin-left:20px;height:20px;background-color:#e5e3e3;border-radius:7.5px;bordercolor:#e5e3e3;}
.mooscript_title{margin-top: 10px;font-size:26px;text-transform:uppercase}
.mooscript_descriptiontext{font-size:18px;text-align:left;color:#fff;padding:5px;cursor:pointer;}
#featuredCoders{display: inline-block;margin-top: 0;}
#coderOf{position: absolute;top: 10px;left: 10px;color: #fff;font-size: 24px;}
#gameName {font-size: 120px;text-shadow:0 1px 0 rgb(78, 197, 196), 0 2px 0 rgb(78, 197, 196), 0 3px 0 rgb(78, 197, 196), 0 4px 0 rgb(78, 197, 196), 0 5px 0 rgb(78, 197, 196);color: black;}
#flexlow,
#flextop{justify-content:space-evenly;display:flex;width:100%}
#changeAlert,
#hatimgmain{display:inline-block}
#createEnd,
#endwrap,
#typealert{text-align:center}
#equipChangeAlert,
#infoDiv,
.selectObj,
.selectObjAlert{box-shadow:0 2px 5px 0 rgba(0,0,0,.08),0 2px 10px 0 rgba(0,0,0,.06)}
.selectObjAlert{cursor:pointer;width:100px;height:100px;background-color:#fcfcfc;display:inline-block;border-radius:10px}
#cancelTrip,
#spotDiv{background-color:#cb444a}
#infoDiv,
#spotDiv{position:absolute;right:0}
#hackMenu{background-color: rgb(0, 0, 0, .25);width: 400px;height: 400px;color: white;max-height: calc(100vh - 400px);overflow-y: hidden;display: inline-block;border-radius: 4px;}
#settingsBox{height: 300px;overflow-y: scroll;padding: 25px;text-align: left;font-size: 18px;}
#okbtn,#sback{font-family:sans-serif;font-weight:300;border:none;outline:0;font-size:15px}
#changeAlert,#typealert{font-weight:200;font-family:sans-serif}
#okbtn,
#sback{border-radius:5px;padding:9px;margin-top:-1.5px;color:#fff;cursor:pointer}
#sback{background-color:#d85858}
#okbtn{background-color:#7399d6}
#flexlow{align-items:center}
#changeAlert{font-size:23px}
#typealert{font-size:17px;width:95%;margin-left:2.5%;margin-top:5.5px}
#equipChangeAlert{position:absolute;padding:5px;top:-300px;opacity:0;left:20px;width:300px;height:165px;border-radius:10px;background-color:rgba(255,255,255,.7)}
#hatimgmain{width:50px;height:50px}
#flextop{align-items:center}#tbtn{position:absolute;left:0;top:0;width:80px;height:80px;opacity:0}
.chosenhat,
.chosenwing{border:1px solid #7daaf2}
.inalertHat,
.inalertWing{margin-left:30px!important;margin-top:10px!important}
option{border-radius:0}
#hrule{margin-top:20px}
#endwrap{margin-top:15px;width:100%;margin-bottom:-15px}
#createEnd{width:100%;margin:0 auto}
.lowprompt{margin-bottom:-100px!important}
.lowpromptdetail{margin-left:25px;color:#4c4c4c!important;margin-top:20px!important;margin-bottom:0!important}
.toplow{margin-top:10px!important}
.objplace{width:45px;height:45px;margin-bottom:-17px;border:.5px solid #f2f2f2;border-radius:10px;margin-left:5px;cursor:pointer}
.selPrev{width:80px;height:80px;display:block;margin:10px auto auto}
#cspeed,
#infoDiv,
#middlePlus,
#numfocus,
.menuPrompt{display:inline-block}
#choiceWrap{display:flex;justify-content:space-evenly;align-items:center}
#middlePlus{width:50px;height:50px;font-weight:100;font-family:sans-serif;color:#4a4a4a;opacity:.8}
#mnwrap{width:100%;text-align:center;margin-bottom:-7px;margin-top:8px}
#cspeed,
#currentSpeed,
#numfocus{font-family:sans-serif;font-size:20px}
.keyPressLow{margin-left:8px;margin-right:8px;height:25px;background-color:#fcfcfc;border-radius:3.5px;border:.5px solid #f2f2f2}
.keyPress:focus{border:none;outline:0}
.keyPressLow:focus,
input[type=range]:focus{outline:0}input[type=range]{-webkit-appearance:none;margin-top:0;width:100%}
#healSlider::-webkit-slider-runnable-track{width:100%;height:10px;cursor:pointer;animate:0.2s;background:#ddd;border-radius:5px}
#healSlider::-webkit-slider-thumb{width:25px;height:25px;background:#8ed265;border-radius:12.5px;margin-top:-6.25px;-webkit-appearance:none}
#speedContain{width:80%;height:40px;background-color:#75d679;border-radius:20px;margin-left:10%;box-shadow:1px 1px 4px gray}
#currentSpeed{height:40px;width:100%;text-align:center;color:#fff;font-weight:400!important}
#numfocus{background-color:#fff;color:#75d679;border-radius:20px;margin-right:-24%;padding:10px;font-weight:400}
#cspeed{height:300px;margin-top:0;margin-left:-10px;color:#fff;font-weight:400!important}
#historyTitle,
.menuPrompt{font-family:'Hammersmith One';color:#4a4a4a;margin-top:10px;text-align:center}
.menuPrompt{font-size:18px;flex:0.2}#mooscriptHistory{width:300;height:317px;overflow-y:scroll}
#historyTitle{font-size:32px;width:100%}
#arrivalest,
#autotitle{font-family:sans-serif;font-weight:200}
#rmvMonkey{font-size:16.5px;opacity:.9}
#infoDiv{left:-25%;text-align:center;background-color:rgba(252,252,252,.5)}
#autotitle{font-size:30px}
#arrivalest{font-size:20px}
#botText,
#cancelTrip{font-family:sans-serif;font-weight:300}
#cancelTrip{color:#fff;border:none;border-radius:4px;font-size:17px;cursor:pointer;outline:0;margin-bottom:18px;width:112px;height:33.6px}
#spotDiv{width:10px;height:10px;marginLeft:-5px;marginTop:-5px;opacity:1;left:0;border-radius:5px;z-index:1000}
@media only screen and (max-width:765px){#numfocus{margin-right:-13%}}
#botText{color:#5aed57;font-size:20px}
</style>
`);
}
var Player = class {
    constructor() {
        this.alive = true;
        this.isPlayer = true;
        this.forcePos = true;
        this.isVisible = true;
        this.differenceBetweenUpdate = 0;
        this.updateTime = 0;
        this.oldUpdateTime = 0;
        this.lastHit = 0;
        this.id = null;
        this.sid = null;
        this.y = 0;
        this.x = 0;
        this.dir = 0;
        this.smooth = {
            x: 0,
            oldX: 0,
            y: 0,
            oldY: 0,
            dir: 0,
            oldDir: 0,
        };
        this.team = {
            id: null,
            leader: null,
        };
        this.iconIndex = null;
        this.zIndex = null;
        this.skinIndex = 0;
        this.tailIndex = 0;
        this.skin = {};
        this.tail = {};
        this.skins = [];
        this.tails = [];
        this.last = {
            bleed: {
                value: 0,
                time: 0,
                healed: true,
            },
            regen: {
                value: 0,
                time: 0,
            },
        };
        this.shame = {
            count: 0,
            timer: 30.000,
        };
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.shootCount = 0;
        this.shootRate = 2500;
        this.reloads = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.weaponIndex = 0;
        this.weaponVariant = 0;
        this.inTrap = null;
        this.weapons = [{
            index: 0,
            variantIndex: 0,
        }, {
            index: null,
            variantIndex: 0,
        }, ];
        this.changeHealth = function(newValue) {
            let difference = newValue - this.health;
            this.health = newValue;
            if (difference < 0) {
                this.last.bleed = {
                    value: difference,
                    time: Date.now(),
                    healed: false,
                };
                if (this == myPlayer) {
                    user.last.bleed.healed = false;
                }
            } else {
                this.last.regen = {
                    value: difference,
                    time: Date.now(),
                };
                if (!this.last.bleed.healed) {
                    if (Date.now() - this.last.bleed.time < 120) this.shame.count++;
                    else this.shame.count = Math.max(0, this.shame.count - 2);
                    this.last.bleed.healed = true;
                }
            }
        };
        this.gather = function(weaponIndex, didHit) {
            this.lastHit = Date.now();
            this.reloads[weaponIndex] = items.weapons[weaponIndex].speed;
            this.weapons[Number(weaponIndex > 8)].index = weaponIndex;
            sPManager.add("33", () => {
                let tmpObj = players.find(({sid}) => sid == this.sid);
                let weaponVariant = tmpObj.weapons[Number(weaponIndex > 8)].variantIndex;
                let weaponDamage = items.weapons[weaponIndex].dmg * items.weaponVariants[weaponVariant].val;
                didHit && buildings.filter(obj => obj.isActive && obj.id && Date.now() - obj.lastWiggle < 100 && tmpObj.to(obj).distance <= items.weapons[weaponIndex].range + obj.scale && utils.getAngleDist(tmpObj.dir, tmpObj.to(obj).direction) <= Math.PI / 2.6).forEach(obj => {
                    let damage = weaponDamage * (items.weapons[weaponIndex]?.sDmg || 1) * (tmpObj.skin?.bDmg || 1);
                    obj.health = Math.max(0, obj.health - damage);
                });
                return true;
            });
        };
        this.to = function(tmpObj) {
            if (!tmpObj) return {
                direction: this == myPlayer ? mouse.direction() : this.dir,
                distance: 0
            };
            return {
                distance: Math.hypot(tmpObj.y - this.y, tmpObj.x - this.x),
                direction: Math.atan2(tmpObj.y - this.y, tmpObj.x - this.x),
            };
        };
        this.updatePlayer = function(data) {
            var now = Date.now();
            this.isVisible = true;
            this.alive = true;
            let [sid, x, y, dir, buildIndex, weaponIndex, weaponVariant, team, isLeader, skinIndex, tailIndex, iconIndex, zIndex] = data;
            team = {
                id: team,
                leader: isLeader ? sid : this.team.leader,
            }
            let skin = store.skins[skinIndex], tail = store.tails[tailIndex];
            this.weapons[Number(weaponIndex > 8)] = {
                index: weaponIndex,
                variantIndex: weaponVariant,
            };
            if (this.tailIndex != tailIndex) {
                this.tailIndex = tailIndex;
                this.tails[tailIndex] = true;
            }
            if (this.skinIndex != skinIndex) {
                this.skinIndex = skinIndex;
                this.skins[skinIndex] = true;
                if (skinIndex == 45) {
                    this.shame.count = "-";
                } else if (this.shame.count == "-") this.shame.count = 0;
            }
            this.inTrap = buildings.find(obj => obj.isActive && obj.id == 15 && obj.ownerSid != this.sid && obj.owner().team != this.team && (myPlayerSid == this.sid ? !alliancePlayers.includes(obj.ownerSid) : true) && obj.to(this).distance <= 50);
            this.oldUpdateTime = now.updateTime
            this.updateTime = now;
            this.smooth.oldX = this.smooth.x;
            this.smooth.oldY = this.smooth.y;
            this.differenceBetweenUpdate = 0;
            Object.assign(this, {
                sid,
                x,
                y,
                dir,
                buildIndex,
                weaponIndex,
                weaponVariant,
                team,
                skinIndex,
                skin,
                tailIndex,
                tail,
                iconIndex,
                zIndex,
            });
        };
        this.setData = function(data) {
            Object.assign(this, {
                differenceBetweenUpdate: 0,
                updateTime: 0,
                oldUpdateTime: 0,
                y: 0,
                x: 0,
                dir: 0,
                smooth: {
                    x: 0,
                    oldX: 0,
                    y: 0,
                    oldY: 0,
                    dir: 0,
                    oldDir: 0,
                },
                iconIndex: null,
                skinIndex: 0,
                tailIndex: 0,
                skin: {},
                tail: {},
                last: {
                    bleed: {
                        value: 0,
                        time: 0,
                        healed: true,
                    },
                    regen: {
                        value: 0,
                        time: 0,
                    },
                },
                shame: {
                    count: 0,
                    timer: 30.000,
                },
                maxHealth: 100,
                reloads: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                weaponIndex: 0,
                weaponVariant: 0,
                weapons: [{
                    index: 0,
                    variantIndex: 0,
                }, {
                    index: null,
                    variantIndex: 0,
                }, ],
            });
            this.id = data[0];
            this.sid = data[1];
            this.name = data[2];
            this.smooth.x = data[3];
            this.smooth.y = data[4];
            this.smooth.dir = data[5];
            this.health = data[6];
            this.maxHealth = data[7];
            this.scale = data[8];
            this.skinColor = data[9];
            this.forcePos = true;
            this.isVisible = true;
            this.alive = true;
        };
        this.canBuild = function(obj, dir) {
            if (typeof obj != "object") return;
            let far = this.scale + obj.scale + (obj.placeOffset || 0),
                x = this.x + far * Math.cos(dir),
                y = this.y + far * Math.sin(dir);
            return buildingManager.checkItemLocation(x, y, obj.scale, 1, obj.id, !1, this);
        }
        this.canShotTo = (other, ...args) => {
            let toOther = this.to(other);
            let isTurret = args.find(index => index == 1);
            if(isTurret && !this.isProjectile){
                if(this.shootCount) return false;
                if(this.isPlayer && (this.sid == myPlayerSid ? !user.skins[53] && user.points < 10000 : !this.skins[53] && !this.points < 10000)) return false;
                if(other.isPlayer && other.skinIndex == 22) return false;
            }
            let minRange;
            if (args.every(indx => {
                if(toOther.distance + this.scale <= items.projectiles[indx].range) {
                    if(!minRange) minRange = items.projectiles[indx].range;
                    if(items.projectiles[indx].range < minRange) minRange = items.projectiles[indx].range;
                }
                return true;
            }) && toOther.distance + this.scale > minRange) return false;
            for(let tmpObj of buildings.filter(obj =>
                                               obj.isActive
                                               && !obj.ignoreCollision
                                               && (isTurret && obj.id ? obj.group.id == 3 || obj.id == 17 : true)
                                               && Math.abs(toOther.direction-this.to(obj).direction) <= obj.scale * Math.PI / 180
                                               && this.to(obj).distance + obj.scale <= toOther.distance - other.scale
                                              )){
                let x = this.x + Math.cos(toOther.direction) * this.to(tmpObj).distance;
                let y = this.y + Math.sin(toOther.direction) * this.to(tmpObj).distance;
                if(utils.lineInRect(tmpObj.x - tmpObj.scale, tmpObj.y - tmpObj.scale, tmpObj.x + tmpObj.scale, tmpObj.y + tmpObj.scale, x, y, x, y)){
                    return tmpObj;
                }
            }
            return true;
        };
    }
};
var Build = class {
    constructor() {
        this.isBuilding = true;
        this.isActive = true;
        this.lastWiggle = 0;
        this.isItem = ![null, undefined].includes(this.id);
        this.owner = function() {
            return players.find(tmpObj => tmpObj.sid == this.ownerSid);
        };
        this.changeHealth = function(value) {};
        this.getScale = function(e, t) {
            return e = e || 1;
            this.scale * (this.isItem || 2 == this.type || 3 == this.type || 4 == this.type ? 1 : .6 * e) * (t ? 1 : this.colDiv)
        }
        this.to = function(tmpObj) {
            if (!tmpObj) return {
                direction: 0,
                distance: 0
            };
            return {
                distance: Math.hypot(tmpObj.y - this.y, tmpObj.x - this.x),
                direction: Math.atan2(tmpObj.y - this.y, tmpObj.x - this.x),
            };
        };
        this.canShotTo = (other, ...args) => {
            let toOther = this.to(other);
            let isTurret = args.find(index => index == 1);
            if(isTurret && !this.isProjectile){
                if(this.shootCount) return false;
                if(this.isPlayer && (this.sid == myPlayerSid ? !user.skins[53] && user.points < 10000 : !this.skins[53] && !this.points < 10000)) return false;
                if(other.isPlayer && other.skinIndex == 22) return false;
            }
            let minRange;
            if (args.every(indx => {
                if(toOther.distance + this.scale <= items.projectiles[indx].range) {
                    if(!minRange) minRange = items.projectiles[indx].range;
                    if(items.projectiles[indx].range < minRange) minRange = items.projectiles[indx].range;
                }
                return true;
            }) && toOther.distance + this.scale > minRange) return false;
            for(let tmpObj of buildings.filter(obj =>
                                               obj.isActive
                                               && !obj.ignoreCollision
                                               && (isTurret && obj.id ? obj.group.id == 3 || obj.id == 17 : true)
                                               && Math.abs(toOther.direction-this.to(obj).direction) <= obj.scale * Math.PI / 180
                                               && this.to(obj).distance + obj.scale <= toOther.distance - other.scale
                                              )){
                let x = this.x + Math.cos(toOther.direction) * this.to(tmpObj).distance;
                let y = this.y + Math.sin(toOther.direction) * this.to(tmpObj).distance;
                if(utils.lineInRect(tmpObj.x - tmpObj.scale, tmpObj.y - tmpObj.scale, tmpObj.x + tmpObj.scale, tmpObj.y + tmpObj.scale, x, y, x, y)){
                    return tmpObj;
                }
            }
            return true;
        };
    }
};
var Projectile = class {
    constructor() {
        this.isProjectile = true;
        this.isActive = true;
        this.skipMove = true;
        this.owner = function() {
            return players.find(tmpObj => tmpObj.sid == this.ownerSid);
        };
        this.update = function(delta) {
            if (this.isActive) {
                let tmpSpeed = this.speed * delta;
                if (!this.skipMove) {
                    this.x += tmpSpeed * Math.cos(this.dir);
                    this.y += tmpSpeed * Math.sin(this.dir);
                    this.range -= tmpSpeed;
                    if (this.to(myPlayer).distance <= 300 && this.canShotTo(myPlayer, this.indx)) {
                        if (!script.projectile_blocker.active && config.projectile_blocker.enabled && inv.weapons[1] == 11 && this.ownerSid != myPlayerSid && !alliancePlayers.includes(this.ownerSid)) {
                            script.projectile_blocker.active = true;
                            script.projectile_blocker.projectile = this;
                            auto.aim.start();
                            auto.aim.direction = () => {
                                return myPlayer.to(script.projectile_blocker.projectile).direction;
                            };
                            game.watch(auto.aim.direction());
                            auto.choose.start(() => {
                                return 11;
                            }, 1);
                        }
                    }
                    if (this.range <= 0) {
                        this.x += this.range * Math.cos(this.dir);
                        this.y += this.range * Math.sin(this.dir);
                        tmpSpeed = 1;
                        this.range = 0;
                        this.isActive = false;
                    }
                } else {
                    this.skipMove = false;
                }
            }
        };
        this.to = function(tmpObj) {
            if (!tmpObj) return {
                direction: this.dir,
                distance: 0
            };
            return {
                distance: Math.hypot(tmpObj.y - this.y, tmpObj.x - this.x),
                direction: Math.atan2(tmpObj.y - this.y, tmpObj.x - this.x),
            };
        };
        this.canShotTo = (other, ...args) => {
            let toOther = this.to(other);
            let isTurret = args.find(index => index == 1);
            if(Math.abs(toOther.direction-this.dir) > other.scale * Math.PI / 180) return false;
            if (args.every(indx => {
                if(toOther.distance + this.scale <= this.range) return false;
                return true;
            })) return false;
            for(let tmpObj of buildings.filter(obj =>
                                               obj.isActive
                                               && !obj.ignoreCollision
                                               && (isTurret && obj.id ? obj.group.id == 3 || obj.id == 17 : true)
                                               && Math.abs(toOther.direction-this.to(obj).direction) <= obj.scale * Math.PI / 180
                                               && this.to(obj).distance + obj.scale <= toOther.distance - other.scale
                                              )){
                let x = this.x + Math.cos(toOther.direction) * this.to(tmpObj).distance;
                let y = this.y + Math.sin(toOther.direction) * this.to(tmpObj).distance;
                if(utils.lineInRect(tmpObj.x - tmpObj.scale, tmpObj.y - tmpObj.scale, tmpObj.x + tmpObj.scale, tmpObj.y + tmpObj.scale, x, y, x, y)){
                    return tmpObj;
                }
            }
            return true;
        };
    }
};
