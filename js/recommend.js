$(document).ready(function (){
    var button = $(".more-recommend");
    $('.re-commend-div').hide();
    let check = false;
    button.on("click", function (event) {

        if(check){
            $('.re-commend-div').hide();
            check = false;
        }
        else{
            $('.re-commend-div').show();
            check = true;
        }
    });
});