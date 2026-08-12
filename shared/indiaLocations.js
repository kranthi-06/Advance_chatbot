const INDIA_LATITUDE_RANGE = { min: 6.5, max: 37.6 };
const INDIA_LONGITUDE_RANGE = { min: 68.0, max: 97.5 };

export const INDIA_STATE_DATA = [
  {
    key: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    type: 'State',
    region: 'South India',
    centroid: { lat: 15.9129, lon: 79.74 },
    cities: [
      { key: 'visakhapatnam', name: 'Visakhapatnam', lat: 17.6868, lon: 83.2185 },
      { key: 'vijayawada', name: 'Vijayawada', lat: 16.5062, lon: 80.648 },
      { key: 'tirupati', name: 'Tirupati', lat: 13.6288, lon: 79.4192 },
      { key: 'kurnool', name: 'Kurnool', lat: 15.8281, lon: 78.0373 },
      { key: 'rajahmundry', name: 'Rajahmundry', lat: 17.0005, lon: 81.804 },
    ],
  },
  {
    key: 'arunachal-pradesh',
    name: 'Arunachal Pradesh',
    type: 'State',
    region: 'North-East India',
    centroid: { lat: 28.218, lon: 94.7278 },
    cities: [
      { key: 'itanagar', name: 'Itanagar', lat: 27.0844, lon: 93.6053 },
      { key: 'tawang', name: 'Tawang', lat: 27.5861, lon: 91.8654 },
      { key: 'pasighat', name: 'Pasighat', lat: 28.0663, lon: 95.3268 },
      { key: 'ziro', name: 'Ziro', lat: 27.5883, lon: 93.8281 },
    ],
  },
  {
    key: 'assam',
    name: 'Assam',
    type: 'State',
    region: 'North-East India',
    centroid: { lat: 26.2006, lon: 92.9376 },
    cities: [
      { key: 'guwahati', name: 'Guwahati', lat: 26.1445, lon: 91.7362 },
      { key: 'dibrugarh', name: 'Dibrugarh', lat: 27.4728, lon: 94.912 },
      { key: 'jorhat', name: 'Jorhat', lat: 26.7509, lon: 94.2037 },
      { key: 'silchar', name: 'Silchar', lat: 24.8333, lon: 92.7789 },
      { key: 'tezpur', name: 'Tezpur', lat: 26.6528, lon: 92.7926 },
    ],
  },
  {
    key: 'bihar',
    name: 'Bihar',
    type: 'State',
    region: 'East India',
    centroid: { lat: 25.0961, lon: 85.3131 },
    cities: [
      { key: 'patna', name: 'Patna', lat: 25.5941, lon: 85.1376 },
      { key: 'gaya', name: 'Gaya', lat: 24.7914, lon: 85.0002 },
      { key: 'muzaffarpur', name: 'Muzaffarpur', lat: 26.1209, lon: 85.3647 },
      { key: 'bhagalpur', name: 'Bhagalpur', lat: 25.2425, lon: 86.9842 },
      { key: 'purnia', name: 'Purnia', lat: 25.7771, lon: 87.4753 },
    ],
  },
  {
    key: 'chhattisgarh',
    name: 'Chhattisgarh',
    type: 'State',
    region: 'Central India',
    centroid: { lat: 21.2787, lon: 81.8661 },
    cities: [
      { key: 'raipur', name: 'Raipur', lat: 21.2514, lon: 81.6296 },
      { key: 'bilaspur', name: 'Bilaspur', lat: 22.0797, lon: 82.1409 },
      { key: 'durg', name: 'Durg', lat: 21.1904, lon: 81.2849 },
      { key: 'jagdalpur', name: 'Jagdalpur', lat: 19.0748, lon: 82.008 },
    ],
  },
  {
    key: 'goa',
    name: 'Goa',
    type: 'State',
    region: 'West India',
    centroid: { lat: 15.2993, lon: 74.124 },
    cities: [
      { key: 'panaji', name: 'Panaji', lat: 15.4909, lon: 73.8278 },
      { key: 'margao', name: 'Margao', lat: 15.2832, lon: 73.9862 },
      { key: 'vasco-da-gama', name: 'Vasco da Gama', lat: 15.386, lon: 73.8448 },
      { key: 'mapusa', name: 'Mapusa', lat: 15.5937, lon: 73.808 },
    ],
  },
  {
    key: 'gujarat',
    name: 'Gujarat',
    type: 'State',
    region: 'West India',
    centroid: { lat: 22.2587, lon: 71.1924 },
    cities: [
      { key: 'ahmedabad', name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
      { key: 'surat', name: 'Surat', lat: 21.1702, lon: 72.8311 },
      { key: 'vadodara', name: 'Vadodara', lat: 22.3072, lon: 73.1812 },
      { key: 'rajkot', name: 'Rajkot', lat: 22.3039, lon: 70.8022 },
      { key: 'bhavnagar', name: 'Bhavnagar', lat: 21.7645, lon: 72.1519 },
    ],
  },
  {
    key: 'haryana',
    name: 'Haryana',
    type: 'State',
    region: 'North India',
    centroid: { lat: 29.0588, lon: 76.0856 },
    cities: [
      { key: 'gurugram', name: 'Gurugram', lat: 28.4595, lon: 77.0266 },
      { key: 'faridabad', name: 'Faridabad', lat: 28.4089, lon: 77.3178 },
      { key: 'karnal', name: 'Karnal', lat: 29.6857, lon: 76.9905 },
      { key: 'hisar', name: 'Hisar', lat: 29.1492, lon: 75.7217 },
      { key: 'ambala', name: 'Ambala', lat: 30.3782, lon: 76.7767 },
    ],
  },
  {
    key: 'himachal-pradesh',
    name: 'Himachal Pradesh',
    type: 'State',
    region: 'North India',
    centroid: { lat: 31.1048, lon: 77.1734 },
    cities: [
      { key: 'shimla', name: 'Shimla', lat: 31.1048, lon: 77.1734 },
      { key: 'dharamshala', name: 'Dharamshala', lat: 32.219, lon: 76.3234 },
      { key: 'mandi', name: 'Mandi', lat: 31.7084, lon: 76.931 },
      { key: 'solan', name: 'Solan', lat: 30.9045, lon: 77.0967 },
    ],
  },
  {
    key: 'jharkhand',
    name: 'Jharkhand',
    type: 'State',
    region: 'East India',
    centroid: { lat: 23.6102, lon: 85.2799 },
    cities: [
      { key: 'ranchi', name: 'Ranchi', lat: 23.3441, lon: 85.3096 },
      { key: 'jamshedpur', name: 'Jamshedpur', lat: 22.8046, lon: 86.2029 },
      { key: 'dhanbad', name: 'Dhanbad', lat: 23.7957, lon: 86.4304 },
      { key: 'bokaro', name: 'Bokaro', lat: 23.6693, lon: 86.1511 },
      { key: 'deoghar', name: 'Deoghar', lat: 24.4764, lon: 86.6914 },
    ],
  },
  {
    key: 'karnataka',
    name: 'Karnataka',
    type: 'State',
    region: 'South India',
    centroid: { lat: 15.3173, lon: 75.7139 },
    cities: [
      { key: 'bengaluru', name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
      { key: 'mysuru', name: 'Mysuru', lat: 12.2958, lon: 76.6394 },
      { key: 'hubballi', name: 'Hubballi', lat: 15.3647, lon: 75.124 },
      { key: 'mangaluru', name: 'Mangaluru', lat: 12.9141, lon: 74.856 },
      { key: 'belagavi', name: 'Belagavi', lat: 15.8497, lon: 74.4977 },
    ],
  },
  {
    key: 'kerala',
    name: 'Kerala',
    type: 'State',
    region: 'South India',
    centroid: { lat: 10.8505, lon: 76.2711 },
    cities: [
      { key: 'thiruvananthapuram', name: 'Thiruvananthapuram', lat: 8.5241, lon: 76.9366 },
      { key: 'kochi', name: 'Kochi', lat: 9.9312, lon: 76.2673 },
      { key: 'kozhikode', name: 'Kozhikode', lat: 11.2588, lon: 75.7804 },
      { key: 'thrissur', name: 'Thrissur', lat: 10.5276, lon: 76.2144 },
    ],
  },
  {
    key: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    type: 'State',
    region: 'Central India',
    centroid: { lat: 22.9734, lon: 78.6569 },
    cities: [
      { key: 'bhopal', name: 'Bhopal', lat: 23.2599, lon: 77.4126 },
      { key: 'indore', name: 'Indore', lat: 22.7196, lon: 75.8577 },
      { key: 'jabalpur', name: 'Jabalpur', lat: 23.1815, lon: 79.9864 },
      { key: 'gwalior', name: 'Gwalior', lat: 26.2183, lon: 78.1828 },
      { key: 'ujjain', name: 'Ujjain', lat: 23.1765, lon: 75.7885 },
    ],
  },
  {
    key: 'maharashtra',
    name: 'Maharashtra',
    type: 'State',
    region: 'West India',
    centroid: { lat: 19.7515, lon: 75.7139 },
    cities: [
      { key: 'mumbai', name: 'Mumbai', lat: 19.076, lon: 72.8777 },
      { key: 'pune', name: 'Pune', lat: 18.5204, lon: 73.8567 },
      { key: 'nagpur', name: 'Nagpur', lat: 21.1458, lon: 79.0882 },
      { key: 'nashik', name: 'Nashik', lat: 20.011, lon: 73.7903 },
      { key: 'aurangabad', name: 'Aurangabad', lat: 19.8762, lon: 75.3433 },
    ],
  },
  {
    key: 'manipur',
    name: 'Manipur',
    type: 'State',
    region: 'North-East India',
    centroid: { lat: 24.6637, lon: 93.9063 },
    cities: [
      { key: 'imphal', name: 'Imphal', lat: 24.817, lon: 93.9368 },
      { key: 'churachandpur', name: 'Churachandpur', lat: 24.3333, lon: 93.6833 },
      { key: 'thoubal', name: 'Thoubal', lat: 24.6389, lon: 93.9964 },
      { key: 'ukhrul', name: 'Ukhrul', lat: 25.1094, lon: 94.3611 },
    ],
  },
  {
    key: 'meghalaya',
    name: 'Meghalaya',
    type: 'State',
    region: 'North-East India',
    centroid: { lat: 25.467, lon: 91.3662 },
    cities: [
      { key: 'shillong', name: 'Shillong', lat: 25.5788, lon: 91.8933 },
      { key: 'tura', name: 'Tura', lat: 25.5142, lon: 90.2021 },
      { key: 'jowai', name: 'Jowai', lat: 25.452, lon: 92.2086 },
      { key: 'nongpoh', name: 'Nongpoh', lat: 25.9023, lon: 91.8769 },
    ],
  },
  {
    key: 'mizoram',
    name: 'Mizoram',
    type: 'State',
    region: 'North-East India',
    centroid: { lat: 23.1645, lon: 92.9376 },
    cities: [
      { key: 'aizawl', name: 'Aizawl', lat: 23.7271, lon: 92.7176 },
      { key: 'lunglei', name: 'Lunglei', lat: 22.8671, lon: 92.765 },
      { key: 'champhai', name: 'Champhai', lat: 23.456, lon: 93.3282 },
      { key: 'kolasib', name: 'Kolasib', lat: 24.2239, lon: 92.677 },
    ],
  },
  {
    key: 'nagaland',
    name: 'Nagaland',
    type: 'State',
    region: 'North-East India',
    centroid: { lat: 26.1584, lon: 94.5624 },
    cities: [
      { key: 'kohima', name: 'Kohima', lat: 25.6751, lon: 94.1086 },
      { key: 'dimapur', name: 'Dimapur', lat: 25.9091, lon: 93.7266 },
      { key: 'mokokchung', name: 'Mokokchung', lat: 26.3248, lon: 94.5162 },
      { key: 'tuensang', name: 'Tuensang', lat: 26.267, lon: 94.8246 },
    ],
  },
  {
    key: 'odisha',
    name: 'Odisha',
    type: 'State',
    region: 'East India',
    centroid: { lat: 20.9517, lon: 85.0985 },
    cities: [
      { key: 'bhubaneswar', name: 'Bhubaneswar', lat: 20.2961, lon: 85.8245 },
      { key: 'cuttack', name: 'Cuttack', lat: 20.4625, lon: 85.883 },
      { key: 'rourkela', name: 'Rourkela', lat: 22.2604, lon: 84.8536 },
      { key: 'sambalpur', name: 'Sambalpur', lat: 21.4669, lon: 83.9812 },
      { key: 'berhampur', name: 'Berhampur', lat: 19.3149, lon: 84.7941 },
    ],
  },
  {
    key: 'punjab',
    name: 'Punjab',
    type: 'State',
    region: 'North India',
    centroid: { lat: 31.1471, lon: 75.3412 },
    cities: [
      { key: 'ludhiana', name: 'Ludhiana', lat: 30.901, lon: 75.8573 },
      { key: 'amritsar', name: 'Amritsar', lat: 31.634, lon: 74.8723 },
      { key: 'jalandhar', name: 'Jalandhar', lat: 31.326, lon: 75.5762 },
      { key: 'patiala', name: 'Patiala', lat: 30.3398, lon: 76.3869 },
      { key: 'bathinda', name: 'Bathinda', lat: 30.211, lon: 74.9455 },
    ],
  },
  {
    key: 'rajasthan',
    name: 'Rajasthan',
    type: 'State',
    region: 'North India',
    centroid: { lat: 27.0238, lon: 74.2179 },
    cities: [
      { key: 'jaipur', name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
      { key: 'jodhpur', name: 'Jodhpur', lat: 26.2389, lon: 73.0243 },
      { key: 'udaipur', name: 'Udaipur', lat: 24.5854, lon: 73.7125 },
      { key: 'kota', name: 'Kota', lat: 25.2138, lon: 75.8648 },
      { key: 'bikaner', name: 'Bikaner', lat: 28.0229, lon: 73.3119 },
    ],
  },
  {
    key: 'sikkim',
    name: 'Sikkim',
    type: 'State',
    region: 'North-East India',
    centroid: { lat: 27.533, lon: 88.5122 },
    cities: [
      { key: 'gangtok', name: 'Gangtok', lat: 27.3389, lon: 88.6065 },
      { key: 'namchi', name: 'Namchi', lat: 27.1665, lon: 88.3636 },
      { key: 'gyalshing', name: 'Gyalshing', lat: 27.298, lon: 88.2576 },
      { key: 'mangan', name: 'Mangan', lat: 27.5167, lon: 88.5333 },
    ],
  },
  {
    key: 'tamil-nadu',
    name: 'Tamil Nadu',
    type: 'State',
    region: 'South India',
    centroid: { lat: 11.1271, lon: 78.6569 },
    cities: [
      { key: 'chennai', name: 'Chennai', lat: 13.0827, lon: 80.2707 },
      { key: 'coimbatore', name: 'Coimbatore', lat: 11.0168, lon: 76.9558 },
      { key: 'madurai', name: 'Madurai', lat: 9.9252, lon: 78.1198 },
      { key: 'tiruchirappalli', name: 'Tiruchirappalli', lat: 10.7905, lon: 78.7047 },
      { key: 'salem', name: 'Salem', lat: 11.6643, lon: 78.146 },
    ],
  },
  {
    key: 'telangana',
    name: 'Telangana',
    type: 'State',
    region: 'South India',
    centroid: { lat: 18.1124, lon: 79.0193 },
    cities: [
      { key: 'hyderabad', name: 'Hyderabad', lat: 17.385, lon: 78.4867 },
      { key: 'warangal', name: 'Warangal', lat: 17.9689, lon: 79.5941 },
      { key: 'karimnagar', name: 'Karimnagar', lat: 18.4386, lon: 79.1288 },
      { key: 'khammam', name: 'Khammam', lat: 17.2473, lon: 80.1514 },
      { key: 'nizamabad', name: 'Nizamabad', lat: 18.6725, lon: 78.0941 },
    ],
  },
  {
    key: 'tripura',
    name: 'Tripura',
    type: 'State',
    region: 'North-East India',
    centroid: { lat: 23.9408, lon: 91.9882 },
    cities: [
      { key: 'agartala', name: 'Agartala', lat: 23.8315, lon: 91.2868 },
      { key: 'udaipur-tripura', name: 'Udaipur', lat: 23.533, lon: 91.484 },
      { key: 'dharmanagar', name: 'Dharmanagar', lat: 24.3667, lon: 92.1667 },
      { key: 'kailashahar', name: 'Kailashahar', lat: 24.3333, lon: 92.0167 },
    ],
  },
  {
    key: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    type: 'State',
    region: 'North India',
    centroid: { lat: 27.5706, lon: 80.0982 },
    cities: [
      { key: 'lucknow', name: 'Lucknow', lat: 26.8467, lon: 80.9462 },
      { key: 'kanpur', name: 'Kanpur', lat: 26.4499, lon: 80.3319 },
      { key: 'varanasi', name: 'Varanasi', lat: 25.3176, lon: 82.9739 },
      { key: 'agra', name: 'Agra', lat: 27.1767, lon: 78.0081 },
      { key: 'meerut', name: 'Meerut', lat: 28.9845, lon: 77.7064 },
      { key: 'prayagraj', name: 'Prayagraj', lat: 25.4358, lon: 81.8463 },
    ],
  },
  {
    key: 'uttarakhand',
    name: 'Uttarakhand',
    type: 'State',
    region: 'North India',
    centroid: { lat: 30.0668, lon: 79.0193 },
    cities: [
      { key: 'dehradun', name: 'Dehradun', lat: 30.3165, lon: 78.0322 },
      { key: 'haridwar', name: 'Haridwar', lat: 29.9457, lon: 78.1642 },
      { key: 'haldwani', name: 'Haldwani', lat: 29.2191, lon: 79.512 },
      { key: 'rudrapur', name: 'Rudrapur', lat: 28.9875, lon: 79.4144 },
      { key: 'pithoragarh', name: 'Pithoragarh', lat: 29.5829, lon: 80.2182 },
    ],
  },
  {
    key: 'west-bengal',
    name: 'West Bengal',
    type: 'State',
    region: 'East India',
    centroid: { lat: 22.9868, lon: 87.855 },
    cities: [
      { key: 'kolkata', name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
      { key: 'howrah', name: 'Howrah', lat: 22.5958, lon: 88.2636 },
      { key: 'siliguri', name: 'Siliguri', lat: 26.7271, lon: 88.3953 },
      { key: 'durgapur', name: 'Durgapur', lat: 23.5204, lon: 87.3119 },
      { key: 'darjeeling', name: 'Darjeeling', lat: 27.036, lon: 88.2627 },
    ],
  },
  {
    key: 'andaman-and-nicobar-islands',
    name: 'Andaman and Nicobar Islands',
    type: 'Union Territory',
    region: 'Islands',
    centroid: { lat: 11.7401, lon: 92.6586 },
    cities: [
      { key: 'port-blair', name: 'Port Blair', lat: 11.6234, lon: 92.7265 },
      { key: 'diglipur', name: 'Diglipur', lat: 13.2642, lon: 93.041 },
      { key: 'car-nicobar', name: 'Car Nicobar', lat: 9.178, lon: 92.8193 },
    ],
  },
  {
    key: 'chandigarh',
    name: 'Chandigarh',
    type: 'Union Territory',
    region: 'North India',
    centroid: { lat: 30.7333, lon: 76.7794 },
    cities: [
      { key: 'chandigarh-city', name: 'Chandigarh', lat: 30.7333, lon: 76.7794 },
      { key: 'manimajra', name: 'Manimajra', lat: 30.723, lon: 76.8421 },
      { key: 'burail', name: 'Burail', lat: 30.7135, lon: 76.7696 },
      { key: 'daria', name: 'Daria', lat: 30.7002, lon: 76.8076 },
    ],
  },
  {
    key: 'dadra-and-nagar-haveli-and-daman-and-diu',
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    type: 'Union Territory',
    region: 'West India',
    centroid: { lat: 20.1809, lon: 73.0169 },
    cities: [
      { key: 'daman', name: 'Daman', lat: 20.3974, lon: 72.8328 },
      { key: 'diu', name: 'Diu', lat: 20.7144, lon: 70.9874 },
      { key: 'silvassa', name: 'Silvassa', lat: 20.2739, lon: 72.9967 },
      { key: 'dadra', name: 'Dadra', lat: 20.3258, lon: 72.9661 },
    ],
  },
  {
    key: 'delhi',
    name: 'Delhi',
    type: 'Union Territory',
    region: 'North India',
    centroid: { lat: 28.7041, lon: 77.1025 },
    cities: [
      { key: 'new-delhi', name: 'New Delhi', lat: 28.6139, lon: 77.209 },
      { key: 'dwarka', name: 'Dwarka', lat: 28.5921, lon: 77.046 },
      { key: 'rohini', name: 'Rohini', lat: 28.74, lon: 77.12 },
      { key: 'shahdara', name: 'Shahdara', lat: 28.6833, lon: 77.2833 },
      { key: 'delhi-cantonment', name: 'Delhi Cantonment', lat: 28.591, lon: 77.134 },
    ],
  },
  {
    key: 'jammu-and-kashmir',
    name: 'Jammu and Kashmir',
    type: 'Union Territory',
    region: 'North India',
    centroid: { lat: 33.7782, lon: 76.5762 },
    cities: [
      { key: 'srinagar', name: 'Srinagar', lat: 34.0837, lon: 74.7973 },
      { key: 'jammu', name: 'Jammu', lat: 32.7266, lon: 74.857 },
      { key: 'anantnag', name: 'Anantnag', lat: 33.7311, lon: 75.1487 },
      { key: 'baramulla', name: 'Baramulla', lat: 34.198, lon: 74.3636 },
    ],
  },
  {
    key: 'ladakh',
    name: 'Ladakh',
    type: 'Union Territory',
    region: 'North India',
    centroid: { lat: 34.2268, lon: 77.5619 },
    cities: [
      { key: 'leh', name: 'Leh', lat: 34.1526, lon: 77.5771 },
      { key: 'kargil', name: 'Kargil', lat: 34.5564, lon: 76.1258 },
      { key: 'diskit', name: 'Diskit', lat: 34.5583, lon: 77.5494 },
      { key: 'nyoma', name: 'Nyoma', lat: 33.2167, lon: 78.5833 },
    ],
  },
  {
    key: 'lakshadweep',
    name: 'Lakshadweep',
    type: 'Union Territory',
    region: 'Islands',
    centroid: { lat: 10.5667, lon: 72.6417 },
    cities: [
      { key: 'kavaratti', name: 'Kavaratti', lat: 10.5669, lon: 72.642 },
      { key: 'agatti', name: 'Agatti', lat: 10.8505, lon: 72.1997 },
      { key: 'minicoy', name: 'Minicoy', lat: 8.2906, lon: 73.051 },
      { key: 'amini', name: 'Amini', lat: 11.1236, lon: 72.7317 },
    ],
  },
  {
    key: 'puducherry',
    name: 'Puducherry',
    type: 'Union Territory',
    region: 'South India',
    centroid: { lat: 11.9416, lon: 79.8083 },
    cities: [
      { key: 'puducherry-city', name: 'Puducherry', lat: 11.9416, lon: 79.8083 },
      { key: 'karaikal', name: 'Karaikal', lat: 10.9254, lon: 79.838 },
      { key: 'mahe', name: 'Mahe', lat: 11.7, lon: 75.533 },
      { key: 'yanam', name: 'Yanam', lat: 16.7333, lon: 82.2167 },
    ],
  },
];

export const INDIA_TOTAL_STATE_COUNT = INDIA_STATE_DATA.length;
export const INDIA_TOTAL_CITY_SUGGESTIONS = INDIA_STATE_DATA.reduce(
  (sum, state) => sum + state.cities.length,
  0
);

export const INDIA_STATE_OPTIONS = INDIA_STATE_DATA.map((state) => ({
  key: state.key,
  name: state.name,
  description: `${state.type} • ${state.region} • ${state.cities.length} city suggestions`,
}));

export function getStateByKey(stateKey) {
  return INDIA_STATE_DATA.find((state) => state.key === stateKey) || null;
}

export function getCityOptionsByState(stateKey) {
  const state = getStateByKey(stateKey);
  if (!state) return [];

  return state.cities.map((city) => ({
    key: city.name,
    name: city.name,
    description: `${state.name} • ${state.region}`,
  }));
}

export function formatLocationLabel(cityName, stateName) {
  if (cityName && stateName) return `${cityName}, ${stateName}`;
  return cityName || stateName || '';
}

export function resolveIndiaLocation({ stateKey, cityName }) {
  const state = getStateByKey(stateKey);
  const normalizedCityName = cityName?.trim();

  if (!state || !normalizedCityName) return null;

  const normalizedSearch = normalizedCityName.toLowerCase();
  const matchedCity =
    state.cities.find(
      (city) =>
        city.name.toLowerCase() === normalizedSearch ||
        city.key === slugify(normalizedCityName)
    ) || null;

  const resolvedCityName = matchedCity?.name || normalizedCityName;
  const coordinates = matchedCity
    ? { lat: matchedCity.lat, lon: matchedCity.lon }
    : buildPseudoCoordinates(state, resolvedCityName);

  return {
    country: 'India',
    stateKey: state.key,
    stateName: state.name,
    stateType: state.type,
    region: state.region,
    cityName: resolvedCityName,
    locationKey: `${state.key}__${slugify(resolvedCityName)}`,
    coordinates,
    isSuggestedCity: Boolean(matchedCity),
    displayName: formatLocationLabel(resolvedCityName, state.name),
  };
}

function buildPseudoCoordinates(state, cityName) {
  const latSeed = hashString(`${state.key}:${cityName}:lat`);
  const lonSeed = hashString(`${state.key}:${cityName}:lon`);
  const latOffset = ((latSeed % 1800) / 1000 - 0.9) * 0.9;
  const lonOffset = ((lonSeed % 2400) / 1000 - 1.2) * 0.9;

  return {
    lat: roundToFour(clamp(state.centroid.lat + latOffset, INDIA_LATITUDE_RANGE.min, INDIA_LATITUDE_RANGE.max)),
    lon: roundToFour(clamp(state.centroid.lon + lonOffset, INDIA_LONGITUDE_RANGE.min, INDIA_LONGITUDE_RANGE.max)),
  };
}

function slugify(value = '') {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function roundToFour(value) {
  return Number(value.toFixed(4));
}
