(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[626],{86123:(e,t,r)=>{Promise.resolve().then(r.bind(r,78435))},91449:(e,t)=>{"use strict";t.parse=function(e,t){if("string"!=typeof e)throw TypeError("argument str must be a string");for(var a={},o=e.split(";"),i=(t||{}).decode||r,n=0;n<o.length;n++){var s=o[n],c=s.indexOf("=");if(!(c<0)){var l=s.substring(0,c).trim();if(void 0==a[l]){var u=s.substring(c+1,s.length).trim();'"'===u[0]&&(u=u.slice(1,-1)),a[l]=function(e,t){try{return t(e)}catch(t){return e}}(u,i)}}}return a},t.serialize=function(e,t,r){var i=r||{},n=i.encode||a;if("function"!=typeof n)throw TypeError("option encode is invalid");if(!o.test(e))throw TypeError("argument name is invalid");var s=n(t);if(s&&!o.test(s))throw TypeError("argument val is invalid");var c=e+"="+s;if(null!=i.maxAge){var l=i.maxAge-0;if(isNaN(l)||!isFinite(l))throw TypeError("option maxAge is invalid");c+="; Max-Age="+Math.floor(l)}if(i.domain){if(!o.test(i.domain))throw TypeError("option domain is invalid");c+="; Domain="+i.domain}if(i.path){if(!o.test(i.path))throw TypeError("option path is invalid");c+="; Path="+i.path}if(i.expires){if("function"!=typeof i.expires.toUTCString)throw TypeError("option expires is invalid");c+="; Expires="+i.expires.toUTCString()}if(i.httpOnly&&(c+="; HttpOnly"),i.secure&&(c+="; Secure"),i.sameSite)switch("string"==typeof i.sameSite?i.sameSite.toLowerCase():i.sameSite){case!0:case"strict":c+="; SameSite=Strict";break;case"lax":c+="; SameSite=Lax";break;case"none":c+="; SameSite=None";break;default:throw TypeError("option sameSite is invalid")}return c};var r=decodeURIComponent,a=encodeURIComponent,o=/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/},16463:(e,t,r)=>{"use strict";var a=r(71169);r.o(a,"usePathname")&&r.d(t,{usePathname:function(){return a.usePathname}}),r.o(a,"useRouter")&&r.d(t,{useRouter:function(){return a.useRouter}})},70277:function(e,t,r){"use strict";var a=this&&this.__assign||function(){return(a=Object.assign||function(e){for(var t,r=1,a=arguments.length;r<a;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0}),t.destroyCookie=t.setCookie=t.parseCookies=void 0;var o=r(91449),i=r(70148),n=r(70800);function s(e,t){var r,a;return(null===(a=null===(r=null==e?void 0:e.req)||void 0===r?void 0:r.headers)||void 0===a?void 0:a.cookie)?o.parse(e.req.headers.cookie,t):n.isBrowser()?o.parse(document.cookie,t):{}}function c(e,t,r,s){var c,l;if(void 0===s&&(s={}),(null===(c=null==e?void 0:e.res)||void 0===c?void 0:c.getHeader)&&e.res.setHeader){if(null===(l=null==e?void 0:e.res)||void 0===l?void 0:l.finished)return console.warn('Not setting "'+t+'" cookie. Response has finished.'),console.warn("You should set cookie before res.send()"),{};var u=e.res.getHeader("Set-Cookie")||[];"string"==typeof u&&(u=[u]),"number"==typeof u&&(u=[]);var d=i.parse(u,{decodeValues:!1}),p=n.createCookie(t,r,s),h=[];d.forEach(function(e){if(!n.areCookiesEqual(e,p)){var t=o.serialize(e.name,e.value,a({encode:function(e){return e}},e));h.push(t)}}),h.push(o.serialize(t,r,s)),e.res.setHeader("Set-Cookie",h)}if(n.isBrowser()){if(s&&s.httpOnly)throw Error("Can not set a httpOnly cookie in the browser.");document.cookie=o.serialize(t,r,s)}return{}}function l(e,t,r){return c(e,t,"",a(a({},r||{}),{maxAge:-1}))}t.parseCookies=s,t.setCookie=c,t.destroyCookie=l,t.default={set:c,get:s,destroy:l}},70800:function(e,t){"use strict";var r=this&&this.__assign||function(){return(r=Object.assign||function(e){for(var t,r=1,a=arguments.length;r<a;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)};function a(e,t){var r=Object.getOwnPropertyNames(e),a=Object.getOwnPropertyNames(t);if(r.length!==a.length)return!1;for(var o=0;o<r.length;o++){var i=r[o];if(e[i]!==t[i])return!1}return!0}Object.defineProperty(t,"__esModule",{value:!0}),t.areCookiesEqual=t.hasSameProperties=t.createCookie=t.isBrowser=void 0,t.isBrowser=function(){return"undefined"!=typeof window},t.createCookie=function(e,t,a){var o=a.sameSite;!0===o&&(o="strict"),(void 0===o||!1===o)&&(o="lax");var i=r(r({},a),{sameSite:o});return delete i.encode,r({name:e,value:t},i)},t.hasSameProperties=a,t.areCookiesEqual=function(e,t){var o=e.sameSite===t.sameSite;return"string"==typeof e.sameSite&&"string"==typeof t.sameSite&&(o=e.sameSite.toLowerCase()===t.sameSite.toLowerCase()),a(r(r({},e),{sameSite:void 0}),r(r({},t),{sameSite:void 0}))&&o}},70148:e=>{"use strict";var t={decodeValues:!0,map:!1,silent:!1};function r(e){return"string"==typeof e&&!!e.trim()}function a(e,a){var o,i,n,s,c=e.split(";").filter(r),l=(o=c.shift(),i="",n="",(s=o.split("=")).length>1?(i=s.shift(),n=s.join("=")):n=o,{name:i,value:n}),u=l.name,d=l.value;a=a?Object.assign({},t,a):t;try{d=a.decodeValues?decodeURIComponent(d):d}catch(e){console.error("set-cookie-parser encountered an error while decoding a cookie with value '"+d+"'. Set options.decodeValues to false to disable this feature.",e)}var p={name:u,value:d};return c.forEach(function(e){var t=e.split("="),r=t.shift().trimLeft().toLowerCase(),a=t.join("=");"expires"===r?p.expires=new Date(a):"max-age"===r?p.maxAge=parseInt(a,10):"secure"===r?p.secure=!0:"httponly"===r?p.httpOnly=!0:"samesite"===r?p.sameSite=a:"partitioned"===r?p.partitioned=!0:p[r]=a}),p}function o(e,o){if(o=o?Object.assign({},t,o):t,!e)return o.map?{}:[];if(e.headers){if("function"==typeof e.headers.getSetCookie)e=e.headers.getSetCookie();else if(e.headers["set-cookie"])e=e.headers["set-cookie"];else{var i=e.headers[Object.keys(e.headers).find(function(e){return"set-cookie"===e.toLowerCase()})];i||!e.headers.cookie||o.silent||console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."),e=i}}return(Array.isArray(e)||(e=[e]),(o=o?Object.assign({},t,o):t).map)?e.filter(r).reduce(function(e,t){var r=a(t,o);return e[r.name]=r,e},{}):e.filter(r).map(function(e){return a(e,o)})}e.exports=o,e.exports.parse=o,e.exports.parseString=a,e.exports.splitCookiesString=function(e){if(Array.isArray(e))return e;if("string"!=typeof e)return[];var t,r,a,o,i,n=[],s=0;function c(){for(;s<e.length&&/\s/.test(e.charAt(s));)s+=1;return s<e.length}for(;s<e.length;){for(t=s,i=!1;c();)if(","===(r=e.charAt(s))){for(a=s,s+=1,c(),o=s;s<e.length&&"="!==(r=e.charAt(s))&&";"!==r&&","!==r;)s+=1;s<e.length&&"="===e.charAt(s)?(i=!0,s=o,n.push(e.substring(t,a)),t=s):s=a+1}else s+=1;(!i||s>=e.length)&&n.push(e.substring(t,e.length))}return n}},78435:(e,t,r)=>{"use strict";r.d(t,{default:()=>u});var a=r(57437),o=r(2265),i=r(16463),n=r(77640),s=r(72609),c=r(85042);let l=()=>{let{catalogue:e,setCatalogue:t,layouts:r,setLayouts:a,niveaux:o,setNiveaux:i,scoreRulePoints:l,setScoreRulePoints:u}=(0,s.a)();return{fetchData:async()=>{let s=(0,c.$)();if(!s||(0,c.p)(s)){console.log("fetchData token expired out");return}let d="/api";try{if(0===e.length){let e=await n.Z.get("".concat(d,"/catalogues/"),{headers:{Authorization:"Bearer ".concat(s)}});t(e.data)}if(0===r.length){let e=await n.Z.get("".concat(d,"/pdf_layouts/"),{headers:{Authorization:"Bearer ".concat(s)}});a(e.data)}if(!o||0===o.length){let e=await n.Z.get("".concat(d,"/niveaux/"),{headers:{Authorization:"Bearer ".concat(s)}});i(e.data)}if(!l||0===l.length){let e=await n.Z.get("".concat(d,"/scorerulepoints/"),{headers:{Authorization:"Bearer ".concat(s)}});u(e.data)}}catch(e){console.error("Error fetching data:",e)}}}},u=()=>{let{login:e}=(0,s.a)(),[t,r]=(0,o.useState)(""),[c,u]=(0,o.useState)(""),[d,p]=(0,o.useState)(null),h=(0,i.useRouter)(),{fetchData:f}=l(),m=async r=>{r.preventDefault();try{let{access:r}=(await n.Z.post("".concat("/api","/token/"),{username:t,password:c})).data,a=(await n.Z.get("".concat("/api","/users/me/"),{headers:{Authorization:"Bearer ".concat(r)}})).data;console.log("userInfo",a),e(r,a),await f(),h.push("/dashboard")}catch(e){e.response&&401===e.response.status?p("Identifiant ou mot de passe invalide"):p("Erreur lors de la connection")}};return(0,a.jsx)("div",{className:"d-flex justify-content-center align-items-center min-vh-100 ",children:(0,a.jsx)("div",{className:"card",style:{maxWidth:"400px",width:"100%"},children:(0,a.jsxs)("div",{className:"card-body",children:[(0,a.jsx)("h5",{className:"card-title text-center mb-4",children:"Login"}),d&&(0,a.jsx)("div",{className:"alert alert-danger",role:"alert",children:d}),(0,a.jsxs)("form",{onSubmit:m,children:[(0,a.jsxs)("div",{className:"mb-3",children:[(0,a.jsx)("label",{htmlFor:"username",className:"form-label",children:"Identifiant"}),(0,a.jsx)("input",{type:"text",id:"username",className:"form-control",placeholder:"Identifiant",required:!0,autoComplete:"username",value:t,onChange:e=>r(e.target.value)})]}),(0,a.jsxs)("div",{className:"mb-3",children:[(0,a.jsx)("label",{htmlFor:"password",className:"form-label",children:"Mot de passe"}),(0,a.jsx)("input",{type:"password",id:"password",className:"form-control",placeholder:"Mot de passe",value:c,required:!0,autoComplete:"current-password",onChange:e=>u(e.target.value)})]}),(0,a.jsx)("button",{type:"submit",className:"btn btn-primary w-100",children:"Login"})]})]})})})}},49714:(e,t,r)=>{"use strict";r.d(t,{o:()=>o});class a extends Error{}function o(e,t){let r;if("string"!=typeof e)throw new a("Invalid token specified: must be a string");t||(t={});let o=!0===t.header?0:1,i=e.split(".")[o];if("string"!=typeof i)throw new a(`Invalid token specified: missing part #${o+1}`);try{r=function(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw Error("base64 string is not of the correct length")}try{var r;return r=t,decodeURIComponent(atob(r).replace(/(.)/g,(e,t)=>{let r=t.charCodeAt(0).toString(16).toUpperCase();return r.length<2&&(r="0"+r),"%"+r}))}catch(e){return atob(t)}}(i)}catch(e){throw new a(`Invalid token specified: invalid base64 for part #${o+1} (${e.message})`)}try{return JSON.parse(r)}catch(e){throw new a(`Invalid token specified: invalid json for part #${o+1} (${e.message})`)}}a.prototype.name="InvalidTokenError"}},e=>{var t=t=>e(e.s=t);e.O(0,[609,130,215,744],()=>t(86123)),_N_E=e.O()}]);