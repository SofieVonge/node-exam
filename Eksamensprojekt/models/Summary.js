const { Model } = require("objection");

const User = require("./User.js");
const Expense = require("./Expense.js");

class Summary extends Model {
    static tableName = "summaries";

    static relationMappings = {

        user: {
            relationMappings: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
                from: "summaries.userId",
                to: "users.id"
            }
        },

        expenses: {
            relationMappings: Model.ManyToManyRelation,
            modelClass: Expense,
            join: {
                from: "summaries.id",
                through: {
                    from: "summaries_expenses.summaryId",
                    to: "summaries_expenses.expenseId"
                },
                to: "expenses.id"

            }

        }

    }
}

module.exports = Summary;