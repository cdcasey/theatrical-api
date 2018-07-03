
exports.up = function (knex, Promise) {
    return knex.schema.createTable('users', (table) => {
        table.increments();
        table.string('first_name');
        table.string('last_name');
        table.string('email').unique();
        table.string('phone');
        table.string('password');
        table.integer('role_id');
        table.foreign('role_id').references('roles.id').onDelete('SET NULL');
        table.timestamps(true, true);
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('users');
};
