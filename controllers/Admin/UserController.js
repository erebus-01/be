const User = require('../../models/Users')

const GetUsers = async (req, res, next) => {
    try{
        const users = await User.find({}, {password: 0})
        res.status(200).send({success: true, json: users})
    }
    catch(error)
    {
        res.status(500).json({msg: error})
    }
}   

const UpdateUser = async (req, res, next) => {
    const { _id ,firstName, lastName, email, username } = req.body;

    User.findByIdAndUpdate(_id, { firstName, lastName, email, username }, { new: true })
        .then(UserInfor => {
        res.status(201).json({ message: "Update User successfully", json: UserInfor });
        }).catch(err => {
            res.status(500).json({ message: err.message });
        });
}

const DeleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;

        await User.findByIdAndDelete(id);

        res.status(201).json({ message: "User account deleted successfully" });
    }catch(err)
    {
        next(err);
        res.status(500).json({ message: err });
    }
}

module.exports = {
    GetUsers,
    UpdateUser,
    DeleteUser
}