# Financial Analytics Dashboard with Real-Time Data

## Project Overview

This project delivers a fully functional and interactive Financial Analytics Dashboard built with **React.js** for the frontend and **Node.js/Express** for the backend. It visualizes real-time financial data, including stock prices, sector performance, and market movers, fetched from a public financial API. The dashboard is designed with modular components, efficient data handling, and a user-friendly interface.

## Features

### Dashboard Components:
* **Stock Price Trend (Line Chart):** Visualizes the historical price movement of a selected stock over a customizable time range.
* **Sector Performance (Pie Chart):** Displays the real-time performance distribution across various market sectors.
* **Top Gainers/Losers (Bar Graphs):** Compares the percentage change of top-performing and worst-performing stocks.
* **Market Performance Heatmap:** A simplified heatmap illustrating the performance of top/bottom market movers through color-coded blocks.
* **Stock Score View:** Presents a composite analytical score for the selected stock, derived from metrics like volatility, growth rate, and trading volume.
* **Tabular Data View:**
    * **Most Actively Traded Stocks:** A detailed table showing top actively traded instruments.
    * **Selected Stock Daily Details:** Displays the latest daily open, high, low, close, and volume for the currently selected stock.

### User Interactions:
* **Stock Selector (Dropdown):** Allows users to choose different stock symbols (e.g., IBM, AAPL, MSFT) to view their respective data and score.
* **Time Range Filter (Dropdown):** Enables filtering of stock price trend data (e.g., 1 Month, 3 Months, 1 Year, All Time).
* **Hover Interactivity:** Charts provide detailed information on hover (tooltips).
* **Responsive Layout:** Basic responsive design to adapt to different screen sizes.

