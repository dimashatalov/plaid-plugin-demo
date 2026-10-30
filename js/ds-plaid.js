/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/button.js":
/*!**********************!*\
  !*** ./js/button.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Button)\n/* harmony export */ });\n/*\r\n    settings = {\r\n        \"disabled\" : false,\r\n        \"waiting\"  : false,\r\n        onClick    : function() {\r\n            console.log(\"works\");\r\n        } \r\n    }\r\n\r\n    Button.enable()   \r\n    Button.disable();\r\n    Button.wait();\r\n    Button.stopWaiting();\r\n*/\r\n\r\nclass Button {\r\n    constructor(node, settings) {\r\n        this.args = [];\r\n        this.set(\"node\", node);\r\n\r\n        this.applySettings(settings);\r\n        this.listenClicks();\r\n\r\n        this.run();\r\n    }\r\n\r\n    run() {\r\n        if (this.get(\"disabled\") === true) {\r\n            this.disable();\r\n        }\r\n        else {\r\n            this.enable();\r\n        }\r\n\r\n        if (this.get(\"waiting\") === true) {\r\n            this.wait();\r\n        }\r\n        else {\r\n            this.stopWaiting();\r\n        }        \r\n    }\r\n\r\n    enable() {\r\n        let node = this.get(\"node\");\r\n        node.classList.remove(\"disabled\");\r\n        this.set(\"disabled\", false);\r\n    }\r\n\r\n    disable() {\r\n        let node = this.get(\"node\");\r\n        node.classList.add(\"disabled\");\r\n        this.set(\"disabled\", true);\r\n    }\r\n\r\n    wait() {\r\n        let node = this.get(\"node\");\r\n        node.classList.add(\"waiting\");\r\n        this.set(\"waiting\", true);\r\n    }\r\n\r\n    stopWaiting() {\r\n        let node = this.get(\"node\");\r\n        node.classList.remove(\"waiting\");\r\n        this.set(\"waiting\", false);\r\n    }\r\n\r\n    listenClicks() {\r\n     \r\n        let node = this.get(\"node\");\r\n        \r\n        let onClick = this.onClick.bind(this);\r\n        node.addEventListener(\"click\", onClick);\r\n        \r\n\r\n    }   \r\n    \r\n    onClick() {\r\n        \r\n        if (this.get(\"disabled\") === true) {\r\n            return false;\r\n        }\r\n\r\n        if (this.get(\"waiting\") === true) {\r\n            return false;\r\n        }\r\n\r\n\r\n        this.wait();\r\n        \r\n        this.get(\"onClick\")(this);\r\n        \r\n    }    \r\n\r\n\r\n    applySettings(settings) {\r\n\r\n        let defaultSettings = {\r\n            \"disabled\" : false,\r\n            \"waiting\"  : false,\r\n            onClick    : function() {\r\n                console.log(\"works\");\r\n            } \r\n        }\r\n        \r\n        for (let i in defaultSettings) {\r\n            this.set(i, defaultSettings[i]);\r\n        }\r\n\r\n        for (let i in settings) {\r\n            this.set(i, settings[i]);\r\n        }\r\n    }\r\n\r\n\r\n    get(k) {\r\n        if (typeof this.args[k] == \"undefined\")\r\n            return false;\r\n        else \r\n            return this.args[k];\r\n    }\r\n\r\n    set(k, v) {\r\n        this.args[k] = v;\r\n    }\r\n}\n\n//# sourceURL=webpack://DSPlaidLibrary/./js/button.js?");

/***/ }),

