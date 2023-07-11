
$(document).ready(function() {
    $('#signupForm').submit(function(event) {
      event.preventDefault();
      var formData = $(this).serialize();
      $.ajax({
        type: 'POST',
        url: '/sign',
        data: formData,
        success: function(data) {
          // 회원가입 성공 시, 이후 처리 로직
          window.location.href = '/login';
        },
        error: function(xhr, status, error) {
          var errorMessage = xhr.responseJSON.message;
          alert(errorMessage);
        }
      });
    });
  });