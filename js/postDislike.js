$(document).ready(function() {

  loadDislikes();
  checkDislikes();

  $(".bad").on("click", function() {
      $.ajax({
          url: '/checkSession',
          type: 'GET',
          dataType: 'json',
          success: function(data) {
              if (data.sessionExists) {
                  // 세션이 있을 경우
                  Dislikes();
                  loadDislikes();
                  checkDislikes();

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
function loadDislikes() {

  const urlParams = new URLSearchParams(window.location.search);
  const title = urlParams.get('title');
  const user = urlParams.get('name');
  const value = urlParams.get('value');

  $.ajax({
      type: "POST",
      url: "/loadDislikes",
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

// 좋아요 버튼 동작
function Dislikes(){
  const urlParams = new URLSearchParams(window.location.search);
  const user = urlParams.get('name');
  const value = urlParams.get('value');
  const title = urlParams.get('title');


  $.ajax({
      type: "POST",
      url: "/Dislikes",
      data: {
          value: value,
          user: user,
          title : title
      },
      success: function(data) {
          alert(data);
          loadDislikes();
          checkDislikes();

      },
      error: function(error) {
          alert("잠시 후 다시 시도해주세요.");
      }
  });
}


// 좋아요 유무에 따른 버튼 변화
function checkDislikes() {
  const urlParams = new URLSearchParams(window.location.search);
  const user = urlParams.get('name');
  const value = urlParams.get('value');
  $.ajax({
      url: '/checkDislikes',
      type: 'POST',
      data: {
          value: value,
          user: user
      },
      success: function(data) {
          console.log(data);
          if (data) {
                $(".bad_img").attr("src", "../dislikeblue.png");
            } else {
                $(".bad_img").attr("src", "../dislike.png");
            }

      },
      error: function() {
          alert('잠시 후에 다시 시도해주세요.');
      }
  });
}