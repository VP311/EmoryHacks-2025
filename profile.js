// Import Firebase Auth functions from script.js
import { signInWithGoogle, auth, signOutUser } from "./script.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

async function handleCredentialResponse(response) {
    // Google sends back a JWT token
    const jwt = response.credential;

    console.log("JWT ID Token:", jwt);

    try {
        // Sign in with Firebase using the credential
        const user = await signInWithGoogle(jwt);
        console.log("Signed in with Firebase:", user);
        
        window.location.replace("indext.html");
    } catch (error) {
        console.error("Error signing in:", error);
        alert("Failed to sign in. Please try again.");
    }
}
export function loadIndextPage(){
    if (localStorage.getItem("logged-in") == null){
        return;
    }
    
    // Use Firebase Auth state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userInfoEl = document.getElementById("userInfo");
            if (userInfoEl) {
                userInfoEl.innerHTML = `
                    <p class="right-aligned">Welcome, <strong>${user.displayName || user.email}</strong><input type="image" src="/img/profile-btn.png" style="width:50px; height:50px;" onclick='window.location.replace("profile.html")'/></p>
                `;
            }
            
            const signInEl = document.getElementById("signIn");
            if (signInEl) {
                signInEl.remove();
            }
        }
    });
}
function loadProfilePage(){
    console.log("Logged in :thumbsup:");

    // Use Firebase Auth state
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            console.error("No user found");
            return;
        }

        const profileNameEl = document.getElementById("profile-name");
        const profilePictureEl = document.getElementById("profile-picture");
        const profileEmailEl = document.getElementById("profile-email");

        if (profileNameEl) {
            profileNameEl.innerHTML = user.displayName || user.email || "Your Name";
        }
        if (profilePictureEl) {
            if (user.photoURL) {
                profilePictureEl.innerHTML = `<img src="${user.photoURL}" style="height: 100%; width: 100%; border-radius:50%; opacity: 1"/>`
            } else {
                profilePictureEl.innerHTML = `<img src="/img/profile-btn.png" style="height: 100%; width: 100%; border-radius:50%; opacity: 1"/>`
            }
        }
        if (profileEmailEl) {
            profileEmailEl.innerHTML = user.email || "email@example.com";
        }
    });
}
async function googleSignOut(){
    try {
        await signOutUser();
        console.log("Signed out of this site.");
        window.location.replace("indext.html");
    } catch (error) {
        console.error("Error signing out:", error);
    }
}

// Make handleCredentialResponse available globally for Google Sign-In
window.handleCredentialResponse = handleCredentialResponse;

document.addEventListener("DOMContentLoaded", () =>{
    const homeLink = document.getElementById("home-link");
    if (homeLink) {
        homeLink.addEventListener("click", () => {
            window.location.replace("indext.html")
        });
    }
})