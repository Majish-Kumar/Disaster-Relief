const https = require('https');

const nodes = {
  'S': { coords: [13.0694, 80.1948] },
  'A': { coords: [13.0067, 80.2570] },
  'B': { coords: [13.0102, 80.2157] },
  'C': { coords: [12.9692, 80.2036] },
  'T': { coords: [12.9815, 80.2180] }
};

const edgesToFetch = [
  { from: 'A', to: 'B' },
  { from: 'B', to: 'C' },
  { from: 'A', to: 'C' },
  { from: 'C', to: 'T' }
];

async function fetchRoute(start, end) {
  const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.routes && json.routes.length > 0) {
            const coords = json.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
            resolve(coords);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  for (const edge of edgesToFetch) {
    const start = nodes[edge.from].coords;
    const end = nodes[edge.to].coords;
    const coords = await fetchRoute(start, end);
    console.log(`const route${edge.from}${edge.to} = ${JSON.stringify(coords)};`);
    // Wait a bit to respect API rate limits
    await new Promise(r => setTimeout(r, 500));
  }
}

main();
