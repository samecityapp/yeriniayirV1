# Kişisel yönetici kurulumu

Parola ve MFA kodları sohbete, Codex araç girişine veya dosyaya alınmaz. Codex'in kullandığı test parolaları kişisel hesaba taşınmaz.

1. Önce test projesinde `Authentication → Users → Add user / Create user` açılır. Kullanıcı kendi e-postasını ve parola yöneticisinin ürettiği yeni parolasını Supabase ekranına kendisi girer. Parolanın Codex'e iletilmesi gerekmez. Bu, Dashboard giriş parolası değildir.
2. Yalnızca oluşan kullanıcı UUID'si (parola veya token değildir) yetkilendirme için alınır. `scripts/cloud/staging_operations.py grant-admin` doğru staging projesini, doğrulanmış e-postayı ve anonim olmayan hesabı kontrol eder. Public signup veya metadata yönetici olma hakkı vermez.
3. Kullanıcı `http://127.0.0.1:3401/tr/gastronomi-yonetimi` sayfasında kendi e-postası ve parolasıyla giriş yapar. Kodex bu ekranda parola alanını veya MFA değerlerini okumaz, ekran görüntüsü almaz.
4. İlk girişte resmi Supabase Auth TOTP QR'ı gösterilir. Kullanıcı bunu kendi doğrulayıcı uygulamasıyla okutur ve kodu doğrudan uygulamaya girer. Paylaşması, sohbete yazması veya Codex'e söylemesi gerekmez. Anahtar varsayılan olarak açık metin gösterilmez; elle kurulum gerekirse kullanıcı kendisi açabilir.
5. MFA tamamlanmadan kaynaklar veya yazma RPC'leri açılmaz. Çıkış sonrası çerez silinir ve gerçek Auth oturumu reddedilir. Üyelik iptalinde eski JWT yetki kazanmaz.

Üretim hesabı ayrı Supabase Auth kimliğidir. Staging UUID'si veya test parolası production'a kopyalanmaz. Production yetki ataması ayrı onayla, seçilen gerçek kullanıcıya yapılır. Geçici 42 RLS engeli bu kurulum sırasında kaldırılmaz.

Korumalı HTTPS önizlemede Secure çerez ve SameSite/Origin kontrolleri ayrıca doğrulanmadan production etkinleştirilmez. Yerel kurulum URL'si yalnızca loopback'te çalışır; halka açık bir kurulum veya herkese açık admin kayıt yolu yoktur.
