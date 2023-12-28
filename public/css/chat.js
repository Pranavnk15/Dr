const chatBody = document.querySelector(".chat-body");
const txtInput = document.querySelector("#txtInput");
const send = document.querySelector(".send");
const chatIcon = document.getElementById('chatIcon');
const chatContainer = document.getElementById('chatContainer');
const closeIcon = document.querySelector('.close-icon');

// Flags to track chatbot state and initial opening
let chatbotOpen = false;
let firstTimeOpen = true;

// Function to handle the welcome message
function welcomeMessage() {
  renderChatbotResponse('Hi, I am Smiley. How can I help you?');
  setScrollPosition();
  firstTimeOpen = false;
}

// Toggle chatbot visibility on clicking the chat icon
chatIcon.addEventListener('click', () => {
  if (!chatbotOpen) {
    chatContainer.style.display = 'block';
    chatIcon.style.display = 'none';
    chatbotOpen = true;
  }
});

// Function to close the chatbot and display the chat icon
function closeChatbot() {
  chatContainer.style.display = 'none';
  chatIcon.style.display = 'block';
  chatbotOpen = false;
}

closeIcon.addEventListener('click', closeChatbot);

send.addEventListener("click", () => renderUserMessage());

txtInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    renderUserMessage();
  }
});

const renderUserMessage = () => {
  const userInput = txtInput.value.trim();
  if (userInput !== "") {
    renderMessageEle(userInput, "user");
    txtInput.value = "";
    setTimeout(() => {
      renderChatbotResponse(userInput);
      setScrollPosition();
    }, 600);
  }
};

const renderChatbotResponse = (userInput) => {
  const res = getChatbotResponse(userInput);
  renderMessageEle(res, "chatbot");
};

const renderMessageEle = (txt, type) => {
  let className = "user-message";
  if (type === "chatbot") {
    className = "chatbot-message";
  }
  const messageEle = document.createElement("div");
  const txtNode = document.createTextNode(txt);
  messageEle.classList.add(className);

  messageEle.appendChild(txtNode);
  chatBody.append(messageEle);
};

const getChatbotResponse = (userInput) => {
  userInput = userInput.toLowerCase().trim();
  
  if (userInput.includes('hello') || userInput.includes('hi')) {
    return "Hello! How can I assist you today?";
  } else if (userInput.includes('appointment')) {
    return "Sure, let's schedule an appointment for you. Fill out the contact us form.";
  } else if (userInput.includes('contact') || userInput.includes('address')) {
    return "You can contact us at the given address, or ring us at the given number";
  } else if (userInput.includes('treatments') || userInput.includes('treatment') || userInput.includes('services') || userInput.includes('service')) {
    return "For detail Info about various treatments provided please visit our treatments page"
  } else if (userInput.includes('hours') || userInput.includes('timing') || userInput.includes('timings')) {
    return "Our clinic is open from Monday to Friday, 9 AM to 2 PM & 5 PM to 9:30 PM. We are closed on Sunday.";
  } 
  return "I'm sorry, I may not have the information you're looking for. Please contact us directly for more assistance.";
};

const setScrollPosition = () => {
  if (chatBody.scrollHeight > 0) {
    chatBody.scrollTop = chatBody.scrollHeight;
  }
};
