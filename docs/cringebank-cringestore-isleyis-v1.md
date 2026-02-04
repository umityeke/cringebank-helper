# CRINGEBANK + CRINGESTORE İŞLEYİŞ DÖKÜMANI (V1)

- **Durum:** Internal / Runbook (Help Center’a doğrudan koymayın)
- **Tarih:** 04.02.2026
- **Amaç:** CringeBank (sosyal ağ) ve CringeStore (marketplace) için kullanıcı yolculukları, modüller, veri akışları, roller, güvenlik/moderasyon ve entegrasyon sınırlarını tek yerde netleştirmek.

## Temel prensip
- CringeBank **içerik odaklıdır**, CringeStore **alışveriş odaklıdır**.
- Entegrasyon **destekleyici ve opsiyonel** olmalıdır; varsayılan davranış “otomatik karışma yok”tur.

## İçindekiler
1. Amaç ve kapsam
2. Ürünlerin kısa tanımı
3. Ortak kimlik ve hesap (SSO mantığı)
4. Rol ve yetki modeli (RBAC)
5. CringeBank işleyişi
6. CringeStore işleyişi
7. CringeBank ↔ CringeStore entegrasyonu
8. Moderasyon, güvenlik, hukuki çerçeve
9. Teknik işleyiş (yüksek seviye)
10. Uçtan uca kullanıcı yolculukları
11. Operasyonel süreçler
12. Production-ready kontrol listesi

---

## 1) Amaç ve Kapsam
Bu doküman;
- Kullanıcı yolculuklarını (journey)
- Modül bazlı işleyişi
- Veri akışlarını
- Roller ve sorumlulukları
- Güvenlik, moderasyon ve hukuki çerçeveyi
- Çapraz entegrasyon noktalarını

tek bir yerde tanımlar.

## 2) Ürünlerin Kısa Tanımı

### 2.1 CringeBank (Sosyal Ağ)
- Kullanıcı üretimi içerik (post/video/foto)
- Takip / akış / keşfet
- Etkileşim (beğeni, yorum, paylaşım, kaydetme)
- DM (mesajlaşma)
- Bildirimler
- Profil, gizlilik, güvenlik ayarları
- (Opsiyonel/ileri) rozetler, yarışmalar, görevler, CG ekonomisi (CringeGold)

### 2.2 CringeStore (Marketplace)
- Çok satıcılı pazar yeri
- Ürün listeleme, kategori & attribute şemaları
- Sepet → sipariş → ödeme → kargo → iptal/iade
- Satıcı paneli, sipariş yönetimi
- **Komisyon snapshot kuralı:** varsayılan %10, belirli düşük marjlı kategoriler %7. Oran, sipariş anında `OrderItem` üzerinde snapshot olarak saklanır.

## 3) Ortak Kimlik ve Hesap Yapısı

### 3.1 Tek hesap (SSO mantığı)
- Tek kullanıcı hesabı hem CringeBank hem CringeStore’da geçerlidir.
- Authentication: e‑posta/telefon + şifre; (opsiyonel) sosyal login.
- Oturum: access token + refresh token.
- Cihaz kimliği + session yönetimi.

### 3.2 Güvenlik beklentileri (yüksek seviye)
- Şüpheli oturum tespiti (genel ilkeler)
- Rate limit / brute-force koruması
- Cihaz listesi ve oturum kapatma
- (Opsiyonel) 2FA

Not: Moderasyon/anti-fraud için istismara açık eşik/algoritma detayları **yayınlanmaz**.

## 4) Rol ve Yetki Modeli (RBAC)

### 4.1 Roller
- **User (Standart):** içerik üretir/tüketir, alışveriş yapar
- **Seller (Satıcı):** mağaza açar, ürün listeler, sipariş yönetir
- **Moderator:** içerik ve yorum moderasyonu
- **Support:** ticket/şikayet yönetimi, iade/uyuşmazlık koordinasyonu
- **Admin:** sistem ayarları, kategori-komisyon, policy yönetimi

