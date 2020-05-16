const { Model } = require("objection");

const Expense = require("./Expense.js");
const Summary = require("./Summary.js");

class User extends Model {
    static tableName = "users";

    static relationMappings = {
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