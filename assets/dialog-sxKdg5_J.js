import{e as $,t as I,n as O,u as M,a as B,g as A,f as q,h as j,T as U,b as L}from"./index-jemeh5bG.js";import{G as W,H as G,S as Y,p as z,a as V,y as P,x as d,n as b,E as x,g as H,h as u,d as f,c as Q}from"./vendor-YHmzau40.js";import"./claim-ChKL69z4.js";const w=async(e=!1)=>q("MediaBoard",{account:e?void 0:await B()}),Z=async(e,t,s)=>{const i=await w(),r="vote",c={},n=[e,t,s];await $(c,i,r,n);const y=i[r](...n);return new I(y,{errorCodes:"MediaBoard",allowAlmostSuccess:!0,seq:{type:"VoteSubject",title:"Vote Subject",ts:O(),overrides:c}})},K=async e=>{try{const t=await w(!0),s="getSocials",i=[e];return(await t[s](...i))[0][2]}catch(t){console.log(t)}},X=async(e,t)=>{const s=await w(),i="retreat",r={},c=[e,t];await $(r,s,i,c);const n=s[i](...c);return new I(n,{errorCodes:"MediaBoard",allowAlmostSuccess:!0,seq:{type:"RetreatSubject",title:"Retreat Subject",ts:O(),overrides:r}})},tt=async e=>{const t=await w(!0),s="subjectToData",i={},r=[e];return await $(i,t,s,r),await t[s](...r)},et=async e=>M(e,await B()),st=async e=>{try{const t=await w(!0),s="getRetreatPrice",i=[e,1];return await t[s](...i)}catch{return 0}},it=async e=>{const t=await w(!0),s="getVotePrice",i=[e,1];return await t[s](...i)},rt=async e=>{const t=await w(!0),s="getVotePriceWithFee",i={},r=[e,1];return await $(i,t,s,r),await t[s](...r)},ft=async(e,t)=>{const s=24n*60n*60n;let i=BigInt(new Date().getTime())/1000n-s,r=`{
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
    }`;return await A("MediaBoard",r)},vt=async e=>{const t=24n*60n*60n;let s=BigInt(new Date().getTime())/1000n-t,i=`{
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
    }`;return await A("MediaBoard",i)};var T={exports:{}};(function(e,t){(function(s,i){i(t,e)})(W,function(s,i){var r={timeout:5e3,jsonpCallback:"callback",jsonpCallbackFunction:null};function c(){return"jsonp_"+Date.now()+"_"+Math.ceil(Math.random()*1e5)}function n(h){try{delete window[h]}catch{window[h]=void 0}}function y(h){var l=document.getElementById(h);l&&document.getElementsByTagName("head")[0].removeChild(l)}function F(h){var l=arguments.length<=1||arguments[1]===void 0?{}:arguments[1],S=h,N=l.timeout||r.timeout,_=l.jsonpCallback||r.jsonpCallback,g=void 0;return new Promise(function(R,D){var p=l.jsonpCallbackFunction||c(),v=_+"_"+p;window[p]=function(J){R({ok:!0,json:function(){return Promise.resolve(J)}}),g&&clearTimeout(g),y(v),n(p)},S+=S.indexOf("?")===-1?"?":"&";var m=document.createElement("script");m.setAttribute("src",""+S+_+"="+p),l.charset&&m.setAttribute("charset",l.charset),l.nonce&&m.setAttribute("nonce",l.nonce),l.referrerPolicy&&m.setAttribute("referrerPolicy",l.referrerPolicy),l.crossorigin&&m.setAttribute("crossorigin","true"),m.id=v,document.getElementsByTagName("head")[0].appendChild(m),g=setTimeout(function(){D(new Error("JSONP request to "+h+" timed out")),n(p),y(v),window[p]=function(){n(p)}},N),m.onerror=function(){D(new Error("JSONP request to "+h+" failed")),n(p),y(v),g&&clearTimeout(g)}})}i.exports=F})})(T,T.exports);var at=T.exports;const ot=G(at);var ct=Object.defineProperty,nt=Object.getOwnPropertyDescriptor,lt=(e,t,s,i)=>{for(var r=i>1?void 0:i?nt(t,s):t,c=e.length-1,n;c>=0;c--)(n=e[c])&&(r=(i?n(t,s,r):n(r))||r);return i&&r&&ct(t,s,r),r};const ut=async e=>{let t;if(e)try{t=await(await ot("https://publish.twitter.com/oembed?url="+encodeURIComponent(e))).json()}catch{}return t},dt=async e=>{const{author_name:t="",author_url:s="",html:i=""}=await ut(e)??{};if(t)return{name:t,url:s,id:s.substring(s.lastIndexOf("/")+1,s.length-1),address:(i.match(/(0x([a-zA-Z0-9]+)?)/)??[])[1]??""}};class E extends Y{constructor(){super(),this.key="",this.sync=()=>{let t=JSON.parse(j.getItem(this.key)||"{}");Array.isArray(t)&&(j.removeItem(this.key),t={}),this.tweets=t},this.save=()=>{this.tweets={...this.tweets},j.setItem(this.key,JSON.stringify(this.tweets),86400*7*1e3)},this.set=(t,s)=>{this.tweets[t]=s,this.save()},this.key="tweets",this.sync()}async get(t){let s=this.tweets[t];return s||(s=await dt(t),s&&this.set(t,s)),s}}lt([z({value:{}})],E.prototype,"tweets",2);const k=new E;var ht=Object.defineProperty,pt=Object.getOwnPropertyDescriptor,o=(e,t,s,i)=>{for(var r=i>1?void 0:i?pt(t,s):t,c=e.length-1,n;c>=0;c--)(n=e[c])&&(r=(i?n(t,s,r):n(r))||r);return i&&r&&ht(t,s,r),r};const C=()=>({tx:""});let a=class extends U(""){constructor(){super(...arguments),this.bindBridge=new V(this,L),this.bindTweets=new V(this,k),this.album="",this.url="",this.name="",this.author="",this.myVotes=0,this.retreatPrice=0,this.retreatDisabled=!0,this.socialName="",this.socialURI="",this.socialID="",this.socialVerified=!1,this.tx=null,this.success=!1,this.pending=!1,this.rewards=!1,this.err=C(),this.ts=0,this.resetState=()=>{this.err=C(),this.pending=!1,this.success=!1,this.price=void 0,this.votes=void 0},this.close=async()=>{this.tx=null,this.resetState(),this.emit("close")},this.updateErr=(e={})=>this.err=Object.assign({},this.err,e)}async connectedCallback(){super.connectedCallback(),await this.getPrice(),await this.readFromTwitter(),this.ts++}get hasVoted(){return this.ts&&+P(this.myVotes,1)>0}async readFromTwitter(){const e=await K(this.author),t=await k.get(e);this.socialName=t.author_name,this.socialURI=t.author_url,this.socialID=t.author_url.substring(t.author_url.lastIndexOf("/")+1,t.author_url.length-1),this.socialVerified=t.html.includes(this.author),this.socialVerified=!0}async getPrice(){try{this.votes=tt(this.album).then(e=>e[4]),this.myVotes=await et(this.album).then(e=>(e>0&&(this.retreatDisabled=!1),e)),this.price=it(this.album).then(e=>P(e,18)),this.retreatPrice=await st(this.album).then(e=>P(e,18))}catch(e){let t=e.message||e.code;this.updateErr({tx:t})}}async vote(){this.pending=!0;try{this.tx=await Z(this.album,1,{value:(await rt(this.album))[0]}),this.success=await this.tx.wait()}catch(e){this.tx||(this.tx={},this.tx.status=0,this.tx.err=e)}}async retreat(){this.pending=!0;try{this.tx=await X(this.album,1),this.success=await this.tx.wait()}catch(e){this.tx||(this.tx={},this.tx.status=0,this.tx.err=e)}}render(){return d`<ui-dialog
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
                ${b(this.socialVerified,()=>d`<span><i class="text-green-600 text-sm mdi mdi-check-decagram"></i></span>`)}${this.socialName}
              </div>

              <a class="text-sm text-blue-300" href="${this.socialURI}" target="_blank">@${this.socialID}</a>

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
          class="mt-8 grid divide-x divide-blue-400/20 ${H(this.$c([this.hasVoted&&!this.pending?"grid-cols-2":"grid-cols-1"]))}"
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
    </ui-dialog>`}};o([f({type:String})],a.prototype,"album",2);o([f({type:String})],a.prototype,"url",2);o([f({type:String})],a.prototype,"name",2);o([f({type:String})],a.prototype,"author",2);o([f({type:Promise})],a.prototype,"votes",2);o([u()],a.prototype,"myVotes",2);o([u()],a.prototype,"price",2);o([u()],a.prototype,"retreatPrice",2);o([u()],a.prototype,"retreatDisabled",2);o([u()],a.prototype,"socialName",2);o([u()],a.prototype,"socialURI",2);o([u()],a.prototype,"socialID",2);o([u()],a.prototype,"socialVerified",2);o([u()],a.prototype,"tx",2);o([u()],a.prototype,"success",2);o([u()],a.prototype,"pending",2);o([u()],a.prototype,"rewards",2);o([u()],a.prototype,"err",2);o([u()],a.prototype,"ts",2);a=o([Q("vote-album-dialog")],a);export{vt as a,tt as b,et as m,k as t,ft as w};
