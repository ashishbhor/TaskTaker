const User = require("../models/User");

exports.getMe = async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
};

exports.updateMe = async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user.id,
        req.body,
        { new: true }
    ).select("-password");

    res.json(user);
};
