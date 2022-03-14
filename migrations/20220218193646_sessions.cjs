exports.up = function (knex) {
  return knex.schema.createTable("sessions", function (t) {
    t.increments("id").primary();
    t.string("uuid");
    t.string("gitkrakenBoardId");
    t.string("gitkrakenBoardName");
    t.string("gitkrakenBoardUsers");
    t.string("target");
    t.string("createdBy");
    t.integer("createdOn");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("sessions");
};
