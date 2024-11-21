function Admin (req, res,next){
    if(req.session.user.role === 'admin')
    {
       next();
    }
    else{
        res.redirect('/home');
    }
}

module.exports = Admin;
