const { Model } = require("objection");

const User = require("./User.js");

class ChatAuthentication extends Model {
    static tableName = "chat_authentications";

    static get idColumn() {
        return 'user_id';
      }

    static relationMappings = {

        user: {
            relation: Model.HasOneRelation,
            modelClass: User,
            join: {
                from: "chat_authentications.userId",
                to: "users.id"
            }
        },
    }
}

module.exports = ChatAuthentication;