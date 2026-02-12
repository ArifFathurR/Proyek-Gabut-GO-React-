# Panduan Deploy ke Server Ubuntu

## Akses Aplikasi (Update Port)

Kini aplikasi berjalan di **Port 8081** untuk menghindari bentrok dengan web server lain.

- **Frontend Web**: `http://<IP-PUBLIC-SERVER-ANDA>:8081`
- **Backend API**: `http://<IP-PUBLIC-SERVER-ANDA>:8081/api/`

## Cara Update

1.  `git pull`
2.  `make up` (atau `docker compose up -d`)
