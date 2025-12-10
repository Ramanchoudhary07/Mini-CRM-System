# Mini CRM System

A full-stack Customer Relationship Management (CRM) system built with modern web technologies. Manage leads, agents, and follow-ups efficiently with real-time data synchronization.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)

## ✨ Features

- **Lead Management**: Create, read, update, and delete leads with status tracking (New, Contacted, Converted, Lost)
- **Agent Management**: Manage sales agents with automatic lead and conversion counters
- **Follow-Up Scheduling**: Schedule and track follow-ups for leads with completion status
- **Analytics Dashboard**: View key metrics including conversion rates, total leads, and agent performance
- **Real-time Updates**: Automatic data synchronization across the application
- **Responsive UI**: Modern, intuitive interface with Tailwind CSS
- **State Management**: Centralized state management using Zustand to eliminate prop drilling

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Zustand** - State management
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database (Atlas)
- **Mongoose** - MongoDB ODM
- **Dotenv** - Environment configuration

## 📁 Project Structure

```
Mini CRM System/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── AddAgentModal.tsx
│   │   │   ├── AddFollowUpModal.tsx
│   │   │   ├── AddLeadModal.tsx
│   │   │   ├── FollowUpList.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── LeadManagement.tsx
│   │   │   ├── AgentManagement.tsx
│   │   │   ├── FollowUpManagement.tsx
│   │   │   └── Analytics.tsx
│   │   ├── store/           # Zustand stores
│   │   │   ├── leadStore.ts
│   │   │   ├── agentStore.ts
│   │   │   ├── followUpStore.ts
│   │   │   ├── analyticsStore.ts
│   │   │   └── sidebarStore.ts
│   │   ├── lib/
│   │   │   └── axios.ts     # Axios configuration
│   │   ├── types/
│   │   │   └── index.ts     # TypeScript type definitions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
└── backend/                  # Express + Node.js API
    ├── src/
    │   ├── config/          # Configuration files
    │   │   ├── database.ts
    │   │   └── redis.ts
    │   ├── controllers/      # Route handlers
    │   │   ├── leadController.ts
    │   │   ├── agentController.ts
    │   │   ├── followUpController.ts
    │   │   └── analyticController.ts
    │   ├── models/          # Mongoose schemas
    │   │   ├── Lead.ts
    │   │   ├── Agent.ts
    │   │   └── FollowUp.ts
    │   ├── routes/          # API routes
    │   │   ├── leadRoutes.ts
    │   │   ├── agentRoutes.ts
    │   │   ├── followUpRoutes.ts
    │   │   └── analyticsRoutes.ts
    │   ├── types/
    │   │   └── index.ts     # TypeScript type definitions
    │   └── server.ts        # Express app entry point
    ├── package.json
    └── tsconfig.json
```

## 📦 Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- **MongoDB** account (Atlas)
- **Git** for version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Ramanchoudhary07/Mini-CRM-System.git
cd mini-crm-system
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**Environment Variables Explanation:**

- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB Atlas connection string
- `CORS_ORIGIN`: Frontend URL for CORS configuration
- `NODE_ENV`: Environment (development/production)

### Frontend Configuration

Update API base URL in `frontend/src/lib/axios.ts` if needed:

```typescript
const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});
```

## 🎯 Running the Application

### Development Mode

**Terminal 1 - Start Backend:**

```bash
cd backend
npm run dev
```

Server will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**

```bash
cd frontend
npm run dev
```

Frontend will be available at `http://localhost:5173`

### Production Build

**Backend:**

```bash
cd backend
npm run build
npm start
```

**Frontend:**

```bash
cd frontend
npm run build
npm preview
```

## 🔌 API Endpoints

### Leads

- `GET /api/v1/leads` - Get all leads
- `POST /api/v1/leads` - Create new lead
- `GET /api/v1/leads/:id` - Get lead by ID
- `PUT /api/v1/leads/:id` - Update lead
- `DELETE /api/v1/leads/:id` - Delete lead

### Agents

- `GET /api/v1/agents` - Get all agents
- `POST /api/v1/agents` - Create new agent
- `GET /api/v1/agents/:id` - Get agent by ID
- `PUT /api/v1/agents/:id` - Update agent
- `DELETE /api/v1/agents/:id` - Delete agent

### Follow-Ups

- `GET /api/v1/followups` - Get all follow-ups
- `POST /api/v1/followups` - Create new follow-up
- `GET /api/v1/followups/:id` - Get follow-up by ID
- `PUT /api/v1/followups/:id` - Update follow-up
- `DELETE /api/v1/followups/:id` - Delete follow-up

### Analytics

- `GET /api/v1/analytics/summary` - Get analytics summary
- `GET /api/v1/analytics/conversion-rate` - Get conversion rate data

## 💡 Usage

### Managing Leads

1. Navigate to **Lead Management** page
2. Click **Add Lead** to create a new lead
3. Fill in lead details and assign to an agent
4. Track lead status (New → Contacted → Converted/Lost)
5. View and manage all leads in the table

### Managing Agents

1. Go to **Agent Management** page
2. Click **Add Agent** to register new sales agent
3. View agent performance metrics (total leads, conversion count)
4. Edit or delete agents as needed

### Scheduling Follow-Ups

1. Navigate to **Follow-Up Management** page
2. Click **Schedule Follow-Up** to create a new follow-up
3. Select lead and agent, add notes and date
4. Follow-ups are organized by status (Upcoming/Completed)
5. Mark as complete or delete follow-ups with one click

### Viewing Analytics

1. Go to **Analytics** dashboard
2. View key metrics:
   - Total leads
   - Conversion rate
   - Agent performance
   - Follow-up completion rate
3. Data updates in real-time as operations are performed

## 🔄 Data Synchronization

The system uses Zustand stores for centralized state management:

- When a lead is created/updated/deleted, agent counters update automatically
- Lead assignment triggers agent lead count increment
- Lead status changes to "Converted" increment the conversion counter
- Lead deletion decrements counters appropriately
- Frontend automatically syncs with backend on all operations

## 🐛 Troubleshooting

### CORS Errors

- Ensure `CORS_ORIGIN` in backend `.env` matches your frontend URL
- Verify `withCredentials: true` is set in Axios configuration

### MongoDB Connection Issues

- Check `MONGODB_URI` in `.env` is correct
- Verify IP address is whitelisted in MongoDB Atlas
- Ensure database user has proper permissions

### Port Already in Use

```bash
# Windows PowerShell - Kill process on port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Start frontend on different port
cd frontend
npm run dev -- --port 3000
```

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, please open an issue in the GitHub repository.

---

**Happy CRM-ing!** 🎉
