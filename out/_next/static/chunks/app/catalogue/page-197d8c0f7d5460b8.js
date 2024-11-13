(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[567],{92161:(e,t,r)=>{Promise.resolve().then(r.bind(r,30203))},91449:(e,t)=>{"use strict";t.parse=function(e,t){if("string"!=typeof e)throw TypeError("argument str must be a string");for(var n={},s=e.split(";"),i=(t||{}).decode||r,a=0;a<s.length;a++){var o=s[a],l=o.indexOf("=");if(!(l<0)){var c=o.substring(0,l).trim();if(void 0==n[c]){var d=o.substring(l+1,o.length).trim();'"'===d[0]&&(d=d.slice(1,-1)),n[c]=function(e,t){try{return t(e)}catch(t){return e}}(d,i)}}}return n},t.serialize=function(e,t,r){var i=r||{},a=i.encode||n;if("function"!=typeof a)throw TypeError("option encode is invalid");if(!s.test(e))throw TypeError("argument name is invalid");var o=a(t);if(o&&!s.test(o))throw TypeError("argument val is invalid");var l=e+"="+o;if(null!=i.maxAge){var c=i.maxAge-0;if(isNaN(c)||!isFinite(c))throw TypeError("option maxAge is invalid");l+="; Max-Age="+Math.floor(c)}if(i.domain){if(!s.test(i.domain))throw TypeError("option domain is invalid");l+="; Domain="+i.domain}if(i.path){if(!s.test(i.path))throw TypeError("option path is invalid");l+="; Path="+i.path}if(i.expires){if("function"!=typeof i.expires.toUTCString)throw TypeError("option expires is invalid");l+="; Expires="+i.expires.toUTCString()}if(i.httpOnly&&(l+="; HttpOnly"),i.secure&&(l+="; Secure"),i.sameSite)switch("string"==typeof i.sameSite?i.sameSite.toLowerCase():i.sameSite){case!0:case"strict":l+="; SameSite=Strict";break;case"lax":l+="; SameSite=Lax";break;case"none":l+="; SameSite=None";break;default:throw TypeError("option sameSite is invalid")}return l};var r=decodeURIComponent,n=encodeURIComponent,s=/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/},16463:(e,t,r)=>{"use strict";var n=r(71169);r.o(n,"usePathname")&&r.d(t,{usePathname:function(){return n.usePathname}}),r.o(n,"useRouter")&&r.d(t,{useRouter:function(){return n.useRouter}}),r.o(n,"useSearchParams")&&r.d(t,{useSearchParams:function(){return n.useSearchParams}})},70277:function(e,t,r){"use strict";var n=this&&this.__assign||function(){return(n=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var s in t=arguments[r])Object.prototype.hasOwnProperty.call(t,s)&&(e[s]=t[s]);return e}).apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0}),t.destroyCookie=t.setCookie=t.parseCookies=void 0;var s=r(91449),i=r(70148),a=r(70800);function o(e,t){var r,n;return(null===(n=null===(r=null==e?void 0:e.req)||void 0===r?void 0:r.headers)||void 0===n?void 0:n.cookie)?s.parse(e.req.headers.cookie,t):a.isBrowser()?s.parse(document.cookie,t):{}}function l(e,t,r,o){var l,c;if(void 0===o&&(o={}),(null===(l=null==e?void 0:e.res)||void 0===l?void 0:l.getHeader)&&e.res.setHeader){if(null===(c=null==e?void 0:e.res)||void 0===c?void 0:c.finished)return console.warn('Not setting "'+t+'" cookie. Response has finished.'),console.warn("You should set cookie before res.send()"),{};var d=e.res.getHeader("Set-Cookie")||[];"string"==typeof d&&(d=[d]),"number"==typeof d&&(d=[]);var u=i.parse(d,{decodeValues:!1}),h=a.createCookie(t,r,o),p=[];u.forEach(function(e){if(!a.areCookiesEqual(e,h)){var t=s.serialize(e.name,e.value,n({encode:function(e){return e}},e));p.push(t)}}),p.push(s.serialize(t,r,o)),e.res.setHeader("Set-Cookie",p)}if(a.isBrowser()){if(o&&o.httpOnly)throw Error("Can not set a httpOnly cookie in the browser.");document.cookie=s.serialize(t,r,o)}return{}}function c(e,t,r){return l(e,t,"",n(n({},r||{}),{maxAge:-1}))}t.parseCookies=o,t.setCookie=l,t.destroyCookie=c,t.default={set:l,get:o,destroy:c}},70800:function(e,t){"use strict";var r=this&&this.__assign||function(){return(r=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var s in t=arguments[r])Object.prototype.hasOwnProperty.call(t,s)&&(e[s]=t[s]);return e}).apply(this,arguments)};function n(e,t){var r=Object.getOwnPropertyNames(e),n=Object.getOwnPropertyNames(t);if(r.length!==n.length)return!1;for(var s=0;s<r.length;s++){var i=r[s];if(e[i]!==t[i])return!1}return!0}Object.defineProperty(t,"__esModule",{value:!0}),t.areCookiesEqual=t.hasSameProperties=t.createCookie=t.isBrowser=void 0,t.isBrowser=function(){return"undefined"!=typeof window},t.createCookie=function(e,t,n){var s=n.sameSite;!0===s&&(s="strict"),(void 0===s||!1===s)&&(s="lax");var i=r(r({},n),{sameSite:s});return delete i.encode,r({name:e,value:t},i)},t.hasSameProperties=n,t.areCookiesEqual=function(e,t){var s=e.sameSite===t.sameSite;return"string"==typeof e.sameSite&&"string"==typeof t.sameSite&&(s=e.sameSite.toLowerCase()===t.sameSite.toLowerCase()),n(r(r({},e),{sameSite:void 0}),r(r({},t),{sameSite:void 0}))&&s}},70148:e=>{"use strict";var t={decodeValues:!0,map:!1,silent:!1};function r(e){return"string"==typeof e&&!!e.trim()}function n(e,n){var s,i,a,o,l=e.split(";").filter(r),c=(s=l.shift(),i="",a="",(o=s.split("=")).length>1?(i=o.shift(),a=o.join("=")):a=s,{name:i,value:a}),d=c.name,u=c.value;n=n?Object.assign({},t,n):t;try{u=n.decodeValues?decodeURIComponent(u):u}catch(e){console.error("set-cookie-parser encountered an error while decoding a cookie with value '"+u+"'. Set options.decodeValues to false to disable this feature.",e)}var h={name:d,value:u};return l.forEach(function(e){var t=e.split("="),r=t.shift().trimLeft().toLowerCase(),n=t.join("=");"expires"===r?h.expires=new Date(n):"max-age"===r?h.maxAge=parseInt(n,10):"secure"===r?h.secure=!0:"httponly"===r?h.httpOnly=!0:"samesite"===r?h.sameSite=n:"partitioned"===r?h.partitioned=!0:h[r]=n}),h}function s(e,s){if(s=s?Object.assign({},t,s):t,!e)return s.map?{}:[];if(e.headers){if("function"==typeof e.headers.getSetCookie)e=e.headers.getSetCookie();else if(e.headers["set-cookie"])e=e.headers["set-cookie"];else{var i=e.headers[Object.keys(e.headers).find(function(e){return"set-cookie"===e.toLowerCase()})];i||!e.headers.cookie||s.silent||console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."),e=i}}return(Array.isArray(e)||(e=[e]),(s=s?Object.assign({},t,s):t).map)?e.filter(r).reduce(function(e,t){var r=n(t,s);return e[r.name]=r,e},{}):e.filter(r).map(function(e){return n(e,s)})}e.exports=s,e.exports.parse=s,e.exports.parseString=n,e.exports.splitCookiesString=function(e){if(Array.isArray(e))return e;if("string"!=typeof e)return[];var t,r,n,s,i,a=[],o=0;function l(){for(;o<e.length&&/\s/.test(e.charAt(o));)o+=1;return o<e.length}for(;o<e.length;){for(t=o,i=!1;l();)if(","===(r=e.charAt(o))){for(n=o,o+=1,l(),s=o;o<e.length&&"="!==(r=e.charAt(o))&&";"!==r&&","!==r;)o+=1;o<e.length&&"="===e.charAt(o)?(i=!0,o=s,a.push(e.substring(t,n)),t=o):o=n+1}else o+=1;(!i||o>=e.length)&&a.push(e.substring(t,e.length))}return a}},30203:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>u});var n=r(57437),s=r(2265),i=r(16463),a=r(49968),o=r(72609);r(63275);var l=r(53481);let c=e=>{let{catalogue:t}=e,{activeCatalogues:r,setActiveCatalogues:i}=(0,o.a)(),[a,c]=(0,s.useState)(null),[d,u]=(0,s.useState)(null),[h,p]=(0,s.useState)(null),[f,m]=(0,s.useState)(null),v=(0,l.Z)();if(!t.length)return(0,n.jsx)("p",{children:"No Catalogue found..."});let g=Array.from(new Set(t.map(e=>e.annee.annee))),x=Array.from(new Set(t.map(e=>e.niveau.niveau))),j=Array.from(new Set(t.map(e=>e.etape.etape))),b=Array.from(new Set(t.map(e=>e.matiere.matiere))),y=t.filter(e=>(!a||e.annee.annee===a)&&(!d||e.niveau.niveau===d)&&(!h||e.etape.etape===h)&&(!f||e.matiere.matiere===f)),w=e=>{i(r.some(t=>t.id===e.id)?r.filter(t=>t.id!==e.id):[...r,e])};return(0,n.jsxs)("div",{className:"mb-4",children:[(0,n.jsx)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:r.length>1&&(0,n.jsx)("span",{className:"warning-message",children:v("msg_manyCtg")})}),(0,n.jsxs)("div",{className:"filters",children:[(0,n.jsxs)("label",{children:[v("tab_year"),":",(0,n.jsxs)("select",{value:a||"",onChange:e=>c(e.target.value||null),children:[(0,n.jsx)("option",{value:"",children:v("opt_all")}),g.map(e=>(0,n.jsx)("option",{value:e,children:e},e))]})]}),(0,n.jsxs)("label",{children:[v("tab_level"),":",(0,n.jsxs)("select",{value:d||"",onChange:e=>u(e.target.value||null),children:[(0,n.jsx)("option",{value:"",children:v("opt_all")}),x.map(e=>(0,n.jsx)("option",{value:e,children:e},e))]})]}),(0,n.jsxs)("label",{children:[v("tab_stage"),":",(0,n.jsxs)("select",{value:h||"",onChange:e=>p(e.target.value||null),children:[(0,n.jsx)("option",{value:"",children:v("opt_all")}),j.map(e=>(0,n.jsx)("option",{value:e,children:e},e))]})]}),(0,n.jsxs)("label",{children:[v("tab_subject"),":",(0,n.jsxs)("select",{value:f||"",onChange:e=>m(e.target.value||null),children:[(0,n.jsx)("option",{value:"",children:v("opt_all")}),b.map(e=>(0,n.jsx)("option",{value:e,children:e},e))]})]})]}),(0,n.jsxs)("table",{className:"table",children:[(0,n.jsx)("thead",{children:(0,n.jsxs)("tr",{children:[(0,n.jsx)("th",{children:v("tab_year")}),(0,n.jsx)("th",{children:v("tab_level")}),(0,n.jsx)("th",{children:v("tab_stage")}),(0,n.jsx)("th",{children:v("tab_subject")}),(0,n.jsx)("th",{children:v("tab_desc")})]})}),(0,n.jsx)("tbody",{children:y.map(e=>(0,n.jsxs)("tr",{onClick:()=>w(e),className:r.some(t=>t.id===e.id)?"selected-row":"",style:{cursor:"pointer"},children:[(0,n.jsx)("td",{children:e.annee.annee}),(0,n.jsx)("td",{children:e.niveau.niveau}),(0,n.jsx)("td",{children:e.etape.etape}),(0,n.jsx)("td",{children:e.matiere.matiere}),(0,n.jsx)("td",{children:e.description})]},e.id))})]})]})};r(68484);var d=r(85042);let u=()=>{let e=(0,i.useRouter)(),{catalogue:t,activeCatalogues:r}=(0,o.a)(),u=(0,l.Z)();return(0,s.useEffect)(()=>{(0,d.$)()||e.push("/login")},[e]),(0,n.jsxs)("div",{className:"container mt-3 ml-2",children:[(0,n.jsx)("h1",{children:u("msg_ctg")}),(0,n.jsxs)("div",{className:"tab-content mt-3",children:[(0,n.jsx)("h2",{children:u("msg_chosenCtg")}),r.length>0?(0,n.jsx)(a.Z,{selectedCatalogue:r}):(0,n.jsx)("p",{children:u("msg_noCtg")}),(0,n.jsx)("h2",{children:u("msg_chooseTest")}),0===t.length?(0,n.jsx)("p",{children:u("msg_noCtg")}):(0,n.jsx)(c,{catalogue:t})]})]})}},49968:(e,t,r)=>{"use strict";r.d(t,{Z:()=>i});var n=r(57437);r(2265),r(63275);var s=r(53481);let i=e=>{let{selectedCatalogue:t}=e,r=(0,s.Z)();return t.length?(0,n.jsx)("div",{className:"mb-4",children:(0,n.jsxs)("table",{className:"table",children:[(0,n.jsx)("thead",{children:(0,n.jsxs)("tr",{children:[(0,n.jsx)("th",{children:r("tab_year")}),(0,n.jsx)("th",{children:r("tab_level")}),(0,n.jsx)("th",{children:r("tab_stage")}),(0,n.jsx)("th",{children:r("tab_subject")}),(0,n.jsx)("th",{children:r("tab_desc")})]})}),(0,n.jsx)("tbody",{children:t.map(e=>(0,n.jsxs)("tr",{className:"selected-row",children:[" ",(0,n.jsx)("td",{children:e.annee.annee}),(0,n.jsx)("td",{children:e.niveau.niveau}),(0,n.jsx)("td",{children:e.etape.etape}),(0,n.jsx)("td",{children:e.matiere.matiere}),(0,n.jsx)("td",{children:e.description})]},e.id))})]})}):(0,n.jsx)("p",{children:r("msg_noCtg")})}},53481:(e,t,r)=>{"use strict";r.d(t,{Z:()=>i});var n=r(72609);let s=(e,t)=>e.replace(/\{(\w+)\}/g,(e,r)=>t[r]||"{".concat(r,"}")),i=()=>{let{translations:e}=(0,n.a)();return function(t){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=e[t];return n?s(n,r):"".concat(t)}}},68484:()=>{},63275:()=>{},49714:(e,t,r)=>{"use strict";r.d(t,{o:()=>s});class n extends Error{}function s(e,t){let r;if("string"!=typeof e)throw new n("Invalid token specified: must be a string");t||(t={});let s=!0===t.header?0:1,i=e.split(".")[s];if("string"!=typeof i)throw new n(`Invalid token specified: missing part #${s+1}`);try{r=function(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw Error("base64 string is not of the correct length")}try{var r;return r=t,decodeURIComponent(atob(r).replace(/(.)/g,(e,t)=>{let r=t.charCodeAt(0).toString(16).toUpperCase();return r.length<2&&(r="0"+r),"%"+r}))}catch(e){return atob(t)}}(i)}catch(e){throw new n(`Invalid token specified: invalid base64 for part #${s+1} (${e.message})`)}try{return JSON.parse(r)}catch(e){throw new n(`Invalid token specified: invalid json for part #${s+1} (${e.message})`)}}n.prototype.name="InvalidTokenError"}},e=>{var t=t=>e(e.s=t);e.O(0,[441,757,609,130,215,744],()=>t(92161)),_N_E=e.O()}]);