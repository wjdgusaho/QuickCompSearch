async function wanted(wantedSearchData) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(wantedSearchData, "text/html");

  const companys = [];
  const compannyList = doc.querySelector(".SearchContentTitle_TitleCount__4zp_f");
  //console.log(compannyList);
  //   compannyList.forEach((element) => {
  //     console.log(element.innerHTML);
  //     const aElement = element.querySelector("a");
  //     console.log(aElement);
  //     console.log(aElement.href);
  //     console.log(aElement.data - company - name);
  //     console.log(
  //       aElement.querySelector(".SearchCompanyCard_confirmedPositionMessage__cbbTI > p").innerText
  //     );
  //   });

  console.log(doc);
}

async function wantedDiv(url, searchword) {
  const infoContentDiv = document.getElementById("wanted");
  //console.log(url);
  if (searchword && url) {
    let contentHTML = `<a href="${url}" target="_blank">${searchword} [원티드] 검색 바로가기 </a>`;
    infoContentDiv.innerHTML = contentHTML;
  } else {
    infoContentDiv.innerHTML = "<div>정보를 찾지 못했습니다</div>";
  }
}
