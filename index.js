var app = require('./app_config.js');

var db = require('./db_config.js');

var validator = require('validator');

var doctorController = require('./controller/doctorController.js');

var clinics = [];

var CPF = require("cpf_cnpj").CPF;
var CNPJ = require("cpf_cnpj").CNPJ;

/* Routes */
app.get("/", function(req, res){
  res.send("<h1>Welcome to the Medline API!</h1>");
})

// TEST
app.get("/clinica/nova", function(req, res){
  res.render("nova_clinica.ejs", {message : undefined});
})

app.post("/clinica/nova", function(req, res){
  var clinicName = req.body.name;
  var clinicEmail = req.body.email;
  var clinicCNPJ = req.body.cnpj;
  var clinicAddress = req.body.address;
  var clinicPassword = req.body.password;

  var errors = false;

  if(clinicName && clinicAddress && clinicCNPJ && clinicPassword){
    if(!validator.isEmail(clinicEmail)){
      console.log("Email inválido");
      errors = true;
    }
    if(!CNPJ.isValid(clinicCNPJ)){
      console.log("CNPJ inválido");
      errors = true;
    }

    if(!errors){
      const newClinic = {
        "name" : clinicName,
        "email" : clinicEmail,
        "CNPJ" : clinicCNPJ,
        "address" : clinicAddress,
        "password" : clinicPassword
      }

      db.Clinic.create(newClinic, function(err, clinic){
        if(err){
          console.log("Something went wrong!");
        }else{
          console.log("Clinic created with success!");
        }
      });
    }
  }

  res.redirect("/lista-clinicas");
})

// TEST
app.get("/lista-clinicas", function(req, res){
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

/*
app.get("/clinica/:nome", function(req, res){
  var nome = req.params.nome;
  var clinicResponse = undefined;

  for(clinic of clinics){
    if(clinic.name === nome){
      clinicResponse = clinic;
    }
  }

  if(clinicResponse){
    res.send(clinicResponse);
  }else{
    res.send("Clínica não encontrada");
  }
})
*/

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
  
    var fullname = validator.trim(validator.escape(req.param('fullname')));
    var email = validator.trim(validator.escape(req.param('email')));
    var password = validator.trim(validator.escape(req.param('password')));
  
    doctorController.save(fullname, email, password, function(resp) {
  
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

  