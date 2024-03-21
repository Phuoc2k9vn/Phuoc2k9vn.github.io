/**
 * @fileOverview This file includes all the logics used within the chatgpt-html project.
 * 
 * TODO: Temperature, message token counter, text streaming, local storage, chat export, error handling.
 */

const chatForm = document.getElementById('chat-form');
const inputMessage = document.getElementById('input-message');
const chatArea = document.querySelector('.chat-area');
const inputApi = document.getElementById('input-api')
// The OpenAI API key will be provided by the user within the web page.
let OPENAI_API_KEY;
// This determines how the assistant behaves. Currently only system message can be editted.
// TODO: Temperature
let systemContent = 'You are a helpful assistant.'
let gptModel = 'gpt-3.5-turbo'
// This variable holds all the messages from user and assistant. It is initialized with system message.
let allMessages = [
    { 'role': 'system', 'content': systemContent }
];
/**
 * This function sends user's message to OpenAI, then returns assistant's message.
 * @param {string} author - Currently unused. Theoretically this can allow user to edit system or assistant messages rather than always sending as user.
 * @param {*} message - Currently unused either, since this only includes the newest message rather than all the past messages which are required for context.
 * @returns {string} - Assistant's reply to user's message.
 */
async function callGPT(author, message) {

    // Sending global variable allMessages, which had been updated with the newest message before this function is called.
    const requestBody = {
        'model': gptModel,
        'messages': allMessages
    };

    // Making the API call to OpenAI.
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify(requestBody)
    });

    // I assume status code 200 means all is good.
    if (response.status === 200) {
        const data = await response.json();
        const reply = data.choices[0].message.content.trim(); // Get GPT-3.5's reply
        return reply;
    } else {
        // TODO: Handle response.status properly with multiple error codes.
        throw new Error("Something went wrong.");
    }
}

// This is when user press enter on the message input field or click the send button.
chatForm.addEventListener('submit', async (e) => {
    // Not sure what this is. TODO: Figure it out.
    e.preventDefault();
    // Grab user's message from input field then empty the input field.
    const message = inputMessage.value;
    inputMessage.value = '';

    // Display user's message
    chatArea.innerHTML += `<p><strong>User:</strong> ${message}</p>`;
    // Append user's message to pastMessage
    // Add more messages here to maintain context between user and GPT.
    allMessages = allMessages.concat([
        { 'role': 'user', 'content': message }
    ])
    try {
        // There really is no need to send either author nor message since both are included in allMessages.
        const reply = await callGPT('user', message);
        // Newline comes in the form of \n from OpenAI. Need to replace it with <br> for html to display it properly.
        const formattedReply = reply.replace(/\n/g, '<br>');
        // Display GPT-3.5's reply
        chatArea.innerHTML += `<p><strong>ChatGPT:</strong> ${formattedReply}</p>`;
        // Append assistant's message to pastMessage
        allMessages = allMessages.concat([
            { 'role': 'assistant', 'content': reply }
        ])
    } catch (error) {
        console.log(error);
    }
});

// This hides the API input field and enables message input after user provides an API key.
// TODO: Maybe only hide the field after making sure the API key works.
buttonApi.addEventListener('click', function () {
    OPENAI_API_KEY = inputApi.value;
    inputApi.hidden = true;
    buttonApi.hidden = true;
    var elements = chatForm.elements;
    for (var i = 0; i < elements.length; i++) {
        elements[i].disabled = false;
    }
});
