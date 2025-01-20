const path = window.location.pathname;
const id = path.match(/\d+/)[0];
let contentId = id;
const searchFoodWord = encodeURI("인천"); //%EC%9D%B8%EC%B2%9C 인코딩
// 음식점 기본 정보(위치랑 설명 정도?)
const foodCommonUrl =`https://apis.data.go.kr/B551011/KorService1/detailCommon1?MobileOS=ETC&MobileApp=triptrav&_type=json&contentId=${contentId}&contentTypeId=39&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&serviceKey=${tourAPIKEY}`;
const imgUrl = `https://apis.data.go.kr/B551011/KorService1/detailImage1?MobileOS=ETC&MobileApp=TripTrav&_type=json&subImageYN=Y&contentId=${contentId}&serviceKey=${tourAPIKEY}`;
const detailInfoUrl = `https://apis.data.go.kr/B551011/KorService1/detailCommon1?MobileOS=ETC&MobileApp=TripTrav&contentId=${contentId}&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&serviceKey=${tourAPIKEY}&_type=json`;
const foodContainer = document.querySelector('.food');
const attractionsContainer = document.querySelector('.attractions');
const imageUrlsDiv = document.querySelector('.imageUrls');

let currentIndex = 0;
let contentTypeId = 0;
let contentName = '';
let imageUrls = [];
let mapx = 0;
let mapy = 0;
let totalCount = 0;
let isLiked = false;
let isSortedByUseful = false;
let isSortedByRate = false;
let isSortedByDate = false;
let reviewList = [];
let isEditing = false;
let validFiles = [];
let currentReviewList = [];
let originalReviewList = [];
let placeLikeResult = false;
const spinner = document.getElementById('spinner');
const overlay = document.getElementById('overlay');

spinner.style.display = 'block';
overlay.style.display = 'block';

// 기본정보 가져오기
fetch(foodCommonUrl)
    .then(response => response.json())
    .then(data => {
        const jsonData = data.response.body.items.item[0];
        const locationDiv = document.querySelector('.location');
        let city = splitAddr(jsonData.addr1)[0];
        let district = splitAddr(jsonData.addr1)[1];
        let title = jsonData.title;

        contentName = jsonData.title;
        locationDiv.innerHTML = `<span>${city}> </span><span>${district}> </span><span>${title}</span>`;

        const mainImgUrl = jsonData.firstimage;
        imageUrls.push(mainImgUrl);

        // 추가 이미지를 가져오고 슬라이더에 반영
        getImage(imgUrl).then(result => {
            imageUrls.push(...result);
            console.log(result);
            if(result.length === 0){
                return;
            }
            updateImages();
        });
        //장소 평점가져오기
        getPlaceScore().then(result => {
            let displayScore = (result/totalCount).toFixed(1);
            document.querySelector('.score').innerHTML = displayScore != "NaN" ?  `(${displayScore} 점)`:  `(0 점)`;
            document.querySelector('.rating').innerHTML = convertRatingToStars(result/totalCount);
        })

        contentTypeId = jsonData.contenttypeid;
        document.querySelector('.locationTitle').innerText = jsonData.title
        document.querySelector('.locationInfo').innerHTML = `주소 : ${jsonData.addr1}`;

        getIntroInfo(contentTypeId).then(result=>{
            const introData = result.response.body.items.item[0];
            document.querySelector('.telInfo').innerHTML = `전화번호 : ${introData.infocenterfood ? `${introData.infocenterfood}`: `없음`}`
             document.querySelector('.restInfo').innerHTML = `쉬는날 : ${introData.restdatefood ? `${introData.restdatefood}`: `없음`}`
             document.querySelector('.timeInfo').innerHTML = `이용시간 : ${introData.opentimefood ? `${introData.opentimefood}`: `없음`}`

        })
        getAdditionalInfo(contentTypeId).then(result => {
            const additionalInfoData = result.response.body.items.item[0];
            document.querySelector('.priceInfo').innerHTML = `주요상품 : ${additionalInfoData.firstmenu ? `${additionalInfoData.firstmenu}` : `${additionalInfoData.treatmenu}`}`
        })
        document.querySelector('.homepageInfo').innerHTML = `홈페이지 :`+`${jsonData.homepage ? ` ${jsonData.homepage}` :"등록된 페이지가 없습니다. "}`
        document.querySelector('.details').innerHTML = `<p class="sectionTitle">소개</p><span>${jsonData.overview}</span>`;
        mapx = jsonData.mapx;
        mapy = jsonData.mapy;

        let marker = {
            position: new kakao.maps.LatLng(mapy, mapx),
            text: '눌러서 경로를 검색해보세요!'
        };
        let staticMapContainer  = document.getElementById('staticMap'),
            staticMapOption = {
                center: new kakao.maps.LatLng(mapy, mapx),
                level: 4,
                marker: marker
            };
        let staticMap = new kakao.maps.StaticMap(staticMapContainer, staticMapOption);
        document.getElementById('staticMap').addEventListener('click', () => {
            const anchorTag = document.querySelector('#staticMap a');
            if (anchorTag) {
                anchorTag.href = `https://map.kakao.com/link/to/${title},${mapy},${mapx}`;
            }
        });

        //주변지역 처리
        processNearbySightsAndFood(mapx, mapy).then(result => {
            renderNearbySightsAndFood(result.sights, result.food);
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            spinner.style.display = 'none';
            overlay.style.display = 'none';
        });
    });

