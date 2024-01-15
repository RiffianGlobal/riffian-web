import{e as $,t as V,n as B,u as R,a as E,g as A,f as q,h as j,T as L,b as W}from"./index-IvzR9WIb.js";import{N as G,O as U,S as Y,p as z,a as D,G as P,x as d,n as b,M as x,g as Q,h as u,d as v,c as Z}from"./vendor-XFAH9U-G.js";import"./claim-QzTUcGcl.js";const w=async(e=!1)=>q("MediaBoard",{account:e?void 0:await E()}),H=async(e,t,s)=>{const i=await w(),r="vote",o={},n=[e,t,s];await $(o,i,r,n);const g=i[r](...n);return new V(g,{errorCodes:"MediaBoard",allowAlmostSuccess:!0,seq:{type:"VoteSubject",title:"Vote Subject",ts:B(),overrides:o}})},K=async e=>{try{const t=await w(!0),s="getSocials",i=[e];return(await t[s](...i))[0][2]}catch(t){console.log(t)}},X=async(e,t)=>{const s=await w(),i="retreat",r={},o=[e,t];await $(r,s,i,o);const n=s[i](...o);return new V(n,{errorCodes:"MediaBoard",allowAlmostSuccess:!0,seq:{type:"RetreatSubject",title:"Retreat Subject",ts:B(),overrides:r}})},tt=async e=>{const t=await w(!0),s="subjectToData",i={},r=[e];return await $(i,t,s,r),await t[s](...r)},et=async e=>R(e,await E()),st=async e=>{try{const t=await w(!0),s="getRetreatPrice",i=[e,1];return await t[s](...i)}catch{return 0}},it=async e=>{const t=await w(!0),s="getVotePrice",i=[e,1];return await t[s](...i)},rt=async e=>{const t=await w(!0),s="getVotePriceWithFee",i={},r=[e,1];return await $(i,t,s,r),await t[s](...r)},vt=async(e,t)=>{const s=24n*60n*60n;let i=BigInt(new Date().getTime())/1000n-s,r=`{
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
    }`;return await A("MediaBoard",r)},ft=async e=>{const t=24n*60n*60n;let s=BigInt(new Date().getTime())/1000n-t,i=`{
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
    }`;return await A("MediaBoard",i)};var T={exports:{}};(function(e,t){(function(s,i){i(t,e)})(G,function(s,i){var r={timeout:5e3,jsonpCallback:"callback",jsonpCallbackFunction:null};function o(){return"jsonp_"+Date.now()+"_"+Math.ceil(Math.random()*1e5)}function n(h){try{delete window[h]}catch{window[h]=void 0}}function g(h){var l=document.getElementById(h);l&&document.getElementsByTagName("head")[0].removeChild(l)}function I(h){var l=arguments.length<=1||arguments[1]===void 0?{}:arguments[1],S=h,J=l.timeout||r.timeout,k=l.jsonpCallback||r.jsonpCallback,y=void 0;return new Promise(function(M,C){var m=l.jsonpCallbackFunction||o(),f=k+"_"+m;window[m]=function(N){M({ok:!0,json:function(){return Promise.resolve(N)}}),y&&clearTimeout(y),g(f),n(m)},S+=S.indexOf("?")===-1?"?":"&";var p=document.createElement("script");p.setAttribute("src",""+S+k+"="+m),l.charset&&p.setAttribute("charset",l.charset),l.nonce&&p.setAttribute("nonce",l.nonce),l.referrerPolicy&&p.setAttribute("referrerPolicy",l.referrerPolicy),l.crossorigin&&p.setAttribute("crossorigin","true"),p.id=f,document.getElementsByTagName("head")[0].appendChild(p),y=setTimeout(function(){C(new Error("JSONP request to "+h+" timed out")),n(m),g(f),window[m]=function(){n(m)}},J),p.onerror=function(){C(new Error("JSONP request to "+h+" failed")),n(m),g(f),y&&clearTimeout(y)}})}i.exports=I})})(T,T.exports);var at=T.exports;const ot=U(at);var nt=Object.defineProperty,ct=Object.getOwnPropertyDescriptor,lt=(e,t,s,i)=>{for(var r=i>1?void 0:i?ct(t,s):t,o=e.length-1,n;o>=0;o--)(n=e[o])&&(r=(i?n(t,s,r):n(r))||r);return i&&r&&nt(t,s,r),r};const dt=async e=>{let t;if(e)try{t=await(await ot("https://publish.twitter.com/oembed?url="+encodeURIComponent(e))).json()}catch{}return t},ut=async e=>{const{author_name:t="",author_url:s="",html:i=""}=await dt(e)??{};if(t)return{name:t,url:s,id:(s.match(/([^/]+?)$/)??[])[1]??"",address:(i.match(/(0x([a-zA-Z0-9]+)?)/)??[])[1]??""}};class F extends Y{constructor(){super(),this.key="",this.sync=()=>{let t=JSON.parse(j.getItem(this.key)||"{}");new Date().getTime()<1704798753768&&(j.removeItem(this.key),t={}),this.tweets=t},this.save=()=>{this.tweets={...this.tweets},j.setItem(this.key,JSON.stringify(this.tweets),86400*7*1e3)},this.set=(t,s)=>{this.tweets[t]=s,this.save()},this.key="tweets",this.sync()}async get(t){let s=this.tweets[t];return s||(s=await ut(t),s&&this.set(t,s)),s}}lt([z({value:{}})],F.prototype,"tweets",2);const O=new F;var ht=Object.defineProperty,mt=Object.getOwnPropertyDescriptor,c=(e,t,s,i)=>{for(var r=i>1?void 0:i?mt(t,s):t,o=e.length-1,n;o>=0;o--)(n=e[o])&&(r=(i?n(t,s,r):n(r))||r);return i&&r&&ht(t,s,r),r};const _=()=>({tx:""});let a=class extends L(""){constructor(){super(...arguments),this.bindBridge=new D(this,W),this.bindTweets=new D(this,O),this.album="",this.url="",this.name="",this.author="",this.myVotes=0,this.retreatPrice=0,this.retreatDisabled=!0,this.tx=null,this.success=!1,this.pending=!1,this.rewards=!1,this.err=_(),this.ts=0,this.resetState=()=>{this.err=_(),this.pending=!1,this.success=!1,this.price=void 0,this.votes=void 0},this.close=async()=>{this.tx=null,this.resetState(),this.emit("close")},this.updateErr=(e={})=>this.err=Object.assign({},this.err,e)}async connectedCallback(){super.connectedCallback(),await this.getPrice(),await this.readFromTwitter(),this.ts++}get hasVoted(){return this.ts&&+P(this.myVotes,1)>0}async readFromTwitter(){const e=await K(this.author),t=await O.get(e);t&&Object.assign(t,{verified:t.address.includes(this.author)}),this.social=t}async getPrice(){try{this.votes=tt(this.album).then(e=>e[4]),this.myVotes=await et(this.album).then(e=>(e>0&&(this.retreatDisabled=!1),e)),this.price=it(this.album).then(e=>P(e,18)),this.retreatPrice=await st(this.album).then(e=>P(e,18))}catch(e){let t=e.message||e.code;this.updateErr({tx:t})}}async vote(){this.pending=!0;try{this.tx=await H(this.album,1,{value:(await rt(this.album))[0]}),this.success=await this.tx.wait()}catch(e){this.tx||(this.tx={},this.tx.status=0,this.tx.err=e)}}async retreat(){this.pending=!0;try{this.tx=await X(this.album,1),this.success=await this.tx.wait()}catch(e){this.tx||(this.tx={},this.tx.status=0,this.tx.err=e)}}render(){var e,t,s,i;return d`<ui-dialog
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
                ${b((e=this.social)==null?void 0:e.verified,()=>d`<span><i class="text-green-600 text-sm mdi mdi-check-decagram"></i></span>`)}${(t=this.social)==null?void 0:t.name}
              </div>

              <a class="text-sm text-blue-300" href="${(s=this.social)==null?void 0:s.url}" target="_blank">@${(i=this.social)==null?void 0:i.id}</a>

              <div class="text-neutral-400">
                You own
                ${b(this.ts,()=>d`${this.myVotes.length}`,()=>d`<i class="text-sm mdi mdi-loading"></i>`)}
                tickets
              </div>
            </div>
          </div>
          <!-- Tickets -->
          <div class="text-right">
            <span class="text-lg text-sky-500"
              >${x(this.votes,d`<i class="text-sm mdi mdi-loading"></i>`)}</span
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
        <div
          class="mt-8 grid divide-x divide-blue-400/20 ${Q(this.$c([this.hasVoted&&!this.pending?"grid-cols-2":"grid-cols-1"]))}"
        >
          ${b(!this.pending,()=>d`<div class="flex flex-col justify-center items-center px-4">
                  <div>
                    <span class="text-2xl text-"
                      >${x(this.price,d`<i class="text-sm mdi mdi-loading"></i>`)}
                      <span class="text-sm ml-0.5 opacity-70">ST</span></span
                    >
                  </div>
                  <ui-button class="mt-3 w-full" ?disabled=${this.pending} ?pending=${this.pending} @click=${this.vote}
                    >Vote</ui-button
                  >
                </div>
                ${b(this.ts&&this.hasVoted,()=>d`
                    <div class="flex flex-col justify-center items-center px-4 border-white/12">
                      <div class="text-2xl">
                        ${x(this.retreatPrice,d`<i class="text-sm mdi mdi-loading"></i>`)}
                        <span class="text-sm ml-0.5 opacity-70">ST</span>
                      </div>

                      <ui-button
                        class="mt-3 w-full outlined"
                        ?disabled=${this.retreatDisabled}
                        ?pending=${this.retreatDisabled}
                        @click=${this.retreat}
                        >Retreat</ui-button
                      >
                    </div>
                  `)}
                <!-- <div class="text-sm text-gray-500">
                Retreat price: ${x(this.retreatPrice,d`<i class="text-sm mdi mdi-loading"></i>`)} FTM
              </div> --> `,()=>d`<tx-state .tx=${this.tx} .opts=${{state:{success:"Success. Your vote has been submitted."}}}
                ><ui-button slot="view" @click=${this.close}>Close</ui-button></tx-state
              >`)}
        </div>
      </div>
    </ui-dialog>`}};c([v({type:String})],a.prototype,"album",2);c([v({type:String})],a.prototype,"url",2);c([v({type:String})],a.prototype,"name",2);c([v({type:String})],a.prototype,"author",2);c([v({type:Promise})],a.prototype,"votes",2);c([u()],a.prototype,"myVotes",2);c([u()],a.prototype,"price",2);c([u()],a.prototype,"retreatPrice",2);c([u()],a.prototype,"retreatDisabled",2);c([u()],a.prototype,"social",2);c([u()],a.prototype,"tx",2);c([u()],a.prototype,"success",2);c([u()],a.prototype,"pending",2);c([u()],a.prototype,"rewards",2);c([u()],a.prototype,"err",2);c([u()],a.prototype,"ts",2);a=c([Z("vote-album-dialog")],a);export{ft as a,tt as b,et as m,O as t,vt as w};
