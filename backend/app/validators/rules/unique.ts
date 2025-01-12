import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'
import Database from '@adonisjs/lucid/services/db'
import { DatabaseQueryBuilderContract } from '@adonisjs/lucid/types/querybuilder'

/**
 * Essas opções configuram a tabela e a coluna usadas para verificar a unicidade de um valor.
 * Da para passar um filtro personalizado para ajustar a consulta, se necessário.
 */
type UniqueOptions = {
    table: string
    column?: string
    filter?: (
        Database: DatabaseQueryBuilderContract,
        value: string,
        field: FieldContext
    ) => Promise<void>
}

async function unique(value: unknown, options: UniqueOptions, field: FieldContext) {
    if (typeof value !== 'string') {
        return
    }

    if (typeof field.name !== 'string') {
        return
    }

    const columnName = options.column || field.name

    const baseQuery = Database.from(options.table).select(columnName).where(columnName, value)

    await options.filter?.(baseQuery, value, field)

    const row = await baseQuery.first()

    if (row) {
        field.report(`Este ${field.name} já está em uso.`, 'database.unique', field)
    }
}

/**
 * Converte a função para uma regra do Vine
 */
export const uniqueRule = vine.createRule(unique, { isAsync: true })
