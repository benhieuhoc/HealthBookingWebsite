function Admin (req, res,next){
    if(req.session.user.role === 'admin' || req.session.user.role === 'Madmin')
    {
       next();
    }
    else{
        res.redirect('/home');
    }
}

module.exports = Admin;
