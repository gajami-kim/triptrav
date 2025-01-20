const UrlParams = new URLSearchParams(window.location.search);
const sco = UrlParams.get('sco');
const spinner = document.getElementById('spinner');
const overlay = document.getElementById('overlay');

const planDataArray=[];
let lastData;

function getRandomRating() {
    return (Math.random() * 5).toFixed(1); // 소수점 1자리까지 표현
}

function getRandomNumber() {
    return Math.floor(Math.random() * 1000) + 1;
}

window.addEventListener('click', (e) => {
    let date = e.target.getAttribute('data-date');
    if (sco && date) {
        // Show spinner and overlay
        spinner.style.display = 'block';
        overlay.style.display = 'block';

        getUserCourse(sco, date).then(result => {
            let content = '';
            document.querySelector('.contentArea').innerHTML = ''; // Clear existing content

            // Check if there are results
            if (result.length > 0) {
                result.forEach(key => {
                    const star = getRandomRating();
                    const number = getRandomNumber();
                    content = `
                    <li class="oneContent" data-id="${key.scheContentId}">
                        <div class="deletePlan hidden" onclick="deletePlan(event)">&times;</div>
                        <div class="changePlan hidden">
                            <img src="/dist/image/triangle.svg" class="triangle">
                            <img src="/dist/image/triangle.svg" class="downTriangle">
                        </div>
                        <div class="name_cate">
                            <span class="placeName"></span>
                            <span class="placeCate"></span>
                        </div>
                        <div class="placeAddr"></div>
                        <div class="rate_count">
                            <img src="/dist/image/star.svg">
                            <div class="placeRate">${star}</div>
                            <div class="placeRateCount">(${number})</div>
                        </div>
                        <div class="placeImgDiv">
                            <div class="placeImg"></div>
                        </div>
                    </li>`;
                    document.querySelector('.contentArea').insertAdjacentHTML('beforeend', content);
                    getAddr(key.scheContentId);
                    getImage(key.scheContentId);
                });
            }
            spinner.style.display = 'none';
            overlay.style.display = 'none';
        }).catch(error => {
            console.error('Error fetching data:', error);
            spinner.style.display = 'none';
            overlay.style.display = 'none';
        });
    }
});



//day 선택
const days = document.querySelectorAll('.day');
days.forEach(day => {
    day.addEventListener('click', (e) => {
        days.forEach(d => {
            if (d !== e.target) {
                d.classList.remove('day_focus');
            }
        })
        e.target.classList.add('day_focus');
        const date = e.target.getAttribute('data-date');

        getDatePlan(sco, date).then(r => {
            if (r.length === 0) {
                document.querySelector('.noPlanText').classList.remove('hidden');
            } else {
                document.querySelector('.noPlanText').classList.add('hidden');
            }
        })

    })
})

//상단 회색바탕 위 드래그 슬라이드 구현
//상단 일수별 슬라이드
let slideWrap = document.querySelector('.slideWrap');
let innerSlide = document.querySelector('.innerSlide');
let slideItems = document.querySelectorAll('.slideItem');

let pressed = false;
let startPoint;
let x;
const slideItemWidth = 200;

//메모모달
const memoModal = document.querySelector('.memoModal');
const addMemoBtn = document.querySelector('.addMemoBtn');
const saveMemo = document.querySelector('.saveMemo');
const memoWrap = document.querySelector('.memoWrap');

//일정편집
const editRole = document.querySelector('.editRole');
const editRoleSave = document.querySelector('.editRoleSave');
const disableEditBtn = document.querySelector('.disableEdit');
const editBtn = document.querySelector('.editBtn');

document.addEventListener('DOMContentLoaded', () => {
    // initTmap();

    const today = new Date();
    today.setHours(0,0,0,0);
    getSchedule(sco).then(result=>{
        const startDateStr = result.scheStart.substring(0,10);
        const startDate = new Date(startDateStr);
        startDate.setHours(0,0,0,0)
        if(startDate<today){
            document.querySelector('.editBtn').remove();
            document.querySelector('.disableEdit').classList.remove('hidden');
            document.querySelector('.addPersonBtn').remove();
            document.querySelector('.addMemoBtn').remove();
            document.querySelector('.checkPersonBtn').style.top='185px';
            document.querySelector('.addPlan').addEventListener('click',(event)=>{
                alert('일정이 지난 여행은 편집할 수 없습니다.');
                document.querySelector('.mapContentBox2Depth').remove();
                document.querySelector('.mapCloseBtn').style.left='364px';
            })
        }
    })

    getUserRole(unoNum, sco).then(result => {
        if (result.scheRole === 1) {
            editRole.classList.remove('hidden');
            editRoleSave.classList.remove('hidden')
            editBtn.classList.remove('hidden'); //일정편집버튼
        } else {
            disableEditBtn.classList.remove('hidden');
            const addPlan = document.querySelector('.addPlan');
            const addPersonBtn = document.querySelector('.addPersonBtn');
            addPlan.onclick = null;
            addPlan.addEventListener('click', (event) => {
                event.stopImmediatePropagation();//기존 이벤트 발생X
                alert('일정 편집 권한이 없습니다');
            })
            addPlan.addEventListener('mouseover', () => {
                addPlan.style.cursor = 'default';
            });
            addPersonBtn.classList.add('hidden');
        }
    });
    getAllCourse(sco).then(async result => {
        await Promise.all(result.map(key => getSlideImg(key.scheContentId)))
        slideItems = document.querySelectorAll('.slideItem');
        updateInnerSlideWidth();
        makeDot();
        const checkScheElement = document.querySelector('.checkSche');

        let scheduleText = '';
        result.forEach((title, index) => {
            scheduleText += title.scheTitle;
            if (index !== result.length - 1) {
                scheduleText += ' • ';
            }
        });

        checkScheElement.textContent=scheduleText;
    })
    //일차별 일정출력
    if (sco) {
        getUserCourse(sco, 1).then(result => {
            // console.log(result)
            let content = '';
            result.forEach(key => {
                const star = getRandomRating();
                const number = getRandomNumber();
                content = `
                <li class="oneContent" data-id="${key.scheContentId}">
                    <div class="deletePlan hidden" onclick="deletePlan(event)">&times;</div>
                    <div class="changePlan hidden">
                        <img src="/dist/image/triangle.svg" class="triangle">
                        <img src="/dist/image/triangle.svg" class="downTriangle">
                    </div>
                    <div class="name_cate">
                        <span class="placeName"></span>
                        <span class="placeCate"></span>
                    </div>
                    <div class="placeAddr"></div>
                    <div class="rate_count">
                        <img src="/dist/image/star.svg">
                        <div class="placeRate">${star}</div>
                        <div class="placeRateCount">(${number})</div>
                    </div>
                    <div class="placeImgDiv">
                        <div class="placeImg"></div>
                    </div>
                </li>`;
                document.querySelector('.contentArea').insertAdjacentHTML('beforeend', content);
                getAddr(key.scheContentId);
                getImage(key.scheContentId);

                document.querySelector('.checkName').innerText = result[0].scheName;
                document.querySelector('.nameZone').innerText = result[0].scheName;
                const startDate = result[0].scheStart.substring(0, 10).replaceAll('-', '.')
                const endDate = result[0].scheEnd.substring(0, 10).replaceAll('-', '.')
                document.querySelector('.checkDate').innerHTML = `${startDate} ~ ${endDate}`;

                if (result[0].scheCount === 1) {
                    document.querySelector('.day2').innerText = 'Day 2';
                } else if (result[0].scheCount === 2) {
                    document.querySelector('.day2').innerText = 'Day 2';
                    document.querySelector('.day3').innerText = 'Day 3';
                }
            })
        })
    }

    //메모여부확인
    getMemo(sco).then(r => {
        const memoContents = document.querySelector('.memoContents');
        console.log(r)
        if (!r.sco==0) {
            document.querySelector('.plusImg').remove();
            memoContents.innerHTML = `${r.scheMemoContent}`;
            memoContents.readOnly = true;
            document.querySelector('.saveMemo').style.display='hidden';
            memoWrap.innerHTML += `<button class="modifyMemo" onclick="modifyMemoContent()">수정</button>
                        <button class="modifyMemoSave" onclick="modifyMemoContentSave()">저장</button>`
        }
    });

    //드래그 슬라이드 부분
    slideWrap.addEventListener('mousedown', e => {
        pressed = true;
        startPoint = e.offsetX - innerSlide.offsetLeft;
        slideWrap.style.cursor = 'grabbing';
    });

    slideWrap.addEventListener('mousemove', e => {
        if (!pressed) return;
        e.preventDefault();
        x = e.offsetX;
        innerSlide.style.left = `${x - startPoint}px`;

        checkBoundary();
        checkSelectedItem();
    });

    window.addEventListener('mouseup', () => {
        pressed = false;
        slideWrap.style.cursor = 'grab';
    });

    slideWrap.addEventListener('mouseleave', () => {
        pressed = false;
    });

});

