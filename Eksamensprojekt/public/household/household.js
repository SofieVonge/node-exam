async function fetchHousehold() {
    const response = await fetch("/api/househould");
    if (response.status != 200) {
        // err
        return;
    }

    const household = (await response.json()).response;

    // populate household-memberslist with DOM-elements

}


function householdMemberRemove() {
    return Exception("401 - Not yet implemented");
    // TODO:
    // fetch api route (del: /api/household/members/{id})
}