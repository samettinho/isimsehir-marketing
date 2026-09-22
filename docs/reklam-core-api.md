# reklam-core.js — `window.RK` API

Bu dosya `reklam-core.js`'in yaydığı gerçek imzaları listeler (kaynak: `window.RK={...}`).
Story/Post/Carousel/Video sayfaları **yalnızca bu dokümana** bakarak kodlanabilir — core'un
içine girmeye gerek yok. Sayfa CSS'i buradan gelmez: her sayfa `cevrimdisi-4.0.html`'in
stüdyo CSS'ini (`.wrap/.header/.facts/.links/.grid/.card/.stage/.btn*/.toast/.modal`) kendi
`<style>`'ında taşır — bkz. `docs/reklam-page-skeleton.html`.

Yükleme sırası: `logo.js` → `gif.js` → `mp4-muxer.min.js` → `reklam-core.js` → sayfanın kendi
`<script>`'i (`ITEMS` + `RK.mount({...})`).

---

## Sabitler

- `RK.C` — uygulama paleti: `{ink,panel,panel2,line,text,dim,violet,violetLo,sky,mint,gold,rose,warn,bot}`.
- `RK.L` — logo/künye paleti: `{deep,navy,navy2,line,gold,goldHi,gold2,cream,text,dim,sky,purple,red,mint}`.
- `RK.CATG` — kategori karo gradyan çiftleri, dizi: `[["#9D7CFF","#6C4CFF"], ...]` (6 çift).
- `RK.LEVELS` — bot zorluk merdiveni: `[{n,label,desc,fill}, ...]` (5 öğe, Çaylak→Usta).
- `RK.CATS` — `["İsim","Şehir","Hayvan","Bitki","Eşya","Ünlü"]`.
- `RK.HANDLE` — `"@isimsehironline"` (baştaki `@` dahil).
- `RK.APP_URL` — App Store bağlantısı.
- `RK.PLAY_URL` — Google Play bağlantısı.
- `RK.SAFE` — `{story:{top:250,bottom:340}}` (ham piksel, Story/Video 1080×1920 için).

## Ölçek

- `RK.P(v)` → `number`. `v` uygulama puntosunu geçerli `S` çarpanıyla (başlangıç `2.77`) piksele çevirir.
- `RK.setScale(s)` → `S`'yi doğrudan `s` yapar.
- `RK.resetScale()` → `S`'yi `2.77`'ye döndürür.
- `RK.setScaleForHeight(hv)` → içerik yüksekliği `hv` pt ise `1350px`'i aşmayacak `S`'yi seçer (`min(2.77, 1350/hv)`), poster/carousel gibi sabit-yükseklik kompozisyonlar için.

## Yardımcılar

