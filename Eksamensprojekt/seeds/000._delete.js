
exports.seed = function(knex)
{
  // Deletes ALL existing entries
  return knex('summaries_expenses').del()
  .then(function ()
  {
    return knex('summaries').del()
    .then(function ()
    {
      return knex("expenses").del()
      .then(function ()
      {
        return knex("households_users").del()
        .then(function ()
        {
          return knex("households").del()
          .then(function ()
          {
            return knex("users").del()
          });
        });
      });
    });
  });
};
