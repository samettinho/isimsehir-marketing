/* ══════════════════════════════════════════════════════════════════════
   reklam-core.js — Reklam Stüdyosu ortak motoru (window.RK)
   ══════════════════════════════════════════════════════════════════════
   Tek kaynak: uygulamanın kendi arayüzü (cevrimdisi-4.0.html'den) +
   teşekkür stüdyosunun marka/logo katmanı (tesekkur-10bin.html'den) +
   reklama özel yeni bileşenler (§4.1 brifi). Sayfalar (reklam-story.html,
   reklam-post.html, reklam-carousel.html, reklam-video.html) bu dosyayı
   yükler, kendi ITEMS'ını tanımlar ve RK.mount({...}) çağırır.

   Sayfa CSS'i buradan gelmez — her sayfa cevrimdisi-4.0'ın stüdyo CSS'ini
   (.wrap/.card/.stage/.kind/.btn/.toast/.modal ...) kendi <style>'ında
   taşır; RK.mount ürettiği DOM bu sınıf adlarını kullanır.

   Yükleme sırası: logo.js → gif.js → mp4-muxer.min.js → reklam-core.js →
   sayfanın kendi <script>'i (ITEMS + RK.mount).

   Gerçek fonksiyon imzaları: docs/reklam-core-api.md
   ══════════════════════════════════════════════════════════════════════ */
