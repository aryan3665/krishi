# Krishi Sakha - Hyperlocal Agricultural AI Assistant

A comprehensive agricultural advisory system that combines real-time data with AI to provide hyperlocal farming guidance for Indian farmers.

## Project info

**URL**: https://lovable.dev/projects/4bc626b4-51a7-4f6c-ae9f-a13aef627e34

## How can I edit this code?

## Features

### 🌾 Hyperlocal Data Integration
- **Weather Data**: Real-time weather information from Indian Meteorological Department
- **Market Prices**: Live mandi prices from eNAM and state agricultural marketing boards
- **Crop Advisories**: State and central government agricultural advisories
- **Soil Health**: Soil Health Card data integration
- **Government Schemes**: Information about subsidies and agricultural schemes

### 🤖 Retrieval-Augmented Generation (RAG)
- **Smart Query Processing**: Automatically detects location, crop, and query intent
- **Multi-source Data Retrieval**: Combines multiple datasets for comprehensive answers
- **Contextual AI Responses**: Gemini AI enhanced with real-time agricultural data
- **Source Attribution**: Clear citations and data source transparency

### 🌍 Multilingual Support
- **8+ Indian Languages**: Hindi, Marathi, Bengali, Tamil, Telugu, Gujarati, Punjabi, English
- **Voice Input/Output**: Speech recognition and text-to-speech in multiple languages
- **Code-mixed Queries**: Handles Hinglish and mixed language inputs

### 📱 Mobile-First Design
- **Progressive Web App**: Works offline with cached data
- **Touch-Optimized**: Designed for smartphone usage
- **Low-Bandwidth Ready**: Efficient data usage for rural connectivity

### 🔒 Privacy & Security
- **User Authentication**: Secure login with Supabase Auth
- **Data Privacy**: Personal queries stored securely
- **Offline Capability**: Basic functionality without internet

## Architecture

### Data Pipeline
```
User Query → Query Preprocessing → Context Extraction → Dataset Agents → RAG Pipeline → Enhanced AI Response
```

### Dataset Agents
- **WeatherAgent**: Fetches meteorological data
- **CropAdvisoryAgent**: Retrieves agricultural advisories
- **MarketPriceAgent**: Gets current mandi prices
- **SoilHealthAgent**: Accesses soil testing data
- **GovernmentSchemeAgent**: Provides scheme information

### Key Components
- **DatasetOrchestrator**: Coordinates multiple data sources
- **EnhancedAdviceCard**: Displays AI responses with source attribution
- **DataSourceCard**: Shows transparent data sources and citations
- **OfflineIndicator**: Manages offline/online state

## Data Sources (Production Ready)

1. **Indian Meteorological Department (IMD)** - Weather data
2. **eNAM (National Agriculture Market)** - Market prices
3. **State Agriculture Departments** - Crop advisories
4. **Soil Health Card Scheme** - Soil data
5. **Ministry of Agriculture & Farmers Welfare** - Government schemes
6. **ICAR (Indian Council of Agricultural Research)** - Research data

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/4bc626b4-51a7-4f6c-ae9f-a13aef627e34) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

### Core Technologies
This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

### Backend & Database
- **Supabase**: Authentication, database, and edge functions
- **PostgreSQL**: Query storage and user management
- **Edge Functions**: Serverless AI processing

### AI & Data Processing
- **Google Gemini**: Large language model for advice generation
- **Custom RAG Pipeline**: Retrieval-augmented generation
- **Multi-agent System**: Specialized data retrieval agents

### APIs & Integrations
- **Government Data APIs**: Real-time agricultural data
- **Speech APIs**: Voice input/output capabilities

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/4bc626b4-51a7-4f6c-ae9f-a13aef627e34) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Development Setup

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### Local Development
```bash
npm install
npm run dev
```

### Database Setup
The project includes Supabase migrations for:
- User profiles and authentication
- Query storage and history
- Row-level security policies

## Demo Scenarios

1. **Weather-based Crop Advice**: "What should I plant in Allahabad given this week's weather?"
2. **Market-driven Decisions**: "Should I sell my wheat now or wait based on current prices?"
3. **Multilingual Queries**: "मेरे टमाटर के पौधों में कीड़े लग गए हैं, क्या करूं?"
4. **Scheme Information**: "What government schemes are available for small farmers?"
5. **Soil-based Recommendations**: "My soil pH is 6.5, which crops should I grow?"