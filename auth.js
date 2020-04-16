// Checks Authentication
// If authenticated, it will send the user on his next part
// If 

function checkAuth(req, res, next) {
    if(req.isAuthenticated()) {return next();}
    else {res.redirect("auth/login");}
}

function alrAuth(req, res, next) {
    if(req.isAuthenticated) {res.redirect("/end");}
    else {return next();}
}

module.exports = {
    checkAuth,
    alrAuth,
}