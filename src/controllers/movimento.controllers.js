import { ObjectId } from "mongodb"
import { db } from "../database/database.connection.js"
import { movimentoSchema } from "../schemas/movimento.schema.js"


export async function novoMovimento(req, res) {
    const { tipo } = req.params
    const { valor } = (req.body)
    const { descrição } = (req.body)
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '')

    if (!token) return res.sendStatus(401);
    const novoMovimento = {
        valor: valor,
        tipo: tipo, 
        descrição: descrição
    }
    const validar = movimentoSchema.validate(novoMovimento, { abortEarly: false })
    if (validar.error) return res.sendStatus(422)
    try {
        const sessao = await db.collection("sessoes").findOne({ token });
        if (!sessao) return res.sendStatus(401);

        await db.collection("movimento").insertOne({...novoMovimento, idUsuario: sessao.idUsuario})
        return res.status(201).send("Movimento adicionado!")
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

export async function paginaInicial(req, res){ //precisará de token
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '')

    if (!token) return res.sendStatus(401);


    try {
        const sessao = await db.collection("sessoes").findOne({ token });
        if (!sessao) return res.sendStatus(401);

        const usuario = await db.collection("usuarios").findOne({ _id: sessao.idUsuario })
        if (usuario) delete usuario.senha

        const extratoDoUsuario = await db.collection("movimento").find({idUsuario: usuario._id}).sort({ _id: -1 }).toArray()
        res.status(200).send(extratoDoUsuario)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

export async function deletarMovimentoPorId(req, res){
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
