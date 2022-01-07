import knex from 'knex';

export default knex({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: "./db.sqlite"
    }
});

export const init = async (db) => {
    await db.schema.hasTable('sessions').then(function (exists) {
        if (!exists) {
            return db.schema.createTable('sessions', function (t) {
                t.increments('id').primary();
                t.string('uuid');
                t.string('boardId');
                t.string('target');
                t.string('users');
                t.integer('step');
                t.timestamps();
            });
        }
    });
}