console.log('trip in');

var trip = document.querySelector(".wishTripDiv");

tripCall(unoNum).then(data => {
    if (data.length === 0) {
        trip.appendChild(noChild("wishTrip"));
        return;
    }
    console.log(data);
    data.forEach(likeList => {
        let type = `${likeList.contentTypeId}`;
        const li = document.createElement("li");
        const div = document.createElement("div");
        div.classList.add("tripCardSection");
        div.innerHTML = `
            <div class="tripImgDiv"><img src="${likeList.firstImage ? `${likeList.firstImage}` : "/dist/image/noimage.jpg"}" alt="프로필 사진" class="tripImg"></div>
            <div class="tripinfo">
                <ul>
                    <li><h3><a href="${locationfind(type)}${likeList.like.likeCode}">${likeList.like.likeName}</a></h3></li>
                </ul>
            </div>
            <div class="tripSetting">
                <button type="button" onclick="delHandler(${likeList.like.likeCode})"><img src="/dist/image/trash-2.svg"></button>
            </div>`;
        li.appendChild(div);
        trip.appendChild(li);
    });
}).catch(err => {
    console.log(err);
});

async function delHandler(likeNum){
    const info ={
        uno : unoNum,
        likeCode : likeNum
    };
    const result = await deleteLike(info);
    console.log(result);
    if(result === "1"){
        alert("코스 삭제");
        location.href = `/mypage?uno=${unoNum}&location=wishTrip`;
    }else{
        alert("코스 삭제 실패");
    }
}


async function tripCall(unoNum) {
    const url = "/mypage/tripCall?uno=" + unoNum;
    const config = {
        method: "GET"
    };
    const res = await fetch(url, config);
    return await res.json();
}

async function deleteLike(likeNum){
    console.log(likeNum);
    const url = "/mypage/likeDel";
    const config = {
        method : "DELETE",
        headers :{
            "content-Type" : "application/json",
        },
        body: JSON.stringify(likeNum)
    }
    const res = await fetch(url,config);
    return await res.text();
}
