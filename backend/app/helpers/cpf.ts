/**
 * Verifica se um CPF brasileiro é válido usando o algoritmo
 * de cálculo dos dígitos verificadores.
 *
 * Este algoritmo segue as especificações descritas em:
 * https://www.macoratti.net/alg_cpf.htm
 *
 * @param rawCpf - CPF com ou sem formatação (ex.: "123.456.789-09" ou "12345678909").
 * @returns `true` se o CPF for válido, `false` caso contrário.
 */
export function isValidCPF(rawCpf: string): boolean {
    const cpf = rawCpf.replace(/\D/g, '')

    if (cpf.length !== 11) {
        return false
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
        return false
    }

    // Cálculo do primeiro dígito
    let sum = 0
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf[i]) * (10 - i)
    }
    let result = sum % 11
    const firstCheckDigit = result < 2 ? 0 : 11 - result

    // Cálculo do segundo dígito
    sum = 0
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf[i]) * (11 - i)
    }
    result = sum % 11
    const secondCheckDigit = result < 2 ? 0 : 11 - result

    // Verificar se bate com os dígitos do CPF
    return parseInt(cpf[9]) === firstCheckDigit && parseInt(cpf[10]) === secondCheckDigit
}
