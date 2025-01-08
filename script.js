const btn = document.getElementById("btn");
const input = document.getElementById("input")
allCookies = document.cookie;

if (document.cookie) {
    window.location.href = "/message"
}

async function postName() {
    if (input.value) {
        const response = await fetch("/api/signup", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: 
                JSON.stringify({ input: `${input.value}`})
        })
        const result = await response.json()
        console.log(result)
        if (result.data) {
           window.location.href = "/message"
           const date = new Date()
           date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
           const expires = date.toUTCString()
           document.cookie = `id=THIS_IS_YOUR_COOKIE_LOGIN_DO_NOT_SHARE_WITH_ANYONE__${result.data.id}; SameSite=none; Secure; expires=${expires}`
        if (result.data.error) {
            console.log(result.data.error)
        }
        if (document.cookie.includes("id")) {
            window.location.href = "/message"
        }
    }
    } 
}

btn.addEventListener("click", postName)