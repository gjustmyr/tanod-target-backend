const express = require('express');
const {
  listItems,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/inventoryController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.get('/', listItems);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;

