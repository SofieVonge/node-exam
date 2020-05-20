const { Model } = require("objection");


class Household extends Model {
    static tableName = "households";

    static get relationMappings() {
        const User = require("./User.js");

        return {
            owner: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'households.ownerId',
                    to: 'users.id'
                }
            },
            members: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'households.id',
                    through: {
                        from: 'households_users.householdId',
                        to: 'households_users.userId'
                    },
                    to: 'users.id'
                }
            }
        };

    }
}

module.exports = Household;