
exports.seed = function(knex) {
       // Inserts seed entries
      return knex('users').insert([
        {username: "Sof", password: "$2b$12$.5TIu..ffeiUxQejXwUWueLhhUk/zUkwWA5JDF6L.uStnQjY2nDTK", email: "sof@fam1.dk"},
        {username: "And", password: "$2b$12$.5TIu..ffeiUxQejXwUWueLhhUk/zUkwWA5JDF6L.uStnQjY2nDTK", email: "and@fam1.dk"},
        {username: "Nadia", password: "$2b$12$.5TIu..ffeiUxQejXwUWueLhhUk/zUkwWA5JDF6L.uStnQjY2nDTK", email: "nad@fam2.dk"},
        {username: "Daniel", password: "$2b$12$.5TIu..ffeiUxQejXwUWueLhhUk/zUkwWA5JDF6L.uStnQjY2nDTK", email: "dan@fam2.dk"},
        {username: "TestUser", password: "$2b$12$.5TIu..ffeiUxQejXwUWueLhhUk/zUkwWA5JDF6L.uStnQjY2nDTK", email: "test@fam2.dk"},
      ]);
};
