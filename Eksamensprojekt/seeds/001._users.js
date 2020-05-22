
exports.seed = function(knex) {
       // Inserts seed entries
      return knex('users').insert([
        {username: "Sof", password: "$2b$12$.5TIu..ffeiUxQejXwUWueLhhUk/zUkwWA5JDF6L.uStnQjY2nDTK", email: "sof@fam1.dk"},
        {username: "And", password: "$2b$12$.5TIu..ffeiUxQejXwUWueLhhUk/zUkwWA5JDF6L.uStnQjY2nDTK", email: "and@fam1.dk"},
        {username: "Nad", password: "password", email: "nad@fam2.dk"},
        {username: "Dan", password: "password", email: "dan@fam2.dk"},
      ]);
};
