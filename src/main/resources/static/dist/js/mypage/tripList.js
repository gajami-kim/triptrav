console.log("List in");
var nextList = document.querySelector(".nextTripList");
var prevList = document.querySelector(".prevTripList");


scheduleCall(unoNum).then(data => {
    let prevNum = 0;
    let nextNum = 0;
    if (data.length === 0) {
        nextList.appendChild(noChild("list"));
        prevList.appendChild(noChild("list"));
    } else {
        for (let i = 0; i <= data.length - 1; i++) {
            const li = document.createElement("li");
            const div = document.createElement("div");
            div.classList.add("tripCard");
            div.innerHTML = `
                <div class="tripImgDiv"><img src="${data[i].scheImg ? `${data[i].scheImg}` : "/dist/image/poky.png"}" alt="프로필 사진" class="tripImg"></div>
                <div class="tripinfo">
                    <ul>
                        <li class="myTripTitle"><a href="/schedule/check?sco=${data[i].sco}"><h3>${data[i].scheName}</h3></a></li>
                        <li class="myTripPlace">첫 여행지 : ${data[i].scheTitle}</li>
                        <li class="myTripDate">${changeDate(`${data[i].scheStart}`)} ~ ${changeDate(`${data[i].scheEnd}`)}</li>
                    </ul>
                </div>
                <div class="tripSetting">
                    <button type="button" id="tripListBtn"${data[i].scheRole === 0 ? 'style="display: none;"' : `onclick="deleteHandler(${data[i].sco})"`}>
                    <img src="/dist/image/trash-2.svg"></button>
                </div>`;
            li.appendChild(div);

            if (compareDate(`${data[i].scheEnd}`)) {
                prevList.appendChild(li);
                prevNum++;

            } else {
                nextList.appendChild(li);
                nextNum++;
            }
        }
        if (prevNum === 0) {
            prevList.appendChild(noChild("list"));
        }
        if (nextNum === 0) {
            nextList.appendChild(noChild("list"));
        }
    }
}).catch(err => {
    console.log(err);
});

async function deleteHandler(sco) {
    const result = await deleteSchedule(sco);
    if (result === "1") {
        alert("일정삭제 완료")
        location.reload();
    } else {
        alert("일정삭제 실패");
    }
}

async function scheduleCall(unoNum) {
    try {
        const config = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const url = '/mypage/scheduleCall?uno=' + unoNum;
        const result = await fetch(url, config);
        return await result.json();
    } catch (e) {
        console.log(e);
    }
}


async function deleteSchedule(sco) {
    try {
        const url = "/mypage/schedule?sco=" + sco;
        const config = {
            method: "DELETE",
        }
        const res = await fetch(url, config);
        return await res.text();
    } catch (e) {
        console.log("삭제 실패" + e);
    }
}