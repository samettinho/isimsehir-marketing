# Brief: 30.000 Teşekkür Stüdyosu (`marketing/site/tesekkur-30bin.html`)

Kullanıcı 30.000+ kullanıcı ve 30.000+ indirmeyi geçti; teşekkür görseli + videosu paylaşacak.
Mevcut stüdyolarla AYNI yapıda yeni bir sayfa yaz: **`tesekkur-20bin.html`'i iskelet olarak al** (sayfa düzeni,
metin düzenleme, PNG indir, MP4 export = WebCodecs + mp4-muxer, paylaş, logo.js, Feed/Story oranları).
Önce `tesekkur-20bin.html` ve `tesekkur-10bin.html`'i oku; tasarımlarını TEKRARLAMA (10K: konfeti, madalya,
kalabalık, bilet, şehir, karolar, başarım, arcade, balon, kart · 20K: çizelge, wordle, popcevap, düello, riso,
adisyon, yoklama, vhs, tabela, kelimeler, sohbet). Sayfa self-contained: helper'ları kopyala, başka sayfaya bağımlı olma
(istisna: logo.js, mp4-muxer.min.js gibi 20K'nın zaten yüklediği ortak dosyalar).

## Kurallar (bağlayıcı)
- Rakam: yalnız **30.000+** (kullanıcı ve indirme ikisi de gerçek). Geçmiş eşikler 10.000 ve 20.000 de gerçek, yalnız video 3'te kullanılabilir. Başka sayı, yüzde, puan, tarih, uydurma yorum, uydurma oyuncu adı/kullanıcı adı YOK.
- İnsan, el, karakter, yüz çizimi YOK. Jenerik "AI tasarımı" (mor gradyan, neon glow, glassmorphism, krom) YOK.
- Palet: ink #0F1226, gold #F0C24B, mint #37D399, rose #FF5C7A, sky #4DC3FF, krem #FFF6E0, Bic mavi #2F5BD8.
- Metinde tire (— –) yok. Türkçe harfler (İ ı Ş ş Ğ ğ Ç Ö Ü) doğru; büyük harfe çevirirken `toLocaleUpperCase('tr')`.
- CTA (her görselde/videonun sonunda): logo, "Ücretsiz indir", App Store + Google Play rozetleri birlikte, @isimsehironline.
- Story/video güvenli alan: üst 250 px, alt 340 px boş kalsın (önemli içerik yok).
- Videolar 15 sn+, sessiz (önceki stüdyolar gibi), her video FARKLI mekanik; "kinetik yazı + maddeler kayar + punch + outro" şablonu YASAK. İlk 1 sn'de hareket, ödül erken.
- Oyun içi örnek kelimeler gerçek Türkçe kelime olsun (ör. T harfi: Tuna, Trabzon, Tavşan, Turp, Tencere).
- Caption + hashtag'ler 20K'daki CAPS/TAGS gibi her tasarım için hazır; dosya adları `isimsehir-30bin-<id>[-post|-story].png` / `.mp4`.

## 8 görsel (her biri 4:5 1080×1350 + 9:16 1080×1920)
1. **mektup** · Teşekkür mektubu: krem mektup kâğıdı, Bic mavisi el yazısı "Sevgili 30.000+ kişi," + 3 satırlık kısa sıcak metin, köşede pul (pulun içinde 30.000+), posta damgası.
2. **takvim** · Duvar takvimi yaprağı: kopartılan yaprak, dev "30.000+" gün rakamı yerinde, üstte "TEŞEKKÜRLER" ay şeridi, spiral delikleri, alttaki yaprak hafif görünür. Tarih yazma.
3. **optik** · Optik form: sınav cevap kâğıdı, kodlanmış baloncuklar "30000" sütunlarını doldurur, "AD SOYAD" yerine "HEPİNİZ", kurşun kalem dokusu.
4. **gazete** · Gazete manşeti: "İsim Şehir Postası" adında marka gazetesi (gerçek gazete taklidi değil), dev manşet "30.000+", alt manşet "Kâğıttan telefona geçtik", sütun çizgileri, kâğıt dokusu. Sütun metinleri anlamlı kısa Türkçe, sahte haber/alıntı yok.
5. **jeton** · Jeton kulesi: uygulamanın jetonlarına benzeyen altın jeton yığınları basamak basamak yükselir, en tepede 30.000+, ink zemin, temiz gölgeler.
6. **harfcarki** · Harf çarkı: oyunun harf çekme çarkı, ibre "T"de, altında "TEŞEKKÜRLER" T'den başlar; 30.000+ çarkın göbeğinde.
7. **bulmaca** · Çengel bulmaca: kare bulmaca ızgarası, yatay/dikey cevaplar TEŞEKKÜRLER, OTUZBİN, İSİM, ŞEHİR kesişir; dolu kareler gold, ipucu kartı.
8. **indirme** · İndirme çubuğu: büyük, minimal bir indirme ilerleme halkası/çubuğu %100 tamam (yüzde yazma, yalnız tik işareti), altında "30.000+ indirme · 30.000+ oyuncu". İsviçre/editoryal tipografi, cömert boşluk.

## 3 video (1080×1920, 30 fps)
1. **harfcarki** (≈17 sn) · Çark döner, yavaşlar, T'de durur → tur başlar: kategori satırları (İsim, Şehir, Hayvan, Bitki, Eşya) uygulama arayüzü dilinde tek tek dolar (Tuna, Trabzon, Tavşan, Turp, Tencere) → son satır "Cevap: TEŞEKKÜRLER" → 30.000+ → CTA.
2. **mektup** (≈18 sn) · El yazısı mektup harf harf yazılır (kalem ucu izi, yazı yolu boyunca açılır), "Sevgili 30.000+ kişi" önce gelir → kâğıt katlanır, zarfa girer, pul yapışır, posta damgası "30.000+" basılır (sarsıntı) → zarf CTA'ya döner.
3. **seviye** (≈16 sn) · Uygulamanın XP/seviye çubuğu dili: çubuk dolar, 10.000 ✓, 20.000 ✓ kilometre taşları geçer, 30.000'de "SEVİYE ATLADIK" patlaması + jeton/konfeti parçacıkları (az ve zarif) → "30.000+ kullanıcı · 30.000+ indirme · Teşekkürler" → CTA.

## index.html
`index.html` kartlarının en üstüne (20K kartının önüne) 30.000 kartı ekle, "YENİ" rozetini 20K'dan kaldırıp 30K'ya taşı. Alt satır: "8 görsel × 4:5 + 9:16 · 3 video (harf çarkı, mektup, seviye)".

## Doğrulama (tarayıcı açma, Playwright/Chrome MCP YASAK)
- `<script>` bloklarını ayıklayıp `node --check`.
- Kullanılan her draw/helper/sahne adı tanımlı mı grep ile eşle (önceki stüdyoda tanımsız helper sessizce çizmiyordu).
- İzinli: geçici profilli headless Chrome ile her görselin PNG'sini al ve Read ile kendin bak:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --user-data-dir=$(mktemp -d) --hide-scrollbars --force-device-scale-factor=1 --window-size=W,H --screenshot=OUT file://...`
  Gerekirse sayfaya tek bir tasarımı/kareyi tam boy çizen `?render=<id>&f=post|story` (video için `&t=ms`) parametresi ekle. Çıktıları `/private/tmp/claude-501/-Users-mdp-Isim-Sehir/f8d5f2b9-50bf-46a7-8b5f-0721352a4b85/scratchpad/30bin-qc/` altına koy; her videodan 3 kare (başlangıç, orta, CTA) bak. Taşma, hizasızlık, Türkçe harf, güvenli alan sorunlarını düzelt.
- `open` kullanma, pencere açma, git commit/push YAPMA.

## Rapor (≤ 8 satır)
Değişen dosyalar, QC PNG klasörü, bildiğin zayıflıklar.
