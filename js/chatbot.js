import { GoogleGenerativeAI } from "@google/generative-ai";
const chatbotToggle = document.querySelector('.chatbot__button');
const sendChatBtn = document.querySelector('.chatbot__input-box span');
const chatInput = document.querySelector('.chatbot__textarea');
const chatBox = document.querySelector('.chatbot__box');
const chatbotCloseBtn = document.querySelector('.chatbot__header span');

let userMessage;
// Need gemini key
const genAI = new GoogleGenerativeAI("AIzaSyDOf0NoumfYp7JH53zpsl6TtDgg-E-j3nY");

const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add('chatbot__chat', className);
    let chatContent =
        className === 'outgoing'
            ? `<p></p>`
            : `<span class="material-symbols-outlined">smart_toy</span> <p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector('p').textContent = message;
    return chatLi;
};

const chatHistory = [{
    role: "user",
    parts: "Quiero que actúes como un asistente de chat de una biblioteca, no respondas que eres un modelo de lenguaje. No agregue secciones que describan cómo se dijo la respuesta o las acciones realizadas. Háblame de la misma manera que lo haría un asistente de chat si estuviera frente a él. Por favor, mantenga la respuesta por debajo de 100 palabras. Por favor, mantenga la respuesta segura"
}, {
    role: "model",
    parts: "De acuerdo, actuaré como un asistente de chat de una biblioteca. No responderé que soy un modelo de lenguaje. No agregaré secciones que describan cómo se dijo la respuesta o las acciones realizadas. Hablaré de la misma manera que lo haría un asistente de chat si estuviera frente a él. Mantendré la respuesta por debajo de 100 palabras. Mantendré la respuesta segura."
}];

let actualHistory = chatHistory;

async function generateResponse(incomingChatLi, userMessage) {
    const messageElement = incomingChatLi.querySelector('p');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
        history: actualHistory,
        generationConfig: {
            maxOutputTokens: 200,
        },
    });

    try {
        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        const text = response.text();

        actualHistory.push({ role: "user", parts: userMessage });
        actualHistory.push({ role: "model", parts: text });

        messageElement.textContent = text;
    } catch (error) {
        console.error("Error generating response:", error);
        messageElement.classList.add('error');
        messageElement.textContent = 'Oops! Intenta de nuevo!';
    }

    chatBox.scrollTo(0, chatBox.scrollHeight);
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = '';
    chatInput.style.height = `${inputInitHeight}px`;

    chatBox.appendChild(createChatLi(userMessage, 'outgoing'));
    chatBox.scrollTo(0, chatBox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi('Thinking...', 'incoming');
        chatBox.appendChild(incomingChatLi);
        chatBox.scrollTo(0, chatBox.scrollHeight);
        generateResponse(incomingChatLi, userMessage);
    }, 600);
};
chatInput.addEventListener('input', () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});
chatbotToggle.addEventListener('click', () =>
    document.body.classList.toggle('show-chatbot')
);
chatbotCloseBtn.addEventListener('click', () =>
    document.body.classList.remove('show-chatbot')
);
sendChatBtn.addEventListener('click', handleChat);