// routes/regionSelect.js
import express from 'express';
const regionSelectRouter = express.Router();

regionSelectRouter.get('/', (req, res) => {
  const regions = [
    { key: 'north', name: 'Northern Vietnam', img: '/images/north.jpg' },
    { key: 'central', name: 'Central Vietnam', img: '/images/central.jpg' },
    { key: 'south', name: 'Southern Vietnam', img: '/images/south.jpg' }
  ];
  res.render('region-selection', { regions });
});

export default regionSelectRouter;