(function(){
"use strict";

/* ══════════════════ sabitler ══════════════════ */
/* app/src/themes.ts — uygulama paleti */
const C={
  ink:"#0F1226",panel:"#1A1E3B",panel2:"#242963",line:"#2E3470",
  text:"#F4F5FF",dim:"#9AA0CF",violet:"#7C5CFF",violetLo:"#9D7CFF",
  sky:"#4DC3FF",mint:"#37D399",gold:"#F0C24B",rose:"#FF5C7A",warn:"#FFB347",bot:"#5BA8E8",
};
/* logodan türetilen künye/kutlama paleti (tesekkur-10bin.html) */
const L={deep:"#0A0E2A",navy:"#141A4A",navy2:"#1E2A6B",line:"#2B3578",
  gold:"#FFC63D",goldHi:"#FFE9A8",gold2:"#FF9E00",cream:"#FFF6E0",
  text:"#F5F7FF",dim:"#9AA3D0",sky:"#4FC3F7",purple:"#9575CD",red:"#E53935",mint:"#4DD6A0"};
/* GameScreen.tsx: CAT_GRADIENTS */
const CATG=[["#9D7CFF","#6C4CFF"],["#7CD0FF","#2A95E0"],["#7CFFB7","#27A957"],
            ["#FFE16B","#E8A820"],["#FF9D7B","#E04C29"],["#FF9DC1","#D8478A"]];
/* OfflineBotScreen.tsx: LEVELS */
const LEVELS=[
  {n:1,label:"Çaylak",desc:"Az kategori doldurur, herkesin bildiği kelimeler",fill:.4},
  {n:2,label:"Acemi", desc:"Yavaş yazar, sık kullanılan kelimeler",           fill:.6},
  {n:3,label:"Orta",  desc:"Dengeli — çoğu kategoriyi doldurur",              fill:.8},
  {n:4,label:"İyi",   desc:"Hızlı yazar, seyrek kelimeler bulur",             fill:.9},
  {n:5,label:"Usta",  desc:"Hepsini doldurur, kimsenin aklına gelmeyenleri seçer",fill:1},
];
const CATS=["İsim","Şehir","Hayvan","Bitki","Eşya","Ünlü"];
/* NOT: brif §0.4 ve §2 künyeyi "@isimsehironline" olarak yazıyor — HANDLE
   "@" ile birlikte tutulur (kaynak dosyalardaki socials() @ işaretsiz
   basıyordu, brif metniyle birebir eşlesin diye burada düzeltildi). */
const HANDLE="@isimsehironline";
const APP_URL="https://apps.apple.com/app/isim-sehir-online/id6766661912";
const PLAY_URL="https://play.google.com/store/apps/details?id=com.isimsehir.app";
/* Reklam güvenli alanı — Story/Video (1080×1920) için, ham piksel */
const SAFE={story:{top:250,bottom:340}};

/* ══════════════════ ölçek ══════════════════
   1 uygulama puntosu = 2.77 px. S kapanış değişkeni; P her çağrıda güncel
   S'yi kullanır (setScale/resetScale/setScaleForHeight S'yi değiştirir). */
let S=2.77;
function P(v){return v*S;}
function setScale(s){S=s;}
function resetScale(){S=2.77;}
/** Poster ölçeği: içerik yüksekliği hv pt ise 1350px'e sığdır (app ölçeğini aşmaz). */
function setScaleForHeight(hv){S=Math.min(2.77,1350/hv);}

/* ══════════════════ yardımcılar ══════════════════ */
const clamp01=t=>Math.max(0,Math.min(1,t));
const inv=(lp,s,l)=>clamp01((lp-s)/l);
const eOut=t=>1-Math.pow(1-t,3);
const eBack=t=>{const c=1.70158,c3=c+1;return 1+c3*Math.pow(t-1,3)+c*Math.pow(t-1,2);};
const eInOut=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
function hexA(hex,a){const h=hex.replace("#","");const n=parseInt(h.length===3?h.split("").map(c=>c+c).join(""):h,16);
  return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;}
function shade(hex,amt){const h=hex.replace("#","");const n=parseInt(h.length===3?h.split("").map(c=>c+c).join(""):h,16);
  let r=(n>>16)&255,g=(n>>8)&255,b=n&255;r=Math.max(0,Math.min(255,r+amt));g=Math.max(0,Math.min(255,g+amt));b=Math.max(0,Math.min(255,b+amt));
  return `rgb(${r},${g},${b})`;}
function seeded(n){const s=Math.sin(n*99.13)*43758.5453;return s-Math.floor(s);}
function rr(ctx,x,y,w,h,r){r=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);ctx.beginPath();ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function F(w,size){return `${w} ${Math.round(size)}px Inter, -apple-system, system-ui, sans-serif`;}
function AN(size){return `400 ${Math.round(size)}px Anton, sans-serif`;}
function CV(size){return `700 ${Math.round(size)}px 'Caveat', cursive`;}
function HD(size){return `400 ${Math.round(size)}px 'Patrick Hand', cursive`;}
function MONO(w,size){return `${w} ${Math.round(size)}px ui-monospace, Menlo, 'SF Mono', Consolas, monospace`;}
function EF(size){return `${Math.round(size)}px 'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif`;}
function txt(ctx,s,x,y,o){o=o||{};ctx.save();
  ctx.font=o.font||F(o.w||"700",o.size||30);ctx.fillStyle=o.col||C.text;
  ctx.textAlign=o.align||"left";ctx.textBaseline=o.base||"alphabetic";
  if(o.ls!==undefined){try{ctx.letterSpacing=o.ls+"px";}catch(e){}}
  if(o.shadow){ctx.shadowColor=o.shadow;ctx.shadowBlur=o.shadowBlur||18;ctx.shadowOffsetY=o.shadowY||6;}
  ctx.fillText(String(s),x,y);ctx.restore();}
function meas(ctx,s,o){o=o||{};ctx.save();ctx.font=o.font||F(o.w||"700",o.size||30);
  if(o.ls!==undefined){try{ctx.letterSpacing=o.ls+"px";}catch(e){}}
  const w=ctx.measureText(String(s)).width;ctx.restore();return w;}
function wrapLines(ctx,s,o,maxW){const words=String(s).split(" ");const out=[];let cur="";
  for(const wd of words){const test=cur?cur+" "+wd:wd;
    if(meas(ctx,test,o)>maxW&&cur){out.push(cur);cur=wd;}else cur=test;}
  if(cur)out.push(cur);return out;}
/** wrapLines + txt: sarılmış satırları çizer, satır sayısını döndürür. */
function txtWrap(ctx,s,x,y,o,maxW,lh){o=o||{};lh=lh||((o.size||30)*1.2);
  const ls=wrapLines(ctx,s,o,maxW);ls.forEach((ln,i)=>txt(ctx,ln,x,y+i*lh,o));return ls.length;}
function emoji(ctx,e,cx,cy,size){ctx.save();ctx.font=EF(size);ctx.textAlign="center";ctx.textBaseline="middle";
  ctx.fillText(e,cx,cy+size*0.03);ctx.restore();}
function up(s){return String(s).toLocaleUpperCase("tr-TR");}
/** Anton'da İ yok — I çizip noktayı elle koyar. */
function antonTxt(ctx,s,x,y,size,fill,align){s=String(s);
  ctx.save();ctx.font=AN(size);ctx.textAlign="left";ctx.textBaseline="alphabetic";ctx.fillStyle=fill;
  const tw=ctx.measureText(s.replace(/İ/g,"I")).width;
  let cx=align==="center"?x-tw/2:align==="right"?x-tw:x;
  for(const ch of s){const g=ch==="İ"?"I":ch,w=ctx.measureText(g).width;
    ctx.fillText(g,cx,y);
    if(ch==="İ")ctx.fillRect(cx+w*0.14,y-size*0.97,w*0.72,size*0.14);
    cx+=w;}
  ctx.restore();return tw;}

/* ══════════════════ marka ══════════════════ */
const LOGO=new Image();
try{if(typeof LOGO_DATA!=="undefined")LOGO.src=LOGO_DATA;}catch(e){}
function logoReady(){return new Promise(res=>{
  if(LOGO.complete&&LOGO.naturalWidth)return res();
  LOGO.onload=()=>res();LOGO.onerror=()=>res();});}

/** Gerçek logo — "İŞ" harf kısaltması YOK. */
function logo(ctx,cx,cy,size,o){o=o||{};if(!LOGO.complete||!LOGO.naturalWidth)return;
  ctx.save();
  if(o.glow){ctx.shadowColor=o.glow;ctx.shadowBlur=size*0.30;}
  else{ctx.shadowColor="rgba(0,0,0,.55)";ctx.shadowBlur=size*0.16;ctx.shadowOffsetY=size*0.06;}
  ctx.drawImage(LOGO,cx-size/2,cy-size/2,size,size);ctx.restore();}

const APPLE_D="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z";
const PLAY_D="M76.5 16.9C73 20.4 71 25.3 71 31v450c0 5.7 2 10.6 5.5 14.1l253.6-253.6L76.5 16.9zM104.6 13.4c-7-2.8-15-1.2-20.4 4.2l241.1 241.1 50.5-50.5L104.6 13.4zm344.6 216.7-71.2-41.1-55.9 55.9 55.9 55.9 71.2-41.1c20.6-12 20.6-43.7 0-55.8zM84.2 502.6c5.4 5.4 13.4 7 20.4 4.2l221-127.6-50.5-50.5L84.2 502.6z";
const X_D="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z";
const TT_D="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.6c.27 0 .53.04.78.12V9.66a5.7 5.7 0 1 0 4.9 5.64V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z";
function glyph(ctx,d,vb,cx,cy,size,col){ctx.save();ctx.translate(cx-size/2,cy-size/2);
  const s=size/vb;ctx.scale(s,s);ctx.fillStyle=col;ctx.fill(new Path2D(d));ctx.restore();}
/* instagram — çizimle, her boyutta net kalır */
function igIcon(ctx,cx,cy,s,col){ctx.save();ctx.strokeStyle=col;ctx.lineWidth=s*0.105;
  rr(ctx,cx-s/2,cy-s/2,s,s,s*0.30);ctx.stroke();
  ctx.beginPath();ctx.arc(cx,cy,s*0.235,0,7);ctx.stroke();
  ctx.fillStyle=col;ctx.beginPath();ctx.arc(cx+s*0.275,cy-s*0.275,s*0.062,0,7);ctx.fill();ctx.restore();}

/** satır: ig + X + tiktok ikonları + @isimsehironline */
function socials(ctx,cx,y,col,s){
  const gap=s*1.5, tw=meas(ctx,HANDLE,{size:s*0.98,w:"700"});
  const total=gap*2+s+s*0.9+tw, x0=cx-total/2+s/2;
  igIcon(ctx,x0,y,s*0.92,col);
  glyph(ctx,X_D,24,x0+gap,y,s*0.86,col);
  glyph(ctx,TT_D,24,x0+gap*2,y,s*0.94,col);
  txt(ctx,HANDLE,x0+gap*2+s*0.9,y,{size:s*0.98,w:"700",col,base:"middle"});}

/** App Store + Google Play rozetleri, yan yana. */
function storeBadges(ctx,cx,y,o){o=o||{};const h=o.h||62,pad=h*0.42,ic=h*0.56,gap=16;
  const items=[[APPLE_D,24,"App Store"],[PLAY_D,512,"Google Play"]];
  const fs=h*0.36;
  const ws=items.map(it=>pad+ic+10+meas(ctx,it[2],{size:fs,w:"800"})+pad);
  let x=cx-(ws[0]+ws[1]+gap)/2;
  items.forEach((it,i)=>{
    rr(ctx,x,y-h/2,ws[i],h,h/2);
    ctx.fillStyle=o.fill||hexA(L.text,.10);ctx.fill();
    ctx.lineWidth=2;ctx.strokeStyle=o.stroke||hexA(L.text,.22);ctx.stroke();
    glyph(ctx,it[0],it[1],x+pad+ic/2,y,ic,o.col||L.text);
    txt(ctx,it[2],x+pad+ic+10,y+1,{size:fs,w:"800",col:o.col||L.text,base:"middle"});
    x+=ws[i]+gap;});}

/** Künye — logo + ad / sosyal / rozetler. Toplam yükseklik ~186px. */
function colophon(ctx,R,y,o){o=o||{};
  const col=o.col||L.text, dim=o.dim||hexA(col,.62), cx=R.W/2;
  const name="İsim Şehir Online", ls=76;
  const tw=meas(ctx,name,{size:34,w:"800"});
  const x0=cx-(ls+18+tw)/2;
  logo(ctx,x0+ls/2,y+ls/2,ls);
  txt(ctx,name,x0+ls+18,y+ls/2+1,{size:34,w:"800",col,base:"middle"});
  socials(ctx,cx,y+ls+34,dim,26);
  storeBadges(ctx,cx,y+ls+104,{col,fill:o.chipFill||hexA(col,.09),stroke:o.chipStroke||hexA(col,.22)});
  return 186;}

/** Reklam kapanışı — büyük "Ücretsiz indir" butonu + rozetler + @handle.
    o.y verilirse orada, verilmezse güvenli alanın hemen üstünde.
    o.compact: buton + rozetler tek satır (post/carousel son slayt). */
function adCTA(ctx,R,o){o=o||{};
  const isStory=R.H>=1900;
  const safeB=isStory?SAFE.story.bottom:68;
  const x=P(40),w=R.W-P(80);
  const y0=o.y!==undefined?o.y:R.H-safeB-250;
  if(o.compact){
    const bh=P(64),bw=w*0.6;
    ctx.save();ctx.shadowColor=hexA(C.mint,.4);ctx.shadowBlur=P(12);ctx.shadowOffsetY=P(4);
    rr(ctx,x,y0,bw,bh,bh/2);ctx.fillStyle=C.mint;ctx.fill();ctx.restore();
    txt(ctx,"Ücretsiz indir",x+bw/2,y0+bh/2,{size:P(17),w:"900",col:C.ink,align:"center",base:"middle"});
    const ix=x+bw+P(22);
    glyph(ctx,APPLE_D,24,ix+P(16),y0+bh/2,P(30),C.text);
    glyph(ctx,PLAY_D,512,ix+P(56),y0+bh/2,P(30),C.text);
    txt(ctx,HANDLE,x+w,y0+bh+P(24),{size:P(13),w:"700",col:C.dim,align:"right",base:"middle"});
    return bh+P(34);
  }
  /* y0 sabit (1330) — blok 250px'lik pay içine, en alt piksel <= R.H-340 (1580) sığacak
     şekilde daraltıldı: buton 80, rozet merkezi +68, @handle +76, ham piksel (P() yok). */
  const bh=80;
  ctx.save();ctx.shadowColor=hexA(C.mint,.5);ctx.shadowBlur=P(18);ctx.shadowOffsetY=P(6);
  rr(ctx,x,y0,w,bh,bh/2);ctx.fillStyle=C.mint;ctx.fill();ctx.restore();
  txt(ctx,"Ücretsiz indir",x+w/2,y0+bh/2,{size:P(22),w:"900",col:C.ink,align:"center",base:"middle"});
  const by=y0+bh+18+50;
  storeBadges(ctx,R.W/2,by,{h:100,col:C.text,fill:hexA(C.text,.08),stroke:hexA(C.text,.22)});
  txt(ctx,HANDLE,R.W/2,by+50+26,{size:30,w:"700",col:C.dim,align:"center",base:"middle"});
  return 250;}

/** ?safe=1 iken güvenli alanı kırmızı taralı çizer — yalnız önizleme. */
function safeGuide(ctx,R){
  if(!R||R.H<1900)return;
  function zone(y0,h,label,borderY){
    ctx.save();ctx.beginPath();ctx.rect(0,y0,R.W,h);ctx.clip();
    ctx.fillStyle=hexA("#FF2D55",.14);ctx.fillRect(0,y0,R.W,h);
    ctx.strokeStyle=hexA("#FF2D55",.4);ctx.lineWidth=2;
    for(let x=-h;x<R.W+h;x+=26){ctx.beginPath();ctx.moveTo(x,y0);ctx.lineTo(x+h,y0+h);ctx.stroke();}
    ctx.restore();
    ctx.save();ctx.strokeStyle="#FF2D55";ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(0,borderY);ctx.lineTo(R.W,borderY);ctx.stroke();ctx.restore();
    ctx.save();ctx.fillStyle="#FF2D55";ctx.font="800 22px Inter, sans-serif";ctx.textAlign="left";ctx.textBaseline="top";
    ctx.fillText(label,14,y0===0?h-30:y0+8);ctx.restore();}
  zone(0,SAFE.story.top,"GÜVENLİ ALAN DIŞI · ÜST "+SAFE.story.top+"px",SAFE.story.top);
  zone(R.H-SAFE.story.bottom,SAFE.story.bottom,"GÜVENLİ ALAN DIŞI · ALT "+SAFE.story.bottom+"px",R.H-SAFE.story.bottom);}

/* ══════════════════ uygulama bileşenleri (cevrimdisi-4.0'dan birebir) ══════════════════ */
function bg(ctx,R){const W=R.W,H=R.H;
  ctx.fillStyle=C.ink;ctx.fillRect(0,0,W,H);
  const g=ctx.createRadialGradient(W*0.5,-H*0.04,0,W*0.5,-H*0.04,W*1.15);
  g.addColorStop(0,hexA(C.violet,.17));g.addColorStop(.55,hexA(C.violet,.04));g.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}

/** panel kartı — colors.panel + colors.border, 1.5pt kenar */
function card(ctx,x,y,w,h,r,o){o=o||{};ctx.save();
  rr(ctx,x,y,w,h,r);ctx.fillStyle=o.fill||C.panel;ctx.fill();
  ctx.lineWidth=o.lw||P(1.5);ctx.strokeStyle=o.stroke||C.line;ctx.stroke();ctx.restore();}

/** Label bileşeni: 11pt / 800 / ls 1 / dim / UPPERCASE */
function label(ctx,s,x,y,col){txt(ctx,up(s),x,y,{size:P(11),w:"800",col:col||C.dim,ls:P(1)});}

/** Pill — arka plan tone+alpha, kenar tone, 900 */
function pill(ctx,x,y,s,tone,o){o=o||{};const size=o.size||P(10),padX=o.padX||P(8),h=o.h||P(20);
  const w=meas(ctx,s,{size,w:"900",ls:o.ls||0})+padX*2;
  rr(ctx,x,y,w,h,h/2);ctx.fillStyle=o.fill||hexA(tone,.14);ctx.fill();
  ctx.lineWidth=P(1);ctx.strokeStyle=tone;ctx.stroke();
  txt(ctx,s,x+w/2,y+h/2,{size,w:"900",col:tone,align:"center",base:"middle",ls:o.ls||0});
  return w;}

/** CoinPill — panel2 hap, 🪙 + bakiye */
function coinPill(ctx,rightX,y,n,o){o=o||{};const size=o.size||P(13);
  const s=String(Math.round(n));const w=meas(ctx,s,{size,w:"800"})+P(38);const h=o.h||P(26);
  const x=rightX-w;
  rr(ctx,x,y,w,h,h/2);ctx.fillStyle=C.panel2;ctx.fill();
  ctx.lineWidth=P(1);ctx.strokeStyle=C.line;ctx.stroke();
  emoji(ctx,"🪙",x+P(13),y+h/2,P(13));
  txt(ctx,s,x+w-P(9),y+h/2,{size,w:"800",col:C.text,align:"right",base:"middle"});
  return {x,w,h};}

/** iOS durum çubuğu — sinyal ölür, ✈ belirir. */
function statusBar(ctx,R,st){st=st||{};const W=R.W,H=P(54);
  const sig=st.sig===undefined?4:st.sig, plane=!!st.plane;
  txt(ctx,st.time||"21:04",P(30),P(34),{size:P(16),w:"700",col:C.text});
  rr(ctx,W/2-P(60),P(10),P(120),P(33),P(16.5));ctx.fillStyle="#05060f";ctx.fill();
  let x=W-P(28);
  const bw=P(25),bh=P(12),by=P(22);
  x-=bw;ctx.save();ctx.lineWidth=P(1.2);ctx.strokeStyle=hexA(C.text,.5);
  rr(ctx,x,by,bw,bh,P(3.5));ctx.stroke();
  ctx.fillStyle=hexA(C.text,.9);rr(ctx,x+P(1.6),by+P(1.6),(bw-P(3.2))*(st.batt||.72),bh-P(3.2),P(2));ctx.fill();
  ctx.fillStyle=hexA(C.text,.5);rr(ctx,x+bw+P(1.2),by+bh*0.3,P(1.8),bh*0.4,P(1));ctx.fill();ctx.restore();
  x-=P(9);
  if(plane){x-=P(20);emoji(ctx,"✈️",x+P(10),by+bh/2,P(17));
  }else{
    x-=P(20);ctx.save();ctx.strokeStyle=hexA(C.text,sig>0?.92:.25);ctx.lineWidth=P(2);ctx.lineCap="round";
    for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(x+P(10),by+bh+P(1),P(3)+i*P(4.5),Math.PI*1.2,Math.PI*1.8);ctx.stroke();}
    ctx.fillStyle=hexA(C.text,sig>0?.92:.25);ctx.beginPath();ctx.arc(x+P(10),by+bh+P(0.5),P(1.6),0,7);ctx.fill();ctx.restore();
    x-=P(11);
    for(let i=3;i>=0;i--){const bwid=P(3.6),bhg=P(4)+i*P(2.6);
      x-=(i===3?bwid:bwid+P(2.6));
      ctx.fillStyle=(i<sig)?hexA(C.text,.92):hexA(C.text,.22);
      rr(ctx,x,by+bh-bhg+P(2),bwid,bhg,P(1.4));ctx.fill();}
  }
  return H;}

/** Ekran başlığı — eyebrow + başlık + sağda jeton hapı / ÇEVRİMDIŞI rozeti */
function screenHead(ctx,R,o){o=o||{};const y0=P(54),W=R.W,h=P(58);
  if(o.eyebrow)label(ctx,o.eyebrow,P(16),y0+P(19),o.eyebrowCol||C.dim);
  txt(ctx,o.title,P(16),y0+P(43),{size:P(18),w:"800",col:C.text});
  let rx=W-P(14);
  if(o.offline){const w=pill(ctx,rx-P(74),y0+P(14),"ÇEVRİMDIŞI",C.warn,{size:P(9.5),h:P(19),padX:P(8)});rx-=w+P(10);}
  if(o.coins!==undefined){const cp=coinPill(ctx,rx,y0+P(12),o.coins);rx=cp.x-P(10);}
  if(o.timer!==undefined){
    const tone=o.timer<=10?C.rose:C.mint,w=P(66),x=rx-w;
    rr(ctx,x,y0+P(8),w,P(42),P(16));ctx.fillStyle=hexA(tone,.13);ctx.fill();
    ctx.lineWidth=P(1.5);ctx.strokeStyle=tone;ctx.stroke();
    txt(ctx,o.timer,x+w/2,y0+P(30),{size:P(25),w:"900",col:tone,align:"center",base:"middle"});
    txt(ctx,"SANİYE",x+w/2,y0+P(44),{size:P(8),w:"800",col:tone,align:"center",base:"middle",ls:P(1.2)});
  }
  ctx.fillStyle=C.line;ctx.fillRect(0,y0+h,W,P(1));
  return y0+h+P(1);}

/** Oyuncu şeridi — avatar + isim + dolu kategori çubuğu */
function playerStrip(ctx,R,y,players){const h=P(60);
  let x=P(14);
  players.forEach(p=>{
    const w=P(118);
    card(ctx,x,y+P(6),w,P(48),P(14),{fill:p.me?hexA(C.violet,.12):C.panel,stroke:p.me?hexA(C.violet,.55):C.line});
    const ring=p.me?C.violet:(p.bot?C.bot:C.line);
    ctx.save();ctx.beginPath();ctx.arc(x+P(20),y+P(30),P(13),0,7);ctx.fillStyle=C.panel2;ctx.fill();
    ctx.lineWidth=P(2);ctx.strokeStyle=ring;ctx.stroke();ctx.restore();
    emoji(ctx,p.e,x+P(20),y+P(30),P(17));
    txt(ctx,p.n,x+P(38),y+P(25),{size:P(11.5),w:"700",col:C.text});
    const bx=x+P(38),bw=w-P(48);
    rr(ctx,bx,y+P(33),bw,P(5),P(2.5));ctx.fillStyle=C.panel2;ctx.fill();
    rr(ctx,bx,y+P(33),bw*clamp01(p.fill),P(5),P(2.5));ctx.fillStyle=p.bot?C.bot:C.mint;ctx.fill();
    if(p.bot){pill(ctx,x+P(38),y+P(39),"BOT",C.bot,{size:P(7.5),h:P(13),padX:P(5)});}
    x+=w+P(8);
  });
  return y+h;}

/** LetterTile — SVG gradyanlı harf karosu */
function letterTile(ctx,x,y,size,letter,grad){
  ctx.save();ctx.shadowColor=hexA(grad[1],.45);ctx.shadowBlur=size*0.28;ctx.shadowOffsetY=size*0.1;
  const g=ctx.createLinearGradient(x,y,x+size,y+size);g.addColorStop(0,grad[0]);g.addColorStop(1,grad[1]);
  ctx.fillStyle=g;rr(ctx,x,y,size,size,size*0.26);ctx.fill();ctx.restore();
  txt(ctx,letter,x+size/2,y+size/2,{size:size*0.55,w:"900",col:"#fff",align:"center",base:"middle"});}

/** İpucu çipi — panel2, altın kenar, 💡 etiket 🪙fiyat */
function hintChip(ctx,x,y,lab,price,o){o=o||{};const size=P(12);
  const w=meas(ctx,lab,{size,w:"700"})+meas(ctx,"🪙"+price,{size:P(11.5),w:"800"})+P(40);
  const h=P(30);
  rr(ctx,x,y,w,h,P(10));ctx.fillStyle=C.panel2;ctx.fill();
  ctx.lineWidth=P(1);ctx.strokeStyle=o.on===false?C.line:hexA(C.gold,.55);ctx.stroke();
  if(o.glow){ctx.save();ctx.shadowColor=hexA(C.gold,.8);ctx.shadowBlur=P(10);ctx.lineWidth=P(1.6);
    ctx.strokeStyle=C.gold;rr(ctx,x,y,w,h,P(10));ctx.stroke();ctx.restore();}
  emoji(ctx,"💡",x+P(13),y+h/2,P(11));
  txt(ctx,lab,x+P(23),y+h/2,{size,w:"700",col:C.text,base:"middle"});
  txt(ctx,"🪙"+price,x+w-P(9),y+h/2,{size:P(11.5),w:"800",col:C.gold,align:"right",base:"middle"});
  return w;}

/** CategoryField — GameScreen'in kategori kartı, birebir yapı */
function catField(ctx,R,x,y,w,d){
  const headH=P(29),inH=P(70),hintH=d.hints?P(40):0,h=headH+inH+hintH;
  const g=d.grad;
  const trimmed=(d.val||"").trim();
  const valid=trimmed.length>=2;
  const border=d.err?C.rose:(d.focus?g[1]:(valid?hexA(C.mint,.55):C.line));
  ctx.save();
  if(d.focus){ctx.shadowColor=hexA(g[1],.35);ctx.shadowBlur=P(14);ctx.shadowOffsetY=P(4);}
  card(ctx,x,y,w,h,P(18),{stroke:border,lw:P(1.5)});
  ctx.restore();
  ctx.save();rr(ctx,x,y,w,headH+P(4),P(18));ctx.clip();
  ctx.fillStyle=hexA(g[0],.08);ctx.fillRect(x,y,w,headH);
  ctx.fillStyle=hexA(g[1],.16);ctx.fillRect(x,y+headH-P(1),w,P(1));ctx.restore();
  const bw=P(22);rr(ctx,x+P(12),y+P(7),bw,P(15),P(5));ctx.fillStyle=g[1];ctx.fill();
  txt(ctx,String(d.i).padStart(2,"0"),x+P(12)+bw/2,y+P(14.8),{size:P(10),w:"900",col:"#fff",align:"center",base:"middle"});
  txt(ctx,up(d.cat),x+P(40),y+P(15),{size:P(12),w:"800",col:C.text,base:"middle",ls:P(0.8)});
  const st=d.err?["HARF",C.rose]:valid?["✓ HAZIR",C.mint]:d.focus?["YAZIYORSUN",g[1]]:(trimmed.length===1?["KISA",C.warn]:null);
  if(st){const pw=meas(ctx,st[0],{size:P(10),w:"900"})+P(16);pill(ctx,x+w-P(12)-pw,y+P(7),st[0],st[1],{size:P(10),h:P(16),padX:P(8)});}
  const iy=y+headH;
  letterTile(ctx,x+P(12),iy+P(12),P(46),d.letter,g);
  const tx=x+P(70);
  if(trimmed.length){
    txt(ctx,d.val,tx,iy+P(38),{size:P(18),w:"700",col:C.text,base:"middle"});
    const cw=meas(ctx,d.val,{size:P(18),w:"700"});
    if(d.caret){rr(ctx,tx+cw+P(3),iy+P(24),P(2.4),P(26),P(1.2));ctx.fillStyle=g[1];ctx.fill();}
    const n=String(trimmed.length),nw=meas(ctx,n,{size:P(11),w:"800"})+P(14);
    rr(ctx,x+w-P(12)-nw,iy+P(26),nw,P(22),P(8));ctx.fillStyle=C.panel2;ctx.fill();
    txt(ctx,n,x+w-P(12)-nw/2,iy+P(37),{size:P(11),w:"800",col:C.dim,align:"center",base:"middle"});
  }else{
    txt(ctx,d.cat.toLocaleLowerCase("tr-TR")+"...",tx,iy+P(38),{size:P(18),w:"700",col:hexA(C.dim,.75),base:"middle"});
    if(d.caret){rr(ctx,tx-P(4),iy+P(24),P(2.4),P(26),P(1.2));ctx.fillStyle=g[1];ctx.fill();}
  }
  if(d.coinUsed){pill(ctx,tx,iy+P(54),"🪙 JETON KULLANILDI",C.gold,{size:P(8.5),h:P(15),padX:P(7)});}
  if(d.hints){
    const hy=iy+inH+P(4);
    ctx.fillStyle=hexA(C.line,.6);ctx.fillRect(x+P(12),hy-P(6),w-P(24),P(1));
    let hx=x+P(12);
    hx+=hintChip(ctx,hx,hy,"Harf Al",15,{glow:d.glow==="harf"})+P(8);
    hintChip(ctx,hx,hy,"Kelime Al",50,{glow:d.glow==="kelime"});
  }
  return h;}

/** Btn — birincil aksiyon */
function btn(ctx,x,y,w,title,kind,o){o=o||{};const h=o.h||P(48);
  const map={ok:C.mint,pri:C.violet,bot:C.bot,ghost:C.panel2};
  const bgc=map[kind]||C.violet;const fg=(kind==="ok")?"#03271a":(kind==="ghost"?C.text:"#fff");
  ctx.save();if(o.press){ctx.translate(x+w/2,y+h/2);ctx.scale(0.97,0.97);ctx.translate(-(x+w/2),-(y+h/2));}
  if(!o.dis){ctx.shadowColor=hexA(bgc,.45);ctx.shadowBlur=P(14);ctx.shadowOffsetY=P(4);}
  rr(ctx,x,y,w,h,P(12));ctx.fillStyle=o.dis?C.panel2:bgc;ctx.fill();ctx.restore();
  txt(ctx,title,x+w/2,y+h/2,{size:P(16),w:"800",col:o.dis?C.dim:fg,align:"center",base:"middle"});
  return h;}

/** Seçenek kutusu (Opt) */
function opt(ctx,x,y,w,h,d){
  card(ctx,x,y,w,h,P(12),{fill:d.on?hexA(C.bot,.14):C.panel,stroke:d.on?C.bot:C.line,lw:P(1.5)});
  if(d.big!==undefined){
    txt(ctx,d.big,x+w/2,y+h*0.38,{size:P(17),w:"900",col:d.on?C.bot:C.text,align:"center",base:"middle"});
    txt(ctx,d.title,x+w/2,y+h*0.72,{size:P(10.5),w:"700",col:d.on?C.text:C.dim,align:"center",base:"middle"});
  }else{
    txt(ctx,d.title,x+w/2,y+h*0.4,{size:P(14),w:"800",col:d.on?C.bot:C.text,align:"center",base:"middle"});
    if(d.desc)txt(ctx,d.desc,x+w/2,y+h*0.72,{size:P(10),w:"500",col:C.dim,align:"center",base:"middle"});
  }}

/** Bot kartı (lobi) */
function botCard(ctx,x,y,d){const w=P(96),h=P(112);
  card(ctx,x,y,w,h,P(16),{fill:hexA(C.bot,.09),stroke:hexA(C.bot,.42)});
  ctx.save();ctx.beginPath();ctx.arc(x+w/2,y+P(32),P(23),0,7);ctx.fillStyle=C.panel2;ctx.fill();
  ctx.lineWidth=P(2);ctx.strokeStyle=C.bot;ctx.stroke();ctx.restore();
  emoji(ctx,d.e,x+w/2,y+P(32),P(30));
  txt(ctx,d.n,x+w/2,y+P(66),{size:P(12.5),w:"700",col:C.text,align:"center",base:"middle"});
  const pw=meas(ctx,"BOT",{size:P(8),w:"900"})+P(14);
  pill(ctx,x+w/2-pw/2,y+P(74),"BOT",C.bot,{size:P(8),h:P(15),padX:P(7)});
  txt(ctx,"● hazır",x+w/2,y+P(99),{size:P(10.5),w:"700",col:C.mint,align:"center",base:"middle"});
  return {w,h};}

/** Ayar satırı */
function settingRow(ctx,x,y,w,k,v){
  txt(ctx,k,x,y,{size:P(12.5),w:"500",col:C.dim,base:"middle"});
  txt(ctx,v,x+w,y,{size:P(13),w:"700",col:C.text,align:"right",base:"middle"});}

/** Wordle karosu — renkler */
const W_ST={empty:["transparent",C.line,C.text],
  filled:["transparent","#5a5f8f",C.text],
  correct:["#37D399","#37D399","#06231a"],
  present:["#F0C24B","#F0C24B","#2a1f04"],
  absent:["#2A2F55","#2A2F55",hexA(C.text,.55)],
  hint:[hexA(C.gold,.18),C.gold,C.gold]};
function wTile(ctx,x,y,s,letter,st,flip){
  const c=W_ST[st]||W_ST.empty;
  const k=flip===undefined?1:Math.abs(Math.cos(Math.PI*clamp01(flip)));
  ctx.save();ctx.translate(x+s/2,y+s/2);ctx.scale(1,Math.max(.04,k));ctx.translate(-(x+s/2),-(y+s/2));
  rr(ctx,x,y,s,s,P(6));
  if(c[0]!=="transparent"){ctx.fillStyle=c[0];ctx.fill();}
  ctx.lineWidth=P(2);ctx.strokeStyle=c[1];ctx.stroke();
  if(letter)txt(ctx,letter,x+s/2,y+s/2,{size:s*0.52,w:"800",col:c[2],align:"center",base:"middle"});
  ctx.restore();}

/** Karo kelime — oyunun kendi malzemesiyle yazılan başlık */
function tileWord(ctx,cx,y,word,size,maxW){
  const letters=[...word];
  if(maxW){const k=maxW/(letters.length*size+(letters.length-1)*size*0.12);if(k<1)size*=k;}
  const gap=size*0.12;
  const total=letters.length*size+(letters.length-1)*gap;
  let x=cx-total/2;
  letters.forEach((ch,i)=>{letterTile(ctx,x,y+(i%2?size*0.03:0),size,ch,CATG[i%CATG.length]);x+=size+gap;});
  return size;}

/** SC.board'un gövdesi — tur/maç sonucu satırları. Döner: yeni y (alt). */
function boardRows(ctx,R,x,y,w,rows,grow){
  grow=grow===undefined?1:grow;
  const max=Math.max.apply(null,rows.map(r=>r.score))||1;
  rows.forEach(r=>{
    const h=P(64);
    card(ctx,x,y,w,h,P(16),{fill:r.me?hexA(C.violet,.12):C.panel,stroke:r.me?hexA(C.violet,.5):C.line});
    ctx.save();ctx.beginPath();ctx.arc(x+P(34),y+P(32),P(19),0,7);ctx.fillStyle=C.panel2;ctx.fill();
    ctx.lineWidth=P(2);ctx.strokeStyle=r.me?C.violet:C.bot;ctx.stroke();ctx.restore();
    emoji(ctx,r.e,x+P(34),y+P(32),P(24));
    txt(ctx,r.n,x+P(62),y+P(24),{size:P(15),w:"800",col:C.text,base:"middle"});
    if(r.bot)pill(ctx,x+P(62)+meas(ctx,r.n,{size:P(15),w:"800"})+P(8),y+P(16),"BOT",C.bot,{size:P(8),h:P(15),padX:P(6)});
    const bw=w-P(74)-P(70),bx=x+P(62);
    rr(ctx,bx,y+P(38),bw,P(8),P(4));ctx.fillStyle=C.panel2;ctx.fill();
    rr(ctx,bx,y+P(38),bw*(r.score/max)*grow,P(8),P(4));ctx.fillStyle=r.me?C.violet:C.bot;ctx.fill();
    txt(ctx,Math.round(r.score*grow),x+w-P(16),y+P(32),{size:P(22),w:"900",col:r.me?C.text:C.dim,align:"right",base:"middle"});
    y+=h+P(10);
  });
  return y;}

/* ══════════════════ yeni bileşenler (reklam-özel) ══════════════════ */

/** iOS kilit ekranı bildirimi — sol gerçek logo, "İSİM ŞEHİR", sağda saat. */
function notif(ctx,x,y,w,o){o=o||{};
  const pop=o.pop===undefined?1:o.pop;
  const bodyLines=wrapLines(ctx,o.body||"",{size:P(13),w:"600"},w-P(96));
  const h=P(60)+Math.max(0,bodyLines.length-1)*P(17);
  if(pop<=0)return h;
  const e=eOut(clamp01(pop));
  ctx.save();ctx.globalAlpha=clamp01(pop*2);ctx.translate(0,(1-e)*-P(14));
  card(ctx,x,y,w,h,P(20),{fill:hexA("#1c2044",.94),stroke:hexA(C.text,.14)});
  logo(ctx,x+P(30),y+P(30),P(34));
  txt(ctx,up(o.title||"İsim Şehir"),x+P(56),y+P(24),{size:P(11),w:"800",col:C.dim,ls:P(0.6)});
  txt(ctx,o.time||"şimdi",x+w-P(16),y+P(24),{size:P(11),w:"600",col:C.dim,align:"right"});
  bodyLines.forEach((ln,i)=>txt(ctx,ln,x+P(56),y+P(46)+i*P(17),{size:P(13),w:"600",col:C.text}));
  ctx.restore();
  return h;}

/** Bulanık koyu kilit ekranı zemini + saat/tarih. */
function lockScreen(ctx,R,o){o=o||{};
  bg(ctx,R);
  ctx.save();ctx.fillStyle=hexA("#000",.32);ctx.fillRect(0,0,R.W,R.H);ctx.restore();
  antonTxt(ctx,o.time||"21:04",R.W/2,P(210),P(118),hexA(C.text,.95),"center");
  txt(ctx,o.date||"Bugün",R.W/2,P(250),{size:P(20),w:"700",col:hexA(C.text,.72),align:"center"});}

/** WhatsApp benzeri sohbet balonu. Döner {h}. */
function chatBubble(ctx,x,y,maxW,o){o=o||{};
  const size=P(15);
  const ln=wrapLines(ctx,o.text||"",{size,w:"600"},maxW-P(48));
  const bw=Math.min(maxW,Math.max.apply(null,ln.map(l=>meas(ctx,l,{size,w:"600"})))+P(48));
  const nameH=(!o.me&&o.name)?P(20):0;
  const h=nameH+ln.length*P(22)+P(28);
  const bx=o.me?x-bw:x;
  rr(ctx,bx,y,bw,h,P(20));ctx.fillStyle=o.me?C.violet:C.panel2;ctx.fill();
  let ty=y+P(20);
  if(nameH){txt(ctx,o.name,bx+P(20),ty,{size:P(12),w:"800",col:C.sky});ty+=nameH;}
  ln.forEach((l,i)=>txt(ctx,l,bx+P(20),ty+i*P(22),{size,w:"600",col:"#fff"}));
  if(o.time)txt(ctx,o.time,bx+bw-P(14),y+h-P(10),{size:P(10),w:"600",col:hexA("#fff",.6),align:"right"});
  return {h};}

/** Sohbet başlığı — grup adı + alt satır. */
function chatHeader(ctx,R,o){o=o||{};
  const y0=P(54),h=P(70);
  card(ctx,0,y0,R.W,h,0,{fill:hexA(C.panel,.95),stroke:"transparent"});
  ctx.save();ctx.beginPath();ctx.arc(P(46),y0+h/2,P(22),0,7);ctx.fillStyle=C.panel2;ctx.fill();ctx.restore();
  emoji(ctx,"👨‍👩‍👧‍👦",P(46),y0+h/2,P(24));
  txt(ctx,o.name||"Grup",P(78),y0+h/2-P(9),{size:P(15),w:"800",col:C.text,base:"middle"});
  txt(ctx,o.sub||"",P(78),y0+h/2+P(11),{size:P(11.5),w:"600",col:C.dim,base:"middle"});
  ctx.fillStyle=C.line;ctx.fillRect(0,y0+h,R.W,P(1));
  return y0+h+P(1);}

/** Kırmızı yuvarlak DUR butonu. */
function durButton(ctx,cx,cy,r,o){o=o||{};
  const k=o.press?0.93:1;
  ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);
  ctx.shadowColor=hexA(C.rose,.55);ctx.shadowBlur=r*0.5;ctx.shadowOffsetY=r*0.12;
  ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fillStyle=C.rose;ctx.fill();
  ctx.restore();
  txt(ctx,"DUR",cx,cy,{size:r*0.42,w:"900",col:"#fff",align:"center",base:"middle"});}

