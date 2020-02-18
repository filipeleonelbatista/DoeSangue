const express = require('express')
const server = express()
const nunjucks = require('nunjucks')

server.use(express.static('public'))

server.use( express.urlencoded( {extended: true} ) )

const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'Pioneer47',
    host: 'localhost',
    port: 5432,
    database: 'doe',
})

nunjucks.configure("./", {
    express: server,
    noCache: true,
})

const donors = [
    {
        name: "Filipe",
        blood: "O+",
    },
    {
        name: "Leonel",
        blood: "AB+",
    },
    {
        name: "Batista",
        blood: "B+",
    },
    {
        name: "John",
        blood: "A+",
    },
]

server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if(err) return res.send("Erro no banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })

    
})

server.post("/", function(req, res){

    const name = req.body.name
    const email = req.body.email 
    const blood = req.body.blood

    if ((name == '' )||(email == '' )||(blood == '' )){
        res.send('Todos os campos são obrigatórios!')
    }

    const query = `
        INSERT INTO donors ("name","email","blood")
        VALUES ($1, $2, $3) `

    const values = [name, email, blood]
    db.query(query, values, function(err){
        if(err) return res.send("Erro no banco de dados.")

        return res.redirect("/")
    })    

})

server.listen(3000, function(){
    console.log("Iniciando o servidor...")
    console.log("Servidor disponível em http://localhost:3000")
})