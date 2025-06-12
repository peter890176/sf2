# SF Shop - A Modern E-commerce Platform Front-End

Welcome to SF Shop, a feature-rich e-commerce front-end application built with React. This project serves as a practical demonstration of modern web development techniques, with a strong emphasis on performance optimization and clean code architecture.

**[➡️ Live Demo](https://sfshop.netlify.app/)**

## Key Features

- **Product Catalog**: Browse a wide range of products fetched from a live API.
- **Category Filtering**: Easily filter products by category.
- **Product Details Page**: View detailed information and image galleries for each product.
- **Shopping Cart**: Fully functional cart to add, review, and manage items.
- **Quantity Management**: Update item quantities directly in the product list and the cart.
- **User Registration**: A dedicated page for user registration.

## Performance Optimization Highlights

This project goes beyond basic functionality and implements several key performance optimizations that are crucial for a modern, fast, and responsive user experience.

### 1. State Management Optimization
- **Optimized Context**: The global `CartContext` has been fine-tuned using `useMemo` and `useCallback` hooks. This prevents unnecessary re-renders of consumer components when the state hasn't changed, significantly improving UI stability.

### 2. Component Rendering Optimization
- **Memoized Components**: High-frequency components, such as `ProductCard` in the product list, are wrapped in `React.memo`. This, combined with stable props, ensures that only the components that need to be updated are re-rendered, drastically reducing the rendering workload.

### 3. Asset Loading Optimization
- **Image Lazy Loading**: Off-screen images (e.g., product thumbnails further down the list) use the native `loading="lazy"` attribute. This prioritizes the loading of critical, above-the-fold content, improving the Largest Contentful Paint (LCP) metric and perceived performance.

## Tech Stack

- **Framework**: [React](https://reactjs.org/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repo
   ```sh
   git clone <YOUR_REPOSITORY_URL>
   ```
2. Navigate to the project directory
   ```sh
   cd sf2
   ```
3. Install dependencies
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

## Project Structure

```
sf2/
└── src/
    ├── components/      # Reusable UI components (NavBar, ProductCard, etc.)
    ├── context/         # Global state management (CartContext)
    ├── pages/           # Page components for routing (ShopPage, ProductDetailPage, etc.)
    ├── App.js           # Main application component with routing setup
    ├── index.css        # Global styles and Tailwind CSS imports
    └── index.js         # Application entry point
```

## Acknowledgments

Parts of the code in this project, especially concerning performance optimizations and refactoring, were developed with the assistance of the Gemini 2.5 Pro AI model. All AI-generated code has been reviewed and verified by the project developer.
