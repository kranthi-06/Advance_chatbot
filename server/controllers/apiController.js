import Crop from '../models/Crop.js';
import Location from '../models/Location.js';
import { fetchVirtualIoTData } from '../services/virtualIoTService.js';
import { generateDecision } from '../services/aiDecisionEngine.js';
import { resolveIndiaLocation } from '../../shared/indiaLocations.js';

export const getCrops = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const crops = await Crop.find({});
    const localizedCrops = crops.map(c => ({
      key: c.key,
      name: c.name[lang] || c.name.en || c.key,
      idealConditions: c.idealConditions
    }));
    res.json(localizedCrops);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch crops' });
  }
};

export const getLocations = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const locations = await Location.find({});
    const localizedLocations = locations.map(l => ({
      key: l.key,
      name: l.name[lang] || l.name.en || l.key,
      coordinates: l.coordinates
    }));
    res.json(localizedLocations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};

export const analyzeVirtualIoT = async (req, res) => {
  try {
    const { locationKey, cropKey, lang, stateKey, cityName } = req.body;
    const selectedLanguage = lang || 'en';

    let resolvedLocation = null;

    if (stateKey && cityName) {
      resolvedLocation = resolveIndiaLocation({ stateKey, cityName });
    } else if (locationKey) {
      const location = await Location.findOne({ key: locationKey });
      if (location) {
        resolvedLocation = {
          country: 'India',
          stateKey: null,
          stateName: '',
          stateType: '',
          region: 'India',
          cityName: location.name?.[selectedLanguage] || location.name?.en || location.key,
          locationKey: location.key,
          coordinates: location.coordinates || { lat: 20.5937, lon: 78.9629 },
          isSuggestedCity: true,
          displayName: location.name?.[selectedLanguage] || location.name?.en || location.key,
        };
      }
    }

    if (!resolvedLocation) {
      return res.status(400).json({ error: 'Please select a valid Indian state and city.' });
    }

    let crop = null;
    if (cropKey) crop = await Crop.findOne({ key: cropKey });

    const sensorData = await fetchVirtualIoTData(resolvedLocation.coordinates, resolvedLocation);

    if (req.io) {
      req.io.emit('iot_data_update', {
        location: resolvedLocation.locationKey,
        cityName: resolvedLocation.cityName,
        stateName: resolvedLocation.stateName,
        ...sensorData,
        timestamp: new Date()
      });
    }

    const decision = generateDecision(sensorData, crop, selectedLanguage);

    res.json({
      sensorData,
      decision,
      location: resolvedLocation,
      crop: crop
        ? {
            key: crop.key,
            name: crop.name?.[selectedLanguage] || crop.name?.en || crop.key,
          }
        : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error analyzing IoT data' });
  }
};
