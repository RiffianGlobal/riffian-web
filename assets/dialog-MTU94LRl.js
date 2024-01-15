import{a as S,t as C,n as O,b as I,g as J,c as M,T as q}from"./index-WJ1Akgri.js";import{u as L,g as B}from"./claim-gNvHXJZs.js";import{E as U,G as W,S as G,p as Y,a as T,y as j,x as d,n as b,D as x,g as Q,h as u,d as f,c as z}from"./vendor-ecaUxFoO.js";var D={exports:{}};(function(t,e){(function(i,r){r(e,t)})(U,function(i,r){var s={timeout:5e3,jsonpCallback:"callback",jsonpCallbackFunction:null};function c(){return"jsonp_"+Date.now()+"_"+Math.ceil(Math.random()*1e5)}function n(h){try{delete window[h]}catch{window[h]=void 0}}function y(h){var l=document.getElementById(h);l&&document.getElementsByTagName("head")[0].removeChild(l)}function F(h){var l=arguments.length<=1||arguments[1]===void 0?{}:arguments[1],$=h,N=l.timeout||s.timeout,_=l.jsonpCallback||s.jsonpCallback,g=void 0;return new Promise(function(R,k){var p=l.jsonpCallbackFunction||c(),v=_+"_"+p;window[p]=function(A){R({ok:!0,json:function(){return Promise.resolve(A)}}),g&&clearTimeout(g),y(v),n(p)},$+=$.indexOf("?")===-1?"?":"&";var m=document.createElement("script");m.setAttribute("src",""+$+_+"="+p),l.charset&&m.setAttribute("charset",l.charset),l.nonce&&m.setAttribute("nonce",l.nonce),l.referrerPolicy&&m.setAttribute("referrerPolicy",l.referrerPolicy),l.crossorigin&&m.setAttribute("crossorigin","true"),m.id=v,document.getElementsByTagName("head")[0].appendChild(m),g=setTimeout(function(){k(new Error("JSONP request to "+h+" timed out")),n(p),y(v),window[p]=function(){n(p)}},N),m.onerror=function(){k(new Error("JSONP request to "+h+" failed")),n(p),y(v),g&&clearTimeout(g)}})}r.exports=F})})(D,D.exports);var H=D.exports;const K=W(H),w=async(t=!1)=>J("MediaBoard",{account:t?void 0:await M()}),X=async(t,e,i)=>{const r=await w(),s="vote",c={},n=[t,e,i];await S(c,r,s,n);const y=r[s](...n);return new C(y,{errorCodes:"MediaBoard",allowAlmostSuccess:!0,seq:{type:"VoteSubject",title:"Vote Subject",ts:O(),overrides:c}})},Z=async t=>{try{return t="https://twitter.com/archdeaconsal/status/1732505736616563171",(await K("https://publish.twitter.com/oembed?url="+encodeURIComponent(t))).json()}catch(e){console.log(e)}},tt=async t=>{try{const e=await w(!0),i="getSocials",r=[t];return(await e[i](...r))[0][2]}catch(e){console.log(e)}},et=async(t,e)=>{const i=await w(),r="retreat",s={},c=[t,e];await S(s,i,r,c);const n=i[r](...c);return new C(n,{errorCodes:"MediaBoard",allowAlmostSuccess:!0,seq:{type:"RetreatSubject",title:"Retreat Subject",ts:O(),overrides:s}})},st=async t=>{const e=await w(!0),i="subjectToData",r={},s=[t];return await S(r,e,i,s),await e[i](...s)},it=async t=>L(t,I.bridge.account),rt=async t=>{try{const e=await w(!0),i="getRetreatPrice",r=[t,1];return await e[i](...r)}catch{return 0}},at=async t=>{const e=await w(!0),i="getVotePrice",r=[t,1];return await e[i](...r)},ot=async t=>{const e=await w(!0),i="getVotePriceWithFee",r={},s=[t,1];return await S(r,e,i,s),await e[i](...s)},yt=async(t,e)=>{const i=24n*60n*60n;let r=BigInt(new Date().getTime())/1000n-i,s=`{
      subjectWeeklyVotes(first: ${t}, where:{week:${e}}, orderBy: volumeTotal, orderDirection:desc) {
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
          voteLogs(first:1, where:{time_lt:${r}} orderBy:time, orderDirection:desc){
            supply
          }
        }
      }
    }`;return await B("MediaBoard",s)},gt=async t=>{const e=24n*60n*60n;let i=BigInt(new Date().getTime())/1000n-e,r=`{
      subjects(first: ${t}, orderBy:supply, orderDirection:desc, where: {creator_starts_with: "0x"}) {
        id
        image
        name
        uri
        supply
        creator {
          address
        }
        voteLogs(first:1, where:{time_lt:${i}} orderBy:time, orderDirection:desc){
          supply
        }
      }
    }`;return await B("MediaBoard",r)};var ct=Object.defineProperty,nt=Object.getOwnPropertyDescriptor,lt=(t,e,i,r)=>{for(var s=r>1?void 0:r?nt(e,i):e,c=t.length-1,n;c>=0;c--)(n=t[c])&&(s=(r?n(e,i,s):n(s))||s);return r&&s&&ct(e,i,s),s};class E extends G{constructor(){super(),this.key="",this.key="tweets",this.sync()}sync(){this.tweets=JSON.parse(localStorage.getItem(this.key)||"[]")}save(){this.tweets=[...this.tweets],localStorage.setItem(this.key,JSON.stringify(this.tweets))}}lt([Y({value:[]})],E.prototype,"tweets",2);const P=new E;var ut=Object.defineProperty,dt=Object.getOwnPropertyDescriptor,o=(t,e,i,r)=>{for(var s=r>1?void 0:r?dt(e,i):e,c=t.length-1,n;c>=0;c--)(n=t[c])&&(s=(r?n(e,i,s):n(s))||s);return r&&s&&ut(e,i,s),s};const V=()=>({tx:""});let a=class extends q(""){constructor(){super(...arguments),this.bindBridge=new T(this,I),this.bindTweets=new T(this,P),this.album="",this.url="",this.name="",this.author="",this.myVotes=0,this.retreatPrice=0,this.retreatDisabled=!0,this.socialName="",this.socialURI="",this.socialID="",this.socialVerified=!1,this.tx=null,this.success=!1,this.pending=!1,this.rewards=!1,this.err=V(),this.ts=0,this.resetState=()=>{this.err=V(),this.pending=!1,this.success=!1,this.price=void 0,this.votes=void 0},this.close=async()=>{this.tx=null,this.resetState(),this.emit("close")},this.updateErr=(t={})=>this.err=Object.assign({},this.err,t)}async connectedCallback(){super.connectedCallback(),await this.getPrice(),await this.readFromTwitter(),this.ts++}get tweets(){return P.tweets}get hasVoted(){return this.ts&&j(this.myVotes,1)>0}readFromLocal(t){let e={key:"",author_name:"",author_url:"",html:""};return this.tweets.some(i=>{i.key==t&&(e=i)}),e}async readFromTwitter(){let t=await tt(this.author),e=this.readFromLocal(t);e.key.length==0&&(e=await Z(this.author),e.key=t,this.tweets.unshift(e),P.save()),this.socialName=e.author_name,this.socialURI=e.author_url,this.socialID=e.author_url.substring(e.author_url.lastIndexOf("/")+1,e.author_url.length-1),this.socialVerified=e.html.includes(this.author),this.socialVerified=!0}async getPrice(){try{this.votes=st(this.album).then(t=>t[4]),this.myVotes=await it(this.album).then(t=>(t>0&&(this.retreatDisabled=!1),t)),this.price=at(this.album).then(t=>j(t,18)),this.retreatPrice=await rt(this.album).then(t=>j(t,18))}catch(t){let e=t.message||t.code;this.updateErr({tx:e})}}async vote(){this.pending=!0;try{this.tx=await X(this.album,1,{value:(await ot(this.album))[0]}),this.success=await this.tx.wait()}catch(t){this.tx||(this.tx={},this.tx.status=0,this.tx.err=t)}}async retreat(){this.pending=!0;try{this.tx=await et(this.album,1),this.success=await this.tx.wait()}catch(t){this.tx||(this.tx={},this.tx.status=0,this.tx.err=t)}}render(){return d`<ui-dialog
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
    </ui-dialog>`}};o([f({type:String})],a.prototype,"album",2);o([f({type:String})],a.prototype,"url",2);o([f({type:String})],a.prototype,"name",2);o([f({type:String})],a.prototype,"author",2);o([f({type:Promise})],a.prototype,"votes",2);o([u()],a.prototype,"myVotes",2);o([u()],a.prototype,"price",2);o([u()],a.prototype,"retreatPrice",2);o([u()],a.prototype,"retreatDisabled",2);o([u()],a.prototype,"socialName",2);o([u()],a.prototype,"socialURI",2);o([u()],a.prototype,"socialID",2);o([u()],a.prototype,"socialVerified",2);o([u()],a.prototype,"tx",2);o([u()],a.prototype,"success",2);o([u()],a.prototype,"pending",2);o([u()],a.prototype,"rewards",2);o([u()],a.prototype,"err",2);o([u()],a.prototype,"ts",2);a=o([z("vote-album-dialog")],a);export{gt as a,st as b,it as m,Z as r,P as t,yt as w};
