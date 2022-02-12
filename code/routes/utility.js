// 6. SECURES ROUTES TO PREVENT ACCESS FROM THOSE WHO AREN'T LOGGED IN

// middleware to ensure customer is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    // if not logged in, redirect to login form
    req.session.returnTo = req.originalUrl; 
    res.redirect('/customer/user-management/login');
}

// middleware to ensure customer when adding to cart
function isLoggedInAddToCart(req, res, next) {
    if (req.isAuthenticated())
        return next();
    // if not logged in, redirect to login form
    req.session.returnTo = '/customer/menu/' + req.params.vendorId; 
    // res.redirect('/customer/user-management/login');
    return next();
}

// middleware to ensure vendor is logged in
function isLoggedInVendor(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // if not logged in, redirect to login form
    req.session.returnTo = req.originalUrl; 
    res.redirect('/vendor/login');
}

function currentPath(req, res, next) {
    if (req.baseUrl.includes("customer")) {
        // res.locals.currentPath = "customer"
        return true;
    } else if (req.baseUrl.includes("vendor")) {
        res.locals.currentPath = "vendor"
    } else {
        res.locals.currentPath = "base"
    }
    console.log(res.locals.currentPath)
    return next()
}

// export the function so that we can use
// in other parts of our all
module.exports = {
    isLoggedIn,
    isLoggedInAddToCart,
    isLoggedInVendor,
    currentPath
}
