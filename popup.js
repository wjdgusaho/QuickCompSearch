//시각적인 기능을 담당
document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("searchButton");
  searchButton.addEventListener("click", searchCompany);

  // 페이지 로드 시 기존 기록을 가져오기
  chrome.runtime.sendMessage({ type: "getRecords" }, function (response) {
    if (response && response.records) {
      const records = response.records;
      records.forEach((record) => {
        recordSetting(record);
      });
      //console.log("Records:", records);
    }
  });
});

//엔터
document.getElementById("companyInput").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // 기본 Enter키 동작 방지
    document.getElementById("searchButton").click(); //버튼 클릭
  }
});

async function searchCompany() {
  const companyInput = document.getElementById("companyInput");
  const searchButton = document.getElementById("searchButton");
  //버튼 잠금
  searchButton.disabled = true;
  let inputValue = companyInput.value;

  //키워드 추가
  const resRecord = await sendMessageToBackground({ type: "addRecord", keyword: inputValue });
  if (resRecord) {
    const records = resRecord;
    const recordDiv = document.getElementById("recordList");
    recordDiv.innerHTML = "";
    records.forEach((record) => {
      recordSetting(record);
    });
  }

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.textContent = "정보를 불러오는 중입니다";
  document.body.appendChild(modal);

  try {
    if (inputValue.trim() == "") {
      alert("회사 명을 입력해주세요!");
      return;
    }

    //"(주)" 맨앞 맨뒤 제거
    inputValue = inputValue.replace(/^\(주\)|\(주\)$/g, "").trim();

    //검색 크롤링(사람인, 잡플래닛)
    const responseData = await sendMessageToBackground({ type: "search", companyName: inputValue });

    //사람인 (추가 처리 -> 화면 변화)
    const resSaramInInfo = await saramIn(responseData.salamIn);
    if (resSaramInInfo) saramInDiv(resSaramInInfo);

    //잡플래닛 (추가 처리 -> 화면 변화)
    const resJobPlanetInfo = await jobPlanet(responseData.jobPlanet);
    if (resJobPlanetInfo) jobPlanetDiv(resJobPlanetInfo[0]);

    //인크루트
    const resInCruitInfo = await inCruit(responseData.inCruit);
    if (resInCruitInfo) inCruitDiv(resInCruitInfo[0]);

    //블라인드
    const resBlindInfo = await blind(responseData.blind, inputValue);
    if (resBlindInfo) blindDiv(resBlindInfo);

    //원티드
    // const resWantedInfo = await wanted(responseData.wanted);

    if (responseData.wanted) wantedDiv(responseData.wanted, inputValue);
  } finally {
    if (modal.parentNode) {
      //모달 해제
      modal.parentNode.removeChild(modal);
      //버튼 잠금 해제
      searchButton.disabled = false;
    }
  }
}

// chrome.runtime.sendMessage를 Promise로 래핑한 함수
function sendMessageToBackground(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else if (response && response.data) {
        resolve(response.data);
      } else {
        reject(new Error(response ? response.error : "검색 실패"));
      }
    });
  });
}

function recordSetting(keyword) {
  const recordDiv = document.getElementById("recordList");
  const recordElement = document.createElement("div");
  recordElement.textContent = keyword;
  recordElement.addEventListener("click", function () {
    recordClick(keyword);
  });
  recordDiv.appendChild(recordElement);
}

async function recordClick(keyword) {
  const companyInput = document.getElementById("companyInput");
  companyInput.value = keyword;
  searchCompany();
}
