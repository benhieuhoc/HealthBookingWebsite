function AuthenAdmin (req, res, next) {
    // const role = req.query.role;
    // const Role = role.
    console.log("**************req: ", req.query)
    if(req.query.role ==="66df1d48dcb551b86e4f7039"){
        next();
    }else{
        res.status(401).json({message: "Không có quyền truy cập chức năng nay!"});
    }
}
module.exports = AuthenAdmin;
