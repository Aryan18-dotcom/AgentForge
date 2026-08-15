import { useState, useEffect, useCallback } from 'react';
import { getDashboardMetrix } from '../services/api'; // Adjust path if needed

// Match types to match your explicit dashboard infrastructure layout
export interface MetricData {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  type: string;
}

export interface AgentData {
  id: string;
  name: string;
  model: string;
  status: 'active' | 'paused';
  efficiency: number;
  useCase: string;
}

const useDashboard = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTelemetry = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDashboardMetrix();
      
      if (response.success) {
        setMetrics(response.telemetry);
        setAgents(response.fleet);
      } else {
        setError(response.message || "Failed to compile system metrics.");
      }
    } catch (err: any) {
      setError(err?.message || "Critical fallback exception during telemetry sync.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTelemetry();
  }, [fetchTelemetry]);

  return {
    metrics,
    agents,
    setAgents,
    loading,
    error,
    refreshTelemetry: fetchTelemetry
  };
};

export default useDashboard;