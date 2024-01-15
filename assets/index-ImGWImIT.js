import{T as y,b as g}from"./index-WJ1Akgri.js";import{t as v,r as k,b as V,m as D}from"./dialog-MTU94LRl.js";import{g as $}from"./claim-gNvHXJZs.js";import{a as f,x as d,n as p,q as T,e as O,y as b,h as a,d as m,c as w}from"./vendor-ecaUxFoO.js";const P=async t=>{let e=`{
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
  }`;return await $("MediaBoard",e)},A=async t=>{let e=`{
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
  }`;return await $("MediaBoard",e)},j="li.header{margin-bottom:.75rem;font-size:.875rem;line-height:1.25rem;--tw-text-opacity: 1;color:#a3a3a3;color:rgba(163,163,163,var(--tw-text-opacity))}li.item:hover{background-color:#ffffff0d}@media (min-width: 500px){.name{font-size:1rem;line-height:1.5rem}}.icon{font-size:1.5rem;line-height:2rem}@media (max-width: 500px){.icon{font-size:1.5rem;line-height:2rem}}";var M=Object.defineProperty,C=Object.getOwnPropertyDescriptor,h=(t,e,l,o)=>{for(var s=o>1?void 0:o?C(e,l):e,c=t.length-1,n;c>=0;c--)(n=t[c])&&(s=(o?n(e,l,s):n(s))||s);return o&&s&&M(e,l,s),s};let u=class extends y(j){constructor(){super(...arguments),this.bindBridge=new f(this,g),this.weekly=!1,this.trackAddress="",this.subjectData={},this.voteList=[],this.pending=!1,this.prompt=!1,this.promptMessage="",this.init=async()=>{this.pending=!0;try{let t=await A(this.trackAddress);this.voteList=t.subject.userVotes,this.subjectData=t.subject}catch(t){console.error(t),this.promptMessage=t,this.prompt=!0;return}this.pending=!1},this.close=()=>{this.init()}}get disabled(){return!g.bridge.account}connectedCallback(){super.connectedCallback(),this.init()}getRandomInt(t){return Math.floor(Math.random()*t)}render(){return d`<div class="py-6">${p(this.pending&&!this.subjectData,()=>d`<div name="Loading" class="doc-intro"><div class="flex flex-col gap-8 m-8"><loading-skeleton num="3"></loading-skeleton><loading-skeleton num="3"></loading-skeleton><loading-skeleton num="3"></loading-skeleton></div></div>`)} ${p(this.subjectData,()=>d`<ul role="list"><li class="flex header p-2"><div class="w-16">Rank</div><div class="flex-auto">Addr</div><div class="flex-auto text-right pr-3">Comsumption<span class="ml-1 text-sm opacity-70">(ST)</span></div><div class="flex-none w-28 text-right">Earning<span class="ml-1 text-sm opacity-70">(ST)</span></div>${p(this.pending,()=>d`<div><i class="text-sm mdi mdi-loading"></i><div></div></div>`)}</li>${T(this.voteList,(t,e)=>d`<li class="item flex py-2.5 items-center cursor-pointer" @click="${()=>{this.disabled?O.emit("connect-wallet"):location.href="/user/"+t.user.address}}"><div class="flex-none w-16 pl-4 text-sm font-light opacity-75">${e+1}</div><div class="flex-initial flex"><ui-address .address="${t.user.address}" short avatar class="text-base"></ui-address></div><div class="flex-auto text-right pr-3 items-end"><p class="name truncate mt-2">${b(t.volumeVote,18)}</p><p></p></div><div class="flex-none w-28 text-right"><p class="name truncate mt-2">${b(t.user.rewardClaimed,18)}</p></div></li>`)}</ul>`)}</div>${p(this.prompt,()=>d`<p class="text-center text-orange-600">${this.promptMessage}</p>`)}`}};h([m({type:Boolean})],u.prototype,"weekly",2);h([m({type:String})],u.prototype,"trackAddress",2);h([a()],u.prototype,"subjectData",2);h([a()],u.prototype,"voteList",2);h([a()],u.prototype,"pending",2);h([a()],u.prototype,"prompt",2);h([a()],u.prototype,"promptMessage",2);u=h([w("voter-list")],u);var I=Object.defineProperty,S=Object.getOwnPropertyDescriptor,r=(t,e,l,o)=>{for(var s=o>1?void 0:o?S(e,l):e,c=t.length-1,n;c>=0;c--)(n=t[c])&&(s=(o?n(e,l,s):n(s))||s);return o&&s&&I(e,l,s),s};const L=()=>({tx:""});let i=class extends y(j){constructor(){super(...arguments),this.bindBridge=new f(this,g),this.bindTweets=new f(this,v),this.weekly=!1,this.trackAddress="",this.retreatDisabled=!0,this.socialName="",this.socialURI="",this.socialID="",this.socialVerified=!1,this.subject={totalVoteValue:"0"},this.voteList=[],this.pending=!1,this.prompt=!1,this.dialog=!1,this.promptMessage="",this.err=L(),this.updateErr=(t={})=>this.err=Object.assign({},this.err,t),this.init=async()=>{this.pending=!0;try{let t=await P(this.trackAddress);this.subject=t.subject,this.getPrice(),this.readFromTwitter()}catch(t){this.promptMessage=t,this.prompt=!0;return}finally{this.pending=!1}},this.close=()=>{this.dialog=!1,this.init()}}get disabled(){return!g.bridge.account}connectedCallback(){super.connectedCallback(),this.init()}getRandomInt(t){return Math.floor(Math.random()*t)}get tweets(){return v.tweets}readFromLocal(t){let e={key:"",author_name:"",author_url:"",html:""};return this.tweets.some(l=>{l.key==t&&(e=l)}),e}async readFromTwitter(){let t=this.subject.creator.socials[0][2],e=this.readFromLocal(t);(!e.key||e.key.length==0)&&(e=await k(t),e.key=t,this.tweets.unshift(e),v.save()),this.socialName=e.author_name,this.socialURI=e.author_url,this.socialID=e.author_url.substring(e.author_url.lastIndexOf("/")+1,e.author_url.length-1),this.socialVerified=e.html.includes(this.subject.creator.address),this.socialVerified=!0}async getPrice(){try{this.votes=V(this.trackAddress).then(t=>t[4]),this.myVotes=D(this.trackAddress).then(t=>(t>0&&(this.retreatDisabled=!1),t))}catch(t){let e=t.message||t.code;this.updateErr({tx:e})}}render(){return d`<div>${p(this.pending&&!this.subject,()=>d`<div name="Loading" class="doc-intro"><div class="flex flex-col gap-8 m-8"><loading-skeleton num="3"></loading-skeleton></div></div>`)} ${p(this.subject,()=>d`<div class="grid lg_grid-cols-13 gap-2"><div class="lg_col-span-6 flex gap-6"><div class="w-32 h-32 rounded-xl bg-white/10"><img-loader src="${this.subject.image}" class="w-32 h-32 rounded-xl"></img-loader></div><div class="flex flex-col justify-start ml-4"><div class="text-xl mb-1.5">${this.subject.name}</div><div class="inline-flex text-base font-normal mb-0.5">${this.socialName} ${p(this.socialVerified,()=>d`<span class="ml-0.5"><i class="mdi mdi-check-decagram text-sm text-green-600"></i></span>`)}</div><a class="text-base font-normal text-blue-300" href="${this.socialURI}" target="_blank">@${this.socialID}</a><div class="mt-2"><ui-button sm class="outlined" ?disabled="${this.disabled}" @click="${()=>{this.dialog=!0}}">VOTE</ui-button>${p(this.dialog,()=>d`<vote-album-dialog album="${this.subject.id}" url="${this.subject.image}" name="${this.subject.name}" votes="${this.subject.supply}" author="${this.subject.creator.address}" @close="${this.close}"></vote-album-dialog>`)}</div></div></div><div class="lg_col-start-7 lg_col-span-7 grid grid-cols-6 lg_grid-cols-8 gap-4 place-items-center items-center"><div class="lg_col-start-3 col-span-2 flex flex-col justify-center items-center w-full h-4/5 bg-white/5 rounded-xl gap-1.5"><div class="text-base text-gray-500 align-center">Voters</div><div class="text-4xl align-center">${this.subject.fansNumber}</div></div><div class="col-span-2 flex flex-col justify-center items-center w-full h-4/5 bg-white/5 rounded-xl gap-1.5"><div class="text-base text-gray-500 align-center">Tickets</div><div class="text-4xl align-center">${this.subject.supply}</div></div><div class="col-span-2 flex flex-col justify-center items-center w-full h-4/5 bg-white/5 rounded-xl gap-1.5"><div class="text-base text-gray-500 align-center">Total Vote Value</div><div class="text-4xl align-center">${b(this.subject.totalVoteValue,18)}<span class="ml-2 text-lg">ST</span></div></div></div></div>`)}</div>${p(this.prompt,()=>d`<p class="text-center text-orange-600">${this.promptMessage}</p>`)}`}};r([m({type:Boolean})],i.prototype,"weekly",2);r([m({type:String})],i.prototype,"trackAddress",2);r([m({type:Promise})],i.prototype,"votes",2);r([a()],i.prototype,"myVotes",2);r([a()],i.prototype,"retreatDisabled",2);r([a()],i.prototype,"socialName",2);r([a()],i.prototype,"socialURI",2);r([a()],i.prototype,"socialID",2);r([a()],i.prototype,"socialVerified",2);r([a()],i.prototype,"subject",2);r([a()],i.prototype,"voteList",2);r([a()],i.prototype,"pending",2);r([a()],i.prototype,"prompt",2);r([a()],i.prototype,"dialog",2);r([a()],i.prototype,"promptMessage",2);r([a()],i.prototype,"err",2);i=r([w("track-detail")],i);const R="";var N=Object.defineProperty,B=Object.getOwnPropertyDescriptor,_=(t,e,l,o)=>{for(var s=o>1?void 0:o?B(e,l):e,c=t.length-1,n;c>=0;c--)(n=t[c])&&(s=(o?n(e,l,s):n(s))||s);return o&&s&&N(e,l,s),s};let x=class extends y(R){constructor(){super(...arguments),this.addr=""}render(){return d`<div class="md_max-w-7xl mx-auto flex flex-col place-content-center pt-12"><track-detail trackAddress="${this.addr}"></track-detail><div class="mt-14"><div class="w-full inline-flex pb-6 border-b border-slate-50/10"><div class="py-1.5 px-3 text-base font-normal bg-sky-300/10 text-white/70 rounded-md">Voters</div></div><voter-list trackAddress="${this.addr}"></voter-list></div></div>`}};_([m({type:String})],x.prototype,"addr",2);x=_([w("track-page")],x);export{x as TrackPage};
