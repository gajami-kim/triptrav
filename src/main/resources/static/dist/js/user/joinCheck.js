console.log("회원가입 유효성 검사 스크립트 실행");

    const emailRegExp = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    const pwRegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    const nick = document.getElementById('JoinNick');
    const email = document.getElementById('JoinEmail');
    const pw = document.getElementById('joinPw');
    const pwCheck = document.getElementById('joinCheckPw');

    let isEmailValid = false;
    let isNickValid = false;
    let isPwValid = false;
    let isPwCheckValid = false;

    // 이메일 유효성 검사 및 중복 체크
    email.addEventListener('blur', async function () {
        if (emailRegExp.test(email.value)) {
            const response = await checkEmail(email.value);
            if (response === '0') {
                document.getElementById('JoinSpan0').innerHTML = '사용 가능한 이메일입니다.';
                isEmailValid = true;
            } else {
                document.getElementById('JoinSpan0').innerHTML = '이미 사용 중인 이메일입니다.';
                isEmailValid = false;
            }
        } else {
            document.getElementById('JoinSpan0').innerHTML = '올바른 이메일 형식을 입력해주세요.';
            isEmailValid = false;
        }
    });

    // 닉네임 중복 체크
    nick.addEventListener('blur', async function () {
        const response = await checkNick(nick.value);
        if (response === '0') {
            document.getElementById('JoinSpan1').innerHTML = '사용 가능한 닉네임입니다.';
            isNickValid = true;
        } else {
            document.getElementById('JoinSpan1').innerHTML = '이미 사용 중인 닉네임입니다.';
            isNickValid = false;
        }
    });

    // 비밀번호 유효성 검사
    pw.addEventListener('keyup', function () {
        if (pwRegExp.test(pw.value)) {
            document.getElementById('JoinSpan2').innerHTML = '사용 가능한 비밀번호입니다.';
            isPwValid = true;
        } else {
            document.getElementById('JoinSpan2').innerHTML = '8~20자, 대소문자, 숫자, 특수문자를 포함해야 합니다.';
            isPwValid = false;
        }
        validatePwCheck();
    });

    // 비밀번호 확인 검사
    pwCheck.addEventListener('keyup', function () {
        validatePwCheck();
    });

    function validatePwCheck() {
        if (pw.value === pwCheck.value && isPwValid) {
            document.getElementById('JoinSpan3').innerHTML = '비밀번호가 일치합니다.';
            isPwCheckValid = true;
        } else {
            document.getElementById('JoinSpan3').innerHTML = '비밀번호가 일치하지 않습니다.';
            isPwCheckValid = false;
        }
    }

    // 회원가입 버튼 클릭 시 유효성 검사
    document.querySelector('.JoinBtn').addEventListener('click', function () {
        if (isEmailValid && isNickValid && isPwValid && isPwCheckValid) {
            document.querySelector('form').submit();
        } else {
            alert('입력 정보를 확인해주세요.');
        }
    });

    // 닉네임 중복 체크 함수
    async function checkNick(nick) {
        try {
            const response = await fetch('/user/nick', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain; charset=UTF-8' },
                body: nick
            });
            return await response.text();
        } catch (error) {
            console.error('닉네임 확인 중 오류:', error);
        }
    }

    // 이메일 중복 체크 함수
    async function checkEmail(email) {
        try {
            const response = await fetch('/user/email', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain; charset=UTF-8' },
                body: email
            });
            return await response.text();
        } catch (error) {
            console.error('이메일 확인 중 오류:', error);
        }
    }