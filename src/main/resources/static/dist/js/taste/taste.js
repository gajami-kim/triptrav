const accordionButton = document.querySelector('.accordion');
const buttons = document.querySelectorAll('.taste-button');
const reTasteBtn = document.querySelector('.reTaste');
const placeNames = [];
const placeTag = [];
const spinner = document.getElementById('spinner');
const overlay = document.getElementById('overlay');
let selectedButtons = [...cnoList];
let reState =false;
spinner.style.display = 'block';
overlay.style.display = 'block';

//초기페이지
document.querySelector('.tasteTitle').innerText = `${userNickname}님의 취향분석 결과`;

const selectedTaste = document.querySelector('.selectedTaste');
selectedTaste.innerHTML = ``;
for(let tags of selectedButtons){
    selectedTaste.innerHTML += `<span class="tags">#${changeCno(tags)}</span>`
    placeTag.push(changeCno(tags));
}
//아코디언처리
accordionButton.addEventListener('click', () => {
    accordionButton.classList.toggle('active');
    const tasteDiv = accordionButton.parentElement.nextElementSibling;
    tasteDiv.style.display = tasteDiv.style.display === 'block' ? 'none' : 'block';
    selectedTaste.style.display = selectedTaste.style.display == 'none' ? 'block' : 'none';
});

// 초기 상태에 맞게 active 클래스 설정
buttons.forEach(button => {
    const cno = Number(button.dataset.cno);
    if (selectedButtons.includes(cno)) {
        button.classList.add('active');
    }
});

// 버튼 클릭 시 처리
buttons.forEach(button => {
    button.addEventListener('click', function() {
        const cno = Number(this.dataset.cno);
        if (this.classList.contains('active')) {
            selectedButtons = selectedButtons.filter(item => item !== cno);
            this.classList.remove('active');
        } else {
            if (selectedButtons.length < 5) {
                selectedButtons.push(cno);
                this.classList.add('active');
            } else {
                alert('최대 5개까지 선택할 수 있습니다.');
            }
        }
        const normalizedSelected = selectedButtons.map(item => Number(item));
        const normalizedCnoList = cnoList.map(item => Number(item));
        const isDifferent = normalizedSelected.sort().toString() !== normalizedCnoList.sort().toString();
        if (isDifferent) {
            if(selectedButtons.length != 0){
                reTasteBtn.style.display = '';
                reState = true;
            }
        } else {
            reTasteBtn.style.display = 'none';
            reState = false;
        }
    });
});

