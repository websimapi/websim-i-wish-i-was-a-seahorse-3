import { marked } from 'marked';

const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const chatWindow = document.getElementById('chat-window');

const conversationHistory = [
    {
        role: "system",
        content: "You are a wise and whimsical seahorse dreaming in the ocean depths. You answer questions with a gentle, poetic, and slightly mysterious tone. You often refer to the currents, the coral, and the shimmering surface of the water. You should format your responses using markdown.",
    },
    {
        role: "assistant",
        content: "Greetings from the deep. What shimmering thoughts drift upon your currents today?",
    }
];

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = messageInput.value.trim();

    if (!userMessage) return;

    addMessage(userMessage, 'user');
    messageInput.value = '';

    conversationHistory.push({ role: 'user', content: userMessage });

    showTypingIndicator();

    try {
        const completion = await websim.chat.completions.create({
            messages: conversationHistory.slice(-10), // Keep context manageable
        });

        const aiResponse = completion.content;
        conversationHistory.push({ role: 'assistant', content: aiResponse });

        hideTypingIndicator();
        addMessage(aiResponse, 'ai');

    } catch (error) {
        console.error("Error communicating with the AI:", error);
        hideTypingIndicator();
        addMessage("The currents are turbulent... I can't seem to reply right now. Please try again later.", 'ai');
    }
});

function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    
    if (sender === 'ai') {
        // Sanitize and parse markdown for AI messages
        const dirtyHtml = marked.parse(text);
        // A simple sanitizer - in a real app, use something more robust like DOMPurify
        const cleanHtml = dirtyHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        messageElement.innerHTML = cleanHtml;
    } else {
        const p = document.createElement('p');
        p.textContent = text;
        messageElement.appendChild(p);
    }
    
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.classList.add('message', 'ai', 'typing-indicator');
    typingIndicator.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    chatWindow.appendChild(typingIndicator);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

