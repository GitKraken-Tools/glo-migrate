exports.up = function (knex) {
  return knex.schema.createTable("users", function (t) {
    t.increments("id").primary();
    t.string("gitkrakenUsername");
    t.string("gitkrakenId");
    t.string("tokens");
    t.integer("createdOn");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
