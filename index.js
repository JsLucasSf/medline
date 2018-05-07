var app = require('./app_config.js');
var db = require('./db_config.js');
var validator = require('validator');

var userController = require('./controller/userController.js');
var clinicController = require('./controller/clinicController.js');
var doctorController = require('./controller/doctorController.js');
var patientController = require('./controller/patientController.js');
var notificationController = require('./controller/notificationController.js');
var appointmentController = require('./controller/appointmentController.js');
var medicalReportController = require('./controller/medicalReportController.js');
var historyController = require('./controller/historyController.js');
var acompanhamentoController = require('./controller/acompanhamentoController.js');

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

app.get("/usuarios", isLoggedIn, function(req, res){
  userController.list(function(resp){
    res.send(resp);
  });
});

app.get("/usuario-logado", isLoggedIn, function(req, res){
  res.json(req.user);
});

app.get("/home", isLoggedIn, function(req, res){
  res.redirect("/agenda");
});

app.get("/medicos", isLoggedIn , function(req, res){
  if(req.user.category === 'c'){
    doctorController.list(function(resp){
      var respAssociated = resp.filter(function(doctor){
        return req.user.associatedDoctors.includes(String(doctor._id));
      });

      var medicos = [];
      notificationController.list(function(notifications){
        for(var i = 0; i < resp.length; i++){
          var medico = resp[i];

          var found = false;
          for(var j = 0; j < notifications.length; j++){
            var notification = notifications[j];
            console.log(j);
            if(notification.sourceUser === String(req.user._id) &&
               notification.targetUser === String(medico._id)){
                 found = true;
                 break;
               }
          }
          medicos.push({"medico": medico, "exists": found});
        }
        res.render("pages/medicos.ejs",
        {
          "user": req.user,
          "page": "/medicos",
          "medicos": medicos
        });
      });
    });
  }else{
    res.redirect("/home");
  }
});

app.get("/clinica/get-dados", isLoggedIn, function(req, res){
  doctorController.list(function(resp){
    if(!resp.error){
      var associatedDoctors = [];
      for(var i = 0; i < resp.length; i++){
        if(req.user.associatedDoctors.includes(String(resp[i]._id))){
          associatedDoctors.push(resp[i]);
        }
      }
      res.send({
        "user": req.user,
        "doctors": resp,
        "associatedDoctors": associatedDoctors
      });
    }
  });
});

app.get("/get-dados-notificacoes", isLoggedIn, function(req, res){
  var idClinica = req.user._id;
  var minhasNotificacoes = [];

  notificationController.list(function(resp){
    for(var i = 0; i < resp.length; i++){
      if(resp[i].sourceUser === String(idClinica)){
        minhasNotificacoes.push(resp[i]);
      }
    }

    return res.send(minhasNotificacoes);
  })
});

app.put("/clinica/cancelarAssociacao", isLoggedIn, function(req, res){
  var clinic = validator.trim(validator.escape(req.body.clinica));
  var doctor = validator.trim(validator.escape(req.body.medico));

  clinicController.cancelarAssociacao(clinic, doctor, function(resp){
    if(!resp.error){
      doctorController.cancelarAssociacao(doctor, clinic, function(resp){
        if(!resp.error){
          return res.send("success");
        }
      });
    }
  });

});

app.get("/minhas-notificacoes", isLoggedIn, function(req, res){
  notificationController.list(function(resp){
    var filteredResp = resp.filter(function(obj){
      return obj.targetUser == req.user._id;
    });
    res.send(filteredResp);
  });
});

app.get("/notificacoes", isLoggedIn, function(req, res){
  notificationController.list(function(resp){
    var filteredResp = resp.filter(function(obj){
      return obj.targetUser == req.user._id;
    });
    res.render("pages/notificacoes.ejs",
     {
       "user": req.user,
       "page": "/notificacoes",
       "notificacoes" : filteredResp
     });
  });
});

app.get("/pacientes", isLoggedIn , function(req, res){
   if(req.user.category === 'c' || req.user.category === 'd'){
      patientController.list(function(resp){
      res.render("pages/pacientes.ejs",
        {
          "user": req.user,
          "page": "/pacientes",
          "pacientes": resp
        });
     });
  }else{
      res.redirect("/home");
  }
 });

