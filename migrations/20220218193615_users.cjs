exports.up = function (knex) {
  return knex.schema.createTable("users", function (t) {
    t.increments("id").primary();
    t.string("uuid");
    t.string("sessionId");
    t.string("sourceToken");
    t.string("sourcePrincipal");
    t.string("targetToken");
    t.string("targetPrincipal");
    t.integer("createdOn");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
