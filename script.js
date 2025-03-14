document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const firstNameInput = document.getElementById("fname");
    const lastNameInput = document.getElementById("lname");
    const passwordInput = document.getElementById("password");
    const strengthBar = document.getElementById("strength-bar");
    const togglePasswordButton = document.getElementById("toggle-password");
    const msg = document.querySelector(".msg");
    const msgBox = document.querySelector(".msg-box");

    const commonPasswords = new Set([
        "123456", "password", "12345678", "qwerty", "123456789", "12345",
        "abc123", "football", "monkey", "letmein", "sunshine", "iloveyou",
        "welcome", "admin", "passw0rd", "shadow", "baseball", "696969",
        "trustno1", "michael", "ninja", "mustang", "bailey"
    ]);

    togglePasswordButton.addEventListener("click", function () {
        const type = passwordInput.type === "password" ? "text" : "password";
        passwordInput.type = type;
        togglePasswordButton.innerHTML = type === "password" ? `<i class="fa-solid fa-eye"></i>` : `<i class="fa-solid fa-eye-slash"></i>`;
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const password = passwordInput.value.trim();
        const firstName = firstNameInput.value.trim().toLowerCase();
        const lastName = lastNameInput.value.trim().toLowerCase();

        const strength = checkPasswordStrength(password, firstName, lastName);

        updateStrengthUI(strength);
    });

    function checkPasswordStrength(password, firstName, lastName) {
        if (password.length < 8) return { score: 0, text: "Too Short", color: "red" };
        if (commonPasswords.has(password.toLowerCase())) return { score: 1, text: "Very Weak (Common Password)", color: "red" };
        if (containsCommonSubstring(password.toLowerCase())) return { score: 1, text: "Weak (Contains Common Word)", color: "red" };
        if (password.toLowerCase().includes(firstName) || password.toLowerCase().includes(lastName)) return { score: 1, text: "Weak (Contains Name)", color: "red" };

        let score = 2;

        const entropy = calculateEntropy(password);
        if (entropy > 90) score += 2; // High entropy → Very strong
        else if (entropy > 70) score += 1;

        if (hasCommonPatterns(password)) score -= 1;

        if (/[A-Z]/.test(password)) score++; // Uppercase
        if (/[a-z]/.test(password)) score++; // Lowercase
        if (/\d/.test(password)) score++; // Number
        if (/[@$!%*?&]/.test(password)) score++; // Special character

        if (score >= 6) return { score, text: "Very Strong", color: "green" };
        if (score === 5) return { score, text: "Strong", color: "lightgreen" };
        if (score === 4) return { score, text: "Moderate", color: "yellow" };

        return { score, text: "Weak", color: "orange" };
    }

    function calculateEntropy(password) {
        let uniqueChars = new Set(password).size;
        let length = password.length;
        if (uniqueChars <= 1) return 0;
        return Math.log2(Math.pow(uniqueChars, length));
    }

    function hasCommonPatterns(password) {
        const sequentialPattern = /(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi)/i;
        const repeatedChars = /(.)\1{2,}/; 
        const keyboardPatterns = /(qwerty|asdfgh|zxcvbn|password|letmein)/i;
        return sequentialPattern.test(password) || repeatedChars.test(password) || keyboardPatterns.test(password);
    }

    function containsCommonSubstring(password) {
        for (let word of commonPasswords) {
            if (password.includes(word)) {
                return true;
            }
        }
        return false;
    }

    function updateStrengthUI(strength) {
        strengthBar.style.width = `${strength.score * 16.5}%`;
        strengthBar.style.backgroundColor = strength.color;
    
        displayMsg(strength);
    
        const passwordTips = document.getElementById("password-tips");
        if (strength.score < 4) {
            passwordTips.style.display = "block";  // Show tips
        } else {
            passwordTips.style.display = "none";   // Hide tips
        }
    }
    

    function displayMsg(strength) {
        msg.style.display = "block";
        msgBox.textContent = `${strength.text}`;
        msgBox.style.color = strength.color;
    }
});