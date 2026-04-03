import os
from flask import Flask, request, jsonify, render_template
from utils import generate_password, check_strength

# 🔹 فولدر القوالب (HTML)
template_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
# 🔹 فولدر الملفات الثابتة (CSS, JS)
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')

# 🔹 إنشاء تطبيق Flask
app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)

# 🔹 الصفحة الرئيسية
@app.route("/")
def home():
    return render_template("index.html")  # هيشيل index.html من templates/

# 🔹 API لإنشاء كلمة سر
@app.route("/generate", methods=["POST"])
def api_generate():
    data = request.json
    length = data.get("length", 12)
    upper = data.get("uppercase", True)
    lower = data.get("lowercase", True)
    digits = data.get("digits", True)
    symbols = data.get("symbols", True)

    password = generate_password(length, upper, lower, digits, symbols)
    if not password:
        return jsonify({"error": "No character types selected"}), 400

    return jsonify({"password": password})

# 🔹 API للتحقق من قوة كلمة السر
@app.route("/strength", methods=["POST"])
def api_strength():
    data = request.json
    password = data.get("password", "")
    strength = check_strength(password)
    return jsonify({"strength": strength})

# 🔹 تشغيل السيرفر
if __name__ == "__main__":
    app.run(debug=True)
