$(document).ready(function () {
    //   let test = $(".sort-select").val();
    //   console.log(test);

    $(".sort-select").on("change", function () {
        const selectedOption = $(this).val();
        const currentPage = 1; // 이 부분에 현재 페이지 번호를 넣어주세요.
        const url = `/board/${currentPage}?sortOption=${selectedOption}`;
        $.ajax({
            type: "GET",
            url: url,
            success: function (data) {
                $('.table').html($(data).find('.table').html());
            },
            error: function (error) {
                console.log("AJAX 요청 에러:", error);
            }
        });
    });
});


// $(document).ready(function () {
//     const currentPage = 1; // 현재 페이지 번호
  
//     $.ajax({
//       type: "GET",
//       url: `/main`,
//       dataType: "json",
//       success: function (response) {
//         const data = response.data;
//         if (data.length === 0) {
//           // 데이터가 없을 때 표시할 내용
//           $(".table").append(`
//             <tr class="table-content">
//               <td colspan="6" class="none">게시글이 없습니다.</td>
//             </tr>
//           `);
//         } else {
//           let html = '';
//           for (let i = 0; i < data.length; i++) {
//             const views = data[i];
//             html += `
//               <tr class="table-content">
//                 <td class="num">${views.num}</td>
//                 <td class="name">${views.name}</td>
//                 <td class="date">${views.date}</td>
//                 <td class="title">
//                   <a href="/memo?title=${encodeURIComponent(views.title)}&value=${views.num}&name=${encodeURIComponent(views.name)}">${views.title}</a>
//                 </td>
//                 <td class="watch">${views.watch}</td>
//                 <td class="like">${views.like}</td>
//               </tr>
//             `;
//           }
//           $(".table").append(html);
//         }
//       },
//       error: function (error) {
//         console.log("AJAX 요청 에러:", error);
//       }
//     });
//   });
  

