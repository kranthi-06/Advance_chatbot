import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  CloudRain,
  Droplets,
  MapPin,
  Navigation,
  Radar,
  ShieldAlert,
  Sparkles,
  Sprout,
  Thermometer,
  Wheat,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SearchableSelect from '../components/SearchableSelect.jsx';
import {
  INDIA_STATE_OPTIONS,
  INDIA_TOTAL_CITY_SUGGESTIONS,
  INDIA_TOTAL_STATE_COUNT,
  formatLocationLabel,
  getCityOptionsByState,
  getStateByKey,
} from '../../shared/indiaLocations.js';
import { FALLBACK_CROPS } from '../../shared/cropData.js';
import { fetchVirtualIoTDataLocal, generateDecisionLocal } from '../services/localAnalysis.js';
import {
  resolveIndiaLocation,
} from '../../shared/indiaLocations.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const heroStats = [
  {
    label: 'India coverage',
    value: `${INDIA_TOTAL_STATE_COUNT}`,
    helper: 'States and union territories',
    icon: MapPin,
  },
  {
    label: 'City suggestions',
    value: `${INDIA_TOTAL_CITY_SUGGESTIONS}+`,
    helper: 'Search, pick, or type your own city',
    icon: Building2,
  },
  {
    label: 'Decision layers',
    value: 'IoT + AI',
    helper: 'Regional simulation plus crop-fit scoring',
    icon: Radar,
  },
];

const workflowSteps = [
  {
    title: 'Choose an Indian state',
    description: 'Coverage is locked to India so the advisory stays focused and relevant.',
  },
  {
    title: 'Select or type a city',
    description: 'Pick a suggested city or enter a custom city name inside the chosen state.',
  },
  {
    title: 'Match the crop',
    description: 'The engine compares live field conditions against your crop profile instantly.',
  },
];

