# Proyek Android Native DompetKu (Kotlin + Jetpack Compose)

Aplikasi pencatatan keuangan pribadi modern buatan Indonesia dengan arsitektur modern Android:
- **UI Framework**: Jetpack Compose + Material 3 (Material You)
- **Database Lokal**: Android Room SQLite (Persistence offline tanpa internet)
- **Bahasa**: Kotlin 2.0+
- **Mata Uang**: Rupiah (IDR)
- **Navigasi**: Material 3 NavigationBar (Ringkasan, Transaksi, Laporan)

## Cara Membangun APK (Build APK):

### Opsi 1: Menggunakan Android Studio (Direkomendasikan)
1. Buka Android Studio (versi Ladybug / Hedgehog / Iguana / Koala atau lebih baru).
2. Pilih **File** -> **Open**, lalu arahkan ke folder `android/` ini.
3. Tunggu proses Gradle Sync selesai secara otomatis.
4. Hubungkan smartphone Android Anda via kabel USB (aktifkan USB Debugging) atau jalankan Android Emulator.
5. Klik tombol hijau **Run 'app'** (Shift + F10).
6. Untuk menghasilkan file `.apk` mandiri:
   - Pilih menu **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
   - File APK akan tersimpan di: `app/build/outputs/apk/debug/app-debug.apk`.

### Opsi 2: Menggunakan Terminal / Command Line (Gradle)
```bash
cd android
./gradlew assembleDebug
```
File APK siap dipasang pada ponsel Android:
`app/build/outputs/apk/debug/app-debug.apk`

---
*Dibuat khusus untuk pengguna Android di Indonesia.*
