# Panduan Deploy ke Server Ubuntu

Panduan ini menjelaskan langkah-langkah untuk men-deploy aplikasi (Backend Go & Frontend React) ke server Ubuntu menggunakan Docker.

## Prasyarat

1.  **Server Ubuntu** (Disarankan versi 20.04 atau 22.04 LTS).
2.  **Docker** dan **Docker Compose** sudah terinstall.
    - User menyebutkan Docker sudah terinstall. Pastikan plugin compose juga ada (`docker compose version` atau `docker-compose --version`).

## Langkah-langkah Deploy

1.  **Clone Repository**
    Masuk ke server Anda dan clone repository proyek ini.
    ```bash
    git clone <url-repository-anda>
    cd <nama-folder-repo>
    ```

2.  **Setup Environment Variables**
    Salin file contoh environment menjadi file `.env` aktif:
    ```bash
    cp .env.example .env
    ```
    
    Edit file `.env` tersebut dan isi dengan password database yang aman:
    ```bash
    nano .env
    ```
    *Pastikan mengubah password default demi keamanan!*

3.  **Build dan Jalankan Aplikasi**
    
    **Opsi A: Menggunakan Makefile (Lebih Mudah)**
    Jika `make` sudah terinstall di server (`sudo apt install make`), cukup jalankan:
    ```bash
    make build
    make up
    ```
    
    **Opsi B: Menggunakan Docker Compose Manual**
    Jika tidak menggunakan Makefile, jalankan perintah ini:
    ```bash
    docker-compose -f docker-compose.prod.yml up -d --build
    ```
    *Catatan: Jika `docker-compose` tidak ditemukan, coba gunakan `docker compose` (tanpa tanda hubung).*

4.  **Verifikasi Deploy**
    
    Cek apakah semua container berjalan normal:
    ```bash
    docker ps
    ```
    Anda harusnya melihat 3-4 container: `book_web`, `book_api`, `book_db`, dan `migrate` (yang mungkin sudah exit 0 setelah selesai).

    Jika ada masalah, cek log:
    ```bash
    make logs
    # atau
    docker-compose -f docker-compose.prod.yml logs -f
    ```

## Mengakses Aplikasi

- **Frontend Web**: Buka browser dan akses `http://<IP-PUBLIC-SERVER-ANDA>`
- **Backend API**: `http://<IP-PUBLIC-SERVER-ANDA>/api/` (sudah di-proxy otomatis oleh Nginx)

## Cara Update Aplikasi (Redeploy)

Jika ada perubahan kode di repository, lakukan langkah ini di server:

1.  Ambil kode terbaru:
    ```bash
    git pull
    ```
2.  Build ulang dan restart container:
    ```bash
    make build
    make up
    ```
