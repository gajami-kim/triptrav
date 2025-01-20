console.log("findPw js in!");
//비밀번호 찾기

const email = document.getElementById('findPwInputE');
const findPwBtn = document.querySelector('.findPwEmailBtn');

async function findPwF(email) {
    try {
        const url = `/user/find/${encodeURIComponent(email)}`; // 안전한 URL 처리
        const config = { method: 'POST' };
        const resp = await fetch(url, config);

        if (!resp.ok) {
            throw new Error(`HTTP error! Status: ${resp.status}`);
        }

        const result = await resp.text();
        return result;
    } catch (error) {
        console.error("Fetch error: ", error);
        alert("서버와의 통신 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.");
    }
}

findPwBtn.addEventListener('click',()=>{
    if(!email.value==''){
        findPwF(email.value).then(r=>{
            if(r==="1"){
                alert("이메일 전송이 완료되었습니다.");
                window.location.href="/";
            } else {
                alert("존재하지 않는 이메일입니다. \n다시 입력해주세요.")
            }
        })
    } else{
        document.querySelector('.findNoPw').innerHTML='이메일을 입력해주세요';
    }
})