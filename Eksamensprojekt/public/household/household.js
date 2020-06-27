async function populateHouseholdViewData() {
    const response = await fetch("/api/user/current");

    if (response.status != 200) {
        // err
        return;
    }

    const user = (await response.json()).response;    


    if (user.id == user.household.ownerId) {
        $(".household-members-btn-new").css("display", "inline");
    }

    $(".household-view .household-name").text(user.household.name);


    const householdMemberListElement = $(".household-memberslist");
    const householdMemberDOMTemplate = $(".household-memberslist tbody tr:first");

    // populate household-memberslist with DOM-elements
    user.household.members.forEach(member => {
        const householdMemberDOMElement = $(householdMemberDOMTemplate).clone();
        
        const bntRemoveMember = householdMemberDOMElement.find(".household-member-btn-remove");
        $(householdMemberDOMElement).find(".household-member-name").text(member.username);

        if (user.id == user.household.ownerId) {
            bntRemoveMember.attr("alt", (bntRemoveMember.attr("alt") + member.username));
            bntRemoveMember.attr("data-username", member.username );
            bntRemoveMember.attr("data-userId", member.id );
        } else {
            bntRemoveMember.parent().css("display", "none");
        }

        householdMemberListElement.append(householdMemberDOMElement);
    });
}


async function householdMemberRemove(src)
{
    const username = $(src).attr("data-username");

    if (!confirm(`Are you sure?\nThis will completely remove the member ${username} from the system.`))
    {
        return false;
    } 
    const id = $(src).attr("data-userId");

    const deleteResponse = await fetch(`/api/household/member/${id}`, {
        method: "delete",
        headers: {
            "Content-Type": "application/json"
            },
    });

    const data = await deleteResponse.json();

    if (deleteResponse.status === 201) {
        window.location.reload();
        return true;
    }


    return false;
}