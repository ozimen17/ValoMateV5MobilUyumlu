# VALOMATE - cPanel Kurulum Talimatları

## 📋 Gereksinimler

- cPanel hosting hesabı
- PHP 7.4 veya üzeri
- MySQL veritabanı
- phpMyAdmin erişimi

## 🗂️ Dosya Yapısı

```
cpanel_version/
├── index.html                  # Ana sayfa
├── database.php               # Veritabanı bağlantı dosyası
├── install.sql               # Veritabanı kurulum script'i
├── cleanup_cron.php          # Cron job dosyası
├── api/                      # API endpoint'leri
│   ├── games.php
│   ├── players.php
│   ├── delete_player.php
│   ├── cleanup.php
│   └── health.php
├── js/                       # JavaScript dosyaları
│   ├── app.js
│   └── form.js
└── KURULUM_TALIMATLARI.md    # Bu dosya
```

## 🚀 Kurulum Adımları

### 1. Dosyaları Hostinginize Yükleme

1. **cPanel'e giriş yapın**
2. **File Manager'ı açın**
3. **public_html** klasörüne gidin
4. **cpanel_version** klasörünün tüm içeriğini public_html'e kopyalayın
5. Dosya izinlerini kontrol edin:
   - `.php` dosyaları: 644
   - Klasörler: 755

### 2. MySQL Veritabanı Oluşturma

#### cPanel ile Veritabanı Oluşturma:
1. **cPanel → MySQL Databases**
2. **Create New Database** kısmında:
   - Database Name: `valomate_db` (veya istediğiniz isim)
   - **Create Database** butonuna tıklayın

#### MySQL Kullanıcısı Oluşturma:
1. **MySQL Users** kısmında:
   - Username: `valomate_user` (veya istediğiniz isim)
   - Password: **Güçlü bir şifre belirleyin**
   - **Create User** butonuna tıklayın

#### Kullanıcıyı Veritabanına Bağlama:
1. **Add User to Database** kısmında:
   - User: Oluşturduğunuz kullanıcıyı seçin
   - Database: Oluşturduğunuz veritabanını seçin
   - **Add** butonuna tıklayın
   - **ALL PRIVILEGES** seçin ve **Make Changes** yapın

### 3. Veritabanı Bağlantı Bilgilerini Güncelleme

**database.php** dosyasını düzenleyin:

```php
<?php
// Bu bilgileri kendi hosting bilgilerinizle güncelleyin
$db_host = 'localhost';           // Genellikle localhost
$db_username = 'cpanel_username_valomate_user';  // cPanel_kullanıcıadı_dbkullanıcısı
$db_password = 'your_password';   // Oluşturduğunuz şifre
$db_name = 'cpanel_username_valomate_db';        // cPanel_kullanıcıadı_dbadı
?>
```

**🚨 ÖNEMLİ:** cPanel hosting'lerde genellikle:
- **Username format:** `cpanel_kullanıcıadı_db_kullanıcısı`
- **Database format:** `cpanel_kullanıcıadı_db_adı`

### 4. SQL Tabloları Oluşturma

1. **cPanel → phpMyAdmin**
2. Oluşturduğunuz veritabanını seçin
3. **SQL** sekmesine tıklayın
4. **install.sql** dosyasının içeriğini kopyalayın
5. SQL alanına yapıştırın ve **Go** butonuna tıklayın

### 5. Cron Job Kurulumu (Otomatik Temizleme)

#### cPanel Cron Job Oluşturma:
1. **cPanel → Cron Jobs**
2. **Add New Cron Job** kısmında:
   - **Minute:** `*/5` (Her 5 dakikada)
   - **Hour:** `*`
   - **Day:** `*`
   - **Month:** `*`
   - **Weekday:** `*`
   - **Command:** `/usr/bin/php /home/kullanıcıadı/public_html/cleanup_cron.php`

**🔍 Komut Yolu Bulma:**
```bash
# SSH ile bağlandıktan sonra
pwd
# Çıktı: /home/kullanıcıadı/public_html
```

### 6. Test Etme

1. **Web sitenizi açın:** `http://yourdomain.com`
2. **API test:** `http://yourdomain.com/api/health.php`
3. **Veritabanı test:** Yeni oyuncu eklemeyi deneyin

## 🔧 Yaygın Sorunlar ve Çözümleri

### Problem 1: Database Connection Error
**Çözüm:**
- `database.php` dosyasındaki bilgileri kontrol edin
- cPanel'de veritabanı kullanıcısının doğru izinlere sahip olduğundan emin olun

### Problem 2: 500 Internal Server Error
**Çözüm:**
- Error Log'larını kontrol edin (cPanel → Error Logs)
- Dosya izinlerini kontrol edin
- PHP sürümünü kontrol edin (PHP 7.4+ gerekli)

### Problem 3: JSON Response Hatası
**Çözüm:**
- `php.ini` dosyasında `display_errors = Off` olduğundan emin olun
- API endpoint'lerinin doğru çalıştığını kontrol edin

### Problem 4: Cron Job Çalışmıyor
**Çözüm:**
- Cron job komutundaki yolu kontrol edin
- `cleanup_cron.php` dosyasının çalışma izni olduğundan emin olun
- cPanel Cron Job log'larını kontrol edin

## 📊 Özellikler

### ✅ Çalışan Özellikler:
- ✅ Oyuncu ekleme/listeleme
- ✅ Filtreleme (oyun modu, aranan kişi, mikrofon)
- ✅ Arama fonksiyonu
- ✅ Lobi kodu kopyalama
- ✅ Otomatik temizleme (30 dakika)
- ✅ Responsive tasarım
- ✅ Gerçek zamanlı güncelleme
- ✅ Form validation
- ✅ Toast bildirimler

### 🎨 Tasarım Özellikleri:
- Modern, karanlık tema
- Tailwind CSS ile responsive tasarım
- Valorant teması
- Rank görselleri
- Animasyonlar ve geçişler

## 🔒 Güvenlik Notları

1. **database.php** dosyasını web erişiminden koruyun
2. **Error reporting'i** production'da kapatın
3. **SQL injection** koruması aktif
4. **XSS** koruması uygulanmış
5. **CORS** ayarları yapılandırılmış

## 📱 Kullanım

1. **Ana sayfa:** Oyuncu listesi ve filtreleme
2. **Oyuncu ekleme:** Sağ alt köşedeki + butonuna tıklayın
3. **Arama:** Üst taraftaki arama kutusunu kullanın
4. **Filtreleme:** Oyun modu, aranan kişi, mikrofon filtrelerini kullanın
5. **Lobi kodu:** Kod'a tıklayarak kopyalayın

## 🚀 Performans Optimizasyonu

1. **Veritabanı indexleri** tanımlanmış
2. **Otomatik temizleme** ile eski kayıtlar silinir
3. **Efficient queries** kullanılır
4. **CDN** üzerinden Tailwind CSS yüklenir

## 📞 Destek

Kurulum sırasında sorun yaşarsanız:
1. Error log'larını kontrol edin
2. API endpoint'lerini test edin
3. Veritabanı bağlantısını kontrol edin
4. PHP sürümünüzü kontrol edin

---

**🎮 VALOMATE - Valorant Takım Arkadaşı Bulma Platformu**

*Bu platform PHP 7.4+ ile geliştirilmiş ve cPanel hosting için optimize edilmiştir.*