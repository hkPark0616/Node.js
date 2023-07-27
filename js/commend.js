$(document).ready(function () {
    let offset = 0;
    const limit = 5;
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get('value');

    loadComments(offset, limit, value);
    getCommentCount(value); // 댓글 총 개수 업데이트

    $('#write-commend').submit(function (event) {
        event.preventDefault();
        var formData = $(this).serialize();
        $.ajax({
            type: 'GET',
            url: '/checkSession',
            dataType: 'json',
            success: function (data) {
                if (data.sessionExists) {
                    $.ajax({
                        type: 'GET',
                        url: `/commend/?value=${value}`,
                        data: formData,
                        success: function (data) {
                            alert("댓글 작성이 완료되었습니다.");
                            $('#textBox').val('');
                            $("#textCount").text('0 / 100자');
                            offset = 0; // offset 초기화
                            refreshComments(offset, limit, value);
                            getCommentCount(value); // 댓글 총 개수 업데이트
                            location.reload();
                        },
                        error: function (xhr, status, error) {
                            var errorMessage = xhr.responseJSON.message;
                            alert(errorMessage);
                        }
                    });

                } else {
                    alert('로그인 후 이용 가능합니다.');
                }
            },
            error: function (xhr, status, error) {
                var errorMessage = xhr.responseJSON.message;
                alert(errorMessage);
            }
        });
    });

});

function refreshComments(offset, limit, value) {
    $(".recommend-div").empty(); // 기존 댓글 초기화
    loadComments(offset, limit, value);
}

$(document).ready(function () {
    let offset = 5;
    const limit = 5;
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get('value');

    $(".more-div").css("display", "block");
    //$(".recommend-div").empty(); // 기존 댓글 초기화

    // "더보기" 버튼 클릭 이벤트 처리
    $(".more-div").on("click", function (event) {
        
        event.preventDefault(); // 기본 동작 막기
        loadMoreComments();
        
    });

    // 댓글 불러오기 함수
    function loadMoreComments() {
        // AJAX 요청 보내기
        $.ajax({
            url: "/getCommend",
            method: "GET",
            data: {
                value: value,
                offset: offset,
                limit: limit
            },
            success: function (data) {
                // 서버로부터 받아온 댓글 데이터를 처리하고 화면에 추가
                if (data.length > 0) {
                    var html = '';
                    for (let i = 0; i < data.length; i++) {
                        const comment = data[i];
                        
                        html += `
                            <div class="recommend" value="${comment.commend_id}">
                            <p><span class="recommend-name">${comment.commend_name}</span><span class="bar">|</span><span class="recommend-date">${comment.commend_date}</span></p>
                            <p class="recommend-content">${comment.commend_content}</p>
                            <a class="more-recommend" value="${comment.commend_id}">답글</a>
                            </div>`;
                            
                        if (i !== data.length) {
                            html += "<hr>";
                        }
                    }
                    $(".recommend-div").append(html);

                    // offset 값을 증가시켜 다음 데이터를 가져오도록 설정
                    offset += limit;

                    // 댓글이 limit보다 적은 경우, "더보기" 버튼 비활성화 처리
                    if (data.length < limit) {
                        $(".more-div").css("display", "none");
                        $(".recommend-div").css("padding-bottom", "50px");
                    }
                } else {
                    // 가져올 댓글이 더 이상 없는 경우, "더보기" 버튼 비활성화 처리
                    $(".more-div").css("display", "none");
                    $(".recommend-div").css("padding-bottom", "50px");
                }
                console.log(offset);
            },
            error: function (error) {
                console.error("댓글 데이터를 가져오는데 실패했습니다:", error);
            }
        });
    }
});

// 댓글 더보기 함수
function loadComments(offset, limit, value) {
    // AJAX 요청 보내기
    $.ajax({
        url: "/getCommend",
        method: "GET",
        data: {
            value: value,
            offset: offset,
            limit: limit
        },
        success: function (data) {
            // 서버로부터 받아온 댓글 데이터를 처리하고 화면에 추가
            if (data.length > 0) {
                var html = '';
                for (let i = 0; i < data.length; i++) {
                    const comment = data[i];
                    html += `
                        <div class="recommend" value="${comment.commend_id}">
                        <p><span class="recommend-name">${comment.commend_name}</span><span class="bar">|</span><span class="recommend-date">${comment.commend_date}</span></p>
                        <p class="recommend-content">${comment.commend_content}</p>
                        <a class="more-recommend" value="${comment.commend_id}">답글</a>
                        </div>`;

                    if (i !== data.length) {
                        html += "<hr>";
                    }
                }
                $(".recommend-div").append(html);

                // offset 값을 증가시켜 다음 데이터를 가져오도록 설정
                offset += limit;

                // 댓글이 limit보다 적은 경우, "더보기" 버튼 비활성화 처리
                if (data.length < limit) {
                    $(".more-div").css("display", "none");
                    $(".recommend-div").css("padding-bottom", "50px");
                }
            } else {
                // 가져올 댓글이 더 이상 없는 경우, "더보기" 버튼 비활성화 처리
                $(".more-div").css("display", "none");
                $(".recommend-div").css("padding-bottom", "50px");
            }
        },
        error: function (error) {
            console.error("댓글 데이터를 가져오는데 실패했습니다:", error);
        }
    });
}

// 댓글 총 개수 가져오는 함수
function getCommentCount(value) {
    $.ajax({
        type: 'GET',
        url: `/getCommentCount`,
        data: {
            value: value
        },
        success: function (data) {
            $(".cnt").text(" (" + data[0].count + ")");
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.responseJSON.message;
            alert(errorMessage);
        }
    });
}