// 주소 처리 함수
function splitAddr(address) {
    let addrParts = address.split(' ');
    let city = addrParts[0];
    let district = addrParts[1];
    return [city, district];
}

// 이미지 처리 함수
async function getImage(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const items = data.response.body.items.item;
        return items.map(item => item.originimgurl);
    } catch (error) {
        console.log(error);
        return [];
    }
}

// 이미지 URL 배열을 동적으로 추가하는 함수
function updateImages() {
    imageUrlsDiv.innerHTML = '';
    const visibleImages = imageUrls.slice(currentIndex, currentIndex + 5);
    visibleImages.forEach(url => {
        const imgElement = document.createElement('img');
        imgElement.src = `${url? `${url}` : "/dist/image/noimage.jpg"}`;
        imgElement.classList.add('slideImage');
        imageUrlsDiv.appendChild(imgElement);
    });
}

// 이전 버튼 클릭 시
document.querySelector('.prev').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = imageUrls.length - 5;
    }
    updateImages();
});

// 다음 버튼 클릭 시
document.querySelector('.next').addEventListener('click', () => {
    if (currentIndex < imageUrls.length - 5) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    updateImages();
});

//인트로정보 조회 함수
async function getIntroInfo(contentTypeId) {
    try {
        const url = `https://apis.data.go.kr/B551011/KorService1/detailIntro1?MobileOS=ETC&MobileApp=TripTrav&_type=json&contentId=${contentId}&contentTypeId=${contentTypeId}&serviceKey=${tourAPIKEY}`;
        const response = await fetch(url);
        const result = await response.json()
        return result;
    }catch (error){
        console.log(error)
    }
}

//추가정보 조회 함수
async function getAdditionalInfo(contentTypeId) {
    try{
        const url = `https://apis.data.go.kr/B551011/KorService1/detailIntro1?MobileOS=ETC&MobileApp=TripTrav&_type=json&contentId=${contentId}&contentTypeId=${contentTypeId}&serviceKey=${tourAPIKEY}`
        const response = await fetch(url);
        const result = await response.json()
        return result;
    }catch (error){
        console.log(error)
    }
}

//리뷰관련 부분
async function writeReview() {
    const reviewContent = document.querySelector('.reviewArea').value.trim();
    const starRate = document.getElementById('rating-value').textContent;
    if (reviewContent === '') {
        alert("리뷰 내용을 입력해주세요. ");
        return;
    }else if(starRate == 0){
        alert("별점을 등록해주세요. ")
        return;
    }
    const files = document.getElementById('imageInput').files;
    const data = new FormData();
    data.append('reContent', document.querySelector('.reviewArea').value);
    data.append('nickname', userNickname);
    data.append('reRate', document.getElementById('rating-value').textContent);
    data.append('reImageCount', files.length);
    data.append('reContentType', contentTypeId);
    data.append('uno', unoNum);
    data.append('reContentId', contentId)
    data.append('reContentName', contentName)

    for (let i = 0; i < files.length; i++) {
        data.append('images', files[i]);
    }
    try {
        const url = '/review/POST';
        const config = {
            method: 'POST',
            body: data
        };
        const resp = await fetch(url, config);
        const result = await resp.text();
        return result;
    } catch (error) {
        console.log(error);
    }
}