### 4.2 Yetki prensibi
- “En az yetki” (least privilege)
- Kritik aksiyonlarda audit log: kimin/ne zaman/ne değiştirdiği

## 5) CringeBank İşleyişi

### 5.1 Ana akışlar

#### 5.1.1 Kayıt/Giriş
- Kayıt
- E‑posta/telefon doğrulama (risk bazlı, detay paylaşılmaz)
- Profil temel kurulum (kullanıcı adı, foto, ilgi alanı opsiyonel)
- Feed’e giriş

#### 5.1.2 Home Feed
Kaynaklar:
- Takip edilenler
- İlgi alanları / tag’ler
- Trend içerikler

Sıralama sinyalleri (yüksek seviye):
- Tazelik (recency)
- İlişki skoru (graph)
- Etkileşim (like/comment/save)
- Negatif sinyal (az göster/ilgilenmiyorum)

Not: Manipülasyonu önlemek için formül/eşik paylaşılmaz.

#### 5.1.3 Keşfet (Explore)
- Trend tag’ler
- Kategori bazlı keşif
- Lokasyon bazlı içerik (varsa)

#### 5.1.4 İçerik oluşturma
- Medya yükleme (foto/video)
- Caption + hashtag + mention
- Görünürlük: herkese açık / takipçilere / yakın çevre vb.

Paylaşım sonrası:
- İçerik indeksleme (search)
- Bildirim tetikleme (mention vb.)
- Moderasyon pipeline (otomatik + şikayet bazlı)

#### 5.1.5 Etkileşim
- Like: hızlı toggle
- Comment: içerik sahibi bildirim alır
- Save: kullanıcıya özel koleksiyon
- Share: uygulama içi paylaşım veya link

#### 5.1.6 DM
- Inbox listesi
- Mesaj istekleri / filtreleme
- Medya paylaşımı
- Abuse/spam tespiti (genel) + rate limit

#### 5.1.7 Bildirimler
- Like/comment/follow/mention
- DM mesajı
- Sistem bildirimi (duyuru, policy güncellemesi)

### 5.2 Gizlilik & güvenlik
- Hesap gizliliği: public / private
- Engelleme / sessize alma / raporlama
- Şikayet akışı: kategori + açıklama + kanıt

### 5.3 Moderasyon (yüksek seviye)
- Otomatik tarama (yüksek risk sınıfları; detay paylaşılmaz)
- İnsan moderatör incelemesi (gerektikçe)
- Aksiyonlar: kaldırma, uyarı, kısıtlama, ban, görünürlük sınırlama (genel)

## 6) CringeStore İşleyişi

### 6.1 Satıcı yaşam döngüsü

#### 6.1.1 Satıcı başvurusu / mağaza açma
- Kimlik / vergi / IBAN / iletişim doğrulama (mevzuata ve iş modeline göre)
- Mağaza profili: ad, logo, açıklama, kargo çıkış lokasyonu
- Satıcı sözleşmesi kabulü
- Onay sonrası ürün ekleme açılır

#### 6.1.2 Ürün ekleme (sihirbaz)
- Draft oluştur
- Başlık/açıklama/foto/fiyat sinyalleri ile kategori öner (opsiyonel)
- Kategori seçilince dinamik attribute formu (zorunlu/opsiyonel)
- Stok, varyant, görseller, kargo bilgisi
- Yayınla

#### 6.1.3 Ürün yönetimi
- Fiyat güncelleme
- Stok güncelleme
- Varyant yönetimi
- Kampanya/indirim (policy’ye uygun)

### 6.2 Alıcı yaşam döngüsü

#### 6.2.1 Ürün keşfi
- Kategori gezinti
- Arama + filtre
- Kişiselleştirilmiş vitrin modülleri (opsiyonel)

