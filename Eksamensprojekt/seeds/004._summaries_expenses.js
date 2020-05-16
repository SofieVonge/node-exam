
exports.seed = function(knex) {
  return knex('expenses').select()
  .then(expenses => {
    if (expenses.length > 1) {
      return knex("summaries").select()
      .then(summaries => {
        // Inserts seed entries
        if (summaries.length > 1) {
          return knex('summaries_expenses').insert([
      {summary_id: summaries[0].id, expense_id: expenses[0].id},
      {summary_id: summaries[1].id, expense_id: expenses[1].id},
          ]);
        }
      })
    }
  });
};