document.querySelector('.addButton').addEventListener('click', (event) => {
    const textarea = document.querySelector('.reviewArea').value.trim();
    if (!isEditing) {
        if (textarea === '') {
            event.preventDefault();
            alert("내용을 입력해주세요.");
        }else{
            writeReview().then(result => {
                if (result === "success" || result === "imageSuccess") {
                    alert("댓글 작성 완료");
                    window.location.reload();
                }
            });
        }
    }
});
document.querySelector('.reviewForm').addEventListener('click',(e)=>{
    if (typeof userNickname === 'undefined') {
        e.preventDefault();
        if(confirm("로그인 한 사용자만 이용가능 한 서비스입니다. \n로그인 페이지로 이동하시겠습니까?")){
            document.getElementById('myModal').style.display = 'flex';
        }
    }
})

//이미지업로드 관련 함수
const MAX_FILE_SIZE = 10 * 1024 * 1024;
// 파일 업로드 핸들러
function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    const fileCountElement = document.getElementById('fileCount');
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '';
    if (files.length + validFiles.length > 3) {
        alert('최대 3장만 업로드할 수 있습니다.');
        event.target.value = '';
        return;
    }
    files.forEach(file => {
        if (file.size > MAX_FILE_SIZE) {
            alert(`파일 "${file.name}" 크기가 10MB를 초과했습니다. 다른 파일을 선택해주세요.`);
        } else {
            validFiles.push(file);
        }
    });
    updateImagePreview();
}
//이미지 컨테이너처리
function updateImagePreview() {
    const fileCountElement = document.getElementById('fileCount');
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '';

    if (validFiles.length === 0) {
        fileCountElement.innerText = '';
        return;
    }
    fileCountElement.innerText = `${validFiles.length}/3 첨부 완료`;
    validFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgContainer = document.createElement('div');
            imgContainer.style.position = 'relative';
            imgContainer.style.display = 'inline-block';
            imgContainer.style.margin = '5px';

            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.width = '120px';
            img.style.height = '120px';
            img.style.objectFit = 'cover';

            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'X';
            deleteButton.style.position = 'absolute';
            deleteButton.style.top = '2px';
            deleteButton.style.right = '2px';
            deleteButton.style.fontSize = '20px';
            deleteButton.style.color = 'white';
            deleteButton.style.cursor = 'pointer';

            deleteButton.onclick = function () {
                validFiles.splice(index, 1);
                updateImagePreview();
            };

            imgContainer.appendChild(img);
            imgContainer.appendChild(deleteButton);
            previewContainer.appendChild(imgContainer);
        };
        reader.readAsDataURL(file);
    });
}
starRating();
//별점관리
function starRating() {
    document.addEventListener('DOMContentLoaded', function () {
        const stars = document.getElementById('stars');
        const ratingValue = document.getElementById('rating-value');
        let currentRating = 0;
        let isClickSet = false;
        stars.addEventListener('mousemove', function (e) {
            const rect = stars.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const starWidth = rect.width / 5;
            const rating = Math.ceil((offsetX / starWidth) * 2) / 2;
            if (offsetX >= 0 && offsetX <= rect.width) {
                highlightStars(stars, rating);
                ratingValue.textContent = rating;
            }
        });
        stars.addEventListener('click', function () {
            currentRating = parseFloat(ratingValue.textContent);
            isClickSet = true;
        });
        stars.addEventListener('mouseleave', function () {
            if (isClickSet) {
                highlightStars(stars, currentRating);
                ratingValue.textContent = currentRating;
            }
        });
    });
}
//별 반짝거리게
function highlightStars(stars, rating) {
    const starElements = stars.children;
    for (let i = 0; i < starElements.length; i++) {
        const starValue = i + 1;
        if (starValue <= rating) {
            starElements[i].classList.add('full');
            starElements[i].classList.remove('half');
        } else if (starValue - 0.5 === rating) {
            starElements[i].classList.add('half');
            starElements[i].classList.remove('full');
        } else {
            starElements[i].classList.remove('full');
            starElements[i].classList.remove('half');
        }
    }
}

// 리뷰 리스트 가져오기
async function getReviewList() {
    try {
        const url = "/review/GET/" + contentId;
        const config = {
            method: 'GET'
        };
        const resp = await fetch(url, config);
        let result = await resp.json();
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
    }
}

