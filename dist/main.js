!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n=e();for(var o in n)("object"==typeof exports?exports:t)[o]=n[o]}}(this,(function(){return(()=>{var t={446:(t,e,n)=>{"use strict";n.r(e),n.d(e,{default:()=>i});var o=n(645),r=n.n(o)()((function(t){return t[1]}));r.push([t.id,"\n.popup-container {\n\tposition: absolute;\n}\n",""]);const i=r},841:(t,e,n)=>{"use strict";n.r(e),n.d(e,{default:()=>i});var o=n(645),r=n.n(o)()((function(t){return t[1]}));r.push([t.id,"\n.g-html-marker-container {\n\tposition: absolute;\n}\n",""]);const i=r},438:(t,e,n)=>{"use strict";n.r(e),n.d(e,{default:()=>i});var o=n(645),r=n.n(o)()((function(t){return t[1]}));r.push([t.id,"\n.google-map {\n\tposition: fixed !important; \n\theight: 100% !important;\n\twidth: 100% !important;\n}\n",""]);const i=r},882:(t,e,n)=>{"use strict";n.r(e),n.d(e,{default:()=>i});var o=n(645),r=n.n(o)()((function(t){return t[1]}));r.push([t.id,"\n.google-map {\n\tposition: fixed !important; \n\theight: 100% !important;\n\twidth: 100% !important;\n}\n",""]);const i=r},645:t=>{"use strict";t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n=t(e);return e[2]?"@media ".concat(e[2]," {").concat(n,"}"):n})).join("")},e.i=function(t,n,o){"string"==typeof t&&(t=[[null,t,""]]);var r={};if(o)for(var i=0;i<this.length;i++){var a=this[i][0];null!=a&&(r[a]=!0)}for(var s=0;s<t.length;s++){var l=[].concat(t[s]);o&&r[l[0]]||(n&&(l[2]?l[2]="".concat(n," and ").concat(l[2]):l[2]=n),e.push(l))}},e}},324:(t,e,n)=>{var o=n(446);o.__esModule&&(o=o.default),"string"==typeof o&&(o=[[t.id,o,""]]),o.locals&&(t.exports=o.locals),(0,n(346).Z)("5e63c06b",o,!1,{})},910:(t,e,n)=>{var o=n(841);o.__esModule&&(o=o.default),"string"==typeof o&&(o=[[t.id,o,""]]),o.locals&&(t.exports=o.locals),(0,n(346).Z)("51d6f3aa",o,!1,{})},347:(t,e,n)=>{var o=n(438);o.__esModule&&(o=o.default),"string"==typeof o&&(o=[[t.id,o,""]]),o.locals&&(t.exports=o.locals),(0,n(346).Z)("f2feceaa",o,!1,{})},612:(t,e,n)=>{var o=n(882);o.__esModule&&(o=o.default),"string"==typeof o&&(o=[[t.id,o,""]]),o.locals&&(t.exports=o.locals),(0,n(346).Z)("9777572a",o,!1,{})},346:(t,e,n)=>{"use strict";function o(t,e){for(var n=[],o={},r=0;r<e.length;r++){var i=e[r],a=i[0],s={id:t+":"+r,css:i[1],media:i[2],sourceMap:i[3]};o[a]?o[a].parts.push(s):n.push(o[a]={id:a,parts:[s]})}return n}n.d(e,{Z:()=>m});var r="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!r)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var i={},a=r&&(document.head||document.getElementsByTagName("head")[0]),s=null,l=0,c=!1,u=function(){},p=null,d="data-vue-ssr-id",f="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function m(t,e,n,r){c=n,p=r||{};var a=o(t,e);return h(a),function(e){for(var n=[],r=0;r<a.length;r++){var s=a[r];(l=i[s.id]).refs--,n.push(l)}for(e?h(a=o(t,e)):a=[],r=0;r<n.length;r++){var l;if(0===(l=n[r]).refs){for(var c=0;c<l.parts.length;c++)l.parts[c]();delete i[l.id]}}}}function h(t){for(var e=0;e<t.length;e++){var n=t[e],o=i[n.id];if(o){o.refs++;for(var r=0;r<o.parts.length;r++)o.parts[r](n.parts[r]);for(;r<n.parts.length;r++)o.parts.push(b(n.parts[r]));o.parts.length>n.parts.length&&(o.parts.length=n.parts.length)}else{var a=[];for(r=0;r<n.parts.length;r++)a.push(b(n.parts[r]));i[n.id]={id:n.id,refs:1,parts:a}}}}function g(){var t=document.createElement("style");return t.type="text/css",a.appendChild(t),t}function b(t){var e,n,o=document.querySelector("style["+d+'~="'+t.id+'"]');if(o){if(c)return u;o.parentNode.removeChild(o)}if(f){var r=l++;o=s||(s=g()),e=O.bind(null,o,r,!1),n=O.bind(null,o,r,!0)}else o=g(),e=j.bind(null,o),n=function(){o.parentNode.removeChild(o)};return e(t),function(o){if(o){if(o.css===t.css&&o.media===t.media&&o.sourceMap===t.sourceMap)return;e(t=o)}else n()}}var y,v=(y=[],function(t,e){return y[t]=e,y.filter(Boolean).join("\n")});function O(t,e,n,o){var r=n?"":o.css;if(t.styleSheet)t.styleSheet.cssText=v(e,r);else{var i=document.createTextNode(r),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(i,a[e]):t.appendChild(i)}}function j(t,e){var n=e.css,o=e.media,r=e.sourceMap;if(o&&t.setAttribute("media",o),p.ssrId&&t.setAttribute(d,e.id),r&&(n+="\n/*# sourceURL="+r.sources[0]+" */",n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */"),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}}},e={};function n(o){var r=e[o];if(void 0!==r)return r.exports;var i=e[o]={id:o,exports:{}};return t[o](i,i.exports,n),i.exports}n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var o in e)n.o(e,o)&&!n.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:e[o]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var o={};return(()=>{"use strict";n.r(o),n.d(o,{GCustomPopup:()=>N,GHtmlMarker:()=>nt,GInfoWindow:()=>it,GMapRaster:()=>l,GMapVector:()=>d,GMarker:()=>m,GPolygon:()=>$,GPolyline:()=>O,OptionsMixin:()=>t});const t={props:{options:{type:Object,default:function(){return{}}}}};var e=function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"google-map"},[t.ready?t._t("default"):t._e()],2)};e._withStripped=!0;const r={props:{apiKey:{type:String}},beforeDestroy:function(){this.mapObject&&(google.maps.event.clearInstanceListeners(window),google.maps.event.clearInstanceListeners(document),google.maps.event.clearInstanceListeners(this.$el),this.$el.remove(),this.mapObject=null)},mounted:function(){if("undefined"==typeof google){window.initGoogleMaps=this.initGoogleMaps;var t=document.createElement("script");t.type="text/javascript",t.src="https://maps.googleapis.com/maps/api/js?v=beta&callback=initGoogleMaps",this.$props.apiKey&&(t.src+="&key=".concat(this.$props.apiKey)),document.body.appendChild(t)}else this.initGoogleMaps()}},i={name:"GMapRaster",mixins:[r,t],provide:function(){return{map:this}},props:{center:{type:[Object,Array],custom:!0,default:function(){return[0,0]}},bounds:{type:[Array,Object],custom:!0,default:null},maxBounds:{type:[Array,Object],default:null},heading:{type:Number,custom:!0,default:0},zoom:{type:Number,custom:!0,default:16},minZoom:{type:Number,default:null},maxZoom:{type:Number,default:null},mapTypeId:{type:String,default:"hybrid"},mapId:{type:String,default:void 0}},data:function(){return{ready:!1}},methods:{initGoogleMaps:function(){var t=this;console.log("GMapRaster initGoogleMaps");var e=_.defaults(_.omit(this.$props,["center","maxBounds"]),{disableDefaultUI:!0,keyboardShortcuts:!1,rotateControl:!0,scrollwheel:!0,streetViewControl:!1,zoomControl:!1});this.center&&2===this.center.length&&(e.center={lat:this.center[0],lng:this.center[1]}),this.maxBounds&&2===this.maxBounds.length&&this.maxBounds[0]&&2===this.maxBounds[0].length&&this.maxBounds[1]&&2===this.maxBounds[1].length&&(e.restriction={latLngBounds:{north:this.maxBounds[0][0],south:this.maxBounds[1][0],west:this.maxBounds[1][1],east:this.maxBounds[0][1]},strictBounds:!0}),console.log("Creating Google Maps Instance",this.$el,e),this.mapObject=new google.maps.Map(this.$el,e),this.mapObject.addListener("center_changed",(function(e){return t.$emit("moveend",[t.mapObject.getCenter().lat(),t.mapObject.getCenter().lng()])})),this.mapObject.addListener("heading_changed",(function(e){return t.$emit("headingend",t.mapObject.getHeading())})),this.mapObject.addListener("zoom_changed",(function(e){return t.$emit("zoomend",t.mapObject.getZoom())})),this.$watch("center",(function(){t.center[0]!==t.mapObject.getCenter().lat()&&t.center[1]!==t.mapObject.getCenter().lng()&&t.mapObject.setCenter({lat:t.center[0],lng:t.center[1]})})),this.$watch("zoom",(function(){t.zoom!==t.mapObject.getZoom()&&t.mapObject.setZoom(t.zoom)})),this.$watch("maxBounds",(function(){t.maxBounds&&2===t.maxBounds.length&&t.maxBounds[0]&&2===t.maxBounds[0].length&&t.maxBounds[1]&&2===t.maxBounds[1].length&&t.mapObject.setOptions({restriction:{latLngBounds:{north:t.maxBounds[0][0],south:t.maxBounds[1][0],west:t.maxBounds[1][1],east:t.maxBounds[0][1]},strictBounds:!0}})})),this.$watch("mapTypeId",(function(){t.mapTypeId&&t.mapObject.setMapTypeId(t.mapTypeId)})),this.ready=!0,this.$emit("loaded")}}};function a(t,e,n,o,r,i,a,s){var l,c="function"==typeof t?t.options:t;if(e&&(c.render=e,c.staticRenderFns=n,c._compiled=!0),o&&(c.functional=!0),i&&(c._scopeId="data-v-"+i),a?(l=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),r&&r.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(a)},c._ssrRegister=l):r&&(l=s?function(){r.call(this,(c.functional?this.parent:this).$root.$options.shadowRoot)}:r),l)if(c.functional){c._injectStyles=l;var u=c.render;c.render=function(t,e){return l.call(e),u(t,e)}}else{var p=c.beforeCreate;c.beforeCreate=p?[].concat(p,l):[l]}return{exports:t,options:c}}n(347);var s=a(i,e,[],!1,null,null,null);s.options.__file="src/components/GMapRaster.vue";const l=s.exports;var c=function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"google-map"},[t.ready?t._t("default"):t._e()],2)};c._withStripped=!0;const u={name:"GMapVector",mixins:[r,t],provide:function(){return{map:this}},props:{center:{type:[Object,Array],custom:!0,default:function(){return[0,0]}},bounds:{type:[Array,Object],custom:!0,default:null},maxBounds:{type:[Array,Object],default:null},heading:{type:Number,custom:!0,default:0},tilt:{type:Number,custom:!0,default:0},zoom:{type:Number,custom:!0,default:16},minZoom:{type:Number,default:null},maxZoom:{type:Number,default:null},mapTypeId:{type:String,default:"roadmap"},mapId:{type:String,default:"15431d2b469f209e"}},data:function(){return{ready:!1}},methods:{initGoogleMaps:function(){var t=this;console.log("GMapVector initGoogleMaps");var e=_.defaults(_.omit(this.$props,["center","maxBounds"]),{disableDefaultUI:!0,keyboardShortcuts:!1,rotateControl:!0,scrollwheel:!0,streetViewControl:!1,zoomControl:!1});this.center&&2===this.center.length&&(e.center={lat:this.center[0],lng:this.center[1]}),this.maxBounds&&2===this.maxBounds.length&&this.maxBounds[0]&&2===this.maxBounds[0].length&&this.maxBounds[1]&&2===this.maxBounds[1].length&&(e.restriction={latLngBounds:{north:this.maxBounds[0][0],south:this.maxBounds[1][0],west:this.maxBounds[1][1],east:this.maxBounds[0][1]},strictBounds:!0}),console.log("Creating Google Maps Instance",this.$el,e),this.mapObject=new google.maps.Map(this.$el,e),this.mapObject.addListener("center_changed",(function(e){return t.$emit("moveend",[t.mapObject.getCenter().lat(),t.mapObject.getCenter().lng()])})),this.mapObject.addListener("heading_changed",(function(e){return t.$emit("headingend",t.mapObject.getHeading())})),this.mapObject.addListener("tilt_changed",(function(e){return t.$emit("tiltend",t.mapObject.getTilt())})),this.mapObject.addListener("zoom_changed",(function(e){return t.$emit("zoomend",t.mapObject.getZoom())}));var n={x:null,y:null};this.$el.addEventListener("mousemove",(function(e){if(null!==n.x&&null!==n.y){var o=n.x-e.pageX,r=n.y-e.pageY;n.x=e.pageX,n.y=e.pageY,t.mapObject.moveCamera({heading:t.mapObject.getHeading()-o,tilt:t.mapObject.getTilt()+r,zoom:t.mapObject.getZoom()})}})),this.$el.addEventListener("pointerup",(function(t){1===t.button&&(n.x=null,n.y=null)})),this.$el.addEventListener("pointerdown",(function(t){1===t.button&&(n.x=t.pageX,n.y=t.pageY)})),this.$watch("center",(function(){t.$debug("center",t.center),t.center[0]!==t.mapObject.getCenter().lat()&&t.center[1]!==t.mapObject.getCenter().lng()&&t.mapObject.setCenter({lat:t.center[0],lng:t.center[1]})})),this.$watch("heading",(function(){t.$debug("heading",t.heading),t.heading!==t.mapObject.getHeading()&&t.mapObject.setHeading(t.heading)})),this.$watch("tilt",(function(){t.$debug("tilt",t.tilt),t.tilt!==t.mapObject.getTilt()&&t.mapObject.setTilt(t.tilt)})),this.$watch("zoom",(function(){t.$debug("zoom",t.zoom),t.zoom!==t.mapObject.getZoom()&&t.mapObject.setZoom(t.zoom)})),this.$watch("maxBounds",(function(){t.$debug("maxBounds",t.maxBounds),t.maxBounds&&2===t.maxBounds.length&&t.maxBounds[0]&&2===t.maxBounds[0].length&&t.maxBounds[1]&&2===t.maxBounds[1].length&&t.mapObject.setOptions({restriction:{latLngBounds:{north:t.maxBounds[0][0],south:t.maxBounds[1][0],west:t.maxBounds[1][1],east:t.maxBounds[0][1]},strictBounds:!0}})})),this.$watch("mapTypeId",(function(){t.$debug("mapTypeId",t.mapTypeId),t.mapTypeId&&t.mapObject.setMapTypeId(t.mapTypeId)})),this.ready=!0,this.$emit("loaded")}}};n(612);var p=a(u,c,[],!1,null,null,null);p.options.__file="src/components/GMapVector.vue";const d=p.exports;var f=a({name:"GMarker",mixins:[t],inject:["map"],props:{clickable:{type:Boolean,default:!0},draggable:{type:Boolean,default:!1},position:{type:[Object,Array],custom:!0,default:null},label:{type:Object,default:null},icon:{type:Object,custom:!1,default:function(){return{anchor:new google.maps.Point(15,30),path:"M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",fillColor:"blue",fillOpacity:.8,strokeWeight:.8,rotation:0,scale:1}}},shape:{type:Object,default:null},visible:{type:Boolean,default:!0},zIndex:{type:Number,default:0}},data:function(){return{ready:!1}},beforeDestroy:function(){this.mapObject.setMap(null)},mounted:function(){var t,e=this;this.$debug("GMarker",this.$props),this.mapObject=new google.maps.Marker({position:{lat:this.position[0],lng:this.position[1]},clickable:this.clickable,draggable:this.draggable,label:this.label,icon:this.icon,shape:this.shape,title:(null===(t=this.label)||void 0===t?void 0:t.text)||"",map:this.map.mapObject,visible:this.visible,zIndex:this.zIndex}),this.$watch("clickable",(function(){return e.mapObject.setClickable(e.clickable)})),this.$watch("draggable",(function(){return e.mapObject.setDraggable(e.draggable)})),this.$watch("visible",(function(){return e.mapObject.setVisible(e.visible)})),this.$watch("zIndex",(function(){return e.mapObject.setZIndex(e.zIndex)})),this.mapObject.addListener("dragend",(function(t){if(e.draggable){var n={lat:t.latLng.lat(),lng:t.latLng.lng()};e.$emit("update:latLng",n),e.$emit("update:lat-lng",n)}})),this.mapObject.addListener("mouseover",(function(t){return e.$emit("mouseover",t)})),this.mapObject.addListener("mouseout",(function(t){return e.$emit("mouseout",t)})),this.mapObject.addListener("click",(function(t){e.clickable&&e.$emit("click",t)})),this.ready=!0},render:function(t){return this.ready&&this.$slots.default?t("div",{style:{display:"none"}},this.$slots.default):null}},void 0,void 0,!1,null,null,null);f.options.__file="src/components/GMarker.vue";const m=f.exports,h={mixins:[{props:{stroke:{type:Boolean,custom:!0,default:!0},color:{type:String,custom:!0,default:"#3388ff"},weight:{type:Number,custom:!0,default:3},opacity:{type:Number,custom:!0,default:1}},mounted:function(){this.pathOptions={strokeColor:this.stroke?this.color:void 0,strokeOpacity:this.stroke?this.opacity:void 0,strokeWeight:this.stroke?this.weight:void 0}}}],props:{latLngs:{type:Array,default:function(){return[]}},clickable:{type:Boolean,default:!0},draggable:{type:Boolean,default:!1},editable:{type:Boolean,default:!1},visible:{type:Boolean,default:!0},zIndex:{type:Number,default:0}}};function g(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,o)}return n}function b(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?g(Object(n),!0).forEach((function(e){y(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):g(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function y(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var v=a({name:"GPolyline",mixins:[h,t],inject:["map"],data:function(){return{ready:!1}},props:{},beforeDestroy:function(){this.mapObject.setMap(null)},mounted:function(){var t=this;this.$debug("GPolyline",this.$props),this.mapObject=new google.maps.Polyline(b(b({},this.pathOptions),{},{clickable:this.clickable,draggable:this.draggable,editable:this.editable,geodesic:!1,icons:[],map:this.map.mapObject,path:this.latLngs.map((function(t){return{lat:t[0],lng:t[1]}})),visible:this.visible,zIndex:this.zIndex})),this.$watch("draggable",(function(){return t.mapObject.setDraggable(t.draggable)})),this.$watch("editable",(function(){return t.mapObject.setEditable(t.editable)})),this.$watch("visible",(function(){return t.mapObject.setVisible(t.visible)})),this.ready=!0},render:function(t){return this.ready&&this.$slots.default?t("div",{style:{display:"none"}},this.$slots.default):null}},void 0,void 0,!1,null,null,null);v.options.__file="src/components/GPolyline.vue";const O=v.exports;function j(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,o)}return n}function x(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?j(Object(n),!0).forEach((function(e){w(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):j(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function w(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var D=a({name:"GPolygon",mixins:[h,t],inject:["map"],data:function(){return{ready:!1}},props:{fillColor:{type:String,default:"#ff3300"},fillOpacity:{type:Number,default:1}},beforeDestroy:function(){this.mapObject.setMap(null)},mounted:function(){var t=this;this.$debug("GPolygon",this.$props),this.mapObject=new google.maps.Polygon(x(x({},this.pathOptions),{},{fillColor:this.fillColor,fillOpacity:this.fillOpacity,clickable:this.clickable,draggable:this.draggable,editable:this.editable,geodesic:!1,icons:[],map:this.map.mapObject,path:this.latLngs.map((function(t){return{lat:t[0],lng:t[1]}})),visible:this.visible,zIndex:this.zIndex})),this.$watch("draggable",(function(){return t.mapObject.setDraggable(t.draggable)})),this.$watch("editable",(function(){return t.mapObject.setEditable(t.editable)})),this.$watch("visible",(function(){return t.mapObject.setVisible(t.visible)})),this.ready=!0},render:function(t){return this.ready&&this.$slots.default?t("div",{style:{display:"none"}},this.$slots.default):null}},void 0,void 0,!1,null,null,null);D.options.__file="src/components/GPolygon.vue";const $=D.exports;var B=function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"google-map-custom-popup"},[t.ready?t._t("default"):t._e()],2)};function L(t){return L="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},L(t)}function P(t,e,n){return P=E()?Reflect.construct:function(t,e,n){var o=[null];o.push.apply(o,e);var r=new(Function.bind.apply(t,o));return n&&k(r,n.prototype),r},P.apply(null,arguments)}function C(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,o=new Array(e);n<e;n++)o[n]=t[n];return o}function M(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function k(t,e){return k=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},k(t,e)}function S(t,e){if(e&&("object"===L(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return I(t)}function I(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function E(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}function G(t){return G=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},G(t)}function T(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}B._withStripped=!0;const A={name:"GCustomPopup",mixins:[t],inject:["map"],props:{position:{type:[Object,Array],custom:!0,default:null}},data:function(){return{ready:!1}},mounted:function(){var t,e=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&k(t,e)}(a,google.maps.OverlayView);var e,n,o,r,i=(e=a,n=E(),function(){var t,o=G(e);if(n){var r=G(this).constructor;t=Reflect.construct(o,arguments,r)}else t=o.apply(this,arguments);return S(this,t)});function a(t,e){var n;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,a),T(I(n=i.call(this)),"position",void 0),T(I(n),"containerDiv",void 0),n.position=t,e.classList.add("popup-bubble");var o=document.createElement("div");return o.classList.add("popup-bubble-anchor"),o.appendChild(e),n.containerDiv=document.createElement("div"),n.containerDiv.classList.add("popup-container"),n.containerDiv.appendChild(o),a.preventMapHitsAndGesturesFrom(n.containerDiv),n}return o=a,(r=[{key:"onAdd",value:function(){this.getPanes().floatPane.appendChild(this.containerDiv)}},{key:"onRemove",value:function(){this.containerDiv.parentElement&&this.containerDiv.parentElement.removeChild(this.containerDiv)}},{key:"draw",value:function(){var t=this.getProjection().fromLatLngToDivPixel(this.position),e=Math.abs(t.x)<4e3&&Math.abs(t.y)<4e3?"block":"none";"block"===e&&(this.containerDiv.style.left=t.x+"px",this.containerDiv.style.top=t.y+"px"),this.containerDiv.style.display!==e&&(this.containerDiv.style.display=e)}}])&&M(o.prototype,r),a}();this.mapObject=new e(P(google.maps.LatLng,function(t){if(Array.isArray(t))return C(t)}(t=this.position)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(t){if("string"==typeof t)return C(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?C(t,e):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),this.$el),this.mapObject.setMap(this.map.mapObject),this.ready=!0}},z=A;n(324);var R=a(z,B,[],!1,null,null,null);R.options.__file="src/components/GCustomPopup.vue";const N=R.exports;var Z=function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"google-map-html-marker"},[t.ready?t._t("default"):t._e()],2)};function U(t){return U="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},U(t)}function V(t,e,n){return V=F()?Reflect.construct:function(t,e,n){var o=[null];o.push.apply(o,e);var r=new(Function.bind.apply(t,o));return n&&X(r,n.prototype),r},V.apply(null,arguments)}function H(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,o=new Array(e);n<e;n++)o[n]=t[n];return o}function W(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function X(t,e){return X=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},X(t,e)}function q(t,e){if(e&&("object"===U(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return Y(t)}function Y(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function F(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}function K(t){return K=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},K(t)}function J(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}Z._withStripped=!0;const Q={name:"GHtmlMarker",mixins:[t],inject:["map"],props:{position:{type:[Object,Array],custom:!0,default:null},clickable:{type:Boolean,default:!0},draggable:{type:Boolean,default:!1},pane:{type:String,default:"overlayImage"}},data:function(){return{ready:!1}},mounted:function(){var t,e=this,n=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&X(t,e)}(a,google.maps.OverlayView);var e,n,o,r,i=(e=a,n=F(),function(){var t,o=K(e);if(n){var r=K(this).constructor;t=Reflect.construct(o,arguments,r)}else t=o.apply(this,arguments);return q(this,t)});function a(t,e,n,o){var r;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,a),J(Y(r=i.call(this)),"position",void 0),J(Y(r),"draggable",void 0),J(Y(r),"pane",void 0),J(Y(r),"content",void 0),J(Y(r),"containerDiv",void 0),r.position=t,r.draggable=e,r.pane=n,r.content=o,r.handleDragDown,r.handleDragMove,r.handleDragLeave,r.handleDragUp,r.createDiv(),r}return o=a,(r=[{key:"createDiv",value:function(){var t=this;this.containerDiv=document.createElement("div"),this.containerDiv.appendChild(this.content),this.containerDiv.classList.add("g-html-marker-container"),["mouseover","mouseout","mouseenter","mouseleave","click","touchstart","touchend"].forEach((function(e){google.maps.event.addDomListener(t.containerDiv,e,(function(){return google.maps.event.trigger(t,e,{latLng:t.getPosition()})}))}))}},{key:"appendDivToPane",value:function(){this.getPanes()[this.pane].appendChild(this.containerDiv)}},{key:"attachEvents",value:function(){var t,e=this;if(!this.draggable)return google.maps.event.removeListener(this.handleDragLeave),google.maps.event.removeListener(this.handleDragDown),google.maps.event.removeListener(this.handleDragMove),google.maps.event.removeListener(this.handleDragUp),void this.getMap().setOptions({gestureHandling:"greedy"});this.handleDragLeave=google.maps.event.addDomListener(this.containerDiv,"mouseleave",(function(){return google.maps.event.trigger(e.containerDiv,"mouseup")})),this.handleDragDown=google.maps.event.addDomListener(this.containerDiv,"mousedown",(function(n){google.maps.event.trigger(e,"dragstart",{latLng:e.position}),e.getMap().setOptions({gestureHandling:"none"}),t=n,e.handleDragMove=google.maps.event.addDomListener(e.getMap().getDiv(),"mousemove",(function(n){var o=t.clientX-n.clientX,r=t.clientY-n.clientY,i=e.getProjection().fromLatLngToDivPixel(e.position),a=e.getProjection().fromDivPixelToLatLng(new google.maps.Point(i.x-o,i.y-r));e.position=a,e.positionDiv(),google.maps.event.trigger(e,"drag",{latLng:e.position}),t=n}))})),this.handleDragUp=google.maps.event.addDomListener(this.containerDiv,"mouseup",(function(){google.maps.event.removeListener(e.handleDragMove),e.getMap().setOptions({gestureHandling:"greedy"}),google.maps.event.trigger(e,"dragend",{latLng:e.position})}))}},{key:"positionDiv",value:function(){var t=this.getProjection().fromLatLngToDivPixel(this.position);t&&(this.containerDiv.style.left="".concat(t.x,"px"),this.containerDiv.style.top="".concat(t.y,"px"))}},{key:"onAdd",value:function(){this.appendDivToPane(),this.attachEvents()}},{key:"onRemove",value:function(){this.containerDiv.parentElement&&(this.containerDiv.parentElement.removeChild(this.containerDiv),this.containerDiv=null)}},{key:"draw",value:function(){this.containerDiv||(this.createDiv(),this.appendDivToPane()),this.positionDiv()}},{key:"getPosition",value:function(){return this.position}},{key:"getDraggable",value:function(){return this.draggable}},{key:"setDraggable",value:function(t){this.draggable=t,this.attachEvents()}}])&&W(o.prototype,r),a}();this.mapObject=new n(V(google.maps.LatLng,function(t){if(Array.isArray(t))return H(t)}(t=this.position)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(t){if("string"==typeof t)return H(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?H(t,e):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),this.draggable,this.pane,this.$el),this.mapObject.setMap(this.map.mapObject),this.$watch("draggable",(function(){return e.mapObject.setDraggable(e.draggable)})),this.mapObject.addListener("dragend",(function(t){var n={lat:t.latLng.lat(),lng:t.latLng.lng()};e.$emit("update:latLng",n),e.$emit("update:lat-lng",n)})),this.mapObject.addListener("mouseover",(function(t){return e.$emit("mouseover",t)})),this.mapObject.addListener("mouseout",(function(t){return e.$emit("mouseout",t)})),this.mapObject.addListener("click",(function(t){return e.$emit("click",t)})),this.ready=!0}},tt=Q;n(910);var et=a(tt,Z,[],!1,null,null,null);et.options.__file="src/components/GHtmlMarker.vue";const nt=et.exports;var ot=function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"google-map-info-window"},[t.ready?t._t("default"):t._e()],2)};ot._withStripped=!0;var rt=a({name:"GInfoWindow",mixins:[t],inject:["map"],props:{},data:function(){return{ready:!1}},mounted:function(){this.mapObject=new google.maps.InfoWindow({content:""}),this.mapObject.setMap(this.map.mapObject),this.ready=!0}},ot,[],!1,null,null,null);rt.options.__file="src/components/GInfoWindow.vue";const it=rt.exports})(),o})()}));