const chatMessageDOMTemplate = $("#household-chatwidget .household-chatmessage-container");

let socket;

async function connectHouseholdChat() {
    const tokenResponse = await fetch("/api/webchat/token");
    if (tokenResponse.status === 401) {
        alert("Not Authorized! Please login..");
        return;
    } else if ( tokenResponse.status !== 200) {
        alert("Could not fetch wechat authentication token.");
        return;
    }

    const token = (await tokenResponse.json()).response;


    socket = io.connect("127.0.0.1:3000");
    socket.emit('authenticate', token);

    socket.on('memberMessage', message => onMemberMessage(message));

    $('#household-chatwidget-btn-send').on('click', () => {
        sendMemberMessage();
    });
}

function onMemberMessage(message) {
    //console.log(message);
    let chatMessageDomElement = chatMessageDOMTemplate.clone();

    chatMessageDomElement.find(".household-chatmessage-membername").text(message.memberName);
    chatMessageDomElement.find(".household-chatmessage").text(message.text);

    $('#household-chatwidget #household-chatwidget-chatbox').append(chatMessageDomElement);
    $("#household-chatwidget #household-chatwidget-chatbox").animate({ scrollTop: $('#household-chatwidget #household-chatwidget-chatbox').prop("scrollHeight")}, 200);
}

function sendMemberMessage() {
    const memberName = "placeholder";
    const text = $('#household-chatwidget-chatmessage-text').val();
    $('#household-chatwidget-chatmessage-text').val("");
    socket.emit("memberMessage", { memberName, text });
}

$(document).ready(async () => {
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