/** Lastik damga — "+20 / SÖZLÜKTE / KABUL" gibi. */
function stamp(ctx,cx,cy,text,col,rot){
  ctx.save();ctx.translate(cx,cy);ctx.rotate(rot||-0.08);
  const size=P(15);
  const w=meas(ctx,up(text),{size,w:"900",ls:P(1)})+P(28),h=P(40);
  ctx.lineWidth=P(3);ctx.strokeStyle=col;
  rr(ctx,-w/2,-h/2,w,h,P(8));ctx.stroke();
  ctx.globalAlpha=.85;
  txt(ctx,up(text),0,0,{size,w:"900",col,align:"center",base:"middle",ls:P(1)});
  ctx.restore();}

/** Defter kağıdı — krem, mavi satır, kırmızı marj. */
function paperBg(ctx,x,y,w,h){
  ctx.save();
  ctx.fillStyle="#FBF3DD";ctx.fillRect(x,y,w,h);
  ctx.strokeStyle="rgba(60,90,200,.28)";ctx.lineWidth=1.4;
  for(let ly=y+40;ly<y+h;ly+=38){ctx.beginPath();ctx.moveTo(x,ly);ctx.lineTo(x+w,ly);ctx.stroke();}
  ctx.strokeStyle="rgba(220,50,50,.35)";ctx.lineWidth=2.2;
  ctx.beginPath();ctx.moveTo(x+w*0.12,y);ctx.lineTo(x+w*0.12,y+h);ctx.stroke();
  ctx.restore();}

