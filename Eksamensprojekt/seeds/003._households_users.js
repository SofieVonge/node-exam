exports.seed = function(knex) {
    return knex("households").select()
    .then(households =>
    {
        if (households.length < 2) {
             return;
        }

        return knex("users").select()
        .then(users =>
        {
            if (users.length < 4) {
                return;
            }

            // Inserts seed entries
            return knex('households_users').insert([
                { householdId: households[0].id, userId: users[0].id },
                { householdId: households[0].id, userId: users[1].id },
                { householdId: households[1].id, userId: users[2].id },
                { householdId: households[1].id, userId: users[3].id },
            ]);
        });
    });
};