Ürün detay sayfası (özet):
- Görseller, açıklama
- Varyant
- Fiyat/indirim
- Kargo tahmini
- İade koşulu özeti
- Satıcı puanı/rozet (varsa)

#### 6.2.2 Sepet → sipariş → ödeme
- Sepete ekle
- Adres seçimi
- Kargo seçimi (satıcı/entegrasyon)
- Ödeme sağlayıcı (iyzico/PayTR/Stripe vb. entegrasyonlara göre)
- Sipariş oluşur, satıcıya bildirim gider

#### 6.2.3 Sipariş yönetimi
Durum örneği:
- `created` → `paid` → `preparing` → `shipped` → `delivered` → `completed`
- Alternatif: `cancelled`, `returned/refunded`

- Kargo takip linki
- Fatura/irsaliye: satıcı sorumluluğu + platform kayıtları

#### 6.2.4 İptal / iade / uyuşmazlık
- Alıcı iptal talebi (duruma göre)
- İade talebi: sebep + foto/video kanıt
- Satıcı onay/ret
- Uyuşmazlıkta platform arabulucu akış: delil, süreler, karar, kayıt

### 6.3 Komisyon ve snapshot kuralı
- Varsayılan komisyon: %10
- Düşük marjlı belirli kategoriler: %7
- Sipariş anında `OrderItem` alanları snapshot:
  - `commissionRate`
  - `commissionAmount`
  - (opsiyonel) `categoryIdSnapshot`, `sellerIdSnapshot`

## 7) CringeBank ↔ CringeStore Entegrasyonu

### 7.1 Temel prensip: otomatik karışma yok
- Bank içerikleri sadece Bank’ta görünür.
- Store ürünleri Bank’ta otomatik dolaşmaz.
- Kullanıcı isterse ürünü Bank’ta **manuel** paylaşabilir.

### 7.2 Entegrasyon senaryoları

#### 7.2.1 Ürün paylaşımı (Store → Bank)
- Ürün sayfasından “CringeBank’ta paylaş”.
- Bank’ta bir post oluşur:
  - Ürün kartı (fiyat, görsel, kısa açıklama)
  - Store deeplink
- Feed kuralı (örnek): Bank feed’inde 10 içerikte 1 ürün kartı (keşfet/ilham alanında daha yoğun olabilir).

#### 7.2.2 Ürün sayfasında ilgili postlar (Bank → Store)
- Store ürün detayında “Bu ürünle ilgili postlar”.
- Sadece **manuel linklenmiş** içerikler gösterilir.
- Otomatik eşleme yok (yanlış eşleşme riskini azaltmak için).

#### 7.2.3 Kimlik / profil birliği
- Tek kullanıcı profili
- Store satın alma geçmişi Bank’ta görünmez (privacy)
- Bank etkileşim geçmişi Store’da görünmez (privacy)

## 8) Moderasyon, Güvenlik, Hukuki Çerçeve

### 8.1 CringeBank (UGC / içerik hukuku)
- UGC yönetimi
- Notice & takedown süreçleri
- Telif, kişilik hakları, nefret söylemi, çıplaklık, şiddet
- Şeffaf “Topluluk Kuralları” + “İtiraz” akışı

### 8.2 CringeStore (aracı hizmet sağlayıcı)
- Mesafeli satış, tüketici mevzuatı, iade süreleri
- Satıcı yükümlülükleri (fatura/ürün doğruluğu/kargo)
- Platform yükümlülükleri (bilgilendirme, kayıt, şikayet yönetimi, arabuluculuk)
- KVKK uyumu (TR öncelikli)

### 8.3 Loglama ve denetim
- Admin/moderatör aksiyonları audit log
- Sipariş ve iade/uyuşmazlık kararları audit log
- Güvenlik olayları (şüpheli login, device değişimi) kayıt

