import express from "express"
import cors from "cors"
import { MongoClient, ObjectId } from "mongodb"
import dotenv from "dotenv"

//Criação do servidor
const app = express()

//Configurações 
app.use(express.json())
app.use(cors())
dotenv.config()

//Conexão com o banco de dados
const mongoClient = new MongoClient(process.env.DATABASE_URL)
try {
    await mongoClient.connect()
    console.log("MongoDB conectado!")
} catch (err) {
    console.log(err.message)
}
const db = mongoClient.db()


//Endpoints

app.post("/cadastro", async (req, res) => {
    const novoUsuario = req.body
    try {
        await db.collection("usuarios").insertOne(novoUsuario)
        return res.sendStatus(201)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
})

app.get("/cadastro", async (req, res) => { //VER OS USUARIOS
    try {
        const usuarios = await db.collection("usuarios").find().toArray()
        return res.status(200).send(usuarios)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
})

app.post("/login", async (req, res) => {
    const { email, senha } = req.body
    try {
        const login = await db.collection("usuarios").findOne({ email, senha })
        if (!login) {
            return res.status(404).send("Incorretos")
        }
        return res.sendStatus(200)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
})

app.post("/nova-transacao/:tipo", async (req, res) => {
const {tipo} = req.params
const {valor} = req.body

const novoMovimento = {
    valor: valor,  
    tipo: tipo
}

try{
    const operação = await db.collection("movimento").insertOne(novoMovimento)
    return res.status(201).send("Movimento adicionado!")
}
catch (err) {
    res.status(500).send(err.message)
}
})

app.get("/home", async (req, res) => { //precisará de token
try{
    const extrato = await db.collection("movimento").find().toArray()
    res.status(200).send(extrato)
}
catch (err) {
    res.status(500).send(err.message)
}
})

app.delete("/home/:id", async (req,res) => {
    const { id } = req.params

try{
    const deletar = await db.collection("movimento").deleteOne({ _id: new ObjectId(id) })
    if (deletar.deletedCount === 0) return res.status(404).send("Esse item não existe!")
    res.send("Item deletado com sucesso!")
}

catch (err) {
    res.status(500).send(err.message)
}
})

// Deixa o app escutando, à espera de requisições
const PORT = 5000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))