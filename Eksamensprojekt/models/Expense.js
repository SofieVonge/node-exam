const { Model } = require("objection");

const User = require("./User.js");
const Summary = require("./Summary.js");

class Expense extends Model {
    static tableName = "expenses";

    static relationMappings = {

        user: {
            relationMappings: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
                from: expenses.userId,
                to: users.id
            }
        },

        summaries: {
            relationMappings: Model.ManyToManyRelation,
            modelClass: Summary,
            join: {
                from: "expenses.id",
                through: {
                    from: "summaries_expenses.expenseId",
                    to: "summaries_expenses.summaryId"
                },
                to: "summaries.id"
            }

        }

    }
}

module.exports = Expense;