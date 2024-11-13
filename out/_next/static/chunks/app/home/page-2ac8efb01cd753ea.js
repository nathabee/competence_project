(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[951],{17133:(e,t,r)=>{Promise.resolve().then(r.bind(r,37669))},91449:(e,t)=>{"use strict";t.parse=function(e,t){if("string"!=typeof e)throw TypeError("argument str must be a string");for(var i={},o=e.split(";"),n=(t||{}).decode||r,s=0;s<o.length;s++){var a=o[s],c=a.indexOf("=");if(!(c<0)){var u=a.substring(0,c).trim();if(void 0==i[u]){var l=a.substring(c+1,a.length).trim();'"'===l[0]&&(l=l.slice(1,-1)),i[u]=function(e,t){try{return t(e)}catch(t){return e}}(l,n)}}}return i},t.serialize=function(e,t,r){var n=r||{},s=n.encode||i;if("function"!=typeof s)throw TypeError("option encode is invalid");if(!o.test(e))throw TypeError("argument name is invalid");var a=s(t);if(a&&!o.test(a))throw TypeError("argument val is invalid");var c=e+"="+a;if(null!=n.maxAge){var u=n.maxAge-0;if(isNaN(u)||!isFinite(u))throw TypeError("option maxAge is invalid");c+="; Max-Age="+Math.floor(u)}if(n.domain){if(!o.test(n.domain))throw TypeError("option domain is invalid");c+="; Domain="+n.domain}if(n.path){if(!o.test(n.path))throw TypeError("option path is invalid");c+="; Path="+n.path}if(n.expires){if("function"!=typeof n.expires.toUTCString)throw TypeError("option expires is invalid");c+="; Expires="+n.expires.toUTCString()}if(n.httpOnly&&(c+="; HttpOnly"),n.secure&&(c+="; Secure"),n.sameSite)switch("string"==typeof n.sameSite?n.sameSite.toLowerCase():n.sameSite){case!0:case"strict":c+="; SameSite=Strict";break;case"lax":c+="; SameSite=Lax";break;case"none":c+="; SameSite=None";break;default:throw TypeError("option sameSite is invalid")}return c};var r=decodeURIComponent,i=encodeURIComponent,o=/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/},70277:function(e,t,r){"use strict";var i=this&&this.__assign||function(){return(i=Object.assign||function(e){for(var t,r=1,i=arguments.length;r<i;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0}),t.destroyCookie=t.setCookie=t.parseCookies=void 0;var o=r(91449),n=r(70148),s=r(70800);function a(e,t){var r,i;return(null===(i=null===(r=null==e?void 0:e.req)||void 0===r?void 0:r.headers)||void 0===i?void 0:i.cookie)?o.parse(e.req.headers.cookie,t):s.isBrowser()?o.parse(document.cookie,t):{}}function c(e,t,r,a){var c,u;if(void 0===a&&(a={}),(null===(c=null==e?void 0:e.res)||void 0===c?void 0:c.getHeader)&&e.res.setHeader){if(null===(u=null==e?void 0:e.res)||void 0===u?void 0:u.finished)return console.warn('Not setting "'+t+'" cookie. Response has finished.'),console.warn("You should set cookie before res.send()"),{};var l=e.res.getHeader("Set-Cookie")||[];"string"==typeof l&&(l=[l]),"number"==typeof l&&(l=[]);var p=n.parse(l,{decodeValues:!1}),f=s.createCookie(t,r,a),d=[];p.forEach(function(e){if(!s.areCookiesEqual(e,f)){var t=o.serialize(e.name,e.value,i({encode:function(e){return e}},e));d.push(t)}}),d.push(o.serialize(t,r,a)),e.res.setHeader("Set-Cookie",d)}if(s.isBrowser()){if(a&&a.httpOnly)throw Error("Can not set a httpOnly cookie in the browser.");document.cookie=o.serialize(t,r,a)}return{}}function u(e,t,r){return c(e,t,"",i(i({},r||{}),{maxAge:-1}))}t.parseCookies=a,t.setCookie=c,t.destroyCookie=u,t.default={set:c,get:a,destroy:u}},70800:function(e,t){"use strict";var r=this&&this.__assign||function(){return(r=Object.assign||function(e){for(var t,r=1,i=arguments.length;r<i;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)};function i(e,t){var r=Object.getOwnPropertyNames(e),i=Object.getOwnPropertyNames(t);if(r.length!==i.length)return!1;for(var o=0;o<r.length;o++){var n=r[o];if(e[n]!==t[n])return!1}return!0}Object.defineProperty(t,"__esModule",{value:!0}),t.areCookiesEqual=t.hasSameProperties=t.createCookie=t.isBrowser=void 0,t.isBrowser=function(){return"undefined"!=typeof window},t.createCookie=function(e,t,i){var o=i.sameSite;!0===o&&(o="strict"),(void 0===o||!1===o)&&(o="lax");var n=r(r({},i),{sameSite:o});return delete n.encode,r({name:e,value:t},n)},t.hasSameProperties=i,t.areCookiesEqual=function(e,t){var o=e.sameSite===t.sameSite;return"string"==typeof e.sameSite&&"string"==typeof t.sameSite&&(o=e.sameSite.toLowerCase()===t.sameSite.toLowerCase()),i(r(r({},e),{sameSite:void 0}),r(r({},t),{sameSite:void 0}))&&o}},70148:e=>{"use strict";var t={decodeValues:!0,map:!1,silent:!1};function r(e){return"string"==typeof e&&!!e.trim()}function i(e,i){var o,n,s,a,c=e.split(";").filter(r),u=(o=c.shift(),n="",s="",(a=o.split("=")).length>1?(n=a.shift(),s=a.join("=")):s=o,{name:n,value:s}),l=u.name,p=u.value;i=i?Object.assign({},t,i):t;try{p=i.decodeValues?decodeURIComponent(p):p}catch(e){console.error("set-cookie-parser encountered an error while decoding a cookie with value '"+p+"'. Set options.decodeValues to false to disable this feature.",e)}var f={name:l,value:p};return c.forEach(function(e){var t=e.split("="),r=t.shift().trimLeft().toLowerCase(),i=t.join("=");"expires"===r?f.expires=new Date(i):"max-age"===r?f.maxAge=parseInt(i,10):"secure"===r?f.secure=!0:"httponly"===r?f.httpOnly=!0:"samesite"===r?f.sameSite=i:"partitioned"===r?f.partitioned=!0:f[r]=i}),f}function o(e,o){if(o=o?Object.assign({},t,o):t,!e)return o.map?{}:[];if(e.headers){if("function"==typeof e.headers.getSetCookie)e=e.headers.getSetCookie();else if(e.headers["set-cookie"])e=e.headers["set-cookie"];else{var n=e.headers[Object.keys(e.headers).find(function(e){return"set-cookie"===e.toLowerCase()})];n||!e.headers.cookie||o.silent||console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."),e=n}}return(Array.isArray(e)||(e=[e]),(o=o?Object.assign({},t,o):t).map)?e.filter(r).reduce(function(e,t){var r=i(t,o);return e[r.name]=r,e},{}):e.filter(r).map(function(e){return i(e,o)})}e.exports=o,e.exports.parse=o,e.exports.parseString=i,e.exports.splitCookiesString=function(e){if(Array.isArray(e))return e;if("string"!=typeof e)return[];var t,r,i,o,n,s=[],a=0;function c(){for(;a<e.length&&/\s/.test(e.charAt(a));)a+=1;return a<e.length}for(;a<e.length;){for(t=a,n=!1;c();)if(","===(r=e.charAt(a))){for(i=a,a+=1,c(),o=a;a<e.length&&"="!==(r=e.charAt(a))&&";"!==r&&","!==r;)a+=1;a<e.length&&"="===e.charAt(a)?(n=!0,a=o,s.push(e.substring(t,i)),t=a):a=i+1}else a+=1;(!n||a>=e.length)&&s.push(e.substring(t,e.length))}return s}},37669:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>n});var i=r(57437);r(2265);var o=r(53481);let n=()=>{let e=(0,o.Z)();return(0,i.jsxs)("div",{className:"container mt-3 ml-2",children:[(0,i.jsx)("h1",{children:e("welcome")}),(0,i.jsxs)("p",{children:["News : ",e("news")]})]})}},53481:(e,t,r)=>{"use strict";r.d(t,{Z:()=>n});var i=r(72609);let o=(e,t)=>e.replace(/\{(\w+)\}/g,(e,r)=>t[r]||"{".concat(r,"}")),n=()=>{let{translations:e}=(0,i.a)();return function(t){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=e[t];return i?o(i,r):"".concat(t)}}},49714:(e,t,r)=>{"use strict";r.d(t,{o:()=>o});class i extends Error{}function o(e,t){let r;if("string"!=typeof e)throw new i("Invalid token specified: must be a string");t||(t={});let o=!0===t.header?0:1,n=e.split(".")[o];if("string"!=typeof n)throw new i(`Invalid token specified: missing part #${o+1}`);try{r=function(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw Error("base64 string is not of the correct length")}try{var r;return r=t,decodeURIComponent(atob(r).replace(/(.)/g,(e,t)=>{let r=t.charCodeAt(0).toString(16).toUpperCase();return r.length<2&&(r="0"+r),"%"+r}))}catch(e){return atob(t)}}(n)}catch(e){throw new i(`Invalid token specified: invalid base64 for part #${o+1} (${e.message})`)}try{return JSON.parse(r)}catch(e){throw new i(`Invalid token specified: invalid json for part #${o+1} (${e.message})`)}}i.prototype.name="InvalidTokenError"}},e=>{var t=t=>e(e.s=t);e.O(0,[609,130,215,744],()=>t(17133)),_N_E=e.O()}]);