/** Patrick Hand el yazısı — çok satırlı. */
function handText(ctx,s,x,y,size,col){
  ctx.save();ctx.fillStyle=col;ctx.font=HD(size);ctx.textAlign="left";ctx.textBaseline="alphabetic";
  String(s).split("\n").forEach((ln,i)=>ctx.fillText(ln,x,y+i*size*1.15));
  ctx.restore();}

/** Reklam kanca yazısı — dizi satır, o.font "inter"|"anton", o.accent:{line,col}. */
function hook(ctx,R,lines,o){o=o||{};
  const font=o.font||"inter";
  const size=o.size||P(56);
  const col=o.col||C.text;
  const align=o.align||"center";
  const x=align==="center"?R.W/2:(align==="right"?R.W-P(40):P(40));
  const y0=o.y!==undefined?o.y:P(320);
  const lh=size*1.02;
  lines.forEach((ln,i)=>{
    const c=(o.accent&&o.accent.line===i)?(o.accent.col||C.gold):col;
    if(font==="anton")antonTxt(ctx,ln,x,y0+i*lh,size,c,align);
    else txt(ctx,ln,x,y0+i*lh,{font:F("900",size),col:c,align});
  });
  return y0+(lines.length-1)*lh;}

/** Wordle karo ızgarası — rows: [[{l,s}]], flipRow/flipAt/lp ile satır çevirme. */
function wordleGrid(ctx,cx,y,size,gap,rows,o){o=o||{};
  const cols=Math.max.apply(null,rows.map(r=>r.length));
  const gw=cols*size+(cols-1)*gap,gx=cx-gw/2;
  rows.forEach((row,ri)=>{
    for(let i=0;i<cols;i++){
      const cell=row[i]||{};
      let flip;
      if(o.flipRow===ri){flip=clamp01(((o.lp===undefined?1:o.lp)-(o.flipAt||0.5)-i*0.05)/0.16);}
      wTile(ctx,gx+i*(size+gap),y,size,cell.l||"",flip!==undefined&&flip<0.5?"filled":(cell.s||"empty"),flip);
    }
    y+=size+gap;
  });
  return y;}