// 리뷰 작성 input 숨김 처리 및 리뷰 출력
getReviewList().then(async (result) => {
    originalReviewList = [...result];
    currentReviewList = [...result];

    if (typeof userNickname !== 'undefined' && userNickname !== null) {
        const hasUserReview = result.some(reviewDTO => reviewDTO.review.nickname === userNickname);
        if (hasUserReview) {
            document.querySelector('.inputDiv').style.display = 'none';
        }

        // 로그인한 사용자의 리뷰를 최상단으로 올림
        result = result.sort((a, b) => {
            if (a.review.nickname === userNickname) return -1;
            if (b.review.nickname === userNickname) return 1;
            return 0;
        });
        for (let i = 0; i < result.length; i++) {
            result[i].isLiked = await checkReviewLike(result[i].review.rno) === "true";
        }
    }
    currentReviewList = [...result];
    displayReviews(currentReviewList);
});



// 정렬 버튼 로직
document.querySelector(".buttons").addEventListener("click", (e) => {
    const button = e.target;
    const buttonType = button.textContent;
    const isBold = button.style.fontWeight === 'bold';

    document.querySelectorAll(".buttons button").forEach(btn => {
        btn.style.fontWeight = 'normal';
    });
    let sortedList = [...currentReviewList];
    if (buttonType === "좋아요순") {
        if (isBold) {
            isSortedByUseful = false;
            sortedList = [...originalReviewList];
        } else {
            isSortedByUseful = true;
            sortedList = sortedList.sort((a, b) => b.review.reUseful - a.review.reUseful || new Date(b.review.reDate) - new Date(a.review.reDate));
        }
    } else if (buttonType === "평점 높은순") {
        if (isBold) {
            isSortedByRate = false;
            sortedList = [...originalReviewList];
        } else {
            isSortedByRate = true;
            sortedList = sortedList.sort((a, b) => b.review.reRate - a.review.reRate || new Date(b.review.reDate) - new Date(a.review.reDate));
        }
    } else if (buttonType === "최신순") {
        if (isBold) {
            isSortedByDate = false;
            sortedList = [...originalReviewList];
        } else {
            isSortedByDate = true;
            sortedList = sortedList.sort((a, b) => new Date(b.review.reDate) - new Date(a.review.reDate));
        }
    }
    // 로그인한 사용자의 리뷰를 최상단으로 올림
    if (typeof userNickname !== 'undefined' && userNickname !== null) {
        sortedList = sortedList.sort((a, b) => {
            if (a.review.nickname === userNickname) return -1;
            if (b.review.nickname === userNickname) return 1;
            return 0;
        });
    }
    if (!isBold) {
        button.style.fontWeight = 'bold';
    }
    currentReviewList = [...sortedList];
    displayReviews(currentReviewList);
});

