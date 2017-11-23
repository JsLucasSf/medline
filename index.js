/* Modules */
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var validator = require("validator");
var CPF = require("cpf_cnpj").CPF;
var CNPJ = require("cpf_cnpj").CNPJ;


/* Config */
const PORT = 5000;
app.use(bodyParser.urlencoded({ extended: true }))
mongoose.connect("mongodb://localhost/medline_db");

var clinicSchema = mongoose.Schema({
  name : String,
  email : String,
  cnpj : String,
  address : String,
  password : String
});

var Clinic = mongoose.model("Clinic", clinicSchema);

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

      Clinic.create(newClinic, function(err, clinic){
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

  Clinic.find({}, function(err, theClinics){
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
app.listen(PORT, function(){
  console.log("Server running on port: " + PORT);
})
