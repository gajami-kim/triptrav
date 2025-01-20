let currentPage = 1;
const itemsPerPage = 5;
let isLoading = false;
let trips = [];
let likeList = [];

if (typeof userNickname !== 'undefined' && userNickname !== null) {
    likeListCall(unoNum);
}
document.addEventListener("DOMContentLoaded", () => {
    console.log('tripCourse in');
    loadTrips(currentPage);
    window.addEventListener("scroll", handleScroll);
});

async function courseCall() {
    const response = await fetch(`/trip/courseCall`);
    return await response.json();
}

async function loadTrips(page) {
    if (isLoading) return;
    isLoading = true;
    if (trips.length === 0) {
        trips = await courseCall();
    }
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const tripsToDisplay = trips.slice(start, end);
    await appendTrips(tripsToDisplay);
    isLoading = false;
}

function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    if (scrollTop + windowHeight >= documentHeight - 100) {
        currentPage++;
        loadTrips(currentPage);
    }
}

async function likeListCall(unoNum) {
    try {
        console.log(unoNum);
        const response = await fetch("/trip/likeListCall?uno=" + unoNum);  // 데이터 요청
        likeList = await response.json();
    } catch (error) {
        console.error('Error fetching like list:', error);  // 에러 처리
    }
}

async function courseDetailCall(contentId) {
    const url = await fetch(`https://apis.data.go.kr/B551011/KorService1/detailIntro1?MobileOS=ETC&MobileApp=tr&_type=json&contentId=${contentId}&contentTypeId=25&serviceKey=${tourAPIKEY}`);
    const res = await url.json();
    return res.response.body.items.item;
}

async function toggleLike(contentId,title,isLike) {
    const config = {
        method: isLike? "DELETE" : "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            uno : unoNum,
            likeCode : contentId,
            likeName : title
        }),

    }
    const url = isLike ? "/trip/delLike" : "/trip/addLike";
    try {
        const response = await fetch(url,config);
        return await response.text();
    } catch (error) {
        console.error('Error toggling like:', error);
    }
}

async function appendTrips(trips) {
    const listContainer = document.getElementById('listContainer');

    for (const trip of trips) {
        const detailInfoArray = await courseDetailCall(trip.contentId);

        if (!detailInfoArray || detailInfoArray.length === 0) {
            // console.log(`리스트 정보를 추가할 수 없습니다. trip ID: ${trip.contentId}의 detailInfo가 없습니다.`);
            continue;
        }
        const detailInfo = detailInfoArray[0];
        const listItem = document.createElement("div");
        listItem.classList.add("list-item");

        const image = document.createElement("img");
        image.src = trip.firstImage;
        image.alt = "코스 이미지";
        image.classList.add("courseImg");

        const info = document.createElement("div");

        const title = document.createElement("h3");
        title.innerText = `${trip.title ? trip.title : "정보 없음"}`;

        const address = document.createElement("p");
        address.innerText = `${trip.addr1 ? trip.addr1 : "정보 없음"}`;

        const distance = document.createElement("p");
        distance.innerText = `총 거리: ${detailInfo.distance ? detailInfo.distance : "정보 없음"}`;

        const schedule = document.createElement("p");
        schedule.innerText = `일정: ${detailInfo.schedule ? detailInfo.schedule : "정보 없음"}`;

        const theme = document.createElement("p");
        theme.innerText = `테마: ${detailInfo.theme ? detailInfo.theme.replaceAll("-", "") : "정보 없음"}`;

        const btnDiv = document.createElement("div");
        btnDiv.classList.add("btnDiv");

        const heartImgSrc = isLikeCourse(`${trip.contentId}`) ? "/dist/image/heart-on.svg" : "/dist/image/heart.svg";
        btnDiv.innerHTML = `
            <button type="button" class="likeBtn" data-title="${trip.title}" data-content-id="${trip.contentId}" data-isLike ="${isLikeCourse(`${trip.contentId}`)}">
                <img src="${heartImgSrc}" class="heartImg">
            </button>`;

        info.appendChild(title);
        info.appendChild(address);
        info.appendChild(distance);
        info.appendChild(schedule);
        info.appendChild(theme);
        listItem.appendChild(btnDiv);
        listItem.appendChild(image);
        listItem.appendChild(info);
        listContainer.appendChild(listItem);
    }

    const likeButtons = document.querySelectorAll('.likeBtn');
    likeButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const contentId = button.getAttribute('data-content-id');
            const isLike = button.getAttribute('data-isLike') === "true";
            const title = button.getAttribute('data-title');
            if (typeof userNickname !== 'undefined' && userNickname !== null) {
                toggleLike(contentId,title, isLike).then(re=>{
                    if(re === "in"){
                        button.setAttribute('data-isLike', "true");
                        button.querySelector('img').src = "/dist/image/heart-on.svg";
                    }else if(re === "de"){
                        button.setAttribute('data-isLike', "false");
                        button.querySelector('img').src = "/dist/image/heart.svg";
                    }else if(re.includes("no")){
                        console.log("실패" ,re);
                    }
                })
            } else {
                if (confirm("로그인 한 사용자만 이용가능 한 서비스입니다. \n로그인 페이지로 이동하시겠습니까?")) {
                    document.getElementById('myModal').style.display = 'flex';
                }
            }
        });
    });
}

function isLikeCourse(contentId) {
    if (likeList.length === 0) {
        return false;
    }
    for (let like of likeList) {
        if (like === contentId) {
            return true;
        }
    }
    return false;
}
