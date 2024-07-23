// Fungsi untuk login
function login() {
    const username = document.getElementById('username').value;
    if (username) {
        localStorage.setItem('username', username);
        window.location.href = 'chat.html';
    } else {
        alert('Please enter a username');
    }
}

// Fungsi untuk logout
function logout() {
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

// Fungsi untuk mengirim pesan
function sendMessage() {
    const messageInput = document.getElementById('message');
    const message = messageInput.value;
    const recipient = localStorage.getItem('recipient');
    if (message && recipient) {
        const chatBox = document.getElementById('chat-box');
        const messageId = Date.now(); // Unique ID for the message
        const username = localStorage.getItem('username');

        const newMessage = document.createElement('div');
        newMessage.innerHTML = `
            ${username}: ${message}
            <button onclick="deleteMessage(${messageId})">x</button>
        `;
        newMessage.id = messageId;
        chatBox.appendChild(newMessage);

        // Simpan pesan ke localStorage
        saveMessage({ id: messageId, sender: username, recipient: recipient, text: `${username}: ${message}` });

        messageInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Fungsi untuk menyimpan pesan ke localStorage
function saveMessage(message) {
    let messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages));
}

// Fungsi untuk menampilkan pesan yang disimpan
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    const chatBox = document.getElementById('chat-box');
    const recipient = localStorage.getItem('recipient');
    const username = localStorage.getItem('username');
    messages.forEach(message => {
        if ((message.sender === username && message.recipient === recipient) ||
            (message.sender === recipient && message.recipient === username)) {
            const messageElement = document.createElement('div');
            messageElement.innerHTML = `
                ${message.text}
                <button onclick="deleteMessage(${message.id})">x</button>
            `;
            messageElement.id = message.id;
            chatBox.appendChild(messageElement);
        }
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Fungsi untuk menghapus pesan
function deleteMessage(messageId) {
    const messageDiv = document.getElementById(messageId);
    let messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages = messages.filter(message => message.id !== messageId);
    localStorage.setItem('messages', JSON.stringify(messages));
    messageDiv.remove();
}

// Fungsi untuk menampilkan username pada halaman chat
function displayUsername() {
    const username = localStorage.getItem('username');
    const recipient = localStorage.getItem('recipient');
    if (username && recipient) {
        document.getElementById('chat-username').textContent = recipient;
        loadMessages(); // Muat pesan yang disimpan saat pengguna login
    } else {
        window.location.href = 'index.html';
    }
}

// Fungsi untuk menampilkan daftar pengguna
function displayUserList() {
    const users = ['Facia', 'Marcel'];
    const username = localStorage.getItem('username');
    const userList = document.getElementById('user-list');
    users.forEach(user => {
        if (user !== username) {
            const userElement = document.createElement('li');
            userElement.textContent = user;
            userElement.onclick = () => {
                localStorage.setItem('recipient', user);
                document.getElementById('chat-box').innerHTML = '';
                displayUsername();
            };
            userList.appendChild(userElement);
        }
    });
}

// Memanggil fungsi displayUsername dan displayUserList saat halaman chat dimuat
if (window.location.pathname.endsWith('chat.html')) {
    displayUsername();
    displayUserList();
}