app.get("/agenda", isLoggedIn, function(req, res){
  doctorController.list(function(resp){
    var doctors = resp;
    patientController.list(function(resp){
      var patients = resp;
      appointmentController.list(function(resp){
        var consultas = [];
        var associatedDoctors = [];

        for(var w = 0; w < doctors.length; w++){
          if(req.user.associatedDoctors.includes(String(doctors[w]._id))){
            associatedDoctors.push(doctors[w]);
          }
        }

        for(var i = 0; i < resp.length; i++){
          var appointment = resp[i];

          for(var j = 0; j < doctors.length; j++){
            if(String(doctors[j]._id) === appointment.doctorId){
              var aptDoctor = doctors[j];
              break;
            }
          }

          for(var k = 0; k < patients.length; k++){
            if(String(patients[k]._id) === appointment.patientId){
              var aptPatient = patients[k];
              break;
            }
          }


          consultas.push({
            "consulta": appointment,
            "medico": aptDoctor,
            "paciente": aptPatient
          });

        }

        const myId = req.user._id;
        const myType = req.user.category;
        if(myType === 'c'){
          consultas = consultas.filter(function(consulta){
            return (consulta.consulta.clinicId === String(myId));
          });
        }else if(myType === 'd'){
          consultas = consultas.filter(function(consulta){
            return (consulta.consulta.doctorId === String(myId));
          });
        }else if(myType === 'p'){
          consultas = consultas.filter(function(consulta){
            return (consulta.consulta.patientId === String(myId));
          });
        }

        res.render("pages/agenda.ejs",
         {
           "user": req.user,
           "page": "/agenda",
           "medicos": associatedDoctors,
           "pacientes": patients,
           "consultas": consultas
         });
     });
    });
  });
});

app.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info){
    if(err) {
      return {"message":err};
    }
    if(!user){
      return res.send(info.message);
      //return res.render('pages/index.ejs', {"message": info.message});
    }

    req.logIn(user, function(err){
      if (err) {return next(err);}
      return res.redirect("/home");
    });
})(req, res, next);
});

app.get("/logout", isLoggedIn , function(req, res){
  req.logout();
  return res.redirect("/");
})

