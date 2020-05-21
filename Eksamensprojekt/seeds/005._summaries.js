
exports.seed = function(knex) {
  return knex('households').select()
  .then(households => {
    if (households.length > 1) {
       // Inserts seed entries
    return knex('summaries').insert([
      {payment_date: "20.05.20", total: '4000', household_id: households[0].id},
      {payment_date: "20.05.20", total: '800', household_id: households[1].id},
    ]);
    }
  });
};
