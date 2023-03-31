const Admin = require('../../models/Admin');
const bcrypt = require('bcryptjs');

const GetAllAdmin = async (req, res, next) => {
    try{
        const admins = await Admin.find({})
        res.status(200).send({success: true, json: admin})
    }
    catch(error)
    {
        res.status(500).json({msg: error})
    }
}

const GetAdmin = async (req, res, next) => {
    let id = req.params.id;
    Admin.findById(id, (error, admin) => {
        if(error) {
            res.status(500).json({msg: error})
        }
        else
        {
            if(admin == null) {
                res.status(404).send({success: false, error: {message: 'Not Found'}});
            }
            else
            {
                res.status(200).send({success: true, json: admin})
            }
        }
    })
}

const InsertAdmin = async (req, res, next) => {
    try{
        const { firstname, lastname, email, address, telephone, password, cfpassword } = req.body;

        if(password == cfpassword)
        {
            return res.status(400).json({ message: 'Password and confirm password do not match' });
        }

        const exstingUser = await Admin.findOne({username, email});
        if(exstingUser)
        {
            return res.status(400).json({message: "Username orr email already email"});
        }
        const admin = new Admin({ firstname, lastname, email, address, telephone, password });
        await admin.save();
        res.status(201).json({ message: "Admin account created" });
    } catch(err)
    {
        next(err);
        res.status(500).json({ message: err });
    }
}

const DeleteAdmin = async (req, res, next) => {
    try {
        const {id} = req.params;

        await Admin.findByIdAndDelete(id);

        res.status(201).json({ message: "Admin account deleted successfully" });
    }catch(err)
    {
        next(err);
        res.status(500).json({ message: err });
    }
}

module.export =  {
    GetAllAdmin,
    GetAdmin,
    InsertAdmin,
    DeleteAdmin
}