// 리뷰 출력 함수
async function displayReviews(result) {
    const reviewContainer = document.querySelector('.review');
    reviewContainer.innerHTML = '';

    for (const reviewDTO of result) {
        const review = reviewDTO.review;
        const imagePaths = reviewDTO.imagePaths;
        let profileImgPath;
        profileImgPath = await getUserProfile(review.uno);
        const reviewWrapper = document.createElement("div");
        reviewWrapper.className = "review-wrapper";

        const reviewInfoDiv = document.createElement("div");
        reviewInfoDiv.className = "review-info";

        const starHTML = convertRatingToStars(review.reRate);
        reviewInfoDiv.innerHTML = `
             <img class="profileImage" alt="noPic" src="${profileImgPath ? `/profile/${profileImgPath}` : '/dist/image/noimage.jpg'}">
            <span class="nickName">${review.nickname}</span><br>
            <span class="review-rating">${starHTML}</span>
            <span class="regDate">${review.reDate}</span>
            <button class="helpButton">
                <span class="reUseful">${review.reUseful}</span>
                <img id="thumbsUp" src="${reviewDTO.isLiked ? '/dist/image/thumbs-click.svg' : '/dist/image/thumbs-up.svg'}" data-rno="${review.rno}" data-isLiked="${reviewDTO.isLiked}">
            </button>
            <button class="reportButton">
                <img src="/dist/image/alert-triangle.svg" class="reportImg">
            </button>`;

        // 사용자 리뷰 수정/삭제 버튼 처리 코드
        if (typeof userNickname !== 'undefined' && userNickname !== null) {
            if (review.nickname === userNickname) {
                const modifyButton = document.createElement("img");
                modifyButton.src = "/dist/image/edit-2.svg";
                modifyButton.classList.add('modifyImg');
                modifyButton.addEventListener("click", () => {
                    fillReviewForm(review, imagePaths);
                    document.querySelector('.cameraInput').style.marginRight = "85px";
                    document.getElementById('fileCount').style.marginRight = "3px";
                });
                reviewInfoDiv.appendChild(modifyButton);

                const deleteButton = document.createElement("img");
                deleteButton.src = "/dist/image/trash-2.svg";
                deleteButton.classList.add('deleteImg');
                deleteButton.addEventListener("click", async () => {
                    const confirmation = confirm("정말로 이 리뷰를 삭제하시겠습니까?");
                    if (confirmation) {
                        await deleteReview(review.rno);
                        displayReviews(await getReviewList());
                    }
                });
                reviewInfoDiv.appendChild(deleteButton);
            }
        }

        const reviewDetailDiv = document.createElement("div");
        reviewDetailDiv.className = "review-detail";
        reviewDetailDiv.innerHTML = `<p class="reviewContent">${review.reContent}</p>`;

        if (imagePaths && imagePaths.length > 0) {
            const imageDiv = document.createElement("div");
            imageDiv.className = "review-images";
            imagePaths.forEach(imagePath => {
                const relativePath = imagePath.replace("C:\\userImage\\", "");
                const img = document.createElement("img");
                img.src = `/reviewImages/${relativePath}`;
                img.alt = "리뷰 이미지";
                img.classList.add('review-img');
                imageDiv.appendChild(img);
            });
            reviewDetailDiv.appendChild(imageDiv);
        }

        reviewWrapper.appendChild(reviewInfoDiv);
        reviewWrapper.appendChild(reviewDetailDiv);
        reviewContainer.appendChild(reviewWrapper);
    }
}

//좋아요 누름처리
document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'thumbsUp') {
        const rno = event.target.getAttribute('data-rno');
        const currentLike = event.target.getAttribute('data-isLiked');
        const reUseful = document.querySelector('.reUseful')
        if(currentLike == "true") {
            unClickLike(rno).then(result => {
                if(result == "unClickSuccess") {
                    event.target.src = '/dist/image/thumbs-up.svg';
                    event.target.style.width = "24px"
                    event.target.style.height = "24px"
                    event.target.style.transform = "translate(0,0)"
                    event.target.setAttribute('data-isLiked', 'false');
                    getLikeCount(rno).then(result =>{
                        const spanElement = event.target.previousElementSibling;
                        spanElement.innerText = result;
                    })
                }
            })
        } else if(currentLike == "false") {
            clickLike(rno).then(result => {
                if(result == "clickSuccess") {
                    event.target.src = '/dist/image/thumbs-click.svg';
                    event.target.style.width = "28px"
                    event.target.style.height = "28px"
                    event.target.style.transform = "translate(3px,-3px)"
                    event.target.setAttribute('data-isLiked', 'true');
                    getLikeCount(rno).then(result =>{
                        const spanElement = event.target.previousElementSibling;
                        spanElement.innerText = result;
                    })
                }
            })
        }
    }
});
document.addEventListener('click', (event) => {
    if((event.target && event.target.id === 'thumbsUp') || (event.target && event.target.className === "reportImg")){
        if (typeof userNickname === 'undefined') {
            event.preventDefault();
            if(confirm("로그인 한 사용자만 이용가능 한 서비스입니다. \n로그인 페이지로 이동하시겠습니까?")){
                document.getElementById('myModal').style.display = 'flex';
            }
        }
    }
})

//좋아요개수 가져오는함수
async function getLikeCount(rno){
    try{
        const url = "/review/getLikeCount/"+rno
        const config = {
            method : "GET"
        }
        const resp = await fetch(url,config)
        return resp.text()
    }catch (error) {
        console.log(error)
    }
}

// 좋아요 상태 체크하는 함수
async function checkReviewLike(rno){
    try{
        const url = "/review/checkReviewLike/"+rno+"/"+unoNum;
        const config = {
            method: 'GET'
        }
        const resp = await fetch(url,config);
        return resp.text();
    }catch (error){
        console.log(error)
    }
}
//좋아요 누르기
async function clickLike(rno){
    try{
        const url = "/review/clickLike/"+rno+"/"+unoNum
        const config = {
            method: 'POST',
            headers : {
                "content-type":"text/plain"
            }
        }
        const resp = await fetch(url,config);
        return resp.text();
    }catch(error){
        console.log(error)
    }
}

