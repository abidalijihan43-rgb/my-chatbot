(function() {
    // ১. চ্যাট উইজেটের বাটন তৈরি
    let btn = document.createElement("button");
    btn.id = "chat-widget-button";
    btn.innerHTML = "💬";
    btn.style.cssText = "position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; border-radius: 50%; background: #854fff; color: white; border: none; font-size: 24px; cursor: pointer; z-index: 99999; box-shadow: 0 4px 10px rgba(0,0,0,0.2);";
    document.body.appendChild(btn);

    // ২. চ্যাট উইজেটের মেইন বক্স তৈরি
    let container = document.createElement("div");
    container.id = "chat-widget-container";
    container.style.cssText = "display: none; flex-direction: column; position: fixed; bottom: 90px; right: 20px; width: 350px; height: 450px; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); z-index: 99999; overflow: hidden; font-family: Arial, sans-serif;";
    
    container.innerHTML = `
        <div id="chat-widget-header" style="background: #854fff; color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center; font-weight: bold;">
            <span>Chat Support</span>
            <button id="chat-widget-close" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer;">✖</button>
        </div>
        <div id="chat-widget-body" style="flex: 1; padding: 15px; overflow-y: auto; background: #f9f9f9; display: flex; flex-direction: column;">
            <p style="margin-bottom: 20px; color: #333;"><strong>Hi 👋, how can we help?</strong></p>
        </div>
        <div id="chat-widget-footer" style="padding: 10px; border-top: 1px solid #eee; display: flex; gap: 5px;">
            <input type="text" id="chat-widget-input" placeholder="Type your message here..." style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; outline: none;">
            <button id="chat-widget-send" style="background: #854fff; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Send</button>
        </div>
    `;
    document.body.appendChild(container);

    // ৩. চ্যাট আইডি জেনারেট করা
    function getChatId() {
        let chatId = sessionStorage.getItem("chatId");
        if (!chatId) {
            chatId = "chat_" + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem("chatId", chatId);
        }
        return chatId;
    }

    // ৪. বাটন ক্লিক লজিক
    btn.addEventListener("click", function() {
        container.style.display = "flex";
        btn.style.display = "none";
    });

    document.getElementById("chat-widget-close").addEventListener("click", function() {
        container.style.display = "none";
        btn.style.display = "flex";
    });

    // ৫. মেসেজ পাঠানো এবং n8n কানেকশন
    document.getElementById("chat-widget-send").addEventListener("click", function() {
        let inputField = document.getElementById("chat-widget-input");
        let message = inputField.value;
        if (message.trim() === "") return;

        let chatBody = document.getElementById("chat-widget-body");
        
        let userMessage = document.createElement("p");
        userMessage.textContent = message;
        userMessage.style.cssText = "color: #333; background: #e2e8f0; padding: 8px 12px; border-radius: 8px; margin-bottom: 10px; max-width: 80%; align-self: flex-end; margin-left: auto;";
        chatBody.appendChild(userMessage);
        chatBody.scrollTop = chatBody.scrollHeight;

        let chatId = getChatId();
        inputField.value = "";

        fetch('https://n8n.srv1106977.hstgr.cloud/webhook/dfb00eeb-bb7a-4582-91e4-898b1bc50a48/chat', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chatId: chatId,
                message: message,
                route: 'general'
            })
        })
        .then(response => response.json())
        .then(data => {
            let botMessage = document.createElement("p");
            botMessage.innerHTML = data.output || "Sorry, I couldn't understand that.";
            botMessage.style.cssText = "color: #fff; background: #854fff; padding: 8px 12px; border-radius: 8px; margin-bottom: 10px; max-width: 80%; margin-right: auto;";
            chatBody.appendChild(botMessage);
            chatBody.scrollTop = chatBody.scrollHeight;
        })
        .catch(error => console.error("Error:", error));
    });
})();