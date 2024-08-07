//브라우저 영역에서 작동하는 스크립트
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "search") {
    const companyName = message.companyName;
    //사람인
    // 두 검색 함수에 대한 프로미스를 배열로 생성 (각각의 비동기 이후 결과를 결합)
    Promise.all([
      salamInSearch(companyName),
      jobPlanetSearch(companyName),
      inCruitSearch(companyName),
      blindCompanny(companyName),
      wantedSearch(companyName),
    ])
      .then((res) => {
        const data = {
          salamIn: res[0],
          jobPlanet: res[1],
          inCruit: res[2],
          blind: res[3],
          wanted: res[4],
        };
        sendResponse({ state: true, data: data });
      })
      .catch((error) => {
        sendResponse({ error: error.message });
      });

    return true; // 비동기 응답을 보낼 것임을 명시
  } else if (message.type === "company") {
    const companyId = message.companyId;
    //사람인
    salamIncompany(companyId)
      .then((data) => {
        sendResponse({ state: true, data: data });
      })
      .catch((error) => {
        sendResponse({ error: error.message });
      });
    return true; // 비동기 응답을 보낼 것임을 명시
  } else if (message.type === "seller") {
    const companyId = message.companyId;
    salamInSeller(companyId)
      .then((data) => {
        sendResponse({ state: true, data: data });
      })
      .catch((error) => {
        sendResponse({ error: error.message });
      });
    return true; // 비동기 응답을 보낼 것임을 명시
  } else if (message.type == "getRecords") {
    getRecordCompany(function (records) {
      sendResponse({ records: records });
    });
    return true; // 비동기 응답을 보낼 것임을 명시
  } else if (message.type == "addRecord") {
    addSearchRecord(message.keyword, function (updatedRecords) {
      sendResponse({ state: true, data: updatedRecords });
    });
    return true;
  }
});

//사람인 키워드 검색
async function salamInSearch(searchword) {
  let targetUrl =
    "https://www.saramin.co.kr/zf_user/search/company?search_area=main&search_done=y&search_optional_item=n&searchType=search&searchword=";

  try {
    const response = await fetch(targetUrl + searchword);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.text();
    return data;
  } catch (error) {
    return null; // 비동기 함수가 항상 값을 반환하도록 함
  }
}

//사람인 회사 정보 검색
async function salamIncompany(companyId) {
  let targetUrl = "https://www.saramin.co.kr/zf_user/company-info/view?csn=";

  try {
    const response = await fetch(targetUrl + companyId);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    return {
      data: await response.text(),
      url: targetUrl + companyId,
    };
  } catch (error) {
    return null; // 비동기 함수가 항상 값을 반환하도록 함
  }
}

//사람인 평균 연봉 검색
async function salamInSeller(companyId) {
  let targetUrl = "https://www.saramin.co.kr/zf_user/company-info/view-inner-salary?csn=";

  try {
    const response = await fetch(targetUrl + companyId);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.text();
    return data;
  } catch (error) {
    return null; // 비동기 함수가 항상 값을 반환하도록 함
  }
}

//잡코리아 회사검색
async function jobPlanetSearch(searchword) {
  let targetUrl = "https://www.jobplanet.co.kr/search?query=";
  try {
    const response = await fetch(targetUrl + searchword);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.text();
    return data;
  } catch (error) {
    return null; // 비동기 함수가 항상 값을 반환하도록 함
  }
}

//인크루트 회사 검색
async function inCruitSearch(searchword) {
  let targetUrl = "https://search.incruit.com/list/search.asp?col=company&kw=";
  try {
    const response = await fetch(targetUrl + searchword);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    // ArrayBuffer로 받아온 후, TextDecoder를 사용하여 디코딩
    const arrayBuffer = await response.arrayBuffer();
    const decoder = new TextDecoder("euc-kr");
    const data = decoder.decode(arrayBuffer);

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null; // 비동기 함수가 항상 값을 반환하도록 함
  }
}

//블라인드 회사
//search 의경우 robots.txt에서 막혀 있으므로 companny 로 진행 (다소 정확도 떨어질 가능서 있습니다)
async function blindCompanny(searchword) {
  let targetUrl = "https://www.teamblind.com/kr/company/";
  try {
    const response = await fetch(targetUrl + searchword);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = response.text();
    return data;
  } catch (error) {
    return null; // 비동기 함수가 항상 값을 반환하도록 함
  }
}

//원티드
async function wantedSearch(searchword) {
  let targetUrl = "https://www.wanted.co.kr/search?query=";
  let urlValue = "&tab=company";

  return targetUrl + searchword + urlValue;
  /*
  console.log(targetUrl + searchword + urlValue);
  try {
    const response = await fetch(targetUrl + searchword + urlValue);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = response.blob();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return ""; // 비동기 함수가 항상 값을 반환하도록 함
  }
  */
}

//데이터를 저장
function setRecordCompany(updateRecord) {
  chrome.storage.local.set({ recordCompany: updateRecord });
}

// 데이터 불러오기 함수
function getRecordCompany(callback) {
  chrome.storage.local.get(["recordCompany"], function (result) {
    const records = result.recordCompany || [];
    callback(records);
  });
}

//기록 추가
function addSearchRecord(keyword, callback) {
  getRecordCompany(function (records) {
    const updateKeyword = [keyword, ...records.filter((k) => k !== keyword)].slice(0, 5);
    setRecordCompany(updateKeyword);
    callback(updateKeyword);
  });
}
