import{g as $,T as x,b as v}from"./index-jemeh5bG.js";import{t as w,b as k,m as V}from"./dialog-sxKdg5_J.js";import"./claim-ChKL69z4.js";import{a as g,x as r,n as p,q as O,e as T,y as f,h as o,d as m,c as y}from"./vendor-YHmzau40.js";const D=async t=>{let e=`{
    subject(
      id: "`+t+`"
    ) {
      address
      createdAt
      creator {
        address
        id
        rewardClaimed
        socials {
          uri
          pid
          id
          platform
        }
      }
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
  }`;return await $("MediaBoard",e)},P=async t=>{let e=`{
    subject(
      id: "`+t+`"
    ) {
      address
      createdAt
      creator {
        address
        id
        rewardClaimed
        socials {
          uri
          pid
          id
          platform
        }
      }
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
      userVotes {
        volumeRetreat
        volumeTotal
        volumeVote
        votes
        user {
          address
          rewardClaimed
        }
      }
    }
  }`;return await $("MediaBoard",e)},j="li.header{margin-bottom:.75rem;font-size:.875rem;line-height:1.25rem;--tw-text-opacity: 1;color:#a3a3a3;color:rgba(163,163,163,var(--tw-text-opacity))}li.item:hover{background-color:#ffffff0d}@media (min-width: 500px){.name{font-size:1rem;line-height:1.5rem}}.icon{font-size:1.5rem;line-height:2rem}@media (max-width: 500px){.icon{font-size:1.5rem;line-height:2rem}}";var A=Object.defineProperty,M=Object.getOwnPropertyDescriptor,h=(t,e,a,i)=>{for(var s=i>1?void 0:i?M(e,a):e,n=t.length-1,c;n>=0;n--)(c=t[n])&&(s=(i?c(e,a,s):c(s))||s);return i&&s&&A(e,a,s),s};let u=class extends x(j){constructor(){super(...arguments),this.bindBridge=new g(this,v),this.weekly=!1,this.trackAddress="",this.subjectData={},this.voteList=[],this.pending=!1,this.prompt=!1,this.promptMessage="",this.init=async()=>{this.pending=!0;try{let t=await P(this.trackAddress);this.voteList=t.subject.userVotes,this.subjectData=t.subject}catch(t){console.error(t),this.promptMessage=t,this.prompt=!0;return}this.pending=!1},this.close=()=>{this.init()}}get disabled(){return!v.bridge.account}connectedCallback(){super.connectedCallback(),this.init()}getRandomInt(t){return Math.floor(Math.random()*t)}render(){return r`<div class="py-6">${p(this.pending&&!this.subjectData,()=>r`<div name="Loading" class="doc-intro"><div class="flex flex-col gap-8 m-8"><loading-skeleton num="3"></loading-skeleton><loading-skeleton num="3"></loading-skeleton><loading-skeleton num="3"></loading-skeleton></div></div>`)} ${p(this.subjectData,()=>r`<ul role="list"><li class="flex header p-2"><div class="w-16">Rank</div><div class="flex-auto">Addr</div><div class="flex-auto text-right pr-3">Comsumption<span class="ml-1 text-sm opacity-70">(ST)</span></div><div class="flex-none w-28 text-right">Earning<span class="ml-1 text-sm opacity-70">(ST)</span></div>${p(this.pending,()=>r`<div><i class="text-sm mdi mdi-loading"></i><div></div></div>`)}</li>${O(this.voteList,(t,e)=>r`<li class="item flex py-2.5 items-center cursor-pointer" @click="${()=>{this.disabled?T.emit("connect-wallet"):location.href="/user/"+t.user.address}}"><div class="flex-none w-16 pl-4 text-sm font-light opacity-75">${e+1}</div><div class="flex-initial flex"><ui-address .address="${t.user.address}" short avatar class="text-base"></ui-address></div><div class="flex-auto text-right pr-3 items-end"><p class="name truncate mt-2">${f(t.volumeVote,18)}</p><p></p></div><div class="flex-none w-28 text-right"><p class="name truncate mt-2">${f(t.user.rewardClaimed,18)}</p></div></li>`)}</ul>`)}</div>${p(this.prompt,()=>r`<p class="text-center text-orange-600">${this.promptMessage}</p>`)}`}};h([m({type:Boolean})],u.prototype,"weekly",2);h([m({type:String})],u.prototype,"trackAddress",2);h([o()],u.prototype,"subjectData",2);h([o()],u.prototype,"voteList",2);h([o()],u.prototype,"pending",2);h([o()],u.prototype,"prompt",2);h([o()],u.prototype,"promptMessage",2);u=h([y("voter-list")],u);var C=Object.defineProperty,S=Object.getOwnPropertyDescriptor,d=(t,e,a,i)=>{for(var s=i>1?void 0:i?S(e,a):e,n=t.length-1,c;n>=0;n--)(c=t[n])&&(s=(i?c(e,a,s):c(s))||s);return i&&s&&C(e,a,s),s};const L=()=>({tx:""});let l=class extends x(j){constructor(){super(...arguments),this.bindBridge=new g(this,v),this.bindTweets=new g(this,w),this.weekly=!1,this.trackAddress="",this.retreatDisabled=!0,this.subject={totalVoteValue:"0"},this.voteList=[],this.pending=!1,this.prompt=!1,this.dialog=!1,this.promptMessage="",this.err=L(),this.updateErr=(t={})=>this.err=Object.assign({},this.err,t),this.init=async()=>{this.pending=!0;try{let t=await D(this.trackAddress);this.subject=t.subject,this.getPrice(),this.readFromTwitter()}catch(t){this.promptMessage=t,this.prompt=!0;return}finally{this.pending=!1}},this.close=()=>{this.dialog=!1,this.init()}}get disabled(){return!v.bridge.account}connectedCallback(){super.connectedCallback(),this.init()}getRandomInt(t){return Math.floor(Math.random()*t)}async readFromTwitter(){const{uri:t}=this.subject.creator.socials[0]??{},e=await w.get(t);e&&Object.assign(e,{verified:e.address.includes(this.subject.creator.address)}),this.social=e}async getPrice(){try{this.votes=k(this.trackAddress).then(t=>t[4]),this.myVotes=V(this.trackAddress).then(t=>(t>0&&(this.retreatDisabled=!1),t))}catch(t){let e=t.message||t.code;this.updateErr({tx:e})}}render(){return r`<div>${p(this.pending&&!this.subject,()=>r`<div name="Loading" class="doc-intro"><div class="flex flex-col gap-8 m-8"><loading-skeleton num="3"></loading-skeleton></div></div>`)} ${p(this.subject,()=>r`<div class="grid lg_grid-cols-13 gap-2"><div class="lg_col-span-6 flex gap-6"><div class="w-32 h-32 rounded-xl bg-white/10"><img-loader src="${this.subject.image}" class="w-32 h-32 rounded-xl"></img-loader></div><div class="flex flex-col justify-start ml-4"><div class="text-xl mb-1.5">${this.subject.name??"-"}</div>${p(this.social,()=>{var t,e,a,i;return r`<div class="inline-flex text-base font-normal mb-0.5">${(t=this.social)==null?void 0:t.name} ${p((e=this.social)==null?void 0:e.verified,()=>r`<span class="ml-0.5"><i class="mdi mdi-check-decagram text-sm text-green-600"></i></span>`)}</div><a class="text-base font-normal text-blue-300" href="${(a=this.social)==null?void 0:a.url}" target="_blank">@${(i=this.social)==null?void 0:i.id}</a>`},()=>r`-`)}<div class="mt-2"><ui-button sm class="outlined" ?disabled="${this.disabled}" @click="${()=>{this.dialog=!0}}">VOTE</ui-button>${p(this.dialog,()=>r`<vote-album-dialog album="${this.subject.id}" url="${this.subject.image}" name="${this.subject.name}" votes="${this.subject.supply}" author="${this.subject.creator.address}" @close="${this.close}"></vote-album-dialog>`)}</div></div></div><div class="lg_col-start-7 lg_col-span-7 grid grid-cols-6 lg_grid-cols-8 gap-4 place-items-center items-center"><div class="lg_col-start-3 col-span-2 flex flex-col justify-center items-center w-full h-4/5 bg-white/5 rounded-xl gap-1.5"><div class="text-base text-gray-500 align-center">Voters</div><div class="text-4xl align-center">${this.subject.fansNumber}</div></div><div class="col-span-2 flex flex-col justify-center items-center w-full h-4/5 bg-white/5 rounded-xl gap-1.5"><div class="text-base text-gray-500 align-center">Tickets</div><div class="text-4xl align-center">${this.subject.supply}</div></div><div class="col-span-2 flex flex-col justify-center items-center w-full h-4/5 bg-white/5 rounded-xl gap-1.5"><div class="text-base text-gray-500 align-center">Total Vote Value</div><div class="text-4xl align-center">${f(this.subject.totalVoteValue,18)}<span class="ml-2 text-lg">ST</span></div></div></div></div>`)}</div>${p(this.prompt,()=>r`<p class="text-center text-orange-600">${this.promptMessage}</p>`)}`}};d([m({type:Boolean})],l.prototype,"weekly",2);d([m({type:String})],l.prototype,"trackAddress",2);d([m({type:Promise})],l.prototype,"votes",2);d([o()],l.prototype,"myVotes",2);d([o()],l.prototype,"retreatDisabled",2);d([o()],l.prototype,"social",2);d([o()],l.prototype,"subject",2);d([o()],l.prototype,"voteList",2);d([o()],l.prototype,"pending",2);d([o()],l.prototype,"prompt",2);d([o()],l.prototype,"dialog",2);d([o()],l.prototype,"promptMessage",2);d([o()],l.prototype,"err",2);l=d([y("track-detail")],l);const B="";var E=Object.defineProperty,R=Object.getOwnPropertyDescriptor,_=(t,e,a,i)=>{for(var s=i>1?void 0:i?R(e,a):e,n=t.length-1,c;n>=0;n--)(c=t[n])&&(s=(i?c(e,a,s):c(s))||s);return i&&s&&E(e,a,s),s};let b=class extends x(B){constructor(){super(...arguments),this.addr=""}render(){return r`<div class="md_max-w-7xl mx-auto flex flex-col place-content-center pt-12"><track-detail trackAddress="${this.addr}"></track-detail><div class="mt-14"><div class="w-full inline-flex pb-6 border-b border-slate-50/10"><div class="py-1.5 px-3 text-base font-normal bg-sky-300/10 text-white/70 rounded-md">Voters</div></div><voter-list trackAddress="${this.addr}"></voter-list></div></div>`}};_([m({type:String})],b.prototype,"addr",2);b=_([y("track-page")],b);export{b as TrackPage};
