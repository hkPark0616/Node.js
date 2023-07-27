$(document).ready(function() {
    const previousUrl = document.referrer;
    const encodedPreviousUrl = encodeURIComponent(previousUrl);
    $('#loginform').submit(function(event) {
      event.preventDefault();
      var formData = $(this).serialize();
      formData += "&prevUrl=" + encodedPreviousUrl;
      $.ajax({
        type: 'POST',
        url: '/login',
        data: formData,
        success: function(data) {
          // 로그인 성공 시, 이후 처리 로직
          window.location.href = data;
        },
        error: function(xhr, status, error) {
          var errorMessage = xhr.responseJSON.message;
          alert(errorMessage);
        }
      });
    });
  });
  