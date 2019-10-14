const mongoose = require('mongoose');
const Order = require('./order');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  orders: [{
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: false
    }
  }]
})



userSchema.methods.addToCart = async function (product) {

    let user = this;
    let cart = [...user.cart]
    let p = new Promise((resolve, reject) => {

      const cartItemIndex = cart.findIndex(item => {
        return item.product._id.toString() === product._id.toString();
      });
      let newQuantity = 1;
      let cartItem;
      try {
        if (cartItemIndex >= 0) { //item already exists in cart
          cartItem = await cart[cartItemIndex];
          cartItem.quantity += 1
          user = await user.save();
        } else { // item yet not exist in cart
          cartItem = {
            product: product._id,
            quantity: newQuantity
          }
          cart.push(cartItem)
          user.cart = cart;

          user = await user.save();
          if (!user) reject(`error saving cart item:\n${err}`)
          resolve();
        }
      } catch (err) {
        reject(err);
      }
    })
    return p
  },


  userSchema.methods.addOrder = function () {
    let user = this;
    let cart = [...user.cart]
    let order = new Order([]);
    cart.forEach(async cartItem => {
      let orderItem = {
        product: cartItem.product,
        quantity: cartItem.quantity
      }
      order.items.push(orderItem);
      order.userId = this._id;
      order = await order.save();
    })

    user.orders.push(order)
    user.cart = [];

    let p = new Promise(async (resolve, reject) => {
      try {
        user = await user.save()
      } catch (err) {
        reject(err)
      }
      resolve(user)
    })
    return p;
  }

userSchema.methods.getOrders = function () {
  let p = new Promise(async (resolve, reject) => {
    let orders;
    try {
      orders = await Order.find({
        userId: this._id
      }).populate('items.product')
    } catch (err) {
      reject(err)
    }
    resolve(orders)
  })
  return p;
}


const User = mongoose.model('User', userSchema);
module.exports = User;