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

        const household = households.get(user.household.id);

        socket.join(user.household.id);        

        const welcomeMessage = { memberName: "** SERVER MESSAGE **", text: `${user.username} joined the chat. users active: ${households.get(user.household.id).members.size}`};

        if (household.members.get(user.id).connections.size < 2) {
            ioServer.to(user.household.id).emit("memberMessage", welcomeMessage);
        } else {
            socket.emit("memberMessage", welcomeMessage);
        }

        households.get(user.household.id).messages.forEach(message => {
            socket.emit("memberMessage", message);
        });

    } catch (err) {
        console.log("Error authenticating User.", err);
    }
}


function onMemberMessage(socket, message) {
    // TODO:
    // broadcast message to the correct household
    const user = chatClients.get(socket.id).user;
    message.memberName = user.username;

    pushMessage(socket, message);
    ioServer.to(user.household.id).emit('memberMessage', message);
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

                socket.leave(household.id);
                chatClients.delete(socket.id);
                connections.delete(socket.id);
 
                if (connections.size == 0) {
                    household.members.delete(user.id);
                    io.to(household.id).emit('memberMessage', {memberName: "** SERVER MESSAGE **", text: `${user.username} left the chat. users active: ${household.members.size}`});
                }

                if (household.members.size == 0) {
                    households.delete(household.id);
                }
            });

            socket.on("authenticate", token => onAuthenticateMember(socket, token));

            // bind usermessage
            socket.on("memberMessage", message => onMemberMessage(socket, message));
        });
    }
}