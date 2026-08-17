# Nexora AssetOps — Optional Spring Boot API

This folder contains the server-side reference implementation for Nexora AssetOps.

The public Vercel portfolio build uses the React application's local-first persistence mode so reviewers can exercise all workflows without a running server. This backend can be used when a traditional API + PostgreSQL deployment is preferred.

## Stack

- Java 17
- Spring Boot
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL
- Apache POI / OpenPDF reporting
- ZXing QR / barcode support

## Run database

```bash
cd Backend
docker compose up -d
```

## Run API

```bash
cd Backend
mvn spring-boot:run
```

API: `http://localhost:8080`

## Seeded accounts

| Username | Password | Role |
|---|---|---|
| admin | Nexora@2026 | ADMIN |
| assets | Assets@2026 | ASSET_MANAGER |
| inventory | Stock@2026 | INVENTORY_OFFICER |
| technician | Tech@2026 | TECHNICIAN |
| auditor | Audit@2026 | AUDITOR |

The Spring Security rules restrict write operations by role:
- Asset Manager: asset + assignment write operations
- Inventory Officer: stock write operations
- Technician: maintenance write operations
- Auditor: authenticated read access
- Administrator: full access including user management
