# File Tree: ToursandTravelsCRM/frontend


├── 📁 public
│   └── 📁 data
│       ├── 📄 countries.csv
│       ├── 📄 customers.csv
│       └── 📄 tours.csv
├── 📁 src
│   ├── 📁 api
│   │   ├── 📄 ExportCsv.js
│   │   ├── 📄 apiClient.js
│   │   └── 📄 reports.js
│   ├── 📁 components
│   │   ├── 📁 ui
│   │   │   ├── 📁 shared
│   │   │   │   ├── 📄 sidebar.jsx
│   │   │   │   └── 📄 topbar.jsx
│   │   │   ├── 📄 avatar.jsx
│   │   │   ├── 📄 badge.jsx
│   │   │   ├── 📄 button.jsx
│   │   │   ├── 📄 collapsible.jsx
│   │   │   ├── 📄 dropdown-menu.jsx
│   │   │   └── 📄 input.jsx
│   │   └── 📄 app-sidebar.jsx
│   ├── 📁 hooks
│   │   └── 📄 useAuth.jsx
│   ├── 📁 layouts
│   │   ├── 📄 AdminLayout.jsx
│   │   └── 📄 SalesLayout.jsx
│   ├── 📁 lib
│   │   └── 📄 utils.js
│   ├── 📁 pages
│   │   ├── 📁 Auth
│   │   │   └── 📄 Login.jsx
│   │   └── 📁 Dashboard
│   │       ├── 📁 Reports
│   │       │   └── 📄 ReportsPage.jsx
│   │       ├── 📄 Filterbar.jsx
│   │       ├── 📄 Index.jsx
│   │       ├── 📄 customer-row.jsx
│   │       └── 📄 dashboardstats.jsx
│   ├── 📁 utils
│   │   ├── 📄 dateHelpers.jsx
│   │   └── 📄 roleConfig.js
│   ├── 📄 App.jsx
│   ├── 🎨 index.css
│   └── 📄 main.jsx
├── ⚙️ .gitattributes
├── ⚙️ .gitignore
├── 📝 README.md
├── ⚙️ components.json
├── 📄 eslint.config.js
├── 🌐 index.html
├── ⚙️ jsconfig.json
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── 📄 postcss.config.js
├── 📄 tailwind.config.js
└── 📄 g.js
```

Frontend  →  Your existing frontend (unchanged)
    ↓
Backend   →  Node.js + Express (API server)
    ↓
ORM       →  Prisma (talk to DB easily)
    ↓
Database  →  PostgreSQL (Neon - free managed)
    ↓
Auth      →  JWT + bcrypt (replaces Supabase Auth)
    ↓
Storage   →  Cloudflare R2 (optional not used yet)
    ↓
Hosting   →  Railway (backend) + Neon (DB)