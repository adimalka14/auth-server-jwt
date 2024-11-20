module.exports.getUserDetailsCtrl = async (req, res) => {
    res.json({
        name: req.user.username,
        role: req.user.role,
        password: req.user.password,
    });
};
