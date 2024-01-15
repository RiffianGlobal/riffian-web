import{T as y,b as f}from"./index-WJ1Akgri.js";import{t as g,r as k}from"./dialog-MTU94LRl.js";import{g as b}from"./claim-gNvHXJZs.js";import{a as v,x as d,n as u,q as _,e as D,h as a,d as m,c as w}from"./vendor-ecaUxFoO.js";const O=async e=>{let t=`{
      user(id: "`+e+`") {
        address
        holding
        id
        rewardClaimed
        socials {
          id
          pid
          platform
          uri
        }
        subjectsCreated {
          address
          createdAt
          fansNumber
          id
          image
          lastVoteAt
          name
          supply
          totalVoteValue
          uri
          volumeRetreat
          volumeTotal
          volumeVote
        }
      }
    }`;return await b("MediaBoard",t)},C=async e=>{let t=`{
      user(id: "`+e+`") {
        address
        holding
        id
        rewardClaimed
        socials {
          id
          pid
          platform
          uri
        }
      }
    }`;return await b("MediaBoard",t)},I="li.header{margin-bottom:.75rem;font-size:.875rem;line-height:1.25rem;--tw-text-opacity: 1;color:#a3a3a3;color:rgba(163,163,163,var(--tw-text-opacity))}li.item:hover{background-color:#ffffff0d}@media (min-width: 500px){.name{font-size:1rem;line-height:1.5rem}}.icon{font-size:1.5rem;line-height:2rem}@media (max-width: 500px){.icon{font-size:1.5rem;line-height:2rem}}";var M=Object.defineProperty,P=Object.getOwnPropertyDescriptor,h=(e,t,s,o)=>{for(var i=o>1?void 0:o?P(t,s):t,n=e.length-1,c;n>=0;n--)(c=e[n])&&(i=(o?c(t,s,i):c(i))||i);return o&&i&&M(t,s,i),i};let p=class extends y(I){constructor(){super(...arguments),this.bindBridge=new v(this,f),this.weekly=!1,this.address="",this.userData={},this.trackList=[],this.pending=!1,this.prompt=!1,this.promptMessage="",this.init=async()=>{var e;this.pending=!0;try{let t=await O(this.address);this.trackList=(e=t.user)==null?void 0:e.subjectsCreated,this.userData=t.user}catch(t){console.error(t),this.promptMessage=t,this.prompt=!0;return}this.pending=!1},this.close=()=>{this.init()}}get disabled(){return!f.bridge.account}connectedCallback(){super.connectedCallback(),this.init()}getRandomInt(e){return Math.floor(Math.random()*e)}render(){return d`<div class="py-6">${u(this.pending&&!this.userData,()=>d`<div name="Loading" class="doc-intro"><div class="flex flex-col gap-8 m-8"><loading-skeleton num="3"></loading-skeleton><loading-skeleton num="3"></loading-skeleton><loading-skeleton num="3"></loading-skeleton></div></div>`)} ${u(this.userData,()=>d`<ul role="list"><li class="flex header p-1 pr-2"><div class="w-16">Index</div><div class="flex-auto">Name</div><div class="flex-none w-40">Created</div><div class="flex-none w-24 text-right">Tickets</div><div class="flex-none w-24 text-right">Voters</div>${u(this.pending,()=>d`<div><i class="text-sm mdi mdi-loading"></i><div></div></div>`)}</li>${_(this.trackList,(e,t)=>d`<li class="item flex py-2 pr-2 items-center cursor-pointer" @click="${()=>{this.disabled?D.emit("connect-wallet"):location.href="/track/"+e.address}}"><div class="flex-none w-16 pl-4 text-sm font-light opacity-75">${t+1}</div><div class="flex-auto flex"><div class="w-[3.75rem] h-[3.75rem] mr-4 rounded-lg"><img-loader sizes="60px, 60px" src="${e.image}" class="rounded-lg"></img-loader></div><div><p class="name truncate mt-2">${e.name}</p><span class="icon mt-1"><i class="mdi mdi-play-circle-outline"></i></span></div></div><div class="flex-none w-40 text-sm font-light text-neutral-400">${new Date(e.createdAt*1e3).toLocaleString()}</div><div class="flex-none w-24 text-right text-base font-light"><p class="name truncate mt-2">${e.fansNumber}</p></div><div class="flex-none w-24 text-right text-base font-light"><p class="name truncate mt-2">${e.supply}</p></div></li>`)}</ul>`)}</div>${u(this.prompt,()=>d`<p class="text-center text-orange-600">${this.promptMessage}</p>`)}`}};h([m({type:Boolean})],p.prototype,"weekly",2);h([m({type:String})],p.prototype,"address",2);h([a()],p.prototype,"userData",2);h([a()],p.prototype,"trackList",2);h([a()],p.prototype,"pending",2);h([a()],p.prototype,"prompt",2);h([a()],p.prototype,"promptMessage",2);p=h([w("track-list")],p);const T='.middle-dot-divider:after{content:"·";padding:0 .375rem;font-weight:600}';var V=Object.defineProperty,L=Object.getOwnPropertyDescriptor,l=(e,t,s,o)=>{for(var i=o>1?void 0:o?L(t,s):t,n=e.length-1,c;n>=0;n--)(c=e[n])&&(i=(o?c(t,s,i):c(i))||i);return o&&i&&V(t,s,i),i};const N=()=>({loading:"",tx:""});let r=class extends y(T){constructor(){super(...arguments),this.bindBridge=new v(this,f),this.bindTweets=new v(this,g),this.weekly=!1,this.address="",this.retreatDisabled=!0,this.socialName="",this.socialURI="",this.socialID="",this.socialVerified=!1,this.voteList=[],this.pending=!1,this.prompt=!1,this.dialog=!1,this.promptMessage="",this.err=N(),this.ts=0,this.updateErr=(e={})=>this.err=Object.assign({},this.err,e),this.init=async()=>{this.pending=!0;try{let e=await C(this.address);this.user=e.user,this.readFromTwitter()}catch(e){this.updateErr({load:e.message||e}),this.promptMessage=e,this.prompt=!0;return}finally{this.ts++,this.pending=!1}},this.close=()=>{this.dialog=!1,this.init()}}get disabled(){return!f.bridge.account}connectedCallback(){super.connectedCallback(),this.init()}getRandomInt(e){return Math.floor(Math.random()*e)}get tweets(){return g.tweets}readFromLocal(e){let t={key:"",author_name:"",author_url:"",html:""};return this.tweets.some(s=>{s.key==e&&(t=s)}),t}async readFromTwitter(){var e;if(this.user&&this.user.socials){let t=(e=this.user.socials[0])==null?void 0:e.uri,s=this.readFromLocal(t);(!s.key||s.key.length==0)&&(s=await k(t),s.key=t,this.tweets.unshift(s),g.save()),this.socialName=s.author_name,this.socialURI=s.author_url,this.socialID=s.author_url.substring(s.author_url.lastIndexOf("/")+1,s.author_url.length-1),this.socialVerified=s.html.includes(this.user.address),this.socialVerified=!0}else this.socialName="Unknown",this.socialURI="",this.socialID="NotBind",this.socialVerified=!1}render(){return d`<div class="m-4 text-center">${u(!this.ts&&!this.err.load,()=>d`<div name="Loading" class="doc-intro"><div class="flex flex-col gap-8 m-8"><loading-skeleton num="3"></loading-skeleton></div></div>`,()=>d`${u(this.prompt,()=>d`<p class="text-center text-orange-600">${this.promptMessage}</p>`,()=>d`<div class="py-4"><ui-address class="text-lg" .address="${this.user.address}" short avatar></ui-address><div class="mt-4"><span class="text-base font-light middle-dot-divider">${u(this.socialVerified,()=>d`${this.socialName}<span class="ml-0.5"><i class="text-green-600 text-sm mdi mdi-check-decagram"></i></span>`)} </span><span class="text-base font-light"><a href="${this.socialURI}" class="text-blue-300" target="_blank">@${this.socialID}</a></span></div><div class="mt-0.5"><span class="text-base text-white/70 middle-dot-divider">Holding <span class="ml-1 text-blue-300">${this.user.holding??"-"}</span></span> <span class="text-base text-white/70">Reward Claimed <span class="ml-1 text-blue-300">${this.user.rewardClaimed??"-"}</span></span></div></div>`)}`)}</div>`}};l([m({type:Boolean})],r.prototype,"weekly",2);l([m({type:String})],r.prototype,"address",2);l([m({type:Promise})],r.prototype,"votes",2);l([a()],r.prototype,"myVotes",2);l([a()],r.prototype,"retreatDisabled",2);l([a()],r.prototype,"socialName",2);l([a()],r.prototype,"socialURI",2);l([a()],r.prototype,"socialID",2);l([a()],r.prototype,"socialVerified",2);l([a()],r.prototype,"user",2);l([a()],r.prototype,"voteList",2);l([a()],r.prototype,"pending",2);l([a()],r.prototype,"prompt",2);l([a()],r.prototype,"dialog",2);l([a()],r.prototype,"promptMessage",2);l([a()],r.prototype,"err",2);l([a()],r.prototype,"ts",2);r=l([w("user-detail")],r);const j="";var R=Object.defineProperty,S=Object.getOwnPropertyDescriptor,$=(e,t,s,o)=>{for(var i=o>1?void 0:o?S(t,s):t,n=e.length-1,c;n>=0;n--)(c=e[n])&&(i=(o?c(t,s,i):c(i))||i);return o&&i&&R(t,s,i),i};let x=class extends y(j){constructor(){super(...arguments),this.addr=""}render(){return d`<div class="md_max-w-7xl mx-auto flex flex-col place-content-center pt-10">
      <!-- user profile -->
      <user-detail .address=${this.addr}></user-detail>

      <div class="w-full inline-flex pb-6 border-b border-slate-50/10">
        <div class="py-1.5 px-3 text-base font-normal bg-sky-300/10  text-white/70 rounded-md">Tracks</div>
      </div>

      <track-list .address=${this.addr}></track-list>

      <!-- <div class="h-20 pt-1 mb-8">
        <div class="font-bold text-xl">
          <user-detail .address=${this.addr}> </user-detail>
        </div>
      </div>
      <div class="h-10 pt-1 mt-20">
        <div class="font-bold text-xl">Tracks</div>
      </div>
      <div class="mt-0">
        <track-list .address=${this.addr}></track-list>
      </div> -->
    </div>`}};$([m({type:String})],x.prototype,"addr",2);x=$([w("user-page")],x);export{x as TrackPage};
