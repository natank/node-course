exports.getCart = (req, res)=>{
    res.render('./shop/cart.ejs', {pageTitle: "cart", path:"/cart"})
}