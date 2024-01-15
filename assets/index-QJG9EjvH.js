import{g as w,T as x,b as v}from"./index-3ABFJoPQ.js";import{t as $,b as k,m as V}from"./dialog-77DgYyuD.js";import{a as g,e as O,V as T,x as r,n as p,q as D,G as f,h as o,d as h,c as y}from"./vendor-oB3DPz4D.js";import"./icon-BZ04ptiP.js";const P=async e=>{let t=`{
    subject(
      id: "`+e+`"
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
  }`;return await w("MediaBoard",t)},A=async e=>{let t=`{
    subject(
      id: "`+e+`"
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
  }`;return await w("MediaBoard",t)},j=".ui-list .item{cursor:pointer;align-items:center}@media (min-width: 768px){.ui-list .name{font-size:1rem;line-height:1.5rem}}";var M=Object.defineProperty,C=Object.getOwnPropertyDescriptor,m=(e,t,a,i)=>{for(var s=i>1?void 0:i?C(t,a):t,n=e.length-1,c;n>=0;n--)(c=e[n])&&(s=(i?c(t,a,s):c(s))||s);return i&&s&&M(t,a,s),s};let u=class extends x(j){constructor(){super(...arguments),this.bindBridge=new g(this,v),this.weekly=!1,this.trackAddress="",this.subjectData={},this.voteList=[],this.pending=!1,this.prompt=!1,this.promptMessage="",this.init=async()=>{this.pending=!0;try{let e=await A(this.trackAddress);this.voteList=e.subject.userVotes,this.subjectData=e.subject}catch(e){console.error(e),this.promptMessage=e,this.prompt=!0;return}this.pending=!1},this.close=()=>{this.init()},this.go2=e=>{this.disabled?O.emit("connect-wallet"):T(`/user/${e.user.address}`)}}get disabled(){return!v.bridge.account}connectedCallback(){super.connectedCallback(),this.init()}getRandomInt(e){return Math.floor(Math.random()*e)}render(){return r`<div>${p(this.pending&&!this.subjectData,()=>r`<div name="Loading" class="doc-intro"><div class="flex flex-col gap-8 m-8"><loading-skeleton num="3"></loading-skeleton><loading-skeleton num="3"></loading-skeleton><loading-skeleton num="3"></loading-skeleton></div></div>`)} ${p(this.subjectData,()=>r`<ul role="list" class="ui-list hover py-5"><li class="flex header"><div class="w-16">Rank</div><div class="address flex-auto">Addr</div><div class="num flex-none">Comsumption<span class="ml-1 text-xs opacity-70">(ST)</span></div><div class="num flex-none w-28">Earning<span class="ml-1 text-xs opacity-70">(ST)</span></div>${p(this.pending,()=>r`<div><i class="text-sm mdi mdi-loading"></i><div></div></div>`)}</li>${D(this.voteList,(e,t)=>r`<li class="item flex py-2.5" @click="${()=>this.go2(e)}"><div class="flex-none w-16 pl-4 text-sm font-light opacity-70">${t+1}</div><div class="flex-auto"><ui-address .address="${e.user.address}" short avatar class="text-base"></ui-address></div><div class="num flex-none"><p class="name truncate mt-2">${f(e.volumeVote,18)}</p><p></p></div><div class="num flex-none w-28"><p class="name truncate mt-2">${f(e.user.rewardClaimed,18)}</p></div></li>`)}</ul>`)}</div>${p(this.prompt,()=>r`<p class="text-center text-orange-600">${this.promptMessage}</p>`)}`}};m([h({type:Boolean})],u.prototype,"weekly",2);m([h({type:String})],u.prototype,"trackAddress",2);m([o()],u.prototype,"subjectData",2);m([o()],u.prototype,"voteList",2);m([o()],u.prototype,"pending",2);m([o()],u.prototype,"prompt",2);m([o()],u.prototype,"promptMessage",2);u=m([y("voter-list")],u);var S=Object.defineProperty,L=Object.getOwnPropertyDescriptor,d=(e,t,a,i)=>{for(var s=i>1?void 0:i?L(t,a):t,n=e.length-1,c;n>=0;n--)(c=e[n])&&(s=(i?c(t,a,s):c(s))||s);return i&&s&&S(t,a,s),s};const B=()=>({tx:""});let l=class extends x(j){constructor(){super(...arguments),this.bindBridge=new g(this,v),this.bindTweets=new g(this,$),this.weekly=!1,this.trackAddress="",this.retreatDisabled=!0,this.subject={totalVoteValue:"0"},this.voteList=[],this.pending=!1,this.prompt=!1,this.dialog=!1,this.promptMessage="",this.err=B(),this.updateErr=(e={})=>this.err=Object.assign({},this.err,e),this.init=async()=>{this.pending=!0;try{let e=await P(this.trackAddress);this.subject=e.subject,this.getPrice(),this.readFromTwitter()}catch(e){this.promptMessage=e,this.prompt=!0;return}finally{this.pending=!1}},this.close=()=>{this.dialog=!1,this.init()}}get disabled(){return!v.bridge.account}connectedCallback(){super.connectedCallback(),this.init()}getRandomInt(e){return Math.floor(Math.random()*e)}async readFromTwitter(){const{uri:e}=this.subject.creator.socials[0]??{},t=await $.get(e);t&&Object.assign(t,{verified:t.address.includes(this.subject.creator.address)}),this.social=t}async getPrice(){try{this.votes=k(this.trackAddress).then(e=>e[4]),this.myVotes=V(this.trackAddress).then(e=>(e>0&&(this.retreatDisabled=!1),e))}catch(e){let t=e.message||e.code;this.updateErr({tx:t})}}render(){return r`<div>${p(this.pending&&!this.subject,()=>r`<div name="Loading" class="doc-intro"><div class="flex flex-col gap-8 m-8"><loading-skeleton num="3"></loading-skeleton></div></div>`)} ${p(this.subject,()=>r`<div class="grid lg_grid-cols-13 gap-2"><div class="lg_col-span-6 flex gap-6"><div class="w-32 h-32 rounded-xl bg-white/10"><img-loader src="${this.subject.image}" class="w-32 h-32 rounded-xl"></img-loader></div><div class="flex flex-col justify-start ml-4"><div class="text-xl mb-1.5">${this.subject.name??"-"}</div>${p(this.social,()=>{var e,t,a,i;return r`<div class="inline-flex text-base font-normal mb-0.5">${(e=this.social)==null?void 0:e.name} ${p((t=this.social)==null?void 0:t.verified,()=>r`<span class="ml-0.5"><i class="mdi mdi-check-decagram text-sm text-green-600"></i></span>`)}</div><a class="text-base font-normal text-blue-300" href="${(a=this.social)==null?void 0:a.url}" target="_blank">@${(i=this.social)==null?void 0:i.id}</a>`},()=>r`-`)}<div class="mt-2"><ui-button sm class="outlined" ?disabled="${this.disabled}" @click="${()=>{this.dialog=!0}}">VOTE</ui-button>${p(this.dialog,()=>r`<vote-album-dialog album="${this.subject.id}" url="${this.subject.image}" name="${this.subject.name}" votes="${this.subject.supply}" author="${this.subject.creator.address}" @close="${this.close}"></vote-album-dialog>`)}</div></div></div><div class="lg_col-start-7 lg_col-span-7 grid grid-cols-6 lg_grid-cols-8 gap-4 place-items-center items-center"><div class="lg_col-start-3 col-span-2 flex flex-col justify-center items-center w-full h-4/5 bg-white/5 rounded-xl gap-1.5"><div class="text-base text-gray-500 align-center">Voters</div><div class="text-4xl align-center lining-nums">${this.subject.fansNumber}</div></div><div class="col-span-2 flex flex-col justify-center items-center w-full h-4/5 bg-white/5 rounded-xl gap-1.5"><div class="text-base text-gray-500 align-center">Tickets</div><div class="text-4xl align-center lining-nums">${this.subject.supply}</div></div><div class="col-span-2 flex flex-col justify-center items-center w-full h-4/5 bg-white/5 rounded-xl gap-1.5"><div class="text-base text-gray-500 align-center">Total Vote Value</div><div class="text-4xl align-center lining-nums">${f(this.subject.totalVoteValue,18)}<span class="ml-2 text-lg">ST</span></div></div></div></div>`)}</div>${p(this.prompt,()=>r`<p class="text-center text-orange-600">${this.promptMessage}</p>`)}`}};d([h({type:Boolean})],l.prototype,"weekly",2);d([h({type:String})],l.prototype,"trackAddress",2);d([h({type:Promise})],l.prototype,"votes",2);d([o()],l.prototype,"myVotes",2);d([o()],l.prototype,"retreatDisabled",2);d([o()],l.prototype,"social",2);d([o()],l.prototype,"subject",2);d([o()],l.prototype,"voteList",2);d([o()],l.prototype,"pending",2);d([o()],l.prototype,"prompt",2);d([o()],l.prototype,"dialog",2);d([o()],l.prototype,"promptMessage",2);d([o()],l.prototype,"err",2);l=d([y("track-detail")],l);const E="";var R=Object.defineProperty,N=Object.getOwnPropertyDescriptor,_=(e,t,a,i)=>{for(var s=i>1?void 0:i?N(t,a):t,n=e.length-1,c;n>=0;n--)(c=e[n])&&(s=(i?c(t,a,s):c(s))||s);return i&&s&&R(t,a,s),s};let b=class extends x(E){constructor(){super(...arguments),this.addr=""}render(){return r`<div class="ui-container mx-auto flex flex-col place-content-center pt-12"><track-detail trackAddress="${this.addr}"></track-detail><div class="mt-14"><div class="w-full inline-flex pb-6 border-b border-slate-50/10"><div class="py-1.5 px-3 text-base font-normal bg-sky-300/10 text-white/70 rounded-md">Voters</div></div><voter-list trackAddress="${this.addr}"></voter-list></div></div>`}};_([h({type:String})],b.prototype,"addr",2);b=_([y("track-page")],b);export{b as TrackPage};
