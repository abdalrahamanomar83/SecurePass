// Configuration: Ensure this matches your Flask server's address
const API_BASE_URL = 'http://127.0.0.1:5000';

// DOM Elements
const passwordOutput = document.getElementById('password-output');
const copyBtn = document.getElementById('copy-btn');
const generateBtn = document.getElementById('generate-btn');

const lengthInput = document.getElementById('length');
const upperCheck = document.getElementById('uppercase');
const lowerCheck = document.getElementById('lowercase');
const digitsCheck = document.getElementById('digits');
const symbolsCheck = document.getElementById('symbols');

const strengthText = document.getElementById('strength-text');
const bars = [
	document.getElementById('bar-1'),
	document.getElementById('bar-2'),
	document.getElementById('bar-3')
];

// Event Listeners
generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyPassword);

async function generatePassword() {
	// 1. Gather constraints
	const length = parseInt(lengthInput.value) || 12;
	const uppercase = upperCheck.checked;
	const lowercase = lowerCheck.checked;
	const digits = digitsCheck.checked;
	const symbols = symbolsCheck.checked;
	
	if (!uppercase && !lowercase && !digits && !symbols) {
		alert("Please select at least one character type.");
		return;
	}
	
	try {
		// 2. Fetch generated password from Backend[cite: 1]
		const generateRes = await fetch(`${API_BASE_URL}/generate`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ length, uppercase, lowercase, digits, symbols })
		});
		
		if (!generateRes.ok) throw new Error("Failed to generate password");
		const data = await generateRes.json();
		const newPassword = data.password;
		
		// Display password with a quick fade animation
		passwordOutput.style.opacity = 0;
		setTimeout(() => {
			passwordOutput.value = newPassword;
			passwordOutput.style.opacity = 1;
		}, 150);
		
		// 3. Fetch strength rating from Backend[cite: 1]
		checkStrength(newPassword);
		
	} catch (error) {
		console.error("Error:", error);
		passwordOutput.value = "Error connecting to server";
	}
}

async function checkStrength(password) {
	try {
		const strengthRes = await fetch(`${API_BASE_URL}/strength`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ password })
		});
		
		if (!strengthRes.ok) throw new Error("Failed to check strength");
		const data = await strengthRes.json();
		
		updateStrengthUI(data.strength);
	} catch (error) {
		console.error("Error:", error);
	}
}

function updateStrengthUI(strength) {
	strengthText.textContent = strength;
	
	// Reset bars
	bars.forEach(bar => bar.style.backgroundColor = 'var(--card-border)');
	strengthText.style.color = 'var(--text-main)';
	
	// Apply colors based on backend response[cite: 2]
	if (strength === "Weak") {
		bars[0].style.backgroundColor = 'var(--strength-weak)';
		strengthText.style.color = 'var(--strength-weak)';
	} else if (strength === "Medium") {
		bars[0].style.backgroundColor = 'var(--strength-medium)';
		bars[1].style.backgroundColor = 'var(--strength-medium)';
		strengthText.style.color = 'var(--strength-medium)';
	} else if (strength === "Strong") {
		bars[0].style.backgroundColor = 'var(--strength-strong)';
		bars[1].style.backgroundColor = 'var(--strength-strong)';
		bars[2].style.backgroundColor = 'var(--strength-strong)';
		strengthText.style.color = 'var(--strength-strong)';
	}
}

function copyPassword() {
	if (!passwordOutput.value || passwordOutput.value === "Error connecting to server") return;
	
	navigator.clipboard.writeText(passwordOutput.value).then(() => {
		const originalIcon = copyBtn.innerHTML;
		// Switch to checkmark icon temporarily
		copyBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
		
		setTimeout(() => {
			copyBtn.innerHTML = originalIcon;
		}, 2000);
	});
}
