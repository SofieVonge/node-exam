exports.seed = async function(knex) {
    return knex("users").select().then(users => {
        if (users.length < 3) {
            return;
        }
        // Inserts seed entries
        return knex('households').insert([
            { name: "Fam. Vonge Jensen (Gudhjem)", memberCount: 2, ownerId: users[0].id },
            { name: "Fam. Blom (Mariehønen)", memberCount: 2, ownerId: users[2].id },
        ]);
    });
};