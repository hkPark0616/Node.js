// 글자수 체크 및 제한
$(document).ready(function() {
    $('.re-commend-text').on('input', function() {
        var textLength = $(this).val().length;
        $('.re-textCount').html(textLength + " / 100자");

        if (textLength > 100) {
            $(this).val($(this).val().substring(0, 100));
            alert('글자수는 100자까지 입력 가능합니다.');
            $('.re-textCount').html("100 / 100자");
        }
    });
});

// 세션 유무에 따른 답글 textarea 컨트롤
$(document).ready(function(){
    $.ajax({
        url: '/checkSession',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data.sessionExists) {
                // 세션이 있을 경우 아무 작업 필요 없음
                $('.re-commend-text').attr("placeholder", "최대 100자");
            } else {
                // 세션이 없을 경우 로그인 알림 및 textarea에 메시지 출력
                $('.re-commend-text').attr("placeholder", "로그인이 필요합니다.");
                $('.re-commend-text').attr("disabled", "disabled");
            }
        },
        error: function() {
            alert('잠시 후에 다시 시도해주세요.');
        }
    });
});

$(document).ready(function () {
    let offset = 0;
    const limit = 5;
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get('value');

    // loadComments(offset, limit, value);
    // getCommentCount(value); // 댓글 총 개수 업데이트

    $('.re-commend-form').submit(function (event) {
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
                            alert("답글 작성이 완료되었습니다.");
                            $('.re-commend-text').val('');
   
                            // offset = 0; // offset 초기화
                            // refreshComments(offset, limit, value);
                            // getCommentCount(value); // 댓글 총 개수 업데이트     
                            // location.reload();
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

// $(document).ready(function(){
//     let check = false;
//     $(".re-more-div").css("display", "none");
//     $(document).on("click", ".more-recommend", function(event) {
//         if(check === false){
//             let id = $(this).attr("value");
//             loadRecommend(id);
//             check = true;
//         }
//         else{
//             $(".re-commend-div").remove();
//             $(".re-commend").remove();
//             check = false;
//         }

//     });
// });
$(document).ready(function(){
    let openReplyId = null; // 열린 답글의 ID를 저장할 변수

    $(".re-more-div").css("display", "none");

    $(document).on("click", ".more-recommend", function(event) {
        let id = $(this).attr("value");
        
        if (openReplyId === null) {
            // 아무 창도 열려있지 않을 때 해당 답글 창 열기
            loadRecommend(id);
            openReplyId = id;
        } else if (openReplyId === id) {
            // 이미 해당 답글 창이 열려있는 경우, 해당 답글 창 닫기
            $(".re-commend-div").remove();
            $(".re-commend").remove();
            openReplyId = null;
        } else {
            // 다른 답글 창이 열려있는 경우, 열린 창 닫고 새로운 답글 창 열기
            $(".re-commend-div").remove();
            $(".re-commend").remove();
            loadRecommend(id);
            openReplyId = id;
        }
    });
});

// 댓글 불러오기 함수
function loadRecommend(id) {
    let offset = 5;
    const limit = 5;
    // AJAX 요청 보내기
    $.ajax({
        url: `/getRecommend`,
        method: "GET",
        data: {
            offset: offset,
            limit: limit,
            id: id
        },
        success: function (data) {
            // 서버로부터 받아온 댓글 데이터를 처리하고 화면에 추가
            if (data.length > 0) {
        
                var html = '';
                for (let i = 0; i < data.length; i++) {
                    const recomment = data[i];
                    // 각 댓글과 답글을 감싸는 컨테이너 추가
                    html += `
                    <div class="re-commend-div">
                        <hr class="re-commend-hr">
                        <div class="re-commend value="${recomment.recommend_id}">
                            <p><span><div class="icon"></div></span>
                            <span class="re-commend-name">${recomment.recommend_name}</span>
                            <span class="bar">|</span><span class="re-commend-date">${recomment.recommend_date}</span></p>
                            <div class="re-commend-content">${recomment.recommend_content}</div>
                            
                        </div>
                    <div>
                    `;
                    $(`[value="${id}"]`).closest('.recommend').after(html);
                    // 수정된 부분: 해당 div의 바로 아래에 댓글과 답글 컨테이너 추가

                }

                                    
                formhtml = `
                
                <div class="re-commend">
                <hr class="re-commend-hr">
                    <div class="icon"></div>
                    <form id="re-commend-form">
                        <textarea  id="re-commend-text" placeholder="답글 작성하기"></textarea>
                        <input type="submit" value="등록" id="write-re-commend">
                    </form>
                    <p id="re-textCount">0 / 100자</p>
                    
                </div>
                `
                $(`.re-commend-div`).after(formhtml);



                $(".re-more-div").css("display", "block");

                // offset 값을 증가시켜 다음 데이터를 가져오도록 설정
                offset += limit;

                // 댓글이 limit보다 적은 경우, "더보기" 버튼 비활성화 처리
                if (data.length < limit) {
                    $(".re-more-div").css("display", "none");
                    $(".recommend-div").css("padding-bottom", "50px");
                }
            } else {
                // 가져올 댓글이 더 이상 없는 경우, "더보기" 버튼 비활성화 처리
                $(".re-more-div").css("display", "none");
                formhtml = `
                <div class="re-commend">
                <hr class="re-commend-hr">
                    <div class="icon"></div>
                    <form id="re-commend-form">
                        <textarea  id="re-commend-text" placeholder="답글 작성하기"></textarea>
                        <input type="submit" value="등록" id="write-re-commend">
                    </form>
                    <p id="re-textCount">0 / 100자</p>
                    
                </div>
                `
          $(`[value="${id}"]`).closest('.recommend').after(formhtml);
            }
            console.log(offset);
        },
        error: function (error) {
            console.error("답글 데이터를 가져오는데 실패했습니다:", error);
        }
    });
}