/** Popüler Cevap tablosu — sıra numaralı kapaklı satırlar. Sayı/yüzde YOK.
    rows: rank1'den rankN'e cevap dizisi. reveal: kaç satır açık (alttan/rankN'den başlar). */
function popBoard(ctx,x,y,w,rows,o){o=o||{};
  const reveal=o.reveal===undefined?rows.length:o.reveal;
  const n=rows.length,h=P(64);
  rows.forEach((ans,i)=>{
    const rank=i+1,open=(n-i)<=reveal;
    card(ctx,x,y,w,h,P(16));
    const bs=P(36);
    rr(ctx,x+P(14),y+(h-bs)/2,bs,bs,P(10));
    ctx.fillStyle=rank===1?C.gold:C.panel2;ctx.fill();
    txt(ctx,rank,x+P(14)+bs/2,y+h/2,{size:P(16),w:"900",col:rank===1?C.ink:C.dim,align:"center",base:"middle"});
    if(open)txt(ctx,up(ans),x+P(66),y+h/2,{size:P(19),w:"800",col:C.text,base:"middle"});
    else txt(ctx,"?????",x+P(66),y+h/2,{size:P(19),w:"800",col:hexA(C.dim,.6),base:"middle",ls:P(3)});
    y+=h+P(9);
  });
  return y;}

/** Speedrun sayacı — "0:09.84" mono. */
function stopwatch(ctx,x,y,ms){
  const s=Math.max(0,ms)/1000,m=Math.floor(s/60);
  const secs=(s-m*60).toFixed(2);
  const str=m+":"+(Number(secs)<10?"0":"")+secs;
  txt(ctx,str,x,y,{font:MONO("800",P(34)),col:C.mint,base:"middle"});
  return meas(ctx,str,{font:MONO("800",P(34))});}

