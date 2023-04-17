const express = require('express')
const route = express.Router();
// #region Region ImportRouterController
const {     
    GetAllAdmin,
    GetAdmin,
    InsertAdmin,
    UpdateAdmin,
    DeleteAdmin,
    VerifyAdmin
} = require('../controllers/Admin/AdminController');

const {
    GetPosts,
    GetPost,
    InsertPost,
    UpdatePost,
    DeletePost
} = require('../controllers/Admin/PostController');

const {
    InsertProduct,
    GetProducts,
    GetProduct,
    UpdateProduct,
    DeleteProduct,
  
    GetColors,
    GetColor,
    InsertColor,
    UpdateColor,
    DeleteColor
} = require('../controllers/Admin/ProductController');
// #endregion



// #region Region AdminController
route.route('/admin').get(GetAllAdmin);
route.route('/admin/:id').get(GetAdmin);
route.route('/admin').post(InsertAdmin);
route.route('/admin/:id').put(UpdateAdmin);
route.route('/admin/:id').delete(DeleteAdmin);
route.route('/admin/verify/:adminId/:uniqueString').get(VerifyAdmin);
// #endregion



// #region Region PostController
route.route('/posts').get(GetPosts);
route.route('/post/:id').get(GetPost);
route.route('/post').post(InsertPost);
route.route('/post/:id').put(UpdatePost);
route.route('/post/:id').delete(DeletePost);
// #endregion



// #region Region ProductController
route.route('/products').get(GetProducts);
route.route('/product/:id').get(GetProduct);
route.route('/product').post(InsertProduct);
route.route('/product/:id').put(UpdateProduct);
route.route('/product/:id').delete(DeleteProduct);
// #endregion



// #region Region ColorProductController
route.route('/products/colors/:product').get(GetColors);
route.route('/product/color/:product/:id').get(GetColor);
route.route('/product/color/:product').post(InsertColor);
route.route('/product/color/:product/:id').put(UpdateColor);
route.route('/product/color/:product/:id').delete(DeleteColor);
// #endregion

module.exports = route