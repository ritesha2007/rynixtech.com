import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

// Signup
window.signup = function(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Account created successfully!");
      window.location.href = "dashboard.html";
    })
    .catch(error => {
      alert(error.message);
    });
};

// Login
window.login = function(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login successful!");
      window.location.href = "dashboard.html";
    })
    .catch(error => {
      alert(error.message);
    });
};

// Google Login
window.googleLogin = function() {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(error => {
      alert(error.message);
    });
};

// Logout
window.logout = function() {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

// Forgot Password
window.resetPassword = function(email) {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset email sent.");
    })
    .catch(error => {
      alert(error.message);
    });
};