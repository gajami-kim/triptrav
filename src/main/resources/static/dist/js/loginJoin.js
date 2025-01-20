(function() {
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');

    document.body.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'backBtn') {
            e.preventDefault();
            console.log('backBtn 클릭됨');
            pageCall("login");
        } else if (e.target && e.target.id === 'closeModal') {
            closeModal();
        } else if (e.target && e.target.id === 'joinBtn') {
            e.preventDefault();
            pageCall("join");
        } else if (e.target && e.target.id === 'openModal') {
            openModal();
        } else if (e.target && e.target.id === 'findBtn'){
            e.preventDefault();
            pageCall("findPw");
        }
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    function openModal() {
        modal.style.display = 'flex';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    function pageCall(page) {
        console.log(page);  // 확인용 로그
        const mypage = "/user/" + page;
        fetch(mypage)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                modalContent.innerHTML = data;
                const script = document.createElement('script');

                // page 값에 따라 다른 스크립트 추가
                if (page === 'join') {
                    script.src = '/dist/js/user/joinCheck.js';
                } else if (page === 'findPw') {
                    script.src = '/dist/js/user/findPw.js';
                }
                document.body.appendChild(script);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
})();


