
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyuNgvUNcDQXt-D4JfazMY8VZG9tRVAnYv-rTtdfoXKDysRLbSK8ut3lKSnb5ihYJfl/exec";


// --- 1. डेटा सेव करने वाला हिस्सा (Worker + Owner + Booking) ---
document.addEventListener("submit", function(e) {
    e.preventDefault();
    const form = e.target;
    
    // सर्च फॉर्म को छोड़कर बाकी सबको प्रोसेस करेगा
    if (form.id === "searchForm") return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // script.js के अंदर जहाँ data निकाला है, उसके नीचे डालें:
if (data.regMobile && data.regMobile.length !== 10) {
    alert("❌ त्रुटि: मोबाइल नंबर 10 अंकों का होना चाहिए!");
    if(submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = "सबमिट करें";
    }
    return; // फॉर्म को आगे नहीं बढ़ने देगा
}


    // बटन लोडिंग दिखाएगा
    const submitBtn = form.querySelector('button[type="submit"]');
    if(submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "सेव हो रहा है... ⏳";
    }

    fetch(SCRIPT_URL, { 
        method: 'POST',
        mode: 'no-cors', 
        body: JSON.stringify(data) 
    })
            .then(() => {
        // 'type' को छोटा (lowercase) करके चेक करें ताकि कोई गलती न हो
        let type = (data.userType || "").toLowerCase().trim(); 
        let userRole = "रजिस्ट्रेशन";

        if(type === 'worker') {
            userRole = "वर्कर रजिस्ट्रेशन";
        } else if(type === 'owner') {
            userRole = "मालिक रजिस्ट्रेशन";
        } else if(type === 'booking') {
            userRole = "बुकिंग";
        }

        alert("✅ सफलता: " + userRole + " सफल हुआ!");
        form.reset();
   

        
        // अगर बुकिंग है तो पेमेंट पेज पर भेजेगा
        if (type === "booking") {
            window.location.href = 'payment-success.html';
        }
    })

    
    .catch(err => {
        alert("❌ त्रुटि: डेटा सेव नहीं हो सका।");
        console.error(err);
    })
    .finally(() => {
        if(submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "सबमिट करें";
        }
    });
});

// --- 2. वर्कर खोजने वाला हिस्सा (Search) ---
async function searchWorkers() {
    const city = document.getElementById("cityInput").value.trim();
    const work = document.getElementById("workInput").value.trim();
    const resultsDiv = document.getElementById("results");

    if (!city || !work) {
        alert("शहर और काम की कैटेगरी चुनें।");
        return;
    }

    resultsDiv.innerHTML = "खोज रहे हैं... 🔍";

    try {
        const url = `${SCRIPT_URL}?action=search&city=${encodeURIComponent(city)}&work=${encodeURIComponent(work)}`;
        const response = await fetch(url);
        const workers = await response.json();

        resultsDiv.innerHTML = "";
        if (workers.length === 0) {
            resultsDiv.innerHTML = "<p style='color:red;'>❌ कोई कारीगर नहीं मिला।</p>";
            return;
        }

        workers.forEach(w => {
            resultsDiv.innerHTML += `
                <div class="worker-card">
                    <p><b>👤 नाम:</b> ${w.name}</p>
                    <p><b>🔧 काम:</b> ${w.work}</p>
                    <p><b>📍 शहर:</b> ${w.city}</p>
                    <button onclick="showBookingForm()" style="background:#27ae60; color:white; padding:10px; border:none; border-radius:5px; width:100%;">अभी बुक करें</button>
                </div>`;
        });
    } catch (e) {
        resultsDiv.innerHTML = "खोजने में समस्या आई।";
    }
}

let attendanceType = "";

// कैमरे को ट्रिगर करने वाला फंक्शन
function openCamera(type) {
    attendanceType = type;
    document.getElementById("cameraInput").click(); // कैमरा इनपुट पर क्लिक करेगा
}

// फोटो चुनने के बाद का प्रोसेस
function uploadPhoto() {
    const status = document.getElementById("statusMessage");
    const fileInput = document.getElementById("cameraInput");
    
    if (fileInput.files.length === 0) return;

    status.innerHTML = "⏳ फोटो अपलोड हो रही है...";
    
    // यहाँ आप डेटा तैयार करेंगे (यह डेटा आपकी Google Sheet में जाएगा)
    const data = {
        userType: "Attendance",
        action: attendanceType,
        time: new Date().toLocaleString()
    };

    // Google Script पर डेटा भेजना
    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data)
    })
    .then(() => {
        status.innerHTML = "✅ " + (attendanceType === 'In' ? 'Check In' : 'Check Out') + " सफल रहा!";
        alert("बधाई हो! आपकी हाजिरी लग गई है।");
    })
    .catch(err => {
        status.innerHTML = "❌ एरर: हाजिरी नहीं लग पाई।";
        console.error(err);
    });
}


