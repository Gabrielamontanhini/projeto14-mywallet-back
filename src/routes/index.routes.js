import { Router } from "express";
import usuarioRouter from "./usuario.routes.js";
import movimentoRouter from "./movimento.routes.js";


const router = Router()
router.use(usuarioRouter)
router.use(movimentoRouter) 

export default router