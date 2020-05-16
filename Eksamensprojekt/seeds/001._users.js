
exports.seed = function(knex) {
       // Inserts seed entries
      return knex('users').insert([
        {username: "Sof", password: "secret123"},
        {username: "And", password: "dobblesecret"},
      ]);
};
