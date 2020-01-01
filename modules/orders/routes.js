const userController = require('../users/controller/users.js');
const authController = require('../../modules/auth/controllers/auth');
const orderController = require('./controllers/orders');
const productController = require('../products/controllers/products');
module.exports = (router) => {
    router.post('/order/create/:userId', authController.requireSignin, authController.isAuth, userController.addOrderToUserHistory, productController.decreaseQuantity, orderController.createOrder);
    router.param('userId', userController.findUserById);
}