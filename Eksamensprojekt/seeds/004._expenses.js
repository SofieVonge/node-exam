
exports.seed = function(knex) {
  return knex('households').select()
    .then(households => {
      if (households.length > 1) {
         // Inserts seed entries
      return knex('expenses').insert([
        {name: "rent", amount: '4000', time_between: "1", next_payment: "7", household_id: households[0].id},
        {name: "internet", amount: '800', time_between: "3", next_payment: "7", household_id: households[1].id},
      ]);
      }
    });
};
