# Cringestore Yardım Merkezi — Kapsam, IA ve Hukuki Çerçeve (TR)

> Amaç: Cringestore (pazaryeri / e-ticaret platformu) için **alıcı + satıcı** tarafını kapsayan Yardım Merkezi bilgi mimarisi (IA), uyuşmazlık/iadeler/ödemeler ve yayınlanacak-yayınlanmayacak bilgi sınırlarını hukuki risk gözeterek belirlemek.
>
> Not: Bu doküman **hukuki danışmanlık değildir**. Mesafeli satış, aracı hizmet sağlayıcı yükümlülükleri ve KVKK metinleri yayına alınmadan önce avukat/DPO ile finalize edilmelidir.

## 0) Ürün Tanımı ve Rolümüz (kullanıcıya da anlatılacak)
- Cringestore bir **pazaryeri platformudur**.
- Platform olarak rolümüz (iş modeline göre net cümle):
  - "Aracı platform" (satıcı ile alıcıyı buluştururuz),
  - Ücret/komisyon/hizmet bedeli kalemleri ve kimden tahsil edildiği,
  - Uyuşmazlıkta **süreç işletiriz**, hukuki hakları kısıtlamayız.

## 1) Yayın Politikası (kritik)
### 1.1 Kullanıcıya GÖSTER (Public Help)
- Sipariş/ödeme/kargo/iade akışları ve süreler
- Cayma hakkı/iade istisnaları (ürün türüne göre) — genel, sözleşmeye bağlı
- Uyuşmazlık çözüm adımları (kanıt, zaman çizelgesi, sonuç türleri)
- Satıcı kuralları + yasaklı ürünler
- Platform ücreti/komisyon hesaplama örnekleri (şeffaflık)
- KVKK aydınlatma + başvuru kanalı
- Ticari ileti izin/ret (pazarlama varsa)

### 1.2 Kullanıcıya GÖSTERME (Internal / Runbook)
**Asla yayınlanmayacak:**
- Fraud/chargeback risk eşikleri, otomatik bloklama kuralları
- Satıcı risk skorları ve kara liste kriterleri
- Dolandırıcılık tespit sinyalleri, cihaz parmak izi vb.
- İç soruşturma akışları, log saklama/erişim detayları
- Kargo/ödeme sağlayıcı anlaşma koşullarının güvenlik maddeleri

## 2) Müdahale Sınırları
### 2.1 Müdahale Edebiliriz
- Sipariş/ödeme kayıtlarını inceleyip teknik destek sağlamak
- İlan kaldırma / satıcıyı askıya alma (kural ihlali, sahte ürün şüphesi vb.)
- İade/uyuşmazlık akışını işletmek (kanıt toplama, süre yönetimi)
- Dolandırıcılık şüphesinde işlemi geçici dondurmak (sözleşmesel yetkiyle)
- Platform ücretleri/komisyonlar hakkında şeffaf bilgilendirme

### 2.2 Müdahale Edemeyiz / Etmemeliyiz
- Banka iade sürelerini "anında" yapmak (bankaya bağlı)
- Kargo firmasının fiziksel gecikmesini garanti çözmek
- Tüketici yasal haklarını kısaltmak (cayma hakkı vb.)
- Satıcının vergi/fatura yükümlülüğünü platformun üstlenmesi (bilgilendiririz)
- Uyuşmazlıkta “kesin hüküm” veren hukuki değerlendirme (süreç + kanıt)

## 3) Hukuki Referans Haritası (TR odaklı — doğrulama şart)
- **6502 Tüketicinin Korunması Hakkında Kanun** ve ilgili ikincil düzenlemeler (mesafeli satış/cayma/iade).
- **Mesafeli Sözleşmeler Yönetmeliği**: ön bilgilendirme, cayma hakkı prosedürü, istisnalar.
- **6563 Elektronik Ticaretin Düzenlenmesi Hakkında Kanun**: elektronik ticaret, bilgilendirme yükümlülükleri, ticari ileti.
- **KVKK (6698)**: aydınlatma, açık rıza, ilgili kişi hakları.
- **İYS / Ticari ileti** (e-posta/SMS pazarlama yapılıyorsa): izin ve ret yönetimi.
- **ETBİS** gibi kayıt/bildirim yükümlülükleri: iş modeline göre ayrıca kontrol.

## 4) Bilgi Mimarisi (IA) — Cringestore Public Help

### 4.1 Başlangıç & Satın Alma
- Cringestore nedir? Cringebank ile ilişkisi
- Ürün arama/filtreleme/sıralama
- Sepet, favoriler (varsa)
- Sipariş oluşturma adımları
- Sipariş durumu sözlüğü (Hazırlanıyor/Kargoda/Teslim edildi vb.)

### 4.2 Ödeme & Güvenlik
- Ödeme yöntemleri (kredi/banka kartı vb.)
- 3D Secure (varsa) ve başarısız ödeme senaryoları
- Provizyon nedir? İade tutarı ne zaman yansır?
- Şüpheli işlem bildirme
- Fatura bilgileri (e-fatura/e-arşiv varsa) — genel bilgilendirme

