const { getAllResources, getResourceByType, addResource,deleteResource } = require('../controllers/resourceController');
const authMiddleware = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

router.get('/', getAllResources);
router.get('/:type', getResourceByType);
router.post('/', authMiddleware, addResource);
router.delete('/:id', authMiddleware, deleteResource);
module.exports = router;