function editRoleUser() {
    getCompanion(sco)
        .then(companionList => {
            console.log(companionList); // Check if companionList is correct
            companionList.sort((a, b) => a.uno - b.uno);

            const rolePromises = companionList.map((res, index) => {
                return getUserRole(res.uno, sco).then(r => ({
                    res,
                    r,
                    index
                }));
            });

            return Promise.all(rolePromises);
        })
        .then(results => {
            const companionUl = document.querySelector('.companionUl');
            if (!companionUl) {
                console.error('companionUl element not found!');
                return;
            }

            companionUl.innerHTML = ''; // Clear existing items

            results.forEach(({ res, r, index }) => {
                const isCurrentUser = (res.uno === unoNum) ? ' (나)' : '';
                const isCheckedEditor = (r.scheRole === 1) ? 'checked' : '';
                const isCheckedCompanion = (r.scheRole !== 1) ? 'checked' : '';

                const li = document.createElement('li');
                li.className = 'companionLi';
                li.setAttribute('data-uno', res.uno);

                li.innerHTML = `
                    <img src="${res.profile ? `/profile/${res.profile}` : '/dist/image/smile-beam.svg'}">
                    <span class="compaNick changeRole">${res.nickName}${isCurrentUser}
                        <img src="/dist/image/minus-circle.svg" style="width: 20px; height: 20px" class="deleteCompanionBtn" onclick="deleteCompanion(sco, ${res.uno}, '${res.nickName}')">
                    </span>
                    <div class="checkRole">
                        <label>
                            <input type="radio" name="role_${res.uno}" value="1" ${isCheckedEditor}> 편집자
                        </label>
                        <label>
                            <input type="radio" name="role_${res.uno}" value="0" ${isCheckedCompanion}> 동행자
                        </label>
                    </div>
                `;

                companionUl.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error in processing companions:', error);
        });
}


function deleteCompanion(sco, uno, nick) {
    if (confirm(`${nick}님을 동행인에서 삭제하시겠습니까?`)) {
        const companionLi = document.querySelector(`.companionLi[data-uno="${uno}"]`);
        if (companionLi) {
            companionLi.remove();
        }
        document.querySelector('.editRoleSave').addEventListener('click',()=>{
            fetch(`/schedule/deleteCompanion/${sco}/${uno}`, {
                method: 'DELETE'
            }).then(response => response.json())
                .then(data => {
                    console.log(data)
                    if (data === 1) {
                        console.log("동행인 삭제됨")
                        location.reload();
                    } else {
                        console.log("동행인 삭제 중 오류발생")
                    }
                })
                .catch(error => {
                    console.error('Fetch 오류:', error);
                    alert('서버와 통신 중 오류가 발생하였습니다.');
                });

        })
    }
}



document.querySelector('.editRoleSave').addEventListener('click', () => {
    const companionList = document.querySelectorAll('.companionLi');
    const updates = [];

    companionList.forEach(li => {
        const radioEditor = li.querySelector(`input[type="radio"][value="1"]`);
        const radioCompanion = li.querySelector(`input[type="radio"][value="0"]`);
        let roleValue;

        // 선택된 역할 확인
        if (radioEditor && radioEditor.checked) {
            roleValue = 1;
        } else if (radioCompanion && radioCompanion.checked) {
            roleValue = 0;
        } else {
            return;
        }

        const uno = li.getAttribute('data-uno');
        updates.push({uno, roleValue});
    });

    if(updates.length>0 && confirm("수정된 권한을 저장하시겠습니까?")){
        updates.forEach(({uno, roleValue})=>{
            updateRole(uno, sco, roleValue);
        })
    }
});

function updateRole(uno, sco, roleValue){
    fetch(`/schedule/updateRole/${uno}/${sco}`,{
        method:'POST',
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify({role:roleValue})
    }).then(response=>response.json())
        .then(data=>{
            console.log(data);
            if (data === 1) {
                alert(`권한이 저장되었습니다.`);
                location.reload();
            } else {
                alert('동행인 삭제 중 오류가 발생하였습니다. \n다시 시도해주세요.');
            }
        })
}

//메모모달 열기/닫기
function openModal() {
    memoModal.style.display = 'flex';
}
function closeModal() {
    memoModal.style.display = 'none';
}

//메모저장부분
function saveMemoF() {
    const memo = document.querySelector('.memoContents').value;
    console.log(memo);
    if (memo === '') {
        alert('먼저 메모를 작성해주세요.');
        document.querySelector('.memoContents').focus();
    } else {
        if (confirm('메모를 저장하시겠습니까?')) {
            fetch(`/schedule/memo/${sco}/${userNickname}`, {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(memo)
            })
                .then(response => response.text())
                .then(data => {
                    console.log(data)
                    if (data === "1") {
                        alert("메모가 저장되었습니다!")
                        location.reload();
                        document.querySelector('.memoModal').style.display = 'block';
                    } else {
                        alert("메모 저장 중 오류가 발생했습니다. \n다시 시도해주세요.");
                    }
                })
        }
    }
}

//메모수정
let isEditing = false; //편집상태 저장
function modifyMemoContent() {
    const memoContent = document.querySelector('.memoContents');
    if (!isEditing) {
        memoContent.readOnly = false;
        memoContent.focus();
        isEditing = true;
    }
}

function modifyMemoContentSave(){
    const memoContent = document.querySelector('.memoContents');
    const memo = memoContent.value;
    if (memo === '') {
        if (confirm("모든 메모를 지우시겠습니까?")) {
            fetch(`/schedule/memoDelete/${sco}`, {
                method: 'delete'
            })
                .then(response => response.text())
                .then(data => {
                    console.log(data)
                    if (data === "1") {
                        alert("메모가 삭제되었습니다.")
                        document.querySelector('.modifyMemo').remove();
                        // memoModal.style.display = 'none';
                        location.reload();
                    }
                })
        }
    } else {
        fetch(`/schedule/memoModify/${sco}`, {
            method: 'put',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(memo)
        })
            .then(response => response.text())
            .then(data => {
                console.log(data)
                if (data === "1") {
                    alert("메모 수정이 완료되었습니다.")
                    memoContent.readOnly = true;
                    isEditing = false;
                    location.reload();
                    // memoModal.style.display = 'flex';
                } else {
                    alert("메모 수정에 오류가 발생했습니다.\n다시 시도해주세요.")
                }
            })
    }
}

//이미지로드
function getImage(key) {
    const url = `https://apis.data.go.kr/B551011/KorService1/detailImage1?MobileOS=ETC&MobileApp=TripTrav&_type=json&subImageYN=Y&contentId=${key}&serviceKey=${tourAPIKEY}`;
    let imgCount = 0;
    const imgLi = document.querySelector(`li[data-id="${key}"] .placeImg`);

    getData(url).then(res => {
        if (res.totalCount < 1) {
            if (imgLi) {
                imgLi.innerHTML += `<img src="/dist/image/noimage.jpg">`;
            }
        } else {
            res.items.item.forEach(img => {
                if (imgCount < 3 && imgLi) {
                    imgLi.innerHTML += `<img src="${img.originimgurl}">`;
                    imgCount++;
                }
            })
        }
    })
}

async function getSlideImg(key) {
    const url = `https://apis.data.go.kr/B551011/KorService1/detailImage1?MobileOS=ETC&MobileApp=TripTrav&_type=json&subImageYN=Y&contentId=${key}&serviceKey=${tourAPIKEY}`;
    const innerSlide = document.querySelector('.innerSlide');
    let addedLocations = new Set();

    const res = await getData(url)
    // console.log(res);
    res.items.item.forEach(img => {
        if (!addedLocations.has(img.contentid)) {
            innerSlide.innerHTML += `<div class="slideItem" style="background-image: url('${img.originimgurl}'); background-size: cover; background-position: center; background-repeat: no-repeat;"></div>`;

            addedLocations.add(img.contentid);
        }
    });
}


var map;
var markers = [];

//지도출력
function initKakaoMap() {
    getAllCourse(sco).then(result => {
        fetch('/dist/json/mapData.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('JSON 파일 로딩 실패');
                }
                return response.json();
            })
            .then(data => {
                const firstResult = result[0];
                const matchedItem = data.find(item => item.contentid == firstResult.scheContentId);

                if (matchedItem) {
                    const mapx = matchedItem.mapx;
                    const mapy = matchedItem.mapy;

                    var mapContainer = document.getElementById('checkMap');
                    var mapOption = {
                        center: new kakao.maps.LatLng(mapy, mapx),
                        level: 5
                    };

                    map = new kakao.maps.Map(mapContainer, mapOption);

                    addMarkersWithLabels(result, data);
                    addPolyline(result,data)
                } else {
                    console.error('일치하는 첫 번째 결과의 좌표를 찾을 수 없습니다.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
}

//마커라벨
function addMarkersWithLabels(result, data) {
    removeMarkers();

    result.forEach(resultItem => {
        const matchedItem = data.find(item => item.contentid == resultItem.scheContentId);
        if (matchedItem) {
            const mapx = matchedItem.mapx;
            const mapy = matchedItem.mapy;
            const title = matchedItem.title;
            var marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(mapy, mapx),
                map: map,
                title: title,
                content: title
            });
            markers.push(marker);
            var mLabel = new kakao.maps.InfoWindow({
                position: new kakao.maps.LatLng(mapy, mapx),
                content: `<span class="info-title">${title}</span>`
            });
            mLabel.open(map, marker);
        }
    });

    setTimeout(() => {
        var infoTitle = document.querySelectorAll('.info-title');
        infoTitle.forEach(function (e) {
            var w = e.offsetWidth + 10;
            var ml = w / 2;
            e.parentElement.style.top = "82px";
            e.parentElement.style.left = "50%";
            e.parentElement.style.marginLeft = -ml + "px";
            e.parentElement.style.width = w + "px";
            e.parentElement.style.fontFamily="LINESeedKR-Rg";
            e.parentElement.style.paddingTop="2px"
            e.parentElement.previousSibling.style.display = "none";
            e.parentElement.parentElement.style.border = "0px";
            e.parentElement.parentElement.style.background = "unset";
        });
    }, 0);
}


//마커제거
function removeMarkers() {
    markers.forEach(marker => {
        marker.setMap(null);
    });
    markers = [];
}

//선긋기
function addPolyline(result, data) {
    const coordinates = [];
    result.forEach(resultItem => {
        const matchedItem = data.find(item => item.contentid == resultItem.scheContentId);

        if (matchedItem) {
            const latLng = new kakao.maps.LatLng(matchedItem.mapy, matchedItem.mapx);
            coordinates.push(latLng);
        }
    });

    if (coordinates.length > 1) {
        var polyline = new kakao.maps.Polyline({
            path: coordinates,
            strokeWeight: 5,
            strokeColor: 'blue',
            strokeOpacity: 0.7,
            strokeStyle: 'solid'
        });

        polyline.setMap(map);
    } else {
        console.log('연결할 장소가 2개 이상 필요합니다.');
    }
}




//주소삽입
function getAddr(key) {
    const addrLi = document.querySelector(`li[data-id="${key}"] .placeAddr`);
    const titleLi = document.querySelector(`li[data-id="${key}"] .placeName`);
    const cateLi = document.querySelector(`li[data-id="${key}"] .placeCate`)

    fetch('/dist/json/planData.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch JSON file");
            }
            return response.json();
        })
        .then(jsonData => {
            const result = jsonData.find(item => item.contentid == key);

            if (result) {
                addrLi.innerHTML = result.addr1;
                titleLi.innerHTML = result.title;
                if(result.cat1=="A02" || result.cat1=="AO1"){
                    fetch('/dist/json/planCategory.json')
                        .then(response=> response.json())
                        .then(cate =>{
                            const category = cate.find(item=>item.categoryCode == result.cat3)
                            if(category){
                                if(result.cat1=="A02"){
                                    cateLi.innerHTML="인문 (문화,예술,역사) > ";
                                }
                                cateLi.innerHTML+=category.categoryName;
                            }
                        })
                } else {
                    if (result.cat1 == "A03") {
                        cateLi.innerHTML = "레포츠";
                    } else if (result.cat1 == "A04") {
                        cateLi.innerHTML = "쇼핑";
                    } else if (result.cat1 == "A05") {
                        cateLi.innerHTML = "음식";
                    } else if (result.cat1 == "B02") {
                        cateLi.innerHTML = "숙박";
                    } else {
                        cateLi.innerHTML = "기타";
                    }
                }
            } else {
                console.log(`Content with id ${key} not found`);
            }
        })
        .catch(error => {
            console.error("Error fetching the JSON file:", error);
        });
}

//동행자 추가 모달
const personModal = document.querySelector('.personModal');
const pmCloseBtn = document.querySelector('.pmCloseBtn');

function addPersonF() {
    const url = window.location.href;
    document.querySelector('.pmShareValue').value = url;
    personModal.style.display = 'flex';
    generateInviteUrl(sco, unoNum)
        .then(result => {
            let clipboard = new ClipboardJS('.copyUrl', {
                text: function () {
                    return result.inviteUrl;
                }
            });
            clipboard.on('success', function (e) {
                alert('클립보드에 복사되었습니다.');
                console.log(e)
            })
            clipboard.on('error', function (e) {
                console.log(e);
            })
            console.log(result);
        })
}

//동행자 확인 모달
const companionModal = document.querySelector('.companionModal');

//동행자 확인 함수
function checkPersonF() {
    fetch(`/schedule/getCompanion/${sco}`, {
        method: 'get'
    }).then(response => response.json())
        .then(data => {
            console.log(data)
            if (data) {
                companionModal.style.display = 'flex';
                if (data.length > 0) {
                    data.sort((a, b) => a.uno - b.uno);
                    data.forEach(r => {
                        const li = `<li class="companionLi"><img src="${r.profile ? `/profile/${r.profile}` : '/dist/image/smile-beam.svg'}"><span class="compaNick">${r.nickName}</span></li>`
                        document.querySelector('.companionUl').innerHTML += li;
                    })
                } else {
                    document.querySelector('.editRole').classList.add('hidden');
                    document.querySelector('.editRoleSave').classList.add('hidden');
                    document.querySelector('.companionUl').innerHTML+=`<img src="/dist/image/face-sad-sweat.svg" class="sadFace">
                            <div class="noPeopleText">여행을 함께하는 동행자가 없습니다. <span class="urlText">URL을 이용해 동행자를 초대해보세요!</span></div>`
                }
            }
        })
}

pmCloseBtn.addEventListener('click', () => {
    personModal.style.display = 'none';
})

function closeCmClose(){
    companionModal.style.display='none';
    document.querySelector('.companionUl').innerHTML='';
}

async function generateInviteUrl() {
    const response = await fetch("/invite", {
        method: 'get',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({sco: sco, uno: unoNum})
    })

    const result = await response.json();

    if (response.ok) {
        console.log("초대")
    } else {
        console.log("초대 오류" + result.message);
    }
}

//상단 슬라이드 길이 계산 함수
function updateInnerSlideWidth() {
    //div 개수따라 totalWidth 값 설정되도록
    slideItems = document.querySelectorAll('.slideItem');
    const totalWidth = slideItems.length * slideItemWidth;
    innerSlide.style.width = `${totalWidth}px`;
    document.querySelector('.innerLine').style.width = `${totalWidth - 215}px`;
}

//슬라이드 길이 체크(왼쪽, 오른쪽 더 넘어가지 않도록)
function checkBoundary() {
    const outerRect = slideWrap.getBoundingClientRect();
    const innerRect = innerSlide.getBoundingClientRect();
    const lastSlideItem = slideItems[slideItems.length - 1]; // 마지막 slideItem

    if (parseInt(innerSlide.style.left) > 0) {
        innerSlide.style.left = '0px';
    }

    const maxLeft = outerRect.width - innerRect.width;

    if (innerRect.right < outerRect.right) {
        const minLeft = Math.min(outerRect.width - innerRect.width, 0);
        if (parseInt(innerSlide.style.left) < minLeft) {
            innerSlide.style.left = `${minLeft}px`;
        }
    }
}

//일정위치에서 div 사이즈 변경
function checkSelectedItem() {
    const center = slideWrap.getBoundingClientRect().width / 1.5;
    const expandRange = 100;

    slideItems.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 1.5;
        const distance = Math.abs(center - itemCenter);

        if (distance < expandRange) {
            item.style.width = '195px';
            item.style.height = '195px';
            item.style.marginTop = '-35px';

            const dot = item.querySelector('.dot');
            if (dot) {
                dot.classList.add('selectDot');
            }
        } else {
            item.style.width = '160px';
            item.style.height = '160px';
            item.style.marginTop = '0px';

            const dot = item.querySelector('.dot');
            if (dot) {
                dot.classList.remove('selectDot');
            }
        }
    });
}

