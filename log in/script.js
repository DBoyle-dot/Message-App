const loginInput = document.getElementById("login-input");
const loginBtn = document.getElementById("login-btn");
const passwordLogin = document.getElementById("password-login");
allCookies = document.cookie;

async function logIn() { 
    try { 
        const response = await fetch("/api/login/", { 
            method: "POST", 
            headers: { 
                "content-type": "application/json" 
            }, 
            body: JSON.stringify({ name: `${loginInput.value}` }) 
        }); 
        if (!response.ok) { 
            throw new Error('Network response was not ok'); 
        } 
        const result = await response.json(); 
        console.log(result); 
        if (result.data && result.data.name) { 
            window.location.href = "../message/index.html"; 
        } else { 
            console.log("Login error: Name not found in the response"); 
        } 
    } catch (error) { 
        console.error("Error during login:", error); 
    } 
}

function checkCookie(name) {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(cookie => cookie.startsWith(name))
    if (cookie) {
      return cookie.split('=')[1];
    }
    return null;
}

loginBtn.addEventListener("click", logIn)