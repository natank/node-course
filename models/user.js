const mongoose = require('mongoose');
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
  cart: [{
    item: {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  }],
  orders: [{
    order: [{
      item: {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    }],
  }]
  /*  required: true,
    default: []*/
})



userSchema.methods.addToCart = async function (product) {

  let user = this;
  let cart = [...user.cart]


  const cartItemIndex = cart.findIndex(cp => {
    return cp.item.product._id.toString() === product._id.toString();
  });
  let newQuantity = 1;


  let cartItem;
  try {
    if (cartItemIndex >= 0) {
      cartItem = await cart[cartItemIndex];
      cartItem.item.quantity += 1
      user = await user.save();
    } else {
      cartItem = {
        item: {
          product: product._id,
          quantity: newQuantity
        }
      }
      cart.push(cartItem)
    }

    user.cart = cart;

    try {
      user = await user.save();
    } catch (err) {
      let p = new Promise((resolve, reject) => {
        reject(`error saving cart item:\n${err}`)
      })
      return p;
    }

    let p = new Promise((resolve, reject) => {
      resolve();
    })
    return p;
  } catch (err) {
    let p = new Promise((resolve, reject) => {
      reject(err);
    })
    return p;
  }
}

userSchema.methods.addOrder = function () {
  let p = new Promise(async (resolve, reject) => {
    let user;
    try {
      user = this;
    } catch (err) {
      reject(err)
    }
    let cart = [...user.cart]
    let orders = [...user.orders];
    let order = {
      order: [...cart]
    }
    orders.push(order);
    user.cart = [];
    user.orders = orders
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
    let user;
    try {
      user = await this.populate('orders.order.item.product').execPopulate();
    } catch (err) {
      reject(err)
    }

    resolve(user.orders)
  })
  return p;
}


const User = mongoose.model('User', userSchema);
module.exports = User;


//   /** User methods */
//   async save() {
//     const db = getDb();
//     if (this.id) {

//     } else {
//       try {

//         let result = await db.collection('users').insertOne(this);
//         console.log(`New user added:`)
//       } catch (err) {
//         console.log(err)
//       }

//     }
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db.collection('users')
//       .findOne({
//         _id: new ObjectId(userId)
//       })
//   }


//   /* Cart functions */

//   async getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(item => item.productId);
//     let products = await db.collection('products').find({
//       _id: {
//         $in: productIds
//       }
//     }).toArray();
//     products = products.map(p => {
//       return {
//         ...p,
//         quantity: this.cart.items.find(i => {
//           return i.productId.toString() === p._id.toString();
//         }).quantity
//       }
//     })
//     let p = new Promise((resolve, reject) => {
//       resolve(products);
//     })

//     return p;
//   }
//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity
//       })
//     }

//     const updatedCart = {
//       items: updatedCartItems
//     }

//     const db = getDb();
//     return db.collection('users').updateOne({
//       _id: new ObjectId(this._id)
//     }, {
//       $set: {
//         cart: updatedCart
//       }
//     })
//   }

//   async removeFromCart(productId) {
//     this.cart.items = this.cart.items.filter(item => item.productId.toString() != productId.toString())

//     const db = getDb();
//     let result;
//     try {

//       result = await db.collection('users').updateOne({
//         _id: new ObjectId(this._id)
//       }, {
//         $set: {
//           cart: this.cart
//         }
//       })
//       let p = new Promise((resolve, reject) => {
//         resolve(result)
//       })
//       return p;
//     } catch (err) {
//       console.log(err)
//     }
//   }

//   /** Order methods */
//   async addOrder() {
//     const db = getDb();
//     // do not add an empty order
//     try {
//       const products = await this.getCart();
//       const order = {
//         items: products,
//         user: {
//           _id: new ObjectId(this._id),
//           name: this.name
//         }
//       }
//       await db.collection('orders').insertOne(order);
//       // empty the cart
//       await db.collection('users').update({
//         _id: this._id
//       }, {
//         $set: {
//           cart: {
//             items: []
//           }
//         }
//       })
//     } catch (err) {
//       console.log(err)
//     }

//   }

//   async getOrders() {
//     const db = getDb();
//     try {
//       let orders = await db.collection('orders').find({
//         'user._id': new ObjectId(this._id)
//       }).toArray();
//       let p = new Promise((resolve, reject) => {
//         resolve(orders)
//       })
//       return p;
//     } catch (err) {
//       console.log(err)
//     }
//   }
// }


// module.exports = User;