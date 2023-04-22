import { Router } from "express";
import { cadastarUsuario, deletarUsuarios, fazerLogin, verSessoes, verUsuarios } from "../controllers/usuario.controllers.js";
import { schemaValido } from "../middlewares/schema.middleware.js";
import { cadastroSchema } from "../schemas/cadastro.schema.js";
import { loginSchema } from "../schemas/login.schema.js";


const usuarioRouter = Router()

usuarioRouter.post("/cadastro", schemaValido(cadastroSchema),cadastarUsuario)
usuarioRouter.post("/", schemaValido(loginSchema),fazerLogin)


//PARA USO PROPRIO
usuarioRouter.get("/cadastro", verUsuarios)
usuarioRouter.delete("/cadastro/muitos/:filtro", deletarUsuarios)
usuarioRouter.get("/sessoes", verSessoes )

export default usuarioRouter