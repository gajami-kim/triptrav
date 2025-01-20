const savePlaceModal = document.querySelector('.savePlaceModal');

function savePlace(event){
    if (typeof userNickname === 'undefined') {
        event.preventDefault();
        if(confirm("로그인 한 사용자만 이용가능 한 서비스입니다. \n로그인 페이지로 이동하시겠습니까?")){
            document.getElementById('myModal').style.display = 'flex';
        }
    }else{
        savePlaceModal.style.display='flex';
        const modal = `<div class="spModalWrap">
                            <div class="spModalCloseBtn" onclick="closeModal()">&times;</div>
                            <div class="myPlan">
                                <span>내 여행일정</span>
                                <ul class="myPlanUl"></ul>
                                <button class="createPlanBtn" onclick="createPlan()">새로운 일정 생성하기</button>
                            </div>
                        </div>`
        savePlaceModal.innerHTML=modal;
        displaySchedule();
    }
}

function closeModal(){
    savePlaceModal.style.display='none';
}

function createPlan() {
    fetch(detailInfoUrl)
        .then(response => response.json())
        .then(data => {
            const jsonData = data.response.body.items.item[0];
            document.querySelector('.myPlan').innerHTML = '';
            const createPage = `<form id="tripForm" method="post">
                                            <div class="myPlan">
                                                <span>내 여행일정</span>
                                            </div>
                                            <div class="backBtn" onclick="backModal()">
                                                <img src="/dist/image/chevron-leftB.svg">
                                            </div>
                                            <div class="createPlan">
                                             <input class="createPlanName" placeholder="일정의 제목을 작성해주세요.">
                                             <div class="calendarArea">
                                                <div class="departArea">
                                                     <img src="/dist/image/calendar.svg" class="departCalendar">
                                                     : <input id="departureDate" type="text" placeholder="시작일" readonly >
                                                </div>
                                                <div class="returnArea">
                                                    <img src="/dist/image/calendar.svg" class="returnCalendar">
                                                    : <input id="returnDate" type="text" placeholder="종료일" readonly >
                                                </div>
                                            </div>
                                             <div class="currentPlaceInfo" data-id="${jsonData.contentid}">
                                                <img src="${jsonData.firstimage}" class="placeFirstImg">
                                                <div class="currentPlaceName">${jsonData.title}</div>
                                                <div class="currentPlaceAddr">${jsonData.addr1}</div>
                                             </div>
                                             <button type="submit" class="makePlan">일정 생성하기</button>
                                            </div>
                                        </form>`;
            document.querySelector('.myPlan').innerHTML += createPage;

            flatpickr.localize(flatpickr.l10ns.ko);
            const today = new Date();

            const departurePickr = flatpickr('#departureDate', {
                minDate: today,
                dateFormat: "Y-m-d",
                onchange: function (selectedDates, dateStr, instance) {
                    returnPickr.clear();
                    returnPickr.set("minDate", dateStr);
                }
            });

            const returnPickr = flatpickr("#returnDate", {
                minDate: today,
                dateFormat: "Y-m-d",
                onChange: function (selectedDates, dateStr, instance) {
                    const departureDate = departurePickr.selectedDates[0];
                    const maxTripDuration = 2 * 24 * 60 * 60 * 1000; // 2박 3일

                    if (selectedDates[0] < departureDate) {
                        alert("도착일은 출발일보다 빠를 수 없습니다.");
                        returnPickr.setDate(departureDate);
                        return;
                    }

                    if (selectedDates[0] - departureDate > maxTripDuration) {
                        alert("최대 2박 3일까지만 여행을 만들 수 있습니다");
                        returnPickr.setDate(departureDate);
                    }
                }
            });

            document.querySelector('#tripForm').addEventListener('submit', function (event) {
                event.preventDefault();

                const planName = document.querySelector('.createPlanName').value;
                const departureDate = document.querySelector('#departureDate').value;
                const returnDate = document.querySelector('#returnDate').value;

                if (!planName) {
                    alert('일정 제목을 작성해주세요.');
                    return;
                }

                if (!departureDate || !returnDate) {
                    alert('출발일과 도착일을 모두 선택해주세요.');
                    return;
                }

                const currentPlaceName = document.querySelector('.currentPlaceName').innerText;
                const placeFirstImg = document.querySelector('.placeFirstImg').getAttribute('src');

                const startDate = new Date(departureDate);
                const endDate = new Date(returnDate);
                const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
                const requestBody = {
                    sche_name: planName,
                    sche_start: departureDate,
                    sche_end: returnDate,
                    sche_count: totalDays,
                    sche_img: placeFirstImg,
                    uno: unoNum
                };

                fetch(`/schedule/createPlan/${contentId}/${currentPlaceName}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                })
                    .then(response => response.text())
                    .then(data => {
                        console.log(data)
                        if (data==="1") {
                            if(confirm('일정이 성공적으로 저장되었습니다! \n마이페이지로 이동하여 확인하시겠습니까?')){
                                location.href=`/mypage?uno=${unoNum}&location=tripList`;
                            } else{
                                closeModal();
                            }
                        } else {
                            alert('일정 저장 중 오류가 발생했습니다. \n다시 시도해주세요.');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            });
        });
}

async function getUserSchedule(uno){
    try{
        const url = "/schedule/getUserSchedule/"+uno;
        const config = {method: 'get'}
        const response = await fetch(url, config);
        return response.json()
    } catch (e) {
        console.log(e);
    }
}

function displaySchedule(){
    getUserSchedule(unoNum).then(result=>{
        console.log(result.length);
        if(result.length>0){
            result.forEach(r=>{
                const today = new Date();
                today.setHours(0,0,0,0);
                const scheStart = new Date(r.scheStart.substring(0,10))

                //현재날짜 기준으로 예정된 일정만 출력
                if(scheStart>=today){
                    document.querySelector('.myPlanUl').innerHTML='';
                    const div = `<div class="myPlaceInfo" data-sco="${r.sco}">
                                                <img src="${r.scheImg}" class="placeFirstImg">
                                                <div class="myPlaceName">${r.scheName}</div>
                                                <div class="scheduleDuration">${r.scheStart.substring(0,10).replaceAll('-','.')} 
                                                    ~ ${r.scheEnd.substring(0,10).replaceAll('-','.')}</div>
                                                <button class="plusPlan">여행지 +</button>
                                             </div>`;
                    document.querySelector('.myPlanUl').innerHTML+=div;
                } else {
                    console.log("일정없음")
                    document.querySelector('.savePlaceModal').innerHTML=`<div class="spModalWrap">
                            <div class="spModalCloseBtn" onclick="closeModal()">&times;</div>
                            <div class="myPlan">
                                <span>내 여행일정</span>
                                <ul class="myPlanUl">
                                    <div class="noPlanText">현재 예정된 일정이 없습니다.<span>새로운 일정을 생성해보세요!</span></div>
                                </ul>
                                <button class="createPlanBtn" onclick="createPlan()">새로운 일정 생성하기</button>
                            </div>
                        </div>`
                }
            })
        } else {
            console.log("일정없음")
            document.querySelector('.savePlaceModal').innerHTML=`<div class="spModalWrap">
                            <div class="spModalCloseBtn" onclick="closeModal()">&times;</div>
                            <div class="myPlan">
                                <span>내 여행일정</span>
                                <ul class="myPlanUl">
                                    <div class="noPlanText">현재 예정된 일정이 없습니다.<span>새로운 일정을 생성해보세요!</span></div>
                                </ul>
                                <button class="createPlanBtn" onclick="createPlan()">새로운 일정 생성하기</button>
                            </div>
                        </div>`
        }
    })
}

document.addEventListener('click',(e)=>{
    if (e.target && e.target.classList.contains('plusPlan')) {
        if(confirm("해당 일정에 현재 장소를 추가하시겠습니까?")){
            const myPlaceInfo = e.target.closest('.myPlaceInfo');
            const sco = myPlaceInfo.getAttribute('data-sco');
            const title = document.querySelector('.locationTitle').innerText;
            addPlacePlan(sco, contentId, title);
        }
    }
})

function backModal(){
    displaySchedule();
}

function addPlacePlan(sco, scheContentId, scheTitle){
    const newPlace = {
        sco:sco,
        scheContentId: scheContentId,
        scheTitle:scheTitle
    }
    fetch("/schedule/addPlaceInPlan",{
        method:'post',
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify(newPlace)
    }).then(response => response.text())
        .then(data=>{
            if(data==="1"){
                if(confirm('선택하신 일정에 추가되었습니다\n마이페이지로 이동하여 확인하시겠습니까?')){
                    location.href=`/mypage?uno=${unoNum}&location=tripList`;
                }
            } else {
                alert('일정 추가에 실패하였습니다.')
            }
        })
}
