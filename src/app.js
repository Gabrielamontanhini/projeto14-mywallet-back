import express from "express"
import cors from "cors"
import router from "./routes/index.routes.js"
//Criação do servidor
const app = express()
//Configurações 
app.use(cors())
app.use(express.json())
app.use(router)
// Deixa o app escutando, à espera de requisições

app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando em ${process.env.PORT}`)
})