//슬라이드 div 하단 dot 생성
function makeDot() {
    slideItems.forEach(item => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        item.appendChild(dot);
    })
}

//map 위에 띄우는 content
let openBtn = document.querySelector('.mapOpenBtn');
let closeBtn = document.querySelector('.mapCloseBtn');
let mapContentBox = document.querySelector('.mapContentBox');

function toggleVisibility(element, isVisible) {
    element.classList.toggle("hidden", !isVisible);
    element.classList.toggle("visible", isVisible);
}

function toggleVisibilityForEach(element, isVisible) {
    element.forEach(el => {
        el.classList.toggle("hidden", !isVisible);
    })
    element.forEach(el => {
        el.classList.toggle("visible", isVisible);
    })
}

openBtn.addEventListener('click', () => {
    toggleVisibility(openBtn, false);
    toggleVisibility(mapContentBox, true);
    toggleVisibility(closeBtn, true);
    closeBtn.style.left = '364px';
});

//여행추가하기 버튼 contentArea 높이에 맞춰 위치 변경
function checkHeight() {
    const contentAreaHeight = document.querySelector('.contentArea');
    let height = contentAreaHeight.offsetHeight;
    console.log(height)
    const addPlan = document.querySelector('.addPlan');

    if (height > 980) {
        addPlan.style.marginTop = '12px';
        addPlan.style.marginBottom = '12px';
    } else {
        addPlan.style.marginTop = '610px';
        addPlan.style.marginBottom = '0px';
    }
}

