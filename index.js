var app = require('./app_config.js');
var db = require('./db_config.js');
var validator = require('validator');

var clinicController = require('./controller/clinicController.js');
var doctorController = require('./controller/doctorController.js');

var passport = require("passport");
var localStrategy = require("passport-local");

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(db.Clinic.authenticate()));
passport.serializeUser(db.Clinic.serializeUser());
passport.deserializeUser(db.Clinic.deserializeUser());

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}

/* Routes */
app.get("/", function(req, res){
  res.render("./pages/index.ejs");
})

app.get("/home", isLoggedIn, function(req, res){
  res.render("pages/home.ejs");
});

app.get("/clinics", function(req, res){
  clinicController.list(function(resp){
    res.json(resp);
  });
})

app.post("/clinic/new", function(req, res){
  var clinicName = req.body.username;
  var clinicAddress = req.body.address;
  var clinicPhone = req.body.telephone;
  var clinicPassword = req.body.password;

  if(clinicName && clinicAddress && clinicPhone && clinicPassword){
    clinicController.save(clinicName, clinicAddress,
                          clinicPhone, clinicPassword, function(resp){
                            if(!resp['error']){
                              passport.authenticate("local")(req, res, function(){
                                res.redirect("/home");
                              });
                            }else{
                              res.json(resp);
                            }
                          });
  }
})

app.post("/login", passport.authenticate("local", {
  successRedirect : "/home",
  failureRedirect : "/"
}) ,function(req, res){})

app.get("/logout", function(req, res){
  req.logout();
  return res.redirect("/");
})

app.get('/doctors/', function(req, res) {
  doctorController.list(function(resp){
    res.json(resp)
  });
});

app.get('/doctors/:id', function(req, res) {

  var id = validator.trim(validator.escape(req.param('id')));

  doctorController.doctor(id, function(resp) {
    res.json(resp);
  });
});

app.post('/doctors', function(req, res) {

  var username = validator.trim(validator.escape(req.body.username));
  var email = validator.trim(validator.escape(req.body.email));
  var password = validator.trim(validator.escape(req.body.password));

  doctorController.save(username, email, password, function(resp) {
    res.json(resp);
  });
});

app.put('/doctors', function(req, res) {

  var id = validator.trim(validator.escape(req.param('id')));
  var fullname = validator.trim(validator.escape(req.param('fullname')));
  var email = validator.trim(validator.escape(req.param('email')));
  var password = validator.trim(validator.escape(req.param('password')));

  doctorController.update(id, fullname, email, password, function(resp) {
    res.json(resp);
  });
});

app.delete('/doctors/:id', function(req, res) {

  var id = validator.trim(validator.escape(req.param('id')));

  doctorController.delete(id, function(resp) {

    res.json(resp);
  });

});
