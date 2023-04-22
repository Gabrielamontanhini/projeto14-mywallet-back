import { db } from "../database/database.connection.js"
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"
import { cadastroSchema } from "../schemas/cadastro.schema.js"
import { loginSchema } from "../schemas/login.schema.js"


export async function cadastarUsuario(req, res) {
    const { nome, email, senha } = req.body
    const hash = bcrypt.hashSync(senha, 10)
    const novoUsuario = {
        nome, email, senha: hash
    }
    const valide = cadastroSchema.validate(novoUsuario, { abortEarly: false })
    if (valide.error) {
        const errors = valide.error.details.map(detail => detail.message)
        return res.status(422).send(errors)
    }
    try {
        const emailCadastrado = await db.collection("usuarios").findOne({ email })
        if (emailCadastrado) return res.sendStatus(409)
        await db.collection("usuarios").insertOne(novoUsuario)
        return res.sendStatus(201)

    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

export async function verUsuarios(req, res) {
    try {
        const usuarios = await db.collection("usuarios").find().toArray()
        return res.status(200).send(usuarios)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

export async function deletarUsuarios(req, res) {  //DELETAR USUARIOS
    const { filtro } = req.params
    try {
        const deletado = await db.collection("usuarios").deleteMany({ nome: filtro })
        if (deletado.deletedCount === 0) return res.status(404).send("Não encontrado")
        res.sendStatus(200)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

export async function fazerLogin(req, res) { //login
    const { email, senha } = req.body
    const logarUsuario = {
        email, senha
    }

    const validar = loginSchema.validate(logarUsuario, { abortEarly: false })
    if (validar.error) {
        const errors = validar.error.details.map(detail => detail.message)
        return res.status(422).send(errors)
    }

    try {
        const usuarioCadastrado = await db.collection("usuarios").findOne({ email })
        if (!usuarioCadastrado) return res.status(404).send("E-mail não cadastrado")

        const senhaCorreta = bcrypt.compareSync(senha, usuarioCadastrado.senha)
        if (!senhaCorreta) return res.status(401).send("Senha incorreta")

        const token = uuid()
        await db.collection("sessoes").insertOne({ idUsuario: usuarioCadastrado._id, token })

        return res.status(200).send(token)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}



export async function verSessoes(req, res){


    try{
        const sessoesAtivas = await db.collection("sessoes").find().toArray()
        return res.status(200).send(sessoesAtivas)
    }
    catch(err){
        res.status(500).send(err.message)
    }
}