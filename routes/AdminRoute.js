const express = require('express')
const route = express.Router();
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

route.route('/admin').get(GetAllAdmin);
route.route('/admin/:id').get(GetAdmin);
route.route('/admin').post(InsertAdmin);
route.route('/admin/:id').put(UpdateAdmin);
route.route('/admin/:id').delete(DeleteAdmin);
route.route('/admin/verify/:adminId/:uniqueString').get(VerifyAdmin);

route.route('/posts').get(GetPosts);
route.route('/post/:id').get(GetPost);
route.route('/post').post(InsertPost);
route.route('/post/:id').put(UpdatePost);
route.route('/post/:id').delete(DeletePost);


module.exports = route