//좋아요 취소
async function unClickLike(rno){
    try{
        const url = "/review/unClickLike/"+rno+"/"+unoNum
        const config = {
            method: 'DELETE',
            headers : {
                "content-type":"text/plain"
            }
        }
        const resp = await fetch(url,config);
        return resp.text();
    }catch(error){
        console.log(error)
    }
}
//리뷰 삭제
async function deleteReview(rno) {
    try {
        const url = `/review/reviewDelete/${rno}`;
        const config = {
            method: 'DELETE'
        };
        const resp = await fetch(url, config);
        if (resp.ok) {
            alert("리뷰가 삭제되었습니다.");
            window.location.reload();
        } else {
            alert("리뷰 삭제에 실패했습니다.");
        }
    } catch (error) {
        console.log(error);
        alert("오류가 발생했습니다.");
    }
}

//리뷰 수정시 input 창 채우기
function fillReviewForm(review, imagePaths) {
    document.querySelector('.inputDiv').style.display = '';
    document.querySelector('.reviewArea').value = review.reContent;
    starRating();
    const stars = document.getElementById('stars');
    highlightStars(stars, review.reRate)
    document.getElementById('rating-value').innerText = review.reRate
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '';

    if (imagePaths && imagePaths.length > 0) {
        imagePaths.forEach((imagePath, index) => {
            const relativePath = imagePath.replace("C:\\userImage\\", "");
            const imgContainer = document.createElement('div');
            imgContainer.style.position = 'relative';
            imgContainer.style.display = 'inline-block';
            imgContainer.style.margin = '5px';

            const img = document.createElement('img');
            img.src = `/reviewImages/${relativePath}`;
            img.style.width = '120px';
            img.style.height = '120px';
            img.style.objectFit = 'cover';

            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'X';
            deleteButton.style.position = 'absolute';
            deleteButton.style.top = '2px';
            deleteButton.style.right = '2px';
            deleteButton.style.fontSize = '20px';
            deleteButton.style.color = 'white';
            deleteButton.style.cursor = 'pointer';

            deleteButton.onclick = function() {
                imagePaths.splice(index, 1);
                fillReviewForm(review, imagePaths);
            };

            imgContainer.appendChild(img);
            imgContainer.appendChild(deleteButton);
            previewContainer.appendChild(imgContainer);
        });
    }
    isEditing = true;

    const addButton = document.querySelector('.addButton');
    addButton.innerText = '수정 완료';
    addButton.onclick = async function() {
        modifyReview(review.rno).then(result=>{
            if(result == "success"){
                alert("수정 완료");
                window.location.reload()
            }
        });
    };
}

//수정로직
async function modifyReview(rno) {
    const data = new FormData();
    data.append('reContent', document.querySelector('.reviewArea').value);
    data.append('nickname', userNickname);
    data.append('reRate', document.getElementById('rating-value').textContent);
    data.append('reImageCount', validFiles.length);
    data.append('rno', rno);
    data.append('reContentType', contentTypeId);
    data.append('uno', unoNum);
    data.append('reContentId', contentId);
    data.append('reContentName', contentName);

    validFiles.forEach(file => {
        data.append('images', file);
    });

    try {
        const url = '/review/reviewUpdate/PUT';
        const config = {
            method: 'PUT',
            body: data
        };
        const resp = await fetch(url, config);
        const result = await resp.text();
        return result;
    } catch (error) {
        console.log(error);
    }
}

//별점 별로 변환함수
function convertRatingToStars(rating) {
    const starFull = '<img src="/dist/image/star-full.png" alt="Full Star">';
    const starHalf = '<img src="/dist/image/star-half.png" alt="Half Star">';
    const starEmpty = '<img src="/dist/image/star-empty.png" alt="Empty Star">';

    let stars = '';

    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars += starFull;
        } else if (rating >= i - 0.5) {
            stars += starHalf;
        } else {
            stars += starEmpty;
        }
    }
    return stars;
}

