
exports.seed = function(knex) {
  return knex('users').select()
  .then(users => {
    if (users.length > 1) {
       // Inserts seed entries
    return knex('summaries').insert([
      {payment_date: "20.05.20", total: '4000', user_id: users[0].id},
      {payment_date: "20.05.20", total: '800', user_id: users[1].id},
    ]);
    }
  });
};
