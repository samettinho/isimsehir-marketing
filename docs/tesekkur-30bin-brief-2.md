# Brief 2: 30.000 Teşekkür Stüdyosu genişletme + müzik

Dosya: `/Users/mdp/Isim_Sehir/marketing/site/tesekkur-30bin.html` (senin yazdığın). Brief 1'in bütün kuralları geçerli:
`docs/tesekkur-30bin-brief.md` (tek rakam 30.000+, karakter/el yok, palet, tire yok, CTA, güvenli alan, tarayıcı yasağı,
yalnız geçici profilli headless Chrome screenshot serbest, commit/push YOK).

## 0. Tasarım skill'leri (kullanıcı "skillerin hepsini kullan" dedi)
İşe başlamadan Skill tool ile şunları yükle ve yönergelerini uygula: `frontend-design:frontend-design`,
`ui-ux-pro-max:banner-design`, `impeccable` (critique/polish kısmı). Bunları tasarım yönü, tipografi hiyerarşisi ve
son cila için kullan; sayfanın motorunu değiştirme. Raporunda hangi skill'den ne aldığını 1 satırda yaz.

## 1. Önceki raporundaki açıkları kapat
- Jeton yüzü: jenerik yıldız yerine uygulamanın jeton görünümü (🪙 dili: altın para, kabartma kenar). Emoji fontuna güvenme, çiz.
- Mektup videosu son karesi: posta damgası pulla çakışmasın, "TEŞEKKÜR" kesilmesin.
- Görmediğin render'ları (takvim, optik düzeltme sonrası; indirme, bulmaca, harfçarkı story; gazete/mektup post son hali) yeniden çek ve bak.

## 2. Yeni 4 görsel (4:5 + 9:16)
9. **tahta** · Okul kara tahtası: tebeşirle ceza yazısı gibi alt alta "Teşekkürler" satırları, en altta büyük "30.000+ kere", tebeşir tozu, silgi izi. Tebeşir dokusu gerçekçi.
10. **kargo** · Kargo kutusu etiketi: kraft karton, barkod, "ALICI: 30.000+ OYUNCU", "İÇERİK: TEŞEKKÜRLER", "KIRILIR: kalbimiz" gibi sıcak espri, kırmızı damga.
11. **polaroid** · Duvara iğneli polaroidler: içlerinde GERÇEK uygulama ekranları (`/Users/mdp/Isim_Sehir/marketing/isim-sehir-video/screens/` altından seç, sayfaya base64 göm ya da site klasörüne kopyalayıp göreli yolla yükle), altlarına el yazısı not, ortada 30.000+.
12. **plak** · Plak kapağı: 45'lik/LP kapağı, plak yarı dışarıda, etikette logo, kapakta "30.000+ · Teşekkürler" ve "A1 İsim · A2 Şehir · B1 Hayvan · B2 Bitki" parça listesi. Retro baskı hissi, krem + gold + ink.

## 3. Yeni 3 video (1080×1920, 30 fps, 15 sn+, her biri farklı mekanik)
4. **tahta** (≈16 sn) · Tebeşir "Teşekkürler" satırlarını tek tek yazar (yazı yolu boyunca açılır), hızlanır, tahta dolar → silgi geçer, ortada temiz "30.000+" yazılır → CTA.
5. **kargo** (≈16 sn) · Bant üzerinde kutular kayar, her kutuya damga iner (tok vuruş, sarsıntı), etiket sayacı yok; son kutu büyür, açılır, içinden "Teşekkürler" + 30.000+ çıkar → CTA.
6. **polaroid** (≈17 sn) · Polaroidler sırayla düşer ve "banyo olur" (griden renge açılır), içlerinde gerçek uygulama ekranları; duvar dolar, kamera geri çekilir, ortada 30.000+ → CTA.

## 4. MÜZİK (tüm 6 video)
Kullanıcı müzik istedi. Lisans sorunu olmasın diye müzik KODLA üretilir:
- Her video için `OfflineAudioContext` ile video süresinde, o videoya özgü kısa enstrümantal parça sentezle (ör. harfçarkı: neşeli marimba/pluck + kick; mektup: sıcak piyano-ish + yumuşak pad; seviye: chiptune arpej; tahta: ukulele-ish pluck + el çırpma; kargo: funky bas + perküsyon; polaroid: lo-fi elektrik piyano + vinil). Melodi gerçek bir müzik gibi akort, tempo ve akor yürüyüşü olsun (ör. I–V–vi–IV), tek nota bip değil. 
- Ana vuruşlar görüntüyle senkron: 30.000+ anı müzikte doruk/vuruş; SFX (çark tık, damga, kalem/tebeşir, kâğıt, pop, jeton) aynı mixte, müzik efektlerin altında.
- Mastering: basit limiter/normalize, tepe ≈ -1 dBFS, algılanan ses seviyesi kabaca -14 LUFS civarı (RMS hedefiyle yaklaş), patlama/clip yok. Sonda 0.5 sn fade-out.
- Önizleme: sayfadaki video önizlemesi oynatılırken müzik de çalsın (kullanıcı etkileşimiyle AudioContext başlat), "Sesi kapat" düğmesi.
- MP4 export: `AudioEncoder` (AAC `mp4a.40.2`, desteklenmiyorsa Opus) ile kodla, mp4-muxer'a audio track olarak ekle (yerel `mp4-muxer.min.js` sürümünün audio desteğini kontrol et). AudioEncoder yoksa sessiz MP4'e düş ve toast ile bildir. MediaRecorder yedeğinde de ses akışını (MediaStreamDestination) ekle.
- Ek: her video için "Müzik WAV indir" düğmesi (kullanıcı başka editörde kullanabilsin).
- Doğrulama: node ile sentez fonksiyonunu tarayıcı dışında çalıştıramıyorsan, headless Chrome'da `?render=audio&v=<id>` gibi bir sayfayla WAV üretip scratchpad'e yazdır (ör. `--dump-dom` ile base64 çıkar) ve `ffmpeg -i x.wav -af ebur128 -f null -` (varsa) ile LUFS/peak ölç; ölçemiyorsan rapora yaz.

## 5. index.html
30K kartının alt satırını güncelle: "12 görsel × 4:5 + 9:16 · 6 müzikli video".

## Rapor (≤ 10 satır)
Değişenler, QC klasörü (`/private/tmp/claude-501/-Users-mdp-Isim-Sehir/f8d5f2b9-50bf-46a7-8b5f-0721352a4b85/scratchpad/30bin-qc/`), müzik ölçümleri, kullanılan skill'ler, zayıflıklar.
