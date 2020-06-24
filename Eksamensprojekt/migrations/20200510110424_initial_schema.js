
exports.up = function(knex) {
    return knex.schema
    .createTable("users", table => {
        table.increments("id");
        table.string("username").unique().notNullable();
        table.string("password").notNullable();
        table.string("email").unique().notNullable();
        table.dateTime("updated_at").defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
        table.dateTime("created_at").defaultTo(knex.fn.now());
    })
    .createTable("households", table => {
        table.increments("id");
        table.string("name").notNullable();
        table.integer("member_count").notNullable();
        table.dateTime("updated_at").defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
        table.dateTime("created_at").defaultTo(knex.fn.now());

        table.integer("owner_id").unsigned().notNullable();
        // mapping the foreign key from the other table
        table.foreign("owner_id").references("users.id");
    })
    .createTable("households_users", table => {
        table.integer("household_id").unsigned().notNullable();
        table.foreign("household_id").references("households.id");
        table.integer("user_id").unsigned().notNullable().unique();
        table.foreign("user_id").references("users.id");
    })
    .createTable("expenses", table => {
        table.increments("id");
        table.string("name").notNullable();
        table.float("amount").notNullable();
        table.integer("time_between").notNullable();
        table.integer("next_payment").notNullable();
        table.dateTime("updated_at").defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
        table.dateTime("created_at").defaultTo(knex.fn.now());

        table.integer("household_id").unsigned().notNullable();
        // mapping the foreign key from the other table
        table.foreign("household_id").references("households.id");
    })
    .createTable("summaries", table => {
        table.increments("id");
        table.dateTime("payment_date").notNullable();
        table.float("total").notNullable();
        table.dateTime("updated_at").defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
        table.dateTime("created_at").defaultTo(knex.fn.now());
        table.integer("household_id").unsigned().notNullable();
        table.foreign("household_id").references("households.id");
    })
    .createTable("summaries_expenses", table => {
        // a many to many mapping table
        table.integer("summary_id").unsigned().notNullable();
        table.foreign("summary_id").references("summaries.id");
        table.integer("expense_id").unsigned().notNullable();
        table.foreign("expense_id").references("expenses.id");
    })
    .createTable("chat_authentications", table => {
        table.integer("user_id").unsigned().unique().notNullable();
        table.foreign("user_id").references("users.id");
        table.string("key").notNullable();
        table.dateTime("updated_at").defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
        table.dateTime("created_at").defaultTo(knex.fn.now());
    });
  
};

exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists("summaries_expenses")
    .dropTableIfExists("summaries")
    .dropTableIfExists("expenses")
    .dropTableIfExists("households_users")
    .dropTableIfExists("households")
    .dropTableIfExists("chat_authentications")
    .dropTableIfExists("users");
};
