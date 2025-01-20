console.log('place in');

var place = document.querySelector(".wishPlaceDiv");
var foodList = document.querySelector(".wishFoodList");
var placeList = document.querySelector(".wishPlaceList");

likeCall(unoNum).then(data => {
    let foodNum = 0;
    let placeNum = 0;
    if (data.length === 0) {
        place.appendChild(noChild("wishPlace"));
        document.querySelector(".cateBtn").style.display = "none";
        return;
    }
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
        if (type === "12" || type === "14") {
            const placeLi = li.cloneNode(true);
            placeList.appendChild(placeLi);
            placeNum++;
        }
        if (type === "39") {
            const foodLi = li.cloneNode(true);
            foodList.appendChild(foodLi);
            foodNum++;
        }
        if(foodNum === 0){
            foodList.appendChild(noChild("wishPlace"));
        }
        if(placeNum===0){
            placeList.appendChild(noChild("wishPlace"));
        }
        place.appendChild(li);
        placeList.style.display = "none";
        foodList.style.display = "none";
    });
}).catch(err => {
    console.log(err);
});

var buttons = document.getElementsByTagName("button");

Array.from(buttons).forEach(button => {
    button.addEventListener("click", function(e) {
        switch (e.target.id) {
            case "allList":
                placeList.style.display = "none";
                foodList.style.display = "none";
                place.style.display = "flex";
                console.log("전체");
                break;
            case "onlyFoodList":
                place.style.display = "none";
                placeList.style.display = "none";
                foodList.style.display = "flex";
                console.log("음식");
                break;
            case "onlyPlaceList":
                place.style.display = "none";
                foodList.style.display = "none";
                placeList.style.display = "flex";
                console.log("장소");
                break;
            default:
                console.log("다른 버튼");
                break;
        }
    });
});


async function delHandler(likeNum){
    const info ={
        uno : unoNum,
        likeCode : likeNum
    };
    const result = await deleteLike(info);
    console.log(result);
    if(result === "1"){
        alert("찜 삭제");
        location.reload();
    }else{
        alert("찜 삭제 실패");
    }
}


async function likeCall(unoNum) {
    const url = "/mypage/likeCall?uno=" + unoNum;
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
