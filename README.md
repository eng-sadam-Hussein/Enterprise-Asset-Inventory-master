# Nexora AssetOps

Nexora AssetOps is a portfolio-grade enterprise asset and inventory operations system built for a realistic business workflow. The public showcase can run entirely from the React frontend on Vercel while still preserving local authentication, role-based access control, CRUD, stock movements, assignments, maintenance, reports and user management through browser LocalStorage.

## Portfolio positioning

**Product:** Nexora AssetOps  
**Category:** Smart Asset & Inventory Management System  
**Developed by:** Saiman Hussein Mohamed

### Brand palette
- Deep Blue — `#0D47A1`
- Teal — `#11B5A6`
- Orange — `#FF8C00`

The UI uses clean neutral backgrounds around those three brand colors for readability and accessibility.

## Public showcase accounts

| Username | Role | Password |
|---|---|---|
| `admin` | Administrator | `Nexora@2026` |
| `assets` | Asset Manager | `Assets@2026` |
| `inventory` | Inventory Officer | `Stock@2026` |
| `technician` | Technician | `Tech@2026` |
| `auditor` | Auditor | `Audit@2026` |

All five seeded users include portfolio profile photos. Administrators can also upload or replace profile photos for newly created or existing users. Photos are resized in the browser and persisted in LocalStorage together with the user profile.

## Main modules
- Executive Dashboard
- Asset Registry
- Inventory Control
- Custody & Assignments
- Maintenance Center
- Asset / QR Lookup
- Reports & CSV Export
- Access Control
- System Settings & JSON workspace backup/restore
- Local activity audit trail

## Local-first portfolio mode
The Vercel showcase does not require the Spring Boot API or PostgreSQL to be online. The frontend maintains its own local workspace data layer with:
- persistent browser data
- role-based permissions
- user login validation
- asset create/update/delete
- stock create/update/delete
- stock in/out transactions
- asset assignment and return
- maintenance lifecycle updates
- user creation/update/delete
- compressed profile photo upload
- seeded workspace restore
- portable JSON workspace export/import

This makes the public portfolio link fully interactive while keeping the original Spring Boot + PostgreSQL architecture inside the repository for a conventional full-stack deployment.

## Frontend setup
```powershell
cd frontend
npm install
npm run dev
```

Production validation:
```powershell
npm run build
```

## Vercel deployment
Import the repository into Vercel and use:
- **Root Directory:** `frontend`
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

`frontend/vercel.json` includes SPA route rewriting so page refreshes work with React Router.

## Optional backend
The `Backend` folder contains the Spring Boot API, JWT security, role enforcement, PostgreSQL integration, reporting endpoints and server-side CRUD. The database schema is under `database/schema.sql`.

## Version 5 interface refinement
- More compact desktop scale at browser 100%
- 248px responsive navigation and denser tables/cards
- Cleaner username/password icon spacing and visible placeholders
- Public login directory reduced to username, password and department only
- Redesigned executive dashboard with status mix, readiness trend and quick workflows
- New System Settings page for backup, import and portfolio data recovery
- Login credit: **Developed by Saiman Hussein Mohamed · Freelancer on Upwork**

## Portfolio media checklist
Recommended Upwork screenshots:
1. Premium login with Nexora building carousel and public credential directory
2. Executive dashboard
3. Asset Registry
4. Inventory Control + stock movement
5. Assignments workflow
6. Maintenance Center
7. Reports & Insights
8. Access Control with user profile photos and roles
9. System Settings with local-first backup and recovery

Recommended short video: 60–90 seconds showing login → dashboard → asset CRUD → stock movement → assignment → maintenance → reports → role switching.
