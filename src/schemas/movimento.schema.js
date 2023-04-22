import joi from "joi"

export const movimentoSchema = joi.object({
    valor: joi.number().integer().positive(),
    descrição: joi.string().required()
})