# Reklam Stüdyosu — tasarım brifi (2026-09-23)

Amaç: **ücretli reklam** (Meta: Instagram/Facebook story, feed, carousel; TikTok/Reels video) için
kreatif seti. Organik paylaşım değil — her kare **ilk 1 saniyede** kancayı atar, tek mesaj verir,
kendi CTA'sını taşır. Set: **10 story + 10 post + 5 carousel + 10 video**.

Çıktı: `marketing/site/` altında yeni bir stüdyo ailesi. GitHub Pages'te yayınlanır:
https://samettinho.github.io/isimsehir-marketing/reklam.html

---

## 0. Değişmez kurallar (kullanıcının önceki geri bildirimleri)

1. **Şablon YOK.** "Kinetik yazı gelir + maddeler kayar + punch + outro" iskeleti yasak. Her video
   **tek bir mekanik** anlatır ve 10 videonun 10'u **farklı mekanik** kullanır (bkz. §6).
2. **Jenerik AI estetiği YOK.** Mor-gradyan-üstüne-beyaz-başlık kompozisyonu yok. Görsel dil =
   **uygulamanın kendi arayüzü** (ekran kaydı hissi) + üstüne tek bir reklam katmanı (kanca yazısı + CTA).
   Ham/gerçek görünen kreatif, cilalı olanı yener (araştırma bulgusu).
3. **Uydurma veri/iddia YOK.** Kullanılabilecek gerçekler §2'de. Rakam uydurma (indirme sayısı, puan
   ortalaması, yorum, yıldız) yasak. Sahte kullanıcı yorumu/inceleme yasak. Popüler Cevap tablolarında
   **sayı/yüzde gösterme** (o veri gerçek kullanıcı cevaplarından gelir); sadece sıra ve cevap.
   Örnek oyuncu adları (Elif, Mert, Zeynep, Kerem, Buse) ve örnek skorlar mockup olarak serbest — bunlar
   arayüz örneği, istatistik iddiası değil.
4. **Gerçek logo** (`logo.js` → `LOGO_DATA`), "İŞ" harf kısaltması KULLANILMAZ. Her karede künye:
   App Store + Google Play rozetleri + `@isimsehironline`.
