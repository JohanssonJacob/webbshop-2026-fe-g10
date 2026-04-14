import { getBaseUrl } from '/src/utils/api.js';

let isLoginMode = true; 

document.addEventListener("DOMContentLoaded", initAuth);

function initAuth() {
    const authForm = document.getElementById("authForm");
    const switchBtn = document.getElementById("switch-btn");

    if (authForm) authForm.addEventListener("submit", handleAuth);
    if (switchBtn) switchBtn.addEventListener("click", toggleMode);
}

function toggleMode() {
    isLoginMode = !isLoginMode;

    const title = document.getElementById("form-title");
    const submitBtn = document.getElementById("submit-btn");
    const nameGroup = document.getElementById("name-group");
    const switchBtn = document.getElementById("switch-btn");
    const switchMsg = document.getElementById("switch-msg");
    const nameInput = document.getElementById("name");

    if (isLoginMode) {
        
        title.innerText = "Login";
        submitBtn.innerText = "Login";
        switchMsg.innerText = "Don't have an account?";
        switchBtn.innerText = "Register here";
        
        nameGroup.classList.add("hidden");
        
        nameInput.required = false;
    } else {
        title.innerText = "Register";
        submitBtn.innerText = "Register";
        switchMsg.innerText = "Already have an account?";
        switchBtn.innerText = "Login here";
        
        nameGroup.classList.remove("hidden");
        
        nameInput.required = true;
    }
}

async function handleAuth(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    const endpoint = isLoginMode ? "auth/login" : "auth/register";
    const API_URL = `${getBaseUrl()}${endpoint}`;

    const bodyData = { email, password };
    if (!isLoginMode) {
        bodyData.name = document.getElementById("name").value;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Auth failed");
        }

        if (isLoginMode) {
            localStorage.setItem("token", data.token);
            alert("Welcome back!");
            window.location.href = "../index.html";
        } else {
            alert("Account created! Please login.");
            toggleMode();
        }

    } catch (error) {
        console.error("Auth Error:", error);
        alert(error.message);
    }
}