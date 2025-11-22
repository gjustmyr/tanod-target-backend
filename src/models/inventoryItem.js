const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const InventoryItem = sequelize.define(
  'InventoryItem',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    description: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  },
  {
    tableName: 'inventory_items',
    timestamps: true
  }
);

module.exports = InventoryItem;

