# SF Shop - A Modern E-commerce Platform Front-End

Welcome to SF Shop, a feature-rich e-commerce front-end application built with React. This project serves as a practical demonstration of modern web development techniques, with a strong emphasis on performance optimization, clean code architecture, and production-ready deployment.

**[➡️ Live Demo](https://sfshop.netlify.app/)**

## Key Features

- **Product Catalog**: Browse a wide range of products fetched from a live API.
- **Category Filtering**: Easily filter products by category.
- **Product Details Page**: View detailed information and image galleries for each product.
- **Shopping Cart**: Fully functional cart to add, review, and manage items.
- **Quantity Management**: Update item quantities directly in the product list and the cart.
- **User Authentication**: Secure user registration and JWT-based login system.

## Live Demo Access

You can test the live application using the following demo accounts, which have been pre-populated with different order histories and user data for a complete testing experience.

- **Account 1:**
  - **Username:** `emilys`
  - **Password:** `emilyspass`

- **Account 2:**
  - **Username:** `danielc`
  - **Password:** `danielcpass`

## Performance Optimization Highlights

This project goes beyond basic functionality and implements several key performance optimizations that are crucial for a modern, fast, and responsive user experience.

### 1. State Management Optimization
- **Optimized Context**: The global `CartContext` has been fine-tuned using `useMemo` and `useCallback` hooks. This prevents unnecessary re-renders of consumer components when the state hasn't changed, significantly improving UI stability.

### 2. Component Rendering Optimization
- **Memoized Components**: High-frequency components, such as `ProductCard` in the product list, are wrapped in `React.memo`. This, combined with stable props, ensures that only the components that need to be updated are re-rendered, drastically reducing the rendering workload.

### 3. Asset Loading Optimization
- **Image Lazy Loading**: Off-screen images (e.g., product thumbnails further down the list) use the native `loading="lazy"` attribute. This prioritizes the loading of critical, above-the-fold content, improving the Largest Contentful Paint (LCP) metric and perceived performance.

## Authentication
This application implements a JWT (JSON Web Token) based authentication system.
- **Token Storage**: Upon successful login, a JWT token is stored in `localStorage`.
- **Authenticated Requests**: An Axios interceptor automatically attaches the JWT token to the `Authorization` header for all subsequent API requests, ensuring secure communication with the backend.

## Tech Stack

- **Framework**: [React](https://reactjs.org/)
- **Routing**: [React Router](https://reactrouter.com/)
- **API Communication**: [Axios](https://axios-http.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API

## Backend Repository

This frontend application is powered by a dedicated Node.js backend API. The backend, built with Node.js, Express.js, and MongoDB, handles user authentication, product management, order processing, and more.

- **Backend Source Code**: [peter890176/sf2_backend on GitHub](https://github.com/peter890176/sf2_backend)

For detailed instructions on how to set up and run the backend server locally, please refer to its repository's `README.md`.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

### Installation

1. Clone the repo
   ```sh
   git clone https://your-repository-url.com/sf2.git
   ```
2. Navigate to the project directory
   ```sh
   cd sf2
   ```
3. Create a `.env` file in the root of the project and add your backend API URL:
   ```
   REACT_APP_API_URL=https://your-api-backend.com/api
   ```
4. Install dependencies
   ```sh
   npm install
   ```
   or
   ```sh
   yarn install
   ```

### Running the Application

- **Development Mode**:
  ```sh
  npm start
  ```
  Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will auto-reload when you make changes.

- **Production Build**:
  ```sh
  npm run build
  ```
  Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

## Deployment & Containerization

This project is configured for seamless deployment using Docker and Netlify.

- **Netlify**: The `netlify.toml` file contains the necessary configuration to build and deploy the application on Netlify.
- **Docker**: A `Dockerfile` and `docker-compose.yml` are provided for building and running the application in a containerized environment.
  - To build and run the Docker container:
    ```sh
    docker-compose up --build
    ```

## Project Structure

```
sf2/
└── src/
    ├── api/             # Axios setup and API request functions
    ├── components/      # Reusable UI components (NavBar, ProductCard, etc.)
    ├── context/         # Global state management (CartContext)
    ├── pages/           # Page components for routing (ShopPage, ProductDetailPage, etc.)
    ├── App.js           # Main application component with routing setup
    ├── index.css        # Global styles and Tailwind CSS imports
    └── index.js         # Application entry point
```

## Acknowledgments

Parts of the code in this project, especially concerning performance optimizations and refactoring, were developed with the assistance of the Gemini 2.5 Pro AI model. All AI-generated code has been reviewed and verified by the project developer.
