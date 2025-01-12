import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'tasks'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table
                .integer('user_id')
                .unsigned()
                .notNullable()
                .references('users.id')
                .onDelete('CASCADE')

            table.string('title').notNullable()
            table.text('description').nullable()
            table.string('priority').nullable()
            table.string('status').nullable()
            table.string('color').nullable()
            table.timestamp('estimated_end_at').nullable()
            table.timestamp('start_at').nullable()
            table.timestamp('end_at').nullable()
            table.integer('sort_order').defaultTo(0)

            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
