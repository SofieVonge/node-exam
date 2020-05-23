async function householdMembersList_populate() {
    const response = await fetch("/api/household");

    if (response.status != 200) {
        // err
        return;
    }

    const household = (await response.json()).response;
    $(".household-view .household-name").text(household.name);

    const householdMemberListElement = $(".household-memberslist");
    const householdMemberDOMTemplate = $(".household-memberslist .row")[0];

    // populate household-memberslist with DOM-elements
    household.members.forEach(member => {
        const householdMemberDOMElement = $(householdMemberDOMTemplate).clone();
        
        const bntRemoveMember = householdMemberDOMElement.find(".household-member-btn-remove");

        $(householdMemberDOMElement).find(".household-member-name").text(member.username);
        bntRemoveMember.attr("alt", (bntRemoveMember.attr("alt") + member.username));
        bntRemoveMember.attr("data-username", member.username );
        bntRemoveMember.attr("data-userId", member.id );

        householdMemberListElement.append(householdMemberDOMElement);
    });
}


function householdMemberRemove(src)
{
    const username = $(src).attr("data-username");

    if (!confirm(`Are you sure?\nThis will completely remove the member ${username} from the system.`))
    {
        return false;
    }

    // TODO:
    // fetch api route (del: /api/household/members/{id})


    return true;
}