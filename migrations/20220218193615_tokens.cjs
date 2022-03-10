exports.up = function (knex) {
  return knex.schema.createTable("tokens", function (t) {
    t.increments("id").primary();
    t.string("sessionId");
    t.string("type");
    t.string("sourceId");
    t.string("targetId");
    t.string("token");
    t.string("username");
    t.integer("createdOn");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("tokens");
};