### Backend Functionality (Node.js/Express Bonus):
* **API Proxy & Caching:** A custom Node.js/Express backend service acts as a proxy, fetching data from Alpha Vantage. It implements an in-memory caching mechanism to store API results and prevent hitting rate limits (e.g., 5 requests/minute for Alpha Vantage's free tier).
* **Data Normalization:** Raw data from Alpha Vantage is processed and normalized into a consistent, frontend-friendly format.
* **Custom Stock Scoring Endpoint:** An endpoint (`/api/stock/score/:symbol`) is available to calculate and serve the composite stock score based on volatility, growth rate, and volume.

## Tech Stack

**Frontend:**
* **React.js:** A JavaScript library for building user interfaces.
* **Recharts:** A composable charting library built on React components.
* **React-Select:** A flexible and accessible select input control for dropdowns.
* **Date-Fns:** A modern JavaScript date utility library for date formatting and manipulation.
* **Axios:** A promise-based HTTP client for the browser and Node.js.
* **Vite:** A fast frontend build tool.

**Backend:**
* **Node.js:** JavaScript runtime environment.
* **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
* **Axios:** For making HTTP requests to external APIs (Alpha Vantage).
* **Dotenv:** To load environment variables from a `.env` file.
* **CORS:** Node.js middleware for handling Cross-Origin Resource Sharing.

**Data Source:**
* **Alpha Vantage API:** Used to fetch real-time and historical financial market data.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

* Node.js (LTS version recommended)
* npm (Node Package Manager)

### 1. Obtain an Alpha Vantage API Key

1.  Go to the [Alpha Vantage website](https://www.alphavantage.co/).
2.  Click on "Get Your Free API Key" and follow the registration process.
3.  Keep your API key handy.

### 2. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd financial-dashboard
    ```
2.  Install backend dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `financial-dashboard` directory (same level as `package.json`):
    ```
    # financial-dashboard/.env
    PORT=5000
    ALPHA_VANTAGE_API_KEY=YOUR_ALPHA_VANTAGE_API_KEY_HERE
    ```
    *Replace `YOUR_ALPHA_VANTAGE_API_KEY_HERE` with your actual Alpha Vantage API key.*

4.  Start the backend server:
    ```bash
    npm start
    ```
    The backend server will run on `http://localhost:5000`. You should see `Server is running on port 5000` in your terminal.

### 3. Frontend Setup

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd financial-dashboard-frontend
    ```
2.  Install frontend dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file in the `financial-dashboard-frontend` directory (same level as `package.json`):
    ```
    # financial-dashboard-frontend/.env.local
    VITE_API_BASE_URL=http://localhost:5000/api
    ```
    *This tells the frontend where your backend API is located.*

4.  Start the frontend development server:
    ```bash
    npm run dev
    ```
    The frontend application will typically open in your browser at `http://localhost:5173`.

### 4. Verify Functionality

* Ensure both backend and frontend servers are running simultaneously.
* Open your browser to the frontend URL (`http://localhost:5173`).
* You should see the dashboard loading and displaying financial data, charts, and tables. Interact with the dropdowns to change stocks and time ranges.
* Check your browser's console and network tab (F12) for any errors.

## Project Structure

├── financial-dashboard/            # Backend (Node.js/Express)
│   ├── controllers/                # Logic for handling API requests
│   │   └── financeController.js
│   ├── config/                     # Configuration files (e.g., caching)
│   │   └── cache.js
│   ├── routes/                     # API routes definition
│   │   └── financeRoutes.js
│   ├── utils/                      # Helper functions (API calls, data normalization, scoring)
│   │   ├── alphaVantage.js
│   │   └── stockScoreCalculator.js
│   ├── .env                        # Environment variables (DO NOT COMMIT!)
│   ├── .gitignore
│   ├── package.json
│   └── server.js                   # Main backend server file
└── financial-dashboard-frontend/   # Frontend (React.js)
├── public/
├── src/
│   ├── assets/
│   ├── components/             # Reusable UI components (charts, tables, etc.)
│   │   ├── BarChartCard.jsx
│   │   ├── HeatmapCard.jsx
│   │   ├── LineChartCard.jsx
│   │   ├── PieChartCard.jsx
│   │   └── TableComponent.jsx
│   ├── hooks/                  # Custom React Hooks (e.g., useFetchData)
│   │   └── useFetchData.js
│   ├── pages/                  # Top-level components for views
│   │   └── DashboardPage.jsx
│   ├── services/               # API service functions
│   │   └── api.js
│   ├── styles/                 # Global styles (if any)
│   ├── App.jsx                 # Main React application component
│   └── main.jsx                # React entry point
├── .env.local                  # Frontend environment variables (DO NOT COMMIT!)
├── .gitignore
├── index.html
├── package.json
└── vite.config.js


## Future Enhancements

* **Expanded Data Sources:** Integrate data from other APIs (e.g., Finnhub for real-time crypto data, or Yahoo Finance for additional market coverage).
* **More Advanced Filters:** Implement filters for financial markets (e.g., US, EU, Crypto) and specific sectors/industries.
* **User Authentication:** Add user login/registration and personalized dashboards.
* **Notifications:** Implement alerts for significant price changes or score updates.
* **Full UI/UX Framework:** Integrate a comprehensive UI library (e.g., Material-UI, Ant Design) for a more polished and consistent design system.
* **Advanced Charting:** Explore more complex D3.js visualizations or integrate additional charting features.
* **Deployment Automation:** Set up CI/CD pipelines for automated deployment to cloud platforms (e.g., Vercel, Netlify for frontend; Heroku, AWS for backend).

## Contributing

Feel free to fork this repository, submit pull requests, or open issues.

## License

This project is open-source and available under the [MIT License](LICENSE.md). (You would create a LICENSE.md file in the root if you want to include a license).

---

This README covers all the key aspects of your project, including setup instructions, features, tech stack, and future considerations. It's comprehensive enough to be a strong showcase for your skills!

Remember to perform the Git commands (add, commit, push) after creating the `README.md` and `.gitignore` files. Good luck!

Sources