/** Haneleri dönen sayaç — 10.000 gibi büyük rakamlar için karo dizisi. */
function odometer(ctx,cx,y,size,value){
  const s=Math.round(value).toLocaleString("tr-TR");
  const digits=[...s];
  const dw=size*0.62,gap=size*0.08;
  const total=digits.reduce((a,d)=>a+(/\D/.test(d)?dw*0.32:dw)+gap,-gap);
  let x=cx-total/2;
  digits.forEach(d=>{
    if(/\D/.test(d)){txt(ctx,d,x+dw*0.16,y,{size,w:"900",col:C.gold,align:"center",base:"middle"});x+=dw*0.32+gap;return;}
    rr(ctx,x,y-size*0.62,dw,size*1.12,size*0.14);
    ctx.fillStyle=C.panel2;ctx.fill();
    ctx.lineWidth=2;ctx.strokeStyle=hexA(C.gold,.4);ctx.stroke();
    txt(ctx,d,x+dw/2,y,{size:size*0.86,w:"900",col:C.gold,align:"center",base:"middle"});
    x+=dw+gap;
  });
  return total;}

/* ══════════════════ video motoru ══════════════════ */

/** Anlatım şeridinin ölçüsünü hesaplar — güvenli alan üstünde. */
function narrMetrics(ctx,R,d){if(!d)return null;
  const w=R.W-P(28),l1=d.big?P(30):P(23);
  const lines_=wrapLines(ctx,d.t1,{size:l1,w:"800"},w-P(40));
  const top=P(16),first=top+l1*0.86;
  const last=first+(lines_.length-1)*l1*1.2;
  const t2y=d.t2?last+P(28):null;
  const h=(d.t2?t2y+P(16):last+P(20));
  const baseline=R.H-SAFE.story.bottom-24;
  return {x:P(14),w,y:baseline-h,h,l1,lines:lines_,t2y,first,tone:d.tone||C.violet};}
/** Anlatım şeridini çizer — kart cevrimdisi-4.0 narrate ile aynı görünüm. */
function narrate(ctx,R,d,m){if(!d||!m)return;
  ctx.save();ctx.shadowColor="rgba(0,0,0,.6)";ctx.shadowBlur=P(26);ctx.shadowOffsetY=P(8);
  card(ctx,m.x,m.y,m.w,m.h,P(18),{fill:hexA(m.tone,.15),stroke:hexA(m.tone,.5)});ctx.restore();
  ctx.save();rr(ctx,m.x,m.y,P(5),m.h,P(2.5));ctx.fillStyle=m.tone;ctx.fill();ctx.restore();
  m.lines.forEach((ln,i)=>txt(ctx,ln,m.x+P(20),m.y+m.first+i*m.l1*1.2,{size:m.l1,w:"800",col:C.text}));
  if(d.t2)txt(ctx,d.t2,m.x+P(20),m.y+m.t2y,{size:P(13.5),w:"500",col:hexA(C.text,.74)});}

function progressLine(ctx,R,t){const W=R.W,y=R.H-P(5);
  ctx.fillStyle=hexA(C.text,.10);ctx.fillRect(0,y,W,P(3));
  ctx.fillStyle=C.violet;ctx.fillRect(0,y,W*clamp01(t/R.total),P(3));}

/** scenes(list) → draw(ctx,R,t). draw.total = toplam süre (ms). */
function scenes(list){
  list=list||[];
  const total=list.reduce((a,s)=>a+s.dur,0);
  function draw(ctx,R,t){
    bg(ctx,R);
    let acc=0,sc=null,lp=1;
    for(const s of list){if(t<acc+s.dur){sc=s;lp=(t-acc)/s.dur;break;}acc+=s.dur;}
    if(!sc){sc=list[list.length-1];lp=1;}
    if(!sc)return;
    const nm=narrMetrics(ctx,R,sc.say);
    R.bodyBottom=nm?nm.y-P(16):R.H-SAFE.story.bottom-40;
    const a=clamp01(Math.min(lp/0.06,(1-lp)/0.06,1));
    ctx.save();ctx.globalAlpha=0.25+0.75*a;
    if(sc.render)sc.render(ctx,R,lp,t);
    ctx.restore();
    narrate(ctx,R,sc.say,nm);
    progressLine(ctx,R,t);
  }
  draw.total=Math.max(1,total);
  draw.list=list;
  return draw;}

/** Hazır kapanış sahnesi — logo pop + "İsim Şehir Online" + o.items + adCTA. */
function ctaScene(o){o=o||{};
  const dur=o.dur||2600;
  return {dur,say:o.say,render(ctx,R,lp){
    const y0=P(90);
    const pop=eBack(clamp01(lp/0.4));
    ctx.save();ctx.translate(R.W/2,y0+P(64));ctx.scale(Math.max(.01,pop),Math.max(.01,pop));ctx.translate(-R.W/2,-(y0+P(64)));
    logo(ctx,R.W/2,y0+P(64),P(128),{glow:hexA(C.violet,.5)});
    ctx.restore();
    txt(ctx,"İsim Şehir Online",R.W/2,y0+P(172),{size:P(30),w:"900",col:C.text,align:"center",base:"middle"});
    const items=o.items||[];
    let y=y0+P(206);
    items.forEach((it,i)=>{
      const app=eOut(clamp01((lp-0.25-i*0.1)/0.35));
      ctx.save();ctx.globalAlpha=app;ctx.translate(0,(1-app)*P(16));
      txt(ctx,it,R.W/2,y,{size:P(17),w:"700",col:hexA(C.text,.85),align:"center"});
      ctx.restore();
      y+=P(34);
    });
    adCTA(ctx,R,{});
  }};}

/* ══════════════════ stüdyo (mount) ══════════════════ */
function qp(name){try{return new URLSearchParams(location.search).get(name);}catch(e){return null;}}
function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function gcd(a,b){return b?gcd(b,a%b):a;}
function ratioLabel(W,H){
  if(W===1080&&H===1920)return "9:16";
  if(W===1080&&H===1350)return "4:5";
  const g=gcd(W,H)||1;return (W/g)+":"+(H/g);}
function stageClass(W,H){return H>=W*1.3?"v":"i";}

/* ─── toast / modal — mount kendisi body'ye ekler ─── */
let _toastTimer=null,_chromeReady=false;
function ensureChrome(){
  if(_chromeReady)return;_chromeReady=true;
  if(!document.getElementById("toast")){
    const t=document.createElement("div");
    t.className="toast";t.id="toast";t.textContent="Hazır";
    document.body.appendChild(t);
  }
  if(!document.getElementById("modal")){
    const modal=document.createElement("div");
    modal.className="modal";modal.id="modal";
    modal.innerHTML=
      '<div class="sheet">'+
        '<button class="mclose" aria-label="Kapat">✕</button>'+
        '<div class="mtitle" id="mtitle">Hazır</div>'+
        '<div class="mmedia"><video id="resVid" controls playsinline muted loop></video><img id="resImg" alt="" /></div>'+
        '<div class="mbtns">'+
          '<a class="btn btn-pri" id="resDl" download>İndir</a>'+
          '<button class="btn btn-gif" id="resShare">Paylaş / Kaydet</button>'+
        '</div>'+
        '<p class="mhint" id="mhint"></p>'+
      '</div>';
    document.body.appendChild(modal);
    modal.querySelector(".mclose").onclick=closeModal;
    modal.addEventListener("click",e=>{if(e.target===modal)closeModal();});
    document.getElementById("resShare").onclick=shareResult;
    document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});
  }
}
function toast(m){ensureChrome();const el=document.getElementById("toast");
  el.textContent=m;el.classList.add("show");clearTimeout(_toastTimer);
  _toastTimer=setTimeout(()=>el.classList.remove("show"),2200);}
function closeModal(){const m=document.getElementById("modal");if(m)m.classList.remove("show");
  const v=document.getElementById("resVid");if(v)try{v.pause();}catch(e){}}
let curFile=null,curUrl=null;
function showResult(blob,ext,id,filePrefix,kind){
  ensureChrome();
  if(curUrl)URL.revokeObjectURL(curUrl);curUrl=URL.createObjectURL(blob);
  const fname=(filePrefix||"isimsehir-reklam")+"-"+id+"."+ext;
  try{curFile=new File([blob],fname,{type:blob.type});}catch(e){curFile=null;}
  const vid=document.getElementById("resVid"),img=document.getElementById("resImg");
  if(kind==="video"){vid.src=curUrl;vid.style.display="block";img.style.display="none";vid.play().catch(()=>{});}
  else{img.src=curUrl;img.style.display="block";vid.style.display="none";
    try{vid.pause();vid.removeAttribute("src");vid.load();}catch(e){}}
  const a=document.getElementById("resDl");a.href=curUrl;a.download=fname;
  document.getElementById("mtitle").textContent=ext.toUpperCase()+" hazır";
  const canShare=!!(curFile&&navigator.canShare&&navigator.canShare({files:[curFile]}));
  document.getElementById("resShare").style.display=canShare?"inline-flex":"none";
  document.getElementById("mhint").textContent=canShare
    ? 'iPhone: "Paylaş / Kaydet" → Fotoğraflar. Bilgisayar: "İndir".'
    : 'İndir\'e bas. Açılmazsa dosyayı tarayıcıya sürükle.';
  document.getElementById("modal").classList.add("show");
  toast(ext.toUpperCase()+" hazır");}
async function shareResult(){
  if(!curFile){toast("Paylaşım desteklenmiyor — İndir'i kullan");return;}
  try{await navigator.share({files:[curFile],title:curFile.name});}
  catch(e){if(e&&e.name!=="AbortError")toast("Paylaşım başarısız — İndir'i dene");}}
function directDownload(blob,filename){
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download=filename;
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),4000);}

