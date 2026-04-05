# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# File Tree: ToursandTravelsCRM

└── 📁 ToursandTravelsCRM
    ├── 📁 server
    │   ├── 📁 prisma
    │   │   └── 📄 schema.prisma
    │   ├── 📁 middleware
    │   │   └── 📄 auth.js
    │   ├── 📁 controllers
    │   │   ├── 📄 auth.js
    │   │   ├── 📄 customers.js
    │   │   ├── 📄 leads.js
    │   │   ├── 📄 email.js
    │   │   └── 📄 sms.js
    │   ├── 📁 routes
    │   │   ├── 📄 auth.js
    │   │   ├── 📄 customers.js
    │   │   ├── 📄 leads.js
    │   │   └── 📄 messaging.js
    │   ├── 📄 index.js
    │   ├── 📄 .env
    │   └── 📄 package.json
    ├── 📁 src
    │   ├── 📁 api
    │   │   ├── 📄 customers.js
    │   │   ├── 📄 leads.js
    │   │   ├── 📄 follow_ups.js
    │   │   ├── 📄 ExportCsv.js
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
    │   │   ├── 📄 useAuth.jsx
    │   │   ├── 📄 useCustomers.js
    │   │   └── 📄 useLeads.js
    │   ├── 📁 layouts
    │   │   ├── 📄 AdminLayout.jsx
    │   │   └── 📄 SalesLayout.jsx
    │   ├── 📁 lib
    │   │   └── 📄 utils.js
    │   ├── 📁 pages
    │   │   ├── 📁 Auth
    │   │   │   └── 📄 Login.jsx
    │   │   ├── 📁 Dashboard
    │   │   │   ├── 📁 Reports
    │   │   │   │   └── 📄 ReportsPage.jsx
    │   │   │   ├── 📄 Filterbar.jsx
    │   │   │   ├── 📄 Index.jsx
    │   │   │   ├── 📄 customer-row.jsx
    │   │   │   └── 📄 dashboardstats.jsx
    │   │   ├── 📁 Customers
    │   │   │   ├── 📄 Index.jsx
    │   │   │   ├── 📄 CustomerTable.jsx
    │   │   │   ├── 📄 EditForm.jsx
    │   │   │   └── 📄 FilterBar.jsx
    │   │   └── 📁 CRM
    │   │       ├── 📄 Index.jsx
    │   │       ├── 📄 EnquiryList.jsx
    │   │       ├── 📄 EnquiryForm.jsx
    │   │       ├── 📄 LeadDetail.jsx
    │   │       └── 📄 ReplyModal.jsx
    │   ├── 📁 utils
    │   │   ├── 📄 dateHelpers.jsx
    │   │   ├── 📄 roleConfig.js
    │   │   ├── 📄 validators.js
    │   │   └── 📄 exportCSV.js
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
    └── 📄 vite.config.js