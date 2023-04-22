import { Router } from "express";
import { deletarMovimentoPorId, novoMovimento, paginaInicial } from "../controllers/movimento.controllers.js";


const movimentoRouter = Router()

movimentoRouter.post("/nova-transacao/:tipo", novoMovimento)

movimentoRouter.get("/home", paginaInicial)

movimentoRouter.delete("/home/:id", deletarMovimentoPorId)

export default movimentoRouter