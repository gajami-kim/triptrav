document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sco = urlParams.get('sco');  // URL에서 'sco' 값 추출
    const inviteUser = document.querySelector('.inviteUser').value;

    if (inviteUser) {
        getScheduleMaker(sco).then(result=> {
            if(result!=unoNum) {
                if (confirm("해당 여행에 참여하시겠습니까?")) {
                    // DB에 초대된 유저를 추가
                    addScheduleRole(unoNum, sco).then(result => {
                        if (result) {
                            alert('초대가 완료되었습니다!');
                        } else {
                            alert('초대에 실패했습니다.');
                            // 실패 시 index 페이지로 리디렉션
                            window.location.href = "/";
                        }
                    });
                } else {
                    // 거절하면 index 페이지로 리디렉션
                    window.location.href = "/";
                }
            }
        })
    }

});


async function getScheduleMaker(sco){
    try{
        const url = "/schedule/getScheduleMaker/"+sco
        const config = {method:'GET'}
        const resp = await fetch(url,config)
        return resp.text();
    }catch(error){
        console.log(error);
    }
}

async function addScheduleRole(uno, sco){
    try {
        const url = "/schedule/addScheduleRole/"+uno+"/"+sco
        const config = {method:'POST'};
        const resp = await fetch(url,config);
        return resp.text();
    }catch (error) {
        console.log(error);
    }
}
