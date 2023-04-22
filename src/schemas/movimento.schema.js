import joi from "joi"

export const movimentoSchema = joi.object({
    valor: joi.number().integer().positive(),
    tipo: joi.string().valid("entrada", "saida").required(),
    descrição: joi.string().required()
})