### 8.4 Resmî kaynaklar (TR)
Bu bölüm bilgilendirme amaçlıdır; güncel metinler esastır.
- Mevzuat Bilgi Sistemi: https://www.mevzuat.gov.tr/
- Resmî Gazete: https://www.resmigazete.gov.tr/
- KVKK Kurumu: https://www.kvkk.gov.tr/
- 6698 (KVKK): https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6698&MevzuatTur=1&MevzuatTertip=5
- 5651: https://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.5651&MevzuatIliski=0&sourceXmlSearch=
- 6502: https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6502&MevzuatTur=1&MevzuatTertip=5
- 6563: https://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.6563&MevzuatIliski=0&sourceXmlSearch=
- Mesafeli Sözleşmeler Yönetmeliği (RG): https://www.resmigazete.gov.tr/eskiler/2014/11/20141127-5.htm
- 6493: https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6493&MevzuatTur=1&MevzuatTertip=5
- 6475: https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6475&MevzuatTur=1&MevzuatTertip=5
- 5237 (TCK): https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=5237&MevzuatTur=1&MevzuatTertip=5
- 5846 (FSEK): https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=5846&MevzuatTur=1&MevzuatTertip=5
- 6769 (SMK): https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6769&MevzuatTur=1&MevzuatTertip=5
- TÜRKPATENT: https://www.turkpatent.gov.tr/
- Ticaret Bakanlığı: https://www.ticaret.gov.tr/
- TCMB: https://www.tcmb.gov.tr/
- GİB: https://www.gib.gov.tr/ ve e‑Belge: https://ebelge.gib.gov.tr/
- 4458 (Gümrük Kanunu): https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=4458&MevzuatTur=1&MevzuatTertip=5

## 9) Teknik İşleyiş Mantığı (Yüksek Seviye)

### 9.1 Servis sınırları
- Auth & Identity
- CringeBank Core (posts, feed, interactions, dm, notifications)
- CringeStore Core (catalog, cart, order, payment, shipping, disputes)
- Media (upload/processing)
- Search (içerik + ürün)
- Moderation (queue + workflow)
- Analytics/Eventing

### 9.2 Veri akışı (özet)
- Kullanıcı aksiyonu → API → DB
- (Opsiyonel) Event bus → bildirim/sıralama/analytics
- Medya → object storage + CDN
- Search index güncelleme

## 10) Ana Kullanıcı Yolculukları (Uçtan Uca)

### 10.1 Kullanıcı: içerik tüketir, ürüne gider, alışveriş yapar
- Bank feed’de post görür
- Post içindeki ürün kartına tıklar
- Store ürün sayfası açılır
- Sepete ekler, öder
- Siparişi takip eder

### 10.2 Satıcı: ürün ekler, paylaşır, sipariş yönetir
- Mağaza açar
- Ürün taslağı oluşturur
- Kategori + attribute doldurur
- Yayınlar
- Bank’ta manuel paylaşır
- Sipariş gelir
- Kargolar, durumu günceller
- İade/uyuşmazlık gelirse süreç yönetir

## 11) Operasyonel Süreçler
- Destek talepleri: ticketing, SLA, önceliklendirme
- Uyuşmazlık yönetimi: delil, süre, karar, kayıt
- Kategori & komisyon yönetimi: admin panel + versiyonlama
- Kampanya yönetimi: policy ile sınırlı

## 12) Minimum “Production-Ready” Kontrol Listesi
- Rate limit + abuse kontrolleri
- Audit log
- Yedekleme/restore testleri
- Yetkilendirme testleri (RBAC)
- Medya güvenliği (imzalı URL, opsiyonel zararlı yazılım taraması)
- KVKK süreçleri (veri silme talebi, export)
- Sipariş ve ödeme tutarlılığı (idempotency)

## Ek: Help Center doğrulama (repo)
- “Resmî kaynaklar (TR)” bloklarının kapsama kontrolü için: `scripts/verify-resmi-kaynaklar.ps1`
- Mantık: belirli anahtar kelimeleri içeren HTML sayfalarında ilgili blok başlığının bulunması beklenir.

