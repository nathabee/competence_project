(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[166],{89166:(e,t,r)=>{"use strict";r.d(t,{Z:()=>m});var a=r(57437),l=r(2265),s=r(97501),n=r(81173),i=r.n(n),c=r(55211);c.kL.register(c.l7,c.Xi,c.jn,c.od,c.Gu,c.u,c.De);let d=e=>{let{chartData:t}=e,r=(0,l.useRef)(null),s=(0,l.useRef)(null);return(0,l.useEffect)(()=>{var e;let a=null===(e=r.current)||void 0===e?void 0:e.getContext("2d",{willReadFrequently:!0});if(a)return s.current&&s.current.destroy(),s.current=new c.kL(a,{type:"radar",data:{labels:t.labels,datasets:[{label:"Avancement",data:t.data,backgroundColor:"rgba(255, 99, 132, 0.2)",borderColor:"rgba(255, 99, 132, 1)",borderWidth:1,fill:!0}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{r:{min:0,max:3,beginAtZero:!0,ticks:{stepSize:1,callback:e=>["","+","++","+++"]["number"==typeof e?e:Number(e)]||"",font:{size:7}}}}}}),()=>{s.current&&s.current.destroy()}},[t]),(0,a.jsx)("div",{style:{height:"12cm",width:"100%",overflow:"hidden"},children:(0,a.jsx)("canvas",{ref:r,width:728,height:300})})};c.kL.register(c.l7,c.Xi,c.jn,c.od,c.Gu,c.u,c.De);let o=e=>{let{chartData:t}=e,r=(0,l.useRef)(null),s=(0,l.useRef)(null),n=Array(t.labels.length).fill(""),i=(e,t)=>e.length>t?e.slice(e.length-t):" ".repeat(t-e.length)+e;return(0,l.useEffect)(()=>{var e;let a=null===(e=r.current)||void 0===e?void 0:e.getContext("2d");if(a)return s.current&&s.current.destroy(),Promise.all(t.labelImages.map(e=>{let t=new Image;return t.src=e,t}).map(e=>new Promise(t=>{e.onload=()=>t(e),e.onerror=()=>t(null)}))).then(e=>{s.current=new c.kL(a,{type:"radar",data:{labels:n,datasets:[{label:"Progress",data:t.data,backgroundColor:"rgba(54, 162, 235, 0.2)",borderColor:"rgba(54, 162, 235, 1)",borderWidth:1,fill:!0}]},options:{responsive:!0,maintainAspectRatio:!1,layout:{padding:{top:40,bottom:40,left:120,right:120}},plugins:{legend:{display:!1}},scales:{r:{min:0,max:3,beginAtZero:!0,ticks:{stepSize:1,callback:e=>["","+","++","+++"]["number"==typeof e?e:Number(e)]||" ".repeat(50),font:{size:7}}}},animation:{onComplete:()=>{let r=s.current;if(r){let{width:l,height:s}=r.chartArea,n=l/2+r.chartArea.left,c=s/2+r.chartArea.top,d=Math.min(l,s)/2,o=t.labels.length;for(let r=0;r<o;r++){let l=2*Math.PI*r/o-Math.PI/2,s=n+d*Math.cos(l),h=c+d*Math.sin(l),p=e[r];p?a.drawImage(p,s-15,h-30,30,30):(a.fillStyle="#ccc",a.fillRect(s-15,h-30,30,30)),a.font="bold 8px Verdana",a.fillStyle="#000",Math.cos(l)>0?a.fillText(t.labels[r],s,h-30):a.fillText(i(t.labels[r],50),s-120,h-30)}}}}}})}),()=>{s.current&&s.current.destroy()}},[t]),(0,a.jsx)("div",{style:{height:"12cm",width:"100%",overflow:"hidden"},children:(0,a.jsx)("canvas",{ref:r,width:728,height:454})})};r(61119);var h=r(45469),p=r(66648);let u=e=>{let{reportCatalogue:t}=e,[r,s]=(0,l.useState)({});return(0,l.useEffect)(()=>{let e={};t.resultats.forEach(t=>{let r="competence_icon_".concat(t.groupage.groupage_icon_id),a=localStorage.getItem(r);a&&(e[r]=a)}),s(e)},[t]),(0,a.jsxs)("div",{className:"print-footer-scoreoverview",children:[(0,a.jsx)("h3",{children:t.catalogue.description}),(0,a.jsxs)("table",{className:"table",children:[(0,a.jsx)("thead",{children:(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{children:"Type de tests"}),(0,a.jsx)("th",{children:"Score"}),(0,a.jsx)("th",{children:"Maximum"}),(0,a.jsx)("th",{children:"%"})]})}),(0,a.jsx)("tbody",{children:t.resultats.length>0?t.resultats.map((e,l)=>{let s=r["competence_icon_".concat(e.groupage.groupage_icon_id)]||null;return(0,a.jsxs)("tr",{children:[(0,a.jsxs)("td",{children:[s?(0,a.jsx)(p.default,{src:s,alt:"Groupage Icon",height:10,style:{marginRight:"10px"}}):null," "," ",e.groupage.label_groupage]}),(0,a.jsx)("td",{children:e.score.toFixed(0)}),(0,a.jsx)("td",{children:e.groupage.max_point.toFixed(0)}),(0,a.jsxs)("td",{children:[Math.round(e.score/e.groupage.max_point*100),"%"]})]},"".concat(t.id,"-").concat(l))}):(0,a.jsx)("tr",{children:(0,a.jsx)("td",{colSpan:10,children:"Pas de donn\xe9es disponible"})})})]})]})};var g=r(20276),x=r(98191);let m=e=>{let{report:t,eleve:r,professor:l,pdflayout:n,isImageChart:c}=e,p=t.report_catalogues,m=async()=>{let e=document.querySelector(".btn");e&&(e.style.display="none");let t=new s.ZP({orientation:"portrait",unit:"mm",format:"a4"});for(let e=0;e<p.length;e++){let r=document.getElementById("printable-chart-".concat(e));r&&await i()(r,{scale:2}).then(r=>{let a=r.toDataURL("image/jpeg",.5),l=210*r.height/r.width;t.addImage(a,"JPEG",0,0,210,l),e<p.length-1&&t.addPage()})}let a=Array.from(document.querySelectorAll('[id^="printable-summary-"]'));for(let e=0;e<a.length;e++){let r=a[e];r&&(t.addPage(),await i()(r,{scale:2}).then(e=>{let r=e.toDataURL("image/jpeg",.5),a=210*e.height/e.width;t.addImage(r,"JPEG",0,0,210,a)}))}e&&(e.style.display="inline-block");let l=new Date().toISOString().slice(0,19).replace(/T/,"_").replace(/:/g,"-");t.save("report_".concat(r.nom,"__").concat(r.prenom,"_").concat(l,".pdf"))},j=p.map(e=>{let t=e.resultats.map(e=>e.groupage.label_groupage),r=e.resultats.map(e=>{let t="competence_icon_".concat(e.groupage.groupage_icon_id);return(0,x.n$)(t)}),a=e.resultats.map(e=>(e.seuil1_percent+e.seuil2_percent+e.seuil3_percent)/100);return{description:e.catalogue.description,labels:t,labelImages:r,data:a}});return(0,a.jsxs)("div",{children:[(0,a.jsx)("button",{onClick:m,className:"button-warning",children:"Imprimer PDF"}),j.map((e,s)=>(0,a.jsxs)("div",{id:"printable-chart-".concat(s),className:"print-container",children:[(0,a.jsx)(h.Z,{layout:n,professor:l,eleve:r,report:t}),(0,a.jsx)("div",{className:"print-banner",children:(0,a.jsx)("div",{})}),(0,a.jsx)("h3",{children:e.description}),c?(0,a.jsx)(o,{chartData:{labels:e.labels,data:e.data,labelImages:e.labelImages}}):(0,a.jsx)(d,{chartData:{labels:e.labels,data:e.data}}),(0,a.jsx)(u,{reportCatalogue:p[s]}),(0,a.jsxs)("div",{className:"print-footer",children:[(0,a.jsx)("div",{className:"print-footer-message1",children:n.footer_message1}),(0,a.jsx)("div",{className:"print-footer-message2",children:n.footer_message2})]})]},s)),(0,a.jsx)("div",{className:"spacing"})," ",(0,a.jsx)(g.Z,{eleve:r,professor:l,pdflayout:n,report:t,max_item:40,self_page:!1})]})}},45469:(e,t,r)=>{"use strict";r.d(t,{Z:()=>n});var a=r(57437),l=r(2265),s=r(98191);let n=e=>{let{layout:t,professor:r,eleve:n,report:i}=e,c=(0,l.useRef)(null);return(0,l.useEffect)(()=>{let e=c.current,r=null==e?void 0:e.getContext("2d");if(e&&r){let a=new Image;a.src=t.header_icon_base64,a.onload=()=>{e.width=a.width,e.height=a.height,r.drawImage(a,0,0)},a.onerror=e=>{console.error("Erreur chargement image:",e)}}},[t.header_icon_base64]),(0,a.jsxs)("div",{className:"print-header-container",children:[(0,a.jsxs)("div",{id:"print-header-logo-container",children:[(0,a.jsx)("div",{id:"print-header-logo",children:(0,a.jsx)("canvas",{ref:c,id:"headerCanvas"})}),(0,a.jsx)("div",{id:"print-header-school",children:(0,a.jsx)("div",{children:t.schule_name})})]}),(0,a.jsx)("div",{className:"print-header-gap",children:"   "}),(0,a.jsxs)("div",{className:"print-header-info",children:[(0,a.jsx)("div",{className:"print-header-professor",children:(0,a.jsxs)("div",{children:["P\xe9dagogue : ",r.last_name," ",r.first_name," "]})}),(0,a.jsx)("div",{className:"print-header-eleve",children:(0,a.jsxs)("div",{children:["El\xe8ve : ",n.nom,"  ",n.prenom," , ",n.niveau_description]})}),(0,a.jsx)("div",{children:(0,a.jsxs)("p",{children:["Rapport cr\xe9\xe9 le: ",(0,s.p6)(i.created_at)]})})]})]})}},20276:(e,t,r)=>{"use strict";r.d(t,{Z:()=>c});var a=r(57437),l=r(2265),s=r(66648),n=r(72609);r(61119);var i=r(45469);let c=e=>{let{eleve:t,professor:r,pdflayout:c,report:d,max_item:o,self_page:h}=e,{activeReport:p}=(0,n.a)(),u=(p?p.report_catalogues:d.report_catalogues).flatMap(e=>e.resultats.filter(e=>e.seuil2_percent<100||e.seuil1_percent<100).flatMap(t=>{let r=t.seuil2_percent<100&&t.resultat_details?t.resultat_details.map(e=>({type:"detail",detail:e})):[];return[{type:"main",reportCatalogue:e,resultat:t},...r]})),g=[];for(let e=0;e<u.length;e+=o)g.push(u.slice(e,e+o));let[x,m]=(0,l.useState)(0),j=e=>(0,a.jsxs)("table",{className:"table table-bordered",children:[(0,a.jsx)("thead",{children:(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{}),(0,a.jsx)("th",{children:"Type de tests"}),(0,a.jsx)("th",{children:"Score"}),(0,a.jsx)("th",{children:"Max score"}),(0,a.jsx)("th",{children:"Avancement"}),(0,a.jsx)("th",{children:"seuil1"}),(0,a.jsx)("th",{children:"seuil2"}),(0,a.jsx)("th",{children:"seuil3"})]})}),(0,a.jsx)("tbody",{children:e.map((e,t)=>{if("main"===e.type){let{reportCatalogue:r,resultat:l}=e,n=l.seuil1_percent<100,i="competence_icon_".concat(l.groupage.groupage_icon_id),c=localStorage.getItem(i)||null;return(0,a.jsxs)("tr",{style:n?{fontWeight:"bold"}:{},children:[(0,a.jsxs)("td",{children:[c?(0,a.jsx)(s.default,{src:"".concat(c),alt:"Groupage Icon",width:20,height:20,style:{marginRight:"10px"}}):null,r.catalogue.description]}),(0,a.jsx)("td",{children:l.groupage.label_groupage}),(0,a.jsx)("td",{children:l.score.toFixed(0)}),(0,a.jsx)("td",{children:l.groupage.max_point.toFixed(0)}),(0,a.jsxs)("td",{children:[Math.round(l.score/l.groupage.max_point*100),"%"]}),(0,a.jsxs)("td",{children:[Math.round(l.seuil1_percent),"%"]}),(0,a.jsxs)("td",{children:[Math.round(l.seuil2_percent),"%"]}),(0,a.jsxs)("td",{children:[Math.round(l.seuil3_percent),"%"]})]},t)}if("detail"===e.type){let{detail:r}=e;return 2*r.score<r.item.max_score?(0,a.jsxs)("tr",{style:{fontWeight:"normal"},children:[(0,a.jsx)("td",{colSpan:2,style:{paddingLeft:"30px"},children:r.item.description}),(0,a.jsx)("td",{children:Math.round(r.score)}),(0,a.jsx)("td",{children:r.item.max_score}),(0,a.jsx)("td",{children:r.observation}),(0,a.jsx)("td",{colSpan:3})]},"".concat(t,"-detail")):null}return null})})]});return(0,a.jsx)("div",{children:h?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("div",{id:"printable-summary-".concat(x),className:"print-container",children:[(0,a.jsx)(i.Z,{layout:c,professor:r,eleve:t,report:d}),(0,a.jsx)("h2",{children:"Rapport d\xe9taill\xe9 des difficult\xe9s rencontr\xe9es:"}),j(g[x])]}),(0,a.jsxs)("div",{className:"pagination-controls",children:[(0,a.jsx)("button",{onClick:()=>{x>0&&m(x-1)},disabled:0===x,children:"Pr\xe9c\xe9dent"}),(0,a.jsxs)("span",{children:["Page ",x+1," sur ",g.length]}),(0,a.jsx)("button",{onClick:()=>{x<g.length-1&&m(x+1)},disabled:x===g.length-1,children:"Suivant"})]})]}):(0,a.jsx)("div",{children:Array.from({length:g.length}).map((e,l)=>(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{className:"spacing"})," ",(0,a.jsxs)("div",{id:"printable-summary-".concat(l),className:"print-container",children:[(0,a.jsx)(i.Z,{layout:c,professor:r,eleve:t,report:d}),(0,a.jsx)("h2",{children:"Rapport d\xe9taill\xe9 des difficult\xe9s rencontr\xe9es:"}),j(g[l])]})]},l))})})}},61119:()=>{}}]);