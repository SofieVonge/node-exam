const { Model } = require("objection");

const Household = require("./Household.js");
const Summary = require("./Summary.js");

class Expense extends Model {
    static tableName = "expenses";

    static relationMappings = {

        household: {
            relation: Model.BelongsToOneRelation,
            modelClass: Household,
            join: {
                from: "expenses.householdId",
                to: "households.id"
            }
        },

        summaries: {
            relation: Model.ManyToManyRelation,
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