closeBtn.addEventListener('click', () => {
    if (!depth2.classList.contains('hidden')) {
        depth2.classList.add('hidden');
        closeBtn.style.left = '364px'
    } else {
        if (btnText.innerText === '저장') {
            if (confirm('현재 일정을 저장하시겠습니까?')) {
                closeContent();
            }
        }
        closeContent();

    }
});

function closeContent() {
    toggleVisibility(openBtn, true);
    toggleVisibility(mapContentBox, false);
    toggleVisibility(closeBtn, false);
    depth2.classList.add("hidden");
    searchInput.value = '';
    document.querySelector('.searchResultDiv').innerHTML = '';
    document.querySelector('.editPlanTitle').classList.add('hidden');

    const deleteBtn = document.querySelectorAll('.deletePlan');
    const changeBtn = document.querySelectorAll('.changePlan');
    deleteBtn.forEach(btn => {
        btn.classList.add('hidden');
    })
    changeBtn.forEach(btn => {
        btn.classList.add('hidden');
    })
    btnText.innerText = '편집';
    btnText.classList.remove('saveBtn');
    btnText.classList.add('editBtn');

    const li = ul.querySelectorAll('li');
    li.forEach(item => {
        item.classList.toggle('on', item.getAttribute('data-number') === '1');
    })
    const depth2_recomm = document.querySelectorAll('.depth2_recomm');
    const depth2_search = document.querySelectorAll('.depth2_search_input_area');
    const depth2_heart = document.querySelectorAll('.depth2_heart');
    const depth2_search_input = document.querySelector('.depth2_search_input_area');
    toggleVisibilityForEach(depth2_recomm, true);
    toggleVisibilityForEach(depth2_search, false);
    toggleVisibilityForEach(depth2_heart, false);
    toggleVisibility(depth2_search_input, false);
}

//일정추가 2depth
const addPlan = document.querySelector('.addPlan');
const depth2 = document.querySelector('.mapContentBox2Depth');

function clickAddPlan() {
    depth2.classList.remove('hidden');
    depth2.classList.add('visible');
    closeBtn.style.left = '721px';
    document.querySelector('.depth2_recomm').classList.remove('hidden');
    recommendData();
}

const ul = document.querySelector('.depth2_ul');
ul.addEventListener('click', (e) => {
    const clickNumber = e.target.getAttribute('data-number');
    const li = ul.querySelectorAll('li');

    if (!clickNumber) return;

    li.forEach(item => {
        item.classList.toggle('on', item.getAttribute('data-number') === clickNumber);
    })

    const elements = {
        recommend: document.querySelectorAll('.depth2_recomm'),
        search: document.querySelectorAll('.depth2_search'),
        heart: document.querySelectorAll('.depth2_heart'),
        searchInput: document.querySelector('.depth2_search_input_area'),
        morePlaceBtn: document.querySelector('.morePlaceBtn'),
        searchResultDiv: document.querySelector('.searchResultDiv')
    }

    const state = {
        '1': {recommend: false, search: true, heart: true, searchInput: true, morePlaceBtn: true, searchResultDiv: true},
        '2': {recommend: true, search: false, heart: true, searchInput: false, morePlaceBtn: false, searchResultDiv: false},
        '3': {recommend: true, search: true, heart: false, searchInput: true, morePlaceBtn: true, searchResultDiv: true}
    }

    const currentState = state[clickNumber];

    Object.keys(currentState).forEach(key => {
        const element = elements[key];
        if (NodeList.prototype.isPrototypeOf(element)) {
            element.forEach(item => {
                item.classList.toggle('hidden', currentState[key]);
            })
        } else {
            if (element) {
                element.classList.toggle('hidden', currentState[key]);
            }
        }
    })
})

