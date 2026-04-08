document.addEventListener("submit", function (e) {
    e.preventDefault();
    
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalBtnText = btn.innerHTML;
    
    // बटन को लोडिंग मोड में डालें
    btn.innerHTML = "सेव हो रहा है... ⏳";
    btn.disabled = true;

    const scriptURL = 'https://script.google.com/macros/s/AKfycbyuNgvUNcDQXt-D4JfazMY8VZG9tRVAnYv-rTtdfoXKDysRLbSK8ut3lKSnb5ihYJfl/exec';
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Google Sheet को डेटा भेजना
    fetch(scriptURL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) })
    .then(() => {
        alert("सफलता: जानकारी सुरक्षित हो गई!");
        btn.innerHTML = originalBtnText;
        btn.disabled = false;
        form.reset();
        
        // अगले पेज पर भेजें (जरूरत के हिसाब से)
        if(data.userType === "Worker") window.location.href = "attendance.html";
        else if(data.userType === "Owner") alert("अब आप कारीगर बुक कर सकते हैं।");
    })
    .catch(error => {
        console.error('Error!', error.message);
        alert("माफ करें, कुछ तकनीकी दिक्कत है।");
        btn.innerHTML = originalBtnText;
        btn.disabled = false;
    });
});
