// document.querySelector(".LoginArea").addEventListener("submit", function(event) {
//     event.preventDefault();
//
//     const email = document.querySelector('input[type="text"]').value;
//     const password = document.querySelector('input[type="password"]').value;
//
//     console.log("로그인 시도 email >>>> ", email);
//
//     fetch("/user/login", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             email: email,
//             pw: password
//         })
//     }).then(response => {
//         if (response.ok) {
//             window.location.href = "/";
//         } else {
//             alert("로그인 실패");
//         }
//     }).catch(error => {
//         console.error("Error:", error);
//     });
// });
