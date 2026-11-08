# IT Academy — React + Vite Frontend

Responsive React frontend for the IT Academy Express API.

## Included
- Public home, course catalogue, course details, instructors, notices and result lookup pages.
- Student registration page with client-side validation, password confirmation and show/hide password.
- Student/admin sign-in page and a separate admin-only sign-in route.
- Admin workspace with overview chart, course and notice CRUD, instructor creation/listing, searchable tables, refresh controls and account details.
- Mobile responsive navigation and admin layout.
- Axios API client, bearer-token attachment, refresh handling, TanStack Query caching, React Hook Form + Zod validation and Framer Motion.

## Run locally
Use Node.js 20.19+ or 22.12+.

```bash
npm install
cp .env.example .env
npm run dev
```

For Windows PowerShell, copy the environment file with:

```powershell
Copy-Item .env.example .env
```

Production build:

```bash
npm run build
npm run preview
```

## API configuration
Default backend: `https://itbackend-1.onrender.com`

Set `.env` if your backend URL is different:

```env
VITE_API_BASE_URL=https://itbackend-1.onrender.com
```

## Authentication and registration contract
The existing frontend login endpoint is `POST /api/auth/login`.

The new registration page expects this endpoint to exist on the backend:

`POST /api/auth/register`

Request body:

```json
{
  "name": "Student Name",
  "email": "student@example.com",
  "password": "at-least-8-characters"
}
```

The endpoint should validate input, hash the password (never store plain text), reject duplicate email addresses, and create a regular student account—not an administrator. A success response may use the backend's standard `{ data: ... }` envelope. After registration, the student is sent to the sign-in page.

**Important:** the previously supplied backend documentation did not include a register route. If `POST /api/auth/register` is not implemented/deployed, the registration page will show a clear endpoint-not-available message; the frontend cannot create a database account by itself.

Login should return an access token and user object, for example:

```json
{
  "data": {
    "accessToken": "...",
    "user": { "_id": "...", "name": "Student Name", "email": "student@example.com", "role": "student" }
  }
}
```

The user object must include a `role`. Admin roles supported by the UI are `admin` and `superadmin`; other signed-in users are directed to the course catalogue.

## Existing backend limitations to resolve
1. The supplied `src/routes/result.routes.js` was wired to the notice controller instead of the result controller. Result lookup/management will remain unavailable until the backend route is corrected.
2. The supplied teacher admin routes only supported `POST /api/v1/admin/teachers`. The UI therefore supports creating and listing teachers; edit/delete controls are not shown until backend update/delete routes exist.
3. Notice fields in the supplied backend were `title`, `slug`, and `status`; the notice form intentionally sticks to those supported fields.
4. Backend authorization must enforce administrator roles on every `/api/v1/admin/*` endpoint. Frontend route guards are only a user-interface safeguard and are not security boundaries.
5. Restrict CORS to your deployed frontend origin and enable credentials only with an explicit allowed origin.
6. Keep backend secrets and JWT secrets on the server. Never put them in Vite environment variables exposed to the browser.

## Notes
- Admin content endpoints used by the UI: `/api/v1/admin/courses`, `/api/v1/admin/notices`, and `/api/v1/admin/teachers`.
- Public data endpoints: `/api/v1/courses`, `/api/v1/teachers`, and `/api/v1/notices`.
- Search in the admin tables is client-side over the currently loaded records.


## Image uploads (matched to the supplied backend)
- **Teacher profiles:** Admin → Teachers → Add teacher. Select a profile image; the frontend sends it as multipart field `image` to `POST /api/v1/admin/teachers`.
- **Course banners:** Admin → Courses → Add course. Select a banner; the frontend sends it as multipart field `banner` to `POST /api/v1/admin/courses`.
- Image files are validated in the browser (image MIME type, maximum 5 MB) and previewed before saving. The backend stores uploaded files through its configured ImageKit service.
- The supplied backend currently accepts a course banner on create, but its update controller does not process a replacement banner. Teacher update/delete routes are also not implemented, so teacher records are create-and-view in this frontend.
- The supplied notice controller/model do not persist an image field, so this frontend intentionally does not show a notice image picker that would appear to upload but would silently discard the image.

## Backend compatibility notes
- The supplied backend's `result.routes.js` currently registers notice handlers instead of result handlers. Result lookup therefore requires correcting that backend route before it can work.
- The backend's `authenticate` middleware verifies a token but does not enforce an admin role itself. Ensure admin authorization is enforced server-side before production use; frontend route guards are not a security boundary.
- Keep the backend `.env` file and all database, JWT and ImageKit secrets on the server. Do not copy backend secrets into this frontend project.
