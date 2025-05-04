// chatbot.js
function setupChatbot() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeChat = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendChat = document.getElementById('send-chat');

    chatToggle.addEventListener('click', () => {
        chatbotContainer.style.display = chatbotContainer.style.display === 'none' ? 'block' : 'none';
    });
    closeChat.addEventListener('click', () => chatbotContainer.style.display = 'none');
    sendChat.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });

    function handleSendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        addMessage('Tú', message);
        chatInput.value = '';
        chatInput.focus();

        addMessage('Asistente', 'Escribiendo...');
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            // Remove typing indicator
            const typingIndicators = Array.from(chatMessages.children).filter(child => child.textContent.includes('Escribiendo...'));
            typingIndicators.forEach(indicator => chatMessages.removeChild(indicator));

            addMessage('Asistente', generateResponse(message));
        }, 1500);
    }

    function addMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function generateResponse(message) {
        const lowerMsg = message.toLowerCase();

        if (/(hola|buenos días|buenas tardes|buenas noches)/.test(lowerMsg)) {
            return "¡Hola! Bienvenido a AltaGama Store. ¿En qué puedo ayudarte hoy?";
        }
        if (/(producto|modelo|teléfono|celular)/.test(lowerMsg)) {
            return "Tenemos los últimos modelos de iPhone, Samsung y Google Pixel. ¿Te interesa alguno en particular?";
        }
        if (/(precio|cuánto cuesta|costo|valor)/.test(lowerMsg)) {
            return "Los precios varían según el modelo. Por ejemplo: iPhone 13 Pro desde $999, Samsung Galaxy S21 Ultra desde $1,199.";
        }
        if (/(característica|especificación|detalle|función)/.test(lowerMsg)) {
            return "Nuestros productos tienen las mejores características: pantallas AMOLED, cámaras profesionales, gran capacidad de almacenamiento.";
        }
        if (/(envío|entrega|tiempo de envío)/.test(lowerMsg)) {
            return "Los envíos tardan de 2 a 5 días hábiles. Ofrecemos envío express con costo adicional.";
        }
        if (/(garantía|garantia)/.test(lowerMsg)) {
            return "Ofrecemos garantía de 1 año en todos nuestros productos.";
        }
        if (/(devolución|reembolso)/.test(lowerMsg)) {
            return "Puedes solicitar devolución o reembolso dentro de los primeros 30 días después de la compra.";
        }

        const responses = [
            "¿En qué más puedo ayudarte?",
            "¿Necesitas ayuda con algún producto?",
            "Estoy para ayudarte, dime en qué.",
            "Cuéntame más para poder asistirte mejor.",
            "¿Quieres que te recomiende algún producto?"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
}
