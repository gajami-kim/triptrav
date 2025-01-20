const inviteUser = document.querySelector('.inviteUser').value;

document.addEventListener('DOMContentLoaded', () => {
    if(typeof userNickname == 'undefined'){
        if (inviteUser){
            if(confirm("로그인 한 사용자만 이용가능 한 서비스입니다. \n로그인 페이지로 이동하시겠습니까?")){
                document.getElementById('myModal').style.display = 'flex';

            }
        }
    }else{
        getScheduleMaker(sco).then(result =>{
            if(result != unoNum){
                addScheduleRole(unoNum, sco).then(result=>{})
            }
        })
    }
})

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
