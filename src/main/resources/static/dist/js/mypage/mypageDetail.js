var urlParams = new URLSearchParams(window.location.search);
// message=notAllowedNickName
var messageVlaue = urlParams.get("modal");
console.log(messageVlaue);
var locationValue = urlParams.get('location');
const bottom = document.getElementById("resultMyPage");
const modal = document.querySelector(".updateModal");
const preview = document.querySelector(".profileUpdateImg");

const js = "/dist/js/mypage";
const tripList = "/tripList";
const tripReview = "/tripReview";
const wishPlace = "/wishPlace";
const wishTrip = "/wishTrip";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const pwRegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
let provider = "";

pageCall(`${locationValue != null ? `/${locationValue}`: tripList}`);
pageHover(`${locationValue != null ? `${locationValue}`: `tripList`}`);
if(messageVlaue){
    openUpdateModal();
}

isSocialUser(unoNum).then(data => {
    provider = `${data.provider}`;
    var email = `${data.email.replace(/\(.*?\)/, "")}`;
    document.querySelector(".userName").innerText = `${data.nickname}`;
    document.querySelector(".userId").innerText = email;
    const profile = document.querySelectorAll(".profileUpdateImg, .profileImg");
    profile.forEach(img => {
        img.src = `${data.profile ? `/profile/${data.profile}` : '/dist/image/smile-beam.svg'}`
    });
    if (data.provider !== null) {
        document.getElementById("pw").disabled = true;
        document.querySelector(".imgBtn").disabled = true;
    }
})

document.querySelectorAll('.myPageList > li').forEach(button => {
    button.addEventListener('click', (e) => {
        const id = e.target.id;
        bottom.innerHTML = "";
        pageHover(id);
        switch (id) {
            case 'tripList':
                pageCall(tripList);
                break;
            case 'tripReview':
                pageCall(tripReview);
                break;
            case 'wishPlace':
                pageCall(wishPlace);
                break;
            case 'wishTrip':
                pageCall(wishTrip);
                break;
        }
    })
})

document.querySelector(".profileUpdateInput").addEventListener("change", (e) => {
    var img = e.target.files;
    Array.from(img).forEach(profile => {
        if (img.size > MAX_FILE_SIZE) {
            alert("파일의 최대 크기는 10MB 입니다.");
            img.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(profile);
    });
})

/*
    소설유저에 대한 처리
    소설유저일때 수정 눌렀을떄 버튼 옵션을 다르게 주기?
    유효성 검사 하기
    이미지 경로처리 방식
*/
document.getElementById("updateProfile").addEventListener("click", () => {
    const formData = new FormData();
    formData.append("uno", unoNum);
    formData.append("nickname", document.getElementById("nickName").value);
    formData.append("pw", document.getElementById("pw").value);
    formData.append("provider", provider);
    const fileInput = document.getElementById("profileUpdateImg");

    // 비동기 함수에 다른 사용법을 알게됨
    const addImageToFormData = async () => {
        if (!preview.src.includes("/dist/image/noimage.jpg")) {
            try {
                const result = await getFileFromImgSrc(preview.src);
                formData.append("profile", result);
            } catch (error) {
                console.log("이미지 파일 가져오기 오류:", error);
            }
        }
        if (fileInput.files.length > 0) {
            formData.append("profile", fileInput.files);
        }
    };

    addImageToFormData().then(() => {
        updateUser(formData).then(result => {
            if (result === '1') {
                alert("회원정보 수정 완료");
                closeUpdateModal();
                location.href = `/mypage?uno=${unoNum}`;
            } else {
                alert("회원정보 수정 실패");
                location.reload();
            }
        }).catch(err => {
            console.log(err);
        });
    });
});

document.getElementById("pw").addEventListener("keyup",()=>{
    var pwVal = document.getElementById("pw").value;
    const updateBtn = document.getElementById("updateProfile")
   if(disabledBtn(pwVal)){
       updateBtn.disabled = false;
       updateBtn.style.color = "white";
   }else{
       updateBtn.disabled = true;
       updateBtn.style.color = "red";
   }
});

function disabledBtn(value){
    if(pwRegExp.test(value) || value.length === 0){
        return true;
    }else{
        return false;
    }

}



async function updateUser(userInfo) {
    try {
        const url = "/mypage/updateUser";
        const config = {
            method: "POST",
            body: userInfo
        };
        const response = await fetch(url, config);
        return await response.text();
    } catch (e) {

    }

}

// !important 키워드에 대한 사용법을 알게됨
//페이지 호버
function pageHover(id) {
    const listItems = document.querySelectorAll(".myPageList > li");
    listItems.forEach(item => {
        const link = item.querySelector('p');
        if (link.className === id) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// 페이지 호출
function pageCall(page) {
    const mypage = "/mypage" + page;
    fetch(mypage)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            bottom.innerHTML = data;
            loadScript(page);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

//js 호출
function loadScript(page) {
    const src = js + page + '.js';
    removeAllScript(src);
    if (!isScriptAlreadyIncluded(src)) {
        const script = document.createElement('script');
        script.src = src;
        document.body.appendChild(script);
    }
}

// src를 keep 할것인지 추후 결정 예정...
//js 삭제
function removeAllScript(src) {
    const toKeep = ['/dist/js/header.js', '/dist/js/loginJoin.js', js + '/mypageDetail.js','chrome-extension:'];
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        let isToKeep = false;
        for (let j = 0; j < toKeep.length; j++) {
            console.log(toKeep[j]);
            if (scripts[i].src.includes(toKeep[j])) {
                isToKeep = true;
            }
        }
        if (!isToKeep) {
            console.log(scripts[i]);
            document.body.removeChild(scripts[i]);
        }
    }
}

//js 체크
function isScriptAlreadyIncluded(src) {
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.includes(src)) {
            return true;
        }
    }
    return false;
}

//모달 열기
function openUpdateModal() {
    modal.style.display = "flex";
    disableScroll();
}

//모달 닫기
function closeUpdateModal() {
    modal.style.display = "none";
    enableScroll();
}

//파일열기
function fileOpen() {
    document.getElementById("profileUpdateImg").click();
}

//스크롤 막기
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
    e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

var supportsPassive = false;
try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () {
            supportsPassive = true;
        }
    }));
} catch (e) {
}

