var express = require('express');
const { resolve } = require('promise');
var router = express.Router();
const userHelper = require('../helpers/user-helper')

/* On load route to Login page. */
router.get('/', function(req, res, next) { 
  if (req.session.loggedIn) {
    res.render('user-home')
  }
  else{
    res.render('login');
  }
});

/* Loging-in on clicking Login button */
router.post('/loginuser', (req, res, next) => {
  userHelper.userLogin(req.body).then((loginResponse) => {
    if (loginResponse.status) {
      req.session.loggedIn = true
      req.session.user = loginResponse.user
      res.redirect('user-home');
    } else {
      res.redirect('/');
    }

  })
})

/* Route for navigating to Account creation page */
router.get('/create-account', (req, res, next) => {
  res.render('create-account')
})

/* Creating new account on clicking Create account button */
router.post('/create-newaccount', (req, res, next) => {
  userHelper.addUser(req.body).then((userResponse) => {
    res.render('login');
  })
})

/* Route to navigate to user home and get all users auth tokens*/
router.get('/user-home', (req, res, next) => {
  let user = req.session.user
  userHelper.getAuthTokens(user).then((authTokenDetails)=>{
    res.render('user-home', { user,authTokenDetails })
  })

});



module.exports = router;
