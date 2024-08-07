async function jobPlanet(jobPlanetSearchData) {
  if (!jobPlanetSearchData) return false;
  const parser = new DOMParser();
  const doc = parser.parseFromString(jobPlanetSearchData, "text/html");

  const companys = [];
  const mainElement = doc.querySelector("main");
  const commpannyElements = mainElement.querySelectorAll(
    "div:nth-child(1)  > div > div > div > div:nth-child(2) > ul > a"
  );

  //console.log(commpannyElements);

  commpannyElements.forEach((element) => {
    // 기업 이름 추출
    const companyName = element.querySelector("span.line-clamp-2.text-h9.text-gray-800").innerText;
    // 기업 분야 추출
    const companyField = element.querySelector("div.text-small1.text-gray-400").innerText;
    // 기업 평점 추출
    const companyRating = element.querySelector("span.text-small1.text-green-500").innerText;
    // 기업 링크 추출
    const companyLink = element.href;

    const companyInfo = {
      company: companyName,
      field: companyField,
      rating: companyRating,
      url: companyLink,
    };
    companys.push(companyInfo);
  });
  //console.log(companys);
  return companys;
}

async function jobPlanetDiv(resJobPlanetInfo) {
  const infoContentDiv = document.getElementById("jobPlanet");
  //console.log(resJobPlanetInfo);
  // 회사명과 URL이 둘 다 있어야 정보를 표시, 하나라도 없으면 정보 없음 처리
  if (resJobPlanetInfo.company && resJobPlanetInfo.url) {
    let contentHTML = `<a href="${resJobPlanetInfo.url}" target="_blank">${resJobPlanetInfo.company} 바로가기</a>`;
    if (resJobPlanetInfo.rating) {
      contentHTML += `<div>
                  <div>평점</div>
                  <div>${resJobPlanetInfo.rating} 점</div> </div> `;
    }
    if (resJobPlanetInfo.field) {
      contentHTML += `<div>
                  <div>기업 분야</div>
                  <div>${resJobPlanetInfo.field}</div> </div>  `;
    }
    infoContentDiv.innerHTML = contentHTML;
  } else {
    infoContentDiv.innerHTML = "<div>정보를 찾지 못했습니다</div>";
  }
}
