async function inCruit(inCruitSearchData) {
  if (!inCruitSearchData) return false;
  const parser = new DOMParser();
  const doc = parser.parseFromString(inCruitSearchData, "text/html");

  const companyElement = doc.querySelector(".cTtoal_company_section_p");

  const companyHeader = companyElement.querySelectorAll(".cTtoal_company_header_wrap");
  const companyInfo = companyElement.querySelectorAll(".cTtoal_company_sgrp_info");

  const companys = [];

  // 회사명과 URL, 회사 정보를 함께 처리
  for (let i = 0; i < companyHeader.length; i++) {
    const headerElement = companyHeader[i];
    const infoElement = companyInfo[i];

    // 회사명과 URL 추출
    const header = headerElement.querySelector(".cTtoal_company_header_context > span > a");
    const companyName = header.innerText;
    const companyUrl = header.href;

    // 회사 정보 추출
    const elements = infoElement.querySelectorAll(".cTtoal_company_sgrp_den");
    let sales = null;
    let take = null;
    let people = null;

    elements.forEach((selecter) => {
      const dtText = selecter.querySelector("dt").innerText;
      if (dtText === "매출액") take = selecter.querySelector("dd").innerText;
      if (dtText === "사원수")
        people = selecter.querySelector("dd").innerText.replace(/ 재직중/g, "");
      if (dtText === "평균연봉") sales = selecter.querySelector("dd").innerText;
    });

    // 하나의 객체로 합침
    const company = {
      company: companyName,
      url: companyUrl,
      sales: sales ? sales : "",
      take: take ? take : "",
      totalEmployees: people ? people : "",
    };
    companys.push(company);
  }

  return companys;
}

async function inCruitDiv(resInCruitInfo) {
  const infoContentDiv = document.getElementById("inCuit");
  // 회사명과 URL이 둘 다 있어야 정보를 표시, 하나라도 없으면 정보 없음 처리
  if (resInCruitInfo.company && resInCruitInfo.url) {
    let contentHTML = `<a href="${resInCruitInfo.url}" target="_blank">${resInCruitInfo.company} 바로가기</a>`;
    if (resInCruitInfo.sales) {
      contentHTML += `<div>
                    <div>평균연봉</div>
                    <div>${resInCruitInfo.sales}</div> </div> `;
    }
    if (resInCruitInfo.totalEmployees) {
      contentHTML += `<div>
                    <div>사원 수</div>
                    <div>${resInCruitInfo.totalEmployees}</div> </div> `;
    }
    if (resInCruitInfo.take) {
      contentHTML += `<div>
                    <div>매출액</div>
                    <div>${resInCruitInfo.take}</div> </div> `;
    }
    infoContentDiv.innerHTML = contentHTML;
  } else {
    infoContentDiv.innerHTML = "<div>정보를 찾지 못했습니다</div>";
  }
}
