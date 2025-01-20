function changeImage() {
    const images = document.querySelectorAll('.mainBackImg img');
    let currentImg = 0;

    setInterval(() => {
        images[currentImg].classList.remove('active');
        currentImg = (currentImg + 1) % images.length;
        images[currentImg].classList.add('active');
    }, 30000);
}

window.onload = function () {
    changeImage();

    const urlParams = new URLSearchParams(window.location.search);

    //search page로 이동
    if (urlParams.has('search')) {
        changeSearch();
    }

    //회원가입 완료 메시지
    if (urlParams.has('joinMsg')) {
        alert('회원가입이 완료되었습니다!');
        history.replaceState(null, '', window.location.pathname); // URL 클린업
    }

    //로그인 실패 메시지
    if (urlParams.has('false')) {
        alert('아이디와 비밀번호를 확인해주세요.');
        openLoginModal();
    }
};

function changeSearch() {
    document.querySelector('.mainText').style.display = 'none';
    document.querySelector('.mainBtnDiv').style.display = 'none';
    document.querySelector('.tasteDiv').style.display = 'none';
    document.querySelector('.inputWrap').style.display = '';

}
//검색 자동완성
function fetchSuggestions() {
    const query = document.getElementById('placeInput').value;
    const suggestions = document.getElementById('suggestions');
    if (query.length < 2) {
        return;
    }
    const encodedQuery = encodeURIComponent(query);
    fetch(`/autocomplete?query=${encodedQuery}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('placeInput').style.borderBottomRightRadius = "0px";
            document.getElementById('placeInput').style.borderBottomLeftRadius = "0px";
            suggestions.innerHTML = "";
            if (data.length === 0) {
                const noResultLi = document.createElement('li');
                noResultLi.textContent = "검색 결과가 없습니다";
                suggestions.appendChild(noResultLi);
            } else {
                data.forEach(item => {
                    const li = document.createElement('li');
                    const highlightedItem = item.replace(
                        new RegExp(query, 'gi'),
                        match => `<strong style="color: #F3A701; font-weight: bold;">${match}</strong>`
                    );
                    li.innerHTML = highlightedItem;
                    suggestions.appendChild(li);
                });
            }
        })
        .catch(error => {
            console.error(error);
        });
}

function loadTaste(){
    if (typeof userNickname !== 'undefined' && userNickname !== null) {
        const checkAdditionalInfo = document.querySelector('.additionalInfoCheck');
        if(checkAdditionalInfo.innerText == "true"){
            document.querySelector('.tasteDiv').style.display = '';
            document.querySelector('.mainText').style.display = 'none';
            document.querySelector('.mainBtnDiv').style.display = 'none';
        }else{
            document.querySelector('.additionalInfo').style.display = ''
            document.querySelector('.mainText').style.display = 'none';
            document.querySelector('.mainBtnDiv').style.display = 'none';
            document.getElementById('searchA').addEventListener('click', () => {
                document.querySelector('.additionalInfo').style.display = 'none'
            })
        }
    }else{
        if(confirm("로그인 한 사용자만 이용가능 한 서비스입니다. \n로그인 페이지로 이동하시겠습니까?")){
            document.getElementById('myModal').style.display = 'flex';
        }
    }
}

const buttons = document.querySelectorAll('.taste-button');
let selectedButtons = [];

// 버튼 클릭 시 처리
buttons.forEach(button => {
    button.addEventListener('click', function() {
        const buttonText = this.innerText;
        if (selectedButtons.includes(buttonText)) {
            selectedButtons = selectedButtons.filter(item => item !== buttonText);
            this.classList.remove('active');
        }
        else if (selectedButtons.length < 5) {
            selectedButtons.push(buttonText);
            this.classList.add('active');
        }
        else {
            alert('최대 5개까지 선택할 수 있습니다.');
        }
    });
});

document.querySelector('.analyze-button').addEventListener('click', function() {
    const requestBody = {
        categoryNames: selectedButtons,
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
        .then(result =>{
            if(result == "fail"){
                alert("분석에러")
            }else{
                window.location.href = "/taste/";
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


//성별, 나이 업데이트
document.getElementById('additionalInfoFormButton').addEventListener('click', function() {
    const ageInput = document.getElementById('age');
    const ageValue = parseInt(ageInput.value, 10);
    if (ageValue < 1 || ageValue > 99) {
        alert("나이는 1에서 99 사이여야 합니다.");
        return;
    }
    document.getElementById('unoForm').value = unoNum;
    const formData = new FormData(document.querySelector('.additionalInfoForm'));
    fetch('/user/additionalInfo', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(result => {
            if (result == "success") {
                document.querySelector('.additionalInfo').style.display = 'none'
                document.querySelector('.mainText').style.display = 'none';
                document.querySelector('.mainBtnDiv').style.display = 'none';
                document.querySelector('.tasteDiv').style.display = '';
            } else {
                alert("서비스 에러입니다. 관리자에게 연락해주세요. ")
            }
        })
        .catch(error => {
            console.error(error);
        });
});


//성별나이값 있는지체크
async function checkAdditionalInfoInfo(){
    try{
        const url = "/user/checkAdditionalInfo/"+unoNum
        const option ={
            method: 'GET'
        }
        const response = await fetch(url, option)
        return response.text()
    }catch (e) {
        console.log(e)
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (typeof userNickname !== 'undefined' && userNickname !== null) {
        checkAdditionalInfoInfo().then(result => {
            const additionalInfoCheck = document.querySelector('.additionalInfoCheck');
            if (result === "true") {
                additionalInfoCheck.textContent = "true";
            } else {
                additionalInfoCheck.textContent = "false";
            }
        });
    }
});


