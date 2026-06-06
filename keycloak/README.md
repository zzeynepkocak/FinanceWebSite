# Keycloak – API koruması

## Keycloak'ı çalıştırma

Proje kökünde:

```bash
docker compose up -d
```

- **Admin konsol:** http://localhost:8180  
- **Giriş:** `admin` / `admin`  
- **Realm:** `toyota-finance` (ilk açılışta realm import ile oluşturulur)

## Token alarak API çağrısı

**1. Token al (Password Grant – sadece test için):**

```bash
curl -X POST "http://localhost:8180/realms/toyota-finance/protocol/openid-connect/token" ^
  -H "Content-Type: application/x-www-form-urlencoded" ^
  -d "username=kullanici" ^
  -d "password=sifre123" ^
  -d "grant_type=password" ^
  -d "client_id=finance-portal-app"
```

`access_token` alanını kopyala.

**2. Kredi API'sini çağır:**

```bash
curl -X POST "http://localhost:8080/api/loans" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer <ACCESS_TOKEN>" ^
  -d "{\"customerName\":\"Ahmet Yilmaz\",\"loanAmount\":50000}"
```

Token yoksa veya geçersizse `401 Unauthorized` döner.

## Varsayılan test kullanıcısı (realm import)

- **Kullanıcı adı:** `kullanici`  
- **Şifre:** `sifre123` (ilk girişte değiştirilmesi istenir)  
- **Rol:** `user` (bu rol ile `/api/loans` erişilebilir)
