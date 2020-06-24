let express = require('express');
let router = express.Router();
let isAuth = require('../middleware/is-auth');

let statusController = require('../controllers/status');

router.get('/', isAuth, statusController.getStatus);
router.post('/', isAuth, statusController.postStatus);


module.exports = router;