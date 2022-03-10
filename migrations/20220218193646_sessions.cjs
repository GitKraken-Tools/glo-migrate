exports.up = function (knex) {
  return knex.schema.createTable("sessions", function (t) {
    t.increments("id").primary();
    t.string("uuid");
    t.string("sourceId");
    t.string("source");
    t.string("target");
    t.integer("createdOn");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("sessions");
};
