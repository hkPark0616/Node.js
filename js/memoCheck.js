$(document).ready(function () {
    let updateButton = $("#update-button");
    let deleteButton = $("#delete-button");

    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get('name');

    $.ajax({
        type: 'GET',
        url: '/checkMemoSession',
        data: { name: userName },
        dataType: 'json',
        success: function (data) {
            if (data.sessionCompare) {
                updateButton.css("visibility", "visible");
                deleteButton.css("visibility", "visible");
                
            } else {
                updateButton.css("visibility", "hidden");
                deleteButton.css("visibility", "hidden");
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

});