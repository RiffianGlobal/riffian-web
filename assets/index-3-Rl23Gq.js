import{g as $,T as x,b as v}from"./index-4Y4c3ejC.js";import{c as g,e as _,a0 as O,x as l,d as C,n as m,q as b,h as d,a as u,b as y}from"./vendor-aecOC4Ab.js";import{t as w}from"./dialog-LgBw_VA5.js";import"./icon-C9bbqVue.js";const P=async e=>{let t=`{
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
    }`;return await $("MediaBoard",t)},M=async e=>{let t=`{
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
    }`;return await $("MediaBoard",t)},D="li.header{margin-bottom:.75rem;font-size:.875rem;line-height:1.25rem;--tw-text-opacity: 1;color:#a3a3a3;color:rgba(163,163,163,var(--tw-text-opacity))}li.item:hover{background-color:#ffffff0d}@media (min-width: 500px){.name{font-size:1rem;line-height:1.5rem}}.icon{font-size:1.5rem;line-height:2rem}@media (max-width: 500px){.icon{font-size:1.5rem;line-height:2rem}}";var T=Object.defineProperty,j=Object.getOwnPropertyDescriptor,h=(e,t,i,r)=>{for(var s=r>1?void 0:r?j(t,i):t,n=e.length-1,p;n>=0;n--)(p=e[n])&&(s=(r?p(t,i,s):p(s))||s);return r&&s&&T(t,i,s),s};let c=class extends x(D){constructor(){super(...arguments),this.bindBridge=new g(this,v),this.weekly=!1,this.address="",this.userData={},this.trackList=[],this.pending=!1,this.prompt=!1,this.promptMessage="",this.init=async()=>{var e;this.pending=!0;try{let t=await P(this.address);this.trackList=(e=t.user)==null?void 0:e.subjectsCreated,this.userData=t.user}catch(t){console.error(t),this.promptMessage=t,this.prompt=!0;return}finally{this.pending=!1}},this.close=()=>{this.init()},this.go2=e=>{this.disabled?_.emit("connect-wallet"):O(`/track/${e.address}`)}}get disabled(){return!v.bridge.account}connectedCallback(){super.connectedCallback(),this.init()}getRandomInt(e){return Math.floor(Math.random()*e)}render(){return l`<div role="list" class="ui-list py-6 ${C(this.$c([this.pending?"loading":"hover"]))}">
        <div class="flex header">
          <div class="w-16">Index</div>
          <div class="flex-auto">Name</div>
          <div class="flex-none w-40">Created</div>
          <div class="flex-none w-24 text-right">Tickets</div>
          <div class="flex-none w-24 text-right">Voters</div>
          <!-- ${m(this.pending,()=>l`<div><i class="text-sm mdi mdi-loading"></i><div></div></div>`)} -->
        </div>
        ${m(this.pending,()=>l`<div name="Loading" class="doc-intro"><div class="flex flex-col gap-8 m-6">${b([...Array(3).keys()],()=>l`<div name="Loading" class="doc-intro"><loading-skeleton num="4"></loading-skeleton></div>`)}</div></div>`,()=>l`${b(this.trackList,(e,t)=>l`<div class="item flex py-2 pr-2 items-center cursor-pointer" @click="${()=>this.go2(e)}"><div class="flex-none w-16 pl-4 text-sm font-light opacity-75">${t+1}</div><div class="flex-auto flex"><div class="w-[3.75rem] h-[3.75rem] mr-4 rounded-lg"><img-loader sizes="60px, 60px" src="${e.image}" class="rounded-lg"></img-loader></div><div><p class="name truncate mt-2">${e.name}</p><span class="icon mt-1"><i class="mdi mdi-play-circle-outline"></i></span></div></div><div class="flex-none w-40 text-sm font-light text-neutral-400">${new Date(e.createdAt*1e3).toLocaleString()}</div><div class="flex-none w-24 text-right text-base font-light"><p class="name truncate mt-2">${e.fansNumber}</p></div><div class="flex-none w-24 text-right text-base font-light"><p class="name truncate mt-2">${e.supply}</p></div></div>`)}`)}
      </div>
      <!-- Prompt -->
      ${m(this.prompt,()=>l`<p class="text-center text-orange-600">${this.promptMessage}</p>`)}`}};h([u({type:Boolean})],c.prototype,"weekly",2);h([u({type:String})],c.prototype,"address",2);h([d()],c.prototype,"userData",2);h([d()],c.prototype,"trackList",2);h([d()],c.prototype,"pending",2);h([d()],c.prototype,"prompt",2);h([d()],c.prototype,"promptMessage",2);c=h([y("track-list")],c);const L='.middle-dot-divider:after{content:"·";padding:0 .375rem;font-weight:600}';var S=Object.defineProperty,B=Object.getOwnPropertyDescriptor,o=(e,t,i,r)=>{for(var s=r>1?void 0:r?B(t,i):t,n=e.length-1,p;n>=0;n--)(p=e[n])&&(s=(r?p(t,i,s):p(s))||s);return r&&s&&S(t,i,s),s};const V=()=>({loading:"",tx:""});let a=class extends x(L){constructor(){super(...arguments),this.bindBridge=new g(this,v),this.bindTweets=new g(this,w),this.weekly=!1,this.address="",this.retreatDisabled=!0,this.voteList=[],this.pending=!1,this.prompt=!1,this.dialog=!1,this.promptMessage="",this.err=V(),this.ts=0,this.updateErr=(e={})=>this.err=Object.assign({},this.err,e),this.init=async()=>{this.pending=!0;try{let e=await M(this.address);this.user=e.user,this.readFromTwitter()}catch(e){this.updateErr({load:e.message||e}),this.promptMessage=e,this.prompt=!0;return}finally{this.ts++,this.pending=!1}},this.close=()=>{this.dialog=!1,this.init()}}get disabled(){return!v.bridge.account}connectedCallback(){super.connectedCallback(),this.init()}getRandomInt(e){return Math.floor(Math.random()*e)}async readFromTwitter(){let{uri:e}=this.user.socials[0]??{};const t=await w.get(e);t&&Object.assign(t,{verified:this.user.address}),this.social=t}render(){return l`<div class="m-4 text-center">${m(!this.ts&&!this.err.loading,()=>l`<div name="Loading" class="doc-intro"><div class="flex flex-col gap-8 m-8"><loading-skeleton num="3"></loading-skeleton></div></div>`,()=>l`${m(this.prompt,()=>l`<p class="text-center text-orange-600">${this.promptMessage}</p>`,()=>{var e,t;return l`<div class="py-4"><ui-address class="text-lg" .address="${this.user.address}" short avatar></ui-address><div class="mt-4">${m((e=this.social)==null?void 0:e.verified,()=>{var i;return l`<span class="text-base font-light middle-dot-divider">${(i=this.social)==null?void 0:i.name}<span class="ml-0.5"><i class="text-green-600 text-sm mdi mdi-check-decagram"></i></span></span>`})} ${m((t=this.social)==null?void 0:t.url,()=>{var i,r;return l`<span class="text-base font-light"><a href="${(i=this.social)==null?void 0:i.url}" class="text-blue-300" target="_blank">@${(r=this.social)==null?void 0:r.id}</a></span>`})}</div><div class="mt-0.5"><span class="text-base text-white/70 middle-dot-divider">Holding <span class="ml-1 text-blue-300">${this.user.holding??"-"}</span></span> <span class="text-base text-white/70">Reward Claimed <span class="ml-1 text-blue-300">${this.user.rewardClaimed??"-"}</span></span></div></div>`})}`)}</div>`}};o([u({type:Boolean})],a.prototype,"weekly",2);o([u({type:String})],a.prototype,"address",2);o([u({type:Promise})],a.prototype,"votes",2);o([d()],a.prototype,"myVotes",2);o([d()],a.prototype,"retreatDisabled",2);o([d()],a.prototype,"social",2);o([d()],a.prototype,"user",2);o([d()],a.prototype,"voteList",2);o([d()],a.prototype,"pending",2);o([d()],a.prototype,"prompt",2);o([d()],a.prototype,"dialog",2);o([d()],a.prototype,"promptMessage",2);o([d()],a.prototype,"err",2);o([d()],a.prototype,"ts",2);a=o([y("user-detail")],a);const z="";var N=Object.defineProperty,A=Object.getOwnPropertyDescriptor,k=(e,t,i,r)=>{for(var s=r>1?void 0:r?A(t,i):t,n=e.length-1,p;n>=0;n--)(p=e[n])&&(s=(r?p(t,i,s):p(s))||s);return r&&s&&N(t,i,s),s};let f=class extends x(z){constructor(){super(...arguments),this.addr=""}render(){return l`<div class="ui-container mx-auto flex flex-col place-content-center pt-10">
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
    </div>`}};k([u({type:String})],f.prototype,"addr",2);f=k([y("user-page")],f);export{f as TrackPage};
