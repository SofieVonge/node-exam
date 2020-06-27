const User = require("../../models/User.js");
const ChatAuthentication = require("../../models/ChatAuthentication.js");

const chatClients = new Map();
const households = new Map();

function addHouseholdIfDoesntExit(household) {
    if (!households.has(household.id)) {
        households.set(household.id, { ...household, members: new Map(), messages: [] });
    }
}

function addMemberToHousehold(socket, member) {
    const household = households.get(member.household.id);

    if (!household.members.has(member.id))
    {
        household.members.set(member.id, { ...member, connections: new Map([[socket.id, socket]]) });
    } else {
        household.members.get(member.id).connections.set(socket.id, socket);
    }

    
}

function pushMessage(socket, message) {
    const household = households.get(chatClients.get(socket.id).user.household.id);

    if (household.messages.length > 9) {
        household.messages.shift();
    }
    
    household.messages.push(message);
}

async function onAuthenticateMember(socket, token) {
    try {
        const userId = (await ChatAuthentication.query().first().where({ key: token })).userId;
        const user = await User.query().withGraphFetched("household").findById(userId);
        delete user.password;

        chatClients.set(socket.id, { socket, user });

        addHouseholdIfDoesntExit(user.household);
        addMemberToHousehold(socket, user, user.household.id);

        // joining the room with the name of user.household.id
        socket.join(user.household.id);        

        households.get(user.household.id).messages.forEach(message => {
            socket.emit("memberMessage", message);
        });

    } catch (err) {
        console.log("Error authenticating User.", err);
    }
}


function onMemberMessage(socket, message) {
    try {
        // TODO:
        // broadcast message to the correct household
        const user = chatClients.get(socket.id).user;
        message.memberName = user.username;

        pushMessage(socket, message);
        // emitting a memberMessage to a specific room (user.household.id)
        ioServer.to(user.household.id).emit("memberMessage", message);
    } catch (err) {
        console.log("Error sending MemberMessage.", err);
    }
}

function onUserListRequest(socket) {
    try {
        const user = chatClients.get(socket.id).user;
        const household = households.get(user.household.id);
        const usersOnline = [];

        household.members.forEach((householdUser, key) => { usersOnline.push(householdUser.username); });

        socket.emit("-users", usersOnline);
    } catch (err) {
        console.log("Error sending userlist.", err);
    }
}

let ioServer;
module.exports = {
    run: (io) => {
        ioServer = io;
        io.on("connection", socket => {

            socket.on('disconnect', () => {
                if (!chatClients.has(socket.id)) { return; }

                const user = chatClients.get(socket.id).user;
                const household = households.get(user.household.id);
                const connections = household.members.get(user.id).connections;

                // leave room
                socket.leave(household.id);
                // remove ChatClient from chatClients map
                // (it's not a user but a connection)
                chatClients.delete(socket.id);
                // remove connection from the member in a household
                connections.delete(socket.id);

                // if the user has no more active connections
                if (connections.size == 0) {
                    // remove user from household
                    household.members.delete(user.id);
                }

                // if the household has no more active members
                /*if (household.members.size == 0) {
                    // remove household from households map
                    households.delete(household.id);
                }*/
            });

            socket.on("authenticate", token => onAuthenticateMember(socket, token));

            // bind usermessage
            socket.on("memberMessage", message => onMemberMessage(socket, message));

            socket.on("users", () => onUserListRequest(socket));
        });
    }
}