- `RK.clamp01(t)` → `t`'yi `[0,1]`'e kelepçeler.
- `RK.inv(lp,s,l)` → `clamp01((lp-s)/l)` (bir alt-aralığın ilerleme oranı).
- `RK.eOut(t)` → kübik ease-out.
- `RK.eBack(t)` → hafif taşmalı (overshoot) ease.
- `RK.eInOut(t)` → kübik ease-in-out.
- `RK.hexA(hex,a)` → `"rgba(r,g,b,a)"` string'i döndürür (`hex` `#fff`/`#ffffff` biçiminde).
- `RK.shade(hex,amt)` → `hex`'i `amt` (-255..255) kadar aydınlatıp/karartıp `"rgb(...)"` döndürür.
- `RK.seeded(n)` → `n`'den deterministik `[0,1)` pseudo-random sayı.
- `RK.rr(ctx,x,y,w,h,r)` → yuvarlak köşeli dikdörtgen path'i açar (`ctx.beginPath()` içerir, `fill()/stroke()` çağrısı yapılmaz).
- `RK.F(w,size)` → `` "`${w} ${size}px Inter, -apple-system, system-ui, sans-serif`" `` (Inter font string'i).
- `RK.AN(size)` → Anton font string'i (`400 weight`).
- `RK.CV(size)` → Caveat font string'i (`700 weight`).
- `RK.HD(size)` → Patrick Hand font string'i.
- `RK.MONO(w,size)` → mono font string'i (`ui-monospace, Menlo, 'SF Mono', Consolas, monospace`).
- `RK.EF(size)` → emoji font string'i.
- `RK.txt(ctx,s,x,y,o)` → metin çizer. `o:{font,w,size,col,align,base,ls,shadow,shadowBlur,shadowY}` (hepsi opsiyonel; `font` verilmezse `RK.F(o.w||"700",o.size||30)`).
- `RK.meas(ctx,s,o)` → `number`, `s`'nin `o` ayarlarıyla genişliği (`ctx.measureText`).
- `RK.wrapLines(ctx,s,o,maxW)` → `string[]`, `s`'yi `maxW` genişliğe göre satırlara böler.
- `RK.txtWrap(ctx,s,x,y,o,maxW,lh)` → `number` (çizilen satır sayısı). `wrapLines`+`txt`'i birleştirir; `lh` verilmezse `(o.size||30)*1.2`.
- `RK.emoji(ctx,e,cx,cy,size)` → emoji'yi merkezi `(cx,cy)`'de `size` boyutunda çizer.
- `RK.up(s)` → `s.toLocaleUpperCase("tr-TR")` (Türkçe büyük harf, İ/I doğru).
- `RK.antonTxt(ctx,s,x,y,size,fill,align)` → `number` (metin genişliği). Anton'da "İ" glifi yok — harf harf "I" çizip İ için ayrı bir nokta dikdörtgeni ekler. `align:"left"|"center"|"right"`.

## Marka

- `RK.logo(ctx,cx,cy,size,o)` → gerçek logo görselini `(cx,cy)` merkezli `size×size` çizer (`o.glow` verilirse renkli parıltı, yoksa siyah gölge). Logo yüklenmemişse hiçbir şey çizmez.
- `RK.igIcon(ctx,cx,cy,s,col)` → Instagram ikonunu çizimle üretir (kare + halka + nokta).
- `RK.glyph(ctx,d,vb,cx,cy,size,col)` → bir SVG path (`d`, `viewBox` kare kenarı `vb`) glifini `(cx,cy)` merkezli `size` boyutunda çizer.
- `RK.APPLE_D`, `RK.PLAY_D`, `RK.X_D`, `RK.TT_D` → `RK.glyph`'e verilecek path string'leri (Apple/Google Play/X/TikTok).
- `RK.socials(ctx,cx,y,col,s)` → ig + X + TikTok ikonları + `RK.HANDLE` metnini `y` yüksekliğinde ortalı çizer (`s` ≈ ikon boyutu).
- `RK.storeBadges(ctx,cx,y,o)` → App Store + Google Play rozetlerini yan yana çizer. `o:{h,fill,stroke,col}`.
- `RK.colophon(ctx,R,y,o)` → `number` (toplam yükseklik, `186`). Logo + "İsim Şehir Online" + `socials` + `storeBadges`'i `y`'den başlayarak çizer. `o:{col,dim,chipFill,chipStroke}`.
- `RK.adCTA(ctx,R,o)` → `number` (kullanılan yükseklik). Reklam kapanışı: büyük "Ücretsiz indir" butonu (mint zemin) + rozetler + `RK.HANDLE`. `o.y` verilmezse `R.H - safeBottom - 250`'de (Story/Video için `safeBottom=340`, diğerlerinde `40`). `o.compact:true` → buton + rozetler tek satırda (post/carousel için).
- `RK.safeGuide(ctx,R)` → yalnızca `R.H>=1900` (Story/Video) iken üst 250px / alt 340px güvenli alanı kırmızı taralı + sınır çizgili çizer. Yalnızca önizleme; `RK.mount` bunu yalnız `?safe=1` sorgu parametresi varken çağırır, export dosyasına girmez.

## Uygulama bileşenleri (cevrimdisi-4.0.html'den birebir taşındı)

- `RK.bg(ctx,R)` → ink zemin + violet radyal gradyan (`R:{W,H}`).
- `RK.card(ctx,x,y,w,h,r,o)` → panel kartı (`fill`/`stroke`/`lw`, varsayılan `C.panel`/`C.line`/`1.5pt`).
- `RK.label(ctx,s,x,y,col)` → 11pt/800/ls 1/UPPERCASE etiket (`col` varsayılan `C.dim`).
- `RK.pill(ctx,x,y,s,tone,o)` → `number` (hap genişliği). `tone` renkli kenarlı/dolgulu hap metni.
- `RK.coinPill(ctx,rightX,y,n,o)` → `{x,w,h}`. Sağa hizalı 🪙 bakiye hapı; `rightX` hapın sağ kenarı.
- `RK.statusBar(ctx,R,st)` → `number` (yükseklik, `54*S`). iOS durum çubuğu; `st:{time,sig(0-4),plane,batt}`.
- `RK.screenHead(ctx,R,o)` → `number` (alt sınır y). Ekran başlığı: eyebrow + başlık + sağda jeton hapı / ÇEVRİMDIŞI rozeti / geri sayım. `o:{eyebrow,eyebrowCol,title,offline,coins,timer}`.
- `RK.playerStrip(ctx,R,y,players)` → `number` (alt y). Oyuncu kartları şeridi; `players:[{e,n,fill(0-1),me,bot}]`.
- `RK.letterTile(ctx,x,y,size,letter,grad)` → gradyanlı harf karosu (`grad:[c1,c2]`, örn. `RK.CATG[i]`).
- `RK.hintChip(ctx,x,y,lab,price,o)` → `number` (genişlik). "💡 Harf Al · 🪙15" ipucu çipi; `o:{on,glow}`.
- `RK.catField(ctx,R,x,y,w,d)` → `number` (yükseklik). Kategori kartı (harf karosu + giriş alanı + opsiyonel ipucu satırı). `d:{i,cat,letter,val,grad,focus,caret,err,coinUsed,hints}`.
- `RK.btn(ctx,x,y,w,title,kind,o)` → `number` (yükseklik). `kind:"ok"|"pri"|"bot"|"ghost"`; `o:{h,dis,press}`.
- `RK.opt(ctx,x,y,w,h,d)` → seçenek kutusu; `d:{title,desc,big,on}`.
- `RK.botCard(ctx,x,y,d)` → `{w,h}`. Lobi bot kartı; `d:{e,n}`.
- `RK.settingRow(ctx,x,y,w,k,v)` → ayar satırı (sol etiket `k`, sağ değer `v`, `w` sağ kenar ofseti).
- `RK.wTile(ctx,x,y,s,letter,st,flip)` → Wordle karosu; `st` bir `RK.W_ST` anahtarı (`"empty"|"filled"|"correct"|"present"|"absent"|"hint"`); `flip` (0-1, opsiyonel) dikey çevirme animasyonu.
- `RK.W_ST` → Wordle karo durum→renk haritası: `{empty,filled,correct,present,absent,hint}`, her biri `[bg,border,text]`.
- `RK.tileWord(ctx,cx,y,word,size,maxW)` → `number` (kullanılan karo boyutu). Kelimeyi `RK.letterTile` karolarıyla ortalı yazar; `maxW` verilirse sığdırmak için küçültür.
- `RK.boardRows(ctx,R,x,y,w,rows,grow)` → `number` (yeni alt y). Tur/maç sonucu satırları (avatar + isim + BOT rozeti + çubuk + skor); `rows:[{e,n,score,me,bot}]`; `grow` (0-1, varsayılan `1`) skor/çubuk animasyon çarpanı.

## Yeni bileşenler (reklama özel)

- `RK.notif(ctx,x,y,w,o)` → `number` (yükseklik). iOS kilit ekranı bildirimi (sol logo, "İSİM ŞEHİR", sağ saat, gövde metni). `o:{title,body,time,pop(0-1)}`; `pop<=0` iken hiçbir şey çizmez.
- `RK.lockScreen(ctx,R,o)` → bulanık koyu zemin + büyük saat/tarih. `o:{time,date}`.
- `RK.chatBubble(ctx,x,y,maxW,o)` → `{h}`. WhatsApp benzeri konuşma balonu; `o:{text,me,name,time}`; `me:true` ise balon `x`'in **soluna** doğru çizilir (sağa yaslı).
- `RK.chatHeader(ctx,R,o)` → `number` (alt sınır y). Sohbet başlığı (avatar + grup adı + alt satır). `o:{name,sub}`.
- `RK.durButton(ctx,cx,cy,r,o)` → kırmızı yuvarlak "DUR" butonu, yarıçap `r`. `o:{press}`.
- `RK.stamp(ctx,cx,cy,text,col,rot)` → hafif dönük lastik damga (kalın çerçeve + metin). `rot` radyan, varsayılan `-0.08`.
- `RK.paperBg(ctx,x,y,w,h)` → defter kağıdı zemini (krem + mavi satırlar + kırmızı marj).
- `RK.handText(ctx,s,x,y,size,col)` → Patrick Hand ile çok satırlı el yazısı (`\n` ile satır böl).
- `RK.hook(ctx,R,lines,o)` → `number` (son satırın y'si). Reklam kanca yazısı; `lines:string[]`; `o:{font:"inter"|"anton",size,col,align,y,accent:{line,col}}` (`accent.line` verilen indeksteki satır `accent.col` rengiyle çizilir).
- `RK.wordleGrid(ctx,cx,y,size,gap,rows,o)` → `number` (alt y). Karo ızgarası; `rows:[[{l,s}]]`; `o:{flipRow,flipAt,lp}` verilen satırı `lp`'ye göre çevirme animasyonuyla çizer.
- `RK.popBoard(ctx,x,y,w,rows,o)` → `number` (alt y). Popüler Cevap tablosu; `rows:string[]` (rank 1'den N'e cevaplar); **sayı/yüzde göstermez** — açık satırda yalnız cevap, kapalı satırda `"?????"`. `o.reveal` (varsayılan `rows.length`) kaç satırın açık olduğunu belirtir; açılış **alttan** (`rank N`) başlar.
- `RK.stopwatch(ctx,x,y,ms)` → `number` (genişlik). `ms` milisaniyeyi `"0:09.84"` mono formatında (mint) çizer.
- `RK.odometer(ctx,cx,y,size,value)` → `number` (genişlik). `value`'yu Türkçe binlik ayırıcıyla (`10.000`) haneleri karo gibi çizerek gösterir.

## Video motoru

- `RK.scenes(list)` → `draw(ctx,R,t)` fonksiyonu döndürür; `draw.total` = toplam süre (ms), `draw.list` = orijinal `list`. `list:[{dur,render(ctx,R,lp,t),say:{t1,t2,tone,big}}]`. `draw(ctx,R,t)` çağrıldığında: `bg` çizer, `t`'ye göre aktif sahneyi + yerel ilerlemeyi (`lp`) bulur, sahne sınırında 0.06-lp'lik crossfade uygular, `sc.render(ctx,R,lp,t)`'yi çağırır, `R.bodyBottom`'ı ayarlar, `RK.narrate`'i çizer, `RK.progressLine`'ı çizer.
- `RK.narrMetrics(ctx,R,d)` → `null` (d yoksa) veya `{x,w,y,h,l1,lines,t2y,first,tone}`. `RK.narrate`'in ölçülerini `d:{t1,t2,tone,big}`'e göre hesaplar; taban `R.H - RK.SAFE.story.bottom - 24`.
- `RK.narrate(ctx,R,d,m)` → anlatım şeridini (kart + sol renk şerit + `t1`/`t2` metni) `m` (bir `narrMetrics` sonucu) ölçülerine göre çizer.
- `RK.ctaScene(o)` → bir `{dur,say,render}` sahne nesnesi döndürür (`RK.scenes`'e eklenebilir). Logo pop-in + "İsim Şehir Online" + `o.items` (string dizisi, sırayla beliren satırlar) + `RK.adCTA`. `o:{dur(varsayılan 2600),say,items}`.
- `RK.progressLine(ctx,R,t)` → alt kenarda ince ilerleme çubuğu (`t/R.total` oranında, `R.total` `RK.scenes` tarafından `draw` çağrılmadan önce `R` üzerine konmalı — `RK.mount`'un video kartı bunu otomatik yapar).

## Stüdyo — `RK.mount(cfg)`

`RK.mount(cfg)` → `void`. Font + logo hazır olduktan sonra (`document.fonts.ready` + logo `onload`) sayfayı kurar.

```
cfg = {
  key:        string,           // opsiyonel, bilgi amaçlı
  kind:       "image"|"carousel"|"video",  // item.kind verilmezse varsayılan
  title:      string,            // opsiyonel, bilgi amaçlı
  sub:        string,            // opsiyonel, bilgi amaçlı
  ITEMS:      Item[],            // zorunlu
  filePrefix: string,            // opsiyonel, varsayılan "isimsehir-reklam"; indirilen dosya adının başı
  facts:      {b|title, t|text}[],  // opsiyonel, #facts elementini doldurur
  links:      {href,label}[],       // opsiyonel, #links elementini "Diğer stüdyolar → ..." olarak doldurur
}
```

`RK.mount`, `document.getElementById("grid")`'i bulup her `ITEMS[i]`'yi `item.kind || cfg.kind`'e göre bir
karta dönüştürür ve `#grid`'e ekler. Ayrıca `#toast` ve `#modal` (yoksa) DOM'a otomatik enjekte edilir —
sayfa CSS'i `.toast`/`.modal`/`.sheet`/`.mclose`/`.mtitle`/`.mmedia`/`.mbtns`/`.mhint` sınıflarını
`cevrimdisi-4.0.html`'den aynen taşımalı.

### Item şekilleri

**`kind:"image"`** (Story/Post):
```
{ id, title, sub, caption, tags, W, H, render(ctx,R) }
```
`R = {W,H,ctx,canvas,story:(H===1920)}`. Kart: canvas + başlık + `caption+"\n\n"+tags` içeren textarea +
"PNG indir" + "Metni kopyala" butonları.

**`kind:"carousel"`**:
```
{ id, title, sub, caption, tags, W:1080, H:1350, slides:[{render(ctx,R)}, ...] }
```
`R` her slaytta `{W,H,ctx,canvas,story:false,slide:(1-index),slides:toplamSayı}`. Kart: yatay kaydırmalı
slayt şeridi + her slayt için "Slayt N indir" + "Hepsini indir" (350ms arayla ardışık) + "Metni kopyala".

**`kind:"video"`**:
```
{ id, title, sub, caption, tags, W:1080, H:1920, scenes:[...] }
```
`scenes` doğrudan `RK.scenes(item.scenes)`'e verilir. Kart: canlı oynatan canvas (`IntersectionObserver`
ile yalnız ekrandayken), "▶" yeniden başlatma overlay'i, "Video indir" (WebCodecs MP4 → MediaRecorder
WebM → GIF sırasıyla dener), "GIF", "Metni kopyala".

### Ortak stüdyo davranışları

- `?safe=1` — tüm kartlarda `RK.safeGuide` önizleme katmanını açar (yalnız Story/Video boyutlarında görünür; exporta girmez).
- `?solo=<id>` — sayfa gövdesini tek bir `<canvas>` (gerçek piksel boyutunda) ile değiştirip yalnız o item'ı çizer; ekran görüntüsü almak için. Carousel'de `?solo=<id>-<slaytNo>` (1-index) tek slaytı gösterir.
- Her item'ın `render`/`slides[i].render`/`scenes` çağrısı ayrı ayrı try/catch ile sarılır: hata `console.error`'a yazılır ve o kartın üstüne kırmızı bir hata bandı eklenir — sayfanın geri kalanı çalışmaya devam eder (viral-3.0'daki tanımsız `drawTile` kazasının tekrarını önlemek için).
- İndirme sonucu ortak bir modal'da gösterilir: "İndir" (her zaman) + "Paylaş / Kaydet" (yalnız `navigator.canShare` destekliyorsa).

---

## Bilinen sapmalar / brifle tam örtüşmeyen noktalar

- **`RK.HANDLE` "@" içerir.** `tesekkur-10bin.html`'deki orijinal `socials()` `HANDLE`'ı `@` işaretsiz basıyordu; brif (§0.4, §2) her yerde `@isimsehironline` yazılmasını istediği için `RK.HANDLE` burada `"@isimsehironline"` (baştaki `@` dahil) olarak tanımlandı — `RK.socials`/`RK.adCTA` bunu olduğu gibi kullanır.
- **`RK.adCTA`'nın Story/Video-dışı güvenli alt payı brifte açıkça sayı verilmiyor.** Story/Video için `o.y` boşsa `R.H - 340 - 250`; Post/Carousel gibi story-olmayan formatlarda (`R.H<1900`) makul bir varsayılan olarak `safeBottom=40px` seçildi (brifte yalnız Story/Video güvenli alanı sayısal olarak verilmiş, §1).
- **Brif §4.1'de listelenmeyen bileşenler eklenmedi** (örn. `SC.game/setup/lobby/wordle/modal/cta` gibi cevrimdisi-4.0'ın üst düzey kompozit ekranları core'a taşınmadı) — brif yalnızca "atom" bileşenleri istiyor (§4.1); sayfa ajanları kendi sahne kompozisyonlarını bu atomlardan kurar.
