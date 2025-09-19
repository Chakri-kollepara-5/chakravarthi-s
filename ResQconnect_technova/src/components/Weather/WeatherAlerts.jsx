import React, { useState, useEffect } from "react";
import { fetchWeatherAlerts } from "../../services/weatherApi";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

const WeatherAlerts = ({ location }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showRaw, setShowRaw] = useState(false); // Debug toggle
  const [rawResponse, setRawResponse] = useState(null);

  // Normalize Tomorrow.io response into UI-friendly shape
  const normalizeAlerts = (raw) => {
    return (raw?.alerts || []).map((alert) => ({
      id: alert.id || Math.random().toString(36).substring(2, 9),
      type: alert.type || "storm",
      severity: alert.severity?.toLowerCase() || "medium",
      title: alert.title || "Weather Alert",
      description: alert.description || "No description available.",
      time: alert.time || new Date().toISOString(),
    }));
  };

  const loadAlertsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const lat = location?.lat || 17.6868;
      const lng = location?.lng || 83.2185;

      const raw = await fetchWeatherAlerts(lat, lng);

      // Save raw for debug mode
      setRawResponse(raw);

      // Normalize for UI
      const normalized = normalizeAlerts(raw);

      setAlerts(normalized);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      console.error("Weather alerts loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlertsData();
    const interval = setInterval(loadAlertsData, 1000 * 60 * 5); // refresh every 5 min
    return () => clearInterval(interval);
  }, [location]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 border-red-500 text-red-800";
      case "medium":
        return "bg-yellow-100 border-yellow-500 text-yellow-800";
      case "low":
        return "bg-green-100 border-green-500 text-green-800";
      default:
        return "bg-gray-100 border-gray-500 text-gray-800";
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="text-yellow-600" size={20} />
          Weather Alerts
        </h2>
        <button
          onClick={loadAlertsData}
          className="text-sm px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="animate-spin text-blue-500" size={24} />
          <span className="ml-2 text-blue-500">Loading alerts...</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && !error && alerts.length === 0 && (
        <div className="flex flex-col items-center py-6 text-gray-500">
          <CheckCircle size={32} className="text-green-500 mb-2" />
          <p>No active weather alerts.</p>
        </div>
      )}

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 border-l-4 rounded ${getSeverityColor(
              alert.severity
            )}`}
          >
            <h3 className="font-semibold">{alert.title}</h3>
            <p className="text-sm">{alert.description}</p>
            <p className="text-xs mt-1 text-gray-600">
              Issued: {new Date(alert.time).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {lastUpdated && (
        <p className="text-xs text-gray-500 mt-4">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      {/* Debug section */}
      <div className="mt-4">
        <button
          onClick={() => setShowRaw(!showRaw)}
          className="text-xs px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
        >
          {showRaw ? "Hide Raw JSON" : "Show Raw JSON"}
        </button>
        {showRaw && (
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-64">
            {JSON.stringify(rawResponse, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default WeatherAlerts;