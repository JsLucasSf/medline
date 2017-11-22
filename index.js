/* Modules */
let express = require("express");
let app = express();
let bodyParser = require("body-parser");

/* Config */
const PORT = 5000;
app.use(bodyParser.urlencoded({ extended: true }))

let clinics = [];

/* Routes */
app.get("/", function(req, res){
  res.send("<h1>Welcome to the Medline API!</h1>");
})

// TEST
app.get("/clinica/nova", function(req, res){
  res.render("nova_clinica.ejs", {message : undefined});
})

app.post("/clinica/nova", function(req, res){
  let clinicName = req.body.name;
  let clinicAddress = req.body.address;
  let clinicPassword = req.body.password;
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
app.listen(PORT, function(){
  console.log("Server running on port: " + PORT);
})
