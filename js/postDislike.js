$(document).ready(function() {

    loadDisLikes();

    $(".bad").on("click", function() {
        $.ajax({
            url: '/checkSession',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.sessionExists) {
                    // 세션이 있을 경우 아무 작업 필요 없음
                    alert("싫어요!");
                    loadDisLikes();

                } else {
                    // 세션이 없을 경우 로그인 알림
                    alert("로그인 후 이용가능합니다.");
                }
            },
            error: function(data) {
                alert(data);
            }
        });
      
      
    });
  });
  
  // 좋아요 개수 불러오는 함수
  function loadDisLikes() {

    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');
    const user = urlParams.get('name');
    const value = urlParams.get('value');
    
    $.ajax({
      type: "POST", // 또는 "GET" 등 적절한 HTTP 메서드 사용
      url: "/loadDisLikes", // 삭제를 처리하는 서버 엔드포인트 URL
      data: {
        title: title,
        value: value,
        user: user
      },
      success: function(data) {
        if(data[0].count === 0){
            $(".dislike_cnt").text("0");
        }else{
            $(".dislike_cnt").text(data[0].count);
        }
      },
      error: function(error) {
        alert("잠시 후 다시 시도해주세요.");
      }
    });
  }

  