### 4.3 Sipariş, Kargo, Teslimat
- Kargo takip
- Teslimat gecikmesi: ne yapmalıyım?
- Hasarlı paket: teslim anında yapılacaklar
- Eksik/yanlış ürün
- Teslim alındı onayı (varsa) ve etkileri
- İade kargosu süreci

### 4.4 İade, Cayma Hakkı, İptal
- Cayma hakkı nedir? Nasıl kullanılır? (adım adım)
- İade/iptal koşulları (ürün türüne göre istisnalar)
- Bedel iadesi süreleri (banka/ödeme kuruluşuna göre değişebilir)
- Kargo ücreti iade koşulları (modelinize göre)

### 4.5 Uyuşmazlık Çözümü
- Satıcı ile mesajlaşma/iletişim
- Kanıt toplama (foto/video, paket etiketi, yazışma)
- Platform inceleme adımları (genel)
- Olası sonuçlar (iade, kısmi iade, değişim yönlendirmesi, ret)
- Resmî başvuru yollarına yönlendirme (genel bilgilendirme; hukuki tavsiye değil)

### 4.6 Ürün & Satıcı Bilgileri
- Satıcı profili/puan/yorumlar nasıl çalışır
- Satıcıyla iletişim
- Ürün yorumları: kurallar, yayınlanmama sebepleri
- Sahte/kaçak ürün şüphesi raporlama

### 4.7 Kampanyalar, Kuponlar, Cüzdan/CringeGold (varsa)
- Kupon/indirim nasıl uygulanır
- Cüzdan/puan kullanım şartları (limit, süre, iade etkisi)
- Kampanya iptali, fiyat değişimi, stok biterse

### 4.8 Satıcı Paneli (KYB/KYC + Operasyon)
- Satıcı başvurusu ve doğrulama (KYB/KYC varsa)
- Ürün listeleme: zorunlu alanlar, görsel kuralları
- Kategori & varyantlar
- Stok/fiyat güncelleme
- Sipariş hazırlama, kargo etiketi/barkod
- İade talepleri: onay/ret gerekçeleri (standartlaştırılmış)
- Satıcı performans metrikleri (gecikme/iptal oranı) — **eşik yok**

### 4.9 Komisyon, Ücretler, Satıcı Ödemeleri
- Platform komisyonu: oranlar ve hesaplama
- Kesinti kalemleri (hizmet bedeli, ödeme hizmeti, kargo anlaşması vb.)
- Hakediş ve ödeme takvimi
- Vergi/fatura yükümlülükleri: satıcı bilgilendirme (sorumluluk satıcıda)

### 4.10 Hukuki Metinler & Bilgilendirme (Public)
- Ön Bilgilendirme Formu (sipariş öncesi)
- Mesafeli Satış Sözleşmesi
- İade/Cayma Prosedürü
- Gizlilik/KVKK metinleri
- Çerez politikası (web varsa)
- Platform Kuralları (alıcı & satıcı)
- Ticari ileti yönetimi (izin/ret)

### 4.11 Teknik Sorunlar (Store)
- Ürün sayfası açılmıyor
- Ödeme ekranı hata veriyor
- Kupon uygulanmıyor
- Kargo takip güncellenmiyor
- Sipariş geçmişi görünmüyor

## 5) “Hukuki risk yok” için minimum zorunlu sayfalar (öneri)
> Bu liste minimumdur; iş modeline göre genişler.
- Gizlilik Politikası + KVKK Aydınlatma (Cringestore kapsamı net)
- KVKK Başvuru Süreci (iletişim kanalı + doğrulama adımları)
- Ön Bilgilendirme Formu
- Mesafeli Satış Sözleşmesi
- İade/Cayma Prosedürü (istisnalar dahil)
- Ödeme & Güvenlik (provizyon/iade süreleri dahil)
- Yasaklı Ürünler & Satıcı Kuralları
- Uyuşmazlık Çözüm Politikası
- İletişim & Destek Kanalları
- Kolluk/mahkeme talepleri için **genel** bilgilendirme (iç prosedür yok)

## 6) İçerik Şablonu (makale yazım standardı)
Her makale için:
- **Konu özeti**
- **Adım adım süreç** (kim ne yapar)
- **Zaman çizelgesi** (platform yanıt süresi / satıcı yanıt süresi / banka)
- **Gerekli belgeler/kanıtlar**
- **Platform rolü ve sınırlar**
- **İlgili sözleşme/politika linki**

## 7) TODO (derin araştırma ile doldurulacak)
- Ön bilgilendirme + mesafeli satış sözleşmesi metinleri (avukat onayıyla)
- Cayma/iade istisnaları ve ürün bazlı kurallar (katalog yapısı)
- Uyuşmazlık akışı: SLA’lar (public) + iç runbook (private)
- Ticari ileti izin/ret (IYS entegrasyonu varsa) metinleri
- ETBİS/diğer e-ticaret yükümlülükleri: iş modeline göre kontrol listesi
