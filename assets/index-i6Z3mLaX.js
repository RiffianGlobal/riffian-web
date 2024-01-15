import{g as w,T as x,b as g}from"./index-JcPYXhTY.js";import{a as v,e as k,Y as _,x as o,n as m,q as O,h as l,d as u,c as y}from"./vendor-CPcScFQN.js";import{t as b}from"./dialog-zl0PJV6u.js";import"./icon-Y8iBY1aw.js";const C=async e=>{let t=`{
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
    }`;return await w("MediaBoard",t)},D=async e=>{let t=`{
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
    }`;return await w("MediaBoard",t)},M="li.header{margin-bottom:.75rem;font-size:.875rem;line-height:1.25rem;--tw-text-opacity: 1;color:#a3a3a3;color:rgba(163,163,163,var(--tw-text-opacity))}li.item:hover{background-color:#ffffff0d}@media (min-width: 500px){.name{font-size:1rem;line-height:1.5rem}}.icon{font-size:1.5rem;line-height:2rem}@media (max-width: 500px){.icon{font-size:1.5rem;line-height:2rem}}";var P=Object.defineProperty,T=Object.getOwnPropertyDescriptor,h=(e,t,r,i)=>{for(var s=i>1?void 0:i?T(t,r):t,n=e.length-1,p;n>=0;n--)(p=e[n])&&(s=(i?p(t,r,s):p(s))||s);return i&&s&&P(t,r,s),s};let c=class extends x(M){constructor(){super(...arguments),this.bindBridge=new v(this,g),this.weekly=!1,this.address="",this.userData={},this.trackList=[],this.pending=!1,this.prompt=!1,this.promptMessage="",this.init=async()=>{var e;this.pending=!0;try{let t=await C(this.address);this.trackList=(e=t.user)==null?void 0:e.subjectsCreated,this.userData=t.user}catch(t){console.error(t),this.promptMessage=t,this.prompt=!0;return}this.pending=!1},this.close=()=>{this.init()},this.go2=e=>{this.disabled?k.emit("connect-wallet"):_(`/track/${e.address}`)}}get disabled(){return!g.bridge.account}connectedCallback(){super.connectedCallback(),this.init()}getRandomInt(e){return Math.floor(Math.random()*e)}render(){return o`<div class="py-6">${m(this.pending&&!this.userData,()=>o`<div name="Loading" class="doc-intro"><div class="flex flex-col gap-8 m-8"><loading-skeleton num="3"></loading-skeleton><loading-skeleton num="3"></loading-skeleton><loading-skeleton num="3"></loading-skeleton></div></div>`)} ${m(this.userData,()=>o`<ul role="list"><li class="flex header p-1 pr-2"><div class="w-16">Index</div><div class="flex-auto">Name</div><div class="flex-none w-40">Created</div><div class="flex-none w-24 text-right">Tickets</div><div class="flex-none w-24 text-right">Voters</div>${m(this.pending,()=>o`<div><i class="text-sm mdi mdi-loading"></i><div></div></div>`)}</li>${O(this.trackList,(e,t)=>o`<li class="item flex py-2 pr-2 items-center cursor-pointer" @click="${()=>this.go2(e)}"><div class="flex-none w-16 pl-4 text-sm font-light opacity-75">${t+1}</div><div class="flex-auto flex"><div class="w-[3.75rem] h-[3.75rem] mr-4 rounded-lg"><img-loader sizes="60px, 60px" src="${e.image}" class="rounded-lg"></img-loader></div><div><p class="name truncate mt-2">${e.name}</p><span class="icon mt-1"><i class="mdi mdi-play-circle-outline"></i></span></div></div><div class="flex-none w-40 text-sm font-light text-neutral-400">${new Date(e.createdAt*1e3).toLocaleString()}</div><div class="flex-none w-24 text-right text-base font-light"><p class="name truncate mt-2">${e.fansNumber}</p></div><div class="flex-none w-24 text-right text-base font-light"><p class="name truncate mt-2">${e.supply}</p></div></li>`)}</ul>`)}</div>${m(this.prompt,()=>o`<p class="text-center text-orange-600">${this.promptMessage}</p>`)}`}};h([u({type:Boolean})],c.prototype,"weekly",2);h([u({type:String})],c.prototype,"address",2);h([l()],c.prototype,"userData",2);h([l()],c.prototype,"trackList",2);h([l()],c.prototype,"pending",2);h([l()],c.prototype,"prompt",2);h([l()],c.prototype,"promptMessage",2);c=h([y("track-list")],c);const j='.middle-dot-divider:after{content:"·";padding:0 .375rem;font-weight:600}';var L=Object.defineProperty,S=Object.getOwnPropertyDescriptor,d=(e,t,r,i)=>{for(var s=i>1?void 0:i?S(t,r):t,n=e.length-1,p;n>=0;n--)(p=e[n])&&(s=(i?p(t,r,s):p(s))||s);return i&&s&&L(t,r,s),s};const B=()=>({loading:"",tx:""});let a=class extends x(j){constructor(){super(...arguments),this.bindBridge=new v(this,g),this.bindTweets=new v(this,b),this.weekly=!1,this.address="",this.retreatDisabled=!0,this.voteList=[],this.pending=!1,this.prompt=!1,this.dialog=!1,this.promptMessage="",this.err=B(),this.ts=0,this.updateErr=(e={})=>this.err=Object.assign({},this.err,e),this.init=async()=>{this.pending=!0;try{let e=await D(this.address);this.user=e.user,this.readFromTwitter()}catch(e){this.updateErr({load:e.message||e}),this.promptMessage=e,this.prompt=!0;return}finally{this.ts++,this.pending=!1}},this.close=()=>{this.dialog=!1,this.init()}}get disabled(){return!g.bridge.account}connectedCallback(){super.connectedCallback(),this.init()}getRandomInt(e){return Math.floor(Math.random()*e)}async readFromTwitter(){let{uri:e}=this.user.socials[0]??{};const t=await b.get(e);t&&Object.assign(t,{verified:this.user.address}),this.social=t}render(){return o`<div class="m-4 text-center">${m(!this.ts&&!this.err.loading,()=>o`<div name="Loading" class="doc-intro"><div class="flex flex-col gap-8 m-8"><loading-skeleton num="3"></loading-skeleton></div></div>`,()=>o`${m(this.prompt,()=>o`<p class="text-center text-orange-600">${this.promptMessage}</p>`,()=>{var e,t,r;return o`<div class="py-4"><ui-address class="text-lg" .address="${this.user.address}" short avatar></ui-address><div class="mt-4"><span class="text-base font-light middle-dot-divider">${m((e=this.social)==null?void 0:e.verified,()=>{var i;return o`${(i=this.social)==null?void 0:i.name}<span class="ml-0.5"><i class="text-green-600 text-sm mdi mdi-check-decagram"></i></span>`})} </span><span class="text-base font-light"><a href="${(t=this.social)==null?void 0:t.url}" class="text-blue-300" target="_blank">@${(r=this.social)==null?void 0:r.id}</a></span></div><div class="mt-0.5"><span class="text-base text-white/70 middle-dot-divider">Holding <span class="ml-1 text-blue-300">${this.user.holding??"-"}</span></span> <span class="text-base text-white/70">Reward Claimed <span class="ml-1 text-blue-300">${this.user.rewardClaimed??"-"}</span></span></div></div>`})}`)}</div>`}};d([u({type:Boolean})],a.prototype,"weekly",2);d([u({type:String})],a.prototype,"address",2);d([u({type:Promise})],a.prototype,"votes",2);d([l()],a.prototype,"myVotes",2);d([l()],a.prototype,"retreatDisabled",2);d([l()],a.prototype,"social",2);d([l()],a.prototype,"user",2);d([l()],a.prototype,"voteList",2);d([l()],a.prototype,"pending",2);d([l()],a.prototype,"prompt",2);d([l()],a.prototype,"dialog",2);d([l()],a.prototype,"promptMessage",2);d([l()],a.prototype,"err",2);d([l()],a.prototype,"ts",2);a=d([y("user-detail")],a);const V="";var z=Object.defineProperty,N=Object.getOwnPropertyDescriptor,$=(e,t,r,i)=>{for(var s=i>1?void 0:i?N(t,r):t,n=e.length-1,p;n>=0;n--)(p=e[n])&&(s=(i?p(t,r,s):p(s))||s);return i&&s&&z(t,r,s),s};let f=class extends x(V){constructor(){super(...arguments),this.addr=""}render(){return o`<div class="ui-container mx-auto flex flex-col place-content-center pt-10">
      <!-- user profile -->
      <user-detail .address=${this.addr} class="mx-auto"></user-detail>

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
    </div>`}};$([u({type:String})],f.prototype,"addr",2);f=$([y("user-page")],f);export{f as TrackPage};
