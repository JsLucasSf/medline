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
  res.render("./pages/index.ejs", {message: undefined});
});

app.get("/logged-user/info", isLoggedIn, function(req, res){
  res.json(req.user);
});

app.get("/home", isLoggedIn, function(req, res){
  res.render("pages/home.ejs", {"user" : req.user, "page": "/home"});
});

app.get("/medicos", isLoggedIn , function(req, res){
  if(req.user.category === 'c'){
    doctorController.list(function(resp){
      var respAssociated = resp.filter(function(doctor){
        return req.user.associatedDoctors.includes(String(doctor._id));
      });
      res.render("pages/medicos.ejs", {"user": req.user, "page": "/medicos", "medicos": resp, "medicosAssociados": respAssociated});
    });
  }else{
    res.redirect("/home");
  }

 });

 app.get("/pacientes", isLoggedIn , function(req, res){
   if(req.user.category === 'c' || req.user.category === 'd'){
     patientController.list(function(resp){
       res.render("pages/pacientes.ejs", {"user": req.user, "page": "/pacientes", "pacientes": resp});
     });
  }else{
    res.redirect("/home");
  }
 });

 app.get("/agenda", isLoggedIn, function(req, res){
  res.render("pages/agenda.ejs", {"user": req.user, "page": "/agenda"});
 });

 app.get("/config", isLoggedIn ,function(req, res){
  res.render("pages/config.ejs", {"user": req.user, "page": "/config"});
 });

//app.post("/login", passport.authenticate("local", {
//  successRedirect : "/home",
//  failureRedirect : "/"
//}) ,function(req, res){})

app.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info){
    if(err) {
      console.log(err);
      return next(err);
    }
    if(!user){
      return res.render('pages/index.ejs', {"message": info.message});
    }

    req.logIn(user, function(err){
      if (err) {return next(err);}
      return res.redirect("/home");
    });
})(req, res, next);
});


// app.get('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) { return next(err) }
//     if (!user) {
//       // *** Display message without using flash option
//       // re-render the login form with a message
//       return res.render('login', { message: info.message })
//     }
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       return res.redirect('/users/' + user.username);
//     });
//   })(req, res, next);
// });

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
  var clinicLogin = validator.trim(validator.escape(req.body.username));
  var clinicName = validator.trim(validator.escape(req.body.clinicName));
  var clinicAddress = validator.trim(validator.escape(req.body.address));
  var clinicPhone = validator.trim(validator.escape(req.body.telephone));
  var clinicPassword = validator.trim(validator.escape(req.body.password));

  clinicController.save(clinicLogin, clinicName, clinicAddress,
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

app.get("/clinic/associateDoctor/:doctorId", isLoggedIn, function(req, res){
  if(req.user.category === 'c'){
    var clinicId = String(req.user._id);
    var doctorId = validator.trim(validator.escape(req.param('doctorId')));

    clinicController.addDoctor(clinicId, doctorId, function(resp){
      if(!resp['error']){
        doctorController.addClinic(doctorId, clinicId, function(resp){
          if(!resp['error']){
            res.redirect("/medicos");
          }
        });
      }else{
        res.redirect("/home");
      }
    })
  }else{
    res.redirect("/home");
  }
});

app.get("/clinic/doctors/:clinicId", isLoggedIn , function(req, res){
  var clinicId = validator.trim(validator.escape(req.param('clinicId')));

  clinicController.listDoctors(clinicId, function(resp){
    res.json(resp);
  });
});

app.post("/clinic/patient/new", isLoggedIn, function(req, res){
  if(req.user.category !== 'c'){
    res.redirect("/home");
  } else {
    var username = validator.trim(validator.escape(req.body.username));
    var fullname = validator.trim(validator.escape(req.body.fullname));
    var age = validator.trim(validator.escape(req.body.age));
    var password = validator.trim(validator.escape(req.body.password));
    var phone = validator.trim(validator.escape(req.body.telephone));

    patientController.save(username, fullname, age, password, phone,
                          function(resp){
                              if(!resp['error']){
                                  res.redirect("/pacientes");
                              }else{
                                res.json(resp);
                              }
                          });
  }

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
  var fullname = validator.trim(validator.escape(req.body.fullname));
  var age = validator.trim(validator.escape(req.body.age));
  var password = validator.trim(validator.escape(req.body.password));
  var phone = validator.trim(validator.escape(req.body.cellphone));
  var crm = validator.trim(validator.escape(req.body.crmNumber));
  var specialty = validator.trim(validator.escape(req.body.specialty));

  doctorController.save(username, fullname, age, password, phone,
                        crm, specialty, function(resp) {
                          if(!resp['error']){
                            res.redirect("/medicos");
                          }else{
                            res.json(resp);
                          }
                        });
});

app.put('/doctors', function(req, res) {

  var id = validator.trim(validator.escape(req.param('id')));
  var fullname = validator.trim(validator.escape(req.param('fullname')));
  var username = validator.trim(validator.escape(req.param('username')));
  var password = validator.trim(validator.escape(req.param('password')));

  doctorController.update(id, username, fullname, password, function(resp) {
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
  var fullname = validator.trim(validator.escape(req.body.fullname));
  var age = validator.trim(validator.escape(req.body.age));
  var password = validator.trim(validator.escape(req.body.password));
  var phone = validator.trim(validator.escape(req.body.telephone));

  patientController.save(username, fullname, age, password, phone,
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
