function validateSearch() {
    var keyword = document.querySelector('.keword').value.trim();
    if (keyword === '') {
        // 검색어가 비어있는 경우 검색을 수행하지 않음
        alert("검색어를 입력해주세요.");
        return false;
    }
    // 검색어가 있을 경우 검색 수행
    return true;
}