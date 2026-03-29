// बटन क्लिक होने पर मैसेज दिखाने के लिए
document.addEventListener('DOMContentLoaded', () => {
    const ctaButton = document.getElementById('cta-btn');

    ctaButton.addEventListener('click', () => {
        alert('My Indian Workers प्लेटफॉर्म पर आपका स्वागत है! जल्द ही नई सेवाएं जोड़ी जाएंगी।');
    });
});

// भविष्य में यहाँ आप API कॉल या फॉर्म वैलिडेशन का कोड जोड़ सकते हैं
console.log("My Indian Workers वेबसाइट लोड हो गई है।");