export default function CropAdvisorPage({ language }) {
  const { t } = useTranslation();
  const [crops, setCrops] = useState([]);
  const [fetchingCrops, setFetchingCrops] = useState(true);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sensorData, setSensorData] = useState(null);
  const [decision, setDecision] = useState(null);
  const [analysisLocation, setAnalysisLocation] = useState(null);
  const [analysisCrop, setAnalysisCrop] = useState(null);
  const [analysisTimestamp, setAnalysisTimestamp] = useState('');
  const [analyzedSignature, setAnalyzedSignature] = useState('');

  useEffect(() => {
    setFetchingCrops(true);
    fetch(`${API_BASE_URL}/api/crops?lang=${language}`)
      .then((response) => {
        if (!response.ok) throw new Error('API error');
        return response.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          setCrops(data);
        } else {
          // API returned empty, use fallback
          setCrops(FALLBACK_CROPS.map(c => ({
            key: c.key,
            name: c.name[language] || c.name.en || c.key,
            idealConditions: c.idealConditions
          })));
        }
        setFetchingCrops(false);
      })
      .catch(() => {
        // API unreachable (e.g., Vercel deployment without backend), use fallback crops
        setCrops(FALLBACK_CROPS.map(c => ({
          key: c.key,
          name: c.name[language] || c.name.en || c.key,
          idealConditions: c.idealConditions
        })));
        setFetchingCrops(false);
      });
  }, [language]);

  useEffect(() => {
    if (!analysisLocation?.locationKey) return undefined;

    const socket = io(API_BASE_URL);
    socket.on('iot_data_update', (data) => {
      if (data.location !== analysisLocation.locationKey) return;

      setSensorData((previous) => ({
        ...previous,
        temperature: data.temperature,
        humidity: data.humidity,
        rainfall: data.rainfall,
        soilMoisture: data.soilMoisture,
        airQualityIndex: data.airQualityIndex,
        observedAt: data.observedAt || data.timestamp || new Date().toISOString(),
      }));
      setAnalysisTimestamp(data.observedAt || data.timestamp || new Date().toISOString());
    });

    return () => socket.disconnect();
  }, [analysisLocation]);

  const selectedStateData = useMemo(() => getStateByKey(selectedState), [selectedState]);
  const cityOptions = useMemo(() => getCityOptionsByState(selectedState), [selectedState]);

  const cropOptions = useMemo(
    () =>
      crops.map((crop) => ({
        ...crop,
        description: buildCropDescription(crop.idealConditions),
      })),
    [crops]
  );

  const selectedCropProfile = useMemo(
    () => cropOptions.find((crop) => crop.key === selectedCrop) || null,
    [cropOptions, selectedCrop]
  );

  const activeCropProfile = useMemo(
    () => cropOptions.find((crop) => crop.key === (analysisCrop?.key || selectedCrop)) || null,
    [analysisCrop, cropOptions, selectedCrop]
  );

  const currentSignature = `${selectedState}|${selectedCity.trim().toLowerCase()}|${selectedCrop}`;
  const hasPendingChanges = Boolean(analyzedSignature) && analyzedSignature !== currentSignature;
  const canAnalyze = Boolean(selectedState && selectedCity.trim() && selectedCrop && !loading);
  const liveLocationLabel = formatLocationLabel(selectedCity.trim(), selectedStateData?.name || '');
  const formattedTimestamp = analysisTimestamp
    ? new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(analysisTimestamp))
    : 'Not analyzed yet';

  const riskStyles = getRiskStyles(decision?.risk);
  const metricCards = buildMetricCards(sensorData, activeCropProfile?.idealConditions);

  async function handleAnalyze() {
    if (!canAnalyze) {
      setError('Please choose a state, city, and crop before running the advisory.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stateKey: selectedState,
          cityName: selectedCity.trim(),
          cropKey: selectedCrop,
          lang: language,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to generate the crop advisory.');
      }

      setSensorData(data.sensorData);
      setDecision(data.decision);
      setAnalysisLocation(data.location);
      setAnalysisCrop(data.crop);
      setAnalysisTimestamp(data.sensorData?.observedAt || new Date().toISOString());
      setAnalyzedSignature(currentSignature);
    } catch (analysisError) {
      // Backend unreachable — run analysis locally
      try {
        const resolvedLocation = resolveIndiaLocation({ stateKey: selectedState, cityName: selectedCity.trim() });
        if (!resolvedLocation) throw new Error('Invalid location');

        const crop = FALLBACK_CROPS.find(c => c.key === selectedCrop) || null;
        const localSensorData = fetchVirtualIoTDataLocal(resolvedLocation.coordinates, resolvedLocation);
        const localDecision = generateDecisionLocal(localSensorData, crop, language);

        setSensorData(localSensorData);
        setDecision(localDecision);
        setAnalysisLocation(resolvedLocation);
        setAnalysisCrop(crop ? { key: crop.key, name: crop.name?.[language] || crop.name?.en || crop.key } : null);
        setAnalysisTimestamp(localSensorData.observedAt || new Date().toISOString());
        setAnalyzedSignature(currentSignature);
      } catch (localError) {
        setError(localError.message || 'Unable to generate the crop advisory.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      <div className="advisor-shell">
        <section className="advisor-hero">
          <div className="advisor-hero-grid">
            <div className="advisor-hero-copy">
              <div className="advisor-eyebrow">
                <Sparkles className="h-4 w-4" />
                {t('nav_advisor', 'India Smart Crop Advisor')}
              </div>

              <h1 className="advisor-title">
                Premium crop planning for every Indian state, every season, and every farm decision.
              </h1>

              <p className="advisor-description">
                Build a field-ready advisory with India-only state and city selection, live virtual IoT
                conditions, and AI crop suitability guidance in one polished workflow.
              </p>

              <div className="advisor-stat-grid">
                {heroStats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="advisor-stat-card">
                      <span className="advisor-stat-icon">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="advisor-stat-value">{item.value}</div>
                        <div className="advisor-stat-label">{item.label}</div>
                        <p className="advisor-stat-helper">{item.helper}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="advisor-secondary-card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="advisor-badge">Selection Snapshot</span>
                <span className="advisor-badge-soft">India only</span>
              </div>

              <div className="mt-5 space-y-3">
                <SelectionRow
                  label="State"
                  value={selectedStateData?.name || 'Choose any Indian state or union territory'}
                />
                <SelectionRow
                  label="City"
                  value={
                    selectedCity.trim()
                      ? selectedCity.trim()
                      : selectedState
                        ? 'Pick a suggested city or type your own'
                        : 'Select a state first'
                  }
                />
                <SelectionRow
                  label="Crop"
                  value={selectedCropProfile?.name || 'Select the crop you want to evaluate'}
                />
              </div>

              <div className="advisor-note mt-5">
                The city control supports both curated suggestions and custom city names, while keeping the
                advisory locked to India.
              </div>
            </div>
          </div>
        </section>

        <section className="advisor-main-grid">
          <div className="advisor-panel">
            <div className="advisor-panel-header">
              <div>
                <div className="advisor-panel-title">
                  <Sprout className="h-5 w-5" />
                  Build Your Advisory Brief
                </div>
                <p className="advisor-panel-subtitle">
                  Select the location and crop, then generate an architected view of field readiness.
                </p>
              </div>
              <span className="advisor-badge-soft">
                {selectedState ? `${cityOptions.length} city suggestions unlocked` : 'Choose a state to unlock cities'}
              </span>
            </div>

            <div className="advisor-selection-grid">
              <div>
                <label className="advisor-field-label">Step 1 • State / UT</label>
                <SearchableSelect
                  options={INDIA_STATE_OPTIONS}
                  value={selectedState}
                  onChange={(nextState) => {
                    setSelectedState(nextState);
                    setSelectedCity('');
                    setError('');
                  }}
                  placeholder="Select a state or union territory"
                  searchPlaceholder="Search Indian states and union territories"
                  icon={MapPin}
                />
              </div>

              <div>
                <label className="advisor-field-label">Step 2 • City</label>
                <SearchableSelect
                  options={cityOptions}
                  value={selectedCity}
                  onChange={(nextCity) => {
                    setSelectedCity(nextCity);
                    setError('');
                  }}
                  placeholder={selectedState ? 'Select or type any city' : 'Choose a state first'}
                  searchPlaceholder={selectedState ? `Search cities in ${selectedStateData?.name}` : 'Choose a state first'}
                  emptyMessage={selectedState ? 'No matching city found in the suggestion list.' : 'Choose a state to view city suggestions.'}
                  icon={Building2}
                  disabled={!selectedState}
                  allowCustomValue
                />
              </div>

              <div>
                <label className="advisor-field-label">
                  Step 3 • Crop {fetchingCrops && <span className="text-gray-400 text-xs ml-2 animate-pulse">(Loading...)</span>}
                </label>
                <SearchableSelect
                  options={cropOptions}
                  value={selectedCrop}
                  onChange={(nextCrop) => {
                    setSelectedCrop(nextCrop);
                    setError('');
                  }}
                  placeholder={fetchingCrops ? "Loading crops..." : "Select crop type"}
                  searchPlaceholder="Search crop profiles"
                  icon={Wheat}
                  disabled={fetchingCrops}
                />
              </div>
            </div>

            {selectedStateData ? (
              <div className="advisor-inline-card">
                <div className="advisor-inline-icon">
                  <Navigation className="h-5 w-5" />
                </div>
                <div>
                  <div className="advisor-inline-title">{selectedStateData.name}</div>
                  <p className="advisor-inline-copy">
                    {selectedStateData.type} • {selectedStateData.region} • {cityOptions.length} curated city
                    suggestions available
                  </p>
                </div>
              </div>
            ) : null}

            {selectedCropProfile?.idealConditions ? (
              <div className="advisor-secondary-card advisor-subcard-spacing">
                <div className="advisor-panel-title">
                  <BarChart3 className="h-5 w-5" />
                  Crop Comfort Profile
                </div>
                <div className="advisor-chip-grid">
                  <span className="advisor-chip">
                    Temp {selectedCropProfile.idealConditions.temperature.min}-
                    {selectedCropProfile.idealConditions.temperature.max} deg C
                  </span>
                  <span className="advisor-chip">
                    Humidity {selectedCropProfile.idealConditions.humidity.min}-
                    {selectedCropProfile.idealConditions.humidity.max}%
                  </span>
                  <span className="advisor-chip">
                    Rainfall {selectedCropProfile.idealConditions.rainfall.min}-
                    {selectedCropProfile.idealConditions.rainfall.max} mm
                  </span>
                </div>
              </div>
            ) : null}

            {error ? <div className="advisor-notice advisor-notice-danger">{error}</div> : null}
            {hasPendingChanges ? (
              <div className="advisor-notice">
                Selections changed after the last run. Generate a fresh advisory to refresh the insights.
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className="advisor-action-btn"
            >
              {loading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path
                      d="M22 12a10 10 0 0 0-10-10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Generating advisory...
                </>
              ) : (
                <>
                  Generate Advisory
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>

          <div className="advisor-panel">
            {decision && sensorData ? (
              <div className="advisor-results-stack">
                <div
                  className="advisor-banner"
                  style={{
                    background: riskStyles.background,
                    borderColor: riskStyles.border,
                  }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <span
                        className="advisor-banner-badge"
                        style={{
                          background: riskStyles.badgeBackground,
                          color: riskStyles.accent,
                        }}
                      >
                        {decision.risk} Risk
                      </span>
                      <h2 className="advisor-banner-title">{decision.recommendation}</h2>
                      <p className="advisor-banner-copy">
                        {analysisLocation?.displayName} • {analysisCrop?.name || activeCropProfile?.name || 'Crop'} •
                        Updated {formattedTimestamp}
                      </p>
                    </div>

                    <div className="advisor-score-card">
                      <span className="advisor-score-label">Suitability</span>
                      <strong>{decision.suitabilityScore}%</strong>
                    </div>
                  </div>

                  <div className="advisor-progress">
                    <div
                      className="advisor-progress-fill"
                      style={{
                        width: `${decision.suitabilityScore}%`,
                        background: `linear-gradient(90deg, ${riskStyles.accent}, #3fb950)`,
                      }}
                    />
                  </div>
                </div>

                <div className="advisor-secondary-card">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="advisor-badge">Latest Run</span>
                    <span className="advisor-badge-soft">{sensorData.simulationMode || 'Virtual simulation'}</span>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <MiniInsight
                      label="Active location"
                      value={analysisLocation?.displayName || liveLocationLabel || 'Not selected'}
                    />
                    <MiniInsight label="Coverage region" value={analysisLocation?.region || 'India'} />
                    <MiniInsight
                      label="City source"
                      value={analysisLocation?.isSuggestedCity ? 'Curated suggestion' : 'Custom city entry'}
                    />
                    <MiniInsight label="Observed at" value={formattedTimestamp} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="advisor-empty-state">
                <div className="advisor-secondary-card">
                  <div className="flex items-center justify-between gap-3">
                    <span className="advisor-badge">How It Works</span>
                    <span className="advisor-badge-soft">World-class flow</span>
                  </div>

                  <div className="mt-5 space-y-4">
                    {workflowSteps.map((step, index) => (
                      <div key={step.title} className="advisor-workflow-row">
                        <div className="advisor-step-index">{index + 1}</div>
                        <div>
                          <div className="advisor-inline-title">{step.title}</div>
                          <p className="advisor-inline-copy">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="advisor-secondary-card">
                  <div className="advisor-panel-title">
                    <Sparkles className="h-5 w-5" />
                    Ready For the Next Run
                  </div>
                  <div className="mt-4 grid gap-3">
                    <MiniInsight label="Coverage" value="India only, all states and UTs" />
                    <MiniInsight
                      label="City mode"
                      value={selectedState ? 'Suggested list plus custom city typing enabled' : 'Choose a state to activate city search'}
                    />
                    <MiniInsight
                      label="Selection preview"
                      value={liveLocationLabel || 'No state and city selected yet'}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {decision && sensorData ? (
          <>
            <section className="advisor-metrics-grid">
              {metricCards.map((metric) => {
                const Icon = metric.icon;
                return (
                  <article key={metric.key} className="advisor-metric-card">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="advisor-metric-label">{metric.label}</div>
                        <div className="advisor-metric-value">
                          {metric.value}
                          <span>{metric.unit}</span>
                        </div>
                      </div>
                      <span
                        className="advisor-metric-icon"
                        style={{ background: metric.badgeBackground, color: metric.accent }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>

                    <div
                      className="advisor-metric-chip"
                      style={{ background: metric.tagBackground, color: metric.accent }}
                    >
                      {metric.status}
                    </div>
                    <p className="advisor-metric-copy">{metric.copy}</p>
                  </article>
                );
              })}
            </section>

            <section className="advisor-insight-grid">
              <div className="advisor-panel">
                <div className="advisor-panel-title">
                  <ShieldAlert className="h-5 w-5" />
                  Detected Alerts
                </div>

                {decision.alerts.length === 0 ? (
                  <div className="advisor-success-box">
                    <CheckCircle2 className="h-5 w-5" />
                    No active field alerts detected for this advisory run.
                  </div>
                ) : (
                  <div className="advisor-list">
                    {decision.alerts.map((alert, index) => (
                      <div key={`${alert.type}-${index}`} className="advisor-list-item">
                        <span className="advisor-list-bullet">
                          <ShieldAlert className="h-4 w-4" />
                        </span>
                        <div>{alert.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="advisor-panel">
                <div className="advisor-panel-title">
                  <Sprout className="h-5 w-5" />
                  Recommended Actions
                </div>

                {decision.precautions.length === 0 ? (
                  <div className="advisor-success-box">
                    <CheckCircle2 className="h-5 w-5" />
                    Conditions look stable. Keep standard crop monitoring in place.
                  </div>
                ) : (
                  <div className="advisor-list">
                    {decision.precautions.map((item, index) => (
                      <div key={`${item}-${index}`} className="advisor-list-item">
                        <span className="advisor-list-count">{index + 1}</span>
                        <div>{item}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="advisor-panel">
                <div className="advisor-panel-title">
                  <Navigation className="h-5 w-5" />
                  Location Intelligence
                </div>

                <div className="grid gap-3">
                  <MiniInsight label="Display name" value={analysisLocation?.displayName || '-'} />
                  <MiniInsight label="Region" value={analysisLocation?.region || 'India'} />
                  <MiniInsight
                    label="Coordinates"
                    value={
                      analysisLocation?.coordinates
                        ? `${analysisLocation.coordinates.lat.toFixed(2)}, ${analysisLocation.coordinates.lon.toFixed(2)}`
                        : '-'
                    }
                  />
                  <MiniInsight
                    label="Location source"
                    value={analysisLocation?.isSuggestedCity ? 'Curated city suggestion' : 'Custom city modeled from state centroid'}
                  />
                </div>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}

function SelectionRow({ label, value }) {
  return (
    <div className="advisor-selection-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MiniInsight({ label, value }) {
  return (
    <div className="advisor-mini-insight">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function buildCropDescription(idealConditions) {
  if (!idealConditions) return 'AI crop comfort profile ready';

  return `Ideal ${idealConditions.temperature.min}-${idealConditions.temperature.max} deg C • Humidity ${idealConditions.humidity.min}-${idealConditions.humidity.max}%`;
}

function getRiskStyles(risk = 'Low') {
  if (risk === 'High') {
    return {
      accent: '#ff7b72',
      background: 'linear-gradient(135deg, rgba(248, 81, 73, 0.18), rgba(248, 81, 73, 0.06))',
      border: 'rgba(248, 81, 73, 0.34)',
      badgeBackground: 'rgba(248, 81, 73, 0.14)',
    };
  }

  if (risk === 'Medium') {
    return {
      accent: '#f59e0b',
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(245, 158, 11, 0.05))',
      border: 'rgba(245, 158, 11, 0.32)',
      badgeBackground: 'rgba(245, 158, 11, 0.14)',
    };
  }

  return {
    accent: '#3fb950',
    background: 'linear-gradient(135deg, rgba(63, 185, 80, 0.18), rgba(63, 185, 80, 0.05))',
    border: 'rgba(63, 185, 80, 0.28)',
    badgeBackground: 'rgba(63, 185, 80, 0.14)',
  };
}

function buildMetricCards(sensorData, idealConditions) {
  if (!sensorData) return [];

  const temperatureState = describeRange(
    sensorData.temperature,
    idealConditions?.temperature,
    'Cooler than crop comfort',
    'Warmer than crop comfort',
    'Within crop comfort zone'
  );
  const humidityState = describeRange(
    sensorData.humidity,
    idealConditions?.humidity,
    'Humidity is below the preferred range',
    'Humidity is above the preferred range',
    'Humidity sits in the preferred range'
  );
  const rainfallState = describeRange(
    sensorData.rainfall,
    idealConditions?.rainfall,
    'Rainfall is lighter than the crop profile',
    'Rainfall is above the crop profile',
    'Rainfall aligns with the crop profile'
  );
  const soilState = describeSoilMoisture(sensorData.soilMoisture);
  const airState = describeAirQuality(sensorData.airQualityIndex);

  return [
    {
      key: 'temperature',
      label: 'Temperature',
      value: sensorData.temperature,
      unit: 'deg C',
      status: temperatureState.status,
      copy: temperatureState.copy,
      icon: Thermometer,
      accent: '#f97316',
      badgeBackground: 'rgba(249, 115, 22, 0.12)',
      tagBackground: 'rgba(249, 115, 22, 0.12)',
    },
    {
      key: 'humidity',
      label: 'Humidity',
      value: sensorData.humidity,
      unit: '%',
      status: humidityState.status,
      copy: humidityState.copy,
      icon: Droplets,
      accent: '#38bdf8',
      badgeBackground: 'rgba(56, 189, 248, 0.12)',
      tagBackground: 'rgba(56, 189, 248, 0.12)',
    },
    {
      key: 'rainfall',
      label: 'Rainfall',
      value: sensorData.rainfall,
      unit: 'mm',
      status: rainfallState.status,
      copy: rainfallState.copy,
      icon: CloudRain,
      accent: '#60a5fa',
      badgeBackground: 'rgba(96, 165, 250, 0.12)',
      tagBackground: 'rgba(96, 165, 250, 0.12)',
    },
    {
      key: 'soil-moisture',
      label: 'Soil Moisture',
      value: sensorData.soilMoisture,
      unit: '%',
      status: soilState.status,
      copy: soilState.copy,
      icon: Sprout,
      accent: '#2ea043',
      badgeBackground: 'rgba(46, 160, 67, 0.12)',
      tagBackground: 'rgba(46, 160, 67, 0.12)',
    },
    {
      key: 'air-quality',
      label: 'Air Quality',
      value: sensorData.airQualityIndex,
      unit: 'AQI',
      status: airState.status,
      copy: airState.copy,
      icon: Activity,
      accent: '#a78bfa',
      badgeBackground: 'rgba(167, 139, 250, 0.12)',
      tagBackground: 'rgba(167, 139, 250, 0.12)',
    },
  ];
}

function describeRange(value, range, lowCopy, highCopy, balancedCopy) {
  if (!range) {
    return {
      status: 'No crop baseline',
      copy: 'This metric is being monitored without a crop-specific target band.',
    };
  }

  if (value < range.min) {
    return { status: 'Below target', copy: lowCopy };
  }

  if (value > range.max) {
    return { status: 'Above target', copy: highCopy };
  }

  return { status: 'On target', copy: balancedCopy };
}

function describeSoilMoisture(value) {
  if (value < 30) {
    return {
      status: 'Dry root zone',
      copy: 'Irrigation support may be needed to protect root activity and crop vigor.',
    };
  }

  if (value > 65) {
    return {
      status: 'Well saturated',
      copy: 'Moisture is elevated, so watch drainage and disease pressure closely.',
    };
  }

  return {
    status: 'Balanced',
    copy: 'Root-zone moisture is in a workable band for most field operations.',
  };
}

function describeAirQuality(value) {
  if (value <= 50) {
    return {
      status: 'Clean air',
      copy: 'Ambient air quality is currently favorable for normal field activity.',
    };
  }

  if (value <= 100) {
    return {
      status: 'Moderate air load',
      copy: 'Conditions remain workable, though sensitive crops should still be monitored.',
    };
  }

  return {
    status: 'Elevated stress',
    copy: 'Air quality is elevated and can add background stress to field conditions.',
  };
}
