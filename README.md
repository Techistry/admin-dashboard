# 🔧 Admin Dashboard

This is the internal management dashboard for tools, categories, reviews, settings, and admin users. It is built with React and deployed using Hostinger’s Git integration.

## 🧱 Tech Stack
- React.js
- React Router DOM
- React.lazy (code splitting)
- nProgress (page loader)
- CSS Modules

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- NPM or Yarn

### Installation
```bash
git clone https://github.com/your-org/admin-dashboard.git
cd admin-dashboard
cp .env.example .env
npm install
npm run dev
```
Access the app at:  
`http://localhost:3000`

## 🌐 Routes Overview
- `/` – Login  
- `/forgot-password`  
- `/verify-email`  
- `/dashboard`  
- `/tools`, `/tool/view/:id`, `/tool/edit/:id`  
- `/categories`, `/category/view/:id`  
- `/reviews`, `/review/view/:id`  
- `/settings`  
- `/admins`  

## 🔐 Environment Variables (`.env.example`)
```env
VITE_BASE_URL=
VITE_BASE_URL_PROD=
```

## 📦 Deployment on Hostinger (via Git)
1. Go to Hostinger > Git in your control panel  
2. Add your GitHub repo and branch  
3. Set deployment directory (e.g., `/public_html/admin`)  
4. Enable auto-deploy  
5. Add build script:
   ```
   npm install
   npm run build
   ```

## 🔄 Updating Production
To deploy changes, just:
```bash
git push origin main
```

## 📜 Changelog
**v1.0.0 – August 2025**  
- Full CRUD for all admin modules  
- Authentication flow with email verification  
- Lazy loading and dashboard metrics  

## 🛠️ Maintenance Notes
- Update dependencies monthly (`npm outdated`)  
- Rotate admin credentials regularly  
- Keep .env and API keys updated
