/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void>{
    pgm.createTable('users', {
        id: 'id',
        firstName: { type: 'varchar(1000)', notNull: true },
        lastName: { type: 'varchar(1000)', notNull: true },
        email: { type: 'varchar(1000)', notNull: true, unique: true },
        passwordDigest: { type: 'varchar(1000)', notNull: true },
        created: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })
    pgm.createTable('records', {
        id: 'id',
        userId: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE',
        },
        name: { type: 'text', notNull: true },
        content: { type: 'text', notNull: true },
        created: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })
    pgm.createIndex('records', 'userId')
}

export async function down(pgm: MigrationBuilder): Promise<void>{
}
