$(document).ready(function() {
    updateComments();
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get('value');
    $('#write-commend').submit(function(event) {
      event.preventDefault();
      var formData = $(this).serialize();
      $.ajax({
        type: 'GET',
        url: '/checkSession',
        dataType: 'json',
        success: function(data) {
            if (data.sessionExists) {
                $.ajax({
                    type: 'POST',
                    url: `/commend/?value=${value}`,
                    data: formData,
                    success: function(data) {
                        alert("댓글 작성이 완료되었습니다.");
                        $('#textBox').val('');
                        $("#textCount").text('0 / 100자');
                        updateComments();
                    },
                    error: function(xhr, status, error) {
                      var errorMessage = xhr.responseJSON.message;
                      alert("잠시 후에 다시 시도해주세요.");
                    }
                  });
                
            } else {
                alert('로그인 후 이용 가능합니다.');
            }
        },
        error: function(xhr, status, error) {
          var errorMessage = xhr.responseJSON.message;
          alert(errorMessage);
        }
      });
    });
  });

  function updateComments() {

    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get('value');

    $.ajax({
      type: 'GET',
      url: `/getCommend?value=${value}`, // 서버에서 댓글 목록을 가져오는 API 엔드포인트
      dataType: 'json',
      success: function(data) {
        // 댓글 목록을 가져와서 화면에 추가
        var html = '';
        var cnt = data.length;
        $(".cnt").text(cnt);
        for (let i = 0; i < data.length; i++) {
            const comment = data[i];
            html += `
              <div class="recommend">
                <p><span class="recommend-name">${comment.commend_name}</span><span class="bar">|</span><span class="recommend-date">${comment.commend_date}</span></p>
                <p class="recommend-content">${comment.commend_content}</p>
                <a href="#" class="more-recommend">답글</a>
              </div>
            `;
    
            if (i !== data.length - 1) {
              html += "<hr>";
            }
          }
        $(".recommend-div").html(html);
      },
      error: function(xhr, status, error) {
        var errorMessage = xhr.responseJSON.message;
        alert(errorMessage);
      }
    });
  }

  

