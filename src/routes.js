const { Router } = require('express');
const MachineMealyController = require('./controllers/MachineMealyController');

const router = Router();

router.post('/', MachineMealyController.store);

module.exports = router;