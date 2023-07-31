$(document).ready(function() {

    loadLikes();
    checkLikes();

    $(".good").on("click", function() {
        $.ajax({
            url: '/checkSession',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.sessionExists) {
                    // 세션이 있을 경우
                    Likes();
                    loadLikes();
                    checkLikes();

                } else {
                    // 세션이 없을 경우 로그인 알림
                    alert("로그인 후 이용가능합니다.");
                }
            },
            error: function() {
                alert('잠시 후에 다시 시도해주세요.');
            }
        });
      
      
    });
});
  
// 좋아요 개수 불러오는 함수
function loadLikes() {

    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');
    const user = urlParams.get('name');
    const value = urlParams.get('value');

    $.ajax({
        type: "POST",
        url: "/loadLikes",
        data: {
            title: title,
            value: value,
            user: user
        },
        success: function(data) {
            if(data[0].count === 0){
                $(".like_cnt").text("0");
            }else{
                $(".like_cnt").text(data[0].count);
            }
        },
        error: function(error) {
            alert("잠시 후 다시 시도해주세요.");
        }
    });
}

// 좋아요 버튼 동작
function Likes(){
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('name');
    const value = urlParams.get('value');
    const title = urlParams.get('title');


    $.ajax({
        type: "POST",
        url: "/Likes",
        data: {
            value: value,
            user: user,
            title : title
        },
        success: function(data) {
            alert(data);
            loadLikes();
            checkLikes();

        },
        error: function(error) {
            alert("잠시 후 다시 시도해주세요.");
        }
    });
}


// 좋아요 유무에 따른 버튼 변화
function checkLikes() {
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('name');
    const value = urlParams.get('value');
    $.ajax({
        url: '/checkLikes',
        type: 'POST',
        data: {
            value: value,
            user: user
        },
        success: function(data) {
            console.log(data);
            if (data) {
                $(".good_img").attr("src", "../likegreen.png");
              } else {
                $(".good_img").attr("src", "../like.png");
              }

        },
        error: function() {
            alert('잠시 후에 다시 시도해주세요.');
        }
    });
}