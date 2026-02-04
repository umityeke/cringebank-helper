# Cringebank Yardım Merkezi — Kapsam, IA ve Hukuki Çerçeve (TR)

> Amaç: Cringebank (sosyal ağ) için **tam teşekküllü** Help Center bilgi mimarisi (IA), kullanıcıya gösterilecek içerik sınırları ve hukuki/operasyonel “müdahale yetkisi” çerçevesini netleştirmek.
>
> Not: Bu doküman **hukuki danışmanlık değildir**. Metinler yayına alınmadan önce şirket avukatı/DPO ile gözden geçirilmelidir.

## 0) Ürün Tanımı ve Rolümüz (kullanıcıya da anlatılacak)
- Cringebank bir **sosyal medya/sosyal ağ** ürünüdür.
- Cringestore ayrı bir pazaryeri ürünüdür; Cringebank içeriği ile Cringestore ticari işlemleri **farklı kurallara** tabidir.

## 1) Yayın Politikası (kritik)
### 1.1 Kullanıcıya GÖSTER (Public Help)
- Ürün özellikleri ve sorun giderme adımları
- Topluluk kuralları ve yaptırım türleri (genel)
- Raporlama/itiraz akışları ve süreler (genel)
- KVKK aydınlatma ve KVKK başvuru süreç özeti
- Telif/marka/kişilik hakkı başvuru kanalları ve temel kriterler

### 1.2 Kullanıcıya GÖSTERME (Internal / Runbook)
**Asla yayınlanmayacak:**
- Anti-abuse / fraud eşikleri (kaç rapor, hangi sinyal, risk skorları)
- Moderasyon sinyal listeleri, ban-evasion tespit yöntemleri
- Log formatları, saklama politikası detayları, erişim yetki matrisi
- Kolluk/mahkeme taleplerinin iç iş akışı (kim onaylar, hangi adım)
- Güvenlik açıklarına dair teknik detaylı anlatımlar

> İç dokümanlar ayrı bir repo/alan: `internal/` (yayına çıkmayacak).

## 2) Müdahale Sınırları (Public + Internal netlik)
### 2.1 Müdahale Edebiliriz (yetkimiz olan)
- İçeriği kaldırma/erişimi kısıtlama (Topluluk Kuralları/İhlal)
- Hesap kısıtlama/ban (spam, taklit, taciz, ihlal)
- CringChat kısıtlama (taciz/spam)
- Rapor/itiraz sürecini işletme (yeniden inceleme)
- KVKK başvurularını işleme alma (erişim/düzeltme/silme vb.)

### 2.2 Müdahale Edemeyiz / Etmemeliyiz
- Kullanıcılar arası uyuşmazlıkta “hakem gibi kesin hüküm” (biz süreç işletiriz)
- Hukuki görüş vermek ("avukatınız değiliz" çerçevesi)
- Cihaz/operatör kaynaklı sorunları garanti çözmek
- İçerik kaldırma gerekçelerinde istismara açık teknik ayrıntı vermek

## 3) Hukuki Referans Haritası (TR odaklı — doğrulama şart)
Bu başlık **referans** içindir; metinler avukat/DPO tarafından finalize edilmelidir.
- **KVKK (6698)**: Aydınlatma yükümlülüğü, ilgili kişi hakları, başvuru kanalı/süreler.
- **5651 ekosistemi** (içerik/yer sağlayıcı tartışmaları): Haberdar edilince kaldırma prensipleri vb. — ürünün konumlandırmasına göre değerlendirme.
- **Telif/Marka/Kişilik hakları**: İhlal bildirimleri, karşı bildirim/itiraz akışı.
- **Çocuk güvenliği / hassas içerik**: Yaş politikası, zorunlu bildirimler (varsa) — ayrı hukuki değerlendirme.

## 4) Bilgi Mimarisi (IA) — Cringebank Public Help
Aşağıdaki başlıklar **site menüsü/kategori** + **makale listesi** olarak planlanır.

### 4.1 Başlangıç & Uygulama Mantığı
- Cringebank nedir? Cringestore’dan farkı
- Hesap oluşturma, giriş, oturum sorunları
- Profil düzenleme (bio, foto, link, kullanıcı adı)
- Arama nasıl çalışır (kullanıcı/etiket) — genel anlatım
- Keşfet/Ana akış sıralaması — **genel** şeffaflık (algoritma detayı yok)

### 4.2 Hesap & Güvenlik
- Şifre sıfırlama, e-posta/telefon doğrulama
- İki adımlı doğrulama (2FA)
- Şüpheli giriş uyarıları ve cihaz/oturum yönetimi
- Hesabım ele geçirildi (acil adımlar)
- Hesabı dondurma/kapama
- Kimlik doğrulama (varsa): neden istenir, nasıl saklanır (yüksek seviye)

