import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import ShopPage from './pages/ShopPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
      <div className="App bg-gray-100 min-h-screen">
        <NavBar />
        <main className="container mx-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<ShopPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
