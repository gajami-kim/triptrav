const regionData = {
    gygg: 31,     // 경기도
    incheon: 2,   // 인천광역시
    gangwon: 32,  // 강원도
    chungbuk: 33, // 충청북도
    chungnam: 34, // 충청남도
    daejeon: 3,   // 대전광역시
    ulsan: 7,     // 울산광역시
    seoul: 1,     // 서울특별시
    jeju: 39,     // 제주도
    gwangju: 5,   // 광주광역시
    busan: 6,     // 부산광역시
    gyeongbuk: 35,// 경상북도
    gyeongnam: 36,// 경상남도
    daegu: 4,     // 대구광역시
    sejong: 8,    // 세종특별자치시
    jeonbuk: 37,  // 전라북도
    jeonnam: 38   // 전라남도
};

const contentTypeIdMap = {
    12: "관광지",
    39: "음식점",
    32: "숙박",
    15: "축제/공연/행사",
    25: "여행코스",
    28: "레포츠",
    38: "쇼핑",
    14: "축제/공연/행사"
};

let selectedContentTypeId = null;
let currentPage = 1;
const perPage = 12;
let isLoading = false;
const API_BASE_URL = 'http://apis.data.go.kr/B551011/KorService1/areaBasedList1';

async function fetchTourInfo(regionCode, contentTypeId = null) {
    const areaCode = regionData[regionCode];

    if (areaCode && !isLoading) {
        const contentTypeQuery = contentTypeId ? `&contentTypeId=${contentTypeId}` : '';
        const apiUrl = `${API_BASE_URL}?numOfRows=${perPage}&pageNo=${currentPage}&MobileOS=ETC&MobileApp=AppTest&ServiceKey=${tourAPIKEY}&listYN=Y&arrange=A${contentTypeQuery}&areaCode=${areaCode}&sigunguCode=&cat1=&cat2=&cat3=&_type=json`;

        isLoading = true;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('fetching error');
            }

            const data = await response.json();
            const tourInfoList = document.getElementById('tourInfoList');

            if (data?.response?.body?.items?.item) {
                const items = data.response.body.items.item;
                if (items.length > 0) {
                    items.forEach(item => {
                        const li = document.createElement('li');
                        const title = item.title || '제목 없음';
                        const addr1 = item.addr1 || '주소 없음';
                        const contentType = contentTypeIdMap[item.contenttypeid] || '알 수 없는 유형';
                        const firstImage = item.firstimage || '';
                        const noImageSrc = '/dist/image/noimage.jpg';

                        const infoText = document.getElementById('infoText');
                        infoText.innerHTML = '';

                        li.innerHTML = `
                            <div class="infoOutBox">
                                <div class="infoLeft">
                                    <span class="infoTitle">${title}</span>
                                    <span class="infoType">${contentType}</span><br>
                                    <span class="infoAddr">${addr1}</span><br>
                                </div>
                                <div class="infoRight">
                                    <img src="${firstImage}" alt="No image available" onerror="this.onerror=null; this.src='${noImageSrc}'" />
                                </div>
                            </div>
                        `;
                        tourInfoList.appendChild(li);
                    });
                    currentPage++;
                } else {
                    // 더 이상 데이터가 없을 때
                    alert('더 이상 데이터가 없습니다.');
                    isLoading = true;
                }
            } else {
                alert('더 이상 데이터가 없습니다.');
                isLoading = true;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('데이터를 가져오는 중 오류가 발생했습니다.');
        } finally {
            isLoading = false;
        }
    } else {
        console.error('잘못된 지역 코드');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const tourInfoList = document.getElementById('tourInfoList');

    tourInfoList.addEventListener('scroll', function () {
        let scrollTop = tourInfoList.scrollTop;
        let clientHeight = tourInfoList.clientHeight;
        let scrollHeight = tourInfoList.scrollHeight;
        let regionCode = window.location.hash.replace('#', '');

        if (scrollTop + clientHeight + 10 > scrollHeight && !isLoading) {
            fetchTourInfo(regionCode, selectedContentTypeId);
        }
    });
});

// 첫 데이터 로드
const initialRegionCode = window.location.hash.replace('#', '');
if (initialRegionCode) {
    fetchTourInfo(initialRegionCode, selectedContentTypeId);
}
function displayNoTourInfo(container) {
    const li = document.createElement('li');
    li.textContent = '관광 정보가 없습니다.';
    container.appendChild(li);
}


window.addEventListener('hashchange', function () {
    const regionCode = window.location.hash.replace('#', '');
    if (regionCode) {
        currentPage = 1;
        tourInfoList.innerHTML = '';
        fetchTourInfo(regionCode, selectedContentTypeId);
    }
});

document.getElementById('options').addEventListener('change', function (event) {
    selectedContentTypeId = event.target.value === 'all' ? null : event.target.value;
    const regionCode = window.location.hash.replace('#', '');
    if (regionCode) {
        currentPage = 1;
        tourInfoList.innerHTML = '';
        fetchTourInfo(regionCode, selectedContentTypeId);
    }
});


tourInfoList.addEventListener('scroll', function() {
    console.log('스크롤 중입니다.');
});