### 4.3 Gizlilik Ayarları
- Hesap gizli/açık, takip istekleri
- Engelleme / kısıtlama / sessize alma
- Etiket/mention izinleri
- Konum paylaşımı ve görünürlük
- CringeSpill (Geçici Paylaşım) görünürlüğü / yakın arkadaşlar (varsa)

### 4.4 Paylaşımlar (post/fotoğraf/video/anket) + CringeClap
- Paylaşım oluşturma/düzenleme/silme
- Paylaşım görünmüyor: olası sebepler (inceleme, spam, teknik)
- Taslaklar ve zamanlama (varsa)
- İçerik sahipliği ve telif temel prensipleri
- Hassas içerik politikası (genel)

### 4.5 CringeSpill (Geçici Paylaşım)
- CringeSpill oluşturma ve arşiv (varsa)
- CringeSpill’i kimler görebilir/saklama
- Görüntüleme listesi hakkında genel bilgi (detay yok)

### 4.6 Etkileşimler
- Beğeni, yorum, kaydetme
- Yorumlar neden görünmüyor (filtre, rapor, kural)
- Spam davranışlar ve kısıtlamalar (genel)

### 4.7 Mesajlar (CringChat)
- Mesaj istekleri ve güvenlik
- Engelleme/kısıtlama CringChat’e etkisi
- Taciz/tehdit/şantaj: raporlama, güvenlik önerileri

### 4.8 Bildirimler
- Bildirim türleri
- Bildirim gelmiyor (cihaz izinleri, uygulama ayarları)
- Bildirimleri özelleştirme

### 4.9 Raporlama, Şikayet & İtiraz
- İçerik raporlama
- Kullanıcı raporlama (taklit, taciz, spam)
- İçerik kaldırıldıysa itiraz
- Hesap kısıtlandıysa itiraz
- Şeffaflık çerçevesi: "Neden bu aksiyonu aldık?" (genel)

### 4.10 Topluluk Kuralları & Uygulama Politikaları
- Topluluk kuralları (net maddeler)
- Yaptırımlar (uyarı/kısıtlama/kaldırma/ban) — ölçütler **genel**
- Tekrarlayan ihlaller ve kademeli yaptırım (detaylı eşik yok)

### 4.11 Veri Koruma (KVKK) ve Kullanıcı Hakları
- KVKK aydınlatma metni (özet + tam metne link)
- İlgili kişi hakları: erişim/düzeltme/silme/itiraz vb.
- Başvuru kanalı ve zaman çizelgesi (genel)
- Verinin nereden toplandığı ve hangi amaçlarla işlendiği (genel)

### 4.12 Teknik Sorunlar
- Uygulama çöküyor/donuyor
- Video açılmıyor/ses yok
- Yükleme takılıyor/paylaşım başarısız
- Bağlantı var ama bağlanmıyor
- Performans önerileri (cache, güncelleme)

## 5) “Hukuki risk yok” için minimum zorunlu sayfalar (öneri)
> Bu liste **minimum**; iş modeline göre genişletilir.
- Gizlilik Politikası + KVKK Aydınlatma (Cringebank kapsamı net)
- KVKK Başvuru Süreci (iletişim kanalı + doğrulama adımları)
- Topluluk Kuralları
- İçerik Kaldırma / İtiraz Politikası
- Telif/Marka/Kişilik Hakkı Bildirim Süreci
- Güvenlik Merkezi (hesap güvenliği, dolandırıcılık uyarıları)
- İletişim & Destek Kanalları
- Kolluk/mahkeme talepleri için **genel** bilgilendirme (iç prosedür yok)

## 6) İçerik Şablonu (makale yazım standardı)
Her makale için:
- **Sorun/Konu özeti** (1 paragraf)
- **Kısa çözüm adımları** (madde madde)
- **Sık görülen nedenler** (genel)
- **Ne yapamıyoruz / sınırlarımız**
- **Gerekirse itiraz/rapor linki**
- **İlgili politikaya link**

## 7) TODO (derin araştırma ile doldurulacak)
- KVKK metinleri: veri kategorileri, hukuki sebepler, aktarım senaryoları (DPO/avukat onayıyla)
- Telif/marka/kişilik hakkı süreç metinleri (form alanları + kanıt şartları)
- Çocuk güvenliği ve hassas içerik politikaları (yaş doğrulama, bildirim yükümlülükleri)
- Şeffaflık metni: algoritma/keşfet açıklaması (istismarı önleyecek dil)
