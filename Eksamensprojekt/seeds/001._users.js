
exports.seed = function(knex) {
       // Inserts seed entries
      return knex('users').insert([
        {username: "Sof", password: "secret123", email: "sof@fam1.dk"},
        {username: "And", password: "dobblesecret", email: "and@fam1.dk"},
        {username: "Nad", password: "password", email: "nad@fam2.dk"},
        {username: "Dan", password: "password", email: "dan@fam2.dk"},
      ]);
};
