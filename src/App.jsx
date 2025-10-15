import { useState } from 'react';
import { useGraphData } from './hooks';
import { LAYERS, UI_LABELS } from './constants/labels';
import Header from './components/Header';
import Controls from './components/Controls';
import Graph from './components/Graph';
import Legend from './components/Legend';
import Info from './components/Info';
import Footer from './components/Footer';
import Loading from './components/Loading';

function App() {
  const { nodesData, edgesData, loading, error } = useGraphData();
  const [layerFilter, setLayerFilter] = useState(LAYERS.ALL);
  const [statusFilter, setStatusFilter] = useState(LAYERS.ALL);

  if (loading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <h2>{UI_LABELS.ERROR_TITLE}</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="container">
        <Controls 
          layerFilter={layerFilter}
          setLayerFilter={setLayerFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <Graph 
          nodesData={nodesData}
          edgesData={edgesData}
          layerFilter={layerFilter}
          statusFilter={statusFilter}
        />
        <Legend />
        <Info lastUpdated={nodesData?.last_updated} />
      </main>
      <Footer />
    </div>
  );
}

export default App;

