import{h as g,c as k,s as O,O as x,k as m,B as h,X as L,u as f,A as w,T as p,K as b}from"./index-5sX7gxRX.js";import"./index-IvzR9WIb.js";import"./vendor-XFAH9U-G.js";class $ extends f{constructor({callbackSelector:e,cause:a,data:l,extraData:o,sender:u,urls:t}){var c;super(a.shortMessage||"An error occurred while fetching for an offchain result.",{cause:a,metaMessages:[...a.metaMessages||[],(c=a.metaMessages)!=null&&c.length?"":[],"Offchain Gateway Call:",t&&["  Gateway URL(s):",...t.map(d=>`    ${w(d)}`)],`  Sender: ${u}`,`  Data: ${l}`,`  Callback selector: ${e}`,`  Extra data: ${o}`].flat()}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"OffchainLookupError"})}}class M extends f{constructor({result:e,url:a}){super("Offchain gateway response is malformed. Response data must be a hex value.",{metaMessages:[`Gateway URL: ${w(a)}`,`Response: ${m(e)}`]}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"OffchainLookupResponseMalformedError"})}}class S extends f{constructor({sender:e,to:a}){super("Reverted sender address does not match target contract address (`to`).",{metaMessages:[`Contract address: ${a}`,`OffchainLookup sender address: ${e}`]}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"OffchainLookupSenderMismatchError"})}}function T(r,e){if(!p(r))throw new b({address:r});if(!p(e))throw new b({address:e});return r.toLowerCase()===e.toLowerCase()}const P="0x556f1830",v={name:"OffchainLookup",type:"error",inputs:[{name:"sender",type:"address"},{name:"urls",type:"string[]"},{name:"callData",type:"bytes"},{name:"callbackFunction",type:"bytes4"},{name:"extraData",type:"bytes"}]};async function j(r,{blockNumber:e,blockTag:a,data:l,to:o}){const{args:u}=g({data:l,abi:[v]}),[t,c,d,s,n]=u;try{if(!T(o,t))throw new S({sender:t,to:o});const i=await C({data:d,sender:t,urls:c}),{data:y}=await x(r,{blockNumber:e,blockTag:a,data:O([s,k([{type:"bytes"},{type:"bytes"}],[i,n])]),to:o});return y}catch(i){throw new $({callbackSelector:s,cause:i,data:l,extraData:n,sender:t,urls:c})}}async function C({data:r,sender:e,urls:a}){var l;let o=new Error("An unknown error occurred.");for(let u=0;u<a.length;u++){const t=a[u],c=t.includes("{data}")?"GET":"POST",d=c==="POST"?{data:r,sender:e}:void 0;try{const s=await fetch(t.replace("{sender}",e).replace("{data}",r),{body:JSON.stringify(d),method:c});let n;if((l=s.headers.get("Content-Type"))!=null&&l.startsWith("application/json")?n=(await s.json()).data:n=await s.text(),!s.ok){o=new h({body:d,details:n!=null&&n.error?m(n.error):s.statusText,headers:s.headers,status:s.status,url:t});continue}if(!L(n)){o=new M({result:n,url:t});continue}return n}catch(s){o=new h({body:d,details:s.message,url:t})}}throw o}export{C as ccipFetch,j as offchainLookup,v as offchainLookupAbiItem,P as offchainLookupSignature};
