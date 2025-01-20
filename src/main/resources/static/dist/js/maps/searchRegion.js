// console.log("search Region js in");
//
// //인트로정보 조회 함수
// async function getIntroInfo(contentTypeId) {
//     try {
//         const url = `https://apis.data.go.kr/B551011/KorService1/detailIntro1?MobileOS=ETC&MobileApp=TripTrav&_type=json&contentId=126676&contentTypeId=${contentTypeId}&serviceKey=${tourAPIKEY}`;
//         const response = await fetch(url);
//         const result = await response.json()
//         return result;
//     }catch (error){
//         console.log(error)
//     }
// }