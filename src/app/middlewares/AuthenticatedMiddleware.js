function AuthenticatedMiddleware (req, res,next){
    if(req.session.user)
    {
        res.locals.user= req.session.user;
        // res.json(req.session.user); 
        // res.session.user.destroy();

        next();
    }
    else{
        // res.locals._sort = {
        //     _id: 'null',
        //     email: 'null',
        //     name: 'null',
        //     password: 'null',
        //     role: 'null',
        // }
        // res.json('chưa đang nhập');
        next();
    }
}
module.exports = AuthenticatedMiddleware
