/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function(){(window.wpCoreControlsBundle=window.wpCoreControlsBundle||[]).push([[16],{445:function(ia,ba,e){function ea(){return!1}function x(e,f,h){if(!(f in fa))return!0;f=fa[f];for(var n=0;n<f.length;n++){var r=e;var w=f[n];var x=h;if(w.name in r){var y="",z=!1;r=r[w.name];switch(w.type){case "s":y="String";z=Object(ca.isString)(r);break;case "a":y="Array";z=Object(ca.isArray)(r);break;case "n":y="Number";z=Object(ca.isNumber)(r)&&Object(ca.isFinite)(r);break;case "o":y="Object",z=Object(ca.isObject)(r)&&
!Object(ca.isArray)(r)}z||x.reject('Expected response field "'+w.name+'" to have type '+y);w=z}else x.reject('Response missing field "'+w.name+'"'),w=!1;if(!w)return!1}return!0}e.r(ba);var ha=e(1),ca=e(0);e.n(ca);var da=e(2);ia=e(51);var aa=e(34),w=e(463),y=e(94),n=e(376),h=e(40),f=e(163),r=function(){function e(){this.request=this.result=null;this.state=0;var e=this;e.promise=new Promise(function(f,h){e.resolve=function(){if(0===e.state||4===e.state)e.state=1,e.result=arguments[0],f.apply(null,arguments)};
e.reject=function(){if(0===e.state||4===e.state)e.state=2,h.apply(null,arguments)}})}e.prototype.ht=function(){return 1===(this.state&1)};e.prototype.Pda=function(){return 2===(this.state&2)};e.prototype.Xi=function(){return!this.Pda()&&!this.ht()};e.prototype.qda=function(){return 4===(this.state&4)};e.prototype.iM=function(){this.state|=4};return e}(),z=function(){function e(){this.Rs={};this.Ib=[]}e.prototype.pop=function(){var e=this.Ib.pop();this.Rs[e.key]=void 0;return e};e.prototype.push=function(e,
f){f={key:e,data:f};this.Ib.push(f);this.Rs[e]=f.data};e.prototype.contains=function(e){return!!this.Rs[e]};e.prototype.get=function(e){return this.Rs[e]};e.prototype.set=function(e,f){var h=this;this.Rs[e]=f;this.Ib.forEach(function(f,n){f.key===e&&(h.Ib[n]=f)})};e.prototype.remove=function(e){var f=this;this.Rs[e]=void 0;this.Ib.forEach(function(h,n){h.key===e&&f.Ib.splice(n,1)})};e.prototype.length=function(){return this.Ib.length};return e}(),fa={pages:[{name:"pages",type:"a"}],pdf:[{name:"url",
type:"s"}],docmod:[{name:"url",type:"s"},{name:"rID",type:"s"}],health:[],tiles:[{name:"z",type:"n"},{name:"rID",type:"n"},{name:"tiles",type:"a"},{name:"size",type:"n"}],cAnnots:[{name:"annots",type:"a"}],annots:[{name:"url",type:"s"},{name:"name",type:"s"}],image:[{name:"url",type:"s"},{name:"name",type:"s"},{name:"p",type:"n"}],text:[{name:"url",type:"s"},{name:"name",type:"s"},{name:"p",type:"n"}],ApString2Xod:[{name:"url",type:"s"},{name:"rID",type:"s"}]};e=function(){function e(e,f,n){var x=
this;this.JM=this.bS=!1;this.lh=this.iF=this.vu=this.KK=this.nH=this.Mm=null;this.om=new r;this.Ep=new r;this.nB=!1;this.Bf=this.De=this.Ee=this.tf=null;this.Sf=[];this.ZB=[];this.cache={};this.timeStamp=0;this.fh=[];this.gj=[];this.rI=null;this.QR=!1;this.vY=this.id=null;this.wK=this.uU=ea;this.ei=0;this.CJ=!1;this.YV=1;this.cj={};this.Pr=0;this.Lt=new z;f.endsWith("/")||(f+="/");n=n||{};this.bS=n.disableWebsockets||!1;this.JM=n.singleServerMode||!1;null!=n.customQueryParameters&&Object(h.b)("wvsQueryParameters",
n.customQueryParameters);f.endsWith("blackbox/")||(f+="blackbox/");this.Mm=n.uploadData||null;this.vu=n.uriData||null;this.nH=n.cacheKey||null;this.KK=n.officeOptions||null;this.Ve=f;this.UH=e;this.Eo(!0);this.es=(new w.a(f,null,this.Ph())).L$(!this.bS,function(e){x.gfa(e)},function(){return null},function(){x.nB=!1},function(){x.iia()})}e.prototype.o7=function(){var e=this;return new Promise(function(f,h){var n=new XMLHttpRequest;n.open("GET",e.Ve+"ck");n.withCredentials=e.Ph();n.onreadystatechange=
function(){n.readyState===XMLHttpRequest.DONE&&(200===n.status?f():h())};n.send()})};e.prototype.Kja=function(e){this.uU=e||ea;this.wK=ea};e.prototype.h6=function(){this.ZX();return this.es.Np(!0)};e.prototype.ZX=function(){Object(ha.b)(this,void 0,void 0,function(){return Object(ha.d)(this,function(e){switch(e.label){case 0:return this.Ep=new r,this.om=new r,this.nB=!1,this.id=null,this.QR=!1,[4,this.o7()];case 1:return e.ea(),[2]}})})};e.prototype.iia=function(){this.uU();this.ZX();this.tf&&(this.tf.Xi()?
this.rh(this.tf.request):this.tf.ht()&&this.wK(this.tf.result.url,"pdf")&&(this.tf=null,this.YX()));this.Bf&&this.Bf.Xi()&&this.rh(this.Bf.request);this.Ee&&this.Ee.Xi()?this.rh(this.Ee.request):this.De&&this.De.Xi()&&this.hU();var e;for(e=0;e<this.fh.length;e++)this.fh[e]&&(this.fh[e].Xi()?this.rh(this.fh[e].request):this.fh[e].ht()&&this.wK(this.fh[e].result.url,"image")&&(this.fh[e]=null,this.jE(Object(ca.uniqueId)(),e)));for(e=0;e<this.gj.length;e++)this.gj[e]&&this.gj[e].Xi()&&!this.gj[e].qda()&&
this.rh(this.gj[e].request);for(e=0;e<this.Sf.length;e++)this.Sf[e]&&this.Sf[e].Xi()&&this.rh(this.Sf[e].request)};e.prototype.$ca=function(){return this.nB?Promise.resolve():(this.nB=!0,this.timeStamp=Date.now(),this.es.TC())};e.prototype.$la=function(){var e=this,h,n,r,w,x;return new Promise(function(y,z){if(e.Mm)h=new FormData,h.append("file",e.Mm.fileHandle,e.Mm.fileHandle.name),n=e.Mm.loadCallback,w="upload",r=e.Mm.extension;else if(e.vu)h={uri:e.vu.uri,iqa:e.vu.shareId},h=Object.keys(h).map(function(e){return e+
"="+(h[e]?encodeURIComponent(h[e]):"")}).join("&"),x="application/x-www-form-urlencoded; charset=UTF-8",n=e.vu.loadCallback,w="url",r=e.vu.extension;else{y();return}var ba=new XMLHttpRequest,da=Object(aa.j)(e.Ve,"AuxUpload");da=Object(f.a)(da,{type:w,ext:r});ba.open("POST",da);ba.withCredentials=e.Ph();x&&ba.setRequestHeader("Content-Type",x);ba.addEventListener("load",function(){if(ba.readyState===ba.DONE&&200===ba.status){var f=JSON.parse(ba.response);e.UH=f.uri;n(f);y(f)}});ba.addEventListener("error",
function(){z(ba.statusText+" "+JSON.stringify(ba))});e.Mm&&null!=e.Mm.onProgress&&(ba.upload.onprogress=function(f){e.Mm.onProgress(f)});ba.send(h)})};e.prototype.$ha=function(e){this.password=e||null;this.om.ht()||(this.om=new r,this.rh({t:"pages"}));return this.om.promise};e.prototype.Zx=function(e){this.rI=e||null;this.om.ht()||this.rh({t:"pages"});return this.om.promise};e.prototype.Qv=function(e){e=Object.assign(e,{uri:encodeURIComponent(this.UH)});this.rI&&(e.ext=this.rI);this.lh&&(e.c=this.lh);
this.password&&(e.pswd=this.password);this.nH&&(e.cacheKey=this.nH);this.KK&&(e.officeOptions=this.KK);return e};e.prototype.Hia=function(){0<this.Lt.length()&&10>=this.Pr&&this.Iia(this.Lt.pop().data)};e.prototype.I5=function(e){0<this.Lt.length()&&this.Lt.contains(e)&&this.Lt.remove(e)};e.prototype.rh=function(e){e=this.Qv(e);this.es.send(e)};e.prototype.qY=function(e,f){10<this.Pr?this.Lt.push(e,f):(this.Pr++,e=this.Qv(f),this.es.send(e))};e.prototype.Iia=function(e){this.Pr++;e=this.Qv(e);this.es.send(e)};
e.prototype.vl=function(e){return e};e.prototype.tU=function(e){this.JM&&e?Object(da.j)("Server failed health check. Single server mode ignoring check."):!this.roa&&e&&3>=this.ei?(this.CJ=!0,this.es.Np()):3<this.ei&&(this.JM=!0)};e.prototype.gfa=function(e){var n=this,w=e.data,z=e.err,aa=e.t;switch(aa){case "upload":z?this.ama.reject(z):this.ama.resolve("Success");break;case "pages":z?this.om.reject(z):x(w,aa,this.om)&&this.om.resolve(w);break;case "config":if(z)this.Ep.reject(z);else if(x(w,aa,this.Ep)){this.tU(w.unhealthy);
w.id&&(this.id=w.id);if(w.auth){var ba=Object(h.a)("wvsQueryParameters");ba.auth=w.auth;Object(h.b)("wvsQueryParameters",ba)}w.serverVersion&&(this.iF=w.serverVersion,Object(da.h)("[WebViewer Server] server version: "+this.iF));w.serverID?(this.ei=w.serverID===this.vY&&this.CJ?this.ei+1:0,this.vY=w.serverID):this.ei=0;this.CJ=!1;this.Ep.resolve(w)}break;case "health":z?this.Ep.reject(z):x(w,aa,this.Ep)&&this.tU(w.unhealthy);break;case "pdf":w.url=Object(f.a)(this.Ve+"../"+encodeURI(w.url));z?this.tf.reject(z):
x(w,aa,this.tf)&&this.tf.resolve(w);break;case "ApString2Xod":w.url=Object(f.a)(this.Ve+"../data/"+encodeURI(w.url));z?this.cj[w.rID].reject(z):x(w,aa,this.cj[w.rID])&&this.cj[w.rID].resolve(w);break;case "docmod":w.url=Object(f.a)(this.Ve+"../"+encodeURI(w.url));z?this.cj[w.rID].reject(z):x(w,aa,this.tf)&&this.cj[w.rID].resolve(w);break;case "xod":if(z)this.Ee&&this.Ee.Xi()&&this.Ee.reject(z),this.De&&this.De.Xi()&&this.De.reject(z);else if(w.notFound)w.noCreate||this.Ee&&this.Ee.Xi()&&this.Ee.resolve(w),
this.De&&this.De.Xi()&&this.De.resolve(w);else{w.url&&(w.url=Object(f.a)(this.Ve+"../"+encodeURI(w.url)));if(!this.De||this.De.ht())this.De=new r,this.De.request={t:"xod",noCreate:!0};this.Ee||(this.Ee=new r,this.Ee.request={t:"xod"});this.De.resolve(w);this.Ee.resolve(w)}break;case "cAnnots":ba=this.Bf;if(z)ba.reject(z);else if(x(w,aa,ba)){ba.iM();var ea=[],fa=w.annots;w=function(e){var h=fa[e].s,r=fa[e].e,w=ha.Ve+"../"+encodeURI(fa[e].xfdf),x="true"===fa[e].hasAppearance?Object(f.a)(w+".xodapp"):
null,y=Object(ca.range)(h,r+1);ea[e]={range:y,promise:new Promise(function(e,h){var r=new XMLHttpRequest;r.open("GET",Object(f.a)(w));r.responseType="text";r.withCredentials=n.Ph();r.addEventListener("load",function(){r.readyState===r.DONE&&200===r.status&&e({jr:r.response,ll:x,range:y})});r.addEventListener("error",function(){h(r.statusText+" "+JSON.stringify(r))});r.send()})}};var ha=this;for(z=0;z<fa.length;z++)w(z);ba.resolve(ea)}break;case "annots":if(z)this.Bf.reject(z);else if(x(w,aa,this.Bf)){this.Bf.iM();
var ia=new XMLHttpRequest;ba=this.Ve+"../"+encodeURI(w.url);var ja=w.hasAppearance?Object(f.a)(ba+".xodapp"):null;ia.open("GET",Object(f.a)(ba));ia.responseType="text";ia.withCredentials=this.Ph();ia.addEventListener("load",function(){ia.readyState===ia.DONE&&200===ia.status&&n.Bf.resolve({jr:ia.response,ll:ja})});ia.addEventListener("error",function(){n.Bf.reject(ia.statusText+" "+JSON.stringify(ia))});ia.send()}break;case "image":this.Pr--;var ka=this.fh[w.p];z?ka.promise.reject(z):x(w,aa,ka)&&
(ka.result=w,ka.result.url=Object(f.a)(this.Ve+"../"+encodeURI(ka.result.url)),ka.resolve(ka.result));break;case "tiles":this.Pr--;ka=w.rID;ba=this.Sf[ka];this.Sf[ka]=null;this.ZB.push(ka);if(z)ba.reject(z);else if(x(w,aa,ba)){for(z=0;z<w.tiles.length;z++)w.tiles[z]=Object(f.a)(this.Ve+"../"+encodeURI(w.tiles[z]));ba.resolve(w)}break;case "text":ka=this.gj[w.p];if(z)ka.reject(z);else if(x(w,aa,ka)){ka.iM();var Ca=new XMLHttpRequest;w=Object(f.a)(this.Ve+"../"+encodeURI(w.url));Ca.open("GET",w);Ca.withCredentials=
this.Ph();Ca.addEventListener("load",function(){Ca.readyState===Ca.DONE&&200===Ca.status&&(ka.result=JSON.parse(Ca.response),ka.resolve(ka.result))});Ca.addEventListener("error",function(e){ka.reject(Ca.statusText+" "+JSON.stringify(e))});Ca.send()}break;case "progress":"loading"===w.t&&this.trigger(y.a.Events.DOCUMENT_LOADING_PROGRESS,[w.bytes,w.total])}this.Hia();!aa&&e.echo&&e&&"apstring2xod"===e.echo.t&&(e=e.echo.reqID)&&(2<=parseInt(this.iF,10)?this.cj[e].reject("Message unhandled by server"):
this.cj[e].reject())};e.prototype.raa=function(){return Object(ha.b)(this,void 0,void 0,function(){return Object(ha.d)(this,function(e){switch(e.label){case 0:return[4,this.$ca()];case 1:return e.ea(),[2,this.Ep.promise]}})})};e.prototype.$$=function(e){for(var h=this,n=new XMLHttpRequest,w=Object(f.a)(this.Ve+"aul",{id:this.id}),x=new FormData,y={},z=0;z<e.body.length;z++){var aa=e.body[z];y[aa.id]=aa.aH.w+";"+aa.aH.h;x.append(aa.id,aa.aH.dataString)}e={t:"apstring2xod",reqID:this.YV++,parts:y};
var ba=this.Qv(e);x.append("msg",JSON.stringify(ba));this.cj[ba.reqID]=new r;n.open("POST",w);n.withCredentials=this.Ph;w=new Promise(function(e,f){n.onreadystatechange=function(){4===n.readyState&&(200===n.status?e():f("An error occurred while sending down appearance strings to the server"))}});n.send(x);return w.then(function(){return h.cj[ba.reqID].promise})};e.prototype.j6=function(){var e=this.iF.split("-")[0].split("."),f=["1","5","9"];if(3!==e.length)throw Error("Invalid WVS version length.");
if(3!==f.length)throw Error("Invalid version length.");for(var h=0;h<e.length;++h){if(f.length===h||e[h]>f[h])return-1;if(e[h]!==f[h])return 1}return 0};e.prototype.Ap=function(){return 0>=this.j6()};e.prototype.BI=function(){this.Bf||(this.Bf=new r,this.Ap()?this.Bf.request={t:"cAnnots"}:this.Bf.request={t:"annots"},this.rh(this.Bf.request));return this.Bf.promise};e.prototype.jE=function(e,f){this.fh[f]||(this.fh[f]=new r,this.fh[f].request={t:"image",p:f},this.qY(e,this.fh[f].request));return this.fh[f].promise};
e.prototype.aia=function(e){this.gj[e]||(this.gj[e]=new r,this.gj[e].request={t:"text",p:e},this.rh(this.gj[e].request));return this.gj[e].promise};e.prototype.bia=function(e,f,h,n,w){var x=this.Sf.length;this.ZB.length&&(x=this.ZB.pop());this.Sf[x]=new r;this.Sf[x].request={t:"tiles",p:f,z:h,r:n,size:w,rID:x};this.qY(e,this.Sf[x].request);return this.Sf[x].promise};e.prototype.YX=function(){this.tf||(this.tf=new r,this.tf.request={t:"pdf"},this.QR?this.tf.resolve({url:this.UH}):this.rh(this.tf.request));
return this.tf.promise};e.prototype.BT=function(e){var h=this,n=new XMLHttpRequest,w=Object(f.a)(this.Ve+"aul",{id:this.id}),x=new FormData,y={};e.annots&&(y.annots="xfdf");e.watermark&&(y.watermark="png");e.redactions&&(y.redactions="redact");y={t:"docmod",reqID:this.YV++,parts:y};e.print&&(y.print=!0);var z=this.Qv(y);x.append("msg",JSON.stringify(z));return Promise.all([e.annots,e.watermark,e.redactions].map(function(e){return Promise.resolve(e)})).then(function(e){var f=e[0],y=e[1];e=e[2];f&&
x.append("annots",f);y&&x.append("watermark",y);e&&x.append("redactions",e);h.cj[z.reqID]=new r;n.open("POST",w);n.withCredentials=h.Ph;f=new Promise(function(e,f){n.onreadystatechange=function(){4===n.readyState&&(200===n.status?e():f("An error occurred while sending down annotation data to the server"))}});n.send(x);return f.then(function(){return h.cj[z.reqID].promise})})};e.prototype.hU=function(){this.De||(this.De=new r,this.De.request={t:"xod",noCreate:!0},this.rh(this.De.request));return this.De.promise};
e.prototype.cia=function(){this.Ee||(this.Ee=new r,this.Ee.request={t:"xod"},this.rh(this.Ee.request));return this.Ee.promise};e.prototype.yo=function(){return!0};e.prototype.request=function(){};e.prototype.rX=function(){};e.prototype.abort=function(){for(var e=0;e<this.Sf.length;e++)this.Sf[e]&&(this.Sf[e].resolve(null),this.Sf[e]=null,this.ZB.push(e));this.close()};e.prototype.vE=function(e){this.lh=this.lh||{};this.lh.headers=e};e.prototype.Eo=function(e){this.lh=this.lh||{};this.lh.internal=
this.lh.internal||{};this.lh.internal.withCredentials=e};e.prototype.Ph=function(){return this.lh&&this.lh.internal?this.lh.internal.withCredentials:null};e.prototype.getFileData=function(){return Promise.reject()};return e}();Object(ia.a)(e);Object(n.a)(e);Object(n.b)(e);ba["default"]=e},463:function(ia,ba,e){var ea=e(1),x=e(2),ha=e(34),ca=e(40),da=e(163),aa=e(112),w=function(){function e(e,f,n,w,x,y){void 0===n&&(n=null);void 0===w&&(w=null);void 0===x&&(x=null);void 0===y&&(y=null);this.EV=!1;
this.ei=0;this.XQ=this.sma(e);this.url=f?this.XQ+"/"+f:this.XQ+"/ws";this.NH=n;this.Dx=w;this.Ov=x;this.NL=y}e.prototype.sma=function(e){var f=e.indexOf("://"),h="ws://";0>f?f=0:(5===f&&(h="wss://"),f+=3);var n=e.lastIndexOf("/");0>n&&(n=e.length);return h+e.slice(f,n)};e.prototype.send=function(e){this.Qo.readyState===WebSocket.CLOSED||this.EV||this.Qo.send(JSON.stringify(e))};e.prototype.TC=function(){return Object(ea.b)(this,void 0,void 0,function(){var e,f=this;return Object(ea.d)(this,function(){e=
Object(ca.a)("wvsQueryParameters");e.bcid=Object(ha.k)(8);Object(ca.b)("wvsQueryParameters",e);return[2,new Promise(function(e,h){var n=Object(da.a)(f.url);f.Qo=new WebSocket(n);f.Qo.onopen=function(){f.Dx&&f.Dx();e()};f.Qo.onerror=function(e){f.EV=!0;h(e)};f.Qo.onclose=function(e){var n=e.code;return Object(ea.b)(f,void 0,void 0,function(){var e=this;return Object(ea.d)(this,function(f){switch(f.label){case 0:return this.Ov&&this.Ov(),3E3===n?[3,3]:8>this.ei++?[4,new Promise(function(f){return setTimeout(function(){return Object(ea.b)(e,
void 0,void 0,function(){return Object(ea.d)(this,function(e){switch(e.label){case 0:return this.NL(),[4,this.TC()];case 1:return e.ea(),f(),[2]}})})},3E3)})]:[3,2];case 1:return f.ea(),[3,3];case 2:h(aa.a),f.label=3;case 3:return[2]}})})};f.Qo.onmessage=function(e){e&&e.data&&(e=JSON.parse(e.data),e.hb?f.send({hb:!0}):e.end?close():f.NH(e))}})]})})};e.prototype.Np=function(e){void 0===e&&(e=!1);this.ei=0;e?this.Qo.close(3E3):this.Qo.close();return Promise.resolve()};return e}(),y=function(){function e(e,
f,n,w,x,y,aa){void 0===w&&(w=null);void 0===x&&(x=null);void 0===y&&(y=null);void 0===aa&&(aa=null);this.ei=this.iE=this.id=0;this.Uw=!1;this.request=null;e=this.Aga(e);this.url=f?e+"/"+f+"pf":e+"/pf";this.bF=n;this.NH=w;this.Dx=x;this.Ov=y;this.NL=aa}e.prototype.Aga=function(e){var f=e.lastIndexOf("/");0>f&&(f=e.length);return e.slice(0,f)};e.prototype.Y6=function(e){e=e.split("\n");for(e[e.length-1]&&e.pop();0<e.length&&3>e[e.length-1].length;)"]"===e.pop()&&(this.id=0);0<e.length&&3>e[0].length&&
e.shift();for(var f=0;f<e.length;++f)e[f].endsWith(",")&&(e[f]=e[f].substr(0,e[f].length-1));return e};e.prototype.hY=function(){return Object(ea.b)(this,void 0,void 0,function(){var e=this;return Object(ea.d)(this,function(f){switch(f.label){case 0:return 8>this.ei++?[4,new Promise(function(f){return setTimeout(function(){e.NL();e.TC();f()},3E3)})]:[3,2];case 1:f.ea(),f.label=2;case 2:return[2]}})})};e.prototype.Cga=function(e){Object(ea.b)(this,void 0,void 0,function(){var f,h;return Object(ea.d)(this,
function(n){switch(n.label){case 0:f=null,h=0,n.label=1;case 1:if(!(h<e.length))return[3,6];f=JSON.parse(e[h]);if(!f)return[3,5];if(!f.end)return[3,2];close();return[3,5];case 2:if(!f.id||Number(f.id)===this.id)return[3,4];Object(x.j)("Reconnecting, new server detected");this.Np();return[4,this.hY()];case 3:return n.ea(),[3,5];case 4:f.hb&&Number(f.id)===this.id?this.send({hb:!0}):this.Uw||this.NH(f),n.label=5;case 5:return++h,[3,1];case 6:return[2]}})})};e.prototype.dfa=function(e){Object(ea.b)(this,
void 0,void 0,function(){var f,h,n;return Object(ea.d)(this,function(r){switch(r.label){case 0:if(!(3<=e.readyState))return[3,2];try{f=e.responseText.length}catch(ka){return Object(x.h)("caught exception"),[2]}if(0<f)try{h=this.Y6(e.responseText),0===this.id&&0<h.length&&(n=JSON.parse(h.shift()),this.id=n.id,this.ei=0),this.Cga(h)}catch(ka){}return this.Uw?[3,2]:[4,this.HS()];case 1:r.ea(),r.label=2;case 2:return[2]}})})};e.prototype.HS=function(){return Object(ea.b)(this,void 0,void 0,function(){var e=
this;return Object(ea.d)(this,function(){return[2,new Promise(function(f,h){function n(){return Object(ea.b)(e,void 0,void 0,function(){return Object(ea.d)(this,function(e){switch(e.label){case 0:h(),this.Np(),e.label=1;case 1:return this.Uw&&8>this.ei?[4,this.hY()]:[3,3];case 2:return e.ea(),[3,1];case 3:return[2]}})})}e.request=new XMLHttpRequest;e.request.withCredentials=e.bF;var r=Object(da.a)(e.url,0!==e.id?{id:String(e.id),uc:String(e.iE)}:{uc:String(e.iE)});e.iE++;e.request.open("GET",r,!0);
e.request.setRequestHeader("Cache-Control","no-cache");e.request.setRequestHeader("X-Requested-With","XMLHttpRequest");e.request.onreadystatechange=function(){e.dfa(e.request)};e.request.addEventListener("error",n);e.request.addEventListener("timeout",n);e.request.addEventListener("load",function(){e.Dx&&e.Dx();f()});e.request.send()})]})})};e.prototype.TC=function(){var e=Object(ca.a)("wvsQueryParameters");e.bcid=Object(ha.k)(8);Object(ca.b)("wvsQueryParameters",e);this.iE=this.id=0;this.Uw=!1;return this.HS()};
e.prototype.send=function(e){var f=this,h=new XMLHttpRequest;h.withCredentials=this.bF;var n=Object(da.a)(this.url,{id:String(this.id)}),w=new FormData;w.append("data",JSON.stringify(e));h.addEventListener("error",function(){f.Np()});h.open("POST",n);h.setRequestHeader("X-Requested-With","XMLHttpRequest");h.send(w)};e.prototype.Np=function(){this.id=0;this.Uw=!0;this.Ov&&this.Ov();this.request.abort();return Promise.resolve()};return e}();ia=function(){function e(e,f,n){this.wR=e;this.target=f;this.bF=
n}e.prototype.L$=function(e,f,n,x,aa){void 0===e&&(e=!0);void 0===f&&(f=null);void 0===n&&(n=null);void 0===x&&(x=null);void 0===aa&&(aa=null);return e?new w(this.wR,this.target,f,n,x,aa):new y(this.wR,this.target,this.bF,f,n,x,aa)};return e}();ba.a=ia}}]);}).call(this || window)