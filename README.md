# 💸 BuddySpend

BuddySpend is a lightweight, frontend-only budgeting app built with React + TailwindCSS.
It’s designed to help users stay on top of their money with zero backend setup — everything runs locally using localStorage.

---

## ✨ Features

- 🔑 **Login / Signup (localStorage-based)** – no backend needed  
- 📊 **Dashboard UI** – clean and minimal with Tailwind  
- 🎨 **Custom Theme Colors** – added `primary` shades in `tailwind.config.js`  
- 💼 **Budget Page** – organize expenses with a neat layout  
- 🎯 **Responsive** – works on laptop and mobile screens  

---

## 🛠️ Tech Stack

- **React (Vite)** ⚡ – frontend framework  
- **Tailwind CSS** 🎨 – styling + custom theme  
- **LocalStorage** 💾 – lightweight login/session handling  

---

## 📂 Project Structure

```bash
├── src/
│ ├── components/ # Reusable components
│ ├── pages/ # Dashboard, Budget, Login
│ ├── App.jsx # Main app
│ └── main.jsx # Entry point
├── index.html
├── tailwind.config.js
└── package.json
```
---

## 🚀 Getting Started

1. **Clone this repo**  
   ```bash
   git clone https://github.com/your-username/budget-dashboard.git
   cd budget-dashboard

--- 
#Install dependencies

```bash
npm install
Run the dev server
```

```bash
npm run dev
Open your browser at 👉 http://localhost:5173
```

## 🎨 Custom Colors
Added a primary palette in tailwind.config.js:

```bash
primary: {
  50: '#f0f9ff',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
}
```
Use it like:

```bash

<button class="bg-primary-600 text-white hover:bg-primary-700">
  Save Budget
</button>
```
