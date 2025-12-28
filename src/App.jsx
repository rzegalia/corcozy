import { Routes, Route, Navigate } from 'react-router-dom';
import { useFirebase } from './hooks/useFirebase';
import Layout from './components/Layout';
import PlanMode from './components/PlanMode';
import ShopMode from './components/ShopMode';
import CookMode from './components/CookMode';

function App() {
  const firebase = useFirebase();

  if (firebase.isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🕯️</div>
          <p className="text-text-secondary">Warming up...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout firebase={firebase}>
      <Routes>
        <Route path="/" element={<Navigate to="/plan" replace />} />
        <Route path="/plan" element={<PlanMode firebase={firebase} />} />
        <Route path="/shop" element={<ShopMode firebase={firebase} />} />
        <Route path="/shop/:userName" element={<ShopMode firebase={firebase} />} />
        <Route path="/cook" element={<CookMode />} />
        <Route path="/cook/:itemId" element={<CookMode />} />
      </Routes>
    </Layout>
  );
}

export default App;
