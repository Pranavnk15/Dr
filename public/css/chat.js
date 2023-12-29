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
    return "Our clinic is open from Monday to Saturday, 9 AM to 2 PM & 5 PM to 9:30 PM. We are closed on Sundays.";
  } else if (userInput.includes('What is conservative dentistry?') ) {
    return "Conservative dentistry focuses on preserving natural tooth structure and preventing dental issues. It involves treatments aimed at conserving as much of the original tooth as possible while addressing decay, damage, or structural issues.";
  } else if (userInput.includes('What are dental implants?') ) {
    return "Dental implants are effective for replacing missing teeth. They involve fixing a replacement tooth root into the jawbone to support a crown, bridge, or denture.";
  } else if (userInput.includes('What are dental crowns?') ) {
    return "Dental crowns are caps that cover damaged or decayed teeth, preserving their structure. They're crafted from durable materials like porcelain or metal alloys.";
  } else if (userInput.includes('Explain dental bridges.') || userInput.includes('whate are dental bridges?')) {
    return "Dental bridges replace missing teeth by anchoring artificial teeth to adjacent natural teeth. They restore both appearance and function";
  } else if (userInput.includes('What is a root canal?') ) {
    return "Root canal treatment repairs and saves badly infected or decayed teeth by removing infected pulp and sealing the tooth to prevent further infection.";
  } else if (userInput.includes('What are dental braces for?') ) {
    return "Dental braces correct misaligned teeth and jaws, enhancing both function and appearance.";
  } else if (userInput.includes('What are computerized dental X-rays?') ) {
    return "Computerized X-rays capture detailed images of teeth, gums, and oral structures, aiding in accurate diagnosis and treatment planning.";
  } else if (userInput.includes('What does smile correction involve?') ) {
    return "Smile correction enhances the appearance of teeth and gums, addressing various cosmetic concerns for a better smile.";
  } else if (userInput.includes('What is dental bleaching?') ) {
    return "Dental bleaching lightens tooth color and removes stains or discoloration for a brighter smile";
  } else if (userInput.includes('What is fluoride treatment?') ) {
    return "Fluoride treatment strengthens teeth and prevents tooth decay, using controlled amounts of a natural mineral.";
  } else if (userInput.includes('What are tooth-colored cement and silver fillings?') ) {
    return "Tooth-colored cement blends with natural teeth for aesthetically pleasing fillings. Silver fillings are durable and strong, suitable for high-pressure areas.";
  }
  return "I'm sorry, I may not have the information you're looking for. Please contact us directly for more assistance.";
};

const setScrollPosition = () => {
  if (chatBody.scrollHeight > 0) {
    chatBody.scrollTop = chatBody.scrollHeight;
  }
};
