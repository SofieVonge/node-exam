
exports.seed = function(knex) {
  return knex('users').select()
    .then(users => {
      if (users.length > 1) {
         // Inserts seed entries
      return knex('expenses').insert([
        {name: "rent", amount: '4000', time_between: "1", next_payment: "6", user_id: users[0].id},
        {name: "internet", amount: '800', time_between: "3", next_payment: "6", user_id: users[1].id},
      ]);
      }
    });
};
