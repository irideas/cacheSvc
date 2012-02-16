/*
*  cacheSvc.js
*
*/

/* 
*   JSON-API:
*   JSON.stringify 
*   JSON.parse 
*   如果保证浏览器或已有类库支持 
*   可自行去除或做适配
*/
var JSON;JSON||(JSON={}),function(){function f(a){return a<10?"0"+a:a}function quote(a){return escapable.lastIndex=0,escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i&&typeof i=="object"&&typeof i.toJSON=="function"&&(i=i.toJSON(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";return e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g,e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)typeof rep[c]=="string"&&(d=rep[c],e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));return e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g,e}}"use strict",typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(!b||typeof b=="function"||typeof b=="object"&&typeof b.length=="number")return str("",{"":a});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();
/**
*
*
*
*
*  只有.set 出错时会抛出异常
**/
(function(){
	var solution = {},prefix = "ns";
	solution.localStorage = {
		test: function() {
			try{return window.localStorage ? true: false;}catch(e){return false;}
		},
		methods: {
			init:function(ns){},
			set: function(ns,key,value) {
				try{localStorage.setItem(ns+key,value);}catch(e){throw e;}
			},//throw
			get: function(ns,key) {return localStorage.getItem(ns+key);},
			remove: function(ns,key) {localStorage.removeItem(ns+key);},
			clear:function(ns){
				if(ns){
					localStorage.clear();
				}else{
					for(var i = 0,len = localStorage.length,key;i<len;i++) {
						key = localStorage.key(i);
						if(key&&key.indexOf(ns)===0) {
							localStorage.removeItem(ns+key);
						}
					}
				}
			}
		}
	};
	solution.userData = {
		test: function() {
			try{return window.ActiveXObject&&document.documentElement.addBehavior? true: false}catch(e){return false;}
		},
		methods: {
			_owners:{},
			init:function(ns){
				if(!this._owners[ns])
				{
					if(document.getElementById(ns))
					{
						this._owners[ns] = document.getElementById(ns);
					}
					else
					{
						var el = document.createElement('script'),
						head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;
						el.id = ns;
						el.style.display = 'none';
						el.addBehavior('#default#userdata');
						head.insertBefore( el, head.firstChild );
						this._owners[ns] = el;
					}
					try{this._owners[ns].load(ns);}catch(e){}
					var _self = this;
					window.attachEvent("onunload", function(){
						_self._owners[ns] = null;
					});
				}
			},
			set:function(ns,key,value){
				if(this._owners[ns]){
					try{
					this._owners[ns].setAttribute(key, value);
					this._owners[ns].save(ns);
					}catch(e){throw e;}
				}
			},
			get: function(ns,key){
				if(this._owners[ns]){
					this._owners[ns].load(ns);
					return this._owners[ns].getAttribute(key);
				}
				return "";
			},
			remove: function(ns,key){
				if(this._owners[ns]){
					this._owners[ns].removeAttribute(key);
					this._owners[ns].save(ns);
				}
			},
			clear:function(ns){
				if(this._owners[ns]){
					var attributes = this._owners[ns].XMLDocument.documentElement.attributes;
					this._owners[ns].load(ns);
					for (var i=0, attr; attr = attributes[i]; i++) {
						this._owners[ns].removeAttribute(attr.name)
					}
					this._owners[ns].save(ns);
				}
			}
			}
	};
	var storeSvc = (function(){
			if (solution.localStorage.test())
			{
				return solution.localStorage.methods;
			}
			if (solution.userData.test())
			{
				return solution.userData.methods;
			}
			return {
				init:function(){},
				get:function(){},
				set:function(){},
				remove:function(){},
				clear:function(){}
			};
		})(),
		_ins = {},
		cacheSvc = function(nameSpace){
			this._cache = {};
			this._ns = prefix+"_"+nameSpace+"_";
			this._inited = false;
			if(storeSvc&&!this._inited){
				storeSvc.init(this._ns);
			}
		};
		cacheSvc.serialize = function(value){
			return JSON.stringify(value);
		};
		cacheSvc.unserialize = function(value){
			return JSON.parse(value);
		};
	cacheSvc.prototype = {
		set:function(key,value){
			this._cache[key] = value;
			try{
				storeSvc.set(this._ns,key,cacheSvc.serialize(value));
			}catch(e){throw e;}
		},
		get:function(key){
			if(this._cache[key]){
				return this._cache[key];
			}
			try{
				return this._cache[key] = cacheSvc.unserialize(storeSvc.get(this._ns,key));
			}catch(e){
				return "";
			}
		},
		remove:function(key){
			try{
				storeSvc.remove(this._ns,key);
			}catch(e){}
			this._cache[key] = null;
			delete this._cache[key];
		},
		clear:function(){
			try{
				storeSvc.clear(this._ns);
			}catch(e){}
			this._cache = {};
		}
	};
	cacheSvc.ins = function(nameSpace){
		if(!_ins[nameSpace])
		{
			_ins[nameSpace] = new cacheSvc(nameSpace);
		}
		return _ins[nameSpace];	
	};
	window.cacheSvc = cacheSvc;
})();