//유저프로필 가져오기
async function getUserProfile(unoValue){
    try{
        const url = "/user/profile/"+unoValue;
        const config = {
            method: 'GET'
        };
        const resp = await fetch(url, config);
        return await resp.text();
    }catch(error){
        console.log(error);
    }
}

//전체 리뷰갯수 가져오기
async function getReviewCount(){
    try{
        const url = "/review/getCount/"+contentId;
        const config = {
            method : "GET"
        };
        const resp = await fetch(url,config);
        const result = await resp.text();
        return parseInt(result);
    }catch (error){
        console.log(error)
    }
}
getReviewCount().then(result => {
    document.querySelector('.reviewCount').innerText = result+" 개"
    totalCount = result;
})

//장소 평점 가져오기
async function getPlaceScore(){
    try{
        const url = "/review/getPlaceScore/"+contentId;
        const config = {
            method : "GET"
        };
        const resp = await fetch(url,config);
        const text = await resp.text();
        const score = parseFloat(text);
        if (isNaN(score)) {
            return 0;
        }
        return score;
    }catch (error){
        console.log(error)
    }
}


//주변 관광지 조회 함수
async function getNearBySights(mapx, mapy, radius) {
    try {
        const url = `https://apis.data.go.kr/B551011/KorService1/locationBasedList1?MobileOS=ETC&MobileApp=TripTrav&_type=json&arrange=O&mapX=${mapx}&mapY=${mapy}&radius=${radius}&contentTypeId=12&serviceKey=${tourAPIKEY}`;
        const response = await fetch(url);
        const result = await response.json();
        return result.response.body.items.item;
    } catch (error) {
        console.log(error);
    }
}

//주변 음식점 조회 함수
async function getNearByFoodInfo(mapx, mapy, radius){
    try {
        const url = `https://apis.data.go.kr/B551011/KorService1/locationBasedList1?MobileOS=ETC&MobileApp=TripTrav&_type=json&arrange=O&mapX=${mapx}&mapY=${mapy}&radius=${radius}&contentTypeId=39&serviceKey=${tourAPIKEY}`
        const response = await fetch(url);
        const result = await response.json()
        return result.response.body.items.item;
    }catch (error){
        console.log(error);
    }
}

// 주변 관광지와 음식점 조회 후 조건 처리 함수
async function processNearbySightsAndFood(mapx, mapy) {
    let range = 1000;
    async function fetchAndProcess() {
        const [sightsArray = [], foodArray = []] = await Promise.all([
            getNearBySights(mapx, mapy, range).catch(() => []),
            getNearByFoodInfo(mapx, mapy, range).catch(() => [])
        ]);
        const filteredSights = (sightsArray || []).filter(sight => sight.firstimage);
        const filteredFood = (foodArray || []).filter(food => food.firstimage);
        if (filteredSights.length < 5 || filteredFood.length < 5) {
            range += 1000;
            return fetchAndProcess();
        }
        filteredSights.sort((a, b) => a.dist - b.dist);
        filteredFood.sort((a, b) => a.dist - b.dist);

        const topSights = filteredSights.slice(1, 5);
        const topFood = filteredFood.slice(1, 5);
        return {
            sights: topSights,
            food: topFood
        };
    }
    return fetchAndProcess();
}

//주변 관광지, 음식점 화면출력 함수
function renderNearbySightsAndFood(sights, food) {
    foodContainer.innerHTML = '';
    attractionsContainer.innerHTML = '';
    food.forEach(item => {
        const foodLink = document.createElement('a');
        foodLink.href = `/food/${item.contentid}`;
        foodLink.classList.add('food-link');
        const foodDiv = document.createElement('div');
        foodDiv.classList.add('locations');
        const img = document.createElement('img');
        img.src = item.firstimage;
        img.alt = item.title;
        foodDiv.appendChild(img);
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('info');
        const titleP = document.createElement('p');
        titleP.classList.add('title');
        titleP.textContent = item.title;
        const distP = document.createElement('p');
        distP.classList.add('distance');
        distP.textContent = convertDistance(item.dist);
        infoDiv.appendChild(titleP);
        infoDiv.appendChild(distP);
        foodDiv.appendChild(infoDiv);
        foodLink.appendChild(foodDiv);
        foodContainer.appendChild(foodLink);
    });

    sights.forEach(item => {
        const sightsLink = document.createElement('a');
        sightsLink.href = `/place/${item.contentid}`;
        sightsLink.classList.add('sights-link');
        const sightDiv = document.createElement('div');
        sightDiv.classList.add('locations');
        const img = document.createElement('img');
        img.src = item.firstimage;
        img.alt = item.title;
        sightDiv.appendChild(img);
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('info');
        const titleP = document.createElement('p');
        titleP.classList.add('title');
        titleP.textContent = item.title;
        const distP = document.createElement('p');
        distP.classList.add('distance');
        distP.textContent = convertDistance(item.dist);
        infoDiv.appendChild(titleP);
        infoDiv.appendChild(distP);
        sightDiv.appendChild(infoDiv);
        sightsLink.appendChild(sightDiv);
        attractionsContainer.appendChild(sightsLink);
    });
}

