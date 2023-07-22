$(document).ready(function() {
    // 삭제 버튼 클릭 시 이벤트 처리
    $("#delete-button").on("click", function() {
      // 확인 대화상자 표시
      if (confirm("게시글을 삭제하시겠습니까?")) {
        // 확인을 누르면 서버로 게시글 삭제 요청
        deletePost();
      } else {
        // 취소를 누르면 아무 동작 없음
      }
    });
  });
  
  // 게시글 삭제 요청 함수
  function deletePost() {

    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');
    const name = urlParams.get('name');
    const value = urlParams.get('value');
    
    $.ajax({
      type: "POST", // 또는 "GET" 등 적절한 HTTP 메서드 사용
      url: "/delete", // 삭제를 처리하는 서버 엔드포인트 URL
      data: {
        title: title,
        value: value,
        name: name
      },
      success: function(response) {
        // 삭제 성공 시 알림 표시 후 /main으로 이동
        alert("게시글이 삭제되었습니다.");
        window.location.href = "/main"; // /main 페이지로 이동
      },
      error: function(error) {
        alert("게시글 삭제에 실패하였습니다. 잠시 후 다시 시도해주세요.");
      }
    });
  }
  