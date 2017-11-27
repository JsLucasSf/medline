var app = require('./app_config.js');

var db = require('./db_config.js');

var validator = require('validator');

var doctorController = require('./controller/doctorController.js');

var CPF = require("cpf_cnpj").CPF;
var CNPJ = require("cpf_cnpj").CNPJ;
var passport = require("passport");
var localStrategy = require("passport-local");

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(db.Clinic.authenticate()));
passport.serializeUser(db.Clinic.serializeUser());
passport.deserializeUser(db.Clinic.deserializeUser());

/* Routes */
app.get("/", function(req, res){
  res.render("./pages/index.ejs");
})

app.get("/home", isLoggedIn, function(req, res){
  res.render("pages/home.ejs");
});

app.post("/clinica/nova", function(req, res){
  var clinicName = req.body.username;
  var clinicAddress = req.body.address;
  var clinicPhone = req.body.telephone;
  var clinicPassword = req.body.password;

  if(clinicName && clinicAddress && clinicPhone && clinicPassword){
    const newClinic = {
      "username" : clinicName,
      "phone" : clinicPhone,
      "address" : clinicAddress
    }

    db.Clinic.register(newClinic, clinicPassword, function(err, clinic){
      if(err){
        console.log(err);
        res.redirect("/");
      }else{
        console.log("Clínica cadastrada com sucesso!");
        passport.authenticate("local")(req, res, function(){
          res.redirect("/home");
        });
      }
    });
  }
})

// TEST
app.get("/lista-clinicas", isLoggedIn, function(req, res){
  var clinics = [];

  db.Clinic.find({}, function(err, theClinics){
    if(err){
      console.log(err);
    }else{
      clinics = theClinics;
    }
    res.render("index.ejs", {"clinics" : clinics});
  });
})

app.post("/login", passport.authenticate("local", {
  successRedirect : "/home",
  failureRedirect : "/"
}) ,function(req, res){})

app.get("/logout", function(req, res){
  req.logout();
  return res.redirect("/");
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}

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
