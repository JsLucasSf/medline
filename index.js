var app = require('./app_config.js');
var db = require('./db_config.js');
var validator = require('validator');

var userController = require('./controller/userController.js');
var clinicController = require('./controller/clinicController.js');
var doctorController = require('./controller/doctorController.js');
var patientController = require('./controller/patientController.js');

var passport = require("passport");
var localStrategy = require("passport-local");

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(db.User.authenticate()));
passport.serializeUser(db.User.serializeUser());
passport.deserializeUser(db.User.deserializeUser());

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}

/* Routes */
app.get("/", function(req, res){
  res.render("./pages/index.ejs");
});

app.get("/logged-user/info", isLoggedIn, function(req, res){
  res.json(req.user);
});

app.get("/home", isLoggedIn, function(req, res){
  res.render("pages/home.ejs");
});

app.post("/login", passport.authenticate("local", {
  successRedirect : "/home",
  failureRedirect : "/"
}) ,function(req, res){})

app.get("/logout", isLoggedIn , function(req, res){
  req.logout();
  return res.redirect("/");
})

/* Clinics' Routes */
app.get("/clinics", isLoggedIn ,function(req, res){
  clinicController.list(function(resp){
    res.json(resp);
  });
})

app.post("/clinic/new", function(req, res){
  var clinicName = validator.trim(validator.escape(req.body.username));
  var clinicAddress = validator.trim(validator.escape(req.body.address));
  var clinicPhone = validator.trim(validator.escape(req.body.telephone));
  var clinicPassword = validator.trim(validator.escape(req.body.password));

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
})

app.put("/clinic/add-doctor", isLoggedIn, function(req, res){
  var clinicId = validator.trim(validator.escape(req.param('clinicId')));
  var doctorId = validator.trim(validator.escape(req.param('doctorId')));

  clinicController.addDoctor(clinicId, doctorId, function(resp){
    res.json(resp);
  });
})

app.get("/clinic/doctors/:clinicId", isLoggedIn , function(req, res){
  var clinicId = validator.trim(validator.escape(req.param('clinicId')));

  clinicController.listDoctors(clinicId, function(resp){
    res.json(resp);
  });
});

/* Doctor's Routes */
app.get('/doctors/', function(req, res) {
  doctorController.list(function(resp){
    res.json(resp);
  });
});

app.get('/doctor/:id', function(req, res) {

  var id = validator.trim(validator.escape(req.param('id')));

  doctorController.doctor(id, function(resp) {
    res.json(resp);
  });
});

app.post('/doctor/new', isLoggedIn , function(req, res) {

  var username = validator.trim(validator.escape(req.body.username));
  var age = validator.trim(validator.escape(req.body.age));
  var password = validator.trim(validator.escape(req.body.password));
  var phone = validator.trim(validator.escape(req.body.cellphone));
  var crm = validator.trim(validator.escape(req.body.crmNumber));
  var specialty = validator.trim(validator.escape(req.body.specialty));

  doctorController.save(username, age, password, phone,
                        crm, specialty, function(resp) {
                          if(!resp['error']){
                            passport.authenticate("local")(req, res, function(){
                              res.redirect("/home");
                            });
                          }else{
                            res.json(resp);
                          }
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

app.put('/doctor/add-clinic', isLoggedIn , function(req, res){
  var doctorId = validator.trim(validator.escape(req.param('doctorId')));
  var clinicId = validator.trim(validator.escape(req.param('clinicId')));

  doctorController.addClinic(doctorId, clinicId, function(resp){
    res.json(resp);
  });
})

app.delete('/doctors/:id', function(req, res) {

  var id = validator.trim(validator.escape(req.param('id')));

  doctorController.delete(id, function(resp) {

    res.json(resp);
  });

});

/* Patient's Routes */
app.get("/patients", function(req, res){
  patientController.list(function(resp){
    res.json(resp);
  });
});

app.post("/patient/new", function(req, res){
  var username = validator.trim(validator.escape(req.body.username));
  var age = validator.trim(validator.escape(req.body.age));
  var password = validator.trim(validator.escape(req.body.password));
  var phone = validator.trim(validator.escape(req.body.telephone));

  patientController.save(username, age, password, phone,
                        function(resp){
                            if(!resp['error']){
                              passport.authenticate("local")(req, res, function(){
                                res.redirect("/home");
                              });
                            }else{
                              res.json(resp);
                            }
                        });
});

/* User's general routes */
app.get("/users" , function(req, res){
  userController.list(function(resp){
    res.json(resp);
  })
});

app.get("/user/:id", function(req, res){
  var id = validator.trim(validator.escape(req.param('id')));
  userController.user(id, function(resp){
    res.json(resp);
  });
});