/* ─── render hata bandı ─── */
function renderSafe(cardEl,fn,id){
  try{fn();}
  catch(e){
    console.error("render hatası #"+id,e);
    const band=document.createElement("div");
    band.className="err";
    band.style.cssText="width:100%;background:#FF5C7A;color:#2a0d16;font-weight:800;font-size:11.5px;padding:6px 10px;border-radius:8px;text-align:center";
    band.textContent="Hata: "+id+" — "+(e&&e.message?e.message:e);
    cardEl.insertBefore(band,cardEl.firstChild);
  }}

/* ─── kart kurucular ─── */
function buildImageCard(item,filePrefix,safeMode){
  const W=item.W||1080,H=item.H||1350;
  const sc=stageClass(W,H);
  const cardEl=document.createElement("div");
  cardEl.className="card gcard";
  cardEl.dataset.id=item.id;
  cardEl.innerHTML=
    '<div class="kind '+sc+'">'+ratioLabel(W,H)+' · '+W+'×'+H+'</div>'+
    '<div class="stage '+sc+'"><canvas id="rk-'+item.id+'" width="'+W+'" height="'+H+'"></canvas></div>'+
    '<div class="rtitle">'+esc(item.title||"")+'<small>'+esc(item.sub||"")+'</small></div>'+
    '<textarea class="cap" id="rkcap-'+item.id+'">'+esc((item.caption||"")+"\n\n"+(item.tags||""))+'</textarea>'+
    '<div class="btns">'+
      '<button class="btn btn-img" data-act="png">PNG indir</button>'+
      '<button class="btn btn-ghost" data-act="copy">Metni kopyala</button>'+
    '</div>';
  const canvas=cardEl.querySelector("canvas");
  const ctx=canvas.getContext("2d");
  const R={W,H,ctx,canvas,story:H===1920};
  renderSafe(cardEl,()=>{item.render(ctx,R);if(safeMode)safeGuide(ctx,R);},item.id);
  cardEl.querySelector('[data-act="png"]').onclick=()=>{
    try{
      item.render(ctx,R);
      canvas.toBlob(b=>{if(!b){toast("PNG üretilemedi");return;}showResult(b,"png",item.id,filePrefix,"image");},"image/png");
      if(qp("safe")==="1")safeGuide(ctx,R);
    }catch(e){console.error(e);toast("Görsel hatası");}
  };
  cardEl.querySelector('[data-act="copy"]').onclick=()=>copyCaption(cardEl,item.id);
  return cardEl;}

function copyCaption(cardEl,id){
  const ta=cardEl.querySelector("#rkcap-"+id);
  const text=ta?ta.value.trim():"";
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(()=>toast("Metin kopyalandı"),()=>toast("Kopyalanamadı — elle seç"));
  }else{toast("Kopyalanamadı — elle seç");}}

function buildCarouselCard(item,filePrefix,safeMode){
  const W=item.W||1080,H=item.H||1350;
  const slides=item.slides||[];
  const sc=stageClass(W,H);
  const cardEl=document.createElement("div");
  cardEl.className="card gcard";
  cardEl.dataset.id=item.id;
  const stripId="rkstrip-"+item.id;
  cardEl.innerHTML=
    '<div class="kind i">Carousel · '+slides.length+' slayt</div>'+
    '<div class="stage '+sc+'" style="padding:0">'+
      '<div id="'+stripId+'" style="display:flex;overflow-x:auto;scroll-snap-type:x mandatory;width:100%;height:100%;-webkit-overflow-scrolling:touch"></div>'+
    '</div>'+
    '<div class="rtitle">'+esc(item.title||"")+'<small>'+esc(item.sub||"")+'</small></div>'+
    '<textarea class="cap" id="rkcap-'+item.id+'">'+esc((item.caption||"")+"\n\n"+(item.tags||""))+'</textarea>'+
    '<div class="btns" id="rkslidebtns-'+item.id+'"></div>'+
    '<div class="btns">'+
      '<button class="btn btn-pri" data-act="all">Hepsini indir</button>'+
      '<button class="btn btn-ghost" data-act="copy">Metni kopyala</button>'+
    '</div>';
  const strip=cardEl.querySelector("#"+stripId);
  const canvases=[];
  slides.forEach((sl,i)=>{
    const cv=document.createElement("canvas");
    cv.width=W;cv.height=H;
    cv.style.cssText="width:100%;height:100%;flex:0 0 100%;scroll-snap-align:start;display:block";
    strip.appendChild(cv);canvases.push(cv);
    const ctx=cv.getContext("2d");
    const R={W,H,ctx,canvas:cv,story:H===1920,slide:i+1,slides:slides.length};
    renderSafe(cardEl,()=>{sl.render(ctx,R);if(safeMode)safeGuide(ctx,R);},item.id+"-"+(i+1));
  });
  const btnRow=cardEl.querySelector("#rkslidebtns-"+item.id);
  slides.forEach((sl,i)=>{
    const b=document.createElement("button");
    b.className="btn btn-img";b.textContent="Slayt "+(i+1)+" indir";
    b.onclick=()=>{
      const cv=canvases[i],ctx=cv.getContext("2d");
      const R={W,H,ctx,canvas:cv,story:H===1920,slide:i+1,slides:slides.length};
      try{
        sl.render(ctx,R);
        cv.toBlob(bl=>{if(!bl){toast("PNG üretilemedi");return;}showResult(bl,"png",item.id+"-"+(i+1),filePrefix,"image");},"image/png");
        if(qp("safe")==="1")safeGuide(ctx,R);
      }catch(e){console.error(e);toast("Slayt hatası");}
    };
    btnRow.appendChild(b);
  });
  cardEl.querySelector('[data-act="all"]').onclick=()=>exportAllSlides(item,canvases,slides,W,H,filePrefix);
  cardEl.querySelector('[data-act="copy"]').onclick=()=>copyCaption(cardEl,item.id);
  return cardEl;}

async function exportAllSlides(item,canvases,slides,W,H,filePrefix){
  toast("Tüm slaytlar indiriliyor…");
  for(let i=0;i<canvases.length;i++){
    const cv=canvases[i],ctx=cv.getContext("2d");
    const R={W,H,ctx,canvas:cv,story:H===1920,slide:i+1,slides:slides.length};
    try{
      slides[i].render(ctx,R);
      cv.toBlob(b=>{if(b)directDownload(b,(filePrefix||"isimsehir-reklam")+"-"+item.id+"-slayt"+(i+1)+".png");},"image/png");
      if(qp("safe")==="1")safeGuide(ctx,R);
    }catch(e){console.error(e);}
    await new Promise(r=>setTimeout(r,350));
  }
  toast("Hepsi indirildi");}

const _videoRegistry=[];
let _loopStarted=false;
function startVideoLoop(){
  if(_loopStarted)return;_loopStarted=true;
  function loop(now){
    _videoRegistry.forEach(rec=>{
      if((rec.visible||rec.active)&&!rec.encoding){
        try{
          const t=(now-rec.base)%rec.R.total;
          rec.draw(rec.R.ctx,rec.R,t);
          if(rec.safeMode)safeGuide(rec.R.ctx,rec.R);
        }catch(e){console.error("kare hatası #"+rec.R.id,e);}
      }
    });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);}

function buildVideoCard(item,filePrefix,safeMode){
  const W=item.W||1080,H=item.H||1920;
  const cardEl=document.createElement("div");
  cardEl.className="card gcard";
  cardEl.dataset.id=item.id;
  cardEl.innerHTML=
    '<div class="kind v">Video · 9:16</div>'+
    '<div class="stage v">'+
      '<canvas id="rk-'+item.id+'" width="'+W+'" height="'+H+'"></canvas>'+
      '<button class="play" data-act="restart" title="Baştan oynat"><span>▶</span></button>'+
    '</div>'+
    '<div class="rtitle">'+esc(item.title||"")+'<small>'+esc(item.sub||"")+'</small></div>'+
    '<textarea class="cap" id="rkcap-'+item.id+'">'+esc((item.caption||"")+"\n\n"+(item.tags||""))+'</textarea>'+
    '<div class="btns">'+
      '<button class="btn btn-pri" data-act="mp4">Video indir</button>'+
      '<button class="btn btn-gif" data-act="gif">GIF</button>'+
      '<button class="btn btn-ghost" data-act="copy">Metni kopyala</button>'+
    '</div>';
  const canvas=cardEl.querySelector("canvas");
  const ctx=canvas.getContext("2d");
  const draw=scenes(item.scenes||[]);
  const R={W,H,ctx,canvas,story:true,total:draw.total,id:item.id};
  const rec={R,draw,visible:true,active:false,encoding:false,base:performance.now(),safeMode};
  renderSafe(cardEl,()=>{draw(ctx,R,Math.min(1400,R.total*0.25));if(safeMode)safeGuide(ctx,R);},item.id);
  _videoRegistry.push(rec);
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.target===canvas)rec.visible=e.isIntersecting;}),{threshold:.2});
  io.observe(canvas);
  cardEl.querySelector('[data-act="restart"]').onclick=()=>{rec.base=performance.now();rec.visible=true;};
  cardEl.querySelector('[data-act="mp4"]').onclick=()=>exportVideoItem(item,rec,filePrefix);
  cardEl.querySelector('[data-act="gif"]').onclick=()=>exportGifItem(item,rec,filePrefix);
  cardEl.querySelector('[data-act="copy"]').onclick=()=>copyCaption(cardEl,item.id);
  return cardEl;}

async function pickAvc(W,H){
  const c=["avc1.640028","avc1.4d0028","avc1.420028","avc1.640032","avc1.42e028"];
  for(const cc of c){try{const s=await VideoEncoder.isConfigSupported({codec:cc,width:W,height:H,bitrate:8e6,framerate:30});
    if(s&&s.supported)return cc;}catch(e){}}
  return null;}