5. **Türkçe.** Anton'da İ yok → `antonTxt` ile nokta elle çizilir (tesekkur-10bin.html'deki gibi).
6. Stüdyo motoru: her sayfa `reklam-core.js`'i yükler; core'daki helper'lar **tek kaynak**. Sayfa içine
   helper kopyalanmaz. `node --check` temiz olacak; kullanılan her fonksiyon core'da tanımlı olacak
   (viral-3.0'daki `drawTile` tanımsız kazası tekrar etmesin).

## 1. Reklam-özel teknik gereksinimler (Meta + TikTok)

| Format | Ölçü | Güvenli alan | Not |
|---|---|---|---|
| Story | 1080×1920 PNG | üst 250px ve alt 340px **boş** (profil adı / CTA butonu / yanıt kutusu kaplar) | tek mesaj, dev yazı |
| Post (feed) | 1080×1350 PNG | tam kare | ilk 3 kelime kancayı atar |
| Carousel | 1080×1350 PNG × 4-5 slayt | tam kare | 1. slayt kanca, son slayt CTA, slaytlar arası **kenar sürekliliği** (bir eleman sağ kenardan taşar, sonrakinde soldan devam) |
| Video | 1080×1920 MP4, 30fps, 15–22 sn, **sessiz** | story ile aynı güvenli alan; anlatım şeridi **alt 340px'in üstünde** | 0–1.5 sn'de kanca; ilk 5 sn'de 0.5–1.5 sn'de bir kesme; son 2.5 sn CTA kartı |

- Sessiz izlenir → her şey yazıyla anlaşılmalı.
- Platformun kendi CTA butonu olacak ama kreatif de kendi CTA'sını taşır: **"Ücretsiz indir"** + rozetler.
- Her karede `?safe=1` ile güvenli alan kılavuzu açılabilmeli (stüdyo içi kontrol).

## 2. Kullanılabilir gerçekler (website/ ve app/ kaynaklı)

- Oyunlar: **İsim Şehir** (harf çekilir, kategoriler dolar, 2–15 kişi, süreli ya da ilk-bitiren),
  **Wordle** (günün 5 harfli Türkçe kelimesi, 6 hak, seri, sonucu paylaş), **Popüler Cevap**
  (çoğunluğun ne yazdığını tahmin et; puan kaç kişinin aynı şeyi düşündüğüne göre).
- Varsayılan 6 kategori: **İsim, Şehir, Hayvan, Bitki, Eşya, Ünlü**. Özel kategori sınırsız (odada 25'e kadar).
- Puan: **kimsenin yazmadığı kelime +20, geçerli kelime +10, aynı kelimeyi yazanlar +5**.
- Karar: **önce sözlük**; sözlükte yoksa **masa oylar** (✓/✗, çoğunluk), itiraz edilebilir.
- Süreli modda saat, ilk-bitiren modunda **"Dur"** turu kapatır. Son turlarda çıkan harf tekrar gelmez.
- Odalar: özel oda + kod; **herkese açık odalar**; 5 izleyiciye kadar; oda şablonları (5'e kadar);
  arkadaş ekleme + DM; istatistikler (gizlilik seçilebilir).
- Bot: **5 zorluk — Çaylak, Acemi, Orta, İyi, Usta**; **çevrimdışı** çalışır (sözlük cihazda; metro,
  uçak, kapsama yok); **günde 1 maç ücretsiz**, sonrası 🪙25; oda kurmak ücretsiz; bot maçında oylama yok.
- Jeton: hoş geldin **100**; Harf Al **15**, Kelime Al **50**; Wordle harf **25**, harfin yeri **50**;
  reklam izle **+5** (günde 10). Jeton puanı düşürmez, sadece "🪙 jeton kullanıldı" rozeti çıkar.
- Para: **bütün özellikler ücretsiz**; satılan tek şey **"Reklamsız"** (tek seferlik). Fiyat YAZMA.
- Topluluk: **10.000 oyuncu** eşiği geçildi (Eylül 2026). Bu tek gerçek sayı.
- Giriş: Apple / Google ile tek dokunuş. Mağazalar: App Store + Google Play.
- Bağlantılar: `https://apps.apple.com/app/isim-sehir-online/id6766661912`,
  `https://play.google.com/store/apps/details?id=com.isimsehir.app`. Hesap: `@isimsehironline`.

## 3. Görsel dil

- Palet = uygulama (`app/src/themes.ts`, cevrimdisi-4.0.html'deki `C`): ink `#0F1226`, panel `#1A1E3B`,
  panel2 `#242963`, line `#2E3470`, text `#F4F5FF`, dim `#9AA0CF`, violet `#7C5CFF`, sky `#4DC3FF`,
  mint `#37D399`, gold `#F0C24B`, rose `#FF5C7A`, warn `#FFB347`, bot `#5BA8E8`. Kategori karo gradyanları
  `CATG` (GameScreen). Logo renkleri lacivert/altın vurgusu için tesekkur-10bin `L` paleti (deep/navy/gold).
- Tipografi: **Inter** (arayüz, 1 pt = 2.77 px), **Anton** (kanca sayıları/dev kelime; İ düzeltmesi),
  **Caveat** (el yazısı not — "UGC" hissi, tek satır, seyrek), **Patrick Hand** (defter kareleri).
- Kanca yazısı = reklam katmanı: kalın Inter 900 ya da Anton, **en fazla 6 kelime**, tek renk vurgusu
  (gold veya mint). Her karede **bir** kanca, **bir** görsel mekanik, **bir** CTA.
- Defter (viral-3.0) estetiği yalnızca "kağıt vs uygulama" karşılaştırmalarında (P1, C2) ve o karede
  kağıt yarısı için: krem kağıt, mavi çizgiler, kırmızı marj, Patrick Hand.
- Krome/cam/3D/neon efekt yok. Gölge yalnızca kart kaldırma için.

## 4. Dosya mimarisi

```
marketing/site/
  reklam-core.js        ← ortak motor + bileşenler (window.RK)   [Ajan CORE]
  reklam.html           ← hub: 4 stüdyoya kart + reklam spesifikasyon tablosu  [Ajan CORE]
  reklam-story.html     ← 10 story                                  [Ajan STORY]
  reklam-post.html      ← 10 post                                   [Ajan POST]
  reklam-carousel.html  ← 5 carousel (4-5 slayt)                    [Ajan CAROUSEL]
  reklam-video.html     ← 10 video                                  [Ajan VIDEO]
  index.html            ← "Reklam Stüdyosu" kartı (YENİ rozeti, en üste) [Ajan CORE]
```

Her sayfa: `<script src="logo.js">`, `<script src="gif.js">`, `<script src="mp4-muxer.min.js">`
(video sayfası), `<script src="reklam-core.js">`, sonra sayfanın kendi `<script>`'i:
`ITEMS` tanımı + `RK.mount({...})`. Sayfa CSS'i core'dan gelmez; her sayfa cevrimdisi-4.0'daki
stüdyo CSS'ini (header, filters, facts, grid, card, stage, modal, toast) kendi `<style>`'ında taşır —
**görsel kimlik aynı** (ink zemin, violet vurgu). Başlık altında "Diğer stüdyolar →" bağlantıları.

### 4.1 `reklam-core.js` — `window.RK` API (Ajan CORE bunu yazar, diğerleri buna göre kodlar)

Sabitler: `RK.C` (palet), `RK.L` (logo paleti), `RK.CATG`, `RK.LEVELS`, `RK.CATS=["İsim","Şehir","Hayvan","Bitki","Eşya","Ünlü"]`,
`RK.HANDLE`, `RK.APP_URL`, `RK.PLAY_URL`, `RK.SAFE={story:{top:250,bottom:340}}`.

Ölçek: `RK.P(v)` (S=2.77), `RK.setScale(s)`, `RK.resetScale()`, `RK.setScaleForHeight(hv)`.

Yardımcılar (cevrimdisi-4.0 + tesekkur-10bin'den birebir taşınır): `clamp01, inv, eOut, eBack, eInOut,
hexA, shade, seeded, rr, F, AN, CV, HD, MONO, EF, txt, meas, wrapLines, txtWrap(ctx,s,x,y,o,maxW,lh)→satır sayısı,
emoji, up, antonTxt`.

Marka: `logo(ctx,cx,cy,size,o)`, `igIcon, glyph, APPLE_D, PLAY_D, X_D, TT_D`, `socials`, `storeBadges(ctx,cx,y,o)`,
`colophon(ctx,R,y,o)` (tesekkur ile aynı: logo+ad / sosyal / rozetler, ~186px),
**`adCTA(ctx,R,o)`**: güvenli alanın hemen üstüne hizalanmış reklam kapanışı — büyük buton
"Ücretsiz indir" (mint zemin, ink yazı, 88px yüksek) + altında iki rozet + `@isimsehironline`.
`o.y` verilirse orada, verilmezse `R.H - safeBottom - 250` civarında. Post için `o.compact` (buton + rozetler tek satır).
`safeGuide(ctx,R)`: `?safe=1` iken üst/alt güvenli alanı kırmızı taralı çizer (yalnız önizleme, export'a girmez).

Uygulama bileşenleri (cevrimdisi-4.0'dan birebir + yeniler): `bg, card, label, pill, coinPill, statusBar,
screenHead, playerStrip, letterTile, hintChip, catField, btn, opt, botCard, settingRow, wTile, W_ST,
tileWord, boardRows(ctx,R,x,y,w,rows,grow)` (SC.board'un gövdesi), **yeniler:**
- `notif(ctx,x,y,w,{title,body,time,pop})` iOS kilit ekranı bildirimi (sol logo, "İSİM ŞEHİR", sağda saat).
- `lockScreen(ctx,R,{time:"21:04",date:"Salı 23 Eylül"})` bulanık koyu zemin + saat.
- `chatBubble(ctx,x,y,maxW,{text,me,name,time})` WhatsApp benzeri balon; döner {h}.
- `chatHeader(ctx,R,{name:"Aile 👨‍👩‍👧‍👦",sub:"Elif, Mert, Zeynep, sen"})`.
- `durButton(ctx,cx,cy,r,{press})` kırmızı yuvarlak DUR.
- `stamp(ctx,cx,cy,text,col,rot)` "+20 / SÖZLÜKTE / KABUL" damgası (kalın çerçeve, hafif dönük).
- `paperBg(ctx,x,y,w,h)` defter kağıdı (krem, mavi satır, kırmızı marj) + `handText(ctx,s,x,y,size,col)` Patrick Hand.
- `hook(ctx,R,lines,o)` reklam kanca yazısı: dizi satır, `o.font:"inter"|"anton"`, `o.size`, `o.col`,
  `o.accent:{line:1,col}` (bir satır vurgu rengi), `o.y`, `o.align`. Satırlar arası 1.02 em.
- `wordleGrid(ctx,cx,y,size,gap,rows,{flipRow,flipAt,lp})`.
- `popBoard(ctx,x,y,w,rows,{reveal})` Popüler Cevap tablosu: sıra numaralı kapaklı satırlar; `reveal` kaç satır açık;
  **sayı yok**, açık satırda sadece cevap; kapalı satır "?????" .
- `stopwatch(ctx,x,y,ms)` speedrun sayacı `0:09.84` mono.
- `odometer(ctx,cx,y,size,value)` haneleri dönen sayaç (10.000 için).

Video motoru: `RK.scenes(list)` → `draw(ctx,R,t)`; her sahne `{dur, render(ctx,R,lp,t), say:{t1,t2,tone,big}}`;
sahne geçişinde 0.06 lp'lik alfa; `RK.narrate` anlatım şeridini **`R.H - safeBottom - 24` tabanına** çizer (kart
cevrimdisi-4.0 `narrate` ile aynı görünüm); `R.bodyBottom` = şerit üstü − 16px. Son sahne `RK.ctaScene(o)` hazır
sahne (logo pop + "İsim Şehir Online" + `o.items` 2–3 satır + adCTA).

Stüdyo: `RK.mount({key, kind, title, sub, ITEMS, filePrefix, facts, links})`.
- `kind:"image"` sayfa: item `{id,title,sub,caption,tags,W,H,render(ctx,R)}`; kart = canvas + başlık + textarea + "PNG indir" + "Metni kopyala".
- `kind:"carousel"`: item `{id,title,sub,caption,tags,W:1080,H:1350,slides:[{render}]}`; kart slaytları yatay
  kaydırmalı gösterir (her slayt canvas), butonlar: "Slayt 1..N indir" + "Hepsini indir" (ardışık, 350 ms arayla).
- `kind:"video"`: item `{id,title,sub,caption,tags,W:1080,H:1920,scenes:[...]}`; core `total` hesaplar, canlı
  oynatır (IntersectionObserver), "Video indir" (WebCodecs MP4 → WebM → GIF fallback, cevrimdisi-4.0 kodu), "GIF".
- Ortak: toast, sonuç modalı (İndir / Paylaş), `?solo=<id>` tek kare gerçek piksel, `?safe=1` kılavuz,
  `ITEMS` render hatalarını `console.error` ile yutmadan kart üstünde kırmızı bant göster (`.err`).
- Font yükleme: Inter 500–900, Anton, Caveat 700, Patrick Hand; logo yüklenmeden çizim yok.

Ajan CORE `reklam-core.js`'i yazdıktan sonra `docs/reklam-core-api.md`'ye **gerçek imzaları** yazar
(fonksiyon adı, parametreler, döndürdüğü). Diğer ajanlar core'u ve bu dosyayı okur.

## 5. Kreatifler

Genel metin kuralları: kanca ≤ 6 kelime; alt satır ≤ 12 kelime; her kreatifin `caption` (reklam birincil
metni, 1–2 cümle + CTA) ve `tags` alanı olur (reklamda hashtag az: `#isimşehir #kelimeoyunu`).
CTA daima "Ücretsiz indir". Emoji arayüz içinde serbest, kanca yazısında yok.

### 5.1 STORY (10) — `reklam-story.html`, 1080×1920, güvenli alan içinde

| id | ad | mekanik / kompozisyon | kanca (üst) | alt satır | CTA konumu |
|---|---|---|---|---|---|
| s1 `harf` | Harf: K | Ortada dev `letterTile` "K" (420px), altında 3 boş `catField` (Bitki, Ünlü, Eşya) imleç yanıp söner, sağ üstte `screenHead` timer **3** kırmızı | "K ile bir bitki söyle." | "3 saniyen var." | adCTA |
| s2 `bildirim` | Bildirim yığını | `lockScreen` + 3 `notif` üst üste (hafif ofset): "Elif seni odaya davet etti", "Tur 3 başladı — sıra sende", "Günün kelimesi hazır" | (Caveat, gold) "telefonun artık böyle çalıyor" | — | adCTA |
| s3 `puan` | +20 / +10 / +5 | Üç `card` satırı: "Kakapo" damga **+20 kimsenin yazmadığı**, "Zürafa" **+10 geçerli**, "Kedi" **+5 üç kişi yazdı** (`stamp`) | "Herkesin yazdığı 'Kedi' 5 puan." | "Kimsenin bilmediği 'Kakapo' 20." | adCTA |
| s4 `sinyal` | Sinyal yok | `statusBar` uçak modu + ÇEVRİMDIŞI pill; altında bot lobisi (3 `botCard`) ve "Oyunu başlat · günün bedava maçı" butonu | "Sinyal yok." (Anton) / "Oyun var." (gold) | "Bota karşı, internetsiz." | adCTA |
| s5 `wordle` | Türkçe Wordle | `wordleGrid` 6 satır: TEMAS / KESER / KİTAP / HİSSE(çözüm, yeşil) + 2 boş; üstte `screenHead` "Günün kelimesi", 🔥 seri pill (sayı yok, sadece "seri devam") | "Türkçe Wordle burada." | "Günde bir kelime, altı hak." | adCTA |
| s6 `populer` | Popüler Cevap | `popBoard` "Hayvan · K": 5 satır hepsi kapalı "?????", altında `catField` Hayvan/K boş imleçli | "K ile hayvan deyince" | "çoğunluk ne yazdı?" | adCTA |
| s7 `ucretsiz` | Hepsi ücretsiz | 6 satır ✓ (Herkese açık odalar, Arkadaş + DM, Bot & çevrimdışı, Wordle, Popüler Cevap, İstatistikler) mint tik; en altta gri satır "Reklamsız — satılan tek şey" | "Her şey ücretsiz." | "Satılan tek şey: reklamsız." | adCTA |
| s8 `onbin` | 10.000 | tesekkur `kalabalik` gibi 10.000 nokta halkası (sayı gerçek), ortada logo; Anton "10.000" | "10.000 oyuncu masada." | "Bir sandalye boş." | adCTA |
| s9 `oda` | Aile grubu | `chatHeader` "Aile 👨‍👩‍👧‍👦" + 4 `chatBubble`: "bu akşam isim şehir?" / "kodu at" / "7F3K" (ben) / "geldim 😎" ; altında lobi 5 avatar, "👑 Kurucu" | "Aile grubuna at." | "5 dakikada masa kurulur." | adCTA |
| s10 `sozluk` | Kavga bitti | İki satır: "ZÜRAFA" → `stamp` SÖZLÜKTE ✓ (mint); "KAKAPO" → oylama çipleri ✓✓✓✗ → KABUL (gold) | "Kağıttaki kavgalar bitti." | "Önce sözlük, sonra masa oylar." | adCTA |

### 5.2 POST (10) — `reklam-post.html`, 1080×1350

| id | ad | mekanik / kompozisyon | kanca | alt satır |
|---|---|---|---|---|
| p1 `kagit` | Kağıt vs uygulama | Sol yarı `paperBg` + `handText` "K — Kedi, Konya, Kerem, Kekik…" ve üstü çizili "Kakapo?"; sağ yarı 3 `catField` dolu; ortada dikey ayraç | "Aynı oyun. Kavgasız." | "Sözlük karar verir." |
| p2 `puan` | Puan sistemi | Üç büyük chip Anton "+20 / +10 / +5" gold/mint/dim, her birinin altında örnek (Kakapo / Zürafa / Kedi) | "Kimsenin yazmadığı kelime 20 puan." | — |
| p3 `soru` | Ş ile Ünlü | `letterTile` Ş + `catField` Ünlü boş, timer 60, 4 boş karo altında | "Ş ile ünlü?" | "Oyunda 60 saniyen var." |
| p4 `ucoyun` | 3 oyun | Üç dikey mini kart yan yana: İsim Şehir (catField), Wordle (4 karo), Popüler Cevap (popBoard 3 satır) | "Tek uygulama, üç oyun." | "İsim Şehir · Wordle · Popüler Cevap" |
| p5 `usta` | 5 zorluk | `LEVELS` merdiveni, Usta satırı bot mavisi vurgulu, dolum çubukları | "Usta'yı yenen var mı?" | "5 zorluk · günde 1 maç bedava" |
| p6 `receipt` | Fiş | Fiş görünümü (krem, mono): "Herkese açık odalar … 0", "Arkadaş + DM … 0", "Bot & çevrimdışı … 0", "Wordle … 0", "Popüler Cevap … 0", "TOPLAM … 0"; altta "Reklamsız: isteğe bağlı" | "Fiş: 0." | "Bütün özellikler ücretsiz." |
| p7 `sure` | 90 saniye | Dev timer chip **90** → küçük satırlar: "Asansörde 1 tur", "Metroda 3 tur", "Reklam arasında 1 maç" | "Bir tur 90 saniye." | — |
| p8 `kategori` | Kategori sensin | 6 varsayılan `letterTile` kelime çipleri + altında el yazısı (Caveat) eklenen özel çipler: "Dizi", "Marka", "Futbolcu", "+ seninki" | "Kategori sensin." | "Sınırsız özel kategori." |
| p9 `dur` | DUR | Dev `durButton` basılı; arkada `playerStrip` (sen 6/6, Elif 4/6, Mert 3/6) | "İlk biten DUR der." | "Süreli ya da ilk-bitiren — sen seç." |
| p10 `paylas` | Emoji grid | iMessage balonu: "İsim Şehir Wordle · 4/6" + 🟨⬛🟩⬛⬛ / ⬛🟩🟩⬛⬛ / 🟩🟩🟩🟨⬛ / 🟩🟩🟩🟩🟩; altta "Teslim" balonu "3/6 😤" | "Spoiler yok, hava var." | "Sonucu paylaş, serini büyüt." |

### 5.3 CAROUSEL (5) — `reklam-carousel.html`, 1080×1350 × 4-5 slayt

Her carousel'da slaytlar arası bir **sürekli eleman** olur (bir çizgi/ok/karo sağ kenardan taşar).
Son slayt: kanca + adCTA (compact). Sol üstte küçük "1/5" pill.

- **c1 `nasil`** — Nasıl oynanır (5): ① "Harf düşer" dev karo K, ② "Herkes aynı anda yazar" 3 catField + playerStrip, ③ "İlk biten DUR der" durButton, ④ "Sözlük karar verir" ZÜRAFA ✓ / KAKAPO oylama, ⑤ "Puanlar düşer" +20/+10/+5 + CTA. Sürekli eleman: üstte ilerleme çizgisi 1→5.
- **c2 `kagit`** — Kağıttan telefona (4): ① defter sayfası, el yazısı K satırı, kanca "Bunu hatırlıyor musun?", ② aynı sayfa üstünde kırmızı "KAKAPO YOK ÖYLE BİR ŞEY!!" karalaması, kanca "Kavga bölümü", ③ uygulama: KAKAPO `stamp` SÖZLÜKTE ✓ +20, kanca "Artık sözlük karar veriyor", ④ CTA "Aynı oyun, cebinde".
- **c3 `ucoyun`** — Tek uygulama üç oyun (5): ① kanca "Üç oyun." büyük, üç küçük ikon-karo, ② İsim Şehir ekranı, ③ Wordle ekranı (çözülmüş HİSSE), ④ Popüler Cevap (popBoard 2 açık 3 kapalı, sayı yok), ⑤ CTA. Sürekli eleman: alttaki 3 nokta sekme göstergesi.
- **c4 `sinyal`** — Sinyal yokken (4): ① "Metroda" statusBar sinyal 0 + oyun ekranı, ② "Uçakta" ✈ + lobi, ③ "Köy yolunda" ÇEVRİMDIŞI + board, ④ CTA "Günde 1 maç bedava · bota karşı".
- **c5 `hangisi`** — Masada sen hangisisin? (5): ① "Kakapo yazan" (+20 damgalı kart, 🦜), ② "Kedi yazan" (+5, 🐱, "üç kişi daha"), ③ "İlk DUR diyen" (durButton), ④ "İtiraz eden" (oylama ✓✗ + "itiraz" butonu), ⑤ CTA "Masada hepsine yer var".

### 5.4 VIDEO (10) — `reklam-video.html`, 1080×1920, 15–22 sn, her biri FARKLI mekanik

Kancalar ilk sahnede, 0–1.5 sn. Anlatım şeridi (`say`) güvenli alan üstünde. Son sahne `ctaScene`.

| id | ad | mekanik (tek) | sahne akışı (≈ sn) | say metinleri |
|---|---|---|---|---|
| v1 `canli` | Canlı tur | **harf makarası**: alfabe hızla döner, K'da durur; sonra yazma + DUR + tablo | 0–1.5 makara → 1.5–7 üç kategori yazılıyor (timer 90→84) → 7–9 DUR basılır → 9–14 board büyür → 14–17 CTA | "Harf düşüyor…" / "Herkes aynı anda yazıyor." / "DUR!" / "Kakapo +20, Kedi +5." |
| v2 `bildirim` | Bildirim POV | **kilit ekranı**: bildirimler 0.7 sn arayla düşer (3), parmak dokunur, lobi açılır, avatarlar pop | 0–3 bildirimler → 3–4.5 dokunma → 4.5–10 lobi dolar (2→5 avatar) → 10–14 oyun başlar (harf K) → 14–17 CTA | "Elif seni davet etti." / "Masa kuruluyor…" / "Harf K. Başladı." |
| v3 `pes` | Pes ettim | **dürüst fail**: Ünlü · Ş boş, timer 10→0 kırmızı, "0 puan" damgası; sonra Harf Al 🪙15 → "Ş▮" → yazılır "Şener Şen" ✓ | 0–5 geri sayım (kesmeler 1 sn) → 5–7 0 PUAN → 7–10 Harf Al → 10–14 yazılır ✓ +10 → 14–17 CTA | "Ş ile ünlü… aklına gelmiyor." / "0 puan." / "Harf Al · 🪙15" / "Kategori doldu." |
| v4 `duo` | Kakapo vs Kedi | **split ekran** (duo): üstte Sen "Kakapo" yazıyor, altta Elif "Kedi"; tur biter, üst +20 alt +5 damga; toplamlar sayılır | 0–2 iki ekran belirir → 2–8 ikisi yazıyor → 8–11 damgalar → 11–14 skor sayaçları → 14–17 CTA | "Aynı harf, aynı kategori." / "Kakapo +20 · Kedi +5" / "Kimsenin yazmadığını yaz." |
| v5 `flip` | Wordle flip | **karo çevirme + paylaşım**: 4 satır sırayla flip (yeşile), sonra iOS paylaşım sayfası açılır, emoji grid balonu gider | 0–8 satırlar flip (2 sn/satır) → 8–11 "Paylaş" sheet → 11–14 iMessage balonu uçar → 14–17 CTA | "Türkçe Wordle." / "4/6." / "Spoiler'sız paylaş." |
| v6 `board` | Popüler Cevap | **alttan üste tablo açılışı**: "Hayvan · K" kapalı 5 satır; sen "Kedi" yazarsın; satırlar 5→1 açılır, seninki vurgulanır (sayı yok) | 0–2 soru → 2–5 yazma → 5–12 satırlar tek tek açılır (1.2 sn) → 12–14 "seninki 1. sırada" → 14–17 CTA | "Çoğunluk ne yazdı?" / "Kedi." / "Kalabalıkla aynı düşün, puan al." |
| v7 `speedrun` | 10 saniyede oda | **kronometre**: köşede `stopwatch` 0:00→0:09.8 akar; kategoriler tıklanır, süre 90, tur 3, "Odayı kur", kod ekranı, "kopyalandı" | 0–1 sayaç start → 1–8 kurulum tıkları (0.8 sn'de bir) → 8–10 kod + kopyalandı, sayaç durur → 10–14 lobi dolar → 14–17 CTA | "Oda kurmak kaç saniye?" / "Kategoriler ✓ süre ✓" / "9.8 saniye." |
| v8 `fis` | Puan fişi | **fiş/tally**: tur sonu, kelimeler tek tek listeye düşer, her birine damga (+20/+10/+5), toplam sayaç artar; fiş uzar | 0–2 "Tur bitti" → 2–11 6 kelime × 1.5 sn damga → 11–14 toplam 85 büyür → 14–17 CTA | "Tur bitti, puanlar düşüyor." / "Kimsenin yazmadığı +20." / "Toplam 85." |
| v9 `grup` | Aile grubu | **sohbet + lobi dolumu**: WhatsApp benzeri balonlar yazılır (0.9 sn), "7F3K" kodu, kesme: lobi 1→6 avatar pop, "Oyunu başlat" | 0–6 balonlar → 6–7 kod kopyalandı → 7–12 lobi dolar → 12–14 başlat → 14–17 CTA | "bu akşam isim şehir?" / "kodu at" / "6 kişi masada." |
| v10 `onbin` | 10.001 | **odometer**: haneler döner 0→10.000 (4 sn), arkada nokta kalabalığı yoğunlaşır; son hane +1 → 10.001 ve "sen" avatarı pop | 0–4 sayaç döner → 4–7 10.000 sabit, noktalar → 7–11 "+1" sen → 11–14 "bir sandalye boş" → 14–17 CTA | "10.000 oyuncu masada." / "10.001?" / "Bir sandalye boş." |

Süre: her video toplam **≥ 15.000 ms** (17 sn hedef). `ctaScene` ≥ 2.5 sn.

## 6. Doğrulama

- `node --check` her JS için; HTML içi script `node -e` ile ayıklanıp kontrol edilir.
- Her sayfa Playwright ile açılır: konsolda **hata sıfır**, kart sayısı beklenen (10/10/5/10), her canvas
  boş değil (piksel örneği ink'ten farklı).
- `?safe=1` ile story/video karelerinde yazı güvenli alana taşmıyor (gözle: kontrol edilecek).
- `?solo=<id>` ekran görüntüleri `docs/preview/` altına alınır (review için).
- Git: `main`'e commit + push (kullanıcı Pages'ten bakacak).