//거리 변환 함수
function convertDistance(dist) {
    let number = parseFloat(dist);
    let integerNumber = Math.floor(number);
    let kilometers = integerNumber / 1000;
    if (kilometers < 1) {
        return integerNumber + ' m';
    } else {
        return kilometers.toFixed(0) + ' km';
    }
}

// 버튼누르면 섹션 이동하는 함수
function scrollToSection(buttonClass, sectionClass) {
    const button = document.querySelector(buttonClass);
    const section = document.querySelector(sectionClass);
    if (button && section) {
        button.addEventListener('click', function() {
            section.scrollIntoView({ behavior: 'smooth' });
        });
    }
}
scrollToSection('.outlineMove', '.details');
scrollToSection('.reviewMove', '.reviews');
scrollToSection('.findRouteMove', '.transportation');
scrollToSection('.nearbyMove', '.nearby');

checkLogin();
//로그인 체크 함수
function checkLogin(){
    if(typeof userNickname !== 'undefined' && userNickname !== null){
        document.querySelector('.reviewArea').placeholder = '타인에게 불쾌감을 줄 수 있는 리뷰는 삭제될 수 있습니다. ';
    }else{
        console.log("로그인")
    }
}
if(typeof userNickname !== 'undefined' && userNickname !== null){
    getLikeStatus(unoNum, contentId).then(result =>{
        if(result == "on"){
            placeLikeResult = true;
            document.querySelector('.placeHeart').src = "/dist/image/heart-on.svg"
        }else{
            placeLikeResult = false;
        }
    })
}
//장소찜하기
document.querySelector('.placeHeart').addEventListener('click',()=>{
    if(typeof userNickname !== 'undefined' && userNickname !== null){
        if(placeLikeResult == true){
            alert("찜 취소 하시겠습니까?")
            deleteLike(unoNum, contentId).then(result =>{
                if(result == "deleteSuccess"){
                    document.querySelector('.placeHeart').src = "/dist/image/heart.svg"
                    alert("취소 완료")
                    placeLikeResult = false;
                }
            })
        }else if(placeLikeResult == false){
            alert("찜하시겠습니까?")
            addLike(unoNum, contentId, contentName).then(result => {
                if(result == "success"){
                    document.querySelector('.placeHeart').src = "/dist/image/heart-on.svg"
                    if(confirm("등록완료 마이페이지에서 확인하시겠습니까?")){
                        location.href=`/mypage?uno=${unoNum}&location=wishPlace`;
                    }
                    placeLikeResult = true;
                }
            })
        }
    }else{
        if(confirm("로그인 한 사용자만 이용가능 한 서비스입니다. \n로그인 페이지로 이동하시겠습니까?")){
            document.getElementById('myModal').style.display = 'flex';
        }
    }
})

//찜하기
async function addLike(uno, likeCode, likeName) {
    try {
        const url = '/place/like';
        const data = { uno, likeCode, likeName };
        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        const resp = await fetch(url, config);
        return await resp.text();
    } catch (error) {
        console.log(error);
    }
}

//찜상태
async function getLikeStatus(uno, likeCode){
    try {
        const url = "/place/like/" + uno+"/"+likeCode;
        const config = {
            method: 'GET'
        };
        const resp = await fetch(url, config);
        return await resp.text();
    }catch (error) {
        console.log(error);
    }
}

//찜삭제
async function deleteLike(uno, likeCode){
    try {
        const url = '/place/like';
        const data = { uno, likeCode};
        const config = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        const resp = await fetch(url, config);
        return await resp.text();
    } catch (error) {
        console.log(error);
    }
}


