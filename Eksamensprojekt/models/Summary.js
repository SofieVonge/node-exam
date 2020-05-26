const { Model } = require("objection");



class Summary extends Model {
    static tableName = "summaries";

    static get relationMappings() {

        const Household = require("./Household.js");
        const Expense = require("./Expense.js");

        return {
            household: {
                relation: Model.BelongsToOneRelation,
                modelClass: Household,
                join: {
                    from: "summaries.householdId",
                    to: "households.id"
                }
            },

            expenses: {
                relation: Model.ManyToManyRelation,
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
}

module.exports = Summary;