// 추천여행지
function recommendData() {
    // 현재 일정 배열
    const liItems = document.querySelectorAll('.contentArea .oneContent');
    const planDataArray = [];

    liItems.forEach((item) => {
        const data = item.getAttribute('data-id');
        planDataArray.push(data);
    });
    console.log(planDataArray);

    if (planDataArray.length > 0) {
        const lastData = planDataArray[planDataArray.length - 1];
        const url = `https://apis.data.go.kr/B551011/KorService1/detailCommon1?MobileOS=ETC&MobileApp=TripTrav&contentId=${lastData}&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&serviceKey=${tourAPIKEY}&_type=json`;
        console.log(url);

        let currentPage = 1;
        const itemsPerPage = 10;
        let totalCount = 0;

        getData(url).then(result => {
            const mapx = result.items.item[0].mapx;
            const mapy = result.items.item[0].mapy;
            const mapUrl = `https://apis.data.go.kr/B551011/KorService1/locationBasedList1?MobileOS=ETC&MobileApp=TripTrav&_type=json&arrange=S&numOfRows=200&mapX=${mapx}&mapY=${mapy}&radius=2000&serviceKey=${tourAPIKEY}`;

            getData(mapUrl).then(res => {
                totalCount = res.totalCount;
                console.log(totalCount);

                if (totalCount >= 1) {
                    displayItems(res.items.item, currentPage, itemsPerPage);
                    createMoreButton(totalCount, res.items.item);
                }
            });
        });

        function createMoreButton(totalCount, items) {
            const moreBtnExists = document.querySelector('.morePlaceBtn');
            if (totalCount > currentPage * itemsPerPage && !moreBtnExists) {
                const moreBtn = document.createElement('div');
                moreBtn.classList.add('morePlaceBtn');
                moreBtn.innerHTML = `더보기<img src="/dist/image/chevron-down.svg">`;
                document.querySelector('.depth2_recomm').appendChild(moreBtn);

                moreBtn.addEventListener('click', () => {
                    currentPage++;
                    moreBtn.remove();
                    loadMore(items);
                });
            }
        }

        function loadMore(items) {
            displayItems(items, currentPage, itemsPerPage);
        }

        function displayItems(items, currentPage, itemsPerPage) {
            const start = (currentPage - 1) * itemsPerPage;
            const end = Math.min(start + itemsPerPage, items.length);
            const itemsToDisplay = items.slice(start, end);

            document.querySelector('.depth2_recomm').innerHTML = '';

            itemsToDisplay.forEach(key => {
                const recommDiv = document.createElement('div');
                recommDiv.classList.add('recomm_area');

                recommDiv.innerHTML += `
                    <div class="recomm_img" style="background-image: url('${key.firstimage}'); background-position: center; background-repeat: no-repeat; background-size: cover"></div>
                    <div class="recomm_name_cate" data-id="${key.contentid}" onclick="locationPage(${key.contentid})">
                        <div class="name_cate2">
                            <span class="recomm_name">${key.title}</span>
                            <span class="recomm_cate"></span>
                        </div>
                        <span class="recomm_addr">${key.addr1}</span>
                    </div>
                    <div class="recomm_addBtn" onclick="newPlan(event)" style="background-image: url('/dist/image/plus-circle.svg'); background-size: cover; background-repeat: no-repeat; background-position: center"></div>`;

                document.querySelector('.depth2_recomm').appendChild(recommDiv);

                const recommCate = recommDiv.querySelector('.recomm_cate');
                const recommNameCate = recommDiv.querySelector('.recomm_name_cate');
                assignCategory(recommCate, recommNameCate, key);

                const recommAddBtn = recommDiv.querySelector('.recomm_addBtn');
                recommAddBtn.addEventListener('mouseover', () => {
                    recommAddBtn.style.backgroundImage = "url('/dist/image/plus-circle-back.svg')";
                    recommAddBtn.style.cursor = 'pointer';
                });
                recommAddBtn.addEventListener('mouseout', () => {
                    recommAddBtn.style.backgroundImage = "url('/dist/image/plus-circle.svg')";
                });
            });
        }

        function assignCategory(recommCate, recommNameCate, key) {
            if (key.cat1 === "A02" || key.cat1 === "A01") {
                fetch('/dist/json/planCategory.json')
                    .then(response => response.json())
                    .then(cate => {
                        const category = cate.find(c => c.categoryCode === key.cat3);
                        recommCate.innerHTML = key.cat1 === "A02" ? "인문 (문화,예술,역사) > " + category.categoryName : category.categoryName;
                    });
            } else {
                const categoryName = getCategoryName(key.cat1);
                recommCate.innerHTML = categoryName;

                if (categoryName === "기타") {
                    recommNameCate.style.marginTop = '23px';
                } else {
                    recommNameCate.style.marginTop = ''; // 기타가 아닐 경우 margin-top 초기화
                }
            }
        }

        function getCategoryName(cat1) {
            switch (cat1) {
                case "A03":
                    return "레포츠";
                case "A04":
                    return "쇼핑";
                case "A05":
                    return "음식";
                case "B02":
                    return "숙박";
                default:
                    return "기타";
            }
        }
    }
}

function locationPage(addr1, key, name) {
    if(addr1 == null){
        if(confirm("현재 페이지를 벗어나시겠습니까? \n페이지 수정내용이 저장되지 않을 수 있습니다.")){
            location.href = `https://www.google.com/search?q=${encodeURIComponent(name)}`
        }
    }else{
        if(confirm("현재 페이지를 벗어나시겠습니까? \n페이지 수정내용이 저장되지 않을 수 있습니다.")){
            location.href=`/place/${key}`;
        }
    }
}

//검색(2Depth)
const searchBtn = document.querySelector('.depth2_searchBtn');
const searchInput = document.querySelector('.depth2_input');
const resultDiv = document.querySelector('.searchResultDiv');

searchBtn.addEventListener('click', () => {
    resultDiv.innerHTML='';
    search();
})

searchInput.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        resultDiv.innerHTML='';
        search();
    }
})

const searchDataArray=[];
function baseSearch() {
    const existingResultDiv = document.querySelector('.searchResultDiv .depth2_search_area');

    if (existingResultDiv) {
        return;
    }

    const liItems = document.querySelectorAll('.contentArea .oneContent');
    const searchDataArray = [];

    liItems.forEach((item) => {
        const data = item.getAttribute('data-id');
        searchDataArray.push(data);
    });

    if (searchDataArray.length > 0) {
        const lastData = searchDataArray[searchDataArray.length - 1];
        fetch('/dist/json/planData.json')
            .then(response => response.json())
            .then(jsonData => {
                const area = jsonData.find(item => item.contentid === lastData);

                if (area) {
                    const areaCode = area.areacode;
                    const url = `https://apis.data.go.kr/B551011/KorService1/areaBasedList1?MobileOS=ETC&MobileApp=TripTrav&_type=json&arrange=O&areaCode=${areaCode}&numOfRows=10&contentTypeId=12&serviceKey=${tourAPIKEY}`;
                    // document.querySelector('.depth2_search_input_area').innerHTML=``;
                    // document.querySelector('.depth2_search_input_area').innerHTML=`<input class="depth2_input">
                    // <button type="submit" class="depth2_searchBtn"><img src="/dist/image/search.svg"></button>`;

                    getData(url).then(result => {
                        result.items.item.forEach(async (key) => {
                            const base = document.createElement('div');
                            base.classList.add('depth2_search_base');
                            base.innerHTML = `
                                <div class="search_img" style="background-image: url('${key.firstimage}'); background-position: center; background-repeat: no-repeat; background-size: cover"></div>
                                <div class="search_name_cate" data-id="${key.contentid}" onclick="locationPage(${key.addr1 ? `'${key.addr1}'` : null}, '${key.contentid}', '${key.title}')">

                                    <div class="name_cate2">
                                        <span class="search_name">${key.title}</span>
                                        <span class="search_cate"></span>
                                    </div>
                                    <span class="search_addr">${key.addr1}</span>
                                </div>
                                <div class="search_addBtn" onclick="newPlan(event)" style="background-image: url('/dist/image/plus-circle.svg'); background-size: cover; background-repeat: no-repeat; background-position: center"></div>`;
                            document.querySelector('.depth2_search_input_area').appendChild(base);

                            const searchCate = base.querySelector('.search_cate');
                            const category = await getCategoryName(key); // 비동기 함수로 카테고리 값을 가져옴
                            searchCate.innerHTML = category;

                            const searchAddBtn = base.querySelector('.search_addBtn');
                            searchAddBtn.addEventListener('mouseover', () => {
                                searchAddBtn.style.backgroundImage = "url('/dist/image/plus-circle-back.svg')";
                                searchAddBtn.style.cursor = 'pointer';
                            });
                            searchAddBtn.addEventListener('mouseout', () => {
                                searchAddBtn.style.backgroundImage = "url('/dist/image/plus-circle.svg')";
                            });
                        });
                    });
                }
            });
    }
}