/* Clinics' Routes */
app.get("/clinics", function(req, res){
    clinicController.list(function(resp){
      console.log("clinicas");
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

app.post("/clinica/agenda/consulta", isLoggedIn , function(req, res){
  var idClinica = validator.trim(validator.escape(req.param('idClinica')));
  var idMedico = validator.trim(validator.escape(req.param('idMedico')));
  var nomeMedico = validator.trim(validator.escape(req.param('nomeMedico')));
  var idPaciente = validator.trim(validator.escape(req.param('idPaciente')));
  var nomePaciente = validator.trim(validator.escape(req.param('nomePaciente')));
  var data = validator.trim(validator.escape(req.param('data')));
  var hora = validator.trim(validator.escape(req.param('hora')));

  acompanhamentoController.criar(
    idClinica, idMedico, nomeMedico, idPaciente, nomePaciente, data, hora, function(resp){
      if(resp.erro === "acompanhamento já existe"){
        acompanhamentoController.criarConsulta(resp.acompanhamento, data, hora,
          function(resp){return resp;}
        );
      }else{
        return resp;
      }
    }
  );
});

app.get("/agenda/acompanhamentos", isLoggedIn, function(req, res){

  acompanhamentoController.listar(function(resp){
    if(resp.erro){
      return callback(resp);
    }else if(req.user.category === 'c'){
      var acompanhamentos = resp.filter(function(acompanhamento){
        return req.user._id == acompanhamento.clinica;
      })
    }else if(req.user.category === 'd'){
      var acompanhamentos = resp.filter(function(acompanhamento){
        return req.user._id == acompanhamento.medico;
      })
    }else{
      var acompanhamentos = resp.filter(function(acompanhamento){
        return req.user._id == acompanhamento.paciente;
      })
    }

    res.send(acompanhamentos);
  });
});

app.post("/agenda/prontuario", isLoggedIn, function(req, res){
  var idAcompanhamento = req.body.idAcompanhamento;
  var idConsulta = req.body.idConsulta;
  var altura = req.body.altura;
  var peso = req.body.peso;
  var sintomas = req.body.sintomas;
  var diagnostico = req.body.diagnostico;
  var prescricao = req.body.prescricao;

  acompanhamentoController.criaProntuario(idAcompanhamento, idConsulta, altura, peso,
                                          sintomas, diagnostico, prescricao,
                                          function(resp){
    res.send(resp);
  });
});

app.post("/agenda/encerraAtendimento", function(req, res){

 
  var idAcompanhamento = req.body.idAcompanhamento;
  console.log(req.body);
  acompanhamentoController.encerrarAtendimento(idAcompanhamento, function(resp){
    res.send(resp);
  });
});

app.get("/agenda/appointments", isLoggedIn, function(req, res){
  doctorController.list(function(resp){
    var doctors = resp;
    patientController.list(function(resp){
      var patients = resp;
      appointmentController.list(function(resp){
        var consultas = [];
        var associatedDoctors = [];

        for(var w = 0; w < doctors.length; w++){
          if(req.user.associatedDoctors.includes(String(doctors[w]._id))){
            associatedDoctors.push(doctors[w]);
          }
        }

        for(var i = 0; i < resp.length; i++){
          var appointment = resp[i];

          for(var j = 0; j < doctors.length; j++){
            if(String(doctors[j]._id) === appointment.doctorId){
              var aptDoctor = doctors[j];
              break;
            }
          }

          for(var k = 0; k < patients.length; k++){
            if(String(patients[k]._id) === appointment.patientId){
              var aptPatient = patients[k];
              break;
            }
          }


          consultas.push({
            "consulta": appointment,
            "medico": aptDoctor,
            "paciente": aptPatient
          });

        }

        const myId = req.user._id;
        const myType = req.user.category;
        if(myType === 'c'){
          consultas = consultas.filter(function(consulta){
            return (consulta.consulta.clinicId === String(myId));
          });
        }else if(myType === 'd'){
          consultas = consultas.filter(function(consulta){
            return (consulta.consulta.doctorId === String(myId));
          });
        }else if(myType === 'p'){
          consultas = consultas.filter(function(consulta){
            return (consulta.consulta.patientId === String(myId));
          });
        }

        res.send(
         {
           "user": req.user,
           "page": "/agenda",
           "medicos": associatedDoctors,
           "pacientes": patients,
           "consultas": consultas
         });
     });
    });
  });
});

app.get("/clinic/associateDoctor/:doctorId", isLoggedIn, function(req, res){
  if(req.user.category === 'c'){
    var clinicId = String(req.user._id);
    var doctorId = validator.trim(validator.escape(req.param('doctorId')));

    clinicController.requestDoctor(clinicId, doctorId, function(resp){
      return res.send("success");
    });
  }
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

app.get('/doctor/acceptAssociation/:id', isLoggedIn, function(req, res){
  var id = validator.trim(validator.escape(req.param('id')));

  notificationController.get(id, function(resp){
    if(resp['error']){
      // TODO: Tratar esse erro
      res.redirect('/notificacoes');
    }else{
      var clinicId = resp[0].sourceUser;
      var doctorId = resp[0].targetUser;

      clinicController.addDoctor(clinicId, doctorId, function(clinic){
        doctorController.addClinic(doctorId, clinicId, function(doctor){
          notificationController.delete(id, function(error){
            if(error){
              // TODO: Tratar esse erro
              console.log(error);
              res.redirect('/home');
            }
          });

          res.redirect('/home');
        })
      });
    }
  });
});

app.get('/doctor/rejectAssociation/:id', isLoggedIn, function(req, res){
  var id = validator.trim(validator.escape(req.param('id')));

  notificationController.get(id, function(resp){
    if(resp['error']){
      // TODO: Tratar esse erro
      res.redirect('/notificacoes');
    }else{
      // TODO: Mostrar mensagem de recusa de associação
      notificationController.delete(id, function(error){
        if(error){
          // TODO: Tratar esse erro
          console.log(error);
        }
      });
      res.redirect('/home');
    }
  });
});

app.post("/doctor/agenda/add/medicalReport", isLoggedIn, function(req, res){
  var idConsulta = validator.trim(validator.escape(req.param('idConsulta')));
  var altura = validator.trim(validator.escape(req.param('altura')));
  var peso = validator.trim(validator.escape(req.param('peso')));
  var sintoma1 = validator.trim(validator.escape(req.param('sintoma1')));
  var sintoma2 = validator.trim(validator.escape(req.param('sintoma2')));
  var sintoma3 = validator.trim(validator.escape(req.param('sintoma3')));
  var diagnostico = validator.trim(validator.escape(req.param('diagnostico')));
  var prescricao = validator.trim(validator.escape(req.param('prescricao')));

  medicalReportController.register(idConsulta, altura, peso, sintoma1, sintoma2,
     sintoma3, diagnostico, prescricao, function(resp){
    if(resp['error']){
      // TODO: Tratar esse erro
      console.log(resp);
      return res.send(resp);
    }else{
      // TODO: Mostrar mensagem de sucesso
      console.log('Prontuário cadastrado');
      return res.send(resp);
    }
  });
});

app.get("/doctor/medicalReport/:patientId", isLoggedIn, function(req, res){
  var patientId = validator.trim(validator.escape(req.param('patientId')));
  console.log("exibir prontuario");
  medicalReportController.userMedicalReport(patientId, function(resp){
    res.render("pages/agenda.ejs", {"medicalReport": resp, "page": "/agenda"});
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
