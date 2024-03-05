const chatbotToggle = document.querySelector('.chatbot__button');
const sendChatBtn = document.querySelector('.chatbot__input-box span');
const chatInput = document.querySelector('.chatbot__textarea');
const chatBox = document.querySelector('.chatbot__box');
const chatbotCloseBtn = document.querySelector('.chatbot__header span');

let userMessage;
// Need GPT key
const inputInitHeight = chatInput.scrollHeight;
const API_KEY = 'HERE';

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
chatInput.addEventListener('input', () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});
chatbotToggle.addEventListener('click', () =>
    document.body.classList.toggle('show-chatbot')
);
chatbotCloseBtn.addEventListener('click', () =>
    document.body.classList.remove('show-chatbot')
);