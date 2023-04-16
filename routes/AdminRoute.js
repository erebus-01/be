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

route.route('/admin').get(GetAllAdmin);
route.route('/admin/:id').get(GetAdmin);
route.route('/admin').post(InsertAdmin);
route.route('/admin/:id').put(UpdateAdmin);
route.route('/admin/:id').delete(DeleteAdmin);
route.route('/admin/verify/:adminId/:uniqueString').get(VerifyAdmin);


module.exports = route