/***/ "./js/ds-plaid.js":
/*!************************!*\
  !*** ./js/ds-plaid.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _button_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./button.js */ \"./js/button.js\");\n\r\n\r\nclass DsPlaid {\r\n    constructor() {\r\n        /*this.headLineMenu       = new HeadLineMenu();\r\n        this.brandSlider        = new BrandSlider();\r\n        this.productSlider      = new ProductSlider();\r\n        this.productShowMore    = new ProductShowMore();\r\n        this.productFooterCart        = new ProductFooterCart();\r\n        */\r\n\r\n        this.reset();\r\n \r\n    }\r\n\r\n    reset() {\r\n        this.callbacks = {\r\n            \"auth\" : [],\r\n            \"identity\" : [],\r\n            \"exit\" :[], \r\n            \"OPEN\" : [],\r\n            \"IDENTITY_VERIFICATION_START_STEP\" : [],\r\n            \"IDENTITY_VERIFICATION_PASS_SESSION\" : [], \r\n            \"IDENTITY_VERIFICATION_CLOSE_UI\" : [],\r\n            \"IDENTITY_VERIFICATION_FAIL_SESSION\" : [],\r\n            \"HANDOFF\" : []\r\n        }   \r\n\r\n        this.onSuccessStatus = 0;\r\n        this.uuid = false;\r\n        this.requestId = false;\r\n        this.link_session_id = false;        \r\n    }\r\n\r\n    async run() {\r\n        \r\n        \r\n        var self = this;\r\n\r\n        if (this.isPlaidLibraryReady() === false) {\r\n            // Relaunch if plaid library is not loaded\r\n            setTimeout(function() {\r\n                self.run();\r\n            }, 1000);\r\n\r\n            return false;\r\n        }\r\n        else {\r\n            \r\n        }\r\n\r\n        if (this.isPlaidContainer() === false) {\r\n            return false;\r\n        }\r\n\r\n        this.uuid = this.getCookie(\"user_uuid\");\r\n \r\n        if (typeof this.uuid == \"undefined\") {\r\n            return false;\r\n        }\r\n\r\n\r\n        this.listenEvents();\r\n\r\n\r\n        //await this.makeLink();\r\n        //this.initLink();\r\n//        this.initLink();\r\n\r\n      \r\n    }\r\n\r\n    listenEvents() {\r\n        let nodes = [...document.querySelectorAll(\".action__verify-identity\")];\r\n\r\n        nodes.map((node) => {\r\n            let onIdentifyClick = this.onIdentifyClick.bind(this);\r\n            node.Button = new _button_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](node, {\r\n                onClick : async function(button) {\r\n                    onIdentifyClick();\r\n                }\r\n            });\r\n\r\n        });\r\n    }\r\n\r\n    async onIdentifyClick() {\r\n        await this.makeLink();\r\n        this.initLink();\r\n    }\r\n\r\n\r\n    getValue() {\r\n\r\n    }\r\n\r\n\r\n    async start() {\r\n        await this.makeLink();\r\n        this.initLink();\r\n    }\r\n\r\n    async startDocumentVerification() {\r\n        await this.makeIdentityVerificationLink();\r\n        this.initLink();\r\n    }\r\n\r\n    async makeLink() {\r\n\r\n       \r\n        let inputs = {\r\n            ds_plaid  : \"token-create\",\r\n            user_uuid : this.uuid\r\n        };\r\n        \r\n        const rawResponse = await fetch(location.href, {\r\n            method: 'POST',\r\n            headers: {\r\n                'Accept': 'application/json',\r\n                'Content-Type': 'application/json'\r\n                },\r\n            body: JSON.stringify(inputs)\r\n        });\r\n        \r\n        const content = await rawResponse.json();\r\n            \r\n        this.linkToken = content.link_token;\r\n\r\n\r\n        return content;\r\n                    \r\n    }\r\n\r\n\r\n    async makeIdentityVerificationLink() {\r\n\r\n       \r\n        let inputs = {\r\n            ds_plaid  : \"token-create__identity-verification\",\r\n            user_uuid : this.requestId\r\n        };\r\n        \r\n        const rawResponse = await fetch(location.href, {\r\n            method: 'POST',\r\n            headers: {\r\n                'Accept': 'application/json',\r\n                'Content-Type': 'application/json'\r\n                },\r\n            body: JSON.stringify(inputs)\r\n        });\r\n        \r\n        const content = await rawResponse.json();\r\n  \r\n\r\n        this.linkToken = content.link_token;\r\n        this.requestId = content.request_id;\r\n        \r\n        return content;\r\n                    \r\n    }    \r\n\r\n    \r\n\r\n    getCookie(name) {\r\n        \r\n        const value = `; ${document.cookie}`;\r\n        const parts = value.split(`; ${name}=`);\r\n        if (parts.length === 2) return parts.pop().split(';').shift();\r\n\r\n        return false;\r\n    }    \r\n\r\n\r\n    async getIdentity(publicToken, accountID, linkSessionID = null) {                \r\n       \r\n        let inputs = {\r\n            ds_plaid    : \"get-identity\",\r\n            user_uuid   : this.uuid,\r\n            publicToken : publicToken,\r\n            accountID   : accountID,\r\n\r\n        };\r\n\r\n        if (linkSessionID && linkSessionID != false) {\r\n            inputs = {\r\n                ds_plaid    : \"get-identity\",\r\n                user_uuid   : this.uuid,\r\n                link_session_id : linkSessionID\r\n            }\r\n        }\r\n        \r\n        const rawResponse = await fetch(location.href, {\r\n            method: 'POST',\r\n            headers: {\r\n                'Accept': 'application/json',\r\n                'Content-Type': 'application/json'\r\n                },\r\n            body: JSON.stringify(inputs)\r\n        });\r\n        \r\n        const content = await rawResponse.json();\r\n        this.launchCallBacks(\"identity\", content);\r\n        \r\n        \r\n        this.linkToken = content.link_token;\r\n\r\n       // location.href = location.href;\r\n\r\n        return content;  \r\n    }\r\n\r\n\r\n    async getAuth(publicToken, accountID) {\r\n       \r\n        let inputs = {\r\n            ds_plaid    : \"get-auth\",\r\n            user_uuid   : this.uuid,\r\n            publicToken : publicToken,\r\n            accountID   : accountID\r\n\r\n        };\r\n        \r\n        const rawResponse = await fetch(location.href, {\r\n            method: 'POST',\r\n            headers: {\r\n                'Accept': 'application/json',\r\n                'Content-Type': 'application/json'\r\n                },\r\n            body: JSON.stringify(inputs)\r\n        });\r\n        \r\n        const content = await rawResponse.json();\r\n        \r\n        \r\n        console.log(\"getAuth\", content);\r\n        this.launchCallBacks(\"auth\", content);\r\n        \r\n        this.linkToken = content.link_token;\r\n\r\n        //location.href = location.href;\r\n\r\n        return content;  \r\n    }\r\n\r\n    listen(event, f) {\r\n        this.callbacks[event].push(f);\r\n    }\r\n\r\n    launchCallBacks(event, content) {\r\n        for (let i in this.callbacks[event]) {\r\n            this.callbacks[event][i](content);\r\n        }\r\n    }\r\n\r\n \r\n    async getIdentifiedPersondata() {\r\n\r\n        let inputs = {\r\n            ds_plaid     : \"get-verified-identity\",\r\n            request_id   : this.requestId,\r\n            link_session_id   : this.link_session_id,\r\n            user_uuid : this.uuid\r\n        };\r\n\r\n    \r\n        const rawResponse = await fetch(location.href, {\r\n            method: 'POST',\r\n            headers: {\r\n                'Accept': 'application/json',\r\n                'Content-Type': 'application/json'\r\n                },\r\n            body: JSON.stringify(inputs)\r\n        });\r\n        \r\n        const content = await rawResponse.json();\r\n\r\n        this.launchCallBacks(\"identity\", content);\r\n \r\n        \r\n    }\r\n\r\n \r\n    initLink() {\r\n\r\n        var self = this; \r\n        this.plaidHandler?.destroy?.();  \r\n        this.plaidHandler = Plaid.create({\r\n            token: this.linkToken, \r\n            onSuccess: (public_token, metadata) => {\r\n                self.onSuccessStatus = 1;\r\n                if (typeof metadata.link_session_id != \"undefined\" && typeof metadata.account_id == \"undefined\") {\r\n                    \r\n                    self.link_session_id = metadata.link_session_id;\r\n                    self.getIdentifiedPersondata();                    \r\n                                       \r\n                }\r\n                else {\r\n                    self.getIdentity(public_token, metadata.account_id);\r\n                    self.getAuth(public_token, metadata.account_id);\r\n                }\r\n\r\n                \r\n\r\n                //console.log([\"[plaidHandler.create.metadata.account_id\"], public_token, metadata.account_id);\r\n                //console.log([\"[plaidHandler.create.onSuccess\"], public_token, metadata);\r\n            },\r\n            onLoad: () => {\r\n              \r\n            },\r\n            onExit: (err, metadata) => {\r\n                console.log([\"[plaidHandler.create.onExit\"], err, metadata);\r\n\r\n                self.launchCallBacks(\"exit\", self.onSuccessStatus );\r\n            },\r\n                        \r\n            onEvent: (eventName, metadata) => {\r\n                console.log([\"[plaidHandler.create.onEvent\"], eventName, metadata);\r\n\r\n                if (typeof self.callbacks[eventName] != \"undefined\") {\r\n                    self.launchCallBacks(eventName, {eventName : eventName, metaData : metadata});\r\n                } \r\n                \r\n            },\r\n        });   \r\n        \r\n        this.plaidHandler.open();\r\n    }\r\n\r\n\r\n \r\n\r\n    isPlaidContainer() {\r\n        let nodes = document.querySelectorAll(\".action__verify-identity\");\r\n\r\n        if (nodes.length > 0) {\r\n            return true;\r\n        }\r\n        else {\r\n            return false;\r\n        }\r\n    }\r\n\r\n    isPlaidLibraryReady() {\r\n        if (typeof Plaid != \"undefined\") {\r\n            return true;\r\n        }\r\n        else {\r\n            return false;\r\n        }\r\n    }\r\n}\r\n\r\n\r\nvar  plaid = new DsPlaid();\r\nsetTimeout(function() {\r\n    plaid.run();\r\n}, 1000);\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plaid);\r\n\n\n//# sourceURL=webpack://DSPlaidLibrary/./js/ds-plaid.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./js/ds-plaid.js");
/******/ 	window.DSPlaidLibrary = __webpack_exports__;
/******/ 	
/******/ })()
;