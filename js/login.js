$(document).ready(function() {
    $('#loginform').submit(function(event) {
      event.preventDefault();
      var formData = $(this).serialize();
      $.ajax({
        type: 'POST',
        url: '/login',
        data: formData,
        success: function(data) {
          // 로그인 성공 시, 이후 처리 로직
          window.location.href = '/';
        },
        error: function(xhr, status, error) {
          var errorMessage = xhr.responseJSON.message;
          alert(errorMessage);
        }
      });
    });
  });
  