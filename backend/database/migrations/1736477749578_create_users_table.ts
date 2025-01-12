import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'users'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').notNullable()
            table.string('full_name', 254).nullable()
            table.string('email', 254).nullable().unique()
            table.string('password').notNullable()
            table.string('remember_me_token').nullable()
            table.string('username', 24).nullable().unique()
            table.string('cpf', 11).nullable().unique()

            table.timestamp('created_at').notNullable()
            table.timestamp('updated_at').nullable()
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