// "다시 분석" 버튼 이벤트 리스너
document.querySelector('.reTaste').addEventListener('click', function() {
    let changeList = [];
    for(let i = 0; i < selectedButtons.length; i++) {
        changeList.push(changeCno(selectedButtons[i]))
    }
    const requestBody = {
        categoryNames: changeList,
        uno: unoNum
    };
    fetch('/taste/addTaste', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => response.text())
        .then(result => {
            if (result == "fail") {
                alert("분석에러");
            } else {
                window.location.href = "/taste/";
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

//cno 넣으면 categoryName 리턴함수
function changeCno(cno) {
    const buttons = document.querySelectorAll('.taste-button');
    for (let button of buttons) {
        if (button.getAttribute('data-cno') == cno) {
            return button.innerText;
        }
    }
    return null;
}

//나이대 변환 함수
function getAgeGroup(age) {
    const ageGroup = Math.floor(age / 10) * 10;
    return `${ageGroup}대`;
}

//유저정보가져오기
async function getAdditionalInfo() {
    try{
        const url = "/user/getAdditionalInfo/"+unoNum;
        const option = {
            method : "GET"
        }
        const resp = await fetch(url, option);
        return resp.json();
    }catch(error){
        console.log(error)
    }
}

// 분석결과 출력
Promise.all([
    fetch('/dist/json/AITourData.json')
        .then(response => {
            if (!response.ok) throw new Error('AITourData.json 파일 로딩 실패');
            return response.json();
        }),
    fetch('/dist/json/category.json')
        .then(response => {
            if (!response.ok) throw new Error('category.json 파일 로딩 실패');
            return response.json();
        })
])
    .then(([data, category]) => {
        let categoryCodeList = [];
        let similarPlace = [];
        const maxPlaces = 10;
        const userSelectionCount = cnoList.length;

        for (let cno of cnoList) {
            for (let cnoJson of category) {
                if (cno == cnoJson.cno) {
                    categoryCodeList.push(cnoJson.categoryCode);
                }
            }
        }

        let placesPerCategory = Math.floor(maxPlaces / userSelectionCount);
        let remainingPlaces = maxPlaces % userSelectionCount;

        // 카테고리별 유사 장소 추가
        for (let code of categoryCodeList) {
            let matchingPlaces = [];
            for (let tourArray of data) {
                if ((code === tourArray.cat2 || code === tourArray.cat3) && tourArray.firstimage) {
                    matchingPlaces.push(tourArray.contentid);
                }
            }
            matchingPlaces = shuffleArray(matchingPlaces).slice(0, placesPerCategory);
            similarPlace.push(...matchingPlaces);
        }

        // 나머지 장소 추가
        if (remainingPlaces > 0) {
            let remainingMatchingPlaces = [];
            for (let tourArray of data) {
                for (let code of categoryCodeList) {
                    if ((code === tourArray.cat2 || code === tourArray.cat3) && tourArray.firstimage) {
                        remainingMatchingPlaces.push(tourArray.contentid);
                    }
                }
            }
            remainingMatchingPlaces = shuffleArray(remainingMatchingPlaces).slice(0, remainingPlaces);
            similarPlace.push(...remainingMatchingPlaces);
        }

        similarPlace = shuffleArray(similarPlace).slice(0, maxPlaces);

        const displayTasteCodeList = document.querySelector('.displayTasteCodeList');
        displayTasteCodeList.innerHTML = '';
        for (let displayData of data) {
            for (let contentId of similarPlace) {
                if (contentId == displayData.contentid) {
                    const titleText = displayData.title;
                    placeNames.push(titleText);
                    if (displayData.contenttypeid == "15") {
                        displayTasteCodeList.innerHTML +=
                            `<a href="https://www.google.com/search?q=${encodeURIComponent(displayData.title)}" target="_blank">
                            <div class="oneTasteCode">
                                <img src="${displayData.firstimage ? displayData.firstimage : '/dist/image/noimage.jpg'}" alt="no image">
                                <span title="${titleText}">${titleText}</span>
                            </div>
                        </a>`;
                    } else {
                        displayTasteCodeList.innerHTML +=
                            `<a href="/place/${displayData.contentid}">
                            <div class="oneTasteCode">
                                <img src="${displayData.firstimage ? displayData.firstimage : '/dist/image/noimage.jpg'}" alt="no image">
                                <span title="${titleText}">${titleText}</span>
                            </div>
                        </a>`;
                    }
                }
            }
        }
        //트렌드출력
        getAdditionalInfo().then(result => {
            const tasteUserList = document.querySelector('.tasteUserList');
            const trendText = `${getAgeGroup(result.age)} ${result.gender == 0 ? "남성" : "여성"}에게 인기있는 관광지`;
            const trendTitle = document.createElement('div');
            trendTitle.innerText = trendText;
            tasteUserList.insertBefore(trendTitle, tasteUserList.firstChild);
            const tasteTags = document.createElement('div');
            tasteTags.classList.add('tasteTags');
            tasteUserList.insertBefore(tasteTags, trendTitle.nextSibling);

            trendData(result.age, result.gender).then(trend => {
                const displayTasteUserList = document.querySelector('.displayTasteUserList');
                displayTasteUserList.innerHTML = '';

                const itemsToDisplay = [4, 3, 2, 1];
                let displayCount = 0;
                tasteTags.innerHTML = '';
                for(let i=0; i<4; i++) {
                    const trendCno = trend[i].cno;
                    const tagText = changeCno(trendCno);
                    const tagSpan = document.createElement('span');
                    tagSpan.classList.add('trendTags');
                    tagSpan.innerText = `#${tagText}`;
                    tasteTags.appendChild(tagSpan);
                }
                for (let i = 0; i < itemsToDisplay.length && i < trend.length; i++) {
                    let trendCno = trend[i].cno;
                    let categoryCount = itemsToDisplay[i];
                    const matchedCategory = category.find(c => c.cno == trendCno);
                    if (matchedCategory) {
                        let filteredContent = data.filter(d =>
                            (d.cat2 == matchedCategory.categoryCode || d.cat3 == matchedCategory.categoryCode)
                            && d.firstimage
                        ).sort(() => Math.random() - 0.5);

                        for (let displayData of filteredContent.slice(0, categoryCount)) {
                            const titleText = displayData.title;
                            if (displayData.contenttypeid == "15") {
                                displayTasteUserList.innerHTML +=
                                    `<a href="https://www.google.com/search?q=${encodeURIComponent(displayData.title)}" target="_blank">
                            <div class="oneTasteCode">
                                <img src="${displayData.firstimage}" alt="no image">
                                <span title="${titleText}">${titleText}</span>
                            </div>
                        </a>`;
                            } else {
                                displayTasteUserList.innerHTML +=
                                    `<a href="/place/${displayData.contentid}">
                            <div class="oneTasteCode">
                                <img src="${displayData.firstimage}" alt="no image">
                                <span title="${titleText}">${titleText}</span>
                            </div>
                        </a>`;
                            }
                        }
                        displayCount++;

                    }
                }
            });
        });
        //AI추천 출력
        function fetchAndDisplayAI() {
            analyzeWithAI(placeNames, placeTag)
                .then(result => {
                    spinner.style.display = 'none';
                    overlay.style.display = 'none';

                    const analysisContent = result.choices[0].message.content;
                    const jsonString = analysisContent.match(/\[.*\]/s);
                    if (jsonString && jsonString[0]) {
                        try {
                            const parsedData = JSON.parse(jsonString[0]);
                            const displayTasteAIList = document.querySelector('.displayTasteAIList');
                            const matchedPlaces = [];
                            const uniquePlaceNames = new Set();
                            while (matchedPlaces.length < 10) {
                                for (let place of parsedData) {
                                    const placeName = place["이름"].replace(/[\[\]]/g, "").trim();
                                    const placeReason = place["추천이유"];
                                    if (uniquePlaceNames.has(placeName)) {
                                        continue;
                                    }
                                    uniquePlaceNames.add(placeName);
                                    for (let content of data) {
                                        if (content.title.toLowerCase().includes(placeName.toLowerCase()) && content.firstimage) {
                                            matchedPlaces.push({
                                                title: content.title,
                                                firstimage: content.firstimage,
                                                contentid: content.contentid,
                                                placeReason: placeReason
                                            });
                                            if (matchedPlaces.length >= 10) {
                                                break;
                                            }
                                        }
                                    }
                                    if (matchedPlaces.length >= 10) {
                                        break;
                                    }
                                }
                                if (matchedPlaces.length >= 10) {
                                    displayMatchedPlaces(matchedPlaces, displayTasteAIList);
                                    break;
                                } else {
                                    return fetchAndDisplayAI();
                                }
                            }
                        } catch (error) {
                            console.error("JSON 파싱 오류:", error);
                        }
                    } else {
                        console.error("JSON 문자열을 찾을 수 없습니다.");
                    }
                })
                .catch(error => {
                    console.error('데이터 로딩 에러:', error);
                })
                .finally(() => {
                    spinner.style.display = 'none';
                    overlay.style.display = 'none';
                });
        }

        //화면출력
        function displayMatchedPlaces(matchedPlaces, displayTasteAIList) {
            const shuffledPlaces = shuffleArray(matchedPlaces);
            displayTasteAIList.innerHTML = '';

            if (shuffledPlaces.length > 0) {
                const placeReason = shuffledPlaces[0].placeReason;
                const tasteAIListSection = document.querySelector('.tasteAIList');
                let reasonElement = tasteAIListSection.querySelector('.placeReason');
                if (!reasonElement) {
                    reasonElement = document.createElement('span');
                    reasonElement.classList.add('placeReason');
                    tasteAIListSection.insertBefore(reasonElement, displayTasteAIList);
                }
                reasonElement.innerText = placeReason;
            }
            shuffledPlaces.forEach(place => {
                const { title, firstimage, contentid } = place;
                const placeElement = `
            <a href="${contentid ? `/place/${contentid}` : `https://www.google.com/search?q=${encodeURIComponent(title)}`}" target="_blank">
                <div class="oneTasteCode">
                    <img src="${firstimage}" alt="${title}">
                    <span class="placeTitle" title="${title}">${title}</span>
                </div>
            </a>`;
                displayTasteAIList.innerHTML += placeElement;
            });
        }
        fetchAndDisplayAI();
    })
    .catch(error => {
        console.error('데이터 로딩 에러:', error);
    });

//매번 랜덤값 넣기
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

//성별,나이로 cno리스트 받아오기
async function trendData(age, gender){
    try{
        const url = "/taste/getTrend/"+age+"/"+gender;
        const option = {
            method : "GET"
        }
        const resp = await fetch(url, option);
        return resp.json();
    }catch(error){
        console.log(error);
    }
}
//아코디언 인지 처리
let open = false;
document.querySelector('.accordion').addEventListener('click', ()=>{
    if(open == true){
        document.querySelector('.openButton').src = "/dist/image/chevron-down.svg";
        document.querySelector('.reTaste').style.display = 'none';
        open = false;
        if(reState ==false){
            document.querySelector('.reTaste').style.display = 'none';
        }
    }else{
        document.querySelector('.openButton').src = "/dist/image/chevron-up.svg";
        open = true;
        if(reState == true){
            document.querySelector('.reTaste').style.display = '';
        }else{
            document.querySelector('.reTaste').style.display = 'none';
        }
    }
})
//API 호출
async function analyzeWithAI(placeNames, placeTag) {
    try {
        const requestBody = {
            placeNames: placeNames,
            placeTag: placeTag
        }
        const url = "/ai/analyze"
        const option = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }
        const resp = await fetch(url, option);
        return await resp.json();
    }catch(error){
        console.log(error);
    }
}

