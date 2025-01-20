function setCookie(name, value, days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

console.log("Saving URL to cookie: " + window.location.href);
setCookie("url", window.location.href, 1);  // 하루 동안 유효한 쿠키