async function encodeMP4(rec){
  if(!("VideoEncoder" in window)||!("VideoFrame" in window)||!window.Mp4Muxer)return null;
  const R=rec.R,draw=rec.draw;
  const W=R.W,H=R.H,codec=await pickAvc(W,H);if(!codec)return null;
  const fps=30,frames=Math.max(1,Math.round(R.total/1000*fps));
  const target=new Mp4Muxer.ArrayBufferTarget();
  const muxer=new Mp4Muxer.Muxer({target,video:{codec:"avc",width:W,height:H},fastStart:"in-memory"});
  let err=null;
  const enc=new VideoEncoder({output:(c,m)=>muxer.addVideoChunk(c,m),error:e=>{err=e;console.error("enc",e);}});
  enc.configure({codec,width:W,height:H,bitrate:8000000,framerate:fps});
  rec.encoding=true;
  try{
    for(let i=0;i<frames;i++){
      if(err)break;
      draw(R.ctx,R,i/frames*R.total);
      const vf=new VideoFrame(R.canvas,{timestamp:Math.round(i*1e6/fps),duration:Math.round(1e6/fps)});
      enc.encode(vf,{keyFrame:i%fps===0});vf.close();
      if(i%14===0)toast("MP4 üretiliyor… %"+Math.round(i/frames*100));
      if(enc.encodeQueueSize>6)await new Promise(r=>setTimeout(r));
    }
    await enc.flush();muxer.finalize();
  }finally{rec.encoding=false;try{enc.close();}catch(e){}}
  if(err)return null;
  return new Blob([target.buffer],{type:"video/mp4"});}
function pickMime(){
  const c=["video/mp4;codecs=h264","video/mp4","video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"];
  for(const m of c){try{if(window.MediaRecorder&&MediaRecorder.isTypeSupported(m))return m;}catch(e){}}
  return "";}
function recordWebM(rec){
  return new Promise(res=>{
    const mime=pickMime();if(!mime||!window.MediaRecorder)return res(null);
    let stream;try{stream=rec.R.canvas.captureStream(30);}catch(e){return res(null);}
    let mr;try{mr=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:9000000});}catch(e){return res(null);}
    const chunks=[];mr.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data);};
    mr.onstop=()=>{rec.active=false;res({blob:new Blob(chunks,{type:mime}),ext:mime.indexOf("mp4")>-1?"mp4":"webm"});};
    rec.active=true;rec.base=performance.now();mr.start();
    setTimeout(()=>{try{mr.stop();}catch(e){rec.active=false;res(null);}},rec.R.total+150);
  });}
async function exportVideoItem(item,rec,filePrefix){
  toast("Video hazırlanıyor (MP4)…");
  try{const blob=await encodeMP4(rec);if(blob){showResult(blob,"mp4",item.id,filePrefix,"video");return;}}catch(e){console.error(e);}
  toast("MP4 motoru yok — WebM deneniyor");
  try{const r=await recordWebM(rec);if(r&&r.blob.size>0){showResult(r.blob,r.ext,item.id,filePrefix,"video");return;}}catch(e){console.error(e);}
  toast("Bu cihaz video üretemiyor — GIF'i kullan");}
async function exportGifItem(item,rec,filePrefix){
  if(typeof GIF==="undefined"){toast("GIF motoru yüklenemedi — http üzerinden aç");return;}
  const R=rec.R,draw=rec.draw;
  const fps=12,frames=Math.max(8,Math.round(R.total/1000*fps)),gw=540,gh=960;
  const tmp=document.createElement("canvas");tmp.width=gw;tmp.height=gh;const tctx=tmp.getContext("2d");
  toast("GIF hazırlanıyor… "+frames+" kare");rec.encoding=true;
  try{
    const gif=new GIF({workers:2,quality:12,width:gw,height:gh,workerScript:"gif.worker.js",background:C.ink});
    for(let i=0;i<frames;i++){draw(R.ctx,R,i/frames*R.total);tctx.drawImage(R.canvas,0,0,gw,gh);gif.addFrame(tctx,{copy:true,delay:Math.round(1000/fps)});}
    gif.on("finished",b=>{rec.encoding=false;showResult(b,"gif",item.id,filePrefix,"image");});
    gif.on("abort",()=>{rec.encoding=false;toast("GIF iptal");});
    gif.render();
  }catch(e){rec.encoding=false;console.error(e);toast("GIF başarısız (http üzerinden dene)");}}

/* ─── ?solo=<id> / ?solo=<id>-<slaytNo> — tek kare, gerçek piksel ─── */
function renderSolo(param,ITEMS,safeMode){
  let item=ITEMS.find(it=>String(it.id)===param);
  let slideIdx=null;
  if(!item){
    const m=/^(.*)-(\d+)$/.exec(param);
    if(m){
      const base=ITEMS.find(it=>String(it.id)===m[1]);
      if(base&&base.kind==="carousel"){item=base;slideIdx=parseInt(m[2],10)-1;}
    }
  }
  if(!item)return false;
  document.body.innerHTML="";
  document.body.style.cssText="margin:0;padding:0;background:#000";
  const W=item.W||1080,H=item.H||(item.kind==="video"?1920:1350);
  const cv=document.createElement("canvas");
  cv.width=W;cv.height=H;
  cv.style.cssText="display:block;width:"+W+"px;height:"+H+"px";
  document.body.appendChild(cv);
  const ctx=cv.getContext("2d");
  const R={W,H,ctx,canvas:cv,story:H>=1900};
  try{
    if(item.kind==="carousel"){
      const idx=slideIdx===null?0:slideIdx;
      const sl=(item.slides||[])[idx];
      if(sl){R.slide=idx+1;R.slides=item.slides.length;sl.render(ctx,R);}
    }else if(item.kind==="video"){
      const draw=scenes(item.scenes||[]);
      R.total=draw.total;
      draw(ctx,R,Math.min(1400,draw.total*0.25));
    }else if(item.render){
      item.render(ctx,R);
    }
    if(safeMode)safeGuide(ctx,R);
  }catch(e){console.error("solo render hatası",e);}
  return true;}

/* ─── facts / links ─── */
function fillFacts(facts){
  const el=document.getElementById("facts");if(!el)return;
  el.innerHTML=facts.map(f=>'<div class="fact"><b>'+esc(f.b||f.title||"")+'</b><span>'+(f.t||f.text||"")+'</span></div>').join("");}
function fillLinks(links){
  const el=document.getElementById("links");if(!el)return;
  el.innerHTML="Diğer stüdyolar → "+links.map(l=>'<a href="'+esc(l.href)+'">'+esc(l.label)+'</a>').join(" · ");}

/* ─── fontlar + logo hazır olmadan çizme ─── */
function waitReady(){
  const fontSpecs=["500 30px Inter","600 30px Inter","700 30px Inter","800 30px Inter","900 30px Inter",
    "400 60px Anton","700 40px Caveat","400 40px 'Patrick Hand'"];
  let fp=Promise.resolve();
  if(document.fonts&&document.fonts.ready){
    fp=Promise.all(fontSpecs.map(f=>{try{return document.fonts.load(f);}catch(e){return Promise.resolve();}}))
      .then(()=>document.fonts.ready).catch(()=>{});
  }
  return Promise.all([fp,logoReady()]);}

/** Stüdyo kurucusu — kart ızgarasını basar, chrome'u (toast/modal) ekler. */
function mount(cfg){
  cfg=cfg||{};
  const ITEMS=cfg.ITEMS||[];
  const filePrefix=cfg.filePrefix||"isimsehir-reklam";
  const safeMode=qp("safe")==="1";
  const soloParam=qp("solo");
  waitReady().then(()=>{
    const hl=document.getElementById("hlogo");
    if(hl){try{if(typeof LOGO_DATA!=="undefined")hl.src=LOGO_DATA;}catch(e){}}
    if(soloParam){renderSolo(soloParam,ITEMS,safeMode);return;}
    ensureChrome();
    if(cfg.facts)fillFacts(cfg.facts);
    if(cfg.links)fillLinks(cfg.links);
    const grid=document.getElementById("grid");
    if(!grid){console.error("RK.mount: #grid bulunamadı");return;}
    grid.innerHTML="";
    ITEMS.forEach(item=>{
      const k=item.kind||cfg.kind;
      try{
        let el;
        if(k==="carousel")el=buildCarouselCard(item,filePrefix,safeMode);
        else if(k==="video")el=buildVideoCard(item,filePrefix,safeMode);
        else el=buildImageCard(item,filePrefix,safeMode);
        grid.appendChild(el);
      }catch(e){
        console.error("kart oluşturma hatası #"+item.id,e);
        const band=document.createElement("div");
        band.className="card err";
        band.style.cssText="border:1.5px solid #FF5C7A;background:#2a0d16;color:#ffb3c2;padding:16px;border-radius:16px;font-weight:700;font-size:13px";
        band.textContent="Hata: "+item.id+" render edilemedi — "+(e&&e.message?e.message:e);
        grid.appendChild(band);
      }
    });
    startVideoLoop();
  });}

/* ══════════════════ dışa aktarım ══════════════════ */
window.RK={
  /* sabitler */
  C,L,CATG,LEVELS,CATS,HANDLE,APP_URL,PLAY_URL,SAFE,
  /* ölçek */
  P,setScale,resetScale,setScaleForHeight,
  /* yardımcılar */
  clamp01,inv,eOut,eBack,eInOut,hexA,shade,seeded,rr,F,AN,CV,HD,MONO,EF,
  txt,meas,wrapLines,txtWrap,emoji,up,antonTxt,
  /* marka */
  logo,igIcon,glyph,APPLE_D,PLAY_D,X_D,TT_D,socials,storeBadges,colophon,adCTA,safeGuide,
  /* uygulama bileşenleri */
  bg,card,label,pill,coinPill,statusBar,screenHead,playerStrip,letterTile,hintChip,catField,
  btn,opt,botCard,settingRow,wTile,W_ST,tileWord,boardRows,
  /* yeni bileşenler */
  notif,lockScreen,chatBubble,chatHeader,durButton,stamp,paperBg,handText,hook,
  wordleGrid,popBoard,stopwatch,odometer,
  /* video motoru */
  scenes,narrate,narrMetrics,ctaScene,progressLine,
  /* stüdyo */
  mount,
};
})();
