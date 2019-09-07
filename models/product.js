const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product', {
  id: Sequelize.INTEGER,
  autoincrement: true,
  allowNull: false,
  primaryKey: true
})