import { ObjectId } from "mongodb"
import { db } from "../database/database.connection.js"



export async function novoMovimento(req, res) {//usa token
    const { tipo } = req.params
    const { valor } = (req.body)
    const { descrição } = (req.body)
    
    const novoMovimento = {
        valor: valor,
        tipo: tipo, 
        descrição: descrição
    }

    try {    
        const sessao = res.locals.sessao
        await db.collection("movimento").insertOne({...novoMovimento, idUsuario: sessao.idUsuario})
        return res.status(201).send("Movimento adicionado!")
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}


export async function paginaInicial(req, res){ //usa token

    try {
const sessao = res.locals.sessao
        const usuario = await db.collection("usuarios").findOne({ _id: sessao.idUsuario })
        if (usuario) delete usuario.senha

        const extratoDoUsuario = await db.collection("movimento").find({idUsuario: usuario._id}).sort({ _id: -1 }).toArray()
        res.status(200).send(extratoDoUsuario)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

export async function deletarMovimentoPorId(req, res){//uso próprio pra limpar os movimentos
    const { id } = req.params

    try {
        const deletar = await db.collection("movimento").deleteOne({ _id: new ObjectId(id) })
        if (deletar.deletedCount === 0) return res.status(404).send("Esse item não existe!")
        res.send("Item deletado com sucesso!")
    }

    catch (err) {
        res.status(500).send(err.message)
    }
}
