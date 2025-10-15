import { useState, useEffect } from 'react';

export function useGraphData() {
  const [nodesData, setNodesData] = useState(null);
  const [edgesData, setEdgesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const baseUrl = import.meta.env.BASE_URL;
        const [nodesRes, edgesRes] = await Promise.all([
          fetch(`${baseUrl}data/nodes.json`),
          fetch(`${baseUrl}data/edges.json`)
        ]);

        if (!nodesRes.ok || !edgesRes.ok) {
          throw new Error('Failed to load data');
        }

        const [nodesJson, edgesJson] = await Promise.all([
          nodesRes.json(),
          edgesRes.json()
        ]);

        setNodesData(nodesJson);
        setEdgesData(edgesJson);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { nodesData, edgesData, loading, error };
}

