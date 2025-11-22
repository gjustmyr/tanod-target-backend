const InventoryItem = require('../models/inventoryItem');

const listItems = async (req, res) => {
  try {
    const items = await InventoryItem.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    return res.json(items);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Could not load inventory' });
  }
};

const createItem = async (req, res) => {
  const { name, quantity, description } = req.body;
  if (!name || quantity === undefined) {
    return res.status(400).json({ message: 'Item name and quantity are required' });
  }

  try {
    const item = await InventoryItem.create({
      name: name.trim(),
      quantity: Number(quantity),
      description: description?.trim() || null,
      userId: req.user.id
    });
    return res.status(201).json(item);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Could not create inventory item' });
  }
};

const updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, quantity, description } = req.body;
  if (!name || quantity === undefined) {
    return res.status(400).json({ message: 'Item name and quantity are required' });
  }

  try {
    const item = await InventoryItem.findOne({ where: { id, userId: req.user.id } });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.name = name.trim();
    item.quantity = Number(quantity);
    item.description = description?.trim() || null;
    await item.save();
    return res.json(item);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Could not update inventory item' });
  }
};

const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const count = await InventoryItem.destroy({ where: { id, userId: req.user.id } });
    if (!count) {
      return res.status(404).json({ message: 'Item not found' });
    }
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Could not delete inventory item' });
  }
};

module.exports = {
  listItems,
  createItem,
  updateItem,
  deleteItem
};

