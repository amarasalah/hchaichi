const express = require('express');
const router = express.Router();
const Order = require('./../models/Order');
const Shape = require('./../models/Shape');
const Material = require('./../models/Material');
const MaterialType = require('./../models/MaterialType');
const Edge = require('./../models/Edge');
const Angle = require('./../models/Angle');
const {User} = require('./../models/User');

router.get('/', async (req, res) => {
  try {
    const clientCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();
    const ongoingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'approved' });
    const canceledOrders = await Order.countDocuments({ status: 'canceled' });

    const orders = await Order.find();
    const totalRevenue = orders.reduce((total, order) => total + order.totalCost, 0);

    const totalShapes = await Shape.countDocuments();
    const availableShapes = await Shape.countDocuments({ status: 'available' });

    const totalMaterials = await Material.countDocuments();
    const availableMaterials = await Material.countDocuments({ status: 'available' });

    const totalMaterialTypes = await MaterialType.countDocuments();
    const availableMaterialTypes = await MaterialType.countDocuments({ status: 'available' });

    const totalEdges = await Edge.countDocuments();
    const availableEdges = await Edge.countDocuments({ status: 'available' });

    const totalAngles = await Angle.countDocuments();
    const availableAngles = await Angle.countDocuments({ status: 'available' });

    return res.json({
      clientCount,
      orderCount,
      ongoingOrders,
      completedOrders,
      canceledOrders,
      totalRevenue,
      totalShapes,
      availableShapes,
      totalMaterials,
      availableMaterials,
      totalMaterialTypes,
      availableMaterialTypes,
      totalEdges,
      availableEdges,
      totalAngles,
      availableAngles,
    });
  } catch (error) {
    console.error('Failed to fetch statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics', message: error.message });
  }
});

module.exports = router;
