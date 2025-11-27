🌿 Himalaya Lip Balm — Product Showcase
A modern, responsive product showcase website for Himalaya Lip Balm, built using HTML, CSS, JavaScript, and a Flask + MySQL backend for handling contact form submissions.


🚀 Features
----------------------------------------------------------------------------
• 🌸 Animated Scroll Effects (AOS) for smooth fade and zoom transitions.
• 🛒 Cart Drawer with Add to Cart, Quantity Update, and Checkout animation.
• 💬 Contact Form integrated with Flask backend and MySQL database.
• 🔝 Back to Top Button for better user experience.
• ⭐ Customer Reviews with “Show More” toggle animation.
• 📱 Fully Responsive design optimized for mobile and desktop screens.
• 🎨 Modern UI built with clean and reusable CSS components.



🧩 Tech Stack

|     Layer      |            Technologies                 |
|----------------|-----------------------------------------|
| **Frontend**   | HTML5, CSS3, JavaScript (modular files) |
| **Animations** | AOS (Animate On Scroll)                 |
| **Backend**    | Flask (Python)                          |
| **Database**   | MySQL                                   |
| **Icons**      | Font Awesome                            |


📂 Project Structure

project/
│
├── static/
│   ├── Assets/
│   │   ├── hero.png
│   │   ├── logo.webp
│   │   └── (other images)
│   │
│   ├── js/
│   │   ├── aos-init.js
│   │   ├── navigation.js
│   │   ├── reviews.js
│   │   ├── backtotop.js
│   │   ├── cart.js
│   │   └── contact.js
│   │
│   └── style.css
│
├── templates/
│   └── index.html
│
├── app.py
└── requirements.txt


⚙️ Setup Instructions
1️⃣ Install Dependencies
Make sure Python and pip are installed. Then, install Flask and MySQL connector:
          pip install flask flask-mysqldb

2️⃣ Run Flask App
In your terminal:
python app.py

Then open your browser and visit:
👉 http://127.0.0.1:5000/


🧠 Notes

• All JavaScript files are now modularized in the /static/js/ folder.
• Each script is linked in the <head> with the defer keyword to ensure they run after the DOM loads.
• Contact form requires a working Flask route (/contact) to handle submissions.
