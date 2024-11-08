class SiteController {

    // Get /home
    home(req,res,next){
        res.render('home');
    }

    booking(req,res,next){
        res.render('booking');
    }
};

module.exports = new SiteController;
