import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from "#models/user";
import { BelongsTo } from "@adonisjs/lucid/types/relations";

export default class Task extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare userId: number

    @column()
    declare title: string

    @column()
    declare description: string | null

    @column()
    declare priority: string | null

    @column()
    declare status: string | null

    @column()
    declare color: string | null

    @column.dateTime()
    declare estimatedEndAt: DateTime | null

    @column.dateTime()
    declare startAt: DateTime | null

    @column.dateTime()
    declare endAt: DateTime | null

    @column()
    declare sortOrder: number

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null

    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>
}
