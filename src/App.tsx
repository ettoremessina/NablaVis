import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { GradientScene } from './scenes/GradientScene';
import { CurlScene } from './scenes/CurlScene';
import { DivergenceScene } from './scenes/DivergenceScene';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/gradient" replace />} />
          <Route path="/gradient" element={<GradientScene />} />
          <Route path="/curl" element={<CurlScene />} />
          <Route path="/divergence" element={<DivergenceScene />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
