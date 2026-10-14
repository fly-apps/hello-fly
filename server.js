const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 8080;

const REGIONS = {
  ams: 'Amsterdam, Netherlands',
  arn: 'Stockholm, Sweden',
  bom: 'Mumbai, India',
  cdg: 'Paris, France',
  dfw: 'Dallas, Texas (US)',
  ewr: 'Secaucus, NJ (US)',
  fra: 'Frankfurt, Germany',
  gru: 'São Paulo, Brazil',
  iad: 'Ashburn, Virginia (US)',
  jnb: 'Johannesburg, South Africa',
  lax: 'Los Angeles, California (US)',
  lhr: 'London, United Kingdom',
  nrt: 'Tokyo, Japan',
  ord: 'Chicago, Illinois (US)',
  sin: 'Singapore',
  sjc: 'San Jose, California (US)',
  syd: 'Sydney, Australia',
  yyz: 'Toronto, Canada',
};

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.disable('x-powered-by');

app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)}ms`);
  });
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.type('text').send('ok');
});

app.get('/', (req, res) => {
  const region = process.env.FLY_REGION || 'local';
  res.render('index', {
    appName: process.env.FLY_APP_NAME || 'hello-fly',
    region,
    regionName: REGIONS[region] || null,
    machineId: process.env.FLY_MACHINE_ID || 'local',
    onFly: Boolean(process.env.FLY_MACHINE_ID),
    time: new Date().toUTCString(),
  });
});

app.use((req, res) => {
  res.status(404).render('error', { status: 404, message: 'Page not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', { status: 500, message: 'Something went wrong' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${PORT}`);
});

// Fly sends SIGINT/SIGTERM when stopping a machine
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    server.closeIdleConnections();
  });
}
