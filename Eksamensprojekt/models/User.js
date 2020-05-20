const { Model } = require("objection");

const Household = require("./Household.js");
const Expense = require("./Expense.js");
const Summary = require("./Summary.js");

class User extends Model {
    static tableName = "users";

    static relationMappings = {
        household: {
            relation: Model.HasOneThroughRelation,
            modelClass: Household,
            join: {
                from: 'users.id',
                through: {
                    from: 'households_users.userId',
                    to: 'households_users.householdId'
                },
                to: 'households.id'
            }
        },
        expenses: {
            relation: Model.HasManyRelation,
            modelClass: Expense,
            join: {
                from: "user.id",
                to: "expenses.userId"
            }
        },
        summaries: {
            relation: Model.HasManyRelation,
            modelClass: Summary,
            join: {
                from: "user.id",
                to: "summaries.userId"
            }
        }
    }
}

module.exports = User;