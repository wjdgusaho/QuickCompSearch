async function saramIn(salamInSearchData) {
  if (!salamInSearchData) return false;
  // 임시 DOM을 만들어 HTML을 파싱
  const parser = new DOMParser();
  const doc = parser.parseFromString(salamInSearchData, "text/html");

  // 특정 클래스 가진 요소 텍스트 추출
  const elements = doc.querySelectorAll(".company_popup");
  const elementsArray = Array.from(elements);
  //console.log(elementsArray);

  //검색된 회사들 (사람인)
  const companys = [];
  elementsArray.forEach((element) => {
    const href = element.getAttribute("href");
    const title = element.getAttribute("title");

    if (href) {
      // href 속성에서 csn(사람인 회사 코드) 값을 추출합니다
      // href가 상대 경로일 경우, 기본(가짜) URL을 추가하여 절대 URL로 변환합니다
      const absoluteUrl = new URL(href, "http://dummybaseurl.com").href;
      const urlParams = new URLSearchParams(new URL(absoluteUrl).search);
      const csn = urlParams.get("csn");

      // title에서 innerText를 추출합니다
      const innerText = title ? title.trim() : "";
      //데이터 배열에 추가
      companys.push({
        csn: csn,
        title: innerText,
      });
    } else {
      console.log("검색된 데이터가 없습니다");
    }
  });

  //console.log(companys[0].csn);
  //사원수
  //검색된 회사 1첫번째 정보값만 검색(사람인)
  const responsecompany = await sendMessageToBackground({
    type: "company",
    companyId: companys[0].csn,
  });

  const doccompany = parser.parseFromString(responsecompany.data, "text/html");

  const workerInfoElement = doccompany.querySelector(".worker_info");
  // .worker_info 내의 .col 요소들을 선택합니다.
  const totalEmployeesCols = workerInfoElement ? workerInfoElement.querySelectorAll(".col") : [];

  // 첫 번째와 두 번째 .col 요소에서 숫자 값을 추출합니다.
  const totalEmployees = totalEmployeesCols[0]
    ? totalEmployeesCols[0].querySelector(".num")?.innerText.trim()
    : "";

  //평균연봉
  let seller = null;
  const companySeller = await sendMessageToBackground({
    type: "seller",
    companyId: companys[0].csn,
  });
  if (companySeller) {
    const docSeller = parser.parseFromString(companySeller, "text/html");
    const sellerInfo = docSeller.querySelector(".average_currency");
    //console.log(sellerInfo);
    if (sellerInfo) {
      seller = sellerInfo.querySelector("em").innerText;
    }
  }

  const resSaramin = {
    company: companys[0].title ? companys[0].title : null,
    totalEmployees: totalEmployees ? totalEmployees : null,
    url: responsecompany.url ? responsecompany.url : null,
    averageSalary: seller ? seller : null,
  };
  // 결과를 콘솔에 출력합니다.
  //console.log("사람인 전체 사원수:", totalEmployees);
  //console.log("사람인 url", responsecompany.url);
  //console.log("사람인 new 평균 연봉", seller);

  return resSaramin;
}

async function saramInDiv(resSaramInInfo) {
  const infoContentDiv = document.getElementById("saramIn");
  // 회사명과 URL이 둘 다 있어야 정보를 표시, 하나라도 없으면 정보 없음 처리
  if (resSaramInInfo.company && resSaramInInfo.url) {
    let contentHTML = `<a href="${resSaramInInfo.url}" target="_blank">${resSaramInInfo.company} 바로가기</a>`;
    if (resSaramInInfo.averageSalary) {
      contentHTML += `
      <div>
                  <div>평균연봉</div>
                  <div>${resSaramInInfo.averageSalary} 만원</div> 
      </div>`;
    }
    if (resSaramInInfo.totalEmployees) {
      contentHTML += `<div>
                  <div>사원 수</div>
                  <div>${resSaramInInfo.totalEmployees} 명</div> </div>`;
    }
    infoContentDiv.innerHTML = contentHTML;
  } else {
    infoContentDiv.innerHTML = "<div>정보를 찾지 못했습니다</div>";
  }
}