var wheelOpt = supportsPassive ? {passive: false} : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}

//아코디언
document.querySelectorAll('.accordionBtn').forEach(button => {
    button.addEventListener('click', () => accordionToggle(button));
});

function accordionToggle(button) {
    const list = button.nextElementSibling;
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !isExpanded);
    list.classList.toggle('show', !isExpanded);
    if (isExpanded) {
        button.innerText = "펼치기";
    } else {
        button.innerText = "접기";
    }
}

//회원정보
async function isSocialUser(uno) {
    try {
        const config = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const url = await fetch("/mypage/isSocial?uno=" + uno, config);
        return await url.json();
    } catch (e) {
        console.log(e);
    }
}

// 이미지 URL을 File 객체로 변환하는 함수
async function getFileFromImgSrc(imgSrc) {
    const response = await fetch(imgSrc);
    const blob = await response.blob();
    const fileName = 'image.jpg';
    const file = new File([blob], fileName, { type: blob.type });
    return file;
}

function changeDate(text) {
    const datePattern = /\d{4}-\d{2}-\d{2}/;  // 날짜 패턴 (YYYY-MM-DD)
    const match = text.match(datePattern);
    return match ? match[0].replaceAll("-", ".") : null; // 매칭된 결과가 있으면 반환, 없으면 null 반환
}

function compareDate(text) {
    var date = new Date();
    var endDate = new Date(text);
    return date > endDate;
}

function noChild(trip) {
    const div = document.createElement("div");
    const p = document.createElement("p");
    div.style.width = "1440px";
    div.style.height = "150px";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    p.style.textAlign = "center";
    p.style.fontSize ="22px";
    p.innerText = ''; // 초기화
    switch (trip) {
        case "review":
            p.innerText = "작성한 리뷰가 없습니다.";
            break;
        case "list":
            p.innerText = "생성한 일정이 없습니다.";
            break;
        case "wishPlace":
            p.innerText = "찜한 장소가 없습니다.";
            break;
        case "wishTrip":
            p.innerText = "찜한 여행 일정이 없습니다.";
            break;
        default:
            p.innerText = "알 수 없는 옵션입니다.";
            break;
    }
    div.appendChild(p);
    return div;
}

function locationfind(type){
    if (type === "12" || type === "14") {
        return "/place/";
    }
    if (type === "39") {
        return "/food/";
    }
}