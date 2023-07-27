// 답글 글자수 체크 및 제한
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


// 답글 작성 버튼 동작
$(document).ready(function () {
    let offset = 0;
    const limit = 5;
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get('value');

    // loadComments(offset, limit, value);
    // getCommentCount(value); // 댓글 총 개수 업데이트

    $(document).on("submit", "#re-commend-form", function (event) {

        const recommendElement = event.target.closest(".recommend");
        const commend_id = recommendElement.getAttribute("value");

        event.preventDefault();
        
        var formData = $(this).serialize();
        formData += "&id=" + commend_id;
        $.ajax({
            type: 'GET',
            url: '/checkSession',
            dataType: 'json',
            success: function (data) {
                if (data.sessionExists) {
                    $.ajax({
                        type: 'GET',
                        url: '/writeRecommend',
                        data: formData,
                        success: function (data) {
                            alert("답글 작성이 완료되었습니다.");
                            $('#re-commend-text').val('');
                            $("#re-textCount").text('0 / 100자');
                            $(".re-commend").remove();
                            $(".re-commend-div").remove();
                            $(".re-commend-form-div").remove();
                            //$(".re-more-div").remove();
                            loadRecommend(commend_id, offset, limit);
                            $(".re-more-div").remove();
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


// 답글 버튼 동작
$(document).ready(function(){
    let openReplyId = null; // 열린 답글의 ID를 저장할 변수

    $(".re-more-div").css("display", "none");

    $(document).on("click", ".more-recommend", function(event) {
        let id = $(this).attr("value");
        
        
        if (openReplyId === null) {
            // 아무 창도 열려있지 않을 때 해당 답글 창 열기
            let offset = 0;
            const limit = 5;
            loadRecommend(id, offset, limit);
            $(`[value="${id}"]`).closest('.recommend').css("height", "fit-content");
            openReplyId = id;   
            setReplyTextarea();        
        } else if (openReplyId === id) {
            // 이미 해당 답글 창이 열려있는 경우, 해당 답글 창 닫기
            $(".re-commend-div").remove();
            $(".re-commend-form-div").remove();
            $(".re-commend").remove();
            $(".re-more-div").remove();
            $(".recommend").css("height", "120px");
            openReplyId = null;
        } else {
            // 다른 답글 창이 열려있는 경우, 열린 창 닫고 새로운 답글 창 열기
            $(".re-commend-div").remove();
            $(".re-commend-form-div").remove();
            $(".re-commend").remove();
            $(".re-more-div").remove();
            $(".recommend").css("height", "120px");
            $(`[value="${id}"]`).closest('.recommend').css("height", "fit-content");
            let offset = 0;
            const limit = 5;
            loadRecommend(id, offset, limit);
            setReplyTextarea(); 
            openReplyId = id;
        }


        setReplyTextarea();
    });
});

// 댓글 불러오기 함수
function loadRecommend(id, offset, limit) {
    // let offset = offset;
    // const limit = limit;
    // AJAX 요청 보내기
    $.ajax({
        url: `/getRecommend`,
        method: "GET",
        data: {
            id: id,
            offset : offset,
            limit : limit
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
                    
                        <div class="re-commend value="${recomment.recommend_id}">
                            <p><span><div class="icon"></div></span></p>
                            <span class="re-commend-name">${recomment.recommend_name}</span>
                            <span class="bar">|</span><span class="re-commend-date">${recomment.recommend_date}</span></p>
                            <div class="re-commend-content">${recomment.recommend_content}</div>    
                        </div>
                        
                    <div>
                    `;
                    $(`[value="${id}"]`).closest('.recommend').append(html);
                    html = '';
                    // 수정된 부분: 해당 div의 바로 아래에 댓글과 답글 컨테이너 추가

                }

                                    
                formhtml = `
                
                <div class="re-commend-form-div">
                    <p><span><div class="icon"></div></span></p>
                    <form id="re-commend-form" method="POST">
                        <textarea  id="re-commend-text" name="recommendtext" placeholder="답글 작성하기"></textarea>
                        <input type="submit" value="등록" id="write-re-commend">
                    </form>
                    <p id="re-textCount">0 / 100자</p>
                    
                </div>
                `
                $(`[value="${id}"]`).closest('.recommend').append(formhtml);
                // $(`.re-commend-div`).append(formhtml);

                moreForm = `
                    <div class="re-more-div">
                    <a class="re-more">답글 더보기 ▼</a>
                    </div>
                `;

                $(`[value="${id}"]`).closest('.recommend').append(moreForm);

                // // offset 값을 증가시켜 다음 데이터를 가져오도록 설정
                 offset += limit;

                // 댓글이 limit보다 적은 경우, "더보기" 버튼 비활성화 처리
                if (data.length < limit) {
                    $(".re-more-div").css("display", "none");
    
                }
            } else {
                // 가져올 댓글이 더 이상 없는 경우, "더보기" 버튼 비활성화 처리
                $(".re-more-div").css("display", "none");
                formhtml = `
                <div class="re-commend-form-div">
                    <p><span><div class="icon"></div></span></p>
                    <form id="re-commend-form" method="POST">
                        <textarea  id="re-commend-text" name="recommendtext" placeholder="답글 작성하기"></textarea>
                        <input type="submit" value="등록" id="write-re-commend">
                    </form>
                    <p id="re-textCount">0 / 100자</p>
                    
                </div>
                `
                $(`[value="${id}"]`).closest('.recommend').append(formhtml);
            }
            console.log(offset);
        },
        error: function (error) {
            console.error("답글 데이터를 가져오는데 실패했습니다:", error);
        }
    });
}

// 세션 유무에 따른 답글 답글 작성 form 컨트롤 함수
function setReplyTextarea() {
    $.ajax({
        url: '/checkSession',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
        if (data.sessionExists) {
            // 세션이 있을 경우 아무 작업 필요 없음
            $('#re-commend-text').attr("placeholder", "최대 100자");
            $('#re-commend-text').removeAttr("disabled");
        } else {
            // 세션이 없을 경우 로그인 알림 및 textarea에 메시지 출력
            $('#re-commend-text').attr("placeholder", "로그인이 필요합니다.");
            $('#re-commend-text').attr("disabled", "disabled");
        }
        },
        error: function () {
        alert('잠시 후에 다시 시도해주세요.');
        }
    });
}

// 답글 더보기 버튼 동작
$(document).ready(function () {
    let offset = 5;
    const limit = 5;

    $(".re-more-div").css("display", "block");

    // "답글 더보기" 버튼 클릭 이벤트 처리
    $(document).on("click", ".re-more-div", function (event) { 
        const recommendElement = event.target.closest(".recommend");
        const commend_id = recommendElement.getAttribute("value");
        event.preventDefault(); // 기본 동작 막기
        $(".re-commend-form-div").remove();
        $(".re-more-div").remove();
        loadMoreRecomments(commend_id);
        setReplyTextarea();     
    });

    // 추가 답글 불러오기 함수
    function loadMoreRecomments(commend_id) {
        // AJAX 요청 보내기
        $.ajax({
            url: "/getRecommend",
            method: "GET",
            data: {
                offset: offset,
                limit: limit,
                id:commend_id
            },
            success: function (data) {
                // 서버로부터 받아온 댓글 데이터를 처리하고 화면에 추가
                if (data.length > 0) {
                    var html = '';
                    for (let i = 0; i < data.length; i++) {
                        const recomment = data[i];
                        
                        html += `
                        <div class="re-commend-div">
                    
                            <div class="re-commend value="${recomment.recommend_id}">
                                <p><span><div class="icon"></div></span></p>
                                <span class="re-commend-name">${recomment.recommend_name}</span>
                                <span class="bar">|</span><span class="re-commend-date">${recomment.recommend_date}</span></p>
                                <div class="re-commend-content">${recomment.recommend_content}</div>    
                            </div>
                        
                        <div>`;

                        $(`[value="${commend_id}"]`).closest('.recommend').append(html);
                        html = '';
                        
                    }

                    formhtml = `
                
                    <div class="re-commend-form-div">
                        <p><span><div class="icon"></div></span></p>
                        <form id="re-commend-form" method="POST">
                            <textarea  id="re-commend-text" name="recommendtext" placeholder="답글 작성하기"></textarea>
                            <input type="submit" value="등록" id="write-re-commend">
                        </form>
                        <p id="re-textCount">0 / 100자</p>
                        
                    </div>
                    `
                    $(`[value="${commend_id}"]`).closest('.recommend').append(formhtml);

                    moreForm = `
                    <div class="re-more-div">
                        <a class="re-more">답글 더보기 ▼</a>
                    </div>
                    `;

                    $(`[value="${commend_id}"]`).closest('.recommend').append(moreForm);

                    // offset 값을 증가시켜 다음 데이터를 가져오도록 설정
                    offset += limit;
                    
                    // 댓글이 limit보다 적은 경우, "더보기" 버튼 비활성화 처리
                    if (data.length < limit) {
                        $(".re-more-div").css("display", "none");
                        $(".recommend-div").css("padding-bottom", "50px");
                        setReplyTextarea();
                    }
                } else {
                    // 가져올 댓글이 더 이상 없는 경우, "더보기" 버튼 비활성화 처리
                    $(".re-more-div").css("display", "none");
                    formhtml = `
                    <div class="re-commend-form-div">
                        <p><span><div class="icon"></div></span></p>
                        <form id="re-commend-form" method="POST">
                            <textarea  id="re-commend-text" name="recommendtext" placeholder="답글 작성하기"></textarea>
                            <input type="submit" value="등록" id="write-re-commend">
                        </form>
                        <p id="re-textCount">0 / 100자</p>
                        
                    </div>
                    `
                    $(`[value="${commend_id}"]`).closest('.recommend').append(formhtml);
                
                }
                setReplyTextarea();
                console.log(offset);
            },
            error: function (error) {
                console.error("댓글 데이터를 가져오는데 실패했습니다:", error);
            }
        });
    }
});