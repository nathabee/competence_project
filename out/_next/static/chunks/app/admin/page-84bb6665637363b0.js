(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3],{74760:(e,t,r)=>{Promise.resolve().then(r.bind(r,10306))},16463:(e,t,r)=>{"use strict";var n=r(71169);r.o(n,"usePathname")&&r.d(t,{usePathname:function(){return n.usePathname}}),r.o(n,"useRouter")&&r.d(t,{useRouter:function(){return n.useRouter}})},10306:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>i});var n=r(57437),o=r(2265),s=r(16463),a=r(85042);function i(){let e=(0,s.useRouter)();return(0,o.useEffect)(()=>{let t=(0,a.$)();t?(document.cookie="authToken=".concat(t,"; path=/; Secure; HttpOnly"),window.location.href="/competence_project/out/demo/swagger/swagger_json.html"):e.push("/login")},[e]),(0,n.jsx)("div",{children:"Redirection vers console d'administration..."})}},85042:(e,t,r)=>{"use strict";r.d(t,{$:()=>s,p:()=>o});var n=r(49714);function o(e){if(!e)return!0;try{let t=(0,n.o)(e),r=Date.now()/1e3;return t.exp<r}catch(e){return console.error("Error decoding token:",e),!0}}function s(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:document.cookie;for(let t of e.split(";")){let[e,r]=t.trim().split("=");if("authToken"===e&&!o(r))return r}return null}},49714:(e,t,r)=>{"use strict";r.d(t,{o:()=>o});class n extends Error{}function o(e,t){let r;if("string"!=typeof e)throw new n("Invalid token specified: must be a string");t||(t={});let o=!0===t.header?0:1,s=e.split(".")[o];if("string"!=typeof s)throw new n(`Invalid token specified: missing part #${o+1}`);try{r=function(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw Error("base64 string is not of the correct length")}try{var r;return r=t,decodeURIComponent(atob(r).replace(/(.)/g,(e,t)=>{let r=t.charCodeAt(0).toString(16).toUpperCase();return r.length<2&&(r="0"+r),"%"+r}))}catch(e){return atob(t)}}(s)}catch(e){throw new n(`Invalid token specified: invalid base64 for part #${o+1} (${e.message})`)}try{return JSON.parse(r)}catch(e){throw new n(`Invalid token specified: invalid json for part #${o+1} (${e.message})`)}}n.prototype.name="InvalidTokenError"}},e=>{var t=t=>e(e.s=t);e.O(0,[130,215,744],()=>t(74760)),_N_E=e.O()}]);