async function getCategoryName(key) {
    if (key.cat1 === "A02" || key.cat1 === "A01") {
        const response = await fetch('/dist/json/planCategory.json');
        const cate = await response.json();
        const category = cate.find(c => c.categoryCode === key.cat3);
        if (category) {
            if (key.cat1 === "A02") {
                return "인문 (문화,예술,역사) > " + category.categoryName;
            } else {
                return category.categoryName;
            }
        }
    } else {
        switch (key.cat1) {
            case "A03":
                return "레포츠";
            case "A04":
                return "쇼핑";
            case "A05":
                return "음식";
            case "B02":
                return "숙박";
            default:
                return "기타";
        }
    }
}

function search() {
    if (searchInput.value === '') {
        alert('검색어를 입력해주세요.');
        baseSearch();
    } else {
        // 초기화
        document.querySelectorAll('.depth2_search_base').forEach(base => {
            base.remove();
        });

        let currentPage = 1;
        const itemsPerPage = 10;
        let totalCount = 0;
        let keyword = searchInput.value;
        let url = `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?serviceKey=${tourAPIKEY}&MobileApp=TripTrav&MobileOS=ETC&pageNo=&numOfRows=100&listYN=Y&&arrange=O&contentTypeId=12&keyword=${keyword}&_type=json`;

        function displayResult(result) {
            totalCount = result.totalCount;

            if (totalCount >= 1) {
                const start = (currentPage - 1) * itemsPerPage;
                const end = Math.min(start + itemsPerPage, totalCount);
                const itemsDisplay = result.items.item.slice(start, end);

                itemsDisplay.forEach(async (key) => {
                    const searchDiv = document.createElement('div');
                    searchDiv.classList.add('depth2_search_area');
                    searchDiv.innerHTML = `
                        <div class="search_result_img" style="background-image: url('${key.firstimage}'); background-position: center; background-repeat: no-repeat; background-size: cover"></div>
                        <div class="search_result_name_cate" data-id="${key.contentid}" onclick="locationPage(${key.addr1 ? `'${key.addr1}'` : null} ,${key.contentid},'${key.title}')">
                            <div class="name_cate2">
                                <span class="search_result_name">${key.title}</span>
                                <span class="search_result_cate"></span>
                            </div>
                            <span class="search_result_addr">${key.addr1}</span>
                        </div>
                        <div class="search_result_addBtn" onclick="newPlan(event)" style="background-image: url('/dist/image/plus-circle.svg'); background-size: cover; background-repeat: no-repeat; background-position: center"></div>`;

                    document.querySelector('.searchResultDiv').appendChild(searchDiv);

                    // 카테고리 가져오기
                    const searchCate = searchDiv.querySelector('.search_result_cate');
                    const category = await getCategoryName(key); // 비동기 함수로 카테고리 값을 가져옴
                    searchCate.innerHTML = category;

                    const searchAddBtn = searchDiv.querySelector('.search_result_addBtn');
                    searchAddBtn.addEventListener('mouseover', () => {
                        searchAddBtn.style.backgroundImage = "url('/dist/image/plus-circle-back.svg')";
                        searchAddBtn.style.cursor = 'pointer';
                    });
                    searchAddBtn.addEventListener('mouseout', () => {
                        searchAddBtn.style.backgroundImage = "url('/dist/image/plus-circle.svg')";
                    });
                });

                if (totalCount > currentPage * itemsPerPage) {
                    const moreBtn = document.createElement('div');
                    moreBtn.classList.add('morePlaceBtn');
                    moreBtn.innerHTML = `더보기<img src="/dist/image/chevron-down.svg">`;
                    document.querySelector('.searchResultDiv').appendChild(moreBtn);

                    moreBtn.addEventListener('click', () => {
                        currentPage++;
                        moreBtn.remove();
                        loadMore();
                    });
                }

                requestAnimationFrame(() => {
                    const imageDivs = document.querySelectorAll('.search_result_img');
                    imageDivs.forEach(img => {
                        const imageUrl = img.style.backgroundImage;
                        if (!imageUrl || imageUrl.includes('no-image.svg')) {
                            img.style.backgroundImage = 'url(/dist/image/placeholder.svg)';
                        }
                    });
                    addButtonListeners();
                });
            } else {
                const noResult = `<div class="noResult visible"><img src="/dist/image/alert-circle.svg">검색결과가 없습니다</div>`;
                document.querySelector('.searchResultDiv').innerHTML = noResult;
            }
        }

        function loadMore() {
            let nextPageUrl = `${url}&pageNo=${currentPage}`;
            searchKeyword(nextPageUrl).then(result => {
                displayResult(result);

                if (currentPage * itemsPerPage >= totalCount) {
                    document.querySelector('.morePlaceBtn').remove();
                }
            });
        }

        searchKeyword(url).then(result => {
            displayResult(result);
        });
    }
}


function addButtonListeners() {
    const addPlanBtn = document.querySelectorAll('.addPlanBtn');
    addPlanBtn.forEach(btn => {
        console.log(btn);
        btn.addEventListener('mouseover', () => {
            btn.style.backgroundImage = "url('/dist/image/plus-circle-back.svg')";
            btn.style.cursor = 'pointer';
        });
        btn.addEventListener('mouseout', () => {
            btn.style.backgroundImage = "url('/dist/image/plus-circle.svg')";
        });
    });
}

async function searchKeyword(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const items = data.response.body;
        return items;
    } catch (err) {
        console.log(err);
    }
}

//일정삽입하기
const btnText = document.querySelector('.btnText');

function newPlan(event) {
    if (btnText.innerText === '편집') {
        if (confirm('일정을 편집하시겠습니까?')) {
            if (!document.querySelector('.noPlanText').classList.contains('.hidden')) {
                document.querySelector('.noPlanText').classList.add('hidden');
            }
            const deleteBtn = document.querySelectorAll('.deletePlan');
            const changeBtn = document.querySelectorAll('.changePlan');
            deleteBtn.forEach(btn => {
                btn.classList.remove('hidden');
            })
            changeBtn.forEach(btn => {
                btn.classList.remove('hidden');
            })
            btnText.innerText = '저장';
            btnText.classList.remove('editBtn');
            btnText.classList.add('saveBtn');

            newPlanF(event);
            countTriangle();
        }
    } else {
        if (!document.querySelector('.noPlanText').classList.contains('.hidden')) {
            document.querySelector('.noPlanText').classList.add('hidden');
        }
        editPlan(event);
        newPlanF(event);
        countTriangle();
    }
}

