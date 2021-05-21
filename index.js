const express = require('express')
const path = require("path")
const http = require("http")

const axios = require('axios')

const bodyParser = require('body-parser');

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));

// impostazione servizio ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'))

const port = 3333

//route principale
app.get('/', (req, res) => {
    res.render('home.ejs', {token:"Non ancora generato!"});
})

//post per ottenere il token, dopo essersi loggati
app.post('/getToken', async (req, res) =>{
    var username = req.body.username
    var result = await axios.post('http://161.97.114.50:4000/login', {username: username});
    var token = result.data.accessToken;
    res.render('home.ejs', {token: token})
})

//post per prelevare i dati
app.post('/getPosts', async (req, res) =>{
    var token = req.body.token

    const headers = {
        headers: { 'Authorization': `Bearer ` + token}
    };

    try{
        var result = await axios.get('http://161.97.114.50:3000/posts', headers);
    }catch(err){
        console.log(err)
        result = {data: "Accesso non consentito"}
    }

    console.log(result)
    console.log(token)
    res.render('risultato.ejs', {risultato:result.data})
})

//pagina di errore 404 (pagina non trovata)
app.use((req, res,next)=>{
    res.status(404).render('404page.ejs');
});

app.listen(port, () => {
  console.log(`Server in ascolto su http://localhost:${port}`)
})