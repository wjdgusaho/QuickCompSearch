async function blind(blindCompannyData, searchword) {
  if (!blindCompannyData) return false;
  const parser = new DOMParser();
  const doc = parser.parseFromString(blindCompannyData, "text/html");
  //console.log("블라인드 ", doc);

  // 평점 추출
  const rating = doc.querySelector(".company .rating .star").innerText.replace(/Rating Score/g, "");
  //console.log("평점:", rating);
  const name = doc.querySelector(".company .where .name").innerText;
  const targetUrl = "https://www.teamblind.com/kr/company/" + searchword;

  // 업계 정보 추출
  const companyUrl = doc.querySelector(".overview li:nth-child(1) > a").innerText;
  //console.log("홈페이지:", companyUrl);

  const reviewCnt = doc
    .querySelector(".company .where .rating .num")
    .innerText.replace(/^\(|\)$/g, "");
  //console.log("리뷰 카운트 ", reviewCnt);

  const res = {
    company: name,
    url: targetUrl,
    companyUrl: companyUrl,
    rating: rating,
    reviewCnt: reviewCnt,
  };

  return res;
}

async function blindDiv(resBlindInfo) {
  const infoContentDiv = document.getElementById("blind");
  // 회사명과 URL이 둘 다 있어야 정보를 표시, 하나라도 없으면 정보 없음 처리
  if (resBlindInfo.company && resBlindInfo.url) {
    let contentHTML = `<a href="${resBlindInfo.url}" target="_blank">${resBlindInfo.company}바로가기</a>`;
    if (resBlindInfo.sales) {
      contentHTML += `<div>
                      <div>연봉정보</div>
                      <div>${resBlindInfo.sales}</div> </div> `;
    }
    if (resBlindInfo.totalEmployees) {
      contentHTML += `<div>
                      <div>직원 수</div>
                      <div>${resBlindInfo.totalEmployees}</div> </div> `;
    }
    if (resBlindInfo.rating) {
      contentHTML += `<div>
                      <div>평점</div>
                      <div>${resBlindInfo.rating} 점</div> </div> `;
    }
    if (resBlindInfo.reviewCnt) {
      contentHTML += `<div>
                        <div>리뷰 수</div>
                        <div>${resBlindInfo.reviewCnt}</div> </div> `;
    }
    infoContentDiv.innerHTML = contentHTML;
  } else {
    infoContentDiv.innerHTML = "<div>정보를 찾지 못했습니다</div>";
  }
}