function newPlanF(event) {
    const searchDiv = event.target.closest('.depth2_search_area, .heart_area, .recomm_area, .depth2_search_base');
    const contentId = searchDiv.querySelector('.search_result_name_cate, .heart_name_cate, .recomm_name_cate, .search_name_cate').getAttribute('data-id');
    const placeName = searchDiv.querySelector('.search_result_name, .heart_name, .recomm_name, .search_name').innerText
    const placeAddress = searchDiv.querySelector('.search_result_addr, .heart_addr, .recomm_addr, .search_addr').innerText;
    const placeCate = searchDiv.querySelector('.search_result_cate, .heart_cate, .recomm_cate, .search_cate').innerText;

    const existingLi = document.querySelector(`.contentArea li[data-id="${contentId}"]`);
    if(existingLi) {
        alert('이미 추가된 장소입니다.')
        return
    }

    const star = getRandomRating();
    const number = getRandomNumber();
    const newLi = `<li class="oneContent" data-id="${contentId}">
                            <div class="deletePlan" onclick="deletePlan(event)">&times;</div>
                            <div class="changePlan">
                                <img src="/dist/image/triangle.svg" class="triangle">
                                <img src="/dist/image/triangle.svg" class="downTriangle">
                            </div>
                            <div class="name_cate">
                                <span class="placeName">${placeName}</span>
                                <span class="placeCate">${placeCate}</span>
                            </div>
                            <div class="placeAddr">${placeAddress}</div>
                            <div class="rate_count">
                                <img src="/dist/image/star.svg">
                                <div class="placeRate">${star}</div>
                                <div class="placeRateCount">(${number})</div>
                            </div>
                            <div class="placeImgDiv">
                                <div class="placeImg"></div>
                            </div>
                        </li>`;
    document.querySelector('.contentArea').insertAdjacentHTML('beforeend', newLi);
    document.querySelector('.btnText').innerText = '저장';

    getImage(contentId);
}

//버튼으로 일정순서 변경
function editPlan(event) {
    const target = event.target;
    const deleteBtn = document.querySelectorAll('.deletePlan');
    const changeBtn = document.querySelectorAll('.changePlan');
    const nameZone = document.querySelector('.nameZone');
    const titleInput = document.querySelector('.titleInput');
    const editPlanTitle = document.querySelector('.editPlanTitle');

    if (target.classList.contains('editBtn')) {
        deleteBtn.forEach(btn => {
            btn.classList.remove('hidden');
        })
        changeBtn.forEach(btn => {
            btn.classList.remove('hidden');
        })
        target.innerText = '저장';
        target.classList.remove('editBtn');
        target.classList.add('saveBtn');
        editPlanTitle.classList.remove('hidden');
    } else if (target.classList.contains('saveBtn')) {
        // 저장 버튼을 클릭했을 때
        if (confirm("일정을 저장하시겠습니까?")) {
            if (titleInput && titleInput.value === '') {
                alert('일정의 제목을 작성해주세요.')
            } else if (titleInput) {
                deleteBtn.forEach(btn => {
                    btn.classList.add('hidden');
                });
                changeBtn.forEach(btn => {
                    btn.classList.add('hidden');
                });

                target.classList.remove('saveBtn');
                target.classList.add('editBtn');
                target.innerText = '편집';

                nameZone.innerText += titleInput.value;
                titleInput.remove();
                editPlanTitle.classList.add('hidden');
                setPlanData(sco);
                // location.reload();
                alert('일정이 저장되었습니다!');
            } else {
                deleteBtn.forEach(btn => {
                    btn.classList.add('hidden');
                });
                changeBtn.forEach(btn => {
                    btn.classList.add('hidden');
                });

                target.classList.remove('saveBtn');
                target.classList.add('editBtn');
                target.innerText = '편집';
                editPlanTitle.classList.add('hidden');
                setPlanData(sco);
                // location.reload();
            }
        }
    }
}

function setPlanData(sco) {
    const planArray = [];
    const allLi = document.querySelectorAll('li.oneContent');
    let arrayKey = true;
    allLi.forEach((plan, index) => {
        const sche_content_id = plan.getAttribute('data-id');
        const sche_name = document.querySelector('.nameZone').innerText;
        const sche_date = document.querySelector('.day_focus').getAttribute('data-date');
        const sche_title = plan.querySelector('.placeName').innerText;
        const planData = {
            sche_content_id: sche_content_id,
            sche_name: sche_name,
            sche_date: sche_date,
            planIndex: index + 1,
            sche_title: sche_title,
            sco: sco
        };
        if (planArray.length > 0) {
            const lastPlan = planArray[planArray.length - 1];
            if (
                lastPlan.sche_content_id !== planData.sche_content_id ||
                lastPlan.sche_name !== planData.sche_name ||
                lastPlan.sche_date !== planData.sche_date ||
                lastPlan.planIndex !== planData.planIndex ||
                lastPlan.sche_title !== planData.sche_title ||
                lastPlan.sco !== planData.sco
            ) {
                arrayKey = false;
            }
        }
        planArray.push(planData);
        console.log(planArray);
        console.log(arrayKey)
    });
    const sche_date = document.querySelector('.day_focus').getAttribute('data-date');
    if (!arrayKey && planArray.length > 0) {
        fetch(`/schedule/modifyPlan/${sco}/${sche_date}`, {
            method: 'put',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(planArray)
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                if (data == "1") {
                    alert('일정이 저장되었습니다!');
                    location.reload();
                } else {
                    alert('일정 저장 중 오류가 발생하였습니다. \n다시 시도해주세요.');
                }
            });
    } else {
        console.log("값 변화없음");
        alert('일정이 저장되었습니다 !');
    }
}

//일정변경 버튼
function countTriangle() {
    const triangleButtons = document.querySelectorAll('.triangle');
    const downTriangleButtons = document.querySelectorAll('.downTriangle');

    triangleButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            let currentLi = button.closest('.oneContent');
            let prevLi = currentLi.previousElementSibling;

            // 이전 li가 있을 때만 동작
            if (prevLi) {
                currentLi.classList.add('moving-up');
                prevLi.classList.add('moving-down');

                requestAnimationFrame(() => {
                    setTimeout(() => {
                        currentLi.parentNode.insertBefore(currentLi, prevLi);
                        currentLi.classList.remove('moving-up');
                        prevLi.classList.remove('moving-down');
                        updateTriangleVisibility();
                    }, 400); // CSS transition 시간과 맞춰줌
                });
            }
        });
    });

    downTriangleButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            let currentLi = button.closest('.oneContent');
            let nextLi = currentLi.nextElementSibling;

            // 다음 li가 있을 때만 동작
            if (nextLi) {
                currentLi.classList.add('moving-down');
                nextLi.classList.add('moving-up');

                requestAnimationFrame(() => {
                    setTimeout(() => {
                        currentLi.parentNode.insertBefore(nextLi, currentLi);
                        currentLi.classList.remove('moving-down');
                        nextLi.classList.remove('moving-up');
                        updateTriangleVisibility();
                    }, 400); // CSS transition 시간과 맞춰줌
                });
            }
        });
    });

    function updateTriangleVisibility() {
        const allItems = document.querySelectorAll('.oneContent');

        allItems.forEach((item, index) => {
            const triangleButton = item.querySelector('.triangle');
            const downTriangleButton = item.querySelector('.downTriangle');

            if (index === 0) {
                triangleButton.style.display = 'none';
            } else {
                triangleButton.style.display = 'block';
            }

            if (index === allItems.length - 1) {
                downTriangleButton.style.display = 'none';
            } else {
                downTriangleButton.style.display = 'block';
            }
        });
    }

    updateTriangleVisibility();
}


