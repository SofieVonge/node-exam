const chatMessageDOMTemplate = $("#household-chatwidget .household-chatmessage-container");

let socket;
let token;
let chatMessages = [];

function saveMessageLocally(message) {
    chatMessages.push(message);
    Cookies.set(`chatMessages_${token}`, JSON.stringify(chatMessages));
}

function loadMessagesLocally() {
    const chatMessagesLoaded = Cookies.get(`chatMessages_${token}`);
    if (typeof chatMessagesLoaded !== "undefined") {
        chatMessages = JSON.parse(chatMessagesLoaded);

        chatMessages.forEach(message => onMemberMessage(message, false));
    }
}

async function connectHouseholdChat() {
    const tokenResponse = await fetch("/api/webchat/token");
    if (tokenResponse.status === 401) {
        alert("Not Authorized! Please login..");
        return;
    } else if ( tokenResponse.status !== 200) {
        alert("Could not fetch wechat authentication token.");
        return;
    }

    token = (await tokenResponse.json()).response;

    socket = io.connect("127.0.0.1:3000");
    socket.emit("authenticate", token);

    socket.on("memberMessage", message => onMemberMessage(message, true));

    socket.on("-users", (userArr) => onUserList(userArr));

    $("#household-chatwidget-btn-send").on("click", () => {
        sendMemberMessage();
    });
}

function onMemberMessage(message, saveLocally) {

    if (saveLocally) {
        saveMessageLocally(message);
    }
    
    let chatMessageDomElement = chatMessageDOMTemplate.clone();

    chatMessageDomElement.find(".household-chatmessage-membername").text(message.memberName);
    chatMessageDomElement.find(".household-chatmessage").text(message.text);

    $('#household-chatwidget #household-chatwidget-chatbox').append(chatMessageDomElement);
    $("#household-chatwidget #household-chatwidget-chatbox").animate({ scrollTop: $('#household-chatwidget #household-chatwidget-chatbox').prop("scrollHeight")}, 200);
}

function onUserList(userArr) {
    
    const message = { memberName: `** Users online ${userArr.length} **`, text: "" }
    if (userArr.length > 0) {
        message.text += userArr[0];
        userArr.shift();

        userArr.forEach(user => {
            message.text += `, ${user}`;
        });
    }

    onMemberMessage(message, true);
}

function sendMemberMessage() {
    const memberName = "placeholder";
    const text = $('#household-chatwidget-chatmessage-text').val();
    $('#household-chatwidget-chatmessage-text').val("");

    switch (text) {
        case "-users":
            socket.emit("users", { memberName, text });
            break;
        default:
            socket.emit("memberMessage", { memberName, text });
            break;
    }
}

$(document).ready(async () => {
    loadMessagesLocally();
    await connectHouseholdChat();

    if(Cookies.get("householdChatWidgetClosed") == 1)
    {
        $("#household-chatwidget").addClass("closed");
    } else {
        $("#household-chatwidget").removeClass("closed");
    }

    

    $("#webchat-widget-toggle-display").on("click", () => {
        $("#household-chatwidget").toggleClass("closed");
        
        if(Cookies.get("householdChatWidgetClosed") == 0)
        {
            Cookies.set("householdChatWidgetClosed", 1);
        } else {
            Cookies.set("householdChatWidgetClosed", 0);
        }
    });
});