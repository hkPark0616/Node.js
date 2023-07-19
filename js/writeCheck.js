$(document).ready(function () {
    $('#writeButton').click(function (event) {
        event.preventDefault();

        var url = $(this).attr('href');

        // 세션 여부 확인 후 페이지 이동
        $.ajax({
            type: 'GET',
            url: '/checkSession',
            dataType: 'json',
            success: function (data) {
                if (data.sessionExists) {
                    window.location.href = url;
                } else {
                    alert('로그인 후 이용 가능합니다.');
                }
            },
            error: function (xhr, status, error) {
                console.error(error);
            }
        });
    });
});