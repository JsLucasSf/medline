# p1-20172

Na disciplina de Projeto 1 do curso de Ciência da Computação da UFCG, desenvolveremos um serviço de controle para clínicas, médicos e pacientes, visando facilitar a comunicação e organização nas relações entre profissionais da saúde e pacientes.

Grupo:
- Kallynny Karlla
- Marcela Tejo
- José Lucas Silva
- Catarina Silva

---

## Configurando localmente

Para configurar e rodar a aplicação localmente, realize os seguintes passos

#### Clonando o repositório
```
git clone https://github.com/JsLucasSf/medline.git
cd medline
```

#### Instale o nodejs
https://nodejs.org/en/download/package-manager/

#### Instale o mongodb
https://docs.mongodb.com/manual/installation/

#### Instalando as dependencias
```
npm install
```

#### Rode o mongod
```
mkdir /data/db
chmod +x /data*
sudo mongod
```

#### Rode a aplicação
```
node index.js
```

#### SUGESTÃO
Use o nodemon para desenvolver, com ele, não é necessário reiniciar o servidor sempre que o código for modificado

```
npm install -g nodemon
sudo nodemon index.js
```

---

## Fazendo deploy para o heroku

Uma vez que novas funcionalidades ou modificações forem implementadas, fazemos deploy no heroku da seguinte maneira

Antes de mais nada, precisamos adicionar o remote do heroku

```
git remote add heroku https://git.heroku.com/medline.git
``'


```
git add .
git commit -m "SUA MENSAGEM DE COMMIT AQUI"
git push heroku master
```
