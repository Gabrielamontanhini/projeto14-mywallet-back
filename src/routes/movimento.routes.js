import { Router } from "express";
import { deletarMovimentoPorId, novoMovimento, paginaInicial } from "../controllers/movimento.controllers.js";
import { authValidar } from "../middlewares/auth.middleware.js"
import { schemaValido } from "../middlewares/schema.middleware.js";
import { movimentoSchema } from "../schemas/movimento.schema.js";


const movimentoRouter = Router()

movimentoRouter.delete("/home/:id", deletarMovimentoPorId)
movimentoRouter.use(authValidar)
movimentoRouter.get("/home", paginaInicial)
movimentoRouter.post("/nova-transacao/:tipo",schemaValido(movimentoSchema) ,novoMovimento)



export default movimentoRouter