import{r as l,a as ti,R as Dr}from"./vendor-40f8b733.js";import{m as _,A as Ne}from"./animations-2442847f.js";import{C as oi,a as si,L as ii,P as ni,b as ci,B as li,p as di,c as mi,d as pi,A as ui,R as gi,e as hi,f as fi,g as vi,h as xi}from"./charts-59fe27b4.js";(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))o(c);new MutationObserver(c=>{for(const i of c)if(i.type==="childList")for(const d of i.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function t(c){const i={};return c.integrity&&(i.integrity=c.integrity),c.referrerPolicy&&(i.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?i.credentials="include":c.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(c){if(c.ep)return;c.ep=!0;const i=t(c);fetch(c.href,i)}})();var Cs={exports:{}},rt={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var yi=l,bi=Symbol.for("react.element"),wi=Symbol.for("react.fragment"),ji=Object.prototype.hasOwnProperty,Si=yi.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Ci={key:!0,ref:!0,__self:!0,__source:!0};function As(r,a,t){var o,c={},i=null,d=null;t!==void 0&&(i=""+t),a.key!==void 0&&(i=""+a.key),a.ref!==void 0&&(d=a.ref);for(o in a)ji.call(a,o)&&!Ci.hasOwnProperty(o)&&(c[o]=a[o]);if(r&&r.defaultProps)for(o in a=r.defaultProps,a)c[o]===void 0&&(c[o]=a[o]);return{$$typeof:bi,type:r,key:i,ref:d,props:c,_owner:Si.current}}rt.Fragment=wi;rt.jsx=As;rt.jsxs=As;Cs.exports=rt;var e=Cs.exports,Mt={},Kt=ti;Mt.createRoot=Kt.createRoot,Mt.hydrateRoot=Kt.hydrateRoot;var Me=function(){return Me=Object.assign||function(a){for(var t,o=1,c=arguments.length;o<c;o++){t=arguments[o];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(a[i]=t[i])}return a},Me.apply(this,arguments)};function Xa(r,a,t){if(t||arguments.length===2)for(var o=0,c=a.length,i;o<c;o++)(i||!(o in a))&&(i||(i=Array.prototype.slice.call(a,0,o)),i[o]=a[o]);return r.concat(i||Array.prototype.slice.call(a))}var he="-ms-",sa="-moz-",de="-webkit-",Es="comm",at="rule",Ft="decl",Ai="@import",ks="@keyframes",Ei="@layer",Ts=Math.abs,Ut=String.fromCharCode,Dt=Object.assign;function ki(r,a){return je(r,0)^45?(((a<<2^je(r,0))<<2^je(r,1))<<2^je(r,2))<<2^je(r,3):0}function Ps(r){return r.trim()}function ar(r,a){return(r=a.exec(r))?r[0]:r}function ae(r,a,t){return r.replace(a,t)}function Va(r,a,t){return r.indexOf(a,t)}function je(r,a){return r.charCodeAt(a)|0}function $r(r,a,t){return r.slice(a,t)}function qe(r){return r.length}function zs(r){return r.length}function ta(r,a){return a.push(r),r}function Ti(r,a){return r.map(a).join("")}function Xt(r,a){return r.filter(function(t){return!ar(t,a)})}var tt=1,Ir=1,Ms=0,Fe=0,we=0,Ur="";function ot(r,a,t,o,c,i,d,p){return{value:r,root:a,parent:t,type:o,props:c,children:i,line:tt,column:Ir,length:d,return:"",siblings:p}}function sr(r,a){return Dt(ot("",null,null,"",null,null,0,r.siblings),r,{length:-r.length},a)}function Cr(r){for(;r.root;)r=sr(r.root,{children:[r]});ta(r,r.siblings)}function Pi(){return we}function zi(){return we=Fe>0?je(Ur,--Fe):0,Ir--,we===10&&(Ir=1,tt--),we}function Ge(){return we=Fe<Ms?je(Ur,Fe++):0,Ir++,we===10&&(Ir=1,tt++),we}function hr(){return je(Ur,Fe)}function Ya(){return Fe}function st(r,a){return $r(Ur,r,a)}function $t(r){switch(r){case 0:case 9:case 10:case 13:case 32:return 5;case 33:case 43:case 44:case 47:case 62:case 64:case 126:case 59:case 123:case 125:return 4;case 58:return 3;case 34:case 39:case 40:case 91:return 2;case 41:case 93:return 1}return 0}function Mi(r){return tt=Ir=1,Ms=qe(Ur=r),Fe=0,[]}function Di(r){return Ur="",r}function mt(r){return Ps(st(Fe-1,It(r===91?r+2:r===40?r+1:r)))}function $i(r){for(;(we=hr())&&we<33;)Ge();return $t(r)>2||$t(we)>3?"":" "}function Ii(r,a){for(;--a&&Ge()&&!(we<48||we>102||we>57&&we<65||we>70&&we<97););return st(r,Ya()+(a<6&&hr()==32&&Ge()==32))}function It(r){for(;Ge();)switch(we){case r:return Fe;case 34:case 39:r!==34&&r!==39&&It(we);break;case 40:r===41&&It(r);break;case 92:Ge();break}return Fe}function Oi(r,a){for(;Ge()&&r+we!==47+10;)if(r+we===42+42&&hr()===47)break;return"/*"+st(a,Fe-1)+"*"+Ut(r===47?r:Ge())}function Ri(r){for(;!$t(hr());)Ge();return st(r,Fe)}function Li(r){return Di(Ja("",null,null,null,[""],r=Mi(r),0,[0],r))}function Ja(r,a,t,o,c,i,d,p,f){for(var h=0,m=0,u=d,n=0,g=0,E=0,w=1,U=1,A=1,B=0,S="",L=c,j=i,k=o,M=S;U;)switch(E=B,B=Ge()){case 40:if(E!=108&&je(M,u-1)==58){Va(M+=ae(mt(B),"&","&\f"),"&\f",Ts(h?p[h-1]:0))!=-1&&(A=-1);break}case 34:case 39:case 91:M+=mt(B);break;case 9:case 10:case 13:case 32:M+=$i(E);break;case 92:M+=Ii(Ya()-1,7);continue;case 47:switch(hr()){case 42:case 47:ta(Ni(Oi(Ge(),Ya()),a,t,f),f);break;default:M+="/"}break;case 123*w:p[h++]=qe(M)*A;case 125*w:case 59:case 0:switch(B){case 0:case 125:U=0;case 59+m:A==-1&&(M=ae(M,/\f/g,"")),g>0&&qe(M)-u&&ta(g>32?Zt(M+";",o,t,u-1,f):Zt(ae(M," ","")+";",o,t,u-2,f),f);break;case 59:M+=";";default:if(ta(k=Qt(M,a,t,h,m,c,p,S,L=[],j=[],u,i),i),B===123)if(m===0)Ja(M,a,k,k,L,i,u,p,j);else switch(n===99&&je(M,3)===110?100:n){case 100:case 108:case 109:case 115:Ja(r,k,k,o&&ta(Qt(r,k,k,0,0,c,p,S,c,L=[],u,j),j),c,j,u,p,o?L:j);break;default:Ja(M,k,k,k,[""],j,0,p,j)}}h=m=g=0,w=A=1,S=M="",u=d;break;case 58:u=1+qe(M),g=E;default:if(w<1){if(B==123)--w;else if(B==125&&w++==0&&zi()==125)continue}switch(M+=Ut(B),B*w){case 38:A=m>0?1:(M+="\f",-1);break;case 44:p[h++]=(qe(M)-1)*A,A=1;break;case 64:hr()===45&&(M+=mt(Ge())),n=hr(),m=u=qe(S=M+=Ri(Ya())),B++;break;case 45:E===45&&qe(M)==2&&(w=0)}}return i}function Qt(r,a,t,o,c,i,d,p,f,h,m,u){for(var n=c-1,g=c===0?i:[""],E=zs(g),w=0,U=0,A=0;w<o;++w)for(var B=0,S=$r(r,n+1,n=Ts(U=d[w])),L=r;B<E;++B)(L=Ps(U>0?g[B]+" "+S:ae(S,/&\f/g,g[B])))&&(f[A++]=L);return ot(r,a,t,c===0?at:p,f,h,m,u)}function Ni(r,a,t,o){return ot(r,a,t,Es,Ut(Pi()),$r(r,2,-2),0,o)}function Zt(r,a,t,o,c){return ot(r,a,t,Ft,$r(r,0,o),$r(r,o+1,-1),o,c)}function Ds(r,a,t){switch(ki(r,a)){case 5103:return de+"print-"+r+r;case 5737:case 4201:case 3177:case 3433:case 1641:case 4457:case 2921:case 5572:case 6356:case 5844:case 3191:case 6645:case 3005:case 6391:case 5879:case 5623:case 6135:case 4599:case 4855:case 4215:case 6389:case 5109:case 5365:case 5621:case 3829:return de+r+r;case 4789:return sa+r+r;case 5349:case 4246:case 4810:case 6968:case 2756:return de+r+sa+r+he+r+r;case 5936:switch(je(r,a+11)){case 114:return de+r+he+ae(r,/[svh]\w+-[tblr]{2}/,"tb")+r;case 108:return de+r+he+ae(r,/[svh]\w+-[tblr]{2}/,"tb-rl")+r;case 45:return de+r+he+ae(r,/[svh]\w+-[tblr]{2}/,"lr")+r}case 6828:case 4268:case 2903:return de+r+he+r+r;case 6165:return de+r+he+"flex-"+r+r;case 5187:return de+r+ae(r,/(\w+).+(:[^]+)/,de+"box-$1$2"+he+"flex-$1$2")+r;case 5443:return de+r+he+"flex-item-"+ae(r,/flex-|-self/g,"")+(ar(r,/flex-|baseline/)?"":he+"grid-row-"+ae(r,/flex-|-self/g,""))+r;case 4675:return de+r+he+"flex-line-pack"+ae(r,/align-content|flex-|-self/g,"")+r;case 5548:return de+r+he+ae(r,"shrink","negative")+r;case 5292:return de+r+he+ae(r,"basis","preferred-size")+r;case 6060:return de+"box-"+ae(r,"-grow","")+de+r+he+ae(r,"grow","positive")+r;case 4554:return de+ae(r,/([^-])(transform)/g,"$1"+de+"$2")+r;case 6187:return ae(ae(ae(r,/(zoom-|grab)/,de+"$1"),/(image-set)/,de+"$1"),r,"")+r;case 5495:case 3959:return ae(r,/(image-set\([^]*)/,de+"$1$`$1");case 4968:return ae(ae(r,/(.+:)(flex-)?(.*)/,de+"box-pack:$3"+he+"flex-pack:$3"),/s.+-b[^;]+/,"justify")+de+r+r;case 4200:if(!ar(r,/flex-|baseline/))return he+"grid-column-align"+$r(r,a)+r;break;case 2592:case 3360:return he+ae(r,"template-","")+r;case 4384:case 3616:return t&&t.some(function(o,c){return a=c,ar(o.props,/grid-\w+-end/)})?~Va(r+(t=t[a].value),"span",0)?r:he+ae(r,"-start","")+r+he+"grid-row-span:"+(~Va(t,"span",0)?ar(t,/\d+/):+ar(t,/\d+/)-+ar(r,/\d+/))+";":he+ae(r,"-start","")+r;case 4896:case 4128:return t&&t.some(function(o){return ar(o.props,/grid-\w+-start/)})?r:he+ae(ae(r,"-end","-span"),"span ","")+r;case 4095:case 3583:case 4068:case 2532:return ae(r,/(.+)-inline(.+)/,de+"$1$2")+r;case 8116:case 7059:case 5753:case 5535:case 5445:case 5701:case 4933:case 4677:case 5533:case 5789:case 5021:case 4765:if(qe(r)-1-a>6)switch(je(r,a+1)){case 109:if(je(r,a+4)!==45)break;case 102:return ae(r,/(.+:)(.+)-([^]+)/,"$1"+de+"$2-$3$1"+sa+(je(r,a+3)==108?"$3":"$2-$3"))+r;case 115:return~Va(r,"stretch",0)?Ds(ae(r,"stretch","fill-available"),a,t)+r:r}break;case 5152:case 5920:return ae(r,/(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/,function(o,c,i,d,p,f,h){return he+c+":"+i+h+(d?he+c+"-span:"+(p?f:+f-+i)+h:"")+r});case 4949:if(je(r,a+6)===121)return ae(r,":",":"+de)+r;break;case 6444:switch(je(r,je(r,14)===45?18:11)){case 120:return ae(r,/(.+:)([^;\s!]+)(;|(\s+)?!.+)?/,"$1"+de+(je(r,14)===45?"inline-":"")+"box$3$1"+de+"$2$3$1"+he+"$2box$3")+r;case 100:return ae(r,":",":"+he)+r}break;case 5719:case 2647:case 2135:case 3927:case 2391:return ae(r,"scroll-","scroll-snap-")+r}return r}function Qa(r,a){for(var t="",o=0;o<r.length;o++)t+=a(r[o],o,r,a)||"";return t}function Fi(r,a,t,o){switch(r.type){case Ei:if(r.children.length)break;case Ai:case Ft:return r.return=r.return||r.value;case Es:return"";case ks:return r.return=r.value+"{"+Qa(r.children,o)+"}";case at:if(!qe(r.value=r.props.join(",")))return""}return qe(t=Qa(r.children,o))?r.return=r.value+"{"+t+"}":""}function Ui(r){var a=zs(r);return function(t,o,c,i){for(var d="",p=0;p<a;p++)d+=r[p](t,o,c,i)||"";return d}}function Bi(r){return function(a){a.root||(a=a.return)&&r(a)}}function Hi(r,a,t,o){if(r.length>-1&&!r.return)switch(r.type){case Ft:r.return=Ds(r.value,r.length,t);return;case ks:return Qa([sr(r,{value:ae(r.value,"@","@"+de)})],o);case at:if(r.length)return Ti(t=r.props,function(c){switch(ar(c,o=/(::plac\w+|:read-\w+)/)){case":read-only":case":read-write":Cr(sr(r,{props:[ae(c,/:(read-\w+)/,":"+sa+"$1")]})),Cr(sr(r,{props:[c]})),Dt(r,{props:Xt(t,o)});break;case"::placeholder":Cr(sr(r,{props:[ae(c,/:(plac\w+)/,":"+de+"input-$1")]})),Cr(sr(r,{props:[ae(c,/:(plac\w+)/,":"+sa+"$1")]})),Cr(sr(r,{props:[ae(c,/:(plac\w+)/,he+"input-$1")]})),Cr(sr(r,{props:[c]})),Dt(r,{props:Xt(t,o)});break}return""})}}var _i={animationIterationCount:1,aspectRatio:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,boxFlex:1,boxFlexGroup:1,boxOrdinalGroup:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexPositive:1,flexShrink:1,flexNegative:1,flexOrder:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,msGridRow:1,msGridRowSpan:1,msGridColumn:1,msGridColumnSpan:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1},Or=typeof process<"u"&&process.env!==void 0&&({}.REACT_APP_SC_ATTR||{}.SC_ATTR)||"data-styled",$s="active",Is="data-styled-version",it="6.1.18",Bt=`/*!sc*/
`,Za=typeof window<"u"&&typeof document<"u",Gi=!!(typeof SC_DISABLE_SPEEDY=="boolean"?SC_DISABLE_SPEEDY:typeof process<"u"&&process.env!==void 0&&{}.REACT_APP_SC_DISABLE_SPEEDY!==void 0&&{}.REACT_APP_SC_DISABLE_SPEEDY!==""?{}.REACT_APP_SC_DISABLE_SPEEDY!=="false"&&{}.REACT_APP_SC_DISABLE_SPEEDY:typeof process<"u"&&process.env!==void 0&&{}.SC_DISABLE_SPEEDY!==void 0&&{}.SC_DISABLE_SPEEDY!==""&&{}.SC_DISABLE_SPEEDY!=="false"&&{}.SC_DISABLE_SPEEDY),nt=Object.freeze([]),Rr=Object.freeze({});function qi(r,a,t){return t===void 0&&(t=Rr),r.theme!==t.theme&&r.theme||a||t.theme}var Os=new Set(["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","big","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","track","u","ul","use","var","video","wbr","circle","clipPath","defs","ellipse","foreignObject","g","image","line","linearGradient","marker","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","text","tspan"]),Vi=/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g,Yi=/(^-|-$)/g;function eo(r){return r.replace(Vi,"-").replace(Yi,"")}var Ji=/(a)(d)/gi,da=52,ro=function(r){return String.fromCharCode(r+(r>25?39:97))};function Ot(r){var a,t="";for(a=Math.abs(r);a>da;a=a/da|0)t=ro(a%da)+t;return(ro(a%da)+t).replace(Ji,"$1-$2")}var pt,Rs=5381,Mr=function(r,a){for(var t=a.length;t;)r=33*r^a.charCodeAt(--t);return r},Ls=function(r){return Mr(Rs,r)};function Wi(r){return Ot(Ls(r)>>>0)}function Ki(r){return r.displayName||r.name||"Component"}function ut(r){return typeof r=="string"&&!0}var Ns=typeof Symbol=="function"&&Symbol.for,Fs=Ns?Symbol.for("react.memo"):60115,Xi=Ns?Symbol.for("react.forward_ref"):60112,Qi={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},Zi={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},Us={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},en=((pt={})[Xi]={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},pt[Fs]=Us,pt);function ao(r){return("type"in(a=r)&&a.type.$$typeof)===Fs?Us:"$$typeof"in r?en[r.$$typeof]:Qi;var a}var rn=Object.defineProperty,an=Object.getOwnPropertyNames,to=Object.getOwnPropertySymbols,tn=Object.getOwnPropertyDescriptor,on=Object.getPrototypeOf,oo=Object.prototype;function Bs(r,a,t){if(typeof a!="string"){if(oo){var o=on(a);o&&o!==oo&&Bs(r,o,t)}var c=an(a);to&&(c=c.concat(to(a)));for(var i=ao(r),d=ao(a),p=0;p<c.length;++p){var f=c[p];if(!(f in Zi||t&&t[f]||d&&f in d||i&&f in i)){var h=tn(a,f);try{rn(r,f,h)}catch{}}}}return r}function Lr(r){return typeof r=="function"}function Ht(r){return typeof r=="object"&&"styledComponentId"in r}function ur(r,a){return r&&a?"".concat(r," ").concat(a):r||a||""}function so(r,a){if(r.length===0)return"";for(var t=r[0],o=1;o<r.length;o++)t+=a?a+r[o]:r[o];return t}function ia(r){return r!==null&&typeof r=="object"&&r.constructor.name===Object.name&&!("props"in r&&r.$$typeof)}function Rt(r,a,t){if(t===void 0&&(t=!1),!t&&!ia(r)&&!Array.isArray(r))return a;if(Array.isArray(a))for(var o=0;o<a.length;o++)r[o]=Rt(r[o],a[o]);else if(ia(a))for(var o in a)r[o]=Rt(r[o],a[o]);return r}function _t(r,a){Object.defineProperty(r,"toString",{value:a})}function ca(r){for(var a=[],t=1;t<arguments.length;t++)a[t-1]=arguments[t];return new Error("An error occurred. See https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/utils/errors.md#".concat(r," for more information.").concat(a.length>0?" Args: ".concat(a.join(", ")):""))}var sn=function(){function r(a){this.groupSizes=new Uint32Array(512),this.length=512,this.tag=a}return r.prototype.indexOfGroup=function(a){for(var t=0,o=0;o<a;o++)t+=this.groupSizes[o];return t},r.prototype.insertRules=function(a,t){if(a>=this.groupSizes.length){for(var o=this.groupSizes,c=o.length,i=c;a>=i;)if((i<<=1)<0)throw ca(16,"".concat(a));this.groupSizes=new Uint32Array(i),this.groupSizes.set(o),this.length=i;for(var d=c;d<i;d++)this.groupSizes[d]=0}for(var p=this.indexOfGroup(a+1),f=(d=0,t.length);d<f;d++)this.tag.insertRule(p,t[d])&&(this.groupSizes[a]++,p++)},r.prototype.clearGroup=function(a){if(a<this.length){var t=this.groupSizes[a],o=this.indexOfGroup(a),c=o+t;this.groupSizes[a]=0;for(var i=o;i<c;i++)this.tag.deleteRule(o)}},r.prototype.getGroup=function(a){var t="";if(a>=this.length||this.groupSizes[a]===0)return t;for(var o=this.groupSizes[a],c=this.indexOfGroup(a),i=c+o,d=c;d<i;d++)t+="".concat(this.tag.getRule(d)).concat(Bt);return t},r}(),Wa=new Map,et=new Map,Ka=1,ma=function(r){if(Wa.has(r))return Wa.get(r);for(;et.has(Ka);)Ka++;var a=Ka++;return Wa.set(r,a),et.set(a,r),a},nn=function(r,a){Ka=a+1,Wa.set(r,a),et.set(a,r)},cn="style[".concat(Or,"][").concat(Is,'="').concat(it,'"]'),ln=new RegExp("^".concat(Or,'\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)')),dn=function(r,a,t){for(var o,c=t.split(","),i=0,d=c.length;i<d;i++)(o=c[i])&&r.registerName(a,o)},mn=function(r,a){for(var t,o=((t=a.textContent)!==null&&t!==void 0?t:"").split(Bt),c=[],i=0,d=o.length;i<d;i++){var p=o[i].trim();if(p){var f=p.match(ln);if(f){var h=0|parseInt(f[1],10),m=f[2];h!==0&&(nn(m,h),dn(r,m,f[3]),r.getTag().insertRules(h,c)),c.length=0}else c.push(p)}}},io=function(r){for(var a=document.querySelectorAll(cn),t=0,o=a.length;t<o;t++){var c=a[t];c&&c.getAttribute(Or)!==$s&&(mn(r,c),c.parentNode&&c.parentNode.removeChild(c))}};function pn(){return typeof __webpack_nonce__<"u"?__webpack_nonce__:null}var Hs=function(r){var a=document.head,t=r||a,o=document.createElement("style"),c=function(p){var f=Array.from(p.querySelectorAll("style[".concat(Or,"]")));return f[f.length-1]}(t),i=c!==void 0?c.nextSibling:null;o.setAttribute(Or,$s),o.setAttribute(Is,it);var d=pn();return d&&o.setAttribute("nonce",d),t.insertBefore(o,i),o},un=function(){function r(a){this.element=Hs(a),this.element.appendChild(document.createTextNode("")),this.sheet=function(t){if(t.sheet)return t.sheet;for(var o=document.styleSheets,c=0,i=o.length;c<i;c++){var d=o[c];if(d.ownerNode===t)return d}throw ca(17)}(this.element),this.length=0}return r.prototype.insertRule=function(a,t){try{return this.sheet.insertRule(t,a),this.length++,!0}catch{return!1}},r.prototype.deleteRule=function(a){this.sheet.deleteRule(a),this.length--},r.prototype.getRule=function(a){var t=this.sheet.cssRules[a];return t&&t.cssText?t.cssText:""},r}(),gn=function(){function r(a){this.element=Hs(a),this.nodes=this.element.childNodes,this.length=0}return r.prototype.insertRule=function(a,t){if(a<=this.length&&a>=0){var o=document.createTextNode(t);return this.element.insertBefore(o,this.nodes[a]||null),this.length++,!0}return!1},r.prototype.deleteRule=function(a){this.element.removeChild(this.nodes[a]),this.length--},r.prototype.getRule=function(a){return a<this.length?this.nodes[a].textContent:""},r}(),hn=function(){function r(a){this.rules=[],this.length=0}return r.prototype.insertRule=function(a,t){return a<=this.length&&(this.rules.splice(a,0,t),this.length++,!0)},r.prototype.deleteRule=function(a){this.rules.splice(a,1),this.length--},r.prototype.getRule=function(a){return a<this.length?this.rules[a]:""},r}(),no=Za,fn={isServer:!Za,useCSSOMInjection:!Gi},_s=function(){function r(a,t,o){a===void 0&&(a=Rr),t===void 0&&(t={});var c=this;this.options=Me(Me({},fn),a),this.gs=t,this.names=new Map(o),this.server=!!a.isServer,!this.server&&Za&&no&&(no=!1,io(this)),_t(this,function(){return function(i){for(var d=i.getTag(),p=d.length,f="",h=function(u){var n=function(A){return et.get(A)}(u);if(n===void 0)return"continue";var g=i.names.get(n),E=d.getGroup(u);if(g===void 0||!g.size||E.length===0)return"continue";var w="".concat(Or,".g").concat(u,'[id="').concat(n,'"]'),U="";g!==void 0&&g.forEach(function(A){A.length>0&&(U+="".concat(A,","))}),f+="".concat(E).concat(w,'{content:"').concat(U,'"}').concat(Bt)},m=0;m<p;m++)h(m);return f}(c)})}return r.registerId=function(a){return ma(a)},r.prototype.rehydrate=function(){!this.server&&Za&&io(this)},r.prototype.reconstructWithOptions=function(a,t){return t===void 0&&(t=!0),new r(Me(Me({},this.options),a),this.gs,t&&this.names||void 0)},r.prototype.allocateGSInstance=function(a){return this.gs[a]=(this.gs[a]||0)+1},r.prototype.getTag=function(){return this.tag||(this.tag=(a=function(t){var o=t.useCSSOMInjection,c=t.target;return t.isServer?new hn(c):o?new un(c):new gn(c)}(this.options),new sn(a)));var a},r.prototype.hasNameForId=function(a,t){return this.names.has(a)&&this.names.get(a).has(t)},r.prototype.registerName=function(a,t){if(ma(a),this.names.has(a))this.names.get(a).add(t);else{var o=new Set;o.add(t),this.names.set(a,o)}},r.prototype.insertRules=function(a,t,o){this.registerName(a,t),this.getTag().insertRules(ma(a),o)},r.prototype.clearNames=function(a){this.names.has(a)&&this.names.get(a).clear()},r.prototype.clearRules=function(a){this.getTag().clearGroup(ma(a)),this.clearNames(a)},r.prototype.clearTag=function(){this.tag=void 0},r}(),vn=/&/g,xn=/^\s*\/\/.*$/gm;function Gs(r,a){return r.map(function(t){return t.type==="rule"&&(t.value="".concat(a," ").concat(t.value),t.value=t.value.replaceAll(",",",".concat(a," ")),t.props=t.props.map(function(o){return"".concat(a," ").concat(o)})),Array.isArray(t.children)&&t.type!=="@keyframes"&&(t.children=Gs(t.children,a)),t})}function yn(r){var a,t,o,c=r===void 0?Rr:r,i=c.options,d=i===void 0?Rr:i,p=c.plugins,f=p===void 0?nt:p,h=function(n,g,E){return E.startsWith(t)&&E.endsWith(t)&&E.replaceAll(t,"").length>0?".".concat(a):n},m=f.slice();m.push(function(n){n.type===at&&n.value.includes("&")&&(n.props[0]=n.props[0].replace(vn,t).replace(o,h))}),d.prefix&&m.push(Hi),m.push(Fi);var u=function(n,g,E,w){g===void 0&&(g=""),E===void 0&&(E=""),w===void 0&&(w="&"),a=w,t=g,o=new RegExp("\\".concat(t,"\\b"),"g");var U=n.replace(xn,""),A=Li(E||g?"".concat(E," ").concat(g," { ").concat(U," }"):U);d.namespace&&(A=Gs(A,d.namespace));var B=[];return Qa(A,Ui(m.concat(Bi(function(S){return B.push(S)})))),B};return u.hash=f.length?f.reduce(function(n,g){return g.name||ca(15),Mr(n,g.name)},Rs).toString():"",u}var bn=new _s,Lt=yn(),qs=Dr.createContext({shouldForwardProp:void 0,styleSheet:bn,stylis:Lt});qs.Consumer;Dr.createContext(void 0);function co(){return l.useContext(qs)}var wn=function(){function r(a,t){var o=this;this.inject=function(c,i){i===void 0&&(i=Lt);var d=o.name+i.hash;c.hasNameForId(o.id,d)||c.insertRules(o.id,d,i(o.rules,d,"@keyframes"))},this.name=a,this.id="sc-keyframes-".concat(a),this.rules=t,_t(this,function(){throw ca(12,String(o.name))})}return r.prototype.getName=function(a){return a===void 0&&(a=Lt),this.name+a.hash},r}(),jn=function(r){return r>="A"&&r<="Z"};function lo(r){for(var a="",t=0;t<r.length;t++){var o=r[t];if(t===1&&o==="-"&&r[0]==="-")return r;jn(o)?a+="-"+o.toLowerCase():a+=o}return a.startsWith("ms-")?"-"+a:a}var Vs=function(r){return r==null||r===!1||r===""},Ys=function(r){var a,t,o=[];for(var c in r){var i=r[c];r.hasOwnProperty(c)&&!Vs(i)&&(Array.isArray(i)&&i.isCss||Lr(i)?o.push("".concat(lo(c),":"),i,";"):ia(i)?o.push.apply(o,Xa(Xa(["".concat(c," {")],Ys(i),!1),["}"],!1)):o.push("".concat(lo(c),": ").concat((a=c,(t=i)==null||typeof t=="boolean"||t===""?"":typeof t!="number"||t===0||a in _i||a.startsWith("--")?String(t).trim():"".concat(t,"px")),";")))}return o};function fr(r,a,t,o){if(Vs(r))return[];if(Ht(r))return[".".concat(r.styledComponentId)];if(Lr(r)){if(!Lr(i=r)||i.prototype&&i.prototype.isReactComponent||!a)return[r];var c=r(a);return fr(c,a,t,o)}var i;return r instanceof wn?t?(r.inject(t,o),[r.getName(o)]):[r]:ia(r)?Ys(r):Array.isArray(r)?Array.prototype.concat.apply(nt,r.map(function(d){return fr(d,a,t,o)})):[r.toString()]}function Sn(r){for(var a=0;a<r.length;a+=1){var t=r[a];if(Lr(t)&&!Ht(t))return!1}return!0}var Cn=Ls(it),An=function(){function r(a,t,o){this.rules=a,this.staticRulesId="",this.isStatic=(o===void 0||o.isStatic)&&Sn(a),this.componentId=t,this.baseHash=Mr(Cn,t),this.baseStyle=o,_s.registerId(t)}return r.prototype.generateAndInjectStyles=function(a,t,o){var c=this.baseStyle?this.baseStyle.generateAndInjectStyles(a,t,o):"";if(this.isStatic&&!o.hash)if(this.staticRulesId&&t.hasNameForId(this.componentId,this.staticRulesId))c=ur(c,this.staticRulesId);else{var i=so(fr(this.rules,a,t,o)),d=Ot(Mr(this.baseHash,i)>>>0);if(!t.hasNameForId(this.componentId,d)){var p=o(i,".".concat(d),void 0,this.componentId);t.insertRules(this.componentId,d,p)}c=ur(c,d),this.staticRulesId=d}else{for(var f=Mr(this.baseHash,o.hash),h="",m=0;m<this.rules.length;m++){var u=this.rules[m];if(typeof u=="string")h+=u;else if(u){var n=so(fr(u,a,t,o));f=Mr(f,n+m),h+=n}}if(h){var g=Ot(f>>>0);t.hasNameForId(this.componentId,g)||t.insertRules(this.componentId,g,o(h,".".concat(g),void 0,this.componentId)),c=ur(c,g)}}return c},r}(),Js=Dr.createContext(void 0);Js.Consumer;var gt={};function En(r,a,t){var o=Ht(r),c=r,i=!ut(r),d=a.attrs,p=d===void 0?nt:d,f=a.componentId,h=f===void 0?function(L,j){var k=typeof L!="string"?"sc":eo(L);gt[k]=(gt[k]||0)+1;var M="".concat(k,"-").concat(Wi(it+k+gt[k]));return j?"".concat(j,"-").concat(M):M}(a.displayName,a.parentComponentId):f,m=a.displayName,u=m===void 0?function(L){return ut(L)?"styled.".concat(L):"Styled(".concat(Ki(L),")")}(r):m,n=a.displayName&&a.componentId?"".concat(eo(a.displayName),"-").concat(a.componentId):a.componentId||h,g=o&&c.attrs?c.attrs.concat(p).filter(Boolean):p,E=a.shouldForwardProp;if(o&&c.shouldForwardProp){var w=c.shouldForwardProp;if(a.shouldForwardProp){var U=a.shouldForwardProp;E=function(L,j){return w(L,j)&&U(L,j)}}else E=w}var A=new An(t,n,o?c.componentStyle:void 0);function B(L,j){return function(k,M,P){var W=k.attrs,Q=k.componentStyle,H=k.defaultProps,T=k.foldedComponentIds,z=k.styledComponentId,b=k.target,O=Dr.useContext(Js),D=co(),Y=k.shouldForwardProp||D.shouldForwardProp,X=qi(M,O,H)||Rr,G=function(N,J,K){for(var ce,V=Me(Me({},J),{className:void 0,theme:K}),oe=0;oe<N.length;oe+=1){var ue=Lr(ce=N[oe])?ce(V):ce;for(var q in ue)V[q]=q==="className"?ur(V[q],ue[q]):q==="style"?Me(Me({},V[q]),ue[q]):ue[q]}return J.className&&(V.className=ur(V.className,J.className)),V}(W,M,X),me=G.as||b,ne={};for(var pe in G)G[pe]===void 0||pe[0]==="$"||pe==="as"||pe==="theme"&&G.theme===X||(pe==="forwardedAs"?ne.as=G.forwardedAs:Y&&!Y(pe,me)||(ne[pe]=G[pe]));var ye=function(N,J){var K=co(),ce=N.generateAndInjectStyles(J,K.styleSheet,K.stylis);return ce}(Q,G),I=ur(T,z);return ye&&(I+=" "+ye),G.className&&(I+=" "+G.className),ne[ut(me)&&!Os.has(me)?"class":"className"]=I,P&&(ne.ref=P),l.createElement(me,ne)}(S,L,j)}B.displayName=u;var S=Dr.forwardRef(B);return S.attrs=g,S.componentStyle=A,S.displayName=u,S.shouldForwardProp=E,S.foldedComponentIds=o?ur(c.foldedComponentIds,c.styledComponentId):"",S.styledComponentId=n,S.target=o?c.target:r,Object.defineProperty(S,"defaultProps",{get:function(){return this._foldedDefaultProps},set:function(L){this._foldedDefaultProps=o?function(j){for(var k=[],M=1;M<arguments.length;M++)k[M-1]=arguments[M];for(var P=0,W=k;P<W.length;P++)Rt(j,W[P],!0);return j}({},c.defaultProps,L):L}}),_t(S,function(){return".".concat(S.styledComponentId)}),i&&Bs(S,r,{attrs:!0,componentStyle:!0,displayName:!0,foldedComponentIds:!0,shouldForwardProp:!0,styledComponentId:!0,target:!0}),S}function mo(r,a){for(var t=[r[0]],o=0,c=a.length;o<c;o+=1)t.push(a[o],r[o+1]);return t}var po=function(r){return Object.assign(r,{isCss:!0})};function kn(r){for(var a=[],t=1;t<arguments.length;t++)a[t-1]=arguments[t];if(Lr(r)||ia(r))return po(fr(mo(nt,Xa([r],a,!0))));var o=r;return a.length===0&&o.length===1&&typeof o[0]=="string"?fr(o):po(fr(mo(o,a)))}function Nt(r,a,t){if(t===void 0&&(t=Rr),!a)throw ca(1,a);var o=function(c){for(var i=[],d=1;d<arguments.length;d++)i[d-1]=arguments[d];return r(a,t,kn.apply(void 0,Xa([c],i,!1)))};return o.attrs=function(c){return Nt(r,a,Me(Me({},t),{attrs:Array.prototype.concat(t.attrs,c).filter(Boolean)}))},o.withConfig=function(c){return Nt(r,a,Me(Me({},t),c))},o}var Ws=function(r){return Nt(En,r)},s=Ws;Os.forEach(function(r){s[r]=Ws(r)});const te=r=>{const a=document.createElement("div");a.setAttribute("aria-live","polite"),a.setAttribute("aria-atomic","true"),a.className="sr-only",a.textContent=r,document.body.appendChild(a),setTimeout(()=>{document.body.removeChild(a)},1e3)},vr=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches,Br=()=>window.matchMedia("(prefers-contrast: high)").matches,Ks=()=>{const r=document.body;Br()&&r.classList.add("high-contrast"),vr()&&r.classList.add("reduced-motion")},Tn=r=>{localStorage.setItem("betina_accessibility",JSON.stringify(r)),Ks()},Pn=()=>{const r=document.body,a=r.classList.contains("high-contrast");a?r.classList.remove("high-contrast"):r.classList.add("high-contrast");const t=zn();Tn({...t,highContrast:!a}),te(a?"Alto contraste desativado":"Alto contraste ativado")},zn=()=>{const r=document.body;return{highContrast:r.classList.contains("high-contrast"),reducedMotion:r.classList.contains("reduced-motion"),largeText:r.classList.contains("large-text"),soundEnabled:!r.classList.contains("sound-disabled")}},Mn=()=>"vibrate"in navigator,Xs=(r=[100])=>{Mn()&&navigator.vibrate(r)},Je=()=>{Xs([100,50,100])},Hr=()=>{Xs([200])},Dn=()=>{if(Ks(),!document.getElementById("accessibility-styles")){const r=document.createElement("style");r.id="accessibility-styles",r.textContent=`
      .high-contrast {
        background-color: black;
        color: white;
      }
      .reduced-motion * {
        animation: none;
        transition: none;
      }
    `,document.head.appendChild(r)}};vr();const $n="http://localhost/api";class In{constructor(){this.apiUrl=$n,console.log("DatabaseService iniciado - APENAS MODO ONLINE"),console.log("API URL:",this.apiUrl)}async checkApiHealth(){try{if((await fetch(`${this.apiUrl}/health`,{method:"GET",headers:{Accept:"application/json"}})).ok)return console.log("API disponível"),!0;throw new Error("API não disponível")}catch(a){throw console.error("Erro ao conectar com a API:",a.message),new Error("Conecte-se à internet para usar o Portal Betina")}}async createAnonymousUser(){try{const a=await fetch(`${this.apiUrl}/user`,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({is_anonymous:!0})});if(!a.ok)throw new Error(`HTTP error! status: ${a.status}`);const t=await a.json();return console.log("Usuário anônimo criado:",t.id),t.id}catch(a){throw console.error("Erro ao criar usuário anônimo:",a),new Error("Não foi possível criar usuário. Verifique sua conexão com a internet.")}}async getUser(a){if(!a||typeof a!="string")return console.error("UserId inválido:",a),null;try{const t=await fetch(`${this.apiUrl}/user/${a}`,{method:"GET",headers:{Accept:"application/json"}});if(!t.ok){if(t.status===404)return null;throw new Error(`HTTP error! status: ${t.status}`)}return await t.json()}catch(t){throw console.error("Erro ao buscar usuário:",t),new Error("Não foi possível buscar usuário. Verifique sua conexão com a internet.")}}async updateUserPreferences(a,t){try{const o=await fetch(`${this.apiUrl}/user/${a}/preferences`,{method:"PUT",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(t)});if(!o.ok)throw new Error(`HTTP error! status: ${o.status}`);return!0}catch(o){throw console.error("Erro ao atualizar preferências:",o),new Error("Não foi possível atualizar preferências. Verifique sua conexão com a internet.")}}async getAccessibilitySettings(a){const t={fontSize:"medium",contrast:"normal",audioEnabled:!0,animations:!0};try{const o=await fetch(`${this.apiUrl}/user/${a}/accessibility`,{method:"GET",headers:{Accept:"application/json"}});if(!o.ok){if(o.status===404)return t;throw new Error(`HTTP error! status: ${o.status}`)}return await o.json()}catch(o){return console.error("Erro ao buscar configurações de acessibilidade:",o),t}}async updateAccessibilitySettings(a,t){try{const o=await fetch(`${this.apiUrl}/user/${a}/accessibility`,{method:"PUT",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(t)});if(!o.ok)throw new Error(`HTTP error! status: ${o.status}`);return!0}catch(o){throw console.error("Erro ao atualizar configurações de acessibilidade:",o),new Error("Não foi possível atualizar configurações. Verifique sua conexão com a internet.")}}async saveGameSession(a){try{const t=await fetch(`${this.apiUrl}/game-session`,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(a)});if(!t.ok)throw new Error(`HTTP error! status: ${t.status}`);return await t.json()}catch(t){throw console.error("Erro ao salvar sessão de jogo:",t),new Error("Não foi possível salvar sessão. Verifique sua conexão com a internet.")}}async getUserGameSessions(a){try{const t=await fetch(`${this.apiUrl}/user/${a}/game-sessions`,{method:"GET",headers:{Accept:"application/json"}});if(!t.ok)throw new Error(`HTTP error! status: ${t.status}`);return await t.json()}catch(t){return console.error("Erro ao buscar sessões de jogo:",t),[]}}async getGameSessions(a,t=null,o=50){if(!a||typeof a!="string")return console.error("UserId inválido para getGameSessions:",a),[];try{let c=`${this.apiUrl}/user/${a}/game-sessions`;const i=new URLSearchParams;t&&i.append("game_id",t),o&&i.append("limit",o),i.toString()&&(c+="?"+i.toString());const d=await fetch(c,{method:"GET",headers:{Accept:"application/json"}});if(!d.ok)throw new Error(`HTTP error! status: ${d.status}`);return await d.json()}catch(c){return console.error("Erro ao buscar sessões de jogo:",c),[]}}async healthCheck(){return await this.checkApiHealth()}async closeConnection(){}async deleteUser(a){try{const t=await fetch(`${this.apiUrl}/user/${a}`,{method:"DELETE",headers:{Accept:"application/json"}});if(!t.ok)throw new Error(`HTTP error! status: ${t.status}`);return!0}catch(t){throw console.error("Erro ao excluir usuário:",t),new Error("Não foi possível excluir usuário. Verifique sua conexão com a internet.")}}async getAdaptiveParameters(a,t){const o={"memory-game":{EASY:{pairs:4,timeLimit:120,hintDuration:1e3},MEDIUM:{pairs:6,timeLimit:180,hintDuration:800},HARD:{pairs:8,timeLimit:240,hintDuration:500}},"color-match":{EASY:{correctItems:2,incorrectItems:2,timeLimit:60},MEDIUM:{correctItems:3,incorrectItems:3,timeLimit:45},HARD:{correctItems:4,incorrectItems:4,timeLimit:30}},"letter-recognition":{EASY:{focusLetters:["A","E","O"],timeLimit:15,audioHints:!0},MEDIUM:{focusLetters:["A","B","C","D","E","F","G","H"],timeLimit:10,audioHints:!1},HARD:{focusLetters:["L","M","N","P","R","S","T","V","Z"],timeLimit:8,audioHints:!1}},"musical-sequence":{EASY:{maxNotes:3,speed:1e3},MEDIUM:{maxNotes:5,speed:800},HARD:{maxNotes:7,speed:600}},"number-counting":{EASY:{minCount:1,maxCount:5,options:3},MEDIUM:{minCount:1,maxCount:10,options:4},HARD:{minCount:5,maxCount:15,options:5}},"image-association":{EASY:{categories:["animals","fruits"],timeLimit:20},MEDIUM:{categories:["animals","fruits","toys","vehicles"],timeLimit:15},HARD:{categories:["all"],timeLimit:10}},"creative-painting":{EASY:{minStrokes:3,minColors:1,timeLimit:180,challengeType:"free-draw"},MEDIUM:{minStrokes:5,minColors:2,timeLimit:120,challengeType:"guided"},HARD:{minStrokes:8,minColors:4,timeLimit:90,challengeType:"complex"}}};try{const c=await fetch(`${this.apiUrl}/adaptive-parameters/${a}/${t}`,{method:"GET",headers:{Accept:"application/json"}});if(!c.ok){if(c.status===404){const d=o[a];return d&&d[t]?{gameId:a,difficulty:t,parameters:d[t],timestamp:new Date().toISOString()}:null}throw new Error(`HTTP error! status: ${c.status}`)}return await c.json()}catch(c){console.error("Erro ao buscar parâmetros adaptativos, usando padrão:",c);const i=o[a];return i&&i[t]?{gameId:a,difficulty:t,parameters:i[t],timestamp:new Date().toISOString()}:null}}}const re=new In,Qs=l.createContext(null),Vr="betina_user_id";function On({children:r}){const[a,t]=l.useState(null),[o,c]=l.useState(null),[i,d]=l.useState(!0),[p,f]=l.useState(null),[h,m]=l.useState(!1);l.useEffect(()=>{(async()=>{try{const T=await re.healthCheck();m(T),console.log("Conexão com banco de dados:",T?"OK":"Falhou")}catch(T){console.warn("Erro ao verificar conexão com banco de dados:",T),m(!1)}})()},[]),l.useEffect(()=>{h!==null&&(async()=>{try{const T=localStorage.getItem(Vr);if(T)if(h)try{const b=await re.getUser(T);if(b){t(T),c(b),d(!1);return}}catch(b){console.warn("Erro ao buscar usuário do banco:",b),t(T),d(!1);return}else{t(T),d(!1);return}if(h)try{const b=await re.createAnonymousUser();if(b&&typeof b=="string"){localStorage.setItem(Vr,b),t(b);const O=await re.getUser(b);c(O),d(!1);return}}catch(b){console.warn("Erro ao criar usuário no banco:",b)}const z="local_"+Date.now()+"_"+Math.floor(Math.random()*1e3);localStorage.setItem(Vr,z),t(z)}catch(T){console.error("Erro ao carregar/criar usuário:",T),f(T.message)}finally{d(!1)}})()},[h]);const u=async H=>{if(!a)return!1;try{if(localStorage.setItem("betina_accessibility_settings",JSON.stringify(H)),h)try{await re.updateAccessibilitySettings(a,H)}catch(T){console.warn("Erro ao salvar configurações de acessibilidade no banco:",T)}return!0}catch(T){return console.error("Erro ao atualizar configurações de acessibilidade:",T),!1}},n=async()=>{try{if(a&&h)try{const T=await re.getAccessibilitySettings(a);if(T)return T}catch(T){console.warn("Erro ao obter configurações de acessibilidade do banco:",T)}const H=localStorage.getItem("betina_accessibility_settings");return H?JSON.parse(H):null}catch(H){return console.error("Erro ao obter configurações de acessibilidade:",H),null}},g=async()=>{if(!h)return[];try{return await re.getUserGameSessions(a)}catch(H){return console.error("Erro ao carregar usuários:",H),[]}},E=async H=>{if(!h)return null;try{const T=await re.createAnonymousUser();return T&&H?(await re.updateUserPreferences(T,H.preferences||{}),T):null}catch(T){return console.error("Erro ao criar usuário:",T),null}},w=async H=>{try{if(localStorage.setItem(Vr,H),t(H),h){const T=await re.getUser(H);c(T)}return!0}catch(T){return console.error("Erro ao trocar de usuário:",T),!1}},U=async(H,T)=>{if(!h)return!1;try{return await re.updateUserPreferences(H,T.preferences||{}),!0}catch(z){return console.error("Erro ao atualizar usuário:",z),!1}},A=async H=>{if(!h)return!1;try{if(await re.deleteUser(H),H===a){const T=await re.createAnonymousUser();localStorage.setItem(Vr,T),t(T)}return!0}catch(T){return console.error("Erro ao excluir usuário:",T),!1}},B=async(H,T)=>{if(!a)return!1;try{h&&await re.saveGameSession({user_id:a,game_id:H,performance_data:T,timestamp:new Date().toISOString()});const z=S(T),b=await re.getAdaptiveParameters(H,z);return b&&await U(a,{preferences:{...o?.preferences,[H]:b}}),!0}catch(z){return console.error("Erro ao registrar desempenho:",z),!1}},S=H=>{const{correct:T,incorrect:z,responseTimes:b}=H,O=T/(T+z);return O>.8?"HARD":O>.5?"MEDIUM":"EASY"},Q={userId:a,userDetails:o,loading:i,error:p,isDbConnected:h,updateAccessibilitySettings:u,getAccessibilitySettings:n,loadUsers:g,createUser:E,switchUser:w,updateUser:U,deleteUser:A,recordPerformance:B,getUserProfiles:async()=>{if(!a||!h)return[];try{return await re.getUserProfiles(a)}catch(H){return console.error("Erro ao obter perfis do usuário:",H),[]}},createUserProfile:async H=>{if(!a||!h)return null;try{return await re.createUserProfile(a,H)}catch(T){return console.error("Erro ao criar perfil:",T),null}},updateUserProfile:async(H,T)=>{if(!a||!h)return null;try{return await re.updateUserProfile(a,H,T)}catch(z){return console.error("Erro ao atualizar perfil:",z),null}},deleteUserProfile:async H=>{if(!a||!h)return!1;try{return await re.deleteUserProfile(a,H)}catch(T){throw console.error("Erro ao deletar perfil:",T),T}},activateUserProfile:async H=>{if(!a||!h)return!1;try{return await re.activateUserProfile(a,H)}catch(T){return console.error("Erro ao ativar perfil:",T),!1}},getActiveUserProfile:async()=>{if(!a||!h)return null;try{return await re.getActiveUserProfile(a)}catch(H){return console.error("Erro ao obter perfil ativo:",H),null}}};return e.jsx(Qs.Provider,{value:Q,children:r})}function xr(){const r=l.useContext(Qs);if(r===null)throw new Error("useUser deve ser usado dentro de um UserProvider");return r}const Rn=s.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${r=>r.$isConnected?"rgba(0, 128, 0, 0.2)":"rgba(255, 165, 0, 0.2)"};
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  color: ${r=>r.$isConnected?"var(--primary-green)":"var(--primary-orange)"};
  border: 1px solid ${r=>r.$isConnected?"var(--primary-green)":"var(--primary-orange)"};
  z-index: 1000;
  cursor: pointer;
  
  /* Quando no cabeçalho (header) */
  &.header {
    position: static;
    margin-right: auto; /* Empurra para a esquerda */
  }
  
  /* Quando fixo na tela (modo original) */
  &.fixed {
    position: fixed;
    bottom: 10px;
    right: 10px;
  }
`,Ln=s(_.div)`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${r=>r.$isConnected?"var(--primary-green)":"var(--primary-orange)"};
`,Nn=({position:r="fixed"})=>{const{isDbConnected:a}=xr();return e.jsxs(Rn,{$isConnected:a,title:a?"Banco de dados conectado":"Usando armazenamento local",className:r,children:[e.jsx(Ln,{$isConnected:a,animate:{opacity:[.5,1,.5]},transition:{repeat:1/0,duration:2}}),e.jsx("span",{children:a?"BD Conectado":"Modo Local"})]})},Fn=s.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-light);
  position: sticky;
  top: 0;
  z-index: 100;
`,Un=s.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-md);
  position: relative;
  
  @media (max-width: 768px) {
    padding: var(--space-sm);
    gap: var(--space-sm);
  }
  
  @media (max-width: 480px) {
    padding: var(--space-xs);
    gap: var(--space-xs);
  }
`,Gt=s.div`
  flex: 1;
  display: flex;
`,Bn=s(Gt)`
  justify-content: flex-start;
`,Hn=s(Gt)`
  justify-content: center;
  flex: 2;
`,_n=s(Gt)`
  justify-content: flex-end;
`,Gn=s(_.h1)`
  font-size: calc(var(--font-size-xl) * 1.3); /* Aumentado em 30% */
  color: var(--primary-blue);
  margin: 0;
  text-align: center;
  cursor: pointer;
  font-weight: 700; /* Aumentado de 600 para 700 */
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  
  &:hover {
    color: var(--primary-purple);
    transform: scale(1.02);
  }
  
  @media (max-width: 768px) {
    font-size: calc(var(--font-size-lg) * 1.3);
  }
  
  @media (max-width: 480px) {
    font-size: calc(var(--font-size-md) * 1.3);
  }
`;s.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
`;s(_.h2)`
  font-size: var(--font-size-md);
  color: var(--primary-purple);
  margin: 0;
  text-align: center;
  font-weight: 400;
  opacity: 0.8;
  
  @media (max-width: 768px) {
    font-size: var(--font-size-sm);
  }
  
  @media (max-width: 480px) {
    font-size: var(--font-size-xs);
  }
`;const qn=s.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
`,Vn=s(_.button)`
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid var(--primary-blue);
  border-radius: var(--radius-medium);
  padding: var(--space-sm);
  cursor: pointer;
  color: var(--primary-blue);
  font-size: 18px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-light);
  
  &:hover {
    background: var(--primary-blue);
    color: white;
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }
  
  &:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 2px;
  }
    @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 14px;
    padding: var(--space-xs);  }
`;function Yn({onLogoClick:r}){const a=()=>{Pn()};return e.jsxs(Fn,{children:["      ",e.jsxs(Un,{children:[e.jsx(Bn,{children:e.jsx(Nn,{position:"header"})}),e.jsx(Hn,{children:e.jsx(Gn,{onClick:r,whileHover:{scale:1.02},whileTap:{scale:.98},title:"Clique para voltar ao início",children:"🌟 Bem-vindos ao Portal Bettina! 🌟"})}),e.jsx(_n,{children:e.jsx(qn,{children:e.jsx(Vn,{onClick:a,whileHover:{scale:1.1},whileTap:{scale:.9},title:"Alternar Alto Contraste - Acessibilidade","aria-label":"Botão de acessibilidade para alternar alto contraste",children:"👁️"})})})]})]})}s(_.button)`
  position: fixed;
  bottom: 70px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary-blue);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  box-shadow: var(--shadow-medium);
  z-index: 1000;
  
  &:hover {
    background: var(--primary-purple);
  }
`;const Jn=s(_.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
`,Wn=s(_.div)`
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: var(--radius-large);
  padding: var(--space-lg);
  box-shadow: var(--shadow-large);
  max-height: 80vh;
  overflow-y: auto;
`,Kn=s.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
  border-bottom: 1px solid var(--light-gray);
  padding-bottom: var(--space-md);
`,Xn=s.h2`
  font-size: var(--font-size-lg);
  color: var(--primary-purple);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`,Qn=s.button`
  background: transparent;
  border: none;
  font-size: var(--font-size-lg);
  color: var(--medium-gray);
  cursor: pointer;
  
  &:hover {
    color: var(--primary-blue);
  }
`,pa=s.div`
  margin-bottom: var(--space-lg);
`,ua=s.h3`
  font-size: var(--font-size-md);
  margin-bottom: var(--space-md);
  color: var(--primary-blue);
`,$e=s.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px dashed var(--light-gray);
`,Ie=s.label`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--font-size-md);
`,tr=s.div`
  position: relative;
  width: 50px;
  height: 24px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--medium-gray);
    transition: .4s;
    border-radius: 24px;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + .slider {
    background-color: var(--primary-green);
  }
  
  input:focus + .slider {
    box-shadow: 0 0 1px var(--primary-green);
  }
  
  input:checked + .slider:before {
    transform: translateX(26px);
  }
`,Zn=s.input`
  width: 150px;
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  background: var(--light-gray);
  border-radius: 4px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: var(--primary-blue);
    border-radius: 50%;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: var(--primary-blue);
    border-radius: 50%;
    cursor: pointer;
  }
`;s.div`
  width: 30px;
  height: 30px;
  border-radius: 5px;
  background-color: ${r=>r.color};
  cursor: pointer;
  border: 2px solid var(--light-gray);
`;const ec=s.div`
  display: flex;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
`,Yr=s.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${r=>r.$backgroundColor||"white"};
  border: 2px solid ${r=>r.$active?"var(--primary-blue)":"var(--light-gray)"};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    right: 0;
    background: ${r=>r.$accentColor||"white"};
  }
  
  &:hover {
    transform: scale(1.1);
  }
`,rc=s(_.button)`
  background: var(--primary-blue);
  color: white;
  border: none;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-medium);
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  margin-top: var(--space-lg);
  
  &:hover {
    background: var(--primary-purple);
  }
`,ac=s.div`
  margin-top: var(--space-sm);
  padding: var(--space-sm);
  border: 1px dashed var(--light-gray);
  border-radius: var(--radius-medium);
  font-size: ${r=>r.size}px;
`,ga=s.select`
  padding: var(--space-sm);
  border-radius: var(--radius-medium);
  border: 1px solid var(--light-gray);
  width: 150px;
`;s.div`
  display: flex;
  gap: var(--space-md);
`;s.label`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  cursor: pointer;
`;const tc=({onClose:r=()=>{}})=>{const{userId:a,isDbConnected:t,userDetails:o,updateUser:c}=xr(),[i,d]=l.useState({highContrast:!1,largeFonts:!1,reducedMotion:!1,soundEffects:!0,readAloud:!1,colorScheme:"default",fontSize:16,cursorSize:"normal",focusIndicators:!0,keyboardNavigation:!0,screenReaderMode:!1,textSpacing:"normal",lineHeight:"normal",letterSpacing:"normal",dyslexiaFriendly:!1}),[p,f]=l.useState(!1);l.useEffect(()=>{o&&o.preferences?.accessibility&&d({...i,...o.preferences.accessibility})},[o]),l.useEffect(()=>{const n=g=>{g.key==="Escape"&&r()};return document.addEventListener("keydown",n),()=>{document.removeEventListener("keydown",n)}},[r]),l.useEffect(()=>{const n=document.documentElement;i.highContrast?n.classList.add("high-contrast"):n.classList.remove("high-contrast"),i.largeFonts?n.style.fontSize="110%":n.style.fontSize="100%",i.reducedMotion?n.classList.add("reduced-motion"):n.classList.remove("reduced-motion"),n.setAttribute("data-theme",i.colorScheme),i.dyslexiaFriendly?n.classList.add("dyslexia-friendly"):n.classList.remove("dyslexia-friendly"),n.style.setProperty("--text-spacing",i.textSpacing==="wide"?"1px":"0"),n.style.setProperty("--line-height",i.lineHeight==="loose"?"1.8":i.lineHeight==="tight"?"1.2":"1.5"),n.style.setProperty("--letter-spacing",i.letterSpacing==="wide"?"0.5px":i.letterSpacing==="tight"?"-0.5px":"0px")},[i]);const h=(n,g)=>{d(E=>({...E,[n]:g}))},m=async()=>{if(a)try{const g={...o?.preferences||{},accessibility:i};t?await c(a,{preferences:g}):localStorage.setItem("betina_accessibility_settings",JSON.stringify(i)),f(!0),setTimeout(()=>f(!1),3e3)}catch(n){console.error("Erro ao salvar configurações de acessibilidade:",n)}},u=n=>{switch(n){case"default":d(g=>({...g,colorScheme:"default",highContrast:!1}));break;case"dark":d(g=>({...g,colorScheme:"dark",highContrast:!1}));break;case"highContrast":d(g=>({...g,colorScheme:"default",highContrast:!0}));break;case"warm":d(g=>({...g,colorScheme:"warm",highContrast:!1}));break;case"cool":d(g=>({...g,colorScheme:"cool",highContrast:!1}));break}};return e.jsx(Jn,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:n=>{n.target===n.currentTarget&&(n.preventDefault(),n.stopPropagation(),r())},children:e.jsxs(Wn,{initial:{y:50,opacity:0},animate:{y:0,opacity:1},exit:{y:50,opacity:0},transition:{type:"spring",damping:25},children:[e.jsxs(Kn,{children:[e.jsxs(Xn,{children:[e.jsx("span",{role:"img","aria-hidden":"true",children:"♿"})," Configurações de Acessibilidade"]}),"          ",e.jsx(Qn,{onClick:r,"aria-label":"Fechar painel",children:"✕"})]}),e.jsxs(pa,{children:[e.jsx(ua,{children:"Aparência"}),e.jsxs($e,{children:[e.jsxs(Ie,{children:[e.jsx("span",{role:"img","aria-hidden":"true",children:"🌓"})," Alto Contraste"]}),e.jsxs(tr,{children:[e.jsx("input",{type:"checkbox",checked:i.highContrast,onChange:n=>h("highContrast",n.target.checked)}),e.jsx("span",{className:"slider"})]})]}),e.jsxs($e,{children:[e.jsxs(Ie,{children:[e.jsx("span",{role:"img","aria-hidden":"true",children:"🔤"})," Fontes Grandes"]}),e.jsxs(tr,{children:[e.jsx("input",{type:"checkbox",checked:i.largeFonts,onChange:n=>h("largeFonts",n.target.checked)}),e.jsx("span",{className:"slider"})]})]}),e.jsxs($e,{children:[e.jsxs(Ie,{children:[e.jsx("span",{role:"img","aria-hidden":"true",children:"🎨"})," Esquema de Cores"]}),e.jsxs("div",{children:[e.jsxs(ga,{value:i.colorScheme,onChange:n=>h("colorScheme",n.target.value),children:[e.jsx("option",{value:"default",children:"Padrão"}),e.jsx("option",{value:"dark",children:"Escuro"}),e.jsx("option",{value:"warm",children:"Quente"}),e.jsx("option",{value:"cool",children:"Frio"})]}),e.jsxs(ec,{children:[e.jsx(Yr,{$backgroundColor:"#ffffff",$accentColor:"#6a11cb",$active:i.colorScheme==="default"&&!i.highContrast,onClick:()=>u("default"),"aria-label":"Tema padrão"}),e.jsx(Yr,{$backgroundColor:"#212121",$accentColor:"#6a11cb",$active:i.colorScheme==="dark",onClick:()=>u("dark"),"aria-label":"Tema escuro"}),e.jsx(Yr,{$backgroundColor:"#ffffff",$accentColor:"#000000",$active:i.highContrast,onClick:()=>u("highContrast"),"aria-label":"Tema alto contraste"}),e.jsx(Yr,{$backgroundColor:"#fff9e6",$accentColor:"#e67700",$active:i.colorScheme==="warm",onClick:()=>u("warm"),"aria-label":"Tema quente"}),e.jsx(Yr,{$backgroundColor:"#e6f7ff",$accentColor:"#0077cc",$active:i.colorScheme==="cool",onClick:()=>u("cool"),"aria-label":"Tema frio"})]})]})]})]}),e.jsxs(pa,{children:[e.jsx(ua,{children:"Texto e Leitura"}),e.jsxs($e,{children:[e.jsxs(Ie,{children:[e.jsx("span",{role:"img","aria-hidden":"true",children:"📏"})," Tamanho da Fonte"]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:[e.jsx(Zn,{type:"range",min:"14",max:"24",value:i.fontSize,onChange:n=>h("fontSize",parseInt(n.target.value))}),e.jsx(ac,{size:i.fontSize,children:"Exemplo de texto"})]})]}),e.jsxs($e,{children:[e.jsxs(Ie,{children:[e.jsx("span",{role:"img","aria-hidden":"true",children:"🧠"})," Modo Amigável para Dislexia"]}),e.jsxs(tr,{children:[e.jsx("input",{type:"checkbox",checked:i.dyslexiaFriendly,onChange:n=>h("dyslexiaFriendly",n.target.checked)}),e.jsx("span",{className:"slider"})]})]}),e.jsxs($e,{children:[e.jsxs(Ie,{children:[e.jsx("span",{role:"img","aria-hidden":"true",children:"📝"})," Espaçamento do Texto"]}),e.jsxs(ga,{value:i.textSpacing,onChange:n=>h("textSpacing",n.target.value),children:[e.jsx("option",{value:"normal",children:"Normal"}),e.jsx("option",{value:"wide",children:"Expandido"})]})]}),e.jsxs($e,{children:[e.jsxs(Ie,{children:[e.jsx("span",{role:"img","aria-hidden":"true",children:"↕️"})," Altura da Linha"]}),e.jsxs(ga,{value:i.lineHeight,onChange:n=>h("lineHeight",n.target.value),children:[e.jsx("option",{value:"normal",children:"Normal"}),e.jsx("option",{value:"loose",children:"Espaçado"}),e.jsx("option",{value:"tight",children:"Compacto"})]})]})]}),e.jsxs(pa,{children:[e.jsx(ua,{children:"Som e Mídia"}),e.jsxs($e,{children:[e.jsxs(Ie,{children:[e.jsx("span",{role:"img","aria-hidden":"true",children:"🔊"})," Efeitos Sonoros"]}),e.jsxs(tr,{children:[e.jsx("input",{type:"checkbox",checked:i.soundEffects,onChange:n=>h("soundEffects",n.target.checked)}),e.jsx("span",{className:"slider"})]})]}),e.jsxs($e,{children:[e.jsxs(Ie,{children:[e.jsx("span",{role:"img","aria-hidden":"true",children:"🗣️"})," Leitura em Voz Alta"]}),e.jsxs(tr,{children:[e.jsx("input",{type:"checkbox",checked:i.readAloud,onChange:n=>h("readAloud",n.target.checked)}),e.jsx("span",{className:"slider"})]})]})]}),e.jsxs(pa,{children:[e.jsx(ua,{children:"Movimento e Interação"}),e.jsxs($e,{children:[e.jsxs(Ie,{children:[e.jsx("span",{role:"img","aria-hidden":"true",children:"✨"})," Reduzir Animações"]}),e.jsxs(tr,{children:[e.jsx("input",{type:"checkbox",checked:i.reducedMotion,onChange:n=>h("reducedMotion",n.target.checked)}),e.jsx("span",{className:"slider"})]})]}),e.jsxs($e,{children:[e.jsxs(Ie,{children:[e.jsx("span",{role:"img","aria-hidden":"true",children:"👆"})," Tamanho do Cursor"]}),e.jsxs(ga,{value:i.cursorSize,onChange:n=>h("cursorSize",n.target.value),children:[e.jsx("option",{value:"normal",children:"Normal"}),e.jsx("option",{value:"large",children:"Grande"}),e.jsx("option",{value:"xl",children:"Extra Grande"})]})]}),e.jsxs($e,{children:[e.jsxs(Ie,{children:[e.jsx("span",{role:"img","aria-hidden":"true",children:"🔍"})," Indicadores de Foco Visíveis"]}),e.jsxs(tr,{children:[e.jsx("input",{type:"checkbox",checked:i.focusIndicators,onChange:n=>h("focusIndicators",n.target.checked)}),e.jsx("span",{className:"slider"})]})]}),e.jsxs($e,{children:[e.jsxs(Ie,{children:[e.jsx("span",{role:"img","aria-hidden":"true",children:"⌨️"})," Navegação por Teclado"]}),e.jsxs(tr,{children:[e.jsx("input",{type:"checkbox",checked:i.keyboardNavigation,onChange:n=>h("keyboardNavigation",n.target.checked)}),e.jsx("span",{className:"slider"})]})]})]}),e.jsx(rc,{onClick:m,whileHover:{scale:1.02},whileTap:{scale:.98},children:p?"✓ Salvo com Sucesso!":"Salvar Configurações"}),"        "]})})},oc=s(_.footer)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(15px);
  border-top: 2px solid var(--light-gray);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: var(--space-sm) var(--space-md);
  transform: translateY(${r=>r.isHidden?"100%":"0"});
  transition: transform 0.3s ease-in-out;
`,sc=s(_.div)`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-medium) var(--radius-medium) 0 0;
  padding: var(--space-xs) var(--space-md);
  border: 2px solid var(--light-gray);
  border-bottom: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-sm);
  color: var(--primary-blue);
  
  &:hover {
    background: var(--primary-blue);
    color: white;
  }
`,ic=s.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 0;
  }
`,nc=s.div`
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow-x: auto;
  
  /* Scroll horizontal suave em dispositivos móveis */
  &::-webkit-scrollbar {
    height: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--primary-blue);
    border-radius: 3px;
  }
  
  @media (max-width: 768px) {
    gap: var(--space-xs);
    flex-wrap: nowrap;
    justify-content: flex-start;
    padding: 0 var(--space-sm);
  }
  
  @media (max-width: 480px) {
    gap: 2px;
    padding: 0 var(--space-xs);
  }
  
  @media (max-width: 360px) {
    gap: 1px;
    padding: 0 2px;
  }
`;s.div`
  display: flex;
  gap: var(--space-sm);
  align-items: center;
`;s(_.button)`
  background: var(--primary-purple);
  color: white;
  border: none;
  border-radius: var(--radius-medium);
  padding: var(--space-xs) var(--space-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  
  &:hover {
    background: var(--primary-blue);
  }
  
  @media (max-width: 768px) {
    padding: var(--space-xs);
    font-size: 10px;
  }
`;const cc=s(_.button)`
  background: ${r=>r.isActive?"linear-gradient(135deg, var(--primary-blue), var(--primary-cyan))":r.isSpecial?"linear-gradient(135deg, var(--primary-purple), var(--primary-pink))":"white"};
  color: ${r=>r.isActive||r.isSpecial?"white":"var(--primary-blue)"};
  border: 2px solid ${r=>r.isSpecial?"var(--primary-purple)":"var(--primary-blue)"};
  border-radius: var(--radius-medium);
  padding: var(--space-xs) var(--space-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 60px;
  min-height: 50px;
  text-align: center;
  position: relative;
  
  ${r=>r.isSpecial&&`
    box-shadow: 0 0 15px rgba(144, 19, 254, 0.3);
    animation: pulse-accessibility 2s infinite;
  `}
  
  &:hover {
    background: ${r=>r.isActive?"linear-gradient(135deg, var(--primary-blue), var(--primary-cyan))":r.isSpecial?"linear-gradient(135deg, var(--primary-purple), var(--primary-pink))":"linear-gradient(135deg, var(--primary-blue), var(--primary-cyan))"};
    color: white;
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }
  
  &:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 2px;
  }
  
  @media (max-width: 768px) {
    min-width: 50px;
    min-height: 45px;
    padding: var(--space-xs);
    font-size: 10px;
  }
  
  @media (max-width: 480px) {
    min-width: 45px;
    min-height: 40px;
    font-size: 9px;
    gap: 1px;
  }
  
  @media (max-width: 360px) {
    min-width: 40px;
    min-height: 35px;
    font-size: 8px;
    padding: 2px;
  }
  
  @keyframes pulse-accessibility {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`,lc=s.div`
  font-size: 16px;
  line-height: 1;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
  }
  
  @media (max-width: 360px) {
    font-size: 11px;
  }
`,dc=s.div`
  font-size: inherit;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  
  @media (max-width: 360px) {
    font-size: 7px;
  }
`,uo=[{id:"home",name:"Início",icon:"🏠",color:"var(--primary-blue)"},{id:"musical-sequence",name:"Música",icon:"🎵",color:"var(--primary-purple)"},{id:"letter-recognition",name:"Letras",icon:"🔤",color:"var(--primary-green)"},{id:"number-counting",name:"Números",icon:"🔢",color:"var(--primary-orange)"},{id:"memory-game",name:"Memória",icon:"🧠",color:"var(--primary-blue)"},{id:"color-match",name:"Cores",icon:"🌈",color:"var(--primary-green)"},{id:"image-association",name:"Imagens",icon:"🧩",color:"var(--primary-orange)"},{id:"creative-painting",name:"Pintura",icon:"🎨",color:"var(--primary-purple)"},{id:"accessibility",name:"Acessível",icon:"♿",color:"var(--primary-purple)",isSpecial:!0},{id:"admin-panel",name:"Admin",icon:"🔐",color:"var(--primary-red)"},{id:"about",name:"Sobre",icon:"ℹ️",color:"var(--primary-blue)"}];function mc({currentActivity:r,onActivityChange:a}){const[t,o]=l.useState(!1),[c,i]=l.useState(!1),[d,p]=l.useState(!0),f=l.useRef(null),h=g=>{g==="accessibility"?i(!0):a(g)},m=()=>{o(!t),p(!1)},u=l.useCallback(()=>{d&&t&&(f.current&&(clearTimeout(f.current),f.current=null),o(!1))},[d,t]),n=l.useCallback(()=>{d&&!t&&(f.current&&clearTimeout(f.current),f.current=setTimeout(()=>{o(!0),f.current=null},2e3))},[d,t]);return e.jsxs(e.Fragment,{children:[e.jsxs(oc,{isHidden:t,onMouseEnter:u,onMouseLeave:n,initial:{y:0},animate:{y:t?60:0},transition:{duration:.3,ease:"easeInOut"},children:[e.jsxs(sc,{onClick:m,whileHover:{scale:1.05},whileTap:{scale:.95},children:[t?"👆":"👇"," ",t?"Mostrar":"Ocultar"]}),e.jsx(ic,{children:e.jsx(nc,{children:uo.map(g=>e.jsxs(cc,{isActive:r===g.id,isSpecial:g.isSpecial,onClick:()=>h(g.id),whileHover:{scale:1.05},whileTap:{scale:.95},initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3,delay:uo.indexOf(g)*.05},title:g.isSpecial?"Abrir painel de acessibilidade":`Ir para ${g.name}`,"aria-label":g.isSpecial?"Configurações de acessibilidade":`Navegar para ${g.name}`,children:[e.jsx(lc,{children:g.icon}),e.jsx(dc,{children:g.name})]},g.id))})})]}),e.jsx(Ne,{children:c&&e.jsx(tc,{onClose:()=>i(!1)})})]})}const qt="portalBetina_gameUsage",Zs="portalBetina_lastRankingUpdate",ct="portalBetina_rankingCache",pc=30;function uc(r){try{const a=yr();a[r]=(a[r]||0)+1,a[`${r}_lastPlayed`]=Date.now(),localStorage.setItem(qt,JSON.stringify(a)),console.log(`📊 Jogo ${r} incrementado para ${a[r]} usos`)}catch(a){console.error("Erro ao incrementar uso do jogo:",a)}}function yr(){try{return JSON.parse(localStorage.getItem(qt)||"{}")}catch(r){return console.error("Erro ao recuperar contadores de uso:",r),{}}}function gc(r,a){const t=a[r]||0,o=a[`${r}_lastPlayed`]||0;if(t===0)return 0;const c=(Date.now()-o)/(1e3*60*60*24),i=Math.max(0,1-c/30);return t+i*t*.2}function go(r){const a=[...r];for(let t=a.length-1;t>0;t--){const o=Math.floor(Math.random()*(t+1));[a[t],a[o]]=[a[o],a[t]]}return a}function hc(){try{const r=JSON.parse(localStorage.getItem(ct)||"{}");return r.timestamp?(Date.now()-r.timestamp)/(1e3*60)<pc:!1}catch{return!1}}function fc(r){try{const a={ranking:r,timestamp:Date.now()};localStorage.setItem(ct,JSON.stringify(a))}catch(a){console.error("Erro ao salvar cache do ranking:",a)}}function vc(){try{return hc()&&JSON.parse(localStorage.getItem(ct)||"{}").ranking||null}catch{return null}}function xc(r){try{const a=vc();if(a&&a.length>=6)return console.log("📊 Usando ranking do cache para melhor performance"),a.slice(0,6);const t=yr();if(Object.values(t).filter(d=>typeof d=="number").reduce((d,p)=>d+p,0)<5)return console.log("📊 Usando jogos embaralhados - dados insuficientes"),go(r).slice(0,6);const i=r.map(d=>({...d,score:gc(d.id,t),usageCount:t[d.id]||0})).sort((d,p)=>p.score-d.score);return fc(i),console.log("📊 Ranking atual:",i.filter(d=>d.usageCount>0).map(d=>`${d.title}: ${d.usageCount} usos, score: ${d.score.toFixed(2)}`)),i.slice(0,6)}catch(a){return console.error("Erro ao calcular top games:",a),go(r).slice(0,6)}}function ei(){try{localStorage.removeItem(qt),localStorage.removeItem(Zs),console.log("📊 Contadores de uso resetados")}catch(r){console.error("Erro ao resetar uso dos jogos:",r)}}function na(){try{const r=yr(),a={totalGames:0,totalUsage:0,mostPlayed:null,lastUpdate:localStorage.getItem(Zs)};return Object.entries(r).forEach(([t,o])=>{typeof o=="number"&&!t.includes("_lastPlayed")&&(a.totalGames++,a.totalUsage+=o,(!a.mostPlayed||o>r[a.mostPlayed])&&(a.mostPlayed=t))}),a}catch(r){return console.error("Erro ao obter estatísticas:",r),{totalGames:0,totalUsage:0,mostPlayed:null,lastUpdate:null}}}function ri(){try{const r=yr(),a=na(),t={totalEngagement:a.totalUsage,diversityScore:a.totalGames/9*100,recommendations:[],trends:{mostActive:null,leastActive:null,trending:[]}},o=Object.entries(r).filter(([c])=>!c.includes("_lastPlayed")).map(([c,i])=>({id:c,count:i})).sort((c,i)=>c.count-i.count);return o.length>0&&(t.trends.leastActive=o[0],t.trends.mostActive=o[o.length-1]),t.diversityScore<50&&t.recommendations.push({type:"diversity",message:"Experimente explorar mais jogos para uma experiência completa!"}),a.totalUsage>20&&t.recommendations.push({type:"achievement",message:"Parabéns! Você está muito ativo no portal!"}),t}catch(r){return console.error("Erro ao gerar insights:",r),{totalEngagement:0,diversityScore:0,recommendations:[],trends:{}}}}function yc(){try{localStorage.removeItem(ct),console.log("📊 Cache do ranking limpo")}catch(r){console.error("Erro ao limpar cache:",r)}}function bc(){try{return{gameUsage:yr(),stats:na(),insights:ri(),exportDate:new Date().toISOString(),version:"1.0.0"}}catch(r){return console.error("Erro ao exportar dados:",r),null}}const wc=s.section`
  margin: var(--space-xl) 0;
  position: relative;
`,ho=s.h2`
  text-align: center;
  font-size: var(--font-size-xxl);
  color: white;
  margin-bottom: var(--space-xl);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 700;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-purple));
    border-radius: 2px;
  }
`;s.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-xxl);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;s(_.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-large);
  padding: var(--space-lg);
  text-align: center;
  box-shadow: var(--shadow-medium);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-strong);
  }
`;s.div`
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--primary-blue);
  margin-bottom: var(--space-xs);
`;s.div`
  font-size: var(--font-size-sm);
  color: var(--medium-gray);
  font-weight: 500;
`;const fo=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-md);
    max-width: 600px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: var(--space-md);
    max-width: 400px;
  }
`,Nr=s(_.button)`
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.92));
  border: none;
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  cursor: pointer;
  box-shadow: var(--shadow-medium);
  transition: all var(--transition-normal);
  text-align: center;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
    background: linear-gradient(145deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.95));

    &::before {
      left: 100%;
    }
  }

  &:focus {
    outline: 3px solid var(--primary-blue);
    outline-offset: 3px;
  }

  &:active {
    transform: translateY(-4px) scale(0.98);
  }

  @media (max-width: 768px) {
    padding: var(--space-lg);
    min-height: 200px;
  }

  @media (max-width: 480px) {
    padding: var(--space-md);
    min-height: 180px;
  }
`,vo=s.div`
  font-size: 3.5rem;
  line-height: 1;
  filter: drop-shadow(3px 3px 8px rgba(0, 0, 0, 0.15));
  margin-bottom: var(--space-sm);
  transition: all var(--transition-normal);

  ${Nr}:hover & {
    transform: scale(1.1) rotate(5deg);
    filter: drop-shadow(4px 4px 12px rgba(0, 0, 0, 0.2));
  }
`,xo=s.h3`
  font-size: var(--font-size-lg);
  color: var(--dark-gray);
  margin: 0;
  font-weight: 700;
  margin-bottom: var(--space-xs);
  transition: color var(--transition-normal);

  ${Nr}:hover & {
    color: var(--primary-blue);
  }
`,yo=s.p`
  font-size: var(--font-size-md);
  color: var(--medium-gray);
  margin: 0;
  line-height: 1.5;
  text-align: center;
  margin-bottom: var(--space-sm);
  transition: color var(--transition-normal);

  ${Nr}:hover & {
    color: var(--dark-gray);
  }
`,bo=s.span`
  background: linear-gradient(135deg, ${r=>r.color||"var(--primary-blue)"}, ${r=>r.color?`${r.color}dd`:"var(--primary-blue)dd"});
  color: white;
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-large);
  font-size: var(--font-size-sm);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all var(--transition-normal);
  margin-top: auto;

  ${Nr}:hover & {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`,Ar=[{id:"letter-recognition",title:"Reconhecimento de Letras",description:"Aprenda o alfabeto de forma divertida e interativa",icon:"🔤",color:"var(--primary-blue)",badge:"Letras"},{id:"musical-sequence",title:"Sequência de Sons",description:"Repita sequências sonoras e desenvolva a memória auditiva",icon:"🎧",color:"var(--primary-purple)",badge:"Sons"},{id:"creative-painting",title:"Pintura com Referência",description:"Pinte seguindo números e cores para criar belas obras de arte",icon:"🎨",color:"var(--primary-pink)",badge:"Arte"},{id:"memory-game",title:"Jogo da Memória",description:"Encontre os pares iguais e exercite a memória de forma divertida",icon:"🃏",color:"var(--primary-green)",badge:"Memória"},{id:"image-association",title:"Associação de Imagens",description:"Combine imagens relacionadas e desenvolva conexões lógicas",icon:"🧩",color:"var(--primary-orange)",badge:"Lógica"},{id:"number-counting",title:"Números e Contagem",description:"Aprenda números de 1 a 10 com atividades interativas",icon:"🔢",color:"var(--primary-cyan)",badge:"Números"}],Jr=[{id:"user-profiles",title:"Perfis de Usuário",description:"Gerencie diferentes perfis para toda a família",icon:"👤",color:"var(--primary-purple)",badge:"Perfis"},{id:"performance-dashboard",title:"Dashboard de Desempenho",description:"Visualize estatísticas detalhadas e gráficos de progresso",icon:"📊",color:"var(--primary-green)",badge:"Análise"},{id:"backup-export",title:"Backup e Exportação",description:"Salve seus dados ou transfira para outro dispositivo",icon:"💾",color:"var(--primary-orange)",badge:"Dados"}];function jc({onActivitySelect:r}){const[a,t]=l.useState(Ar),[o,c]=l.useState({totalGames:Ar.length,totalTools:Jr.length,totalActivities:Ar.length+Jr.length});l.useEffect(()=>{const p=xc(Ar);t(p),c({totalGames:Ar.length,totalTools:Jr.length,totalActivities:Ar.length+Jr.length})},[]);const i={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.08,delayChildren:.1}}},d={hidden:{opacity:0,y:30,scale:.9},visible:{opacity:1,y:0,scale:1,transition:{type:"spring",stiffness:100,damping:15}}};return e.jsxs(wc,{children:[e.jsx(ho,{children:"🎯 Atividades Mais Populares"}),e.jsx(fo,{as:_.div,variants:i,initial:"hidden",animate:"visible",children:a.map(p=>e.jsxs(Nr,{variants:d,whileHover:{scale:1.02,y:-8},whileTap:{scale:.98},onClick:()=>r(p.id),"aria-label":`${p.title}: ${p.description}`,children:[e.jsx(vo,{children:p.icon}),e.jsx(xo,{children:p.title}),e.jsx(yo,{children:p.description}),e.jsxs(bo,{color:p.color,children:[p.badge,p.usageCount>0&&e.jsxs("span",{style:{marginLeft:"4px",fontSize:"0.8em",opacity:.8},children:["(",p.usageCount,"x)"]})]})]},p.id))}),e.jsx(ho,{style:{marginTop:"var(--space-xxl)"},children:"⚙️ Ferramentas e Configurações"}),e.jsx(fo,{as:_.div,variants:i,initial:"hidden",animate:"visible",children:Jr.map(p=>e.jsxs(Nr,{variants:d,whileHover:{scale:1.02,y:-8},whileTap:{scale:.98},onClick:()=>r(p.id),"aria-label":`${p.title}: ${p.description}`,children:[e.jsx(vo,{children:p.icon}),e.jsx(xo,{children:p.title}),e.jsx(yo,{children:p.description}),e.jsx(bo,{color:p.color,children:p.badge})]},p.id))})]})}const Sc=s(_.div)`
  background: linear-gradient(135deg, var(--primary-pink), var(--primary-orange));
  border-radius: var(--radius-large);
  padding: var(--space-lg);
  margin: var(--space-xl) 0;
  text-align: center;
  color: white;
  box-shadow: var(--shadow-medium);
`,Cc=s.h2`
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-md);
  font-weight: 600;
`,Ac=s.p`
  font-size: var(--font-size-md);
  margin-bottom: var(--space-lg);
  line-height: 1.7;
  opacity: 0.95;
  text-align: justify;
  text-justify: inter-word;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
  letter-spacing: 0.3px;
`,Ec=s.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
    gap: var(--space-xl);
  }
`,kc=s(_.div)`
  background: white;
  padding: var(--space-md);
  border-radius: var(--radius-medium);
  box-shadow: var(--shadow-light);
`,Tc=s.div`
  width: 150px;
  height: 150px;
  background: var(--light-gray);
  border-radius: var(--radius-small);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  color: var(--medium-gray);
  text-align: center;
  border: 2px dashed var(--medium-gray);
`,Pc=s.div`
  flex: 1;
  max-width: 400px;
`,wo=s.h3`
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-sm);
  font-weight: 600;
`,jo=s.p`
  font-size: var(--font-size-md);
  line-height: 1.5;
  opacity: 0.9;
  margin-bottom: var(--space-sm);
`,zc=s.div`
  background: rgba(255, 255, 255, 0.2);
  padding: var(--space-sm);
  border-radius: var(--radius-small);
  font-family: monospace;
  font-size: var(--font-size-sm);
  margin-top: var(--space-sm);
  word-break: break-all;
`,Mc=s(_.span)`
  display: inline-block;
  font-size: var(--font-size-lg);
  margin: 0 var(--space-xs);
`;function Dc(){const r="portal.betina@exemplo.com";return e.jsxs(Sc,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},transition:{duration:.5,delay:.3},children:[e.jsxs(Cc,{children:["Ajude a manter este projeto vivo",e.jsx(Mc,{animate:{scale:[1,1.2,1],rotate:[0,5,-5,0]},transition:{duration:2,repeat:1/0,repeatType:"reverse"},children:"💖"})]}),"        ",e.jsxs(Ac,{children:["Este portal nasceu da história da minha filha Bettina e do desejo de apoiar outras crianças no seu desenvolvimento. Oferecemos gratuitamente atividades terapêuticas e educativas para crianças com autismo, TDAH e outras necessidades cognitivas.",e.jsx("br",{})]}),e.jsxs(Ec,{children:[e.jsx(kc,{whileHover:{scale:1.05,rotate:2},transition:{type:"spring",stiffness:300},children:e.jsxs(Tc,{children:["📱 QR Code PIX",e.jsx("br",{}),e.jsx("small",{children:"(Será gerado automaticamente)"})]})}),e.jsxs(Pc,{children:[e.jsx(wo,{children:"Como doar:"}),e.jsxs(jo,{children:["• Escaneie o QR Code com seu banco",e.jsx("br",{}),"• Ou use a chave PIX abaixo",e.jsx("br",{}),"• Qualquer valor é bem-vindo! 🙏"]}),e.jsx(wo,{children:"Chave PIX:"}),e.jsx(zc,{children:r}),e.jsxs(jo,{style:{marginTop:"var(--space-md)",fontSize:"var(--font-size-sm)"},children:[e.jsx("strong",{children:"Transparência:"})," 100% das doações são destinadas ao tratamento da Betina e manutenção do portal."]})]})]})]})}const $c=s(_.div)`
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-md);
  min-height: calc(100vh - 200px);

  @media (max-width: 768px) {
    padding: var(--space-sm);
  }
`,Ic=s.div`
  /* O conteúdo da atividade vai aqui */
  position: relative;
`;function cr({title:r,emoji:a,subtitle:t,children:o}){return e.jsx($c,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:e.jsx(Ic,{children:o})})}let Wr=null,So=!1;const oa=async()=>{if(!Wr)try{Wr=new(window.AudioContext||window.webkitAudioContext)}catch(r){return console.warn("AudioContext não suportado:",r),null}if(Wr.state==="suspended")try{await Wr.resume(),console.log("AudioContext retomado com sucesso")}catch(r){console.warn("Erro ao retomar AudioContext:",r)}return Wr},Co=async()=>{if(!So){const r=await oa();r&&r.state==="running"&&(So=!0,console.log("Sistema de áudio inicializado com sucesso"))}},br=()=>{const r=l.useRef(new Map);l.useEffect(()=>{const m=async()=>{await Co(),document.removeEventListener("click",m),document.removeEventListener("touchstart",m),document.removeEventListener("keydown",m)};return document.addEventListener("click",m,{once:!0}),document.addEventListener("touchstart",m,{once:!0}),document.addEventListener("keydown",m,{once:!0}),()=>{document.removeEventListener("click",m),document.removeEventListener("touchstart",m),document.removeEventListener("keydown",m)}},[]);const a=l.useCallback((m,u)=>{if(!r.current.has(m)){const n=new Audio(u);n.preload="auto",n.addEventListener("canplaythrough",()=>{console.log(`Som ${m} carregado com sucesso`)}),n.addEventListener("error",g=>{console.warn(`Erro ao carregar som ${m}:`,g)}),r.current.set(m,n)}},[]),t=l.useCallback(async(m,u=.5)=>{await Co();const n=r.current.get(m);if(n)try{n.volume=u,n.currentTime=0,await n.play(),console.log(`Som ${m} reproduzido com sucesso`)}catch(g){console.warn(`Erro ao reproduzir som ${m}:`,g)}},[]),o=l.useCallback(m=>{const u=r.current.get(m);u&&(u.pause(),u.currentTime=0)},[]),c=l.useCallback(()=>{r.current.forEach(m=>{m.pause(),m.currentTime=0})},[]),i=l.useCallback(async()=>{try{const m=await oa();if(!m)return;const u=m.createOscillator(),n=m.createGain();u.connect(n),n.connect(m.destination),u.frequency.setValueAtTime(523.25,m.currentTime),u.frequency.setValueAtTime(659.25,m.currentTime+.1),u.frequency.setValueAtTime(783.99,m.currentTime+.2),n.gain.setValueAtTime(.3,m.currentTime),n.gain.exponentialRampToValueAtTime(.01,m.currentTime+.5),u.start(m.currentTime),u.stop(m.currentTime+.5),console.log("Som de sucesso reproduzido")}catch(m){console.warn("Erro no áudio de sucesso:",m)}},[]),d=l.useCallback(async()=>{try{const m=await oa();if(!m)return;const u=m.createOscillator(),n=m.createGain();u.connect(n),n.connect(m.destination),u.frequency.setValueAtTime(200,m.currentTime),u.type="sine",n.gain.setValueAtTime(.2,m.currentTime),n.gain.exponentialRampToValueAtTime(.01,m.currentTime+.3),u.start(m.currentTime),u.stop(m.currentTime+.3),console.log("Som de erro reproduzido")}catch(m){console.warn("Erro no áudio de erro:",m)}},[]),p=l.useCallback(async()=>{try{const m=await oa();if(!m)return;const u=m.createOscillator(),n=m.createGain();u.connect(n),n.connect(m.destination),u.frequency.setValueAtTime(800,m.currentTime),u.type="sine",n.gain.setValueAtTime(.1,m.currentTime),n.gain.exponentialRampToValueAtTime(.01,m.currentTime+.1),u.start(m.currentTime),u.stop(m.currentTime+.1),console.log("Som de clique reproduzido")}catch(m){console.warn("Erro no áudio de clique:",m)}},[]),f=l.useCallback(async(m="C",u=4)=>{try{const n=await oa();if(!n)return;const g={C:261.63,D:293.66,E:329.63,F:349.23,G:392,A:440,B:493.88},w=(g[m.toUpperCase()]||g.C)*Math.pow(2,u-4),U=n.createOscillator(),A=n.createGain();U.connect(A),A.connect(n.destination),U.frequency.setValueAtTime(w,n.currentTime),U.type="sine",A.gain.setValueAtTime(.3,n.currentTime),A.gain.exponentialRampToValueAtTime(.01,n.currentTime+.5),U.start(n.currentTime),U.stop(n.currentTime+.5),console.log(`Nota ${m}${u} reproduzida (${w}Hz)`)}catch(n){console.warn(`Erro ao reproduzir nota ${m}:`,n)}},[]),h=l.useCallback(async(m,u=600)=>{for(let n=0;n<m.length;n++)setTimeout(()=>{typeof m[n]=="string"?f(m[n]):m[n].note&&f(m[n].note,m[n].octave||4)},n*u)},[f]);return{preloadSound:a,playSound:t,stopSound:o,stopAllSounds:c,playSuccess:i,playError:d,playClick:p,playNote:f,playSequence:h}},wr=r=>{const[a,t]=l.useState({score:0,attempts:0,successes:0,accuracy:0,timeSpent:0,level:1,stars:0}),[o,c]=l.useState(!1),[i,d]=l.useState(null),[p,f]=l.useState(null),[h,m]=l.useState(null),[u,n]=l.useState(0),[g,E]=l.useState(null),[w,U]=l.useState(null),[A,B]=l.useState(null);l.useEffect(()=>{const I=localStorage.getItem("betina_user_id");I&&B(I)},[]),l.useEffect(()=>{r&&(async()=>{let N=null;if(A)try{const J=await re.getGameSessions(A,r,1);if(J&&J.length>0){const K=J[0];N={score:K.score||0,attempts:K.total_attempts||0,successes:K.correct_answers||0,timeSpent:K.time_spent||0,level:K.data?.level||1,stars:K.data?.stars||0,difficulty:K.difficulty||"MEDIUM"},console.log("Progresso carregado do banco de dados:",N)}}catch(J){console.warn("Não foi possível carregar progresso do banco de dados, usando localStorage:",J.message)}if(!N){const J=localStorage.getItem(`betina_progress_${r}`);if(J)try{N=JSON.parse(J),console.log("Progresso carregado do localStorage:",N)}catch(K){console.warn("Erro ao carregar progresso do localStorage:",K)}}N&&t(N),d(Date.now())})()},[r,A]);const S=l.useCallback(async I=>{if(r){const N={...a,...I,lastPlayed:new Date().toISOString()};if(t(N),localStorage.setItem(`betina_progress_${r}`,JSON.stringify(N)),A)try{const J=i?Math.floor((Date.now()-i)/1e3):0,K=N.attempts>0?Math.round(N.successes/N.attempts*100):0;await re.saveGameSession({user_id:A,game_id:r,difficulty:N.difficulty||"MEDIUM",score:N.score||0,accuracy:K,time_spent:J,completed:o,correct_answers:N.successes||0,total_attempts:N.attempts||0,data:{level:N.level||1,stars:N.stars||0,...I}}),console.log("Progresso salvo no banco de dados com sucesso")}catch(J){console.warn("Não foi possível salvar no banco de dados, dados salvos apenas no localStorage:",J.message)}}},[r,a]),L=l.useCallback(()=>{const I=a.successes+1;S({successes:I})},[a.successes,S]),j=l.useCallback(()=>{c(!0);const I=i?Math.floor((Date.now()-i)/1e3):0;S({timeSpent:I,completed:!0})},[i,S]),k=l.useCallback(I=>{S({score:I})},[S]),M=l.useCallback(I=>{S({level:I})},[S]),P=l.useCallback(()=>{const I=a.attempts+1;S({attempts:I})},[a.attempts,S]),W=l.useCallback((I=0)=>{const N=a.successes+1,J=a.attempts+1,K=a.score+10+I,ce=Math.round(N/J*100);let V=0;ce>=90?V=3:ce>=70?V=2:ce>=50&&(V=1);const oe={successes:N,attempts:J,score:K,accuracy:ce,stars:V};return t(ue=>({...ue,...oe})),S(oe),console.log(`✅ Sucesso registrado: Pontos: ${K} (+${10+I}), Precisão: ${ce}%, Estrelas: ${V}`),N>=5&&c(!0),K},[a,S]),Q=l.useCallback(()=>{const I=a.attempts+1,N=a.successes>0?Math.round(a.successes/I*100):0;let J=0;N>=90?J=3:N>=70?J=2:N>=50&&(J=1);const K={attempts:I,accuracy:N,stars:J};t(ce=>({...ce,...K})),S(K),console.log(`❌ Erro registrado: Tentativas: ${I}, Precisão: ${N}%, Estrelas: ${J}`)},[a,S]),H=l.useCallback(()=>{if(i){const I=Math.floor((Date.now()-i)/1e3);S({timeSpent:I})}},[i,S]),T=l.useCallback(async()=>{const I=Date.now();f(I),d(I),n(0),m(null);const N=`session_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;if(E(N),A)try{await re.saveGameSession({user_id:A,game_id:r,session_id:N,start_time:new Date(I).toISOString(),status:"started",difficulty:a.difficulty||"MEDIUM",score:0,accuracy:0,time_spent:0,completed:!1,correct_answers:0,total_attempts:0,data:{session_type:"timed_activity",timing_enabled:!0}}),console.log(`🕐 Sessão iniciada: ${N} às ${new Date(I).toLocaleTimeString()}`)}catch(K){console.error("Erro ao salvar início da sessão:",K)}const J=setInterval(()=>{D()},1e3);return U(J),N},[A,r,a.difficulty]),z=l.useCallback(()=>{h||(m(Date.now()),console.log(`⏸️ Atividade pausada às ${new Date().toLocaleTimeString()}`),w&&(clearInterval(w),U(null)))},[h,w]),b=l.useCallback(()=>{if(h){const I=Date.now()-h;n(J=>J+I),m(null),console.log(`▶️ Atividade retomada. Pausada por ${Math.floor(I/1e3)}s`);const N=setInterval(()=>{D()},1e3);U(N)}},[h]),O=l.useCallback(async()=>{if(!p)return console.warn("Tentativa de finalizar atividade que não foi iniciada"),null;const I=Date.now(),N=I-p,J=N-u;w&&(clearInterval(w),U(null));const K={sessionId:g,startTime:new Date(p).toISOString(),endTime:new Date(I).toISOString(),totalTimeMs:N,activeTimeMs:J,pausedTimeMs:u,totalTimeSeconds:Math.floor(N/1e3),activeTimeSeconds:Math.floor(J/1e3),pausedTimeSeconds:Math.floor(u/1e3),efficiency:N>0?J/N*100:100};if(console.log("🏁 Atividade finalizada:",K),A&&g)try{const ce={user_id:A,game_id:r,session_id:g,difficulty:a.difficulty||"MEDIUM",score:a.score,accuracy:a.attempts>0?Math.round(a.successes/a.attempts*100):0,time_spent:K.activeTimeSeconds,completed:o,correct_answers:a.successes,total_attempts:a.attempts,end_time:K.endTime,status:"completed",data:{...K,session_type:"timed_activity",level:a.level,stars:a.stars}};await re.saveGameSession(ce),console.log("💾 Dados da sessão salvos com sucesso")}catch(ce){console.error("Erro ao salvar dados finais da sessão:",ce)}return f(null),d(null),n(0),m(null),E(null),K},[p,u,w,g,A,r,a,o]),D=l.useCallback(()=>{if(p&&!h){const N=Date.now()-p-u,J=Math.floor(N/1e3);t(K=>({...K,timeSpent:J}))}},[p,h,u]),Y=l.useCallback(()=>{if(!p)return{isActive:!1,isPaused:!1,totalTime:0,activeTime:0,pausedTime:0};const I=Date.now(),N=I-p,J=N-u-(h?I-h:0);return{isActive:!0,isPaused:!!h,totalTime:Math.floor(N/1e3),activeTime:Math.floor(J/1e3),pausedTime:Math.floor((u+(h?I-h:0))/1e3),sessionId:g,efficiency:N>0?J/N*100:100}},[p,u,h,g]);l.useEffect(()=>()=>{w&&clearInterval(w)},[w]);const X=l.useCallback(()=>{t(I=>({...I,attempts:0,successes:0,timeSpent:0})),c(!1),d(Date.now()),console.log("Sessão resetada, mantendo pontuação acumulada:",a.score)},[a.score]),G=l.useCallback(()=>{const I=a.level+1;S({level:I})},[a.level,S]),me=l.useCallback(()=>{const I=a.attempts>0?a.successes/a.attempts*100:0,N=a.successes>0?a.timeSpent/a.successes:0;return{accuracy:Math.round(I),averageTime:Math.round(N),totalGames:Math.floor(a.successes/5),bestStreak:ne()}},[a]),ne=l.useCallback(()=>Math.min(a.successes,10),[a.successes]),pe=l.useCallback(()=>{const I=a.attempts>0?a.successes/a.attempts*100:0;return I>=90?"🌟 Incrível! Você é um gênio!":I>=70?"🎉 Muito bem! Continue assim!":I>=50?"👍 Bom trabalho! Está melhorando!":a.attempts>0?"💪 Continue tentando! Você consegue!":"🚀 Vamos começar esta aventura!"},[a]),ye=l.useCallback(()=>{t({score:0,attempts:0,successes:0,timeSpent:0,level:1,stars:0}),r&&localStorage.removeItem(`betina_progress_${r}`),d(Date.now()),c(!1)},[r]);return{progress:a,isCompleted:o,incrementAttempts:P,incrementSuccesses:L,completeActivity:j,updateScore:k,updateLevel:M,recordSuccess:W,recordError:Q,updateTimeSpent:H,resetSession:X,levelUp:G,getStats:me,getEncouragementMessage:pe,saveProgress:S,resetProgress:ye,startActivity:T,pauseActivity:z,resumeActivity:b,finishActivity:O,getCurrentTimeMetrics:Y,sessionId:g,activityStartTime:p,isActivityActive:!!p,isActivityPaused:!!h,getFormattedTime:()=>{const I=Y();return{active:ht(I.activeTime),total:ht(I.totalTime),paused:ht(I.pausedTime),efficiency:`${I.efficiency.toFixed(1)}%`}}}},ht=r=>{const a=Math.floor(r/3600),t=Math.floor(r%3600/60),o=r%60;return a>0?`${a}:${t.toString().padStart(2,"0")}:${o.toString().padStart(2,"0")}`:t>0?`${t}:${o.toString().padStart(2,"0")}`:`${o}s`},Ao=s.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  color: white;
  font-family: 'Segoe UI', system-ui, sans-serif;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin: 10px 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      rgba(255, 255, 255, 0.1) 25%, 
      transparent 25%, 
      transparent 50%, 
      rgba(255, 255, 255, 0.1) 50%, 
      rgba(255, 255, 255, 0.1) 75%, 
      transparent 75%
    );
    background-size: 20px 20px;
    animation: ${r=>r.$isActive?"moveStripes 1s linear infinite":"none"};
  }

  @keyframes moveStripes {
    0% { transform: translateX(0); }
    100% { transform: translateX(20px); }
  }
`,ft=s.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  position: relative;
  z-index: 1;
`,vt=s.span`
  font-size: 0.7rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`,xt=s.span`
  font-size: 1.1rem;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`,Eo=s.div`
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  z-index: 1;
`,ko=s.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${r=>r.$isPaused?"#ffd700":r.$isActive?"#00ff88":"#ff6b6b"};
  animation: ${r=>r.$isActive?"pulse 2s infinite":"none"};
  box-shadow: 0 0 10px ${r=>r.$isPaused?"rgba(255, 215, 0, 0.5)":r.$isActive?"rgba(0, 255, 136, 0.5)":"rgba(255, 107, 107, 0.5)"};

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.7; }
  }
`,To=s.span`
  font-size: 0.8rem;
  font-weight: 600;
  position: relative;
  z-index: 1;
`,Oc=s.div`
  display: flex;
  gap: 8px;
  position: relative;
  z-index: 1;
`,yt=s.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,Rc=s.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: ${r=>{const a=parseFloat(r.$efficiency);return a>=90?"#00ff88":a>=70?"#ffd700":"#ff6b6b"}};
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.6rem;
  font-weight: bold;
  z-index: 2;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`,_r=({timeMetrics:r,onStart:a,onPause:t,onResume:o,onFinish:c,showControls:i=!0,compact:d=!1,invisible:p=!1})=>{const[f,h]=l.useState(Date.now());if(l.useEffect(()=>{const S=setInterval(()=>{h(Date.now())},1e3);return()=>clearInterval(S)},[]),p)return null;if(!r)return e.jsx(Ao,{children:e.jsxs(Eo,{children:[e.jsx(ko,{$isActive:!1,$isPaused:!1}),e.jsx(To,{children:"Cronômetro"})]})});const{isActive:m,isPaused:u,activeTime:n,totalTime:g,pausedTime:E,efficiency:w,sessionId:U}=r,A=()=>u?"Pausado":m?"Ativo":"Finalizado",B=S=>{const L=Math.floor(S/3600),j=Math.floor(S%3600/60),k=S%60;return d?L>0?`${L}h${j}m`:j>0?`${j}:${k.toString().padStart(2,"0")}`:`${k}s`:L>0?`${L}:${j.toString().padStart(2,"0")}:${k.toString().padStart(2,"0")}`:j>0?`${j}:${k.toString().padStart(2,"0")}`:`${k}s`};return e.jsxs(Ao,{$isActive:m&&!u,children:[w&&e.jsxs(Rc,{$efficiency:w,children:[w.toFixed(0),"%"]}),e.jsxs(Eo,{children:[e.jsx(ko,{$isActive:m,$isPaused:u}),e.jsx(To,{children:A()})]}),e.jsxs(ft,{children:[e.jsx(vt,{children:"Tempo Ativo"}),e.jsx(xt,{children:B(n)})]}),!d&&e.jsxs(e.Fragment,{children:[e.jsxs(ft,{children:[e.jsx(vt,{children:"Tempo Total"}),e.jsx(xt,{children:B(g)})]}),E>0&&e.jsxs(ft,{children:[e.jsx(vt,{children:"Pausado"}),e.jsx(xt,{children:B(E)})]})]}),"      ",i&&e.jsxs(Oc,{children:[m&&!u&&e.jsx(yt,{onClick:t,children:"⏸️ Pausar"}),m&&u&&e.jsx(yt,{onClick:o,children:"▶️ Continuar"}),m&&e.jsx(yt,{onClick:c,children:"⏹️ Finalizar"})]})]})},bt={ACTIVITIES:{MEMORY:"🧠",COLORS:"🌈",SHAPES:"🔷",NUMBERS:"🔢",LETTERS:"🔤",EMOTIONS:"😊",SOUNDS:"🎵",COORDINATION:"🎯"},FEEDBACK:{SUCCESS:["🎉","⭐","👏","🌟","✨","🎊"],GREAT:["🚀","💫","🏆","👑","🎯","💎"],GOOD:["👍","😊","✅","💚","🙌","😄"],TRY_AGAIN:["💪","🌱","📚","🎈","🌺","🦋"],ENCOURAGEMENT:["❤️","🤗","🌈","☀️","🌸","🎨"]},ANIMALS:["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵"],FRUITS:["🍎","🍌","🍊","🍇","🍓","🥝","🍑","🍒","🥭","🍍","🥥","🫐","🍈","🍉","🍋"],OBJECTS:["⚽","🏀","🎾","🏈","🎱","🏓","🏸","🥎","🏐","🏉","🎳","🏹","🎣","🥊","🛼"]},Ve=s.div`
  background: rgba(255, 255, 255, 0.98);
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  margin: 0;
  box-shadow: var(--shadow-large);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;

  @media (max-width: 768px) {
    padding: var(--space-lg);
    gap: var(--space-md);
  }
`,Ue=s.div`
  text-align: center;
  margin-bottom: var(--space-xl);
  width: 100%;

  @media (max-width: 768px) {
    margin-bottom: var(--space-lg);
  }
`,Be=s.h1`
  font-size: var(--font-size-xxl);
  color: var(--primary-blue);
  margin: 0 0 var(--space-sm) 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: var(--font-size-xl);
    flex-direction: column;
    gap: var(--space-xs);
  }

  @media (max-width: 480px) {
    font-size: var(--font-size-lg);
  }
`,Ye=s.p`
  color: var(--primary-purple);
  font-size: var(--font-size-md);
  margin: 0 0 var(--space-md) 0;
  font-weight: 400;
  opacity: 0.8;

  @media (max-width: 768px) {
    font-size: var(--font-size-sm);
  }
`,He=s.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: var(--space-lg);
  width: 100%;
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  z-index: 10;

  @media (max-width: 768px) {
    margin-bottom: var(--space-md);
    top: var(--space-sm);
    right: var(--space-sm);
  }
`;s.h2`
  font-size: var(--font-size-xl);
  color: white;
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  font-weight: 600;
`;const _e=s(_.button)`
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-medium);
  cursor: pointer;
  font-size: var(--font-size-md);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`,nr=s.div`
  color: white;
  text-align: center;
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-lg);
  padding: var(--space-lg);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-medium);
  font-weight: 500;
  width: 100%;
  line-height: 1.5;

  /* Cada atividade definirá seu próprio background com gradiente */

  @media (max-width: 768px) {
    font-size: var(--font-size-md);
    padding: var(--space-md);
    margin-bottom: var(--space-md);
  }
`,jr=s.div`
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
  flex-wrap: wrap;
  justify-content: center;
`,Sr=s(_.button)`
  background: ${r=>r.isActive?r.themeColor||"var(--primary-orange)":"white"};
  color: ${r=>r.isActive?"white":r.themeColor||"var(--primary-blue)"};
  border: 2px solid ${r=>r.themeColor||"var(--primary-orange)"};
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-medium);
  cursor: pointer;
  font-weight: 600;
  
  &:focus {
    outline: 3px solid ${r=>r.themeColor||"var(--primary-orange)"};
    outline-offset: 2px;
  }
`,ir=s.div`
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 768px) {
    gap: var(--space-sm);
  }
`,Ce=s(_.button)`
  background: ${r=>r.themeColor||"var(--primary-green)"};
  color: white;
  border: none;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-large);
  font-size: var(--font-size-md);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  
  &:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 2px;
  }
`,Po="var(--primary-blue)",Lc="linear-gradient(135deg, var(--primary-blue), var(--primary-purple))",Nc=s(nr)`
  background: ${Lc};
`,Fc=s.div`
  display: flex;
  gap: var(--space-lg);
  flex-wrap: wrap;
`,ha=s.div`
  text-align: center;
`,fa=s.div`
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--primary-blue);
`,va=s.div`
  font-size: var(--font-size-sm);
  color: var(--medium-gray);
`,Uc=s.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
  max-width: 600px;
  margin: 0 auto var(--space-xl);
    @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-sm);
  }
  
  @media (max-width: 360px) {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-xs);
    max-width: 300px;
  }
`,Bc=s(_.button)`
  aspect-ratio: 1;
  border: none;
  border-radius: var(--radius-medium);
  cursor: pointer;
  font-size: 2rem;
  background: ${r=>r.isFlipped?"white":"var(--primary-blue)"};
  color: ${r=>r.isFlipped?"var(--dark-gray)":"white"};
  box-shadow: var(--shadow-light);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  min-height: 80px;
  
  &:disabled {
    cursor: not-allowed;
  }
    &:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 2px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    min-height: 60px;
  }
  
  @media (max-width: 360px) {
    font-size: 1.2rem;
    min-height: 50px;
  }
`,Hc=s.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: var(--primary-blue);
  color: white;
`,_c=s(_.div)`
  text-align: center;
  padding: var(--space-xl);
  background: linear-gradient(135deg, var(--primary-green), var(--primary-blue));
  color: white;
  border-radius: var(--radius-large);
  margin: var(--space-lg) 0;
`,Gc=s.h3`
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-md);
  font-weight: 600;
`,qc=s(_.button)`
  background: white;
  color: var(--primary-blue);
  border: none;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-medium);
  cursor: pointer;
  font-size: var(--font-size-md);
  font-weight: 600;
  margin-top: var(--space-md);
`,Vc=[{id:"EASY",name:"Fácil (6 pares)",pairs:6},{id:"MEDIUM",name:"Médio (8 pares)",pairs:8},{id:"HARD",name:"Difícil (12 pares)",pairs:12}];function Yc({onBack:r}){const[a,t]=l.useState([]),[o,c]=l.useState([]),[i,d]=l.useState([]),[p,f]=l.useState(0),[h,m]=l.useState(!1),[u,n]=l.useState(!1),[g,E]=l.useState("MEDIUM"),[w,U]=l.useState(0),[A,B]=l.useState(0),[S,L]=l.useState(0),[j,k]=l.useState(null),[M,P]=l.useState(!0),{playSuccess:W,playError:Q,playClick:H}=br(),{progress:T,isCompleted:z,recordSuccess:b,recordError:O,getStats:D,getEncouragementMessage:Y,resetSession:X,updateTimeSpent:G,startActivity:me,pauseActivity:ne,resumeActivity:pe,finishActivity:ye,sessionId:I,isActivityActive:N,isActivityPaused:J,getFormattedTime:K,getCurrentTimeMetrics:ce}=wr("memory-game"),V=()=>{Br()&&document.body.classList.add("high-contrast"),vr()&&document.body.classList.add("reduced-motion")};l.useEffect(()=>{V()},[]),l.useEffect(()=>{let v;return u&&!h&&(v=setInterval(()=>{L(F=>F+1)},1e3)),()=>clearInterval(v)},[u,h]);const oe=async()=>{await me(),n(!0),P(!1),k(Date.now()),L(0),f(0),c([]),d([]),m(!1),X();const v=g==="EASY"?6:g==="MEDIUM"?8:10,$=[...[...bt.ANIMALS,...bt.FRUITS,...bt.OBJECTS]].sort(()=>Math.random()-.5).slice(0,v).flatMap((R,ee)=>[{id:`card-${ee}-a`,emoji:R,matched:!1},{id:`card-${ee}-b`,emoji:R,matched:!1}]).sort(()=>Math.random()-.5);t($),te(`Novo jogo iniciado! Dificuldade: ${g.toLowerCase()}. Encontre ${v} pares.`)};l.useEffect(()=>{if(i.length===a.length&&a.length>0){const v=Date.now(),F=Math.floor((v-j)/1e3);L(F),G(F),m(!0),W(),Je();const y=D(),$=Y(),R={difficulty:g,moves:p,timeSpent:F,pairs:a.length/2,accuracy:y.accuracy,timestamp:new Date().toISOString()};try{const ee=JSON.parse(localStorage.getItem("betina_memory_history")||"[]");ee.push(R),localStorage.setItem("betina_memory_history",JSON.stringify(ee.slice(-20)))}catch(ee){console.warn("Erro ao salvar histórico de jogo:",ee)}te(`Parabéns! Você completou o jogo! ${$} Precisão: ${y.accuracy}%`),G()}},[i.length,a.length]),l.useEffect(()=>{if(o.length===2){const[v,F]=o;if(f(y=>y+1),a[v].emoji===a[F].emoji){W(),Je(),b();const y=Y();te(`Par encontrado! ${y}`),d($=>[...$,v,F]),c([]),U($=>$+1),B(0)}else Q(),Hr(),O(),te("Não é um par. Tente novamente!"),setTimeout(()=>{c([])},1e3),B(y=>y+1),U(0)}},[o.length,a]);const ue=v=>{if(o.length===2||o.includes(v)||i.includes(v))return;H(),c(y=>[...y,v]);const F=a[v];F&&te(`Carta revelada: ${F.emoji}`)},q=v=>o.includes(v)||i.includes(v);return e.jsxs(Ve,{children:[e.jsx(He,{children:e.jsx(_e,{onClick:r,whileHover:{scale:1.05},whileTap:{scale:.95},children:"⬅️ Voltar"})}),e.jsxs(Ue,{children:[e.jsxs(Be,{children:[e.jsx("span",{children:"🧠"}),e.jsx("span",{children:"Jogo da Memória"})]}),e.jsx(Ye,{children:"Exercite sua memória visual e concentração"})]}),u&&!M&&e.jsxs(Fc,{children:[e.jsxs(ha,{children:[e.jsx(fa,{children:p}),e.jsx(va,{children:"Jogadas"})]}),e.jsxs(ha,{children:[e.jsx(fa,{children:i.length/2}),e.jsx(va,{children:"Pares"})]}),e.jsxs(ha,{children:[e.jsx(fa,{children:T.stars}),e.jsx(va,{children:"⭐ Estrelas"})]}),e.jsxs(ha,{children:[e.jsxs(fa,{children:[D().accuracy,"%"]}),e.jsx(va,{children:"Precisão"})]})]}),e.jsx(Nc,{children:M?"🧠 Exercite sua memória encontrando os pares iguais! Escolha a dificuldade para começar.":"🧠 Clique nas cartas para encontrar os pares iguais!"}),M&&e.jsxs(e.Fragment,{children:[e.jsx(jr,{children:Vc.map(v=>e.jsx(Sr,{isActive:g===v.id,onClick:()=>E(v.id),whileHover:{scale:1.05},whileTap:{scale:.95},themeColor:Po,children:v.name},v.id))}),e.jsx(ir,{children:e.jsx(Ce,{onClick:oe,whileHover:{scale:1.05},whileTap:{scale:.95},themeColor:Po,children:"🧠 Começar Jogo"})})]}),e.jsx(_r,{timeMetrics:N?ce():null,onStart:me,onPause:ne,onResume:pe,onFinish:ye,showControls:!1,compact:!1,invisible:!0}),"      ",!M&&e.jsxs(e.Fragment,{children:[e.jsx(Ne,{children:h&&e.jsxs(_c,{initial:{opacity:0,scale:.8,y:-20},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.8,y:-20},children:[e.jsx(Gc,{children:"🎉 Parabéns! Você conseguiu! 🎉"}),e.jsxs("p",{children:["Você encontrou todos os pares em ",p," jogadas!"]}),e.jsxs("p",{children:["⭐ Estrelas ganhas: ",T.stars,"/3"]}),e.jsxs("p",{children:["🎯 Precisão: ",D().accuracy,"%"]}),e.jsx("p",{style:{marginTop:"16px",fontSize:"1.1em"},children:Y()}),e.jsx(qc,{onClick:()=>{P(!0),m(!1)},whileHover:{scale:1.05},whileTap:{scale:.95},children:"🔄 Jogar Novamente"})]})}),e.jsx(Uc,{children:a.map((v,F)=>e.jsx(Bc,{onClick:()=>ue(F),disabled:o.length===2&&!o.includes(F),isFlipped:q(F),whileHover:{scale:1.05},whileTap:{scale:.95},animate:{rotateY:q(F)?180:0},transition:{duration:.3},children:q(F)?e.jsx(_.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:.15},children:v.emoji}):e.jsx(Hc,{children:"❓"})},v.id))})]}),e.jsx("div",{style:{textAlign:"center",color:"var(--medium-gray)"},children:e.jsx("p",{children:"💡 Dica: Clique nas cartas para encontrar os pares iguais!"})})]})}const zo="var(--primary-green)",Jc="linear-gradient(135deg, var(--primary-green), var(--primary-blue))",Wc=s(nr)`
  background: ${Jc};
`,Mo=s(_.button)`
  background: var(--medium-gray);
  color: white;
  border: none;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-medium);
  cursor: pointer;
  font-size: var(--font-size-md);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  
  &:hover {
    background: var(--dark-gray);
  }
`,Kc=s.div`
  display: flex;
  gap: var(--space-lg);
  flex-wrap: wrap;
  justify-content: center;
  margin: var(--space-lg) 0;
`,xa=s.div`
  text-align: center;
`,ya=s.div`
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--primary-green);
`,ba=s.div`
  font-size: var(--font-size-sm);
  color: var(--medium-gray);
`,Xc=s.div`
  text-align: center;
  font-size: var(--font-size-lg);
  color: var(--primary-green);
  font-weight: 600;
`,Qc=s.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xl);
`,Zc=s(_.div)`
  text-align: center;
  padding: var(--space-lg);
  background: linear-gradient(135deg, var(--primary-green), var(--primary-blue));
  color: white;
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-medium);
`,el=s.h3`
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-md);
  font-weight: 600;
`,rl=s.div`
  width: 80px;
  height: 80px;
  border-radius: var(--radius-round);
  background: ${r=>r.color};
  margin: 0 auto;
  box-shadow: var(--shadow-medium);
  border: 4px solid white;
`,al=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-md);
  max-width: 600px;
  width: 100%;
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 360px) {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }
`,tl=s(_.button)`
  background: ${r=>r.isSelected?"var(--success-light)":"white"};
  border: 3px solid ${r=>r.isSelected&&r.isCorrect?"var(--primary-green)":r.isSelected&&!r.isCorrect?"var(--primary-red)":"var(--light-gray)"};
  border-radius: var(--radius-medium);
  padding: var(--space-md);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  min-height: 120px;
  box-shadow: ${r=>r.isSelected&&r.isCorrect?"0 4px 12px rgba(76, 175, 80, 0.3)":r.isSelected&&!r.isCorrect?"0 4px 12px rgba(244, 67, 54, 0.3)":"var(--shadow-light)"};
  position: relative;
  transition: all var(--transition-normal);
  
  &:hover:not(:disabled) {
    border-color: var(--primary-green);
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }  
  
  &:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  /* Efeito de sucesso */
  ${r=>r.isSelected&&r.isCorrect&&`
    background: var(--success-light);
    border-color: var(--primary-green);
    
    &::after {
      content: '✓';
      position: absolute;
      top: 5px;
      right: 5px;
      background: var(--primary-green);
      color: white;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }
  `}
  
  /* Efeito de erro temporário */
  ${r=>r.isSelected&&!r.isCorrect&&`
    background: var(--error-light);
    border-color: var(--primary-red);
    
    &::after {
      content: '✗';
      position: absolute;
      top: 5px;
      right: 5px;
      background: var(--primary-red);
      color: white;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }
  `}
`,ol=s.div`
  font-size: 2rem;
  margin-bottom: var(--space-xs);
`,sl=s.div`
  font-size: var(--font-size-sm);
  color: var(--dark-gray);
  text-align: center;
  font-weight: 500;
`,il=s(_.div)`
  padding: var(--space-md);
  border-radius: var(--radius-medium);
  text-align: center;
  font-weight: 600;
  font-size: var(--font-size-md);
  margin: var(--space-md) 0;
  
  &.success {
    background: var(--success-light);
    color: var(--success-dark);
    border: 2px solid var(--primary-green);
  }
  
  &.error {
    background: var(--error-light);
    color: var(--error-dark);
    border: 2px solid var(--primary-red);
  }
`,nl=s.div`
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
  justify-content: center;
  margin: var(--space-lg) 0;
`,wt={RED:"#e91e63",GREEN:"#4CAF50",BLUE:"#2196F3",YELLOW:"#FFC107",PURPLE:"#9C27B0",ORANGE:"#FF9800"},or={RED:"Vermelho",GREEN:"Verde",BLUE:"Azul",YELLOW:"Amarelo",PURPLE:"Roxo",ORANGE:"Laranja"},Do=[{id:1,name:"Maçã",emoji:"🍎",color:"RED"},{id:2,name:"Morango",emoji:"🍓",color:"RED"},{id:3,name:"Cereja",emoji:"🍒",color:"RED"},{id:4,name:"Tomate",emoji:"🍅",color:"RED"},{id:5,name:"Melancia",emoji:"🍉",color:"RED"},{id:6,name:"Pimenta",emoji:"🌶️",color:"RED"},{id:7,name:"Coração",emoji:"❤️",color:"RED"},{id:8,name:"Folha",emoji:"🍃",color:"GREEN"},{id:9,name:"Árvore",emoji:"🌲",color:"GREEN"},{id:10,name:"Brócolis",emoji:"🥦",color:"GREEN"},{id:11,name:"Sapo",emoji:"🐸",color:"GREEN"},{id:12,name:"Pepino",emoji:"🥒",color:"GREEN"},{id:13,name:"Maçã Verde",emoji:"🍏",color:"GREEN"},{id:14,name:"Planta",emoji:"🌱",color:"GREEN"},{id:15,name:"Oceano",emoji:"🌊",color:"BLUE"},{id:16,name:"Peixe",emoji:"🐟",color:"BLUE"},{id:17,name:"Golfinho",emoji:"🐬",color:"BLUE"},{id:18,name:"Borboleta Azul",emoji:"🦋",color:"BLUE"},{id:19,name:"Baleia",emoji:"🐳",color:"BLUE"},{id:20,name:"Chapéu",emoji:"🧢",color:"BLUE"},{id:21,name:"Jeans",emoji:"👖",color:"BLUE"},{id:22,name:"Banana",emoji:"🍌",color:"YELLOW"},{id:23,name:"Limão",emoji:"🍋",color:"YELLOW"},{id:24,name:"Girassol",emoji:"🌻",color:"YELLOW"},{id:25,name:"Estrela",emoji:"⭐",color:"YELLOW"},{id:26,name:"Sino",emoji:"🔔",color:"YELLOW"},{id:27,name:"Abelha",emoji:"🐝",color:"YELLOW"},{id:28,name:"Pintinho",emoji:"🐤",color:"YELLOW"},{id:29,name:"Uva",emoji:"🍇",color:"PURPLE"},{id:30,name:"Berinjela",emoji:"🍆",color:"PURPLE"},{id:31,name:"Vestido",emoji:"👗",color:"PURPLE"},{id:32,name:"Cristal",emoji:"💎",color:"PURPLE"},{id:33,name:"Borboleta",emoji:"🦄",color:"PURPLE"},{id:34,name:"Flor Roxa",emoji:"💜",color:"PURPLE"},{id:35,name:"Laranja",emoji:"🍊",color:"ORANGE"},{id:36,name:"Abóbora",emoji:"🎃",color:"ORANGE"},{id:37,name:"Cenoura",emoji:"🥕",color:"ORANGE"},{id:38,name:"Raposa",emoji:"🦊",color:"ORANGE"},{id:39,name:"Peixe Dourado",emoji:"🐠",color:"ORANGE"},{id:40,name:"Folha de Outono",emoji:"🍂",color:"ORANGE"}],lr={EASY:{correctItems:2,incorrectItems:2,name:"Fácil"},MEDIUM:{correctItems:3,incorrectItems:3,name:"Médio"},HARD:{correctItems:4,incorrectItems:4,name:"Difícil"}};function cl({onBack:r}){const[a,t]=l.useState(null),[o,c]=l.useState([]),[i,d]=l.useState([]),[p,f]=l.useState(null),[h,m]=l.useState("MEDIUM"),[u,n]=l.useState(!1),[g,E]=l.useState(0),[w,U]=l.useState(!u),{playSuccess:A,playError:B,playClick:S}=br(),{progress:L,incrementAttempts:j,recordSuccess:k,recordError:M,resetProgress:P,updateScore:W,incrementSuccesses:Q,getCurrentTimeMetrics:H,startActivity:T,pauseActivity:z,resumeActivity:b,finishActivity:O,isActivityActive:D,isActivityPaused:Y,getStats:X,getEncouragementMessage:G,saveProgress:me}=wr("color-match"),[ne,pe]=l.useState({score:0,accuracy:100,stars:0});l.useEffect(()=>()=>{O()},[]);const ye=async()=>{try{await T(),n(!0),U(!1),P(),E(0),d([]),pe({score:0,accuracy:100,stars:0}),I(),te("Jogo de cores iniciado! Encontre todos os itens da cor indicada.")}catch(V){console.error("Erro ao iniciar jogo:",V)}},I=()=>{d([]),f(null);const V=Object.keys(wt),oe=V[Math.floor(Math.random()*V.length)];t(oe);const ue=Do.filter(ee=>ee.color===oe),q=Do.filter(ee=>ee.color!==oe),v=ee=>[...ee].sort(()=>Math.random()-.5),F=lr[h],y=v(ue).slice(0,F.correctItems),$=v(q).slice(0,F.incorrectItems),R=v([...y,...$]);c(R),setTimeout(()=>{te(`Novo desafio! Encontre ${F.correctItems} itens da cor ${or[oe].toLowerCase()}.`)},500)},N=V=>{const oe=o.filter(q=>q.color===a);if(oe.every(q=>V.some(v=>v.id===q.id))&&V.length===oe.length){const q=h==="EASY"?15:h==="MEDIUM"?25:40,v=V.length===oe.length?10:0,F=q+lr[h].correctItems*8+v;k(),Q(),pe(R=>{const ee=R.score+F,fe=Math.min(3,Math.floor(ee/80));return{...R,score:ee,stars:fe,accuracy:Math.round((g+1)/Math.max(1,g+1)*100)}}),E(R=>R+1);const y=[`🎉 Perfeito! Todos os itens ${or[a].toLowerCase()}!`,"🌟 Excelente! Você encontrou todas as cores certas!","✨ Fantástico! Sua percepção de cores está ótima!","🎯 Incrível! Continue assim!","💫 Muito bem! Você é um expert em cores!"],$=y[Math.floor(Math.random()*y.length)];f({isCorrect:!0,message:`${$} +${F} pontos!`}),A(),Je(),te(`${$} Você ganhou ${F} pontos!`),me(),setTimeout(()=>{f(null),setTimeout(()=>{I(),te(`Novo desafio! Encontre os itens ${or[a]?or[a].toLowerCase():"da nova cor"}.`)},500)},3e3)}},J=V=>{if(i.some(ue=>ue.id===V.id))return;S(),j();const oe=[...i,V];if(d(oe),V.color===a)Je(),te(`Correto! ${V.name} é da cor ${or[a].toLowerCase()}.`),N(oe);else{M(),B(),Hr();const ue=[`🤔 Ops! ${V.name} não é da cor ${or[a].toLowerCase()}.`,`🎨 Hmm, ${V.name} tem uma cor diferente. Tente outro!`,"🌈 Não é bem essa cor. Observe bem e tente novamente!","💡 Essa não é a cor certa. Você consegue encontrar a correta!"],q=ue[Math.floor(Math.random()*ue.length)];te(`${q} Continue tentando!`),f({isCorrect:!1,message:`${q} Continue!`}),setTimeout(()=>{d(v=>v.filter(F=>F.id!==V.id)),f(null)},1500)}},K=V=>i.some(oe=>oe.id===V.id),ce=V=>V.color===a;return e.jsxs(Ve,{children:[e.jsx(He,{children:e.jsx(_e,{onClick:r,whileHover:{scale:1.05},whileTap:{scale:.95},children:"⬅️ Voltar"})}),e.jsxs(Ue,{children:[e.jsxs(Be,{children:[e.jsx("span",{children:"🌈"}),e.jsx("span",{children:"Combinar Cores"})]}),e.jsx(Ye,{children:"Encontre todos os objetos da cor indicada"})]}),u&&!w&&e.jsxs(Kc,{children:[e.jsxs(xa,{children:[e.jsx(ya,{children:L.score}),e.jsx(ba,{children:"Pontos"})]}),"          ",e.jsxs(xa,{children:[e.jsx(ya,{children:currentRound}),e.jsx(ba,{children:"Nível"})]}),e.jsxs(xa,{children:[e.jsx(ya,{children:L.stars}),e.jsx(ba,{children:"⭐ Estrelas"})]}),e.jsxs(xa,{children:[e.jsxs(ya,{children:[X().accuracy,"%"]}),e.jsx(ba,{children:"Precisão"})]})]}),w?e.jsxs(e.Fragment,{children:[e.jsx(Wc,{children:"🌈 Encontre todos os itens da cor indicada! Escolha a dificuldade para começar."}),e.jsx(jr,{children:Object.entries(lr).map(([V,oe])=>e.jsxs(Sr,{isActive:h===V,onClick:()=>m(V),whileHover:{scale:1.05},whileTap:{scale:.95},themeColor:zo,children:[oe.name,e.jsx("br",{}),e.jsxs("small",{children:["(",oe.correctItems," itens)"]})]},V))}),e.jsx(ir,{children:e.jsx(Ce,{onClick:ye,whileHover:{scale:1.05},whileTap:{scale:.95},themeColor:zo,children:"🌈 Começar Jogo"})})]}):e.jsxs(e.Fragment,{children:[e.jsxs(nl,{children:[e.jsxs(Xc,{children:["Nível: ",lr[h].name," | Pontos: ",ne.score," | ⭐ ",ne.stars,"/3 | 🎯 ",ne.accuracy,"%"]}),e.jsx(Mo,{onClick:()=>U(!0),whileHover:{scale:1.05},whileTap:{scale:.95},children:"🎛️ Trocar Nível"}),e.jsx(Mo,{onClick:ye,whileHover:{scale:1.05},whileTap:{scale:.95},children:"🔄 Novo Jogo"})]}),e.jsx(_r,{timeMetrics:D?H():null,onStart:T,onPause:z,onResume:b,onFinish:O,showControls:!1,compact:!1,invisible:!0}),e.jsxs(Qc,{children:[a&&e.jsxs(Zc,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},transition:{duration:.5},children:[e.jsxs(el,{children:["Encontre todos os ",lr[h].correctItems," itens da cor ",or[a].toLowerCase(),":"]}),e.jsx(rl,{color:wt[a]})]},a),e.jsx(Ne,{children:p&&e.jsx(il,{initial:{opacity:0,scale:.8},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.8},className:p.isCorrect?"success":"error",children:p.message})}),"            ",e.jsx(al,{children:o.map((V,oe)=>e.jsxs(tl,{onClick:()=>J(V),isSelected:K(V),isCorrect:ce(V),whileHover:{scale:1.05},whileTap:{scale:.95},initial:{opacity:0,y:20},animate:{opacity:1,y:0,scale:K(V)?1.02:1},transition:{delay:oe*.1,scale:{duration:.2}},children:[e.jsx(ol,{children:V.emoji}),e.jsx(sl,{children:V.name})]},`${V.id}-${oe}`))}),"            ",a&&e.jsxs("div",{style:{textAlign:"center",color:"var(--medium-gray)",marginTop:"var(--space-md)"},children:[e.jsxs("p",{children:["💡 Dica: Clique nos itens que têm a cor ",e.jsx("strong",{style:{color:wt[a]},children:or[a].toLowerCase()}),"!"]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"var(--space-sm)",fontSize:"var(--font-size-md)",fontWeight:"600",color:"var(--primary-blue)"},children:[e.jsx("span",{children:"Progresso:"}),e.jsx("span",{style:{color:"var(--primary-green)"},children:i.filter(V=>V.color===a).length}),e.jsx("span",{children:"/"}),e.jsx("span",{children:lr[h].correctItems}),e.jsx("span",{style:{fontSize:"1.2rem"},children:i.filter(V=>V.color===a).length===lr[h].correctItems?"🎉":"🎯"})]})]})]})]})]})}const $o="betina_user_id";function lt(){const[r,a]=l.useState(null),[t,o]=l.useState(null),[c,i]=l.useState(!0),[d,p]=l.useState(null);return l.useEffect(()=>{(async()=>{try{const n=localStorage.getItem($o);if(n){const E=await re.getUser(n);if(E){a(n),o(E),i(!1);return}}const g=await re.createAnonymousUser();if(g){localStorage.setItem($o,g),a(g);const E=await re.getUser(g);o(E)}else throw new Error("Não foi possível criar um novo usuário")}catch(n){console.error("Erro ao carregar/criar usuário:",n),p(n.message)}finally{i(!1)}})()},[]),{userId:r,userDetails:t,loading:c,error:d,updatePreferences:async u=>{if(!r)return!1;try{const n=await re.updateUserPreferences(r,u);return n&&o(g=>({...g,preferences:{...g?.preferences||{},...u}})),n}catch(n){return console.error("Erro ao atualizar preferências:",n),p(n.message),!1}},updateAccessibilitySettings:async u=>{if(!r)return!1;try{return await re.updateAccessibilitySettings(r,u)}catch(n){return console.error("Erro ao atualizar configurações de acessibilidade:",n),p(n.message),!1}},getAccessibilitySettings:async()=>{if(!r)return null;try{return await re.getAccessibilitySettings(r)}catch(u){return console.error("Erro ao obter configurações de acessibilidade:",u),p(u.message),null}}}}const jt=10,ll=.7,dl=.8,ml=.4,pl=.3;class Vt{constructor(a){this.gameId=a,this.historyKey=`betina_${a}_history`,this.userId=localStorage.getItem("betina_user_id"),this.gameHistory=[],this.loadHistory()}async loadHistory(){try{const a=localStorage.getItem(this.historyKey);let t=a?JSON.parse(a):[];if(this.userId)try{const o=await re.getGameSessions(this.userId,this.gameId,jt);o&&o.length>0&&(t=o.map(c=>({difficulty:c.difficulty,accuracy:c.accuracy/100,score:c.score,timeSpent:c.time_spent,timestamp:c.created_at,...c.data})))}catch(o){console.warn("Erro ao carregar histórico do banco:",o)}return this.gameHistory=t,t}catch(a){return console.warn("Erro ao carregar histórico de jogo:",a),[]}}async saveGameData(a){try{const t={...a,timestamp:new Date().toISOString()};if(this.gameHistory.push(t),this.gameHistory.length>jt&&(this.gameHistory=this.gameHistory.slice(-jt)),localStorage.setItem(this.historyKey,JSON.stringify(this.gameHistory)),this.userId)try{await re.saveGameSession({user_id:this.userId,game_id:this.gameId,difficulty:a.difficulty,score:a.score||0,accuracy:a.accuracy*100,time_spent:a.timeSpent||0,completed:!0,correct_answers:a.successes||0,total_attempts:a.attempts||0,data:a})}catch(o){console.warn("Erro ao salvar no banco de dados:",o)}return this.recommendDifficulty()}catch(t){return console.warn("Erro ao salvar dados do jogo:",t),null}}calculateAverage(a){return!this.gameHistory||this.gameHistory.length===0?null:this.gameHistory.reduce((o,c)=>o+(c[a]||0),0)/this.gameHistory.length}recommendDifficulty(){if(this.gameHistory.length<3)return"MEDIUM";const a=this.calculateAverage("accuracy"),t=this.gameHistory[this.gameHistory.length-1].difficulty,o=this.calculateTrend("accuracy");switch(t){case"EASY":if(a>ll&&o>0)return"MEDIUM";break;case"MEDIUM":if(a>dl&&o>0)return"HARD";if(a<pl||o<-.1)return"EASY";break;case"HARD":if(a<ml||o<-.1)return"MEDIUM";break}return t}calculateTrend(a){if(this.gameHistory.length<3)return 0;const t=this.gameHistory.slice(-5);if(t.length<2)return 0;const o=Array.from({length:t.length},(u,n)=>n),c=t.map(u=>u[a]||0),i=o.length,d=o.reduce((u,n)=>u+n,0),p=c.reduce((u,n)=>u+n,0),f=o.reduce((u,n,g)=>u+n*c[g],0),h=o.reduce((u,n)=>u+n*n,0);return(i*f-d*p)/(i*h-d*d)}predictScore(){if(this.gameHistory.length<3)return null;const a=this.calculateTrend("accuracy"),t=this.gameHistory[this.gameHistory.length-1].accuracy;return Math.min(100,Math.max(0,t+a*10))}}const Fr=(r,a=null)=>{const t=new Vt(r);return a&&(t.userId=a),t},gr=async(r,a)=>{const t=new Vt(r);await t.loadHistory();const o=t.recommendDifficulty()||a;let c=null;try{c=await re.getAdaptiveParameters(r,o)}catch(i){console.warn("Erro ao buscar parâmetros adaptativos do banco:",i)}return c||(c={"memory-game":{EASY:{pairs:4,timeLimit:120,hintDuration:1e3},MEDIUM:{pairs:6,timeLimit:180,hintDuration:800},HARD:{pairs:8,timeLimit:240,hintDuration:500}},"color-match":{EASY:{correctItems:2,incorrectItems:2,timeLimit:60},MEDIUM:{correctItems:3,incorrectItems:3,timeLimit:45},HARD:{correctItems:4,incorrectItems:4,timeLimit:30}},"musical-sequence":{EASY:{maxNotes:3,speed:1e3},MEDIUM:{maxNotes:5,speed:800},HARD:{maxNotes:7,speed:600}},"number-counting":{EASY:{minCount:1,maxCount:5,options:3},MEDIUM:{minCount:1,maxCount:10,options:4},HARD:{minCount:5,maxCount:15,options:5}},"letter-recognition":{EASY:{focusLetters:["A","E","O"],timeLimit:15,audioHints:!0},MEDIUM:{focusLetters:["A","B","C","D","E","F","G","H"],timeLimit:10,audioHints:!1},HARD:{focusLetters:["L","M","N","P","R","S","T","V","Z"],timeLimit:8,audioHints:!1}},"image-association":{EASY:{categories:["animals","fruits"],timeLimit:20},MEDIUM:{categories:["animals","fruits","toys","vehicles"],timeLimit:15},HARD:{categories:["all"],timeLimit:10}}}[r]?.[o]||{}),{difficulty:o,parameters:c}},ul=r=>{const a=new Vt(r),t=a.gameHistory;if(t.length<5)return{hasEnoughData:!1,message:"Precisa de mais partidas para análise completa"};if(r==="letter-recognition"){const o={};return t.forEach(i=>{if(!i.letter)return;const d=i.letter;o[d]||(o[d]={attempts:0,successes:0}),o[d].attempts++,i.accuracy>0&&o[d].successes++}),{hasEnoughData:!0,strugglingLetters:Object.entries(o).filter(([i,d])=>d.attempts>1).filter(([i,d])=>d.successes/d.attempts<.6).map(([i])=>i),letterPerformance:o}}return{hasEnoughData:!0,averageAccuracy:a.calculateAverage("accuracy"),trend:a.calculateTrend("accuracy"),prediction:a.predictScore()}},Io="var(--primary-orange)",gl="linear-gradient(135deg, var(--primary-orange), var(--primary-pink))",Oo=s(nr)`
  background: ${gl};
`;s.div`
  display: flex;
  gap: var(--space-lg);
  flex-wrap: wrap;
  justify-content: center;
  margin: var(--space-lg) 0;
`;s.div`
  text-align: center;
`;s.div`
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--primary-orange);
`;s.div`
  font-size: var(--font-size-sm);
  color: var(--medium-gray);
`;s.div`
  text-align: center;
  font-size: var(--font-size-lg);
  color: var(--primary-orange);
  font-weight: 600;
`;const hl=s.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xl);
`,fl=s(_.div)`
  background: white;
  border: 4px solid var(--primary-orange);
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  text-align: center;
  box-shadow: var(--shadow-medium);
  min-width: 200px;
`,vl=s.div`
  font-size: 4rem;
  margin-bottom: var(--space-md);
  line-height: 1;
`,xl=s.div`
  font-size: var(--font-size-lg);
  color: var(--dark-gray);
  font-weight: 600;
`,yl=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--space-md);
  max-width: 600px;
  width: 100%;
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`,bl=s(_.button)`
  background: white;
  border: 3px solid ${r=>r.isCorrect===!0?"var(--success)":r.isCorrect===!1?"var(--error)":"var(--light-gray)"};
  border-radius: var(--radius-medium);
  padding: var(--space-md);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  min-height: 120px;
  box-shadow: var(--shadow-light);
  position: relative;
  
  &:hover:not(:disabled) {
    border-color: var(--primary-orange);
    transform: translateY(-2px);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  &:focus {
    outline: 3px solid var(--primary-blue);
    outline-offset: 2px;
  }
`,wl=s.div`
  font-size: 2.5rem;
  line-height: 1;
`,jl=s.div`
  font-size: var(--font-size-sm);
  color: var(--dark-gray);
  font-weight: 500;
  text-align: center;
`,Sl=s(_.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  background: ${r=>r.isCorrect?"var(--success)":"var(--error)"};
  color: white;
  border-radius: var(--radius-round);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-medium);
`,Ro=s(_.button)`
  background: var(--primary-orange);
  color: white;
  border: none;
  padding: var(--space-md) var(--space-xl);
  border-radius: var(--radius-medium);
  cursor: pointer;
  font-size: var(--font-size-md);
  font-weight: 600;
  margin-top: var(--space-md);
  
  &:disabled {
    background: var(--medium-gray);
    cursor: not-allowed;
  }
`,Lo=[{phase:1,difficulty:"EASY",category:"animais-básicos",concept:"associação-direta",therapeuticFocus:"reconhecimento-visual",main:{emoji:"🐶",label:"Cachorro"},correct:{emoji:"🦴",label:"Osso"},explanation:"Cachorros adoram roer ossos!",options:[{emoji:"🦴",label:"Osso"},{emoji:"🐱",label:"Gato"},{emoji:"🌸",label:"Flor"},{emoji:"🚗",label:"Carro"}]},{phase:2,difficulty:"EASY",category:"natureza-básica",concept:"habitat-natural",therapeuticFocus:"relações-causais",main:{emoji:"🐟",label:"Peixe"},correct:{emoji:"💧",label:"Água"},explanation:"Peixes vivem na água!",options:[{emoji:"🔥",label:"Fogo"},{emoji:"💧",label:"Água"},{emoji:"🍕",label:"Pizza"},{emoji:"✈️",label:"Avião"}]},{phase:3,difficulty:"EASY",category:"alimentos-origem",concept:"origem-produto",therapeuticFocus:"conhecimento-cotidiano",main:{emoji:"🥛",label:"Leite"},correct:{emoji:"🐄",label:"Vaca"},explanation:"O leite vem da vaca!",options:[{emoji:"🐄",label:"Vaca"},{emoji:"🐧",label:"Pinguim"},{emoji:"🎈",label:"Balão"},{emoji:"🍎",label:"Maçã"}]},{phase:4,difficulty:"MEDIUM",category:"insetos-plantas",concept:"relação-simbiótica",therapeuticFocus:"compreensão-ecológica",main:{emoji:"🐝",label:"Abelha"},correct:{emoji:"🌸",label:"Flor"},explanation:"Abelhas coletam néctar das flores!",options:[{emoji:"🌸",label:"Flor"},{emoji:"🐟",label:"Peixe"},{emoji:"🏠",label:"Casa"},{emoji:"⚽",label:"Bola"}]},{phase:5,difficulty:"MEDIUM",category:"corpo-função",concept:"função-corporal",therapeuticFocus:"autocuidado",main:{emoji:"👁️",label:"Olho"},correct:{emoji:"👓",label:"Óculos"},explanation:"Óculos ajudam os olhos a enxergar melhor!",options:[{emoji:"👓",label:"Óculos"},{emoji:"🦷",label:"Dente"},{emoji:"🎧",label:"Fone"},{emoji:"🧠",label:"Cérebro"}]},{phase:6,difficulty:"MEDIUM",category:"profissões-ferramentas",concept:"profissão-instrumento",therapeuticFocus:"conhecimento-social",main:{emoji:"👨‍⚕️",label:"Médico"},correct:{emoji:"🩺",label:"Estetoscópio"},explanation:"Médicos usam estetoscópio para auscultar!",options:[{emoji:"🩺",label:"Estetoscópio"},{emoji:"🔨",label:"Martelo"},{emoji:"📚",label:"Livro"},{emoji:"🎨",label:"Pincel"}]},{phase:7,difficulty:"MEDIUM",category:"tempo-ação",concept:"atividade-temporal",therapeuticFocus:"rotina-diária",main:{emoji:"🌙",label:"Noite"},correct:{emoji:"😴",label:"Dormir"},explanation:"À noite é hora de dormir!",options:[{emoji:"😴",label:"Dormir"},{emoji:"🏃",label:"Correr"},{emoji:"🍽️",label:"Comer"},{emoji:"📖",label:"Estudar"}]},{phase:8,difficulty:"MEDIUM",category:"emoções-expressões",concept:"sentimento-expressão",therapeuticFocus:"inteligência-emocional",main:{emoji:"😢",label:"Tristeza"},correct:{emoji:"🤗",label:"Abraço"},explanation:"Um abraço pode consolar a tristeza!",options:[{emoji:"🤗",label:"Abraço"},{emoji:"🎉",label:"Festa"},{emoji:"⚽",label:"Futebol"},{emoji:"🍰",label:"Bolo"}]},{phase:9,difficulty:"MEDIUM",category:"causas-efeitos",concept:"causa-consequência",therapeuticFocus:"raciocínio-lógico",main:{emoji:"🌧️",label:"Chuva"},correct:{emoji:"☂️",label:"Guarda-chuva"},explanation:"Usamos guarda-chuva para nos proteger da chuva!",options:[{emoji:"☂️",label:"Guarda-chuva"},{emoji:"🕶️",label:"Óculos de sol"},{emoji:"🏖️",label:"Praia"},{emoji:"🔥",label:"Fogo"}]},{phase:10,difficulty:"HARD",category:"elementos-opostos",concept:"contraste-complementar",therapeuticFocus:"pensamento-abstrato",main:{emoji:"☀️",label:"Sol"},correct:{emoji:"🌙",label:"Lua"},explanation:"Sol e Lua são opostos que se complementam!",options:[{emoji:"🌙",label:"Lua"},{emoji:"⭐",label:"Estrela"},{emoji:"🌈",label:"Arco-íris"},{emoji:"☁️",label:"Nuvem"}]},{phase:11,difficulty:"HARD",category:"música-instrumentos",concept:"arte-ferramenta",therapeuticFocus:"criatividade-expressão",main:{emoji:"🎵",label:"Música"},correct:{emoji:"🎹",label:"Piano"},explanation:"Piano é um instrumento para fazer música!",options:[{emoji:"🎹",label:"Piano"},{emoji:"📱",label:"Celular"},{emoji:"🖥️",label:"Computador"},{emoji:"📺",label:"TV"}]},{phase:12,difficulty:"HARD",category:"símbolos-conceitos",concept:"símbolo-significado",therapeuticFocus:"pensamento-simbólico",main:{emoji:"💝",label:"Presente"},correct:{emoji:"❤️",label:"Amor"},explanation:"Presentes são uma forma de demonstrar amor!",options:[{emoji:"❤️",label:"Amor"},{emoji:"💰",label:"Dinheiro"},{emoji:"🎯",label:"Alvo"},{emoji:"⚖️",label:"Balança"}]},{phase:13,difficulty:"HARD",category:"processos-resultados",concept:"processo-produto",therapeuticFocus:"compreensão-sequencial",main:{emoji:"🌱",label:"Semente"},correct:{emoji:"🌳",label:"Árvore"},explanation:"Sementes crescem e se tornam árvores!",options:[{emoji:"🌳",label:"Árvore"},{emoji:"🍎",label:"Maçã"},{emoji:"🌸",label:"Flor"},{emoji:"🍃",label:"Folha"}]},{phase:14,difficulty:"HARD",category:"abstrações-metáforas",concept:"metáfora-visual",therapeuticFocus:"pensamento-metafórico",main:{emoji:"🧠",label:"Cérebro"},correct:{emoji:"💡",label:"Ideia"},explanation:"O cérebro é onde nascem as ideias!",options:[{emoji:"💡",label:"Ideia"},{emoji:"⚡",label:"Raio"},{emoji:"🔋",label:"Bateria"},{emoji:"🖥️",label:"Computador"}]},{phase:15,difficulty:"HARD",category:"ciclos-naturais",concept:"ciclo-renovação",therapeuticFocus:"compreensão-cíclica",main:{emoji:"🍂",label:"Folhas Secas"},correct:{emoji:"🌿",label:"Vida Nova"},explanation:"Folhas secas se decompõem e geram vida nova!",options:[{emoji:"🌿",label:"Vida Nova"},{emoji:"🗑️",label:"Lixo"},{emoji:"🔥",label:"Fogo"},{emoji:"❄️",label:"Gelo"}]}],Cl={EASY:["Muito bem! Você está aprendendo! 🌟","Excelente! Continue assim! 👏","Perfeito! Você entendeu! ✨"],MEDIUM:["Ótimo raciocínio! Você está evoluindo! 🧠","Incrível! Seu pensamento está se desenvolvendo! 🚀","Fantástico! Você está pensando como um especialista! 💪"],HARD:["Extraordinário! Pensamento avançado! 🎓","Brilhante! Você dominou conceitos complexos! 🌟","Excepcional! Raciocínio de alto nível! 🏆"]},Al={"animais-básicos":"Observe as características dos animais e o que eles usam.","natureza-básica":"Pense onde cada ser vivo prefere estar.","alimentos-origem":"Reflita sobre de onde vêm os alimentos que consumimos.","insetos-plantas":"Considere como os seres vivos ajudam uns aos outros.","corpo-função":"Pense em como cuidamos de nosso corpo.","profissões-ferramentas":"Observe que ferramentas cada profissional usa.","tempo-ação":"Relacione momentos do dia com atividades adequadas.","emoções-expressões":"Conecte sentimentos com formas de expressá-los.","causas-efeitos":"Analise o que causa cada situação.","elementos-opostos":"Busque elementos que se completam ou contrastam.","música-instrumentos":"Associe expressões artísticas com suas ferramentas.","símbolos-conceitos":"Interprete o significado mais profundo dos símbolos.","processos-resultados":"Visualize o resultado final de cada processo.","abstrações-metáforas":"Use sua imaginação para entender comparações.","ciclos-naturais":"Compreenda como a natureza se renova continuamente."},El=[{id:"EASY",name:"Fácil (3 opções)",options:3},{id:"MEDIUM",name:"Médio (4 opções)",options:4},{id:"HARD",name:"Difícil (5 opções)",options:5}];function kl({onBack:r}){const[a,t]=l.useState(null),[o,c]=l.useState(null),[i,d]=l.useState({}),[p,f]=l.useState(1),[h,m]=l.useState(!1),[u,n]=l.useState(null),[g,E]=l.useState(0),[w,U]=l.useState(null),[A,B]=l.useState(null),[S,L]=l.useState("EASY"),[j,k]=l.useState(0),[M,P]=l.useState(!1),[W,Q]=l.useState([]),[H,T]=l.useState(!1),[z,b]=l.useState(!1),{playSuccess:O,playError:D,playClick:Y}=br(),{userId:X}=lt(),{progress:G,incrementSuccesses:me,incrementAttempts:ne,resetProgress:pe,recordSuccess:ye,recordError:I,saveProgress:N,startActivity:J,pauseActivity:K,resumeActivity:ce,finishActivity:V,getCurrentTimeMetrics:oe,sessionId:ue,isActivityActive:q,isActivityPaused:v,getFormattedTime:F,resetSession:y,getEncouragementMessage:$}=wr("image-association"),R=()=>{Br()&&document.body.classList.add("high-contrast"),vr()&&document.body.classList.add("reduced-motion")};l.useEffect(()=>{R()},[]);const ee=async()=>{await J(),b(!0);const x=Fr("image-association",X);U(x);const C=gr("image-association",S);B(C),C&&C.difficulty!==S&&L(C.difficulty),f(1),c(null),d({}),m(!1),n(Date.now()),E(0),k(0),P(!1),Q([]),T(!1),pe(),be()},fe=()=>Lo.find(x=>x.phase===p)||Lo[0],be=()=>{if(p<=15){const x=fe();if(!x){console.error(`Associação não encontrada para a fase ${p}`);return}const C=[...x.options].sort(()=>Math.random()-.5);t({...x,options:C}),c(null),d({}),m(!1),T(!1),n(Date.now()),E(0),te(`Fase ${p}: ${x.therapeuticFocus}. ${Al[x.category]}`)}else P(!0),t(null)},We=(x,C)=>{if(o!==null)return;c(C),E(le=>le+1),Y();const se=Math.floor((Date.now()-u)/1e3),Z=x.emoji===a.correct.emoji;if(Z){d({[C]:!0});const le=j+1;k(le);const ve=10,Se=a.difficulty==="EASY"?0:a.difficulty==="MEDIUM"?5:10,Ee=Math.max(0,20-se),ke=Math.min(le*2,10),ze=ve+Se+Ee+ke;me(),ne(),ye(),O(),Je();const ie=Cl[a.difficulty],ge=ie[Math.floor(Math.random()*ie.length)],Ae={phase:p,category:a.category,concept:a.concept,therapeuticFocus:a.therapeuticFocus,timeSpent:se,difficulty:a.difficulty,score:ze};if(Q(Te=>[...Te,Ae]),setTimeout(()=>{T(!0)},1e3),w){const Te={phase:p,difficulty:a.difficulty,timeSpent:se,moveCount:g,accuracy:100,score:ze,category:a.category,therapeuticFocus:a.therapeuticFocus,consecutiveCorrect:le},xe=w.saveGameData(Te);xe&&xe!==S&&L(xe)}te(`${ge} ${a.explanation}`),setTimeout(()=>{const Te=p+1;if(Te<=15){if(f(Te),be(),Te%3===1&&w){const xe=gr("image-association",S);xe&&xe.difficulty!==S&&L(xe.difficulty)}}else{if(P(!0),t(null),w){const xe={completedPhases:15,totalScore:G.score,accuracy:G.accuracy,finalDifficulty:S,therapeuticInsights:W.length};w.saveGameData(xe)}te(`Parabéns! Você completou todas as 15 fases do jogo de associação com ${Math.round(G.accuracy||0)}% de precisão!`),setTimeout(()=>{V(),b(!1),pe()},2e3)}N()},3e3)}else{if(d({[C]:!1}),k(0),ne(),I(),D(),Hr(),setTimeout(()=>{const le=a.options.findIndex(ve=>ve.emoji===a.correct.emoji);d(ve=>({...ve,[le]:!0})),setTimeout(()=>{T(!0)},1e3)},1e3),w){const le={phase:p,difficulty:a.difficulty,timeSpent:se,moveCount:g,accuracy:0,score:0,category:a.category,error:!0};w.saveGameData(le)}te(`Não é essa. ${a.explanation}`),setTimeout(()=>{m(!0)},3e3)}Z||N()},Gr=()=>{const x=p+1;if(x<=15){if(f(x),be(),x%3===1&&w){const C=gr("image-association",S);C&&C.difficulty!==S&&L(C.difficulty)}}else{if(P(!0),t(null),w){const C={completedPhases:15,totalScore:G.score,accuracy:G.accuracy,finalDifficulty:S,therapeuticInsights:W.length};w.saveGameData(C)}te(`Parabéns! Você completou todas as 15 fases do jogo de associação com ${Math.round(G.accuracy||0)}% de precisão!`),setTimeout(()=>{V(),b(!1),pe()},2e3)}N()},qr=()=>{if(f(1),k(0),P(!1),Q([]),pe(),b(!1),w){const x=gr("image-association","EASY");x&&x.difficulty&&L(x.difficulty)}te("Pronto para nova partida! Escolha a dificuldade para começar.")};return M?e.jsxs(Ve,{children:[e.jsx(He,{children:e.jsx(_e,{onClick:r,whileHover:{scale:1.05},whileTap:{scale:.95},children:"⬅️ Voltar"})}),e.jsxs(Ue,{children:[e.jsxs(Be,{children:[e.jsx("span",{children:"🧩"}),e.jsx("span",{children:"Associação de Imagens"})]}),e.jsx(Ye,{children:"Jornada completa!"})]}),e.jsxs(_.div,{initial:{opacity:0,scale:.8},animate:{opacity:1,scale:1},style:{textAlign:"center",padding:"var(--space-xl)",background:"linear-gradient(135deg, var(--success), var(--primary-green))",color:"white",borderRadius:"var(--radius-large)",margin:"var(--space-lg) 0"},children:[e.jsx("h3",{style:{fontSize:"var(--font-size-xl)",marginBottom:"var(--space-md)"},children:"🎉 Parabéns! Jornada Completa! 🎉"}),"          ",e.jsx("p",{style:{fontSize:"var(--font-size-lg)",marginBottom:"var(--space-md)"},children:"Você completou todas as 15 fases!"}),e.jsxs("p",{style:{marginBottom:"var(--space-md)"},children:["⭐ Estrelas ganhas: ",G.stars,"/3"]}),"          ",e.jsxs("p",{style:{marginBottom:"var(--space-md)"},children:["🎯 Precisão: ",Math.round(G.successes/G.attempts*100)||0,"%"]}),e.jsx("p",{style:{marginTop:"16px",fontSize:"1.1em",marginBottom:"var(--space-md)"},children:$()}),e.jsxs("p",{style:{fontSize:"var(--font-size-md)",marginBottom:"var(--space-lg)"},children:[e.jsx("strong",{children:"Sua pontuação final:"})," ",G.score," pontos",e.jsx("br",{}),e.jsx("strong",{children:"Precisão:"})," ",Math.round(G.accuracy||0),"%",e.jsx("br",{}),e.jsx("strong",{children:"Insights terapêuticos coletados:"})," ",W.length]}),e.jsxs("div",{style:{background:"rgba(255, 255, 255, 0.2)",padding:"var(--space-md)",borderRadius:"var(--radius-medium)",marginBottom:"var(--space-lg)"},children:[e.jsx("h4",{children:"🌟 Habilidades Desenvolvidas:"}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"8px",justifyContent:"center"},children:[...new Set(W.map(x=>x.therapeuticFocus))].map(x=>e.jsx("span",{style:{background:"rgba(255, 255, 255, 0.9)",color:"var(--primary-blue)",padding:"4px 8px",borderRadius:"12px",fontSize:"12px",fontWeight:"500"},children:x.replace("-"," ")},x))})]}),e.jsx(Ro,{onClick:qr,whileHover:{scale:1.05},whileTap:{scale:.95},children:"🔄 Jogar Novamente"}),"        "]})]}):z?z&&!a?(console.log("Aguardando associação ser definida:",{currentPhase:p,gameStarted:z}),p<=15&&be(),e.jsxs(Ve,{children:[e.jsx(He,{children:e.jsx(_e,{onClick:r,whileHover:{scale:1.05},whileTap:{scale:.95},children:"⬅️ Voltar"})}),e.jsx(Ue,{children:e.jsxs(Be,{children:[e.jsx("span",{children:"🧩"}),e.jsx("span",{children:"Carregando fase..."})]})})]})):e.jsxs(Ve,{children:[e.jsx(He,{children:e.jsx(_e,{onClick:r,whileHover:{scale:1.05},whileTap:{scale:.95},children:"⬅️ Voltar"})}),e.jsxs(Ue,{children:[e.jsxs(Be,{children:[e.jsx("span",{children:"🧩"}),e.jsx("span",{children:"Associação de Imagens"})]}),e.jsxs(Ye,{children:["Fase ",p,"/15 - ",G.score," pontos"]})]}),e.jsx(Oo,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},children:z?"O que combina com isso?":"🧩 Encontre as associações corretas entre imagens e conceitos! Escolha a dificuldade para começar."}),e.jsx(_r,{timeMetrics:q?oe():null,onStart:J,onPause:K,onResume:ce,onFinish:V,showControls:!1,compact:!1,invisible:!0}),z&&e.jsxs(hl,{children:[e.jsxs(fl,{initial:{opacity:0,scale:.8},animate:{opacity:1,scale:1},transition:{duration:.5},children:[e.jsx(vl,{children:a.main.emoji}),e.jsx(xl,{children:a.main.label})]},a.main.emoji),e.jsxs(yl,{children:[a.options.map((x,C)=>e.jsxs(bl,{onClick:()=>We(x,C),disabled:o!==null,isCorrect:i[C],whileHover:o===null?{scale:1.05}:{},whileTap:o===null?{scale:.95}:{},initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:C*.1+.5},children:[e.jsx(wl,{children:x.emoji}),e.jsx(jl,{children:x.label}),e.jsx(Ne,{children:i[C]!==void 0&&e.jsx(Sl,{isCorrect:i[C],initial:{scale:0},animate:{scale:1},exit:{scale:0},children:i[C]?"✓":"✗"})})]},`${x.emoji}-${C}`)),"        "]}),e.jsx(Ne,{children:h&&e.jsx(Ro,{onClick:Gr,initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:20},whileHover:{scale:1.05},whileTap:{scale:.95},children:p<15?"Próxima ➡️":"Finalizar 🎉"})}),e.jsx("div",{style:{textAlign:"center",color:"var(--medium-gray)",marginTop:"var(--space-md)"},children:e.jsx("p",{children:"💡 Dica: Clique no item que tem relação com a imagem principal!"})})]})]}):e.jsxs(Ve,{children:[e.jsx(He,{children:e.jsx(_e,{onClick:r,whileHover:{scale:1.05},whileTap:{scale:.95},children:"⬅️ Voltar"})}),e.jsxs(Ue,{children:[e.jsxs(Be,{children:[e.jsx("span",{children:"🧩"}),e.jsx("span",{children:"Associação de Imagens"})]}),e.jsx(Ye,{children:"Encontre as associações corretas entre imagens e conceitos"})]}),e.jsx(Oo,{children:"🧩 Encontre as associações corretas entre imagens e conceitos! Escolha a dificuldade para começar."}),e.jsx(jr,{children:El.map(x=>e.jsx(Sr,{isActive:S===x.id,onClick:()=>L(x.id),whileHover:{scale:1.05},whileTap:{scale:.95},themeColor:Io,children:x.name},x.id))}),e.jsx(ir,{children:e.jsx(Ce,{onClick:ee,whileHover:{scale:1.05},whileTap:{scale:.95},themeColor:Io,children:"🧩 Começar Jogo"})})]})}const No="var(--primary-purple)",Tl="linear-gradient(135deg, var(--primary-purple), var(--primary-blue))",St=s(nr)`
  background: ${Tl};
`,Pl=s.div`
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
  margin: var(--space-lg) 0;
  min-height: 80px;
  align-items: center;
`,zl=s(_.div)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${r=>r.isActive?"var(--primary-orange)":"var(--light-gray)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  box-shadow: var(--shadow-medium);
  border: 3px solid ${r=>r.isActive?"var(--primary-orange)":"transparent"};
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
`,Ml=s.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
  width: 100%;
  max-width: 400px;
  
  @media (max-width: 768px) {
    gap: var(--space-sm);
  }
`,dt=s(_.button)`
  padding: var(--space-lg);
  border: none;
  border-radius: var(--radius-large);
  font-size: var(--font-size-xl);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-medium);
  min-height: 100px;
  
  &:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: var(--space-md);
    font-size: var(--font-size-lg);
    min-height: 80px;
  }
`,Dl=s(dt)`
  background: linear-gradient(135deg, var(--primary-pink), var(--primary-orange));
  color: white;
  box-shadow: 0 4px 8px rgba(233, 30, 99, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: var(--shadow-large);
    background: linear-gradient(135deg, #F43F5E, #FB923C);
  }
  
  &:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(233, 30, 99, 0.4);
  }
`,$l=s(dt)`
  background: linear-gradient(135deg, var(--primary-green), var(--primary-cyan));
  color: white;
  box-shadow: 0 4px 8px rgba(126, 211, 33, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: var(--shadow-large);
    background: linear-gradient(135deg, #84CC16, #06B6D4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(126, 211, 33, 0.4);
  }
`,Il=s(dt)`
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-cyan));
  color: white;
  box-shadow: 0 4px 8px rgba(74, 144, 226, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: var(--shadow-large);
    background: linear-gradient(135deg, #3B82F6, #06B6D4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(74, 144, 226, 0.4);
  }
`,Ol=s(dt)`
  background: linear-gradient(135deg, var(--primary-orange), #FFD700);
  color: white;
  box-shadow: 0 4px 8px rgba(245, 166, 35, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: var(--shadow-large);
    background: linear-gradient(135deg, #FB923C, #FFC107);
  }
  
  &:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(245, 166, 35, 0.4);
  }
`,Rl=s.div`
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`,Ll=s(_.div)`
  padding: var(--space-md);
  border-radius: var(--radius-medium);
  text-align: center;
  font-weight: 600;
  font-size: var(--font-size-md);
  
  &.success {
    background: var(--success-light);
    color: var(--success-dark);
    border: 2px solid var(--primary-green);
  }
  
  &.error {
    background: var(--error-light);
    color: var(--error-dark);
    border: 2px solid var(--primary-red);
  }
`,Nl=s.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--font-size-md);
  color: var(--primary-blue);
  font-weight: 600;
`,Fl=s.div`
  display: flex;
  gap: var(--space-xs);
  padding: var(--space-sm);
  background: rgba(255, 255, 255, 0.8);
  border-radius: var(--radius-medium);
  margin: var(--space-sm) 0;
  justify-content: center;
  min-height: 40px;
  align-items: center;
`,Ul=s.div.attrs(r=>({"data-completed":r.$isCompleted,"data-current":r.$isCurrent}))`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${r=>r.$isCompleted?"var(--primary-green)":r.$isCurrent?"var(--primary-orange)":"var(--light-gray)"};
  transition: all var(--transition-normal);
  
  ${r=>r.$isCurrent&&`
    transform: scale(1.2);
    box-shadow: 0 0 8px var(--primary-orange);
  `}
`,Bl=s.div`
  display: flex;
  gap: var(--space-xs);
  font-size: var(--font-size-xl);
`,Kr=[{id:"do",name:"Dó",emoji:"🔴",frequency:261.63,waveType:"sine"},{id:"re",name:"Ré",emoji:"🟢",frequency:293.66,waveType:"sine"},{id:"mi",name:"Mi",emoji:"🔵",frequency:329.63,waveType:"sine"},{id:"fa",name:"Fá",emoji:"🟡",frequency:349.23,waveType:"sine"}];function Hl({onBack:r}){const[a,t]=l.useState([]),[o,c]=l.useState([]),[i,d]=l.useState(!1),[p,f]=l.useState(!1),[h,m]=l.useState(!1),[u,n]=l.useState(1),[g,E]=l.useState(null),[w,U]=l.useState(null),[A,B]=l.useState(0),{playSound:S,playSuccess:L,playError:j,playClick:k}=br(),{recordPerformance:M}=xr(),{progress:P,incrementAttempts:W,recordSuccess:Q,recordError:H,resetProgress:T,resetSession:z,saveProgress:b,startActivity:O,pauseActivity:D,resumeActivity:Y,finishActivity:X,getCurrentTimeMetrics:G,sessionId:me,isActivityActive:ne,isActivityPaused:pe,getFormattedTime:ye}=wr("musical-sequence"),I=(q=u+1)=>{const v=[];let F=-1;for(let y=0;y<q;y++){let $;do $=Math.floor(Math.random()*Kr.length);while($===F&&Kr.length>1);F=$;const R=Kr[$];v.push(R.id)}return v},N=async q=>{U(q);const v=Kr.find(F=>F.id===q);if(!v){console.warn(`Nota não encontrada: ${q}`),U(null);return}try{if(q==="success"){L(),setTimeout(()=>U(null),500);return}else if(q==="error"){j(),setTimeout(()=>U(null),500);return}const F=window.AudioContext||window.webkitAudioContext;if(!F){console.warn("Web Audio API não suportada"),setTimeout(()=>U(null),500),te(`Nota ${v.name} selecionada`);return}const y=new F;y.state==="suspended"&&await y.resume();const $=y.createOscillator(),R=y.createGain(),ee=y.createBiquadFilter();$.connect(ee),ee.connect(R),R.connect(y.destination),$.frequency.setValueAtTime(v.frequency,y.currentTime),$.type="sine",ee.type="lowpass",ee.frequency.setValueAtTime(2e3,y.currentTime),ee.Q.setValueAtTime(.5,y.currentTime);const fe=y.currentTime;R.gain.setValueAtTime(0,fe),R.gain.linearRampToValueAtTime(.15,fe+.02),R.gain.setValueAtTime(.15,fe+.1),R.gain.exponentialRampToValueAtTime(.001,fe+.5),$.start(fe),$.stop(fe+.5),setTimeout(()=>{try{$&&$.disconnect&&$.disconnect(),ee&&ee.disconnect&&ee.disconnect(),R&&R.disconnect&&R.disconnect(),y&&y.state!=="closed"&&y.close().catch(be=>console.warn("Erro ao fechar AudioContext:",be.message))}catch(be){console.warn("Aviso na limpeza do AudioContext:",be.message)}U(null)},600)}catch(F){console.error("Erro ao reproduzir áudio para",v.name,":",F),setTimeout(()=>{U(null)},300)}te(`Nota ${v.name} reproduzida`)},J=async()=>{d(!0),f(!1);for(let q=0;q<a.length;q++)await new Promise(v=>setTimeout(v,200)),await N(a[q]),await new Promise(v=>setTimeout(v,600));d(!1),f(!0),te("Agora é sua vez! Repita a sequência que você ouviu.")},K=async()=>{await O(),z(),n(1),B(0),c([]),m(!0),E(null),f(!1),d(!1);const q=I(2);t(q),te("Novo jogo iniciado! Escute a sequência musical.")},ce=()=>{n(1),c([]),E(null),f(!1),d(!1);const q=I(2);t(q),te("Jogo reiniciado! Escute a nova sequência.")},V=()=>{Br()&&document.body.classList.add("high-contrast"),vr()&&document.body.classList.add("reduced-motion")};l.useEffect(()=>{V()},[]);const oe=(q,v)=>{const y=q*5,$=v*5;return 10+y+$},ue=q=>{if(!p||i)return;N(q);const v=[...o,q];c(v);const F=v.length-1;if(!(a[F]===q)){H(),W(),Hr(),j(),B(0),E({type:"error",message:"Ops! Tente novamente."});const $={correct:0,incorrect:1,responseTimes:[500],level:u,sequenceLength:a.length,errorType:"wrong_note",notePosition:F};M("musical-sequence",$),setTimeout(()=>{c([]),E(null),J()},2e3);return}if(v.length===a.length){const $=oe(u,a.length)-10;Q($),Je(),L();const R=A+1;B(R);const ee={correct:1,incorrect:0,responseTimes:[500],level:u,sequenceLength:a.length,consecutiveSuccesses:R,score:$+10,timestamp:new Date().toISOString(),activityType:"musical-sequence"};M("musical-sequence",ee);let fe=`Parabéns! Você ganhou ${$+10} pontos!`;R>=3&&(fe+=" Dificuldade aumentada!"),E({type:"success",message:fe}),setTimeout(()=>{let be=u+1;R>=3&&(be+=1,B(0)),n(be),c([]),E(null);const We=I(Math.min(be+1,6));t(We),te(`Nível ${be}! Escute a nova sequência.`)},2e3)}};return l.useEffect(()=>{if(a.length>0&&h){const q=setTimeout(()=>{J()},1e3);return()=>clearTimeout(q)}},[a,h]),e.jsxs(Ve,{children:[e.jsx(He,{children:e.jsx(_e,{onClick:r,whileHover:{scale:1.05},whileTap:{scale:.95},children:"⬅️ Voltar"})}),e.jsxs(Ue,{children:[e.jsxs(Be,{children:[e.jsx("span",{children:"🎵"}),e.jsx("span",{children:"Sequência Musical"})]}),e.jsx(Ye,{children:"Desenvolva sua memória auditiva e senso musical"})]}),"      ",e.jsx(_r,{timeMetrics:ne?G():null,onStart:O,onPause:D,onResume:Y,onFinish:X,showControls:!1,compact:!1,invisible:!0}),h&&i&&e.jsx(St,{children:"🎧 Escute com atenção..."}),h&&p&&e.jsx(St,{children:"🎹 Sua vez! Repita a sequência"}),h&&e.jsxs(Nl,{children:[e.jsxs("span",{children:["Nível: ",u]}),e.jsx("span",{children:"•"}),e.jsxs("span",{children:["Pontos: ",P.score]}),e.jsx("span",{children:"•"}),e.jsx(Bl,{children:Array.from({length:3},(q,v)=>e.jsx("span",{children:v<P.stars?"⭐":"☆"},v))})]}),e.jsx(Pl,{children:e.jsx(Ne,{children:a.map((q,v)=>{const F=Kr.find($=>$.id===q),y=w===q;return e.jsx(zl,{isActive:y,initial:{scale:0,opacity:0},animate:{scale:y?1.2:1,opacity:1},exit:{scale:0,opacity:0},transition:{duration:.3},children:F.emoji},`${q}-${v}`)})})}),h&&p&&e.jsx(Fl,{children:a.map((q,v)=>e.jsx(Ul,{$isCompleted:v<o.length,$isCurrent:v===o.length},v))}),"      ",h?e.jsxs(e.Fragment,{children:[e.jsxs(Ml,{children:["            ",e.jsxs(Dl,{onClick:()=>ue("do"),disabled:!p,whileHover:p?{scale:1.05}:{},whileTap:p?{scale:.95}:{},animate:w==="do"?{scale:[1,1.1,1],boxShadow:["0 4px 8px rgba(233, 30, 99, 0.3)","0 8px 16px rgba(233, 30, 99, 0.6)","0 4px 8px rgba(233, 30, 99, 0.3)"]}:{},transition:{duration:.3},children:[e.jsx("span",{children:"🔴"}),e.jsx("span",{children:"Dó"})]}),e.jsxs($l,{onClick:()=>ue("re"),disabled:!p,whileHover:p?{scale:1.05}:{},whileTap:p?{scale:.95}:{},animate:w==="re"?{scale:[1,1.1,1],boxShadow:["0 4px 8px rgba(126, 211, 33, 0.3)","0 8px 16px rgba(126, 211, 33, 0.6)","0 4px 8px rgba(126, 211, 33, 0.3)"]}:{},transition:{duration:.3},children:[e.jsx("span",{children:"🟢"}),e.jsx("span",{children:"Ré"})]}),e.jsxs(Il,{onClick:()=>ue("mi"),disabled:!p,whileHover:p?{scale:1.05}:{},whileTap:p?{scale:.95}:{},animate:w==="mi"?{scale:[1,1.1,1],boxShadow:["0 4px 8px rgba(74, 144, 226, 0.3)","0 8px 16px rgba(74, 144, 226, 0.6)","0 4px 8px rgba(74, 144, 226, 0.3)"]}:{},transition:{duration:.3},children:[e.jsx("span",{children:"🔵"}),e.jsx("span",{children:"Mi"})]}),e.jsxs(Ol,{onClick:()=>ue("fa"),disabled:!p,whileHover:p?{scale:1.05}:{},whileTap:p?{scale:.95}:{},animate:w==="fa"?{scale:[1,1.1,1],boxShadow:["0 4px 8px rgba(245, 166, 35, 0.3)","0 8px 16px rgba(245, 166, 35, 0.6)","0 4px 8px rgba(245, 166, 35, 0.3)"]}:{},transition:{duration:.3},children:[e.jsx("span",{children:"🟡"}),e.jsx("span",{children:"Fá"})]})]}),"          ",e.jsxs(Rl,{children:[e.jsx(Ce,{onClick:J,disabled:i||!h,whileHover:{scale:1.05},whileTap:{scale:.95},children:"🔄 Ouvir Novamente"}),e.jsx(Ce,{className:"restart",onClick:ce,disabled:i,whileHover:{scale:1.05},whileTap:{scale:.95},children:"🎮 Reiniciar Jogo"})]})]}):e.jsxs(e.Fragment,{children:[e.jsxs(St,{children:["🎵 Escute a sequência musical e repita tocando as notas na ordem correta!",e.jsx("br",{}),"Escolha a dificuldade para começar."]}),e.jsx(jr,{children:[{id:"EASY",name:"Fácil (2 notas)"},{id:"MEDIUM",name:"Médio (3 notas)"},{id:"HARD",name:"Difícil (4 notas)"}].map(q=>e.jsx(Sr,{isActive:u===(q.id==="EASY"?1:q.id==="MEDIUM"?3:5),onClick:()=>n(q.id==="EASY"?1:q.id==="MEDIUM"?3:5),whileHover:{scale:1.05},whileTap:{scale:.95},themeColor:No,children:q.name},q.id))}),e.jsx(ir,{children:e.jsx(Ce,{onClick:K,whileHover:{scale:1.05},whileTap:{scale:.95},themeColor:No,children:"🎵 Começar Jogo Musical"})})]}),"      ",e.jsx(Ne,{children:g&&e.jsx(Ll,{className:g.type,initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{duration:.3},children:g.message})})]})}const Fo="var(--primary-green)",_l="linear-gradient(135deg, var(--primary-green), var(--primary-blue))",Gl=s(nr)`
  background: ${_l};
`;s.div`
  display: flex;
  gap: var(--space-lg);
  flex-wrap: wrap;
  justify-content: center;
  margin: var(--space-lg) 0;
`;s.div`
  text-align: center;
`;s.div`
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--primary-green);
`;s.div`
  font-size: var(--font-size-sm);
  color: var(--medium-gray);
`;const ql=s(_.div)`
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-purple));
  color: white;
  width: 150px;
  height: 150px;
  border-radius: var(--radius-large);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: bold;
  box-shadow: var(--shadow-large);
  margin: var(--space-lg) 0;
  
  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
    font-size: 3rem;
  }
`,Vl=s.div`
  font-size: 0.8rem;
  margin-top: var(--space-xs);
  opacity: 0.9;
  text-align: center;
`,Yl=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-md);
  width: 100%;
  max-width: 600px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-sm);
  }
`,Jl=s(_.button)`
  background: white;
  border: 3px solid var(--light-gray);
  border-radius: var(--radius-medium);
  padding: var(--space-lg);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-medium);
  min-height: 120px;
  
  &:hover {
    border-color: var(--primary-green);
    transform: translateY(-3px);
    box-shadow: var(--shadow-large);
  }
  
  &:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 2px;
  }
  
  &.correct {
    background: var(--success-light);
    border-color: var(--primary-green);
    color: var(--success-dark);
  }
  
  &.incorrect {
    background: var(--error-light);
    border-color: var(--primary-red);
    color: var(--error-dark);
  }
  
  @media (max-width: 768px) {
    padding: var(--space-md);
    min-height: 100px;
  }
`,Wl=s.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-blue);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`,Kl=s.div`
  font-size: var(--font-size-sm);
  color: var(--medium-gray);
  text-align: center;
  font-weight: 500;
`,Xl=s.div`
  font-size: 1.5rem;
  font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
  line-height: 1;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`,Ql=s(_.div)`
  padding: var(--space-md);
  border-radius: var(--radius-medium);
  text-align: center;
  font-weight: 600;
  font-size: var(--font-size-md);
  
  &.success {
    background: var(--success-light);
    color: var(--success-dark);
    border: 2px solid var(--primary-green);
  }
  
  &.error {
    background: var(--error-light);
    color: var(--error-dark);
    border: 2px solid var(--primary-red);
  }
`,Zl=s.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--font-size-md);
  color: var(--primary-blue);
  font-weight: 600;
  flex-wrap: wrap;
  justify-content: center;
`,ed=s.div`
  display: flex;
  gap: var(--space-xs);
  font-size: var(--font-size-xl);
`,Le={A:{words:["AVIÃO","ÁRVORE","ABELHA","ÁGUA","AMIGO","ARCO-ÍRIS"],emojis:["✈️","🌳","🐝","💧","👫","🌈"]},B:{words:["BOLA","BANANA","BORBOLETA","BEBÊ","BICICLETA","BALÃO"],emojis:["⚽","🍌","🦋","👶","🚲","🎈"]},C:{words:["CASA","CACHORRO","CORAÇÃO","CARRO","COROA","CHOCOLATE"],emojis:["🏠","🐕","❤️","🚗","👑","🍫"]},D:{words:["DADO","DINOSSAURO","DOCE","DENTE","DRAGÃO","DIAMANTE"],emojis:["🎲","🦕","🍭","🦷","🐉","💎"]},E:{words:["ELEFANTE","ESTRELA","ESCADA","ESPELHO","ESCOLA","ENVELOPE"],emojis:["🐘","⭐","🪜","🪞","🏫","✉️"]},F:{words:["FLOR","FOGO","FESTA","FACA","FUTEBOL","FANTASMA"],emojis:["🌸","🔥","🎉","🔪","⚽","👻"]},G:{words:["GATO","GUITARRA","GIRASSOL","GALINHA","GELADO","GLOBO"],emojis:["🐱","🎸","🌻","🐔","🧊","🌍"]},H:{words:["HIPOPÓTAMO","HAMBÚRGUER","HELICÓPTERO","HOSPITAL","HORAS","HARPA"],emojis:["🦛","🍔","🚁","🏥","⏰","🎵"]},I:{words:["IGREJA","ILHA","ÍNDIO","ÍMÃE","IGUANA","INVERNO"],emojis:["⛪","🏝️","🪶","🧲","🦎","❄️"]},J:{words:["JACARÉ","JOANINHA","JARDIM","JARRO","JOIA","JANELA"],emojis:["🐊","🐞","🌺","🏺","💍","🪟"]},K:{words:["KIWI","KARATÊ","KOALA"],emojis:["🥝","🥋","🐨"]},L:{words:["LEÃO","LUA","LIVRO","LÂMPADA","LAGARTA","LIMÃO"],emojis:["🦁","🌙","📚","💡","🐛","🍋"]},M:{words:["MACACO","MAÇÃ","MÚSICA","MÃOE","MEDALHA","MONSTRO"],emojis:["🐵","🍎","🎵","🤲","🏅","👹"]},N:{words:["NAVIO","NUVEM","NATUREZA","NINHO","NARIZ","NOTEBOOK"],emojis:["🚢","☁️","🌿","🪺","👃","💻"]},O:{words:["OLHO","OVO","OVELHA","ÓCULOS","OURO","ONDA"],emojis:["👁️","🥚","🐑","👓","🏆","🌊"]},P:{words:["PATO","PIZZA","PRESENTE","PALHAÇO","PLANETA","PEIXE"],emojis:["🦆","🍕","🎁","🤡","🪐","🐟"]},Q:{words:["QUEIJO","QUENTE","QUADRADO"],emojis:["🧀","🔥","⬜"]},R:{words:["RATO","ROSA","RELÓGIO","ROBÔ","RAINHA","RAIO"],emojis:["🐭","🌹","⏰","🤖","👸","⚡"]},S:{words:["SOL","SAPATO","SORRISO","SAPO","SERPENTE","SINO"],emojis:["☀️","👟","😊","🐸","🐍","🔔"]},T:{words:["TIGRE","TARTARUGA","TELEFONE","TESOURA","TREM","TOMATE"],emojis:["🐅","🐢","📞","✂️","🚂","🍅"]},U:{words:["UVA","URSO","UNICÓRNIO"],emojis:["🍇","🐻","🦄"]},V:{words:["VACA","VIOLÃO","VENTILADOR","VULCÃO","VELA","VAMPIRO"],emojis:["🐄","🎻","💨","🌋","🕯️","🧛"]},W:{words:["WIFI","WEB"],emojis:["📶","🌐"]},X:{words:["XÍCARA","XADREZ"],emojis:["☕","♟️"]},Y:{words:["YOGA","YETI"],emojis:["🧘","🦣"]},Z:{words:["ZEBRA","ZERO","ZANGADO","ZÍPER","ZUMBI"],emojis:["🦓","0️⃣","😠","🤐","🧟"]}},zr=[{id:"EASY",name:"Fácil",letters:["A","E","I","O","U"]},{id:"MEDIUM",name:"Médio",letters:["A","B","C","D","E","F","G","H","I","J","L","M","N","O","P","R","S","T"]},{id:"HARD",name:"Difícil",letters:Object.keys(Le)}],rd=()=>{const r=new Set(Object.keys(Le));for(const a of zr)a.letters.filter(o=>!r.has(o)).length>0&&(a.letters=a.letters.filter(o=>r.has(o)));for(const a of r){const t=Le[a];(!t.words||t.words.length===0)&&console.error(`Letra ${a} não possui palavras definidas`),(!t.emojis||t.emojis.length===0)&&(t.emojis=["📝","📝","📝"].slice(0,t.words?.length||1)),t.emojis?.length<t.words?.length&&(t.emojis=[...t.emojis,...Array(t.words.length-t.emojis.length).fill("📝")])}};rd();const Uo=["Muito bem! Você conhece suas letras! 📚","Excelente! Continue lendo! 🌟","Perfeito! Você está aprendendo muito! ✨","Fantástico! Suas habilidades de leitura são ótimas! 🎓","Incrível! Continue praticando! 💪"];function ad({onBack:r}){const[a,t]=l.useState(null),[o,c]=l.useState([]),[i,d]=l.useState(!1),[p,f]=l.useState("EASY"),[h,m]=l.useState(null),[u,n]=l.useState(null),[g,E]=l.useState("word"),[w,U]=l.useState(null),[A,B]=l.useState(0),[S,L]=l.useState(null),[j,k]=l.useState(null),[M,P]=l.useState(new Set),[W,Q]=l.useState([]),[H,T]=l.useState(0),{playSound:z,playSuccess:b,playError:O}=br(),{progress:D,saveProgress:Y,incrementAttempts:X,incrementSuccesses:G,completeActivity:me,updateScore:ne,updateLevel:pe,recordSuccess:ye,recordError:I,resetProgress:N,startActivity:J,pauseActivity:K,resumeActivity:ce,finishActivity:V,getCurrentTimeMetrics:oe,sessionId:ue,isActivityActive:q,isActivityPaused:v,getFormattedTime:F}=wr("letter-recognition"),{userId:y}=lt(),$=()=>{Br()&&document.body.classList.add("high-contrast"),vr()&&document.body.classList.add("reduced-motion")};l.useEffect(()=>{$(),(async()=>{try{const C=Fr("letter-recognition",y);L(C);let se;try{se=await gr("letter-recognition",p)}catch(Z){console.warn("Falha ao obter parâmetros adaptativos, usando padrões:",Z),se={difficulty:p,parameters:{focusLetters:zr.find(le=>le.id===p)?.letters||[]}}}k(se),se&&se.difficulty!==p&&f(se.difficulty)}catch(C){console.error("Erro ao inicializar modelo adaptativo:",C)}})()},[p]);const R=x=>{if(!x){console.warn("Tentativa de falar letra nula ou indefinida");return}try{if("speechSynthesis"in window){speechSynthesis.cancel();const C=new SpeechSynthesisUtterance(x);C.lang="pt-BR",C.rate=.8,C.pitch=1.2,C.onerror=se=>{console.error("Erro na síntese de voz para letra:",se)},speechSynthesis.speak(C)}te(`Letra ${x}`)}catch(C){console.error("Erro ao sintetizar voz da letra:",C)}},ee=x=>{if(!x){console.warn("Tentativa de falar palavra nula ou indefinida");return}try{if("speechSynthesis"in window){speechSynthesis.cancel();const C=new SpeechSynthesisUtterance(x);C.lang="pt-BR",C.rate=.7,C.pitch=1.1,C.onerror=se=>{console.error("Erro na síntese de voz para palavra:",se)},speechSynthesis.speak(C)}te(`Palavra ${x}`)}catch(C){console.error("Erro ao sintetizar voz da palavra:",C)}},fe=()=>{try{const C=zr.find(ie=>ie.id===p);if(!C||!C.letters||C.letters.length===0){console.warn(`Dificuldade "${p}" não encontrada, usando "EASY" como fallback`),f("EASY");const ie=zr.find(ge=>ge.id==="EASY");if(!ie){console.error('Falha crítica: dificuldade "EASY" não encontrada');return}var x=ie.letters}else var x=C.letters;if(x=x.filter(ie=>Le[ie]&&Le[ie].words&&Le[ie].words.length>0),x.length===0&&(console.error("Nenhuma letra válida encontrada para a dificuldade"),x=["A","B","C"].filter(ie=>Le[ie])),j?.parameters?.focusLetters){const ie=j.parameters.focusLetters.filter(ge=>Le[ge]&&x.includes(ge));ie.length>0&&(x=[...new Set([...ie,...x])].slice(0,x.length))}const se=be(x),{targetLetter:Z,wordIndex:le,questionKey:ve,word:Se,emoji:Ee}=se;P(ie=>new Set([...ie,ve])),Q(ie=>[...ie,ve]),T(ie=>ie+1),console.log(`🎯 Nova pergunta única: ${Z} - ${Se} (${H+1}ª pergunta)`),t(g==="word"?Z:{word:Se,letter:Z}),B(0),U(Date.now());const ke=Le[Z],ze=le;if(g==="word"){const ie=ke.words[ze],ge=ke.emojis[ze]||"📝",Ae=[],Te=x.filter(De=>De!==Z);for(;Ae.length<3&&Te.length>0;){const De=Te[Math.floor(Math.random()*Te.length)],Re=Le[De];if(Re&&Re.words&&Re.words.length>0){const Jt=Math.floor(Math.random()*Re.words.length),Wt={letter:De,word:Re.words[Jt],emoji:Re.emojis&&Re.emojis[Jt]||"📝",isCorrect:!1};Ae.some(ai=>ai.word===Wt.word)||Ae.push(Wt)}const la=Te.indexOf(De);la>-1&&Te.splice(la,1)}for(;Ae.length<3;){const De=[{letter:"A",word:"AVIÃO",emoji:"✈️"},{letter:"B",word:"BOLA",emoji:"⚽"},{letter:"C",word:"CASA",emoji:"🏠"}].filter(Re=>Re.letter!==Z);for(const Re of De)Ae.length<3&&!Ae.some(la=>la.word===Re.word)&&Ae.push({...Re,isCorrect:!1});break}const xe=[...Ae,{letter:Z,word:ie,emoji:ge,isCorrect:!0}];c(xe.sort(()=>Math.random()-.5))}else{const ie=ke.words[ze];t({word:ie,letter:Z});const ge=[],Ae=x.filter(xe=>xe!==Z);for(;ge.length<3&&Ae.length>0;){const xe=Ae[Math.floor(Math.random()*Ae.length)];ge.includes(xe)||ge.push(xe);const De=Ae.indexOf(xe);De>-1&&Ae.splice(De,1)}for(;ge.length<3;){const xe=["A","B","C","D","E"].filter(De=>De!==Z&&!ge.includes(De));if(xe.length>0)ge.push(xe[0]);else break}const Te=[...ge.map(xe=>({letter:xe,isCorrect:!1})),{letter:Z,isCorrect:!0}];c(Te.sort(()=>Math.random()-.5))}n(null),m(null)}catch(C){console.error("Erro ao gerar nova rodada:",C),t("A"),c([{letter:"A",word:"AVIÃO",emoji:"✈️",isCorrect:!0},{letter:"B",word:"BOLA",emoji:"⚽",isCorrect:!1},{letter:"C",word:"CASA",emoji:"🏠",isCorrect:!1}])}},be=x=>{let se=0;for(;se<50;){const Se=x[Math.floor(Math.random()*x.length)],Ee=Le[Se];if(!Ee||!Ee.words){se++;continue}for(let ke=0;ke<Ee.words.length;ke++){const ze=`${Se}-${ke}-${g}`;if(!M.has(ze))return{targetLetter:Se,wordIndex:ke,questionKey:ze,word:Ee.words[ke],emoji:Ee.emojis[ke]||"📝"}}se++}console.log("🔄 Todas as perguntas foram usadas! Resetando para novas rodadas..."),P(new Set),Q([]);const Z=x[Math.floor(Math.random()*x.length)],le=Le[Z],ve=Math.floor(Math.random()*le.words.length);return{targetLetter:Z,wordIndex:ve,questionKey:`${Z}-${ve}-${g}`,word:le.words[ve],emoji:le.emojis[ve]||"📝"}},We=x=>{if(!x){console.error("Opção selecionada é nula ou indefinida");return}if(!u)try{if(n(x),X(),B(C=>C+1),x.isCorrect){G();const C=p==="easy"?5:p==="medium"?10:15,se=Math.max(0,10-Math.floor((Date.now()-w)/1e3)),Z=C+se,le=ye(Z);if(console.log(`Pontuação atualizada: ${le} (10 base + ${Z} bônus)`),Je(),b(),S){const Se={difficulty:p,letter:typeof a=="string"?a:a.letter,timeSpent:Math.floor((Date.now()-w)/1e3),moveCount:A,accuracy:100,score:10+Z,gameMode:g},Ee=S.saveGameData(Se);Ee&&Ee!==p&&f(Ee)}const ve=Uo[Math.floor(Math.random()*Uo.length)];m({type:"success",message:`${ve} +${10+Z} pontos!`}),Y(),setTimeout(()=>{m(null),n(null),fe()},3e3)}else{if(I(),Hr(),O(),S){const C={difficulty:p,letter:typeof a=="string"?a:a.letter,timeSpent:Math.floor((Date.now()-w)/1e3),moveCount:A,accuracy:0,score:0,gameMode:g};S.saveGameData(C)}m({type:"error",message:"Tente novamente! Pense na primeira letra da palavra. 🤔"}),setTimeout(()=>{n(null),m(null)},2e3)}}catch(C){console.error("Erro ao processar seleção de opção:",C),m({type:"error",message:"Ocorreu um erro. Tente novamente!"}),setTimeout(()=>{n(null),m(null)},2e3)}},Gr=async()=>{if(console.log("🎮 Iniciando jogo de reconhecimento de letras..."),await J(),P(new Set),Q([]),T(0),!S||!j){console.log("🤖 Inicializando modelo adaptativo...");try{const x=Fr("letter-recognition",y);L(x);let C;try{C=await gr("letter-recognition",p),console.log("⚙️ Parâmetros adaptativos obtidos:",C),k(C),C&&C.difficulty!==p&&f(C.difficulty)}catch(se){console.warn("⚠️ Falha ao obter parâmetros adaptativos, usando padrões:",se),C={difficulty:p,parameters:{focusLetters:zr.find(Z=>Z.id===p)?.letters||[]}},k(C)}}catch(x){console.error("❌ Erro ao inicializar modelo adaptativo:",x)}}d(!0),m(null),n(null),U(Date.now()),console.log("📊 Progresso inicial:",D),fe(),te("Jogo de reconhecimento de letras iniciado!")},qr=()=>{try{const x=g==="word"?"letter":"word";E(x),n(null),m(null),i&&a&&setTimeout(()=>{fe()},100),te(`Modo alterado para: ${x==="word"?"Reconhecer palavras":"Reconhecer letras"}`)}catch(x){console.error("Erro ao alternar modo de jogo:",x)}};return e.jsxs(Ve,{children:[e.jsx(He,{children:e.jsx(_e,{onClick:r,whileHover:{scale:1.05},whileTap:{scale:.95},children:"⬅️ Voltar"})}),e.jsxs(Ue,{children:[e.jsxs(Be,{children:[e.jsx("span",{children:"🔤"}),e.jsx("span",{children:"Reconhecimento de Letras"})]}),e.jsx(Ye,{children:i?`Modo: ${g==="word"?"Palavra":"Letra"} - ${D.score||0} pontos`:"Vamos aprender as letras do alfabeto"})]}),e.jsx(Gl,{children:i?g==="word"?"Qual palavra começa com esta letra?":"Com qual letra esta palavra começa?":"📚 Vamos aprender as letras! Escolha a dificuldade para começar."}),i?e.jsxs(ir,{children:[e.jsxs(Ce,{className:"secondary",onClick:qr,whileHover:{scale:1.05},whileTap:{scale:.95},children:["🔄 Trocar Modo: ",g==="word"?"Palavra→Letra":"Letra→Palavra"]}),e.jsx(Ce,{className:"audio",onClick:()=>{try{if(g==="word"){const x=typeof a=="string"?a:a&&a.letter?a.letter:null;x&&R(x)}else a&&typeof a=="object"&&a.word&&ee(a.word)}catch(x){console.error("Erro ao tentar reproduzir áudio:",x)}},whileHover:{scale:1.05},whileTap:{scale:.95},disabled:!a,children:"🔊 Ouvir Novamente"})]}):e.jsxs(e.Fragment,{children:[e.jsx(jr,{children:zr.map(x=>e.jsx(Sr,{isActive:p===x.id,onClick:()=>f(x.id),whileHover:{scale:1.05},whileTap:{scale:.95},themeColor:Fo,children:x.name},x.id))}),e.jsx(ir,{children:e.jsx(Ce,{onClick:Gr,whileHover:{scale:1.05},whileTap:{scale:.95},themeColor:Fo,children:"📚 Começar a Aprender"})})]}),"      ",i&&e.jsxs(Zl,{children:[e.jsxs("span",{children:["Pontos: ",D.score]}),e.jsx("span",{children:"•"}),e.jsxs("span",{children:["Precisão: ",D.accuracy,"%"]}),e.jsx("span",{children:"•"}),e.jsxs("span",{children:["📝 Perguntas: ",H]}),e.jsx("span",{children:"•"}),e.jsx(ed,{children:Array.from({length:3},(x,C)=>e.jsx("span",{children:C<D.stars?"⭐":"☆"},C))})]}),e.jsx(_r,{timeMetrics:q?oe():null,onStart:J,onPause:K,onResume:ce,onFinish:V,showControls:!1,compact:!1,invisible:!0}),i&&a&&e.jsxs(ql,{initial:{scale:0,opacity:0},animate:{scale:1,opacity:1},transition:{duration:.5},onClick:()=>{try{if(g==="word"){const x=typeof a=="string"?a:a&&a.letter?a.letter:"A";R(x)}else{const x=typeof a=="object"&&a.word?a.word:"";ee(x)}}catch(x){console.error("Erro ao falar letra/palavra:",x)}},children:[g==="word"?e.jsx("div",{className:"target-display",children:typeof a=="string"?a:a&&a.letter?a.letter:"?"}):e.jsx("div",{className:"target-display",children:typeof a=="object"&&a.word?a.word:"?"}),e.jsx(Vl,{children:g==="word"?"Clique para ouvir a letra":"Clique para ouvir a palavra"}),"        "]}),i&&o.length>0&&e.jsx(Yl,{children:o.map((x,C)=>e.jsx(Jl,{onClick:()=>We(x),className:u===x?x.isCorrect?"correct":"incorrect":"",whileHover:{scale:1.05},whileTap:{scale:.95},initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3,delay:C*.1},children:g==="word"?e.jsxs(e.Fragment,{children:[e.jsx(Xl,{children:x.emoji||"📝"}),e.jsx(Kl,{children:x.word})]}):e.jsx(Wl,{children:x.letter})},C))}),e.jsx(Ne,{children:h&&e.jsx(Ql,{className:h.type,initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{duration:.3},children:h.message})})]})}const td="var(--primary-orange)",od="linear-gradient(135deg, var(--primary-orange), var(--primary-pink))",sd=s(nr)`
  background: ${od};
`,id=s.div`
  display: flex;
  gap: var(--space-lg);
  flex-wrap: wrap;
  justify-content: center;
  margin: var(--space-lg) 0;
`,wa=s.div`
  text-align: center;
`,ja=s.div`
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--primary-orange);
`,Sa=s.div`
  font-size: var(--font-size-sm);
  color: var(--medium-gray);
`,nd=s.div`
  background: linear-gradient(135deg, var(--light-gray), var(--white));
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  width: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
  box-shadow: var(--shadow-medium);
  
  @media (max-width: 768px) {
    padding: var(--space-lg);
    min-height: 250px;
  }
`,cd=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: var(--space-md);
  width: 100%;
  max-width: 500px;
  justify-items: center;
    @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
    gap: var(--space-sm);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
    gap: var(--space-xs);
    max-width: 400px;
  }
  
  @media (max-width: 360px) {
    grid-template-columns: repeat(3, 1fr);
    max-width: 300px;
  }
`,ld=s(_.div)`
  width: 60px;
  height: 60px;
  background: white;
  border-radius: var(--radius-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: var(--shadow-light);
  cursor: pointer;
  border: 3px solid transparent;
  transition: all var(--transition-normal);
  
  &:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-medium);
  }
  
  &.counted {
    border-color: var(--primary-green);
    background: var(--success-light);
  }
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
`,dd=s.div`
  text-align: center;
  font-size: var(--font-size-lg);
  color: var(--primary-blue);
  font-weight: 600;
  margin-bottom: var(--space-md);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-md);
  }
`,md=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: var(--space-md);
  width: 100%;
  max-width: 400px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-sm);
  }
`,pd=s(_.button)`
  background: white;
  border: 3px solid var(--primary-blue);
  border-radius: var(--radius-medium);
  padding: var(--space-lg);
  cursor: pointer;
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-blue);
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-medium);
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: var(--primary-blue);
    color: white;
    transform: translateY(-3px);
    box-shadow: var(--shadow-large);
  }
  
  &:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 2px;
  }
  
  &.correct {
    background: var(--success-light);
    border-color: var(--primary-green);
    color: var(--success-dark);
  }
  
  &.incorrect {
    background: var(--error-light);
    border-color: var(--primary-red);
    color: var(--error-dark);
  }
  
  @media (max-width: 768px) {
    padding: var(--space-md);
    font-size: 1.5rem;
    min-height: 60px;
  }
`;s(Ce)`
  &.secondary {
    background: var(--primary-blue);
  }
  
  &.audio {
    background: var(--primary-purple);
  }
`;const ud=s(_.div)`
  padding: var(--space-md);
  border-radius: var(--radius-medium);
  text-align: center;
  font-weight: 600;
  font-size: var(--font-size-md);
  
  &.success {
    background: var(--success-light);
    color: var(--success-dark);
    border: 2px solid var(--primary-green);
  }
  
  &.error {
    background: var(--error-light);
    color: var(--error-dark);
    border: 2px solid var(--primary-red);
  }
`,gd=s.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--font-size-md);
  color: var(--primary-blue);
  font-weight: 600;
  flex-wrap: wrap;
  justify-content: center;
`,hd=s.div`
  display: flex;
  gap: var(--space-xs);
  font-size: var(--font-size-xl);
`,fd=s.div`
  font-size: var(--font-size-md);
  color: var(--medium-gray);
  text-align: center;
  margin-top: var(--space-sm);
`,Bo={animals:["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯"],fruits:["🍎","🍌","🍊","🍇","🍓","🥝","🍑","🥭","🍍","🥥"],toys:["⚽","🏀","🎾","🧸","🪀","🎲","🧩","🎸","🎯","🎮"],vehicles:["🚗","🚕","🚙","🚌","🚎","🏎️","🚓","🚑","🚒","🚐"],flowers:["🌸","🌺","🌻","🌷","🌹","🏵️","💐","🌼","🌿","🍀"],food:["🍰","🧁","🍪","🍩","🍭","🍬","🍫","🎂","🍯","🍔"]},Ho=[{id:"easy",name:"Fácil (1-5)",min:1,max:5,options:3},{id:"medium",name:"Médio (1-10)",min:1,max:10,options:4},{id:"hard",name:"Difícil (1-15)",min:1,max:15,options:5}],Ca=["Muito bem! Você sabe contar! 🔢","Excelente! Seus números estão perfeitos! 🌟","Fantástico! Continue contando! ✨","Incrível! Você é ótimo com números! 💪","Parabéns! Matemática é divertida! 🎉"];function vd({onBack:r}){const[a,t]=l.useState([]),[o,c]=l.useState(0),[i,d]=l.useState([]),[p,f]=l.useState(!1),[h,m]=l.useState("easy"),[u,n]=l.useState(null),[g,E]=l.useState(null),[w,U]=l.useState([]),[A,B]=l.useState("count"),[S,L]=l.useState(null),[j,k]=l.useState(0),[M,P]=l.useState(null),[W,Q]=l.useState(null),{playSound:H,playClick:T,playSuccess:z,playError:b}=br(),{userId:O}=lt(),{progress:D,incrementSuccesses:Y,incrementAttempts:X,recordSuccess:G,recordError:me,resetProgress:ne,updateTimeSpent:pe,saveProgress:ye,startActivity:I,pauseActivity:N,resumeActivity:J,finishActivity:K,getCurrentTimeMetrics:ce,sessionId:V,isActivityActive:oe,isActivityPaused:ue,getFormattedTime:q,getStats:v,getEncouragementMessage:F}=wr("number-counting"),y=()=>{Br()&&document.body.classList.add("high-contrast"),vr()&&document.body.classList.add("reduced-motion")};l.useEffect(()=>{y();const x=Fr("number-counting",O);P(x);const C=gr("number-counting",h);Q(C),C.difficulty!==h&&m(C.difficulty)},[]);const $=x=>{if("speechSynthesis"in window){const C=new SpeechSynthesisUtterance(x.toString());C.lang="pt-BR",C.rate=.8,C.pitch=1.2,speechSynthesis.speak(C)}te(`Número ${x}`)},R=(x,C,se)=>{const Z=x?10:0,le=se==="easy"?0:se==="medium"?5:10,ve=Math.max(0,10-Math.min(C-o,10));return Z+le+ve},ee=async()=>{await I(),f(!0),ne(),L(Date.now()),We(),te("Jogo iniciado! Conte os objetos na tela.")},fe=()=>{const x=A==="count"?"select":"count";B(x),U([]),t(a.map(C=>({...C,counted:!1}))),te(x==="count"?"Modo contagem: clique nos objetos para contá-los.":"Modo seleção: escolha o número correto de objetos.")},be=()=>{U([]),k(0),t(a.map(x=>({...x,counted:!1}))),te("Contagem reiniciada!")},We=()=>{const x=Ho.find(ie=>ie.id===h);if(!x){console.error("Dados de dificuldade não encontrados para:",h);return}const C=W?.parameters?.maxCount||x.max,se=W?.parameters?.minCount||x.min,Z=W?.parameters?.options||x.options,le=Math.floor(Math.random()*(C-se+1))+se;c(le),k(0);const ve=Object.keys(Bo),Se=ve[Math.floor(Math.random()*ve.length)];setCurrentCategory(Se);const Ee=Bo[Se],ke=[];for(let ie=0;ie<le;ie++){const ge=Ee[Math.floor(Math.random()*Ee.length)];ke.push({id:ie,emoji:ge,counted:!1})}t(ke),U([]);const ze=[le];for(;ze.length<Z;){let ie=h==="hard"?1:2,ge;Math.random()<.7?ge=le+(Math.random()<.5?1:-1)*(Math.floor(Math.random()*ie)+1):ge=Math.floor(Math.random()*C)+1,ge=Math.max(1,Math.min(C,ge)),ze.includes(ge)||ze.push(ge)}d(ze.sort(()=>Math.random()-.5).map(ie=>({number:ie,isCorrect:ie===le}))),E(null),n(null)},Gr=x=>{if(A!=="count")return;const C=a.find(Z=>Z.id===x);if(!C||C.counted)return;T(),k(Z=>Z+1);const se=[...w,x];U(se),t(a.map(Z=>Z.id===x?{...Z,counted:!0}:Z)),$(se.length),se.length===o&&setTimeout(()=>{G(),Y(),X(),Je(),z();const Z=R(!0,j,h);if(M){const ve={difficulty:h,correctCount:o,moveCount:j,timeSpent:Math.floor((Date.now()-S)/1e3),accuracy:100,score:Z},Se=M.saveGameData(ve);Se&&Se!==h&&m(Se)}const le=Ca[Math.floor(Math.random()*Ca.length)];n({type:"success",message:`${le} Você contou ${o} objetos! +${Z} pontos!`}),ye(),setTimeout(()=>{We()},3e3)},500)},qr=x=>{if(!(g||A!=="select"))if(T(),k(C=>C+1),E(x),x.isCorrect){G(),Y(),X(),Je(),z();const C=R(!0,j,h);if(M){const Z={difficulty:h,correctCount:o,moveCount:j,timeSpent:Math.floor((Date.now()-S)/1e3),accuracy:100,score:C},le=M.saveGameData(Z);le&&le!==h&&m(le)}const se=Ca[Math.floor(Math.random()*Ca.length)];n({type:"success",message:`${se} Há ${o} objetos! +${C} pontos!`}),ye(),setTimeout(()=>{We()},2500)}else me(),X(),Hr(),H("error"),n({type:"error",message:"Conte novamente! Observe bem todos os objetos. 🔍"}),setTimeout(()=>{E(null),n(null)},2e3)};return e.jsxs(Ve,{children:[e.jsx(He,{children:e.jsx(_e,{onClick:r,whileHover:{scale:1.05},whileTap:{scale:.95},children:"⬅️ Voltar"})}),e.jsxs(Ue,{children:[e.jsxs(Be,{children:[e.jsx("span",{children:"🔢"}),e.jsx("span",{children:"Contando Números"})]}),e.jsx(Ye,{children:"Aprenda a contar objetos de forma divertida"})]}),p&&e.jsxs(id,{children:[e.jsxs(wa,{children:[e.jsx(ja,{children:D.score}),e.jsx(Sa,{children:"Pontos"})]}),e.jsxs(wa,{children:[e.jsx(ja,{children:D.level}),e.jsx(Sa,{children:"Nível"})]}),e.jsxs(wa,{children:[e.jsx(ja,{children:D.stars}),e.jsx(Sa,{children:"⭐ Estrelas"})]}),e.jsxs(wa,{children:[e.jsxs(ja,{children:[v().accuracy,"%"]}),e.jsx(Sa,{children:"Precisão"})]})]}),e.jsx(sd,{children:p?A==="count"?"Clique nos objetos para contá-los um por um!":"Quantos objetos você vê? Clique no número correto!":"🔢 Vamos aprender a contar! Escolha a dificuldade para começar."}),!p&&e.jsx(jr,{children:Ho.map(x=>e.jsx(Sr,{isActive:h===x.id,onClick:()=>m(x.id),whileHover:{scale:1.05},whileTap:{scale:.95},children:x.name},x.id))}),"      ",p&&e.jsxs(gd,{children:[e.jsxs("span",{children:["Pontos: ",D.score]}),e.jsx("span",{children:"•"}),e.jsxs("span",{children:["Precisão: ",D.accuracy,"%"]}),e.jsx("span",{children:"•"}),e.jsx(hd,{children:Array.from({length:3},(x,C)=>e.jsx("span",{children:C<D.stars?"⭐":"☆"},C))})]}),"      ",e.jsx(_r,{timeMetrics:oe?ce():null,onStart:I,onPause:N,onResume:J,onFinish:K,compact:!1,invisible:!0}),a.length>0&&e.jsxs(nd,{children:[e.jsx(dd,{children:A==="count"?"Conte os objetos clicando neles:":"Quantos objetos há aqui?"}),e.jsx(cd,{children:a.map(x=>e.jsx(ld,{className:x.counted?"counted":"",onClick:()=>Gr(x.id),whileHover:{scale:1.1},whileTap:{scale:.9},initial:{opacity:0,scale:0},animate:{opacity:1,scale:1},transition:{duration:.3,delay:x.id*.1},children:x.emoji},x.id))}),A==="count"&&w.length>0&&e.jsxs(fd,{children:["Você contou: ",w.length," objeto",w.length!==1?"s":""]})]}),A==="select"&&i.length>0&&e.jsx(md,{children:i.map((x,C)=>e.jsx(pd,{onClick:()=>qr(x),className:g===x?x.isCorrect?"correct":"incorrect":"",whileHover:{scale:1.05},whileTap:{scale:.95},initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3,delay:C*.1},children:x.number},C))}),e.jsx(ir,{children:p?e.jsxs(e.Fragment,{children:[e.jsxs(Ce,{className:"secondary",onClick:fe,whileHover:{scale:1.05},whileTap:{scale:.95},children:["🔄 Modo: ",A==="count"?"Contar→Escolher":"Escolher→Contar"]}),A==="count"&&e.jsx(Ce,{className:"audio",onClick:be,whileHover:{scale:1.05},whileTap:{scale:.95},children:"🔄 Recomeçar Contagem"}),e.jsx(Ce,{className:"audio",onClick:()=>$(o),whileHover:{scale:1.05},whileTap:{scale:.95},children:"🔊 Ouvir Resposta"})]}):e.jsx(Ce,{onClick:ee,whileHover:{scale:1.05},whileTap:{scale:.95},themeColor:td,children:"🔢 Começar a Contar"})}),e.jsx(Ne,{children:u&&e.jsx(ud,{className:u.type,initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{duration:.3},children:u.message})})]})}s(_.button)`
  background: var(--primary-blue);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  box-shadow: var(--shadow-medium);
  position: relative;
  
  &:hover {
    background: var(--primary-purple);
    transform: scale(1.1);
  }
  
  &:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Animação quando falando */
  ${r=>r.$speaking&&`
    background: var(--primary-green);
    animation: pulse 1s infinite;
  `}
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;const Oe="var(--primary-purple)",Yt="linear-gradient(135deg, var(--primary-purple), var(--primary-pink))",_o=[{id:"EASY",name:"Artista Iniciante",description:"Primeiros passos na arte digital",icon:"🎨",features:["Cores básicas","Ferramentas simples","Guias visuais","Criatividade livre"]},{id:"MEDIUM",name:"Artista em Crescimento",description:"Desenvolvendo técnicas e criatividade",icon:"🎨",features:["Mais ferramentas","Paleta expandida","Desafios guiados","Criatividade livre"]},{id:"HARD",name:"Criador Avançado",description:"Expressão artística completa",icon:"🎭",features:["Todas as ferramentas","Liberdade total","Criatividade livre","Recursos avançados"]}],Aa={primary:["#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7","#DDA0DD","#98D8C8","#F7DC6F"],secondary:["#FF8A80","#80CBC4","#81C784","#FFB74D","#CE93D8","#90CAF9","#A5D6A7","#FFCC02"],natural:["#8B4513","#228B22","#87CEEB","#F4A460","#DEB887","#32CD32","#6495ED","#D2691E"],vibrant:["#FF1744","#00E676","#2979FF","#FF6D00","#E91E63","#00BCD4","#8BC34A","#FFC107"],pastels:["#FFB3BA","#BAFFC9","#BAE1FF","#FFFFBA","#FFD3BA","#E1BAFF","#D4EDDA","#F8D7DA"]},Go={nature:[{id:"tree",name:"🌳 Árvore Mágica",description:"Uma árvore com folhas coloridas",colors:["primary","natural"],difficulty:"EASY"},{id:"flowers",name:"🌸 Jardim de Flores",description:"Um campo cheio de flores vibrantes",colors:["vibrant","pastels"],difficulty:"MEDIUM"},{id:"landscape",name:"🏔️ Paisagem Natural",description:"Montanhas, céu e natureza",colors:["natural","primary"],difficulty:"HARD"}],animals:[{id:"cat",name:"🐱 Gatinho Fofo",description:"Um gato brincalhão e colorido",colors:["pastels","primary"],difficulty:"EASY"},{id:"butterfly",name:"🦋 Borboleta Colorida",description:"Uma borboleta com asas vibrantes",colors:["vibrant","secondary"],difficulty:"MEDIUM"},{id:"underwater",name:"🐠 Vida Marinha",description:"Peixes e corais no oceano",colors:["primary","natural"],difficulty:"HARD"}],emotions:[{id:"happy",name:"😊 Alegria",description:"Desenhe algo que te deixa feliz",colors:["vibrant","primary"],difficulty:"EASY"},{id:"calm",name:"😌 Tranquilidade",description:"Crie algo relaxante e sereno",colors:["pastels","natural"],difficulty:"MEDIUM"},{id:"creative",name:"🎨 Criatividade",description:"Expresse sua imaginação livremente",colors:["all"],difficulty:"HARD"}]},xd=[{id:"free-expression",title:"🎨 Expressão Livre",description:"Desenhe o que seu coração mandar! Não há regras, apenas criatividade.",type:"free",minStrokes:3,minColors:1,difficulty:"EASY",therapeuticFocus:"self-expression",colors:"all"},{id:"emotion-colors",title:"💫 Pintando Sentimentos",description:"Como você se sente hoje? Use cores que representem suas emoções.",type:"emotional",minStrokes:5,minColors:2,difficulty:"EASY",therapeuticFocus:"emotional-awareness",colors:"emotional"},{id:"nature-harmony",title:"🌿 Harmonia Natural",description:"Crie uma cena da natureza usando tons naturais e formas orgânicas.",type:"guided",minStrokes:8,minColors:4,difficulty:"MEDIUM",therapeuticFocus:"mindfulness",colors:"natural"},{id:"abstract-energy",title:"⚡ Energia Abstrata",description:"Solte sua criatividade com formas abstratas e cores vibrantes!",type:"abstract",minStrokes:10,minColors:5,difficulty:"MEDIUM",therapeuticFocus:"stress-relief",colors:"vibrant"},{id:"detailed-masterpiece",title:"🖼️ Obra Prima Detalhada",description:"Crie uma obra complexa usando todas as ferramentas disponíveis.",type:"complex",minStrokes:15,minColors:6,difficulty:"HARD",therapeuticFocus:"focus-concentration",colors:"all"},{id:"story-painting",title:"📚 Pintura Narrativa",description:"Conte uma história através da sua arte, com personagens e cenários.",type:"narrative",minStrokes:12,minColors:5,difficulty:"HARD",therapeuticFocus:"communication",colors:"all"}];s(nr)`
  background: ${Yt};
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;const yd=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-lg);
  margin: var(--space-xl) 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
`;s(_.div).withConfig({shouldForwardProp:r=>!["initial","animate","exit","whileHover","whileTap"].includes(r)})`
  background: white;
  border: 3px solid ${r=>r.$selected?Oe:"var(--border-color)"};
  border-radius: var(--radius-large);
  padding: var(--space-lg);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-medium);
  
  &:hover {
    border-color: ${Oe};
    transform: translateY(-2px);
    box-shadow: var(--shadow-large);
  }
  
  h3 {
    margin: 0 0 var(--space-sm) 0;
    color: var(--text-primary);
    font-size: var(--font-size-lg);
  }
  
  p {
    margin: 0 0 var(--space-md) 0;
    color: var(--text-secondary);
  }
  
  .instruction {
    font-size: var(--font-size-sm);
    color: var(--text-tertiary);
    font-style: italic;
  }
  
  @media (max-width: 768px) {
    padding: var(--space-md);
  }
`;const bd=s.div`
  display: grid;
  grid-template-columns: 280px 1fr 240px;
  gap: var(--space-lg);
  margin-top: var(--space-xl);
  
  @media (max-width: 1200px) {
    grid-template-columns: 240px 1fr 200px;
    gap: var(--space-md);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }
`,wd=s.div`
  background: white;
  border-radius: var(--radius-large);
  padding: var(--space-lg);
  box-shadow: var(--shadow-medium);
  height: fit-content;
  
  h3 {
    margin: 0 0 var(--space-md) 0;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }
  
  @media (max-width: 768px) {
    padding: var(--space-md);
    order: 2;
  }
`,jd=s.div`
  background: white;
  border-radius: var(--radius-large);
  padding: var(--space-lg);
  box-shadow: var(--shadow-medium);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 500px;
  
  @media (max-width: 768px) {
    padding: var(--space-md);
    order: 1;
  }
`,Sd=s.canvas`
  border: 2px solid var(--border-color);
  border-radius: var(--radius-medium);
  cursor: crosshair;
  background: white;
  touch-action: none;
  max-width: 100%;
  height: auto;
  box-shadow: var(--shadow-small);
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 320px;
    height: 240px;
  }
  
  @media (max-width: 480px) {
    max-width: 280px;
    height: 200px;
  }
`,Cd=s.div`
  background: white;
  border-radius: var(--radius-large);
  padding: var(--space-lg);
  box-shadow: var(--shadow-medium);
  
  h3 {
    margin: 0 0 var(--space-md) 0;
    color: var(--text-primary);
  }
  
  @media (max-width: 768px) {
    padding: var(--space-md);
    order: 3;
  }
`,Ad=s.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-xs);
  margin-bottom: var(--space-md);
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(6, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(5, 1fr);
  }
`,Ed=s(_.button).withConfig({shouldForwardProp:r=>!["initial","animate","exit","whileHover","whileTap"].includes(r)})`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid ${r=>r.$selected?"var(--text-primary)":"transparent"};
  background: ${r=>r.$color};
  cursor: pointer;
  box-shadow: var(--shadow-small);
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-medium);
  }
  
  &:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 2px;
  }
  
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
  }
  
  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
  }
`,kd=s.div`
  margin-bottom: var(--space-lg);
  
  label {
    display: block;
    margin-bottom: var(--space-sm);
    color: var(--text-secondary);
    font-weight: 600;
  }
`,Td=s.input`
  width: 100%;
  height: 8px;
  background: var(--surface-secondary);
  border-radius: 5px;
  outline: none;
  margin-bottom: var(--space-sm);
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background: ${Oe};
    border-radius: 50%;
    cursor: pointer;
    box-shadow: var(--shadow-small);
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: ${Oe};
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`,Pd=s.div`
  width: ${r=>r.$size}px;
  height: ${r=>r.$size}px;
  border-radius: 50%;
  background: ${r=>r.$color};
  margin: 0 auto var(--space-sm);
  box-shadow: var(--shadow-small);
`;s.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--surface-secondary);
  border-radius: var(--radius-medium);
  padding: var(--space-md);
  margin-bottom: var(--space-lg);
  color: var(--text-primary);
  font-weight: 600;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: var(--space-sm);
  }
`;const zd=s.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
  padding: var(--space-md);
  background: var(--surface-secondary);
  border-radius: var(--radius-medium);
  color: var(--primary-purple);
  font-weight: 600;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: var(--space-sm);
  }
`,Md=s.div`
  display: flex;
  gap: var(--space-xs);
  font-size: var(--font-size-lg);
`,qo=s.div`
  background: ${Yt};
  color: white;
  padding: var(--space-lg);
  border-radius: var(--radius-large);
  margin-bottom: var(--space-lg);
  
  @media (max-width: 768px) {
    padding: var(--space-md);
    margin-bottom: var(--space-md);
  }
`,Vo=s.h3`
  margin: 0 0 var(--space-sm) 0;
  font-size: var(--font-size-lg);
`,Yo=s.p`
  margin: 0 0 var(--space-md) 0;
  opacity: 0.9;
`,Dd=s.div`
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-medium);
  padding: var(--space-sm);
  font-size: var(--font-size-sm);
`,$d=s(_.div).withConfig({shouldForwardProp:r=>!["initial","animate","exit"].includes(r)})`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  padding: var(--space-md);
  border-radius: var(--radius-medium);
  font-weight: 600;
  font-size: var(--font-size-md);
  box-shadow: var(--shadow-large);
  max-width: 300px;
  
  &.success {
    background: var(--success-light);
    color: var(--success-dark);
    border: 2px solid var(--primary-green);
  }
  
  &.achievement {
    background: ${Yt};
    color: white;
  }
  
  @media (max-width: 768px) {
    position: relative;
    top: auto;
    right: auto;
    margin: var(--space-md) 0;
    max-width: none;
  }
`,Id=s.div`
  margin-bottom: var(--space-lg);
  
  h3 {
    margin: 0 0 var(--space-md) 0;
  }
`,Od=s.div`
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`,Rd=s.button`
  padding: var(--space-sm) var(--space-md);
  border: 2px solid ${r=>r.$active?Oe:"var(--border-color)"};
  background: ${r=>r.$active?Oe:"white"};
  color: ${r=>r.$active?"white":"var(--text-primary)"};
  border-radius: var(--radius-small);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${Oe};
  }
`,Ld=s.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-sm);
`,Jo=s(_.div).withConfig({shouldForwardProp:r=>!["initial","animate","exit","whileHover","whileTap"].includes(r)})`
  border: 2px solid ${r=>r.$selected?Oe:"var(--border-color)"};
  border-radius: var(--radius-medium);
  padding: var(--space-md);
  cursor: pointer;
  background: ${r=>r.$selected?"var(--surface-hover)":"white"};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${Oe};
    background: var(--surface-hover);
  }
  
  h4 {
    margin: 0 0 var(--space-sm) 0;
    color: var(--text-primary);
  }
  
  p {
    margin: 0;
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
  }
`,Nd=s.div`
  background: var(--surface-secondary);
  border-radius: var(--radius-medium);
  padding: var(--space-md);
  margin-top: var(--space-md);
  
  h4 {
    margin: 0 0 var(--space-md) 0;
    color: var(--text-primary);
  }
`,Ea=s.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
  
  span:first-child {
    color: var(--text-secondary);
  }
  
  span:last-child {
    font-weight: 600;
    color: var(--text-primary);
  }
`,Wo=s(Ve)`
  min-height: 100vh;
  padding: var(--space-lg);
  
  @media (max-width: 768px) {
    padding: var(--space-md);
  }
`,Ct=s(_.button).withConfig({shouldForwardProp:r=>!["initial","animate","exit","whileHover","whileTap"].includes(r)})`
  padding: var(--space-md);
  border: 2px solid ${r=>r.$active?Oe:"var(--border-color)"};
  background: ${r=>r.$active?Oe:"white"};
  color: ${r=>r.$active?"white":"var(--text-primary)"};
  border-radius: var(--radius-medium);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 150px;
  
  &:hover {
    background: ${r=>r.$active?Oe:"var(--surface-hover)"};
    border-color: ${Oe};
  }
  
  @media (max-width: 768px) {
    min-width: auto;
    padding: var(--space-sm);
  }
`,Fd=s.div`
  margin-bottom: var(--space-md);
  
  label {
    display: block;
    margin-bottom: var(--space-sm);
    color: var(--text-secondary);
    font-weight: 600;
  }
`,Ud=s.div`
  margin-bottom: var(--space-md);
  
  h4 {
    margin: 0 0 var(--space-sm) 0;
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`,Bd=({onBack:r})=>{const[a,t]=l.useState(!1),[o,c]=l.useState("EASY"),[i,d]=l.useState(null),[p,f]=l.useState("free"),[h,m]=l.useState(null),[u,n]=l.useState("nature"),[g,E]=l.useState(!1),[w,U]=l.useState("#FF6B6B"),[A,B]=l.useState(10),[S,L]=l.useState(0),[j,k]=l.useState(new Set),[M,P]=l.useState([]),[W,Q]=l.useState(null),[H,T]=l.useState(null),[z,b]=l.useState(!1),O=l.useRef(null),D=l.useRef(null),Y=l.useRef(null),{playClick:X,playSuccess:G,playError:me}=br(),{recordSuccess:ne,getCurrentTimeMetrics:pe}=wr("creative-painting"),{userId:ye}=lt();l.useEffect(()=>{if(a&&O.current){const v=O.current,F=v.getContext("2d"),y=()=>{const R=v.parentElement.clientWidth-40,ee=window.innerWidth<=768?250:400;v.width=Math.min(R,600),v.height=ee,F.lineCap="round",F.lineJoin="round",F.fillStyle="white",F.fillRect(0,0,v.width,v.height)};return y(),window.addEventListener("resize",y),D.current=F,()=>window.removeEventListener("resize",y)}},[a]),l.useEffect(()=>{ye&&(Y.current=Fr("creative-painting",ye))},[ye]);const I=l.useCallback(v=>{if(!D.current)return;E(!0),k(R=>new Set([...R,w]));const F=O.current.getBoundingClientRect(),y=(v.clientX||v.touches?.[0]?.clientX)-F.left,$=(v.clientY||v.touches?.[0]?.clientY)-F.top;D.current.beginPath(),D.current.moveTo(y,$),P(R=>[...R,{x:y,y:$,color:w,size:A,timestamp:Date.now()}])},[w,A]),N=l.useCallback(v=>{if(!g||!D.current)return;const F=O.current.getBoundingClientRect(),y=(v.clientX||v.touches?.[0]?.clientX)-F.left,$=(v.clientY||v.touches?.[0]?.clientY)-F.top;D.current.lineWidth=A,D.current.strokeStyle=w,D.current.lineTo(y,$),D.current.stroke(),P(R=>[...R,{x:y,y:$,color:w,size:A,timestamp:Date.now()}])},[g,w,A]),J=l.useCallback(()=>{g&&(E(!1),L(v=>v+1),D.current?.beginPath())},[g]),K=l.useCallback(v=>{if(!D.current||!O.current)return;const F=O.current,y=D.current;y.save(),y.strokeStyle="#cccccc",y.lineWidth=2,y.setLineDash([5,5]),y.globalAlpha=.5;const $=F.width/2,R=F.height/2;switch(v.id){case"tree":y.beginPath(),y.rect($-20,R+50,40,100),y.stroke(),y.beginPath(),y.arc($,R,80,0,2*Math.PI),y.stroke();break;case"flowers":for(let ee=0;ee<5;ee++){const fe=$+(Math.random()-.5)*200,be=R+(Math.random()-.5)*100;y.beginPath(),y.arc(fe,be,20,0,2*Math.PI),y.stroke()}break;case"landscape":y.beginPath(),y.moveTo(0,R+50),y.lineTo($-100,R-50),y.lineTo($,R),y.lineTo($+100,R-50),y.lineTo(F.width,R+50),y.stroke();break;case"cat":y.beginPath(),y.arc($,R+20,50,0,2*Math.PI),y.stroke(),y.beginPath(),y.arc($,R-30,35,0,2*Math.PI),y.stroke(),y.beginPath(),y.moveTo($-25,R-50),y.lineTo($-10,R-70),y.lineTo($+5,R-50),y.stroke(),y.beginPath(),y.moveTo($+25,R-50),y.lineTo($+10,R-70),y.lineTo($-5,R-50),y.stroke();break;case"butterfly":y.beginPath(),y.arc($-30,R-20,25,0,2*Math.PI),y.stroke(),y.beginPath(),y.arc($+30,R-20,25,0,2*Math.PI),y.stroke(),y.beginPath(),y.arc($-25,R+20,20,0,2*Math.PI),y.stroke(),y.beginPath(),y.arc($+25,R+20,20,0,2*Math.PI),y.stroke(),y.beginPath(),y.moveTo($,R-40),y.lineTo($,R+40),y.stroke();break;case"happy":y.beginPath(),y.arc($,R,60,0,2*Math.PI),y.stroke(),y.beginPath(),y.arc($-20,R-15,8,0,2*Math.PI),y.stroke(),y.beginPath(),y.arc($+20,R-15,8,0,2*Math.PI),y.stroke(),y.beginPath(),y.arc($,R+10,30,0,Math.PI),y.stroke();break;default:y.beginPath(),y.rect($-100,R-75,200,150),y.stroke()}y.restore(),te(`Guia visual do template ${v.name} desenhada`)},[]),ce=l.useCallback(()=>{if(!D.current||!O.current)return;const v=O.current,F=D.current;F.clearRect(0,0,v.width,v.height),F.fillStyle="white",F.fillRect(0,0,v.width,v.height),h&&p==="guided"&&setTimeout(()=>K(h),50),L(0),k(new Set),P([]),X(),te("Canvas limpo")},[X,h,p,K]);l.useCallback(()=>{!i||!D.current||(T({type:"info",message:`💡 Dica: ${i.description}. Já usou ${j.size}/${i.minColors} cores e fez ${S}/${i.minStrokes} traços.`}),te(`Dica do desafio: ${i.description}`))},[i,j.size,S]),l.useEffect(()=>{if(!i||!a)return;const v=S>=i.minStrokes,F=j.size>=i.minColors;if(v&&F&&S>0){const y=o==="EASY"?5:o==="MEDIUM"?10:15,$=Math.min(j.size*2,20),R=Math.min(Math.floor(S/5)*3,15),ee=y+$+R,fe=$+R;if(ne(ee),G(),Je(),T({type:"success",message:`🎨 Desafio completado! +${ee} pontos! Cores: ${j.size}, Traços: ${S}. Bônus criatividade: +${fe}`}),te(`Desafio completado! Você usou ${j.size} cores e fez ${S} traços!`),Y.current){const be={difficulty:o,challenge:i.id,strokeCount:S,colorsUsed:j.size,timeSpent:pe()?.elapsed||0,score:ee,creativity:$,detail:R};Y.current.saveGameData(be)}setTimeout(()=>{d(null),f("free")},3e3)}},[S,j,i,o,a,ne,G,pe]);const V=()=>{t(!0),Q(Date.now()),X(),te("Jogo de pintura criativa iniciado")},oe=v=>{d(v),f("challenge"),L(0),k(new Set),ce(),X(),te(`Desafio selecionado: ${v.title}`)},ue=v=>{m(v),f("guided"),X(),te(`Template selecionado: ${v.name}`)},q=()=>o==="EASY"?{primary:Aa.primary}:o==="MEDIUM"?{primary:Aa.primary,secondary:Aa.secondary}:Aa;return l.useEffect(()=>{if(H){const v=setTimeout(()=>T(null),4e3);return()=>clearTimeout(v)}},[H]),l.useEffect(()=>{h&&p==="guided"&&D.current&&(ce(),setTimeout(()=>K(h),100))},[h,p,ce,K]),a?e.jsxs(Wo,{children:[e.jsx(He,{children:e.jsx(_e,{onClick:r,"aria-label":"Voltar ao menu",children:"← Voltar"})}),e.jsxs(Ue,{children:[e.jsxs(Be,{children:[e.jsx("span",{children:"🎨"}),e.jsx("span",{children:"Pintura Criativa"})]}),e.jsxs(Ye,{children:["Modo: ",_o.find(v=>v.id===o)?.name||"Personalizado",h&&` • ${h.name}`]}),"        "]}),e.jsx(Ne,{children:H&&e.jsx($d,{className:H.type,initial:{opacity:0,x:300},animate:{opacity:1,x:0},exit:{opacity:0,x:300},children:H.message})}),e.jsxs(yd,{children:[e.jsx(Ct,{$active:p==="free",onClick:()=>{f("free"),d(null),m(null),X()},whileHover:{scale:1.02},whileTap:{scale:.98},children:"🎨 Pintura Livre"}),o!=="EASY"&&e.jsx(Ct,{$active:p==="guided",onClick:()=>{f("guided"),d(null),X()},whileHover:{scale:1.02},whileTap:{scale:.98},children:"📐 Pintura Guiada"}),e.jsx(Ct,{$active:p==="challenge",onClick:()=>{f("challenge"),m(null),X()},whileHover:{scale:1.02},whileTap:{scale:.98},children:"🏆 Desafios"})]}),e.jsxs(bd,{children:[e.jsxs(wd,{children:[e.jsxs(kd,{children:[e.jsx("h3",{children:"🖌️ Ferramentas"}),e.jsxs(Fd,{children:[e.jsx("label",{children:"Tamanho do Pincel"}),e.jsx(Td,{type:"range",min:"2",max:"50",value:A,onChange:v=>B(Number(v.target.value))}),e.jsx(Pd,{$size:Math.max(A,10),$color:w})]})]}),p==="guided"&&o!=="EASY"&&e.jsxs(Id,{children:[e.jsx("h3",{children:"📋 Templates"}),e.jsx(Od,{children:Object.keys(Go).map(v=>e.jsx(Rd,{$active:u===v,onClick:()=>{n(v),X()},children:v==="nature"?"🌿 Natureza":v==="animals"?"🐾 Animais":"💫 Emoções"},v))}),e.jsx(Ld,{children:Go[u]?.map(v=>e.jsxs(Jo,{$selected:h?.id===v.id,onClick:()=>ue(v),whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsx("h4",{children:v.name}),e.jsx("p",{children:v.description})]},v.id))})]}),p==="challenge"&&e.jsxs("div",{children:[e.jsx("h3",{children:"🏆 Desafios"}),xd.filter(v=>o==="EASY"?v.difficulty==="EASY":o==="MEDIUM"?["EASY","MEDIUM"].includes(v.difficulty):!0).map(v=>e.jsxs(Jo,{$selected:i?.id===v.id,onClick:()=>oe(v),whileHover:{scale:1.02},whileTap:{scale:.98},style:{marginBottom:"var(--space-sm)"},children:[e.jsx("h4",{children:v.title}),e.jsx("p",{children:v.description}),e.jsxs("small",{style:{color:"var(--text-secondary)"},children:["Min: ",v.minStrokes," traços, ",v.minColors," cores"]})]},v.id))]})]}),e.jsxs(jd,{children:[i&&e.jsxs(qo,{children:[e.jsx(Vo,{children:i.title}),e.jsx(Yo,{children:i.description}),e.jsxs(Dd,{children:["📏 Traços: ",S,"/",i.minStrokes," | 🎨 Cores: ",j.size,"/",i.minColors]})]}),h&&e.jsxs(qo,{children:[e.jsx(Vo,{children:h.name}),e.jsx(Yo,{children:h.description})]}),e.jsx(Sd,{ref:O,width:"600",height:"400",onMouseDown:I,onMouseMove:N,onMouseUp:J,onMouseLeave:J,onTouchStart:I,onTouchMove:N,onTouchEnd:J}),e.jsxs(ir,{children:[e.jsx(Ce,{onClick:ce,whileHover:{scale:1.05},whileTap:{scale:.95},children:"🗑️ Limpar"}),o==="HARD"&&e.jsxs(Ce,{onClick:()=>b(!z),whileHover:{scale:1.05},whileTap:{scale:.95},children:["📊 ",z?"Ocultar":"Mostrar"," Métricas"]})]}),e.jsxs(zd,{children:[e.jsxs("span",{children:["🖌️ Traços: ",S]}),e.jsxs("span",{children:["🎨 Cores: ",j.size]}),e.jsx(Md,{children:[...Array(Math.min(Math.floor(S/5),5))].map((v,F)=>e.jsx("span",{children:"⭐"},F))})]})]}),e.jsxs(Cd,{children:[e.jsx("h3",{children:"🎨 Paleta de Cores"}),Object.entries(q()).map(([v,F])=>e.jsxs(Ud,{children:[e.jsx("h4",{children:v==="primary"?"Principais":v==="secondary"?"Secundárias":v==="natural"?"Naturais":v==="vibrant"?"Vibrantes":"Pastéis"}),e.jsx(Ad,{children:F.map(y=>e.jsx(Ed,{$color:y,$selected:w===y,onClick:()=>{U(y),X()},whileHover:{scale:1.1},whileTap:{scale:.95}},y))})]},v)),o==="HARD"&&z&&e.jsxs(Nd,{children:[e.jsx("h4",{children:"📊 Análise da Sessão"}),e.jsxs(Ea,{children:[e.jsx("span",{children:"Tempo de sessão:"}),e.jsxs("span",{children:[W?Math.floor((Date.now()-W)/1e3):0,"s"]})]}),e.jsxs(Ea,{children:[e.jsx("span",{children:"Diversidade de cores:"}),e.jsxs("span",{children:[Math.min(j.size*10,100),"%"]})]}),e.jsxs(Ea,{children:[e.jsx("span",{children:"Atividade criativa:"}),e.jsx("span",{children:S>20?"Alta":S>10?"Média":"Baixa"})]}),e.jsxs(Ea,{children:[e.jsx("span",{children:"Estilo de traço:"}),e.jsx("span",{children:A>20?"Expressivo":A>10?"Equilibrado":"Detalhado"})]})]})]})]})]}):e.jsxs(Wo,{children:[e.jsx(He,{children:e.jsx(_e,{onClick:r,"aria-label":"Voltar ao menu",children:"← Voltar"})}),e.jsxs(Ue,{children:[e.jsxs(Be,{children:[e.jsx("span",{children:"🎨"}),e.jsx("span",{children:"Pintura Criativa"})]}),e.jsx(Ye,{children:"Estúdio de Arte Digital - Expresse sua criatividade"})]}),e.jsxs(_.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},style:{textAlign:"center",padding:"var(--space-xl)"},children:[e.jsx("h2",{style:{color:"var(--text-primary)",marginBottom:"var(--space-lg)"},children:"Bem-vindo ao Estúdio de Arte Digital!"}),e.jsx(nr,{children:"Expresse sua criatividade através da pintura digital. Escolha cores, tamanhos de pincel e crie obras únicas!"}),e.jsxs(jr,{children:[e.jsx("h3",{children:"Escolha seu nível artístico:"}),_o.map(v=>e.jsxs(Sr,{$active:o===v.id,onClick:()=>{c(v.id),X()},children:[e.jsx("span",{style:{fontSize:"2rem",display:"block"},children:v.icon}),e.jsx("strong",{children:v.name}),e.jsx("small",{children:v.description}),e.jsx("div",{style:{fontSize:"var(--font-size-xs)",marginTop:"var(--space-xs)"},children:v.features.join(" • ")})]},v.id))]}),e.jsx(Ce,{onClick:V,whileHover:{scale:1.05},whileTap:{scale:.95},children:"🎨 Começar a Pintar"})]})]})},Hd=s.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-md);
  
  @media (max-width: 768px) {
    padding: var(--space-sm);
  }
`,ka=s(_.section)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  margin-bottom: var(--space-lg);
  box-shadow: var(--shadow-medium);
  
  @media (max-width: 768px) {
    padding: var(--space-lg);
    margin-bottom: var(--space-md);
  }
`,Ta=s.h2`
  font-size: var(--font-size-xl);
  color: var(--primary-blue);
  margin-bottom: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-md);
  }
`,Pa=s.div`
  line-height: 1.7;
  color: var(--dark-gray);
  font-size: var(--font-size-md);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-sm);
  }
`,Ko=s.div`
  background: linear-gradient(135deg, var(--primary-green), var(--primary-blue));
  color: white;
  padding: var(--space-lg);
  border-radius: var(--radius-medium);
  margin: var(--space-lg) 0;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: var(--space-md);
    margin: var(--space-md) 0;
  }
`,Xo=s.ul`
  list-style: none;
  padding: 0;
  margin: var(--space-lg) 0;
`,Ke=s.li`
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  padding: var(--space-sm);
  background: var(--light-gray);
  border-radius: var(--radius-medium);
  border-left: 4px solid var(--primary-green);
`,Xe=s.span`
  font-size: var(--font-size-lg);
  min-width: 24px;
`,Qe=s.span`
  font-size: var(--font-size-md);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-sm);
  }
`,_d=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-md);
  margin: var(--space-lg) 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }
`,za=s.div`
  background: white;
  padding: var(--space-lg);
  border-radius: var(--radius-medium);
  border: 2px solid var(--primary-purple);
  text-align: center;
  
  @media (max-width: 768px) {
    padding: var(--space-md);
  }
`,Ma=s.div`
  font-size: 2rem;
  margin-bottom: var(--space-sm);
`,Da=s.h4`
  font-size: var(--font-size-md);
  color: var(--primary-purple);
  margin-bottom: var(--space-sm);
  font-weight: 600;
`,$a=s.p`
  font-size: var(--font-size-sm);
  color: var(--medium-gray);
  line-height: 1.5;
`,Pe=s.span`
  display: inline-block;
  background: var(--primary-orange);
  color: white;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-large);
  font-size: var(--font-size-xs);
  font-weight: 600;
  margin: var(--space-xs) var(--space-xs) var(--space-xs) 0;
`;function Gd(){const r={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.2}}},a={hidden:{y:20,opacity:0},visible:{y:0,opacity:1,transition:{duration:.5}}};return e.jsx(Hd,{children:e.jsxs(_.div,{variants:r,initial:"hidden",animate:"visible",children:[e.jsxs(ka,{variants:a,children:[e.jsxs(Ta,{children:[e.jsx("span",{children:"🧠"}),"O que são Atividades Neuropedagógicas?"]}),e.jsxs(Pa,{children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Atividades neuropedagógicas"})," são intervenções estruturadas que estimulam o desenvolvimento cognitivo, emocional e social, especialmente para crianças com autismo, TDAH ou outras necessidades específicas."]}),e.jsxs("p",{children:["Elas combinam princípios da ",e.jsx("strong",{children:"neurociência"}),", ",e.jsx("strong",{children:"psicologia"})," e",e.jsx("strong",{children:"pedagogia"})," para promover habilidades essenciais como:"]}),e.jsxs(Xo,{children:[e.jsxs(Ke,{children:[e.jsx(Xe,{children:"🎯"}),e.jsxs(Qe,{children:[e.jsx("strong",{children:"Atenção e Concentração:"})," Melhorar o foco e a capacidade de manter a atenção"]})]}),e.jsxs(Ke,{children:[e.jsx(Xe,{children:"🧠"}),e.jsxs(Qe,{children:[e.jsx("strong",{children:"Memória:"})," Fortalecer a memória de trabalho e de longo prazo"]})]}),e.jsxs(Ke,{children:[e.jsx(Xe,{children:"🤔"}),e.jsxs(Qe,{children:[e.jsx("strong",{children:"Raciocínio Lógico:"})," Desenvolver habilidades de resolução de problemas"]})]}),e.jsxs(Ke,{children:[e.jsx(Xe,{children:"✋"}),e.jsxs(Qe,{children:[e.jsx("strong",{children:"Coordenação Motora:"})," Aprimorar habilidades motoras finas e grossas"]})]}),e.jsxs(Ke,{children:[e.jsx(Xe,{children:"😊"}),e.jsxs(Qe,{children:[e.jsx("strong",{children:"Regulação Emocional:"})," Aprender a identificar e gerenciar emoções"]})]})]})]})]}),e.jsxs(ka,{variants:a,children:[e.jsxs(Ta,{children:[e.jsx("span",{children:"🤖"}),"Como a Inteligência Artificial Potencializa o Aprendizado"]}),e.jsxs(Pa,{children:[e.jsxs(Ko,{children:[e.jsx("h3",{style:{margin:"0 0 var(--space-md) 0",fontSize:"var(--font-size-lg)"},children:"🚀 Todas as atividades do Portal Betina são desenvolvidas com IA"}),e.jsx("p",{style:{margin:0,fontSize:"var(--font-size-md)"},children:"Utilizamos inteligência artificial para criar experiências personalizadas, adaptativas e mais eficazes para cada criança."})]}),e.jsxs(_d,{children:[e.jsxs(za,{children:[e.jsx(Ma,{children:"🎯"}),e.jsx(Da,{children:"Personalização Inteligente"}),e.jsx($a,{children:"A IA adapta a dificuldade e o ritmo das atividades baseado no desempenho individual da criança"})]}),e.jsxs(za,{children:[e.jsx(Ma,{children:"📊"}),e.jsx(Da,{children:"Análise de Progresso"}),e.jsx($a,{children:"Algoritmos analisam padrões de aprendizado e fornecem insights sobre o desenvolvimento cognitivo"})]}),e.jsxs(za,{children:[e.jsx(Ma,{children:"🎮"}),e.jsx(Da,{children:"Engajamento Otimizado"}),e.jsx($a,{children:"IA determina os melhores momentos e tipos de feedback para manter a motivação e interesse"})]}),e.jsxs(za,{children:[e.jsx(Ma,{children:"🔄"}),e.jsx(Da,{children:"Adaptação Contínua"}),e.jsx($a,{children:"O sistema aprende continuamente com as interações, melhorando constantemente a experiência"})]})]})]})]}),e.jsxs(ka,{variants:a,children:[e.jsxs(Ta,{children:[e.jsx("span",{children:"⚙️"}),"Tecnologias e Metodologias Aplicadas"]}),e.jsxs(Pa,{children:[e.jsx("p",{children:"O Portal Betina utiliza tecnologias modernas e metodologias baseadas em evidências científicas:"}),e.jsxs("div",{style:{margin:"var(--space-lg) 0"},children:[e.jsx("h4",{style:{color:"var(--primary-blue)",marginBottom:"var(--space-md)"},children:"🧬 Base Científica"}),e.jsx(Pe,{children:"Neurociência Cognitiva"}),e.jsx(Pe,{children:"Psicologia do Desenvolvimento"}),e.jsx(Pe,{children:"Pedagogia Inclusiva"}),e.jsx(Pe,{children:"Terapia ABA"}),e.jsx(Pe,{children:"Neuroplasticidade"})]}),e.jsxs("div",{style:{margin:"var(--space-lg) 0"},children:[e.jsx("h4",{style:{color:"var(--primary-green)",marginBottom:"var(--space-md)"},children:"💻 Tecnologia"}),e.jsx(Pe,{children:"React + IA"}),e.jsx(Pe,{children:"Machine Learning"}),e.jsx(Pe,{children:"Design Responsivo"}),e.jsx(Pe,{children:"Acessibilidade Web"}),e.jsx(Pe,{children:"Progressive Web App"})]}),e.jsxs("div",{style:{margin:"var(--space-lg) 0"},children:[e.jsx("h4",{style:{color:"var(--primary-purple)",marginBottom:"var(--space-md)"},children:"🌈 Acessibilidade"}),e.jsx(Pe,{children:"Screen Reader"}),e.jsx(Pe,{children:"Alto Contraste"}),e.jsx(Pe,{children:"Navegação por Teclado"}),e.jsx(Pe,{children:"Feedback Háptico"}),e.jsx(Pe,{children:"WCAG 2.1 AA"})]})]})]}),e.jsxs(ka,{variants:a,children:[e.jsxs(Ta,{children:[e.jsx("span",{children:"👨‍👩‍👧‍👦"}),"Para Pais, Terapeutas e Educadores"]}),e.jsxs(Pa,{children:[e.jsx("p",{children:"O Portal Betina foi desenvolvido para ser uma ferramenta colaborativa entre famílias e profissionais:"}),e.jsxs(Xo,{children:[e.jsxs(Ke,{children:[e.jsx(Xe,{children:"👩‍⚕️"}),e.jsxs(Qe,{children:[e.jsx("strong",{children:"Para Terapeutas:"})," Ferramentas complementares para sessões presenciais e atividades para casa"]})]}),e.jsxs(Ke,{children:[e.jsx(Xe,{children:"👨‍🏫"}),e.jsxs(Qe,{children:[e.jsx("strong",{children:"Para Educadores:"})," Recursos para inclusão escolar e desenvolvimento de habilidades específicas"]})]}),e.jsxs(Ke,{children:[e.jsx(Xe,{children:"👨‍👩‍👧"}),e.jsxs(Qe,{children:[e.jsx("strong",{children:"Para Famílias:"})," Atividades estruturadas para momentos de qualidade e desenvolvimento em casa"]})]}),e.jsxs(Ke,{children:[e.jsx(Xe,{children:"🤝"}),e.jsxs(Qe,{children:[e.jsx("strong",{children:"Colaboração:"})," Dados e progresso compartilhados entre todos os envolvidos no cuidado da criança"]})]})]}),e.jsx(Ko,{children:e.jsxs("p",{style:{margin:0,fontSize:"var(--font-size-md)"},children:["💝 ",e.jsx("strong",{children:"100% Gratuito e Sempre Será"}),e.jsx("br",{}),"Acreditamos que toda criança merece acesso a ferramentas de qualidade para seu desenvolvimento, independentemente da condição socioeconômica da família."]})})]})]})]})})}const qd=async(r=null)=>{if(!r&&(r=localStorage.getItem("betina_user_id"),!r))return console.warn("Nenhum usuário identificado para gerar relatório"),null;const a=["memory-game","color-match","image-association","letter-recognition","number-counting","musical-sequence"],t={overallProgress:{totalSessions:0,totalScore:0,averageAccuracy:0,lastPlayed:null,mostPlayed:null,learningTrend:null},gameReports:{}};let o=0,c=0,i={},d=null,p=0;try{const f=[];for(const n of a){const g=await re.getGameSessions(r,n,50);if(g&&g.length>0){f.push(...g),i[n]=g.length;const E=g.reduce((L,j)=>L+j.accuracy,0)/g.length;c+=E*g.length;const w=g.reduce((L,j)=>L+j.score,0);p+=w;const U=g.sort((L,j)=>new Date(j.created_at)-new Date(L.created_at))[0],A=new Date(U.created_at);(!d||A>d)&&(d=A);const B=Fr(n);await B.loadHistory();const S=await ul(n);t.gameReports[n]={sessions:g.length,accuracy:E,currentDifficulty:U.difficulty||"MEDIUM",trend:B.calculateTrend("accuracy"),analysis:S}}else i[n]=0,t.gameReports[n]={sessions:0,accuracy:0,currentDifficulty:"MEDIUM",trend:0,analysis:{hasEnoughData:!1}}}o=f.length,t.overallProgress.totalSessions=o,t.overallProgress.averageAccuracy=o>0?c/o:0,t.overallProgress.lastPlayed=d?d.toLocaleDateString():null;let h=0,m=null;Object.entries(i).forEach(([n,g])=>{g>h&&(h=g,m=n)}),t.overallProgress.mostPlayed=m;const u=Object.values(t.gameReports).map(n=>n.trend).filter(n=>n!==null);if(u.length>0){const n=u.reduce((g,E)=>g+E,0)/u.length;t.overallProgress.learningTrend=n}}catch(f){console.error("Erro ao buscar dados do banco:",f),t.overallProgress.totalSessions=0,t.overallProgress.averageAccuracy=0,t.overallProgress.lastPlayed=null,t.overallProgress.mostPlayed=null,t.overallProgress.learningTrend=0}return t},Vd=r=>{if(!r)return[];const a=[];if(Object.entries(r.gameReports).forEach(([t,o])=>{o.sessions===0?a.push({type:"new-game",gameId:t,message:`Experimente o jogo ${At(t)} para melhorar habilidades diferentes!`}):o.accuracy<50&&o.sessions>2?a.push({type:"practice-needed",gameId:t,message:`Continue praticando ${At(t)} para melhorar suas habilidades.`}):o.trend>.1&&a.push({type:"improving",gameId:t,message:`Você está melhorando em ${At(t)}! Continue assim!`})}),r.gameReports["letter-recognition"]?.analysis?.strugglingLetters?.length>0){const t=r.gameReports["letter-recognition"].analysis.strugglingLetters.join(", ");a.push({type:"focus-area",gameId:"letter-recognition",message:`Praticar mais as letras: ${t}`})}return r.overallProgress.learningTrend>.05?a.push({type:"general",message:"Seu progresso está ótimo! Continue jogando regularmente para desenvolver suas habilidades."}):r.overallProgress.learningTrend<-.05&&a.push({type:"general",message:"Tente jogar por períodos mais curtos, mas com mais frequência para melhorar seu aprendizado."}),a},At=r=>({"memory-game":"Jogo da Memória","color-match":"Combinar Cores","image-association":"Associação de Imagens","letter-recognition":"Reconhecimento de Letras","number-counting":"Números e Contagem","musical-sequence":"Sequência Musical"})[r]||r,Yd=async(r=null)=>{if(!r&&(r=localStorage.getItem("betina_user_id"),!r))return console.warn("Nenhum usuário identificado para obter resumo"),{totalSessions:0,averageAccuracy:0,gamesPlayed:0,lastActivity:null,skillsProgress:{cores:0,memoria:0,coordenacao:0,reconhecimento:0,matematica:0,musicalidade:0}};try{const a=["memory-game","color-match","image-association","letter-recognition","number-counting","musical-sequence"];let t=0,o=0,c=0,i=null;const d={cores:0,memoria:0,coordenacao:0,reconhecimento:0,matematica:0,musicalidade:0};for(const f of a){const h=localStorage.getItem(`betina_game_${f}_${r}`);if(h){const u=JSON.parse(h).sessions||[];if(u.length>0){c++,t+=u.length;const n=u.reduce((E,w)=>E+(w.accuracy||0),0)/u.length;o+=n;const g=u[u.length-1];if(g&&g.timestamp){const E=new Date(g.timestamp);(!i||E>i)&&(i=E)}switch(f){case"color-match":d.cores=Math.min(100,n);break;case"memory-game":d.memoria=Math.min(100,n);break;case"image-association":d.coordenacao=Math.min(100,n);break;case"letter-recognition":d.reconhecimento=Math.min(100,n);break;case"number-counting":d.matematica=Math.min(100,n);break;case"musical-sequence":d.musicalidade=Math.min(100,n);break}}}}const p=c>0?o/c:0;return{totalSessions:t,averageAccuracy:Math.round(p*100)/100,gamesPlayed:c,lastActivity:i?i.toISOString():null,skillsProgress:d}}catch(a){return console.error("Erro ao obter resumo de progresso:",a),{totalSessions:0,averageAccuracy:0,gamesPlayed:0,lastActivity:null,skillsProgress:{cores:0,memoria:0,coordenacao:0,reconhecimento:0,matematica:0,musicalidade:0}}}},Jd=s.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  margin: var(--space-lg) 0;
  box-shadow: var(--shadow-medium);
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`,Et=s.h2`
  font-size: var(--font-size-xl);
  color: var(--primary-blue);
  margin-bottom: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`,Wd=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
`,Qo=s.div`
  background: white;
  border-radius: var(--radius-medium);
  padding: var(--space-lg);
  box-shadow: var(--shadow-light);
  border-left: 4px solid ${r=>r.color||"var(--primary-blue)"};
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`,Zo=s.h3`
  font-size: var(--font-size-lg);
  color: ${r=>r.color||"var(--primary-blue)"};
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
`,Ze=s.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed var(--light-gray);
  padding-bottom: var(--space-xs);
  margin-bottom: var(--space-xs);
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`,er=s.span`
  color: var(--dark-gray);
  font-weight: 500;
`,rr=s.span`
  color: var(--primary-blue);
  font-weight: 600;
`,Kd=s.ul`
  list-style-type: none;
  padding: 0;
  margin: 0 0 var(--space-xl);
`,Xd=s.li`
  background: ${r=>{switch(r.type){case"new-game":return"var(--primary-blue-light)";case"practice-needed":return"var(--primary-orange-light)";case"improving":return"var(--success-light)";case"focus-area":return"var(--primary-purple-light)";default:return"var(--light-gray)"}}};
  padding: var(--space-md);
  margin-bottom: var(--space-md);
  border-radius: var(--radius-medium);
  border-left: 4px solid ${r=>{switch(r.type){case"new-game":return"var(--primary-blue)";case"practice-needed":return"var(--primary-orange)";case"improving":return"var(--primary-green)";case"focus-area":return"var(--primary-purple)";default:return"var(--medium-gray)"}}};
  display: flex;
  align-items: center;
  gap: var(--space-md);
  box-shadow: var(--shadow-light);
`,Qd=s.div`
  font-size: 1.5rem;
`,Zd=s.p`
  margin: 0;
  color: var(--dark-gray);
  font-weight: 500;
  flex: 1;
`,es=s.div`
  text-align: center;
  padding: var(--space-xl);
  background: var(--light-gray);
  border-radius: var(--radius-large);
  color: var(--medium-gray);
  font-size: var(--font-size-lg);
  margin: var(--space-xl) 0;
`,em=s(_.button)`
  background: var(--primary-blue);
  color: white;
  border: none;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-medium);
  cursor: pointer;
  font-size: var(--font-size-md);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  align-self: flex-start;
  margin-bottom: var(--space-lg);
  
  &:hover {
    background: var(--primary-purple);
  }
`,rm=s(_.button)`
  background: var(--primary-green);
  color: white;
  border: none;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-medium);
  cursor: pointer;
  font-size: var(--font-size-md);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-top: var(--space-md);
  
  &:hover {
    background: var(--success);
  }
`,rs={"memory-game":"🧠","color-match":"🌈","image-association":"🖼️","letter-recognition":"📚","number-counting":"🔢","musical-sequence":"🎵"},as={"memory-game":"var(--primary-blue)","color-match":"var(--primary-green)","image-association":"var(--primary-orange)","letter-recognition":"var(--primary-pink)","number-counting":"var(--primary-cyan)","musical-sequence":"var(--primary-purple)"},am={"new-game":"🆕","practice-needed":"🔍",improving:"📈","focus-area":"🎯",general:"💡"};function tm({onBack:r}){const[a,t]=l.useState(null),[o,c]=l.useState([]);l.useEffect(()=>{const f=qd();t(f);const h=Vd(f);c(h)},[]);const i=()=>{try{const{exportProgressData:f}=require("../../utils/progressReports"),h=f();if(!h){alert("Não foi possível exportar os dados");return}const m=new Blob([h],{type:"application/json"}),u=URL.createObjectURL(m),n=document.createElement("a");n.href=u,n.download=`progresso-betina-${new Date().toISOString().slice(0,10)}.json`,n.click(),setTimeout(()=>URL.revokeObjectURL(u),100)}catch(f){console.error("Erro ao exportar dados:",f),alert("Ocorreu um erro ao exportar os dados")}},d=a&&a.overallProgress.totalSessions>0,p=f=>f==null?"—":f>.05?"📈 Melhorando":f<-.05?"📉 Precisa de atenção":"📊 Estável";return e.jsxs(Jd,{children:[e.jsx(em,{onClick:r,whileHover:{scale:1.05},whileTap:{scale:.95},children:"⬅️ Voltar"}),e.jsxs(Et,{children:[e.jsx("span",{children:"📊"}),"Relatório de Progresso"]}),d?e.jsxs(e.Fragment,{children:[e.jsxs(Qo,{color:"var(--primary-purple)",children:[e.jsx(Zo,{color:"var(--primary-purple)",children:"📈 Progresso Geral"}),e.jsxs(Ze,{children:[e.jsx(er,{children:"Total de Sessões"}),e.jsx(rr,{children:a.overallProgress.totalSessions})]}),e.jsxs(Ze,{children:[e.jsx(er,{children:"Acurácia Média"}),e.jsxs(rr,{children:[Math.round(a.overallProgress.averageAccuracy),"%"]})]}),e.jsxs(Ze,{children:[e.jsx(er,{children:"Tendência de Aprendizado"}),e.jsx(rr,{children:p(a.overallProgress.learningTrend)})]}),e.jsxs(Ze,{children:[e.jsx(er,{children:"Jogo Mais Jogado"}),e.jsx(rr,{children:a.overallProgress.mostPlayed?`${rs[a.overallProgress.mostPlayed]} ${ts(a.overallProgress.mostPlayed)}`:"—"})]}),e.jsxs(Ze,{children:[e.jsx(er,{children:"Último Jogo"}),e.jsx(rr,{children:a.overallProgress.lastPlayed||"—"})]})]}),e.jsxs(Et,{children:[e.jsx("span",{children:"💡"}),"Sugestões Personalizadas"]}),o.length>0?e.jsx(Kd,{children:o.map((f,h)=>e.jsxs(Xd,{type:f.type,children:[e.jsx(Qd,{children:am[f.type]}),e.jsx(Zd,{children:f.message})]},h))}):e.jsx(es,{children:"Continue jogando para receber sugestões personalizadas."}),e.jsxs(Et,{children:[e.jsx("span",{children:"🎮"}),"Progresso por Jogo"]}),e.jsx(Wd,{children:Object.entries(a.gameReports).map(([f,h])=>e.jsxs(Qo,{color:as[f],children:[e.jsxs(Zo,{color:as[f],children:[e.jsx("span",{children:rs[f]}),ts(f)]}),e.jsxs(Ze,{children:[e.jsx(er,{children:"Sessões"}),e.jsx(rr,{children:h.sessions})]}),e.jsxs(Ze,{children:[e.jsx(er,{children:"Acurácia"}),e.jsx(rr,{children:h.accuracy?`${Math.round(h.accuracy)}%`:"—"})]}),e.jsxs(Ze,{children:[e.jsx(er,{children:"Tendência"}),e.jsx(rr,{children:p(h.trend)})]}),e.jsxs(Ze,{children:[e.jsx(er,{children:"Dificuldade Atual"}),e.jsx(rr,{children:om(h.currentDifficulty)})]})]},f))}),e.jsx(rm,{onClick:i,whileHover:{scale:1.05},whileTap:{scale:.95},children:"💾 Exportar Relatório de Progresso"})]}):e.jsxs(es,{children:["Ainda não há dados de progresso suficientes.",e.jsx("br",{}),"Continue jogando para gerar um relatório completo!"]})]})}function ts(r){return{"memory-game":"Jogo da Memória","color-match":"Combinar Cores","image-association":"Associação de Imagens","letter-recognition":"Reconhecimento de Letras","number-counting":"Números e Contagem","musical-sequence":"Sequência Musical"}[r]||r}function om(r){return{EASY:"Fácil",MEDIUM:"Médio",HARD:"Difícil",easy:"Fácil",medium:"Médio",hard:"Difícil"}[r]||r}const sm=s.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  margin: var(--space-lg) 0;
  box-shadow: var(--shadow-medium);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    padding: var(--space-md);
    margin: var(--space-md) var(--space-sm);
  }
  
  @media (max-width: 480px) {
    padding: var(--space-sm);
    margin: var(--space-sm) var(--space-xs);
    border-radius: var(--radius-medium);
  }
  
  .profile-help-text {
    @media (max-width: 480px) {
      font-size: var(--font-size-xs);
    }
  }
`,im=s.h2`
  font-size: var(--font-size-xl);
  color: var(--primary-purple);
  margin-bottom: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-md);
  }
  
  @media (max-width: 480px) {
    font-size: var(--font-size-md);
    margin-bottom: var(--space-sm);
  }
`,nm=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: var(--space-md);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }
`,os=s(_.div)`
  background: white;
  border-radius: var(--radius-medium);
  padding: var(--space-lg);
  box-shadow: var(--shadow-light);
  border-left: 4px solid ${r=>r.active?"var(--primary-green)":"var(--primary-blue)"};
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-medium);
  }
  
  @media (max-width: 768px) {
    padding: var(--space-md);
  }
  
  @media (max-width: 480px) {
    padding: var(--space-sm);
    gap: var(--space-sm);
  }
`,cm=s.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: ${r=>r.color||"var(--primary-blue)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  margin: 0 auto var(--space-sm);
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 1.7rem;
  }
  
  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
`,lm=s.h3`
  font-size: var(--font-size-lg);
  color: var(--primary-blue);
  margin: 0;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: var(--font-size-md);
  }
  
  @media (max-width: 480px) {
    font-size: var(--font-size-sm);
  }
`,dm=s.p`
  font-size: var(--font-size-sm);
  color: var(--medium-gray);
  margin: 0;
  text-align: center;
  
  @media (max-width: 480px) {
    font-size: var(--font-size-xs);
  }
`,mm=s.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--primary-green);
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: var(--font-size-xs);
  font-weight: bold;
  
  @media (max-width: 480px) {
    font-size: calc(var(--font-size-xs) * 0.8);
    padding: 2px 6px;
    top: -6px;
    right: -6px;
  }
`,Xr=s.div`
  margin-bottom: var(--space-md);
  
  @media (max-width: 480px) {
    margin-bottom: var(--space-sm);
  }
`,Qr=s.label`
  display: block;
  font-size: var(--font-size-md);
  color: var(--dark-gray);
  margin-bottom: var(--space-xs);
  
  @media (max-width: 480px) {
    font-size: var(--font-size-sm);
  }
`,ss=s.input`
  width: 100%;
  padding: var(--space-md);
  border: 2px solid var(--light-gray);
  border-radius: var(--radius-medium);
  font-size: var(--font-size-md);
  
  &:focus {
    border-color: var(--primary-blue);
    outline: none;
  }
  
  @media (max-width: 480px) {
    padding: var(--space-sm);
    font-size: var(--font-size-sm);
    border-radius: var(--radius-small);
  }
`,pm=s.select`
  width: 100%;
  padding: var(--space-md);
  border: 2px solid var(--light-gray);
  border-radius: var(--radius-medium);
  font-size: var(--font-size-md);
  
  &:focus {
    border-color: var(--primary-blue);
    outline: none;
  }
  
  @media (max-width: 480px) {
    padding: var(--space-sm);
    font-size: var(--font-size-sm);
    border-radius: var(--radius-small);
  }
`,um=s.div`
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-lg);
  flex-wrap: wrap;
  gap: var(--space-sm);
  
  &.profile-buttons {
    margin-top: var(--space-md);
    
    @media (max-width: 768px) {
      gap: var(--space-xs);
    }
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
  
  @media (max-width: 380px) {
    &.profile-buttons {
      flex-direction: row;
    }
  }
`,Er=s(_.button)`
  padding: var(--space-md) var(--space-lg);
  border: none;
  border-radius: var(--radius-medium);
  font-size: var(--font-size-md);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  
  .button-icon {
    display: inline-flex;
  }
  
  .button-text {
    display: inline-flex;
  }
  
  @media (max-width: 768px) {
    padding: var(--space-sm) var(--space-md);
    font-size: var(--font-size-sm);
  }
  
  @media (max-width: 480px) {
    width: 100%;
    margin-bottom: var(--space-xs);
    padding: var(--space-sm);
    font-size: var(--font-size-sm);
  }
  
  @media (max-width: 380px) {
    .button-text {
      display: none;
    }
  }
  
  &.primary {
    background: var(--primary-blue);
    color: white;
  }
  
  &.secondary {
    background: var(--medium-gray);
    color: white;
  }
  
  &.success {
    background: var(--primary-green);
    color: white;
  }
  
  &.danger {
    background: var(--primary-red);
    color: white;
  }
`,gm=s.div`
  text-align: center;
  padding: var(--space-xl);
  background: var(--light-gray);
  border-radius: var(--radius-large);
  color: var(--medium-gray);
  font-size: var(--font-size-lg);
  margin: var(--space-xl) 0;
`,is=s(_.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-md);
  overflow-y: auto;
  
  @media (max-width: 480px) {
    padding: var(--space-xs);
    align-items: flex-start;
    padding-top: 50px;
  }
`,ns=s(_.div)`
  background: white;
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow-large);
  max-height: 90vh;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: var(--space-lg);
    max-width: 90%;
    border-radius: var(--radius-medium);
  }
  
  @media (max-width: 480px) {
    padding: var(--space-md);
    max-width: 100%;
    border-radius: var(--radius-medium);
    max-height: calc(100vh - 60px);
  }
`,cs=s.h3`
  font-size: var(--font-size-xl);
  color: var(--primary-blue);
  margin-top: 0;
  margin-bottom: var(--space-lg);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-md);
  }
  
  @media (max-width: 480px) {
    font-size: var(--font-size-md);
    margin-bottom: var(--space-sm);
  }
`,ls=s.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
  margin-top: var(--space-lg);
  
  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: var(--space-sm);
  }
`,hm=s.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(6, 1fr);
    gap: var(--space-xs);
  }
`,fm=s.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: ${r=>r.selected?"var(--primary-blue-light)":"var(--light-gray)"};
  border: 2px solid ${r=>r.selected?"var(--primary-blue)":"transparent"};
  
  &:hover {
    background: var(--primary-blue-light);
  }
  
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 0.9em;
  }
`,vm=s.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(6, 1fr);
    gap: var(--space-xs);
  }
`,xm=s.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  background: ${r=>r.color};
  border: 3px solid ${r=>r.selected?"var(--dark-gray)":"transparent"};
  
  &:hover {
    transform: scale(1.1);
  }
  
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
  }
`,ym=s(_.button)`
  background: var(--primary-blue);
  color: white;
  border: none;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-medium);
  cursor: pointer;
  font-size: var(--font-size-md);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  align-self: flex-start;
  margin-bottom: var(--space-lg);
  
  &:hover {
    background: var(--primary-purple);
  }
  
  @media (max-width: 768px) {
    padding: var(--space-sm) var(--space-md);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-md);
  }
  
  @media (max-width: 480px) {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--font-size-xs);
    margin-bottom: var(--space-sm);
  }
`,bm=s.div`
  font-size: 3rem;
  color: var(--primary-blue);
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`,wm=s.div`
  color: var(--primary-blue);
  font-weight: bold;
  margin-top: 10px;
  text-align: center;
`,jm=["👧","👦","🧒","👶","🧑","👩","👨","🐱","🐶","🐰","🦁","🐼","🦊","🐢","🐬"],Sm=["var(--primary-blue)","var(--primary-green)","var(--primary-orange)","var(--primary-pink)","var(--primary-purple)","var(--primary-cyan)","#FF5733","#33FF57","#3357FF","#FF33A8"];function Cm({onBack:r}){const{userId:a,isDbConnected:t,getUserProfiles:o,createUserProfile:c,updateUserProfile:i,deleteUserProfile:d,activateUserProfile:p,getActiveUserProfile:f}=xr(),[h,m]=l.useState([]),[u,n]=l.useState(!0),[g,E]=l.useState(!1),[w,U]=l.useState(null),[A,B]=l.useState({name:"",age:"",icon:"👧",color:"var(--primary-blue)",accessibilityLevel:"medium"}),[S,L]=l.useState(!1),[j,k]=l.useState(null);l.useEffect(()=>{t?(async()=>{n(!0);try{const O=await o();m(O||[])}catch(O){console.error("Erro ao carregar perfis:",O)}finally{n(!1)}})():n(!1)},[o,t]);const M=()=>{U(null),B({name:"",age:"",icon:"👧",color:"var(--primary-blue)",accessibilityLevel:"medium"}),E(!0)},P=b=>{U(b),B({name:b.profile_name||"",age:b.age_range?b.age_range.split("-")[0]:"",icon:b.profile_icon||"👧",color:b.profile_color||"var(--primary-blue)",accessibilityLevel:b.preferences?.accessibilityLevel||"medium"}),E(!0)},W=b=>{k(b),L(!0)},Q=async()=>{if(!A.name){alert("Por favor, digite um nome para o perfil.");return}try{const b={profile_name:A.name,profile_icon:A.icon,profile_color:A.color,age_range:A.age?`${A.age}-${A.age}`:null,special_needs:[],preferences:{age:A.age,accessibilityLevel:A.accessibilityLevel,createdAt:new Date().toISOString()}};let O;if(w?O=await i(w.id,b):O=await c(b),O){const D=await o();m(D||[]),E(!1)}else alert("Erro ao salvar o perfil. Tente novamente.")}catch(b){console.error("Erro ao salvar perfil:",b),alert("Ocorreu um erro ao salvar o perfil. Tente novamente.")}},H=async()=>{if(j)try{await d(j.id);const b=await o();m(b||[]),L(!1),k(null)}catch(b){console.error("Erro ao excluir perfil:",b);const O=b.message||"Ocorreu um erro ao excluir o perfil. Tente novamente.";alert(O)}},T=async b=>{try{await p(b.id);const O=await o();m(O||[])}catch(O){console.error("Erro ao trocar de perfil:",O),alert("Ocorreu um erro ao trocar de perfil. Tente novamente.")}},z=b=>{const{name:O,value:D}=b.target;B(Y=>({...Y,[O]:D}))};return e.jsxs(sm,{children:[e.jsx(ym,{onClick:r,whileHover:{scale:1.05},whileTap:{scale:.95},children:"⬅️ Voltar"}),e.jsxs(im,{children:[e.jsx("span",{children:"👤"}),"Perfis de Usuário"]}),u?e.jsx("div",{children:"Carregando perfis..."}):t?e.jsxs(e.Fragment,{children:["          ",e.jsxs(nm,{children:[h.map(b=>e.jsxs(os,{active:b.is_active,whileHover:{y:-5},whileTap:{scale:.98},onClick:()=>T(b),children:[b.is_active&&e.jsx(mm,{children:"Ativo"}),e.jsx(cm,{color:b.profile_color||"var(--primary-blue)",children:b.profile_icon||"👤"}),e.jsx(lm,{children:b.profile_name||"Sem nome"}),e.jsx(dm,{children:b.age_range||"Idade não informada"}),e.jsxs(um,{className:"profile-buttons",children:[e.jsxs(Er,{className:"secondary",onClick:O=>{O.stopPropagation(),P(b)},whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx("span",{className:"button-icon",children:"✏️"}),e.jsx("span",{className:"button-text",children:"Editar"})]}),"                  ",e.jsxs(Er,{className:"danger",onClick:O=>{O.stopPropagation(),W(b)},whileHover:{scale:1.05},whileTap:{scale:.95},style:{cursor:"pointer"},title:"Excluir perfil",children:[e.jsx("span",{className:"button-icon",children:"🗑️"}),e.jsx("span",{className:"button-text",children:"Excluir"})]})]})]},b.id)),"              ",e.jsxs(os,{whileHover:{y:-5},whileTap:{scale:.98},onClick:M,style:{justifyContent:"center",alignItems:"center",height:"auto",minHeight:"200px",padding:"20px"},children:[e.jsx(bm,{children:"+"}),e.jsx(wm,{children:"Adicionar Perfil"})]})]}),"          ",e.jsxs("div",{style:{textAlign:"center",marginTop:"var(--space-xl)",color:"var(--medium-gray)",padding:"0 var(--space-md)"},className:"profile-help-text",children:[e.jsx("p",{children:"Os perfis permitem salvar o progresso de múltiplos usuários. Cada perfil terá suas próprias preferências e histórico de atividades."}),e.jsx("p",{children:"Clique em um perfil para ativá-lo ou use os botões para editar e excluir."})]})]}):e.jsxs(gm,{children:["A funcionalidade de múltiplos perfis requer conexão com o banco de dados.",e.jsx("br",{}),e.jsx("br",{}),"Por favor, inicie o portal no modo Docker para usar esta função."]}),e.jsx(Ne,{children:g&&e.jsx(is,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>E(!1),children:e.jsxs(ns,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},onClick:b=>b.stopPropagation(),children:["              ",e.jsx(cs,{children:w?`Editar Perfil: ${w.profile_name}`:"Novo Perfil"}),e.jsxs(Xr,{children:[e.jsx(Qr,{children:"Nome"}),e.jsx(ss,{type:"text",name:"name",value:A.name,onChange:z,placeholder:"Digite o nome"})]}),e.jsxs(Xr,{children:[e.jsx(Qr,{children:"Idade"}),e.jsx(ss,{type:"number",name:"age",value:A.age,onChange:z,placeholder:"Digite a idade",min:"1",max:"18"})]}),e.jsxs(Xr,{children:[e.jsx(Qr,{children:"Ícone"}),e.jsx(hm,{children:jm.map((b,O)=>e.jsx(fm,{selected:A.icon===b,onClick:()=>B(D=>({...D,icon:b})),children:b},O))})]}),e.jsxs(Xr,{children:[e.jsx(Qr,{children:"Cor do Perfil"}),e.jsx(vm,{children:Sm.map((b,O)=>e.jsx(xm,{color:b,selected:A.color===b,onClick:()=>B(D=>({...D,color:b}))},O))})]}),e.jsxs(Xr,{children:[e.jsx(Qr,{children:"Nível de Acessibilidade"}),e.jsxs(pm,{name:"accessibilityLevel",value:A.accessibilityLevel,onChange:z,children:[e.jsx("option",{value:"low",children:"Básico - Poucas adaptações"}),e.jsx("option",{value:"medium",children:"Médio - Adaptações padrão"}),e.jsx("option",{value:"high",children:"Alto - Máxima assistência"})]})]}),e.jsxs(ls,{children:[e.jsx(Er,{className:"secondary",onClick:()=>E(!1),whileHover:{scale:1.05},whileTap:{scale:.95},children:"Cancelar"}),e.jsx(Er,{className:"primary",onClick:Q,whileHover:{scale:1.05},whileTap:{scale:.95},children:w?"Salvar Alterações":"Criar Perfil"})]})]})})}),e.jsx(Ne,{children:S&&e.jsx(is,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>L(!1),children:e.jsxs(ns,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},onClick:b=>b.stopPropagation(),children:["              ",e.jsx(cs,{children:"Confirmar Exclusão"}),e.jsxs("p",{children:['Tem certeza que deseja excluir o perfil "',j?.profile_name,'"?']}),e.jsx("p",{children:"Esta ação não pode ser desfeita."}),e.jsxs(ls,{children:[e.jsx(Er,{className:"secondary",onClick:()=>L(!1),whileHover:{scale:1.05},whileTap:{scale:.95},children:"Cancelar"}),e.jsx(Er,{className:"danger",onClick:H,whileHover:{scale:1.05},whileTap:{scale:.95},children:"Excluir Perfil"})]})]})})})]})}oi.register(si,ii,ni,ci,li,di,mi,pi,ui,gi);const Am=s.div`
  padding: var(--space-xl);
  max-width: 1400px;
  margin: 0 auto;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.92));
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-strong);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-purple), var(--primary-pink), var(--primary-orange));
  }

  @media (max-width: 768px) {
    padding: var(--space-lg);
    margin: var(--space-md);
  }
`,Em=s.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xxl);
  flex-wrap: wrap;
  gap: var(--space-lg);
  padding-bottom: var(--space-lg);
  border-bottom: 2px solid rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: var(--space-md);
  }
`,km=s.h2`
  font-size: var(--font-size-xxl);
  color: var(--primary-purple);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: var(--font-size-xl);
    justify-content: center;
  }
`,Zr=s.div`
  margin-bottom: var(--space-xxl);
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  box-shadow: var(--shadow-medium);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`,ea=s.h3`
  font-size: var(--font-size-xl);
  color: var(--primary-purple);
  margin-bottom: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);

  &::after {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg, var(--primary-purple), transparent);
    margin-left: var(--space-md);
  }
`,Tm=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: var(--space-xl);
  margin-bottom: var(--space-xxl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
`,Ia=s.div`
  background: rgba(255, 255, 255, 0.98);
  border-radius: var(--radius-large);
  padding: var(--space-lg);
  box-shadow: var(--shadow-medium);
  height: 350px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-purple));
  }
`,Pm=s.div`
  display: flex;
  gap: var(--space-lg);
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: var(--space-xxl);
  padding: var(--space-lg);
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-medium);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-md);
  }
`,ds=s.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);

  label {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--dark-gray);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`,ms=s.select`
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-medium);
  border: 2px solid rgba(0, 0, 0, 0.1);
  background: white;
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  min-width: 180px;

  &:focus {
    outline: none;
    border-color: var(--primary-blue);
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  }

  &:hover {
    border-color: var(--primary-purple);
  }
`,ps=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
`,kr=s(_.div)`
  background: linear-gradient(135deg, ${r=>r.$bgColor||"var(--primary-blue)"}, ${r=>r.$bgColor?`${r.$bgColor}dd`:"var(--primary-blue)dd"});
  color: white;
  padding: var(--space-lg);
  border-radius: var(--radius-large);
  text-align: center;
  box-shadow: var(--shadow-medium);
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--space-sm);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    transform: rotate(45deg);
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: var(--shadow-strong);
  }
`,Tr=s.div`
  font-size: var(--font-size-xxl);
  font-weight: 800;
  margin-bottom: var(--space-xs);
  position: relative;
  z-index: 1;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
`,Pr=s.div`
  font-size: var(--font-size-sm);
  opacity: 0.95;
  font-weight: 600;
  position: relative;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`,us=s.div`
  text-align: center;
  padding: var(--space-xl);
  color: var(--medium-gray);
  font-style: italic;
`,gs=s.button`
  padding: var(--space-sm) var(--space-md);
  background: var(--primary-blue);
  color: white;
  border: none;
  border-radius: var(--radius-medium);
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background: var(--primary-purple);
  }
`,zm=()=>{const{userId:r,isDbConnected:a,userDetails:t}=xr(),[o,c]=l.useState("30d"),[i,d]=l.useState("all"),[p,f]=l.useState([]),[h,m]=l.useState(!0),[u,n]=l.useState(null),[g,E]=l.useState({totalSessions:0,avgAccuracy:0,avgScore:0,totalTimeSpent:0});l.useEffect(()=>{(async()=>{if(!r||!a){m(!1);return}m(!0);try{const b=na();n(b);let O=[];try{i==="all"?O=await re.getGameSessions(r,null,100):O=await re.getGameSessions(r,i,100)}catch(Y){console.error("Erro ao buscar sessões de jogo:",Y),O=[]}const D=w(O,o);if(f(D),D.length>0){const Y=U(D);E(Y)}}catch(b){console.error("Erro ao buscar dados do dashboard:",b)}finally{m(!1)}})()},[r,a,o,i]);const w=(z,b)=>{if(b==="all")return z;const O=new Date;let D;switch(b){case"7d":D=7;break;case"30d":D=30;break;case"90d":D=90;break;default:D=30}const Y=new Date(O.setDate(O.getDate()-D));return z.filter(X=>new Date(X.created_at)>=Y)},U=z=>{const b=z.length,O=z.reduce((X,G)=>X+G.accuracy,0)/b,D=z.reduce((X,G)=>X+G.score,0)/b,Y=z.reduce((X,G)=>X+G.time_spent,0);return{totalSessions:b,avgAccuracy:O,avgScore:D,totalTimeSpent:Y}},A=()=>{if(!p||p.length===0)return null;const z={};p.forEach(G=>{z[G.game_id]||(z[G.game_id]=[]),z[G.game_id].push(G)});const b=new Map;p.forEach(G=>{const me=new Date(G.created_at).toLocaleDateString();b.has(me)||b.set(me,{count:0,totalScore:0,avgScore:0});const ne=b.get(me);ne.count++,ne.totalScore+=G.score,ne.avgScore=ne.totalScore/ne.count});const O=Array.from(b.keys()),D=O.map(G=>b.get(G).avgScore),Y=Object.entries(z).map(([G,me])=>({gameId:G,avgScore:me.reduce((ne,pe)=>ne+pe.score,0)/me.length,totalSessions:me.length})),X=["rgba(75, 192, 192, 0.6)","rgba(255, 99, 132, 0.6)","rgba(54, 162, 235, 0.6)","rgba(255, 206, 86, 0.6)","rgba(153, 102, 255, 0.6)","rgba(255, 159, 64, 0.6)"];return{lineData:{labels:O,datasets:[{label:"Pontuação Média",data:D,borderColor:"rgba(75, 192, 192, 1)",backgroundColor:"rgba(75, 192, 192, 0.2)",tension:.3,fill:!0}]},barData:{labels:Y.map(G=>S(G.gameId)),datasets:[{label:"Pontuação Média",data:Y.map(G=>G.avgScore),backgroundColor:X}]},pieData:{labels:Y.map(G=>S(G.gameId)),datasets:[{label:"Total de Sessões",data:Y.map(G=>G.totalSessions),backgroundColor:X}]},radarData:B()}},B=()=>{const z={memory:{memória:90,concentração:80,atenção:70,reconhecimento:40},colorMatch:{cores:90,categorização:70,visual:80,rapidez:60},imageAssociation:{lógica:80,associação:90,classificação:70,visual:60},letterRecognition:{letras:90,fonética:80,linguagem:85,memória:50},numberCounting:{números:90,contagem:85,matemática:70,sequências:60},musicalSequence:{audição:85,sequências:80,ritmo:90,memória:70}},b={memória:0,concentração:0,atenção:0,lógica:0,associação:0,visual:0,reconhecimento:0,categorização:0,rapidez:0,letras:0,fonética:0,linguagem:0,números:0,contagem:0,matemática:0,sequências:0,audição:0,ritmo:0};let O={};p.forEach(Y=>{const X=Y.game_id;if(z[X]&&!O[X]){O[X]=!0;const G=Y.accuracy/100;Object.entries(z[X]).forEach(([me,ne])=>{b[me]!==void 0&&(b[me]+=ne*G)})}}),Object.keys(b).forEach(Y=>{b[Y]=Math.min(Math.round(b[Y]),100)});const D=Object.fromEntries(Object.entries(b).filter(([Y,X])=>X>0));return{labels:Object.keys(D),datasets:[{label:"Nível de Habilidade",data:Object.values(D),backgroundColor:"rgba(255, 99, 132, 0.2)",borderColor:"rgba(255, 99, 132, 1)",pointBackgroundColor:"rgba(255, 99, 132, 1)"}]}},S=z=>({memory:"Jogo da Memória",colorMatch:"Combinar Cores",imageAssociation:"Associação de Imagens",letterRecognition:"Reconhecimento de Letras",numberCounting:"Contagem de Números",musicalSequence:"Sequência Musical"})[z]||z,L=z=>{const b=Math.floor(z/3600),O=Math.floor(z%3600/60);return b>0?`${b}h ${O}min`:`${O} minutos`},j=[{value:"all",label:"Todos os Jogos"},{value:"memory",label:"Jogo da Memória"},{value:"colorMatch",label:"Combinar Cores"},{value:"imageAssociation",label:"Associação de Imagens"},{value:"letterRecognition",label:"Reconhecimento de Letras"},{value:"numberCounting",label:"Contagem de Números"},{value:"musicalSequence",label:"Sequência Musical"}],k=[{value:"7d",label:"Últimos 7 dias"},{value:"30d",label:"Últimos 30 dias"},{value:"90d",label:"Últimos 90 dias"},{value:"all",label:"Todo o período"}],M=A(),P={responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"top"},tooltip:{callbacks:{label:function(z){let b=z.dataset.label||"";return b&&(b+=": "),z.parsed.y!==null&&(b+=z.parsed.y.toFixed(1)),b}}}}},W={...P,scales:{y:{beginAtZero:!0}}},Q={hidden:{opacity:0,y:20},visible:z=>({opacity:1,y:0,transition:{delay:z*.1}})},H=async()=>{if(!(!r||!a))try{const z=await Yd(r);console.log("Resumo de progresso gerado:",z),alert("Relatório de progresso gerado com sucesso!")}catch(z){console.error("Erro ao gerar relatório:",z),alert("Houve um erro ao gerar o relatório de progresso.")}},T=()=>{const z=yr(),b={"memory-game":"🧠 Jogo da Memória","color-match":"🌈 Combinar Cores","image-association":"🧩 Associação de Imagens","musical-sequence":"🎵 Sequência Musical","letter-recognition":"📚 Reconhecimento de Letras","number-counting":"🔢 Números e Contagem"},O=Object.entries(z).filter(([D,Y])=>typeof Y=="number"&&!D.includes("_lastPlayed")).map(([D,Y])=>({gameId:D,name:b[D]||D,count:Y,lastPlayed:z[`${D}_lastPlayed`]})).sort((D,Y)=>Y.count-D.count);return O.length===0?e.jsx("p",{style:{textAlign:"center",color:"var(--medium-gray)"},children:"Nenhum jogo foi jogado ainda."}):e.jsx("div",{style:{display:"grid",gap:"var(--space-xs)"},children:O.map((D,Y)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"var(--space-xs) var(--space-sm)",background:Y<3?"var(--primary-blue)":"var(--light-gray)",color:Y<3?"white":"var(--dark-gray)",borderRadius:"var(--radius-small)",fontSize:"var(--font-size-sm)"},children:[e.jsxs("span",{children:[Y===0&&"🥇",Y===1&&"🥈",Y===2&&"🥉",Y>2&&`${Y+1}º`," ",D.name]}),e.jsxs("span",{style:{fontWeight:"bold"},children:[D.count,"x",D.lastPlayed&&e.jsxs("span",{style:{fontSize:"0.8em",opacity:.8,marginLeft:"4px"},children:["(",new Date(D.lastPlayed).toLocaleDateString(),")"]})]})]},D.gameId))})};return e.jsxs(Am,{children:[e.jsxs(Em,{children:[e.jsxs("div",{children:[e.jsxs(km,{children:[e.jsx("span",{role:"img","aria-label":"gráfico",children:"📊"})," Dashboard de Desempenho"]}),e.jsxs("p",{children:["Visualize o progresso e análise de desempenho de ",t?.display_name||"Usuário"]})]}),e.jsx(gs,{onClick:H,children:"Gerar Relatório Completo"})]}),a?e.jsxs(e.Fragment,{children:[e.jsxs(Pm,{children:[e.jsxs(ds,{children:[e.jsx("label",{htmlFor:"timeframe",children:"📅 Período"}),e.jsx(ms,{id:"timeframe",value:o,onChange:z=>c(z.target.value),children:k.map(z=>e.jsx("option",{value:z.value,children:z.label},z.value))})]}),e.jsxs(ds,{children:[e.jsx("label",{htmlFor:"gameFilter",children:"🎮 Jogo"}),e.jsx(ms,{id:"gameFilter",value:i,onChange:z=>d(z.target.value),children:j.map(z=>e.jsx("option",{value:z.value,children:z.label},z.value))})]})]}),h?e.jsx("div",{children:"Carregando dados..."}):p.length===0?e.jsxs(us,{children:[e.jsx("p",{children:"Nenhum dado de jogo encontrado para o período selecionado."}),e.jsx("p",{children:"Complete algumas atividades para visualizar seu progresso!"})]}):e.jsxs(e.Fragment,{children:[e.jsxs(ps,{children:[e.jsxs(kr,{$bgColor:"var(--primary-blue)",variants:Q,custom:0,initial:"hidden",animate:"visible",children:[e.jsx(Tr,{children:g.totalSessions}),e.jsx(Pr,{children:"Sessões de Jogo"})]}),e.jsxs(kr,{$bgColor:"var(--primary-green)",variants:Q,custom:1,initial:"hidden",animate:"visible",children:[e.jsxs(Tr,{children:[g.avgAccuracy.toFixed(1),"%"]}),e.jsx(Pr,{children:"Precisão Média"})]}),e.jsxs(kr,{$bgColor:"var(--primary-purple)",variants:Q,custom:2,initial:"hidden",animate:"visible",children:[e.jsx(Tr,{children:g.avgScore.toFixed(0)}),e.jsx(Pr,{children:"Pontuação Média"})]}),e.jsxs(kr,{$bgColor:"var(--primary-orange)",variants:Q,custom:3,initial:"hidden",animate:"visible",children:["                  ",e.jsx(Tr,{children:L(g.totalTimeSpent)}),e.jsx(Pr,{children:"Tempo Total de Jogo"})]})]}),e.jsxs(Zr,{style:{marginBottom:"var(--space-xl)"},children:[e.jsx(ea,{children:"🎯 Ranking de Jogos Mais Utilizados"}),u&&u.totalUsage>0?e.jsxs("div",{children:[e.jsxs(ps,{style:{marginBottom:"var(--space-md)"},children:[e.jsxs(kr,{$bgColor:"var(--primary-cyan)",variants:Q,custom:4,initial:"hidden",animate:"visible",children:[e.jsx(Tr,{children:u.totalUsage}),e.jsx(Pr,{children:"Total de Jogadas"})]}),e.jsxs(kr,{$bgColor:"var(--primary-pink)",variants:Q,custom:5,initial:"hidden",animate:"visible",children:[e.jsx(Tr,{children:u.totalGames}),e.jsx(Pr,{children:"Jogos Utilizados"})]})]}),e.jsxs("div",{style:{background:"rgba(255, 255, 255, 0.9)",padding:"var(--space-md)",borderRadius:"var(--radius-medium)",border:"1px solid var(--light-gray)"},children:[e.jsx("h4",{style:{color:"var(--primary-blue)",marginBottom:"var(--space-sm)"},children:"📊 Detalhes de Uso por Jogo:"}),e.jsx(T,{}),e.jsx("div",{style:{marginTop:"var(--space-md)",textAlign:"center"},children:e.jsx(gs,{onClick:()=>{window.confirm("Tem certeza que deseja resetar todas as estatísticas de uso?")&&(ei(),n(na()))},style:{background:"var(--primary-orange)",fontSize:"var(--font-size-sm)"},children:"🔄 Resetar Estatísticas de Uso"})})]})]}):e.jsxs("div",{style:{textAlign:"center",color:"var(--medium-gray)",padding:"var(--space-lg)",background:"rgba(255, 255, 255, 0.9)",borderRadius:"var(--radius-medium)",border:"1px solid var(--light-gray)"},children:[e.jsx("p",{children:"🎮 Nenhum jogo foi utilizado ainda."}),e.jsx("p",{children:"Comece jogando para ver as estatísticas de uso aparecerem aqui!"})]})]}),e.jsxs(Zr,{children:[e.jsx(ea,{children:"Progresso ao Longo do Tempo"}),e.jsx(Ia,{children:M&&e.jsx(hi,{data:M.lineData,options:W})})]}),e.jsxs(Tm,{children:[e.jsxs(Zr,{children:[e.jsx(ea,{children:"Desempenho por Jogo"}),e.jsx(Ia,{children:M&&e.jsx(fi,{data:M.barData,options:P})})]}),e.jsxs(Zr,{children:[e.jsx(ea,{children:"Distribuição de Atividades"}),e.jsx(Ia,{children:M&&e.jsx(vi,{data:M.pieData,options:P})})]})]}),e.jsxs(Zr,{children:[e.jsx(ea,{children:"Mapa de Habilidades"}),e.jsx(Ia,{style:{height:"400px"},children:M&&e.jsx(xi,{data:M.radarData,options:P})}),e.jsx("p",{style:{textAlign:"center",fontSize:"var(--font-size-sm)",marginTop:"var(--space-sm)",color:"var(--medium-gray)"},children:"* Este mapa mostra o nível relativo de habilidades desenvolvidas com base nas atividades realizadas"})]})]})]}):e.jsxs(us,{children:[e.jsx("p",{children:"O dashboard de desempenho requer conexão com banco de dados."}),e.jsx("p",{children:"Conecte-se ao banco de dados para ver estatísticas detalhadas e gráficos de progresso."})]})]})},Mm=s.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-xl);
  background: white;
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-medium);
`,Dm=s.h2`
  font-size: var(--font-size-xl);
  color: var(--primary-purple);
  margin-bottom: var(--space-md);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  border-bottom: 1px solid var(--light-gray);
  padding-bottom: var(--space-md);
`,kt=s(_.div)`
  background: var(--bg-panel);
  border-radius: var(--radius-medium);
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
  box-shadow: var(--shadow-small);
`,Tt=s.h3`
  font-size: var(--font-size-lg);
  color: var(--primary-blue);
  margin-bottom: var(--space-md);
`,Pt=s.p`
  margin-bottom: var(--space-lg);
  color: var(--text-secondary);
`,Oa=s(_.button)`
  background: ${r=>r.secondary?"var(--light-gray)":"var(--primary-blue)"};
  color: ${r=>r.secondary?"var(--text-primary)":"white"};
  border: none;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-medium);
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  margin-right: var(--space-md);
  margin-bottom: var(--space-md);
  
  &:hover {
    background: ${r=>r.secondary?"var(--medium-gray)":"var(--primary-purple)"};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`,$m=s.input`
  display: none;
`,Im=s.label`
  background: var(--primary-green);
  color: white;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-medium);
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  
  &:hover {
    background: var(--primary-blue);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`,hs=s.div`
  background: ${r=>r.type==="success"?"var(--primary-green-light)":r.type==="error"?"var(--primary-red-light)":"var(--primary-blue-light)"};
  color: ${r=>r.type==="success"?"var(--primary-green)":r.type==="error"?"var(--primary-red)":"var(--primary-blue)"};
  border: 1px solid ${r=>r.type==="success"?"var(--primary-green)":r.type==="error"?"var(--primary-red)":"var(--primary-blue)"};
  padding: var(--space-md);
  border-radius: var(--radius-medium);
  margin-bottom: var(--space-lg);
  margin-top: var(--space-md);
`,fs=s.pre`
  background: var(--light-gray);
  border-radius: var(--radius-medium);
  padding: var(--space-md);
  max-height: 200px;
  overflow-y: auto;
  font-size: 12px;
  margin-bottom: var(--space-md);
  
  code {
    white-space: pre-wrap;
  }
`,Om=s.div`
  margin-bottom: var(--space-md);
`,Ra=s.label`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
  cursor: pointer;
`,La=s.input`
  cursor: pointer;
  width: 18px;
  height: 18px;
`,Rm=()=>{const{userId:r,isDbConnected:a,userDetails:t}=xr(),[o,c]=l.useState(null),[i,d]=l.useState(!1),[p,f]=l.useState(!1),[h,m]=l.useState(null),[u,n]=l.useState(null),[g,E]=l.useState(null),[w,U]=l.useState({userProfiles:!0,gameProgress:!0,accessibilitySettings:!0,preferences:!0});l.useEffect(()=>{if(h){const j=setTimeout(()=>{m(null)},5e3);return()=>clearTimeout(j)}},[h]);const A=async()=>{if(!r){m({type:"error",message:"Erro: Não foi possível identificar o usuário."});return}d(!0);try{let j={version:"1.0",exportDate:new Date().toISOString(),data:{}};if(a){if(w.userProfiles){const k=await re.getAllUsers();j.data.users=k}if(w.gameProgress){const k=await re.getAllGameSessions(r);j.data.gameSessions=k}w.accessibilitySettings&&t?.preferences?.accessibility&&(j.data.accessibilitySettings=t.preferences.accessibility),w.preferences&&t?.preferences&&(j.data.preferences=t.preferences)}else{if(w.userProfiles&&(j.data.userId=r),w.gameProgress){const k={};for(let M=0;M<localStorage.length;M++){const P=localStorage.key(M);if(P.startsWith("betina_")&&P.includes("_history"))try{k[P]=JSON.parse(localStorage.getItem(P))}catch{k[P]=localStorage.getItem(P)}}j.data.localStorage=k}if(w.accessibilitySettings){const k=localStorage.getItem("betina_accessibility_settings");if(k)try{j.data.accessibilitySettings=JSON.parse(k)}catch{j.data.accessibilitySettings=k}}if(w.preferences){const k=localStorage.getItem("betina_user_preferences");if(k)try{j.data.preferences=JSON.parse(k)}catch{j.data.preferences=k}}}c(j),m({type:"success",message:"Backup gerado com sucesso! Agora você pode fazer o download."})}catch(j){console.error("Erro ao gerar backup:",j),m({type:"error",message:"Erro ao gerar backup: "+j.message})}finally{d(!1)}},B=()=>{if(o)try{const j=JSON.stringify(o,null,2),k=new Blob([j],{type:"application/json"}),M=URL.createObjectURL(k),P=document.createElement("a");P.href=M;const Q=new Date().toISOString().split("T")[0];P.download=`portal-betina-backup-${Q}.json`,document.body.appendChild(P),P.click(),document.body.removeChild(P),URL.revokeObjectURL(M),m({type:"success",message:"Arquivo de backup baixado com sucesso!"})}catch(j){console.error("Erro ao baixar backup:",j),m({type:"error",message:"Erro ao baixar arquivo de backup: "+j.message})}},S=j=>{const k=j.target.files[0];if(!k)return;n(k);const M=new FileReader;M.onload=P=>{try{const W=JSON.parse(P.target.result);E(W)}catch(W){console.error("Erro ao ler arquivo:",W),m({type:"error",message:"Erro ao ler arquivo de backup. O arquivo parece estar corrompido."}),n(null),E(null)}},M.readAsText(k)},L=async()=>{if(!(!g||!r)){f(!0);try{if(!g.version)throw new Error("Formato de backup inválido ou não reconhecido");if(a){if(g.data.preferences&&await re.updateUserPreferences(r,g.data.preferences),g.data.gameSessions)for(const j of g.data.gameSessions)await re.saveGameSession({...j,user_id:r})}else g.data.localStorage&&Object.entries(g.data.localStorage).forEach(([j,k])=>{localStorage.setItem(j,JSON.stringify(k))}),g.data.accessibilitySettings&&localStorage.setItem("betina_accessibility_settings",JSON.stringify(g.data.accessibilitySettings)),g.data.preferences&&localStorage.setItem("betina_user_preferences",JSON.stringify(g.data.preferences));m({type:"success",message:"Dados importados com sucesso! Pode ser necessário recarregar a página."}),n(null),E(null)}catch(j){console.error("Erro ao importar dados:",j),m({type:"error",message:"Erro ao importar dados: "+j.message})}finally{f(!1)}}};return e.jsxs(Mm,{children:[e.jsxs(Dm,{children:[e.jsx("span",{role:"img","aria-label":"backup",children:"💾"})," Backup e Exportação de Dados"]}),h&&e.jsx(hs,{type:h.type,children:h.message}),e.jsxs(kt,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.1},children:[e.jsx(Tt,{children:"Exportar Dados"}),e.jsx(Pt,{children:"Crie um backup de seus dados para manter seus progressos seguros ou transferir para outro dispositivo."}),e.jsxs(Om,{children:[e.jsxs(Ra,{children:[e.jsx(La,{type:"checkbox",checked:w.userProfiles,onChange:j=>U({...w,userProfiles:j.target.checked})}),"Perfis de Usuário"]}),e.jsxs(Ra,{children:[e.jsx(La,{type:"checkbox",checked:w.gameProgress,onChange:j=>U({...w,gameProgress:j.target.checked})}),"Progresso dos Jogos"]}),e.jsxs(Ra,{children:[e.jsx(La,{type:"checkbox",checked:w.accessibilitySettings,onChange:j=>U({...w,accessibilitySettings:j.target.checked})}),"Configurações de Acessibilidade"]}),e.jsxs(Ra,{children:[e.jsx(La,{type:"checkbox",checked:w.preferences,onChange:j=>U({...w,preferences:j.target.checked})}),"Preferências Gerais"]})]}),e.jsx(Oa,{onClick:A,disabled:i,whileHover:{scale:1.05},whileTap:{scale:.95},children:i?"Gerando...":"Gerar Backup"}),o&&e.jsxs(e.Fragment,{children:[e.jsx(fs,{children:e.jsxs("code",{children:[JSON.stringify(o,null,2).substring(0,500),JSON.stringify(o,null,2).length>500?"...":""]})}),e.jsxs(Oa,{onClick:B,whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx("span",{role:"img","aria-hidden":"true",children:"⬇️"})," Baixar Arquivo de Backup"]})]})]}),e.jsxs(kt,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.2},children:[e.jsx(Tt,{children:"Importar Dados"}),e.jsx(Pt,{children:"Restaure seus dados a partir de um arquivo de backup criado anteriormente."}),e.jsxs(Im,{htmlFor:"backup-file",children:[e.jsx("span",{role:"img","aria-hidden":"true",children:"📂"})," Selecionar Arquivo de Backup",e.jsx($m,{type:"file",id:"backup-file",accept:".json",onChange:S})]}),u&&e.jsxs("p",{children:["Arquivo selecionado: ",u.name]}),g&&e.jsxs(e.Fragment,{children:[e.jsx(fs,{children:e.jsxs("code",{children:[JSON.stringify(g,null,2).substring(0,500),JSON.stringify(g,null,2).length>500?"...":""]})}),e.jsx(Oa,{onClick:L,disabled:p,whileHover:{scale:1.05},whileTap:{scale:.95},children:p?"Importando...":"Importar Dados"}),e.jsx(Oa,{secondary:!0,onClick:()=>{n(null),E(null)},whileHover:{scale:1.05},whileTap:{scale:.95},children:"Cancelar"})]})]}),e.jsxs(kt,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.3},children:[e.jsx(Tt,{children:"Sincronização Automática"}),e.jsx(Pt,{children:a?"Seus dados são sincronizados automaticamente no banco de dados PostgreSQL quando você está conectado.":"Conecte-se ao banco de dados para habilitar a sincronização automática dos seus dados."}),e.jsxs(hs,{type:"info",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Status da Sincronização"}),": ",a?"Ativada":"Desativada"]}),e.jsx("p",{children:a?"Seus dados estão sendo salvos automaticamente no banco de dados.":"No modo offline, seus dados são armazenados apenas localmente neste dispositivo."})]})]})]})},Lm=[{id:"memory-game",name:"Jogo da Memória",description:"Encontre os pares iguais e exercite a memória de forma divertida",icon:"🧠",category:"memory",difficulty:1,color:"#4A90E2",badge:"Memória",skills:["memória","concentração","atenção"],ageRange:"3-12",available:!0},{id:"color-match",name:"Combinar Cores",description:"Associe objetos e animais com suas cores correspondentes",icon:"🌈",category:"colors",difficulty:1,color:"#7ED321",badge:"Cores",skills:["reconhecimento de cores","associação","classificação"],ageRange:"2-8",available:!0},{id:"image-association",name:"Associação de Imagens",description:"Combine imagens relacionadas e desenvolva conexões lógicas",icon:"🧩",category:"logic",difficulty:2,color:"#F5A623",badge:"Lógica",skills:["raciocínio lógico","associação","pensamento crítico"],ageRange:"4-12",available:!0},{id:"sound-recognition",name:"Sons e Música",description:"Identifique sons de animais, instrumentos e natureza",icon:"🎵",category:"sounds",difficulty:2,color:"#9013FE",badge:"Audição",skills:["discriminação auditiva","memória auditiva","atenção"],ageRange:"3-10",available:!1,comingSoon:!0},{id:"number-sequence",name:"Números Divertidos",description:"Aprenda números de 1 a 10 com atividades interativas",icon:"🔢",category:"numbers",difficulty:1,color:"#E91E63",badge:"Números",skills:["numeracia","sequência","contagem"],ageRange:"3-8",available:!1,comingSoon:!0},{id:"emotions",name:"Reconhecer Emoções",description:"Identifique diferentes expressões e sentimentos",icon:"😊",category:"emotions",difficulty:2,color:"#FF6B6B",badge:"Emoções",skills:["inteligência emocional","reconhecimento facial","empatia"],ageRange:"4-12",available:!1,comingSoon:!0},{id:"creative-painting",name:"Pintura Criativa",description:"Crie obras de arte coloridas com pincéis digitais e complete desafios criativos",icon:"🎨",category:"creativity",difficulty:2,color:"#9C27B0",badge:"Arte",skills:["criatividade","coordenação motora","expressão artística","reconhecimento de cores"],ageRange:"3-12",available:!0}],Nm={memory:{name:"Memória",description:"Atividades para fortalecer a memória e concentração",color:"#4A90E2",icon:"🧠"},colors:{name:"Cores",description:"Reconhecimento e associação de cores",color:"#7ED321",icon:"🌈"},logic:{name:"Lógica",description:"Desenvolvimento do raciocínio lógico e associativo",color:"#F5A623",icon:"🧩"},sounds:{name:"Sons",description:"Discriminação e memória auditiva",color:"#9013FE",icon:"🎵"},numbers:{name:"Números",description:"Conceitos básicos de numeracia",color:"#E91E63",icon:"🔢"},emotions:{name:"Emoções",description:"Reconhecimento de expressões e sentimentos",color:"#FF6B6B",icon:"😊"},creativity:{name:"Criatividade",description:"Expressão artística e criativa",color:"#9C27B0",icon:"🎨"}},Fm={activities:Lm,categories:Nm},Um=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--space-lg);
  margin: var(--space-xl) 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
`,Na=s(_.div)`
  background: white;
  border-radius: var(--radius-large);
  padding: var(--space-lg);
  box-shadow: var(--shadow-medium);
  border: 2px solid var(--light-gray);
`,Fa=s.h3`
  font-size: var(--font-size-lg);
  color: var(--primary-blue);
  margin: 0 0 var(--space-lg) 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`,vs=s.div`
  background: var(--light-gray);
  border-radius: var(--radius-medium);
  height: 30px;
  margin: var(--space-sm) 0;
  overflow: hidden;
  position: relative;
`,xs=s(_.div)`
  background: linear-gradient(135deg, ${r=>r.color||"var(--primary-blue)"}, ${r=>r.colorSecondary||"var(--primary-cyan)"});
  height: 100%;
  border-radius: var(--radius-medium);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 var(--space-sm);
  color: white;
  font-weight: 600;
  font-size: var(--font-size-sm);
`,ys=s.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
`,bs=s.div`
  font-size: 1.2rem;
  width: 30px;
  text-align: center;
`,ws=s.div`
  flex: 1;
  font-weight: 500;
  color: var(--dark-gray);
`,Bm=s.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`,Ua=s.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm);
  background: var(--light-gray);
  border-radius: var(--radius-medium);
`,Ba=s.div`
  font-weight: 500;
  color: var(--dark-gray);
`,Ha=s.div`
  font-weight: 600;
  color: var(--primary-blue);
`,Hm=s.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
  margin-top: var(--space-lg);
`,_a=s.div`
  text-align: center;
  padding: var(--space-md);
  background: var(--light-gray);
  border-radius: var(--radius-medium);
`,Ga=s.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-blue);
  margin-bottom: var(--space-xs);
`,qa=s.div`
  font-size: var(--font-size-sm);
  color: var(--medium-gray);
`;function _m({gameUsage:r={},stats:a={}}){const t={"memory-game":{name:"Jogo da Memória",icon:"🧠",color:"var(--primary-blue)",colorSecondary:"var(--primary-cyan)"},"color-match":{name:"Combinar Cores",icon:"🌈",color:"var(--primary-green)",colorSecondary:"#7ED321"},"image-association":{name:"Associação de Imagens",icon:"🧩",color:"var(--primary-orange)",colorSecondary:"#F5A623"},"musical-sequence":{name:"Sequência Musical",icon:"🎵",color:"var(--primary-purple)",colorSecondary:"#9013FE"},"letter-recognition":{name:"Reconhecimento de Letras",icon:"📚",color:"var(--primary-pink)",colorSecondary:"#E91E63"},"number-counting":{name:"Números e Contagem",icon:"🔢",color:"var(--primary-cyan)",colorSecondary:"#00BCD4"}},o=()=>Object.entries(r).filter(([u,n])=>typeof n=="number"&&!u.includes("_lastPlayed")).map(([u,n])=>{const g=t[u]||{name:u,icon:"🎮",color:"var(--primary-blue)"};return{id:u,...g,count:n,lastPlayed:r[`${u}_lastPlayed`]}}).sort((u,n)=>n.count-u.count),c=()=>o().reduce((m,u)=>m+u.count,0),i=()=>{const m=Date.now(),u=24*60*60*1e3,n=7*u,g=30*u,E={today:0,thisWeek:0,thisMonth:0,older:0};return Object.entries(r).forEach(([w,U])=>{if(w.includes("_lastPlayed")&&typeof U=="number"){const A=w.replace("_lastPlayed",""),B=r[A]||0,S=m-U;S<=u?E.today+=B:S<=n?E.thisWeek+=B:S<=g?E.thisMonth+=B:E.older+=B}}),E},d=(m,u)=>u===0?"0%":`${Math.round(m/u*100)}%`,p=o(),f=c(),h=i();return e.jsxs(Um,{children:[e.jsxs(Na,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.1},children:[e.jsx(Fa,{children:"📊 Ranking de Popularidade"}),p.length===0?e.jsx("div",{style:{textAlign:"center",color:"var(--medium-gray)",padding:"var(--space-lg)"},children:"Nenhum dado de uso disponível"}):p.map((m,u)=>e.jsxs(ys,{children:[e.jsx(bs,{children:m.icon}),e.jsx(ws,{children:m.name}),e.jsx("div",{style:{width:"60%"},children:e.jsx(vs,{children:e.jsx(xs,{color:m.color,colorSecondary:m.colorSecondary,initial:{width:0},animate:{width:`${m.count/Math.max(...p.map(n=>n.count))*100}%`},transition:{duration:1,delay:.2+u*.1},children:m.count})})})]},m.id))]}),e.jsxs(Na,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.2},children:[e.jsx(Fa,{children:"📅 Atividade por Período"}),e.jsxs(Bm,{children:[e.jsxs(Ua,{children:[e.jsx(Ba,{children:"🔥 Hoje"}),e.jsxs(Ha,{children:[h.today," jogadas"]})]}),e.jsxs(Ua,{children:[e.jsx(Ba,{children:"📈 Esta Semana"}),e.jsxs(Ha,{children:[h.thisWeek," jogadas"]})]}),e.jsxs(Ua,{children:[e.jsx(Ba,{children:"📊 Este Mês"}),e.jsxs(Ha,{children:[h.thisMonth," jogadas"]})]}),e.jsxs(Ua,{children:[e.jsx(Ba,{children:"📚 Anteriores"}),e.jsxs(Ha,{children:[h.older," jogadas"]})]})]})]}),e.jsxs(Na,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.3},children:[e.jsx(Fa,{children:"🎯 Estatísticas Detalhadas"}),e.jsxs(Hm,{children:[e.jsxs(_a,{children:[e.jsx(Ga,{children:p.length}),e.jsx(qa,{children:"Jogos Ativos"})]}),e.jsxs(_a,{children:[e.jsx(Ga,{children:f}),e.jsx(qa,{children:"Total Jogadas"})]}),e.jsxs(_a,{children:[e.jsx(Ga,{children:f>0?Math.round(f/p.length):0}),e.jsx(qa,{children:"Média por Jogo"})]}),e.jsxs(_a,{children:[e.jsx(Ga,{children:a.mostPlayed&&t[a.mostPlayed]?.name?.split(" ")[0]||"N/A"}),e.jsx(qa,{children:"Mais Popular"})]})]})]}),e.jsxs(Na,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.4},children:[e.jsx(Fa,{children:"📈 Distribuição de Uso"}),p.length===0?e.jsx("div",{style:{textAlign:"center",color:"var(--medium-gray)",padding:"var(--space-lg)"},children:"Aguardando dados de uso"}):p.map((m,u)=>e.jsxs(ys,{children:[e.jsx(bs,{children:m.icon}),e.jsx(ws,{children:m.name}),e.jsx("div",{style:{width:"40%"},children:e.jsx(vs,{children:e.jsx(xs,{color:m.color,colorSecondary:m.colorSecondary,initial:{width:0},animate:{width:`${m.count/f*100}%`},transition:{duration:1,delay:.3+u*.1},children:d(m.count,f)})})})]},m.id))]})]})}const js=s.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  margin: var(--space-lg) 0;
  box-shadow: var(--shadow-medium);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`,Gm=s(_.div)`
  background: white;
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  margin: var(--space-lg) auto;
  box-shadow: var(--shadow-medium);
  max-width: 400px;
  text-align: center;
`,qm=s.input`
  width: 100%;
  padding: var(--space-md);
  margin: var(--space-sm) 0;
  border: 2px solid var(--light-gray);
  border-radius: var(--radius-medium);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-normal);
  
  &:focus {
    outline: none;
    border-color: var(--primary-blue);
  }
`,Vm=s(_.button)`
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-cyan));
  color: white;
  border: none;
  padding: var(--space-md) var(--space-xl);
  border-radius: var(--radius-medium);
  font-size: var(--font-size-base);
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  margin-top: var(--space-md);
`,Ym=s.div`
  text-align: center;
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-lg);
  border-bottom: 2px solid var(--light-gray);
`,Jm=s.h1`
  font-size: var(--font-size-title);
  color: var(--primary-blue);
  margin-bottom: var(--space-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
`,Wm=s.p`
  color: var(--medium-gray);
  font-size: var(--font-size-lg);
  margin: 0;
`,Ss=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
`,dr=s(_.div)`
  background: linear-gradient(135deg, ${r=>r.color||"var(--primary-blue)"}, ${r=>r.colorSecondary||"var(--primary-cyan)"});
  border-radius: var(--radius-large);
  padding: var(--space-lg);
  color: white;
  text-align: center;
  box-shadow: var(--shadow-medium);
`,mr=s.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: var(--space-sm);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`,pr=s.div`
  font-size: var(--font-size-md);
  opacity: 0.9;
  font-weight: 500;
`,ra=s.h2`
  font-size: var(--font-size-xl);
  color: var(--primary-blue);
  margin: var(--space-xl) 0 var(--space-lg) 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`,Km=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`,Xm=s.div`
  background: white;
  border: 2px solid var(--light-gray);
  border-radius: var(--radius-medium);
  padding: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-md);
  transition: all var(--transition-normal);
  
  &:hover {
    border-color: var(--primary-blue);
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }
`,Qm=s.div`
  font-size: 2rem;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, ${r=>r.color||"var(--primary-blue)"}, ${r=>r.colorSecondary||"var(--primary-cyan)"});
  border-radius: var(--radius-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`,Zm=s.div`
  flex: 1;
`,ep=s.h3`
  font-size: var(--font-size-lg);
  color: var(--dark-gray);
  margin: 0 0 var(--space-xs) 0;
`,rp=s.div`
  color: var(--medium-gray);
  font-size: var(--font-size-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`,ap=s.div`
  background: var(--light-gray);
  border-radius: var(--radius-medium);
  padding: var(--space-lg);
  margin-top: var(--space-xl);
`,aa=s(_.button)`
  background: ${r=>r.danger?"var(--error-color)":"var(--primary-green)"};
  color: white;
  border: none;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-medium);
  font-size: var(--font-size-md);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin: var(--space-sm) var(--space-sm) 0 0;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,tp=s.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-top: var(--space-lg);
`,zt=s.div`
  background: rgba(74, 144, 226, 0.1);
  border: 1px solid var(--primary-blue);
  border-radius: var(--radius-medium);
  padding: var(--space-lg);
  margin: var(--space-lg) 0;
  color: var(--primary-blue);
  font-size: var(--font-size-sm);
`,op=s.div`
  text-align: center;
  color: var(--medium-gray);
  font-size: var(--font-size-sm);
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--light-gray);
`;function sp(){const[r,a]=l.useState(!1),[t,o]=l.useState(""),[c,i]=l.useState(""),[d,p]=l.useState({totalGames:0,totalUsage:0,mostPlayed:null,lastUpdate:null}),[f,h]=l.useState({}),[m,u]=l.useState(!0),[n,g]=l.useState(null),E="betina2025",w=()=>{t===E?(a(!0),i(""),localStorage.setItem("portalBetina_adminAuth","true")):(i("Senha incorreta. Tente novamente."),o(""))},U=()=>{a(!1),localStorage.removeItem("portalBetina_adminAuth")};l.useEffect(()=>{const P=localStorage.getItem("portalBetina_adminAuth")==="true";a(P)},[]);const A={"memory-game":{name:"Jogo da Memória",icon:"🧠",color:"var(--primary-blue)",colorSecondary:"var(--primary-cyan)"},"color-match":{name:"Combinar Cores",icon:"🌈",color:"var(--primary-green)",colorSecondary:"#7ED321"},"image-association":{name:"Associação de Imagens",icon:"🧩",color:"var(--primary-orange)",colorSecondary:"#F5A623"},"musical-sequence":{name:"Sequência Musical",icon:"🎵",color:"var(--primary-purple)",colorSecondary:"#9013FE"},"letter-recognition":{name:"Reconhecimento de Letras",icon:"📚",color:"var(--primary-pink)",colorSecondary:"#E91E63"},"number-counting":{name:"Números e Contagem",icon:"🔢",color:"var(--primary-cyan)",colorSecondary:"#00BCD4"},"sound-recognition":{name:"Sons e Música",icon:"🎵",color:"var(--primary-purple)",colorSecondary:"#9013FE"},"number-sequence":{name:"Números Divertidos",icon:"🔢",color:"var(--primary-cyan)",colorSecondary:"#00BCD4"},emotions:{name:"Reconhecer Emoções",icon:"😊",color:"var(--primary-pink)",colorSecondary:"#FF6B6B"}};l.useEffect(()=>{B()},[]);const B=()=>{u(!0);try{const P=na(),W=yr(),Q=ri();p(P),h(W),g(Q),u(!1)}catch(P){console.error("Erro ao carregar dados do admin:",P),u(!1)}},S=()=>{window.confirm("⚠️ Tem certeza que deseja resetar todas as estatísticas? Esta ação não pode ser desfeita.")&&(ei(),B(),alert("✅ Estatísticas resetadas com sucesso!"))},L=()=>{try{const P=bc(),W=JSON.stringify(P,null,2),Q=new Blob([W],{type:"application/json"}),H=URL.createObjectURL(Q),T=document.createElement("a");T.href=H,T.download=`portal-betina-dados-${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(T),T.click(),document.body.removeChild(T),URL.revokeObjectURL(H),console.log("📥 Dados exportados com sucesso"),alert("✅ Dados exportados com sucesso!")}catch(P){console.error("Erro ao exportar dados:",P),alert("❌ Erro ao exportar dados. Verifique o console.")}},j=P=>P?new Date(parseInt(P)).toLocaleString("pt-BR"):"Nunca",k=P=>{if(!P)return"Nunca";const W=Math.floor((Date.now()-parseInt(P))/(1e3*60*60*24));return W===0?"Hoje":W===1?"Ontem":`${W} dias atrás`},M=()=>Object.entries(f).filter(([W,Q])=>typeof Q=="number"&&!W.includes("_lastPlayed")).map(([W,Q])=>{const H=A[W]||{name:W,icon:"🎮",color:"var(--primary-blue)"};return{id:W,...H,count:Q,lastPlayed:f[`${W}_lastPlayed`]}}).sort((W,Q)=>Q.count-W.count);return m?e.jsx(js,{children:e.jsxs("div",{style:{textAlign:"center",padding:"var(--space-xl)"},children:[e.jsx("div",{style:{fontSize:"2rem",marginBottom:"var(--space-md)"},children:"⚡"}),e.jsx("div",{children:"Carregando dados administrativos..."})]})}):r?e.jsxs(js,{children:[e.jsx(Ym,{children:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",width:"100%"},children:[e.jsxs("div",{children:[e.jsx(Jm,{children:"🔐 Painel Administrativo"}),e.jsx(Wm,{children:"Métricas e estatísticas detalhadas do Portal Betina"})]}),e.jsx(aa,{onClick:U,style:{marginTop:0,padding:"var(--space-sm) var(--space-md)",fontSize:"0.9em"},whileHover:{scale:1.02},whileTap:{scale:.98},children:"🚪 Sair"})]})}),e.jsxs(zt,{children:["📊 ",e.jsx("strong",{children:"Status do Sistema:"})," Este painel mostra estatísticas em tempo real do uso dos jogos. Os dados são salvos localmente no navegador e atualizados automaticamente conforme o uso."]}),e.jsx(ra,{children:"📈 Estatísticas Gerais"}),e.jsxs(Ss,{children:[e.jsxs(dr,{color:"var(--primary-blue)",colorSecondary:"var(--primary-cyan)",whileHover:{scale:1.02},children:[e.jsx(mr,{children:d.totalUsage}),e.jsx(pr,{children:"Total de Jogadas"})]}),e.jsxs(dr,{color:"var(--primary-green)",colorSecondary:"#7ED321",whileHover:{scale:1.02},children:[e.jsx(mr,{children:d.totalGames}),e.jsx(pr,{children:"Jogos Utilizados"})]}),e.jsxs(dr,{color:"var(--primary-orange)",colorSecondary:"#F5A623",whileHover:{scale:1.02},children:[e.jsx(mr,{children:d.mostPlayed?A[d.mostPlayed]?.name?.split(" ")[0]||d.mostPlayed:"N/A"}),e.jsx(pr,{children:"Jogo Mais Jogado"})]}),"        ",e.jsxs(dr,{color:"var(--primary-purple)",colorSecondary:"#9013FE",whileHover:{scale:1.02},children:[e.jsx(mr,{children:M().length}),e.jsx(pr,{children:"Jogos no Ranking"})]})]}),"      ",e.jsx(ra,{children:"📊 Visualizações Avançadas"}),e.jsx(_m,{gameUsage:f,gameMapping:A,activitiesData:Fm}),n&&e.jsxs(e.Fragment,{children:[e.jsx(ra,{children:"🧠 Insights Inteligentes"}),e.jsxs(Ss,{children:[e.jsxs(dr,{color:"var(--primary-cyan)",colorSecondary:"#00BCD4",whileHover:{scale:1.02},children:[e.jsx(mr,{children:n.totalEngagement}),e.jsx(pr,{children:"Engajamento Total"})]}),e.jsxs(dr,{color:"var(--primary-pink)",colorSecondary:"#FF6B6B",whileHover:{scale:1.02},children:[e.jsxs(mr,{children:[Math.round(n.diversityScore),"%"]}),e.jsx(pr,{children:"Score de Diversidade"})]}),e.jsxs(dr,{color:"var(--primary-orange)",colorSecondary:"#F5A623",whileHover:{scale:1.02},children:[e.jsx(mr,{children:n.recommendations.length}),e.jsx(pr,{children:"Recomendações"})]})]}),n.recommendations.length>0&&e.jsx("div",{style:{margin:"var(--space-lg) 0"},children:n.recommendations.map((P,W)=>e.jsxs(zt,{children:["💡 ",e.jsxs("strong",{children:[P.type==="diversity"?"Diversidade":"Conquista",":"]})," ",P.message]},W))})]}),e.jsx(ra,{children:"🎮 Detalhes por Jogo"}),M().length===0?e.jsx(zt,{children:"🎯 Ainda não há dados de uso registrados. Os jogos aparecerão aqui conforme forem sendo utilizados."}):e.jsx(Km,{children:M().map(P=>e.jsxs(Xm,{children:[e.jsx(Qm,{color:P.color,colorSecondary:P.colorSecondary,children:P.icon}),e.jsxs(Zm,{children:[e.jsx(ep,{children:P.name}),e.jsxs(rp,{children:[e.jsxs("div",{children:[e.jsx("strong",{children:P.count})," jogadas"]}),e.jsxs("div",{children:["Última vez: ",k(P.lastPlayed)]}),e.jsx("div",{style:{fontSize:"0.8em",opacity:.7},children:j(P.lastPlayed)})]})]})]},P.id))}),e.jsx(ra,{children:"⚙️ Controles Administrativos"}),e.jsxs(ap,{children:[e.jsx("h3",{style:{margin:"0 0 var(--space-md) 0",color:"var(--dark-gray)"},children:"Ações Disponíveis"}),e.jsx("p",{style:{margin:"0 0 var(--space-lg) 0",color:"var(--medium-gray)"},children:"Use estes controles para gerenciar os dados do portal:"}),e.jsxs(tp,{children:[e.jsx(aa,{onClick:L,whileHover:{scale:1.02},whileTap:{scale:.98},children:"📥 Exportar Dados"}),e.jsx(aa,{onClick:B,whileHover:{scale:1.02},whileTap:{scale:.98},children:"🔄 Atualizar Dados"}),e.jsx(aa,{onClick:()=>{yc(),B(),alert("✅ Cache limpo com sucesso!")},whileHover:{scale:1.02},whileTap:{scale:.98},children:"🧹 Limpar Cache"}),e.jsx(aa,{danger:!0,onClick:S,whileHover:{scale:1.02},whileTap:{scale:.98},children:"🗑️ Resetar Estatísticas"})]})]}),e.jsxs(op,{children:[e.jsxs("div",{children:["Última atualização: ",new Date().toLocaleString("pt-BR")]}),e.jsx("div",{style:{marginTop:"var(--space-xs)",fontSize:"0.9em"},children:"Portal Betina v1.0.0 - Sistema de Métricas Inteligente"})]})]}):e.jsxs(Gm,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:[e.jsx("div",{style:{fontSize:"3rem",marginBottom:"var(--space-md)"},children:"🔐"}),e.jsx("h2",{style:{color:"var(--primary-blue)",marginBottom:"var(--space-lg)"},children:"Acesso Administrativo"}),e.jsx("p",{style:{color:"var(--medium-gray)",marginBottom:"var(--space-lg)"},children:"Digite a senha para acessar o painel administrativo do Portal Betina"}),e.jsx(qm,{type:"password",placeholder:"Digite a senha de administrador",value:t,onChange:P=>o(P.target.value),onKeyPress:P=>P.key==="Enter"&&w()}),c&&e.jsx("div",{style:{color:"var(--primary-pink)",fontSize:"0.9em",marginTop:"var(--space-sm)"},children:c}),e.jsx(Vm,{onClick:w,whileHover:{scale:1.02},whileTap:{scale:.98},children:"🚀 Entrar"}),e.jsx("div",{style:{marginTop:"var(--space-lg)",fontSize:"0.8em",color:"var(--medium-gray)"},children:"Portal Betina - Sistema de Métricas v1.0"})]})}const ip=s.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  position: relative;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(240, 147, 251, 0.2) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`,np=s.main`
  padding: var(--space-lg);
  padding-bottom: 120px; /* Espaço para o footer fixo */
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: var(--space-md);
    padding-bottom: 100px;
  }
`,cp=s(_.section)`
  text-align: center;
  margin: var(--space-xl) 0;
  padding: var(--space-xl);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.92));
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-strong);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-purple), var(--primary-pink));
  }
`;s.h1`
  font-size: var(--font-size-title);
  color: var(--primary-blue);
  margin-bottom: var(--space-lg);
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: var(--font-size-xxl);
  }
`;function lp(){const[r,a]=l.useState("home");xr();const t=d=>{["memory-game","color-match","image-association","musical-sequence","letter-recognition","number-counting","creative-painting"].includes(d)&&uc(d),a(d)},o=()=>{a("home")},c=()=>({"memory-game":"🧠 Jogo da Memória","color-match":"🌈 Combinar Cores","image-association":"🧩 Associação de Imagens","musical-sequence":"🎵 Sequência Musical","letter-recognition":"🔤 Reconhecimento de Letras","number-counting":"🔢 Números e Contagem","creative-painting":"🎨 Pintura Criativa",about:"💡 Sobre o Portal","progress-report":"📊 Relatório de Progresso","admin-panel":"🔐 Painel Administrativo"})[r]||null,i=()=>{switch(r){case"memory-game":return e.jsx(cr,{title:"Jogo da Memória",emoji:"🧠",children:e.jsx(Yc,{onBack:o})});case"color-match":return e.jsx(cr,{title:"Combinar Cores",emoji:"🌈",children:e.jsx(cl,{onBack:o})});case"image-association":return e.jsx(cr,{title:"Associação de Imagens",emoji:"🖼️",children:e.jsx(kl,{onBack:o})});case"musical-sequence":return e.jsx(cr,{title:"Sequência Musical",emoji:"🎵",children:e.jsx(Hl,{onBack:o})});case"letter-recognition":return e.jsx(cr,{title:"Reconhecimento de Letras",emoji:"📚",children:e.jsx(ad,{onBack:o})});case"number-counting":return e.jsx(cr,{title:"Números e Contagem",emoji:"🔢",children:e.jsx(vd,{onBack:o})});case"creative-painting":return e.jsx(cr,{title:"Pintura Criativa",emoji:"🎨",children:e.jsx(Bd,{onBack:o})});case"about":return e.jsx(Gd,{});case"progress-report":return e.jsx(tm,{onBack:o});case"user-profiles":return e.jsx(Cm,{onBack:o});case"performance-dashboard":return e.jsx(zm,{});case"backup-export":return e.jsx(Rm,{});case"admin-panel":return e.jsx(sp,{});case"home":default:return e.jsxs(e.Fragment,{children:["            ",e.jsx(cp,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.6},children:e.jsx(Dc,{})}),e.jsx(jc,{onActivitySelect:t})]})}};return e.jsxs(ip,{children:[e.jsx(Yn,{title:c()||"Portal Betina",onLogoClick:o}),e.jsx(np,{children:i()}),"      ",e.jsx(mc,{currentActivity:r,onActivityChange:t})]})}Dn();Mt.createRoot(document.getElementById("root")).render(e.jsx(Dr.StrictMode,{children:e.jsx(On,{children:e.jsx(lp,{})})}));
