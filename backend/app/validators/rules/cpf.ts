import { FieldContext } from '@vinejs/vine/types'
import vine from '@vinejs/vine'
import { isValidCPF } from '#helpers/cpf'

/**
 * Implementação da regra de validação de CPF para o VineJS.
 *
 * @param value - Valor do campo a ser validado.
 * @param _options
 * @param field - Contexto do campo atual.
 */
async function validateCpf(value: unknown, _options:any, field: FieldContext) {
    if (typeof value !== 'string' || !isValidCPF(value)) {
        return field.report('O CPF fornecido é inválido.', 'cpf.invalid', field)
    }
}

/**
 * Transformando a função de validação em uma regra do VineJS.
 */
export const cpfRule = vine.createRule(validateCpf, { isAsync: true })
// export function cpfRule() {
//     return vine.createRule(validateCpf, {isAsync: true})
// }
