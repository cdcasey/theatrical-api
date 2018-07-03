
exports.up = function (knex, Promise) {
    return knex.schema.createTable('users_characters', (table) => {
        table.increments();
        table.integer('user_id');
        table.foreign('user_id').references('users.id').onDelete('CASCADE');
        table.integer('character_id');
        table.foreign('character_id').references('characters.id').onDelete('CASCADE');
        table.integer('production_id');
        table.foreign('production_id').references('productions.id').onDelete('CASCADE');
        table.timestamps(true, true);
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('users_characters');
};
