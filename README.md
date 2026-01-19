# Emergency Response App (ERA) 🚑

A Next.js-based emergency response platform that connects users requesting first aid with nearby, verified first aid responders. The app provides real-time location sharing, AI-assisted triage guidance, and encourages community-based emergency support while always prioritizing professional emergency services (000).

## 🎯 Overview

**Emergency Response App** is designed to bridge the critical gap between when an emergency occurs and when professional help arrives. It empowers communities to support each other in medical emergencies through:

- **Verified Responders**: Connect with nearby first-aid certified community members
- **AI Triage Assistant**: Get instant guidance for minor incidents and step-by-step CPR instructions
- **Real-time Matching**: Location-based matching with the closest available responders
- **Secure Communication**: Direct messaging and calling between requesters and responders
- **Multiple User Roles**: Requester, Responder, and Admin dashboards

## ✨ Key Features

### For Requesters
- 🆘 **Quick Help Request**: One-tap emergency assistance with incident type selection
- 🤖 **AI Assistant**: Interactive triage system that provides:
  - Step-by-step CPR guidance
  - Bleeding control instructions
  - Burn treatment advice
  - Consciousness and breathing checks
- 🗺️ **Live Location Sharing**: Real-time map showing responder location and ETA
- 📱 **Direct Communication**: In-app messaging and calling with matched responders
- ⏱️ **Status Tracking**: Monitor responder acceptance and arrival time

### For Responders
- 🔔 **Incoming Alerts**: Receive nearby emergency requests with severity indicators
- ✅ **Accept/Decline**: Choose which requests to respond to based on location and type
- 🧭 **Navigation**: Get distance and ETA to requester's location
- 👤 **Case Management**: Track active cases and communicate with requesters
- 🛡️ **Verification Badge**: Display certified first-aid status
- 📊 **Activity Toggle**: Switch between Available/Offline/Busy states

### For Admins
- 📈 **System Overview**: Monitor all active requests and responders
- 👥 **User Management**: View and manage registered users
- 📍 **Real-time Map**: See all active incidents and responder locations
- 📊 **Analytics**: Track response times and system usage

### Technical Features
- 🎨 **Modern UI**: Built with Tailwind CSS and Shadcn/ui components
- 🌙 **Dark Mode**: Fully supported dark/light themes
- ⚡ **Smooth Animations**: Framer Motion for engaging user experience
- 🗺️ **Interactive Maps**: Leaflet integration for location visualization
- 📱 **Responsive Design**: Works seamlessly on mobile and desktop
- 🔐 **Role-based Access**: Separate dashboards for different user types
- 🎯 **Type Safety**: Full TypeScript implementation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShihabAshfaq/Emergency-Response-App-ERA-.git
   cd Emergency-Response-App-ERA-
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Project Structure

```
first-aid-response/
├── app/
│   ├── (auth)/          # Authentication pages
│   │   ├── login/       # Login page
│   │   └── signup/      # Sign-up with role selection
│   ├── (dashboard)/     # Protected dashboard routes
│   │   ├── admin/       # Admin dashboard
│   │   ├── requester/   # Help requester interface
│   │   └── responder/   # First aid responder interface
│   ├── history/         # User history page
│   ├── api/             # Mock API routes
│   ├── layout.tsx       # Root layout with navigation and ThemeProvider
│   ├── page.tsx         # Landing page
│   └── globals.css      # Global styles
├── components/
│   ├── AIAssistant.tsx  # Interactive triage system
│   ├── map/             # Map components (Leaflet)
│   └── ui/              # Reusable UI components (Shadcn)
├── context/
│   └── MockDataContext.tsx  # Mock data and state management
├── data/                # Local JSON persistence (Mock DB)
│   ├── admin_logs.json
│   ├── requests.json
│   └── users.json
├── lib/
│   └── utils.ts         # Utility functions
└── public/              # Static assets
```

## 🎮 Usage

### As a Requester

1. **Sign Up**: Create an account and select "Requester" role
2. **Request Help**: Choose incident type (Medical, Burn, Bleeding, etc.)
3. **AI Guidance**: Optionally use the AI Assistant for immediate guidance
4. **Wait for Match**: System finds the nearest available responder
5. **Communicate**: Message or call your matched responder
6. **Resolve**: Mark the incident as resolved when help arrives

### As a Responder

1. **Sign Up**: Create account with "Responder" role (requires first-aid certification)
2. **Go Online**: Toggle your availability status
3. **Receive Alerts**: Get notified of nearby emergency requests
4. **Accept/Decline**: Choose requests based on your proximity and capability
5. **Navigate**: Use the map to reach the requester
6. **Assist**: Provide first-aid assistance
7. **Complete**: Mark the case as resolved

### As an Admin

1. **Login**: Access admin dashboard with admin credentials
2. **Monitor**: View all active requests and system metrics
3. **Manage**: Oversee user registrations and verifications
4. **Analyze**: Track response times and system performance

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Maps**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API

## 🔒 Safety & Compliance

- ⚠️ **Emergency Services First**: Always prioritize calling 000 for serious emergencies
- 🛡️ **Verified Responders**: All responders must show proof of first-aid certification
- 📱 **Location Privacy**: Location sharing only during active requests
- 💬 **Secure Communication**: In-app messaging protects user privacy
- ⚖️ **Legal Disclaimer**: Good Samaritan laws apply; app is for community support only

## 🚧 Current Status

This is a **prototype/MVP** built with mock data. For production use, you would need:

- Backend API with database (PostgreSQL/MongoDB)
- Real-time WebSocket connections
- SMS/Push notification system
- Identity verification for responders
- Payment/subscription system (if applicable)
- Legal compliance and insurance considerations
- Integration with emergency services APIs

## Legal
All rights reserved.  
This repository is provided for viewing and evaluation purposes only.

## 👤 Author

**Shihab Ashfaq**
- GitHub: [@ShihabAshfaq](https://github.com/ShihabAshfaq)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Inspired by community-driven emergency response initiatives

## 📞 Support

For questions or support, please open an issue on the [GitHub repository](https://github.com/ShihabAshfaq/Emergency-Response-App-ERA-/issues).

---

**⚠️ Important**: This application is designed to facilitate community first-aid response but should never replace professional emergency services. Always call 000 (or your local emergency number) for serious medical emergencies.
