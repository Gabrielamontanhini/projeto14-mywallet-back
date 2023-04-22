import { Router } from "express";
import { cadastarUsuario, deletarUsuarios, fazerLogin, verSessoes, verUsuarios } from "../controllers/usuario.controllers.js";


const usuarioRouter = Router()

usuarioRouter.post("/cadastro", cadastarUsuario)
usuarioRouter.get("/cadastro", verUsuarios)
usuarioRouter.delete("/cadastro/muitos/:filtro", deletarUsuarios)
usuarioRouter.post("/", fazerLogin)
usuarioRouter.get("/sessoes", verSessoes )

export default usuarioRouter