import random
import string

def generate_password(length, upper, lower, digits, symbols):
    chars = ""

    if upper:
        chars += string.ascii_uppercase
    if lower:
        chars += string.ascii_lowercase
    if digits:
        chars += string.digits
    if symbols:
        chars += string.punctuation

    if not chars:
        return None

    return "".join(random.choice(chars) for _ in range(length))


def check_strength(password):
    score = 0

    if len(password) >= 8:
        score += 1
    if any(c.islower() for c in password):
        score += 1
    if any(c.isupper() for c in password):
        score += 1
    if any(c.isdigit() for c in password):
        score += 1
    if any(c in string.punctuation for c in password):
        score += 1

    if score <= 2:
        return "Weak"
    elif score <= 4:
        return "Medium"
    else:
        return "Strong"
