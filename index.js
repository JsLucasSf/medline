var app = require('./app_config.js');

var validator = require('validator');

var doctorController = require('./controller/doctorController.js');

var clinics = [];

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
  var clinicAddress = req.body.address;
  var clinicPassword = req.body.password;
  // NEED TO PROPER DEFINE THE CLINIC ATTRIBUTES

  if(clinicName && clinicAddress && clinicPassword){
    const newClinic = {
      "name" : clinicName,
      "address" : clinicAddress,
      "password" : clinicPassword
    }

    clinics.push(newClinic);
    res.redirect("/lista-clinicas");
  }

  res.send(clinicName + clinicAddress);
})

// TEST
app.get("/lista-clinicas", function(req, res){
  res.render("index.ejs", {"clinics" : clinics});
})

/*
app.get("/clinica/:nome", function(req, res){
  let nome = req.params.nome;
  let clinicResponse = undefined;

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