$(document).ready(function () {
    let updateButton = $("#update-button");
    let deleteButton = $("#delete-button");
    let box = $(".update-delete");

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
                //box.css("display", "block");

                
            } else {
                updateButton.css("visibility", "hidden");
                deleteButton.css("visibility", "hidden");
                //box.css("display", "none");

            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

});

// 글자수 체크 및 제한
$(document).ready(function() {
    $('#textBox').on('input', function() {
        var textLength = $(this).val().length;
        $('#textCount').html(textLength + " / 100자");

        if (textLength > 100) {
            $(this).val($(this).val().substring(0, 100));
            alert('글자수는 100자까지 입력 가능합니다.');
            $('#textCount').html("100 / 100자");
        }
    });
});

// 글자수 체크 및 제한
$(document).ready(function() {
    $(document).on('input', '#re-commend-text', function() {
        var textLength = $(this).val().length;
        $('#re-textCount').html(textLength + " / 100자");

        if (textLength > 100) {
            $(this).val($(this).val().substring(0, 100));
            alert('글자수는 100자까지 입력 가능합니다.');
            $('#re-textCount').html("100 / 100자");
        }
    });
});

// 세션 유무에 따른 textarea 컨트롤
$(document).ready(function(){
    $.ajax({
        url: '/checkSession',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data.sessionExists) {
                // 세션이 있을 경우 아무 작업 필요 없음
                $('#textBox').attr("placeholder", "최대 100자");
            } else {
                // 세션이 없을 경우 로그인 알림 및 textarea에 메시지 출력
                $('#textBox').attr("placeholder", "로그인이 필요합니다.");
                $('#textBox').attr("disabled", "disabled");
            }
        },
        error: function() {
            alert('잠시 후에 다시 시도해주세요.');
        }
    });
});

