# 🎵 SoundWave - Spotify Clone 

## Tech Stack
- **Backend**: ASP.NET Core 8 Web API (SQLite, JWT, BCrypt)
- **Frontend**: Angular 17 (Standalone Components, Signals)
- **DB**: SQLite (auto-created on first run)

---

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://sound-wave-kappa.vercel.app)

---

## 📁 Project Structure
```
spotify-app/
├── backend/           ← ASP.NET Core Web API
│   ├── Controllers/
│   ├── Data/          ← DbContext + Seeding
│   ├── Models/
│   ├── DTOs/
│   ├── Program.cs
│   └── appsettings.json
└── frontend/          ← Angular 17
    └── src/app/
        ├── pages/
        │   ├── login/
        │   ├── dashboard/
        │   ├── songs/
        │   ├── liked/
        │   ├── history/
        │   ├── playlists/
        │   └── admin/
        │       ├── admin-songs/   ← CRUD
        │       └── admin-users/
        ├── layout/       ← Sidebar + Player
        ├── services/
        ├── guards/
        └── interceptors/
```

---

## 🔐 Login Credentials
| Username | Password | Role  |
|----------|----------|-------|
| admin    | admin    | Admin |
| user     | user     | User  |

---

## 🚀 HOW TO RUN

### STEP 1: Run the Backend (Visual Studio Community)

1. Open **Visual Studio Community 2022**
2. Click **"Open a project or solution"**
3. Navigate to `spotify-app/backend/` and open `SpotifyApp.API.csproj`
4. Visual Studio will restore NuGet packages automatically
5. Press **F5** or click the green ▶ Run button
6. The API starts at `http://localhost:5000`
7. Swagger UI available at: `http://localhost:5000/swagger`

> **Note**: The SQLite database (`spotify.db`) is auto-created in the project folder on first run. All tables and seed data are inserted automatically — no migrations needed!

### STEP 2: Run the Frontend (Angular CLI)

Open a terminal (PowerShell or cmd):

```bash
# Navigate to frontend folder
cd spotify-app/frontend

# Install dependencies (first time only)
npm install

# Start the dev server
npm start
# or
ng serve
```

App runs at: **http://localhost:4200**

---

## ✨ Features

### 👤 User Features
- 🔐 Login with JWT authentication
- 🎵 Browse all songs (search + genre filter)
- ▶ Play songs with a full player bar (play/pause, next/prev, seek, volume)
- 💚 Like/unlike songs
- 📋 Create and manage personal playlists
- ➕ Add/remove songs from playlists
- 🕐 Play history (last 50 plays, with timestamps)
- 🏠 Dashboard with recently played + featured songs

### 🔑 Admin Features (additional)
- ➕ **Create** songs (with URL, cover, artist, genre, duration)
- ✏️ **Edit** existing songs
- 🗑 **Delete** songs
- 👥 **View all users** (username, role, join date)
- 📊 Stats dashboard (total songs, artists, genres, play count)

---

## 🎧 Song Sources
Songs use open-source audio from **SoundHelix** (`soundhelix.com`) — free royalty-free MP3s.

To add your own songs as admin:
1. Login as `admin`
2. Go to **Manage Songs** → **Add Song**
3. Use any public MP3 URL (e.g., from Free Music Archive, Jamendo, SoundHelix)
4. Free audio sources:
   - https://soundhelix.com/examples/mp3/
   - https://freemusicarchive.org
   - https://www.jamendo.com/start
   - https://ccmixter.org

---

## 🔧 Configuration

### Backend — `appsettings.json`
```json
{
  "Jwt": {
    "Key": "SpotifyAppSuperSecretKey_2024_DoNotShare!",
    "Issuer": "SpotifyApp",
    "Audience": "SpotifyAppUsers"
  }
}
```

### Backend Launch Settings (if port differs)
Edit `Properties/launchSettings.json` or set:
```json
"applicationUrl": "http://localhost:5000"
```

### Frontend API URL
If backend runs on different port, edit `src/app/services/auth.service.ts`:
```ts
private api = 'http://localhost:5000/api';
```
(Same change in `song.service.ts`, `other.services.ts`)

---

## 🐛 Troubleshooting

**CORS error?**
- Make sure backend is running on port 5000
- Check that Angular is on port 4200

**"Cannot find module" errors in Angular?**
```bash
npm install
```

**Database not created?**
- Make sure the backend project has write permissions to its folder
- Check Visual Studio Output window for errors

**NuGet restore fails?**
- Tools → NuGet Package Manager → Package Manager Console → `Update-Package -reinstall`

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | None | Login |
| GET | /api/songs | User | Get all songs |
| GET | /api/songs/liked | User | Get liked songs |
| POST | /api/songs/{id}/play | User | Record play |
| POST | /api/songs/{id}/like | User | Toggle like |
| POST | /api/songs | Admin | Create song |
| PUT | /api/songs/{id} | Admin | Update song |
| DELETE | /api/songs/{id} | Admin | Delete song |
| GET | /api/history | User | Play history |
| DELETE | /api/history | User | Clear history |
| GET | /api/playlists | User | Get playlists |
| POST | /api/playlists | User | Create playlist |
| POST | /api/playlists/{id}/songs/{songId} | User | Add song |
| DELETE | /api/playlists/{id}/songs/{songId} | User | Remove song |
| DELETE | /api/playlists/{id} | User | Delete playlist |
| GET | /api/users | Admin | Get all users |