//일정삭제
function deletePlan(event) {
    const liItems = document.querySelectorAll('.contentArea .oneContent');
    if(liItems.length===1){
        alert("일정은 최소 한 개 이상 있어야 합니다.");
        return;
    }

    if (confirm("해당 일정을 삭제 하시겠습니까?")) {
        if (event.target.classList.contains('deletePlan')) {
            const li = event.target.closest('li');
            if (li) {
                li.remove();
                countTriangle();
            }
        }
    }
}

function editTitle() {
    const titleInput = document.createElement('input');
    const titleText = document.querySelector('.contentTitle');
    const editPlanTitle = document.querySelector('.editPlanTitle');
    const nameZone = document.querySelector('.nameZone');
    titleInput.classList.add('titleInput');
    titleInput.value = titleText.innerText;
    titleInput.placeholder = '일정의 제목을 작성해주세요.';
    editPlanTitle.classList.add('hidden');
    nameZone.innerText = '';
    titleText.appendChild(titleInput);
}

window.addEventListener('load', () => {
    countTriangle();
});

async function getData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const items = data.response.body;
        return items;
    } catch (err) {
        console.log(err);
    }
}

async function getUserCourse(sco, date) {
    try {
        const url = "/schedule/course/" + sco + "/" + date;
        const config = {
            method: 'post'
        }
        const response = await fetch(url, config);
        const result = await response.json();
        return result;
    } catch (err) {
        console.log(err);
    }
}

async function getDatePlan(sco, date) {
    try {
        const url = "/schedule/plan/" + sco + "/" + date;
        const config = {method: 'post'}
        const response = await fetch(url, config);
        const result = await response.json();
        return result;
    } catch (err) {
        console.log(err);
    }
}

async function getMemo(sco) {
    try {
        const url = "/schedule/getMemo/" + sco;
        const config = {method: 'post'}
        const response = await fetch(url, config);
        const result = await response.json();
        return result;
    } catch (err) {
        console.log(err);
    }
}

async function getAllCourse(sco) {
    try {
        const url = "/schedule/allCourse/" + sco;
        const config = {method: 'post'}
        const response = await fetch(url, config);
        const result = await response.json();
        return result;
    } catch (err) {
        console.log(err);
    }
}

function getHeartData(){
    fetch('/dist/json/planData.json')
        .then(response=>response.json())
        .then(storedData=>{
            fetch("/schedule/getLikeList/"+unoNum,{
                method:'get',
            }).then(response=>response.json())
                .then(data=>{
                    const depth2_heart = document.querySelector('.depth2_heart');
                    depth2_heart.innerHTML='';
                    if(data.length>0){
                        data.forEach(likeItem=>{
                            const matchedItem = storedData.find(stored => stored.contentid === likeItem.likeCode.toString())

                            if(matchedItem) {
                                const imgUrl = matchedItem.firstimage ?  matchedItem.firstimage : '/dist/image/noImage.jpg';

                                const heartArea = document.createElement('div');
                                heartArea.classList.add('heart_area');

                                heartArea.innerHTML+=`
                                        <div class="heart_img" style="background-image: url('${imgUrl}'); background-position: center; background-repeat: no-repeat; background-size: cover"></div>
                                        <div class="heart_name_cate" data-id="${matchedItem.contentid}" onclick="locationPage(${matchedItem.addr1 ? `'${matchedItem.addr1}'` : null} ,${matchedItem.contentid}, '${matchedItem.title}')">
                                            <div class="name_cate2">
                                                <span class="heart_name">${matchedItem.title}</span>
                                                <span class="heart_cate"></span>
                                            </div>
                                            <span class="heart_addr">${matchedItem.addr1}</span>
                                        </div>
                                        <div class="heart_addBtn" onclick="newPlan(event)" style="background-image: url('/dist/image/plus-circle.svg'); background-size: cover; background-repeat: no-repeat; background-position: center"></div>`
                                depth2_heart.appendChild(heartArea);

                                const heartCate = heartArea.querySelector('.heart_cate');
                                const heartAddBtn = heartArea.querySelector('.heart_addBtn');

                                if (matchedItem.cat1 == "A02" || matchedItem.cat1 == "A01") {
                                    fetch('/dist/json/planCategory.json')
                                        .then(response => response.json())
                                        .then(cate => {
                                            const category = cate.find(c => c.categoryCode == matchedItem.cat3);
                                            if (category) {
                                                if (matchedItem.cat1 == "A02") {
                                                    heartCate.innerHTML = "인문 (문화,예술,역사) > " + category.categoryName;
                                                } else {
                                                    heartCate.innerHTML = category.categoryName;
                                                }
                                            }
                                        });
                                } else {
                                    if (matchedItem.cat1 == "A03") {
                                        heartCate.innerHTML = "레포츠";
                                    } else if (matchedItem.cat1 == "A04") {
                                        heartCate.innerHTML = "쇼핑";
                                    } else if (matchedItem.cat1 == "A05") {
                                        heartCate.innerHTML = "음식";
                                    } else if (matchedItem.cat1 == "B02") {
                                        heartCate.innerHTML = "숙박";
                                    } else {
                                        heartCate.innerHTML = "기타";
                                    }
                                }

                                heartAddBtn.addEventListener('mouseover', () => {
                                    heartAddBtn.style.backgroundImage = "url('/dist/image/plus-circle-back.svg')";
                                    heartAddBtn.style.cursor = 'pointer';
                                });
                                heartAddBtn.addEventListener('mouseout', () => {
                                    heartAddBtn.style.backgroundImage = "url('/dist/image/plus-circle.svg')";
                                });
                            }
                        });
                    } else {
                        depth2_heart.innerHTML = `
                                                <div class="noResultLike">
                                                    <img src="/dist/image/alert-circle.svg">
                                                    찜한 여행지가 없습니다! <span class="line2">나의 취향의 맞는 여행지를 찜 해보세요!</span>
                                                </div>`;
                    }
                })

        })
}


async function generateInviteUrl(sco, unoNum) {
    const response = await fetch("/schedule/generateInviteUrl", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({sco: sco, uno: unoNum})
    });

    const result = await response.json();

    if (response.ok) {
        console.log(result.inviteUrl);
    } else {
        console.log(result.message)
    }

    return result;
}

//유저 권환 확인
async function getUserRole(uno, sco) {
    try {
        const url = "/schedule/getUserRole/" + uno + "/" + sco
        const config = {method: 'GET'};
        const resp = await fetch(url, config);
        return resp.json();
    } catch (error) {
        console.log(error);
    }
}

//동행자 확인
async function getCompanion(sco){
    try{
        const url = "/schedule/getCompanion/"+sco;
        const config = {method:'get'};
        const resp = await fetch(url, config);
        return resp.json();
    } catch (err){
        console.log(err)
    }
}

async function getSchedule(sco){
    try{
        const url = "/schedule/getSchedule/"+sco;
        const config = {method:'get'};
        const resp = await fetch(url, config);
        return resp.json();
    } catch (err){
        console.log(err)
    }
}


//할일
//일정생성하거나 편집할때 1개면 안들어감
//동행자 편집(hidden 없애는 함수부터)**
//동행자 삭제**
//동행자 확인할때 값 누적됨**
//일정편집없는 유저 동행자확인 버튼 2개뜸(아래가 빈버튼)**
//마지막 장소 기반으로 추천 여행지 출력, 검색 기본값 출력
//일정전체적인 지역코드 저장 => 검색시 그 지역코드 기반으로 출력
//스케줄좍좍부분에 뭐넣을지
//장소카테고리 넣어야함!**
//dot 하단 길이 조절 필요
//이미지 없는 장소 forEach 못돌아서 오류남(getSlideImg 함수)
//일정 수정 후 저장 alert 두번뜸
//맨위 index는 ^버튼 삭제, 맨아래 index는 v버튼 삭제
//날짜지난일정은 메모, 동행자, 편집버튼 전부 삭제
//이름 점처리