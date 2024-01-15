import{f as S,t as V,n as B,u as R,a as E,g as A,h as q,i as P,T as L,b as W}from"./index-4Y4c3ejC.js";import{a1 as U,a2 as Y,S as z,p as G,c as D,K as x,x as d,n as y,a3 as $,h as u,a as g,b as K}from"./vendor-aecOC4Ab.js";const w=async(e=!1)=>q("MediaBoard",{account:e?void 0:await E()}),Q=async(e,t,s)=>{const i=await w(),r="vote",c={},n=[e,t,s];await S(c,i,r,n);const v=i[r](...n);return new V(v,{errorCodes:"MediaBoard",allowAlmostSuccess:!0,seq:{type:"VoteSubject",title:"Vote Subject",ts:B(),overrides:c}})},Z=async e=>{try{const t=await w(!0),s="getSocials",i=[e];return(await t[s](...i))[0][2]}catch(t){console.log(t)}},H=async(e,t)=>{const s=await w(),i="retreat",r={},c=[e,t];await S(r,s,i,c);const n=s[i](...c);return new V(n,{errorCodes:"MediaBoard",allowAlmostSuccess:!0,seq:{type:"RetreatSubject",title:"Retreat Subject",ts:B(),overrides:r}})},X=async e=>{const t=await w(!0),s="subjectToData",i={},r=[e];return await S(i,t,s,r),await t[s](...r)},tt=async e=>R(e,await E()),et=async e=>{try{const t=await w(!0),s="getRetreatPrice",i=[e,1];return await t[s](...i)}catch{return 0}},st=async e=>{const t=await w(!0),s="getVotePrice",i=[e,1];return await t[s](...i)},it=async e=>{const t=await w(!0),s="getVotePriceWithFee",i={},r=[e,1];return await S(i,t,s,r),await t[s](...r)},yt=async(e,t)=>{const s=24n*60n*60n;let i=BigInt(new Date().getTime())/1000n-s,r=`{
      subjectWeeklyVotes(first: ${e}, where:{week:${t}}, orderBy: volumeTotal, orderDirection:desc) {
        id
        volumeTotal
        subject {
          id
          name
          image
          uri
          supply
          creator {
            address
          }
          voteLogs(first:1, where:{time_lt:${i}} orderBy:time, orderDirection:desc){
            supply
          }
        }
      }
    }`;return await A("MediaBoard",r)},gt=async e=>{const t=24n*60n*60n;let s=BigInt(new Date().getTime())/1000n-t,i=`{
      subjects(first: ${e}, orderBy:supply, orderDirection:desc, where: {creator_starts_with: "0x"}) {
        id
        image
        name
        uri
        supply
        creator {
          address
        }
        voteLogs(first:1, where:{time_lt:${s}} orderBy:time, orderDirection:desc){
          supply
        }
      }
    }`;return await A("MediaBoard",i)};var T={exports:{}};(function(e,t){(function(s,i){i(t,e)})(U,function(s,i){var r={timeout:5e3,jsonpCallback:"callback",jsonpCallbackFunction:null};function c(){return"jsonp_"+Date.now()+"_"+Math.ceil(Math.random()*1e5)}function n(h){try{delete window[h]}catch{window[h]=void 0}}function v(h){var l=document.getElementById(h);l&&document.getElementsByTagName("head")[0].removeChild(l)}function I(h){var l=arguments.length<=1||arguments[1]===void 0?{}:arguments[1],j=h,J=l.timeout||r.timeout,k=l.jsonpCallback||r.jsonpCallback,f=void 0;return new Promise(function(M,C){var m=l.jsonpCallbackFunction||c(),b=k+"_"+m;window[m]=function(N){M({ok:!0,json:function(){return Promise.resolve(N)}}),f&&clearTimeout(f),v(b),n(m)},j+=j.indexOf("?")===-1?"?":"&";var p=document.createElement("script");p.setAttribute("src",""+j+k+"="+m),l.charset&&p.setAttribute("charset",l.charset),l.nonce&&p.setAttribute("nonce",l.nonce),l.referrerPolicy&&p.setAttribute("referrerPolicy",l.referrerPolicy),l.crossorigin&&p.setAttribute("crossorigin","true"),p.id=b,document.getElementsByTagName("head")[0].appendChild(p),f=setTimeout(function(){C(new Error("JSONP request to "+h+" timed out")),n(m),v(b),window[m]=function(){n(m)}},J),p.onerror=function(){C(new Error("JSONP request to "+h+" failed")),n(m),v(b),f&&clearTimeout(f)}})}i.exports=I})})(T,T.exports);var rt=T.exports;const at=Y(rt);var ot=Object.defineProperty,ct=Object.getOwnPropertyDescriptor,nt=(e,t,s,i)=>{for(var r=i>1?void 0:i?ct(t,s):t,c=e.length-1,n;c>=0;c--)(n=e[c])&&(r=(i?n(t,s,r):n(r))||r);return i&&r&&ot(t,s,r),r};const lt=async e=>{let t;if(e)try{t=await(await at("https://publish.twitter.com/oembed?url="+encodeURIComponent(e))).json()}catch{}return t},dt=async e=>{const{author_name:t="",author_url:s="",html:i=""}=await lt(e)??{};if(t)return{name:t,url:s,id:(s.match(/([^/]+?)$/)??[])[1]??"",address:(i.match(/(0x([a-zA-Z0-9]+)?)/)??[])[1]??""}};class F extends z{constructor(){super(),this.key="",this.sync=()=>{let t=JSON.parse(P.getItem(this.key)||"{}");new Date().getTime()<1704798753768&&(P.removeItem(this.key),t={}),this.tweets=t},this.save=()=>{this.tweets={...this.tweets},P.setItem(this.key,JSON.stringify(this.tweets),86400*7*1e3)},this.set=(t,s)=>{this.tweets[t]=s,this.save()},this.key="tweets",this.sync()}async get(t){let s=this.tweets[t];return s||(s=await dt(t),s&&this.set(t,s)),s}}nt([G({value:{}})],F.prototype,"tweets",2);const _=new F;var ut=Object.defineProperty,ht=Object.getOwnPropertyDescriptor,o=(e,t,s,i)=>{for(var r=i>1?void 0:i?ht(t,s):t,c=e.length-1,n;c>=0;c--)(n=e[c])&&(r=(i?n(t,s,r):n(r))||r);return i&&r&&ut(t,s,r),r};const O=()=>({tx:""});let a=class extends L(""){constructor(){super(...arguments),this.bindBridge=new D(this,W),this.bindTweets=new D(this,_),this.action="",this.album="",this.url="",this.name="",this.author="",this.myVotes=0,this.retreatPrice=0,this.retreatDisabled=!0,this.tx=null,this.success=!1,this.pending=!1,this.rewards=!1,this.err=O(),this.ts=0,this.resetState=()=>{this.err=O(),this.pending=!1,this.success=!1,this.price=void 0,this.votes=void 0},this.close=async()=>{this.tx=null,this.resetState(),this.emit("close")},this.updateErr=(e={})=>this.err=Object.assign({},this.err,e)}async connectedCallback(){super.connectedCallback(),await this.getPrice(),await this.readFromTwitter(),this.ts++}get hasVoted(){return this.ts&&+x(this.myVotes,1)>0}async readFromTwitter(){const e=await Z(this.author),t=await _.get(e);t&&Object.assign(t,{verified:t.address.includes(this.author)}),this.social=t}async getPrice(){try{this.votes=X(this.album).then(e=>e[4]),this.myVotes=await tt(this.album).then(e=>(e>0&&(this.retreatDisabled=!1),e)),this.price=st(this.album).then(e=>x(e,18)),this.retreatPrice=await et(this.album).then(e=>x(e,18))}catch(e){let t=e.message||e.code;this.updateErr({tx:t})}}async vote(){this.pending=!0;try{this.tx=await Q(this.album,1,{value:(await it(this.album))[0]}),this.success=await this.tx.wait()}catch(e){this.tx||(this.tx={},this.tx.status=0,this.tx.err=e)}}async retreat(){this.pending=!0;try{this.tx=await H(this.album,1),this.success=await this.tx.wait()}catch(e){this.tx||(this.tx={},this.tx.status=0,this.tx.err=e)}}render(){var e,t,s;return d`<ui-dialog
      @close=${()=>{this.close()}}
    >
      <p slot="header" class="w-full text-base mr-2">Vote Track</p>
      <div slot="center" class="flex mx-4 my-6">
        <div class="flex grow justify-between p-4 bg-black/20">
          <!-- meta info -->
          <div class="flex gap-6">
            <div class="w-24 h-24 rounded-lg bg-white/10">
              <img-loader class="w-24 h-24 rounded-lg" src=${this.url}></img-loader>
            </div>
            <div>
              <div class="text-lg mb-1.5">${this.name}</div>
              <div class="text-sm">
                ${y((e=this.social)==null?void 0:e.verified,()=>d`<span><i class="text-green-600 text-sm mdi mdi-check-decagram"></i></span>`)}${(t=this.social)==null?void 0:t.name}
              </div>
              ${y((s=this.social)==null?void 0:s.id,()=>{var i,r;return d`
                  <a class="text-sm text-blue-300" href="${(i=this.social)==null?void 0:i.url}" target="_blank">@${(r=this.social)==null?void 0:r.id}</a>
                `},()=>d`-`)}

              <div class="text-neutral-400">
                You own
                ${y(this.ts,()=>d`${x(this.myVotes,0)}`,()=>d`<i class="text-sm mdi mdi-loading"></i>`)}
                tickets
              </div>
            </div>
          </div>
          <!-- Tickets -->
          <div class="text-right">
            <span class="text-lg text-sky-500"
              >${$(this.votes,d`<i class="text-sm mdi mdi-loading"></i>`)}</span
            >
            <div class="text-sm text-gray-500">Tickets</div>
          </div>
        </div>
        <!-- tip -->
      </div>
      <div slot="bottom" class="mx-4 pb-8">
        <p class="w-full flex justify-between items-center">
          It will cost
          <span class="text-right"
            ><span class="text-sm text-gray-500">Vote price <i class="text-sm mdi mdi-help-circle-outline"></i></span
          ></span>
        </p>
        <div class="mt-8">
          ${y(!this.pending,()=>d`
              ${y(this.ts&&this.action==="vote",()=>d`
                  <div class="flex flex-col justify-center items-center px-4">
                    <div>
                      <span class="text-2xl">${$(this.price,d`<i class="text-sm mdi mdi-loading"></i>`)}</span>
                    </div>
                    <ui-button
                      class="mt-3 w-full"
                      ?disabled=${this.pending}
                      ?pending=${this.pending}
                      @click=${this.vote}
                      >Vote</ui-button
                    >
                  </div>
                `)}
              ${y(this.ts&&this.hasVoted&&this.action==="retreat",()=>d`
                  <div class="flex flex-col justify-center items-center px-4 border-white/12">
                    <div class="text-2xl">
                      ${$(this.retreatPrice,d`<i class="text-sm mdi mdi-loading"></i>`)}
                    </div>

                    <ui-button
                      class="mt-3 w-full"
                      ?disabled=${this.retreatDisabled}
                      ?pending=${this.retreatDisabled}
                      @click=${this.retreat}
                      >Retreat</ui-button
                    >
                  </div>
                `)}
              <!-- <div class="text-sm text-gray-500">
                Retreat price: ${$(this.retreatPrice,d`<i class="text-sm mdi mdi-loading"></i>`)} FTM
              </div> -->
            `,()=>d`<tx-state .tx=${this.tx} .opts=${{state:{success:"Success. Your vote has been submitted."}}}
                ><ui-button slot="view" @click=${this.close}>Close</ui-button></tx-state
              >`)}
        </div>
      </div>
    </ui-dialog>`}};o([g({type:String})],a.prototype,"action",2);o([g({type:String})],a.prototype,"album",2);o([g({type:String})],a.prototype,"url",2);o([g({type:String})],a.prototype,"name",2);o([g({type:String})],a.prototype,"author",2);o([g({type:Promise})],a.prototype,"votes",2);o([u()],a.prototype,"myVotes",2);o([u()],a.prototype,"price",2);o([u()],a.prototype,"retreatPrice",2);o([u()],a.prototype,"retreatDisabled",2);o([u()],a.prototype,"social",2);o([u()],a.prototype,"tx",2);o([u()],a.prototype,"success",2);o([u()],a.prototype,"pending",2);o([u()],a.prototype,"rewards",2);o([u()],a.prototype,"err",2);o([u()],a.prototype,"ts",2);a=o([K("vote-album-dialog")],a);export{gt as a,X as b,tt as m,_ as t,yt as w};
