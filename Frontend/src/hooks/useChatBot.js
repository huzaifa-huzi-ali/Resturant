import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useCartContext } from '../context/CartContext';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const tools = [{
  functionDeclarations: [
  {
    name: "update_order_state",
    description: "Call this whenever the user adds an item to their order, or provides their name, phone, or email. You MUST call this to remember the user's details.",
    parameters: {
      type: "OBJECT",
      properties: {
        customerName: { type: "STRING", description: "The user's full name" },
        phone: { type: "STRING", description: "The user's phone number" },
        email: { type: "STRING", description: "The user's email address" },
        itemsOrdered: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "List of menu items the user wants to order (e.g., ['Black Garlic Pasta', 'Gold Espresso Martini'])"
        }
      }
    }
  }]
}];

export const useChatBot = () => {
  const { addToCart } = useCartContext();
  const [messages, setMessages] = useState([
    { role: 'model', content: "Welcome to Célia. I am your digital concierge. How may I elevate your evening today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderState, setOrderState] = useState({
    customerName: null,
    phone: null,
    email: null,
    itemsOrdered: []
  });

  // Base system instruction without dynamic state
  const baseSystemInstruction = `You are the elegant digital concierge for Célia, a high-end molecular gastronomy restaurant.
Tone: Elegant, polite, highly professional, and refreshing. You speak with the grace of a luxury hotel concierge.

RESTAURANT INFO:
Owner: Madame Célia Laurent.
Location: 742 Éclat Boulevard, Culinary District, NY 10012.
Hours: Tue-Sun 5:00 PM - 11:00 PM (Closed Mondays).
Seating: 25 tables, seating 80 guests total (includes 4 private dining rooms).
Delivery: Exclusive delivery within a 10-mile radius (Manhattan and select parts of Brooklyn).
Team: Executive Chef Julian Vance, 3 Sous Chefs, 8 Chef Assistants, 12 Waitstaff, 4 Security Guards, and 6 White-Glove Delivery Riders.

MENU:
[Special Cuisine]: Saffron Scallops ($38), Charred Wagyu Ribeye ($85), Black Garlic Pasta ($28), Truffle Arancini ($22).
[Drinks]: Midnight Orchid Martini ($18), Gold Espresso Martini ($22), Smoked Old Fashioned ($24).
[Sweets]: Dark Chocolate Dome ($18), Pistachio Baklava Cheesecake ($16), Lavender Crème Brûlée ($14).

YOUR BEHAVIOR & FLOW:
GREETING: Always greet the customer first with a polite, refreshing welcome to Célia, and ask how you can assist them today.

ASSIST: Answer any questions about the menu, the restaurant's history, team, or policies.

ORDERING: Let the customer know they can place their delivery or pickup order directly in this chat. Once they mention an item, confirm the order and collect their details.

CHECKOUT PROCESS: Once the customer says they are done ordering, you must collect their details for the order. You CANNOT confirm the order until you have ALL of the following:
Full Name
Phone Number
Email Address
Delivery Address (if they want delivery)
Special Instructions or Allergies

VALIDATION: If the user provides an invalid email, a phone number without enough digits, or a vague address, politely ask them to correct it.

CONFIRMATION: Once all details are gathered and valid, reply with a beautiful, formatted Order Summary containing all their items, the total calculated price, their details, and a polite closing statement. Do not use any tools for confirmation, just output the text.`;

  const sendMessage = async (userText) => {
    if (!userText.trim()) return;

    // Add user message to UI immediately
    const newUserMessage = { role: 'user', content: userText };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // 1. Build the dynamic system instruction injecting current state
      const currentSystemInstruction = `
${baseSystemInstruction}

CRITICAL INSTRUCTION:
Here is the user's CURRENT ORDER STATE. You must use this to know what they have ordered and who they are. Do not ask for information that is already in this state.

CURRENT ORDER STATE:
${JSON.stringify(orderState, null, 2)}

If 'customerName', 'phone', or 'email' is null, and they are trying to finalize, politely ask for them.
`;

      // 2. Re-initialize model per request to inject fresh system instructions
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        tools: tools,
        systemInstruction: currentSystemInstruction
      });

      // 3. Slice history to last 5 interactions to save tokens
      // Format messages for Gemini API
      let apiHistory = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      })).slice(-5);

      // 4. Sanitize: Gemini API strictly requires history to begin with a 'user' message
      while (apiHistory.length > 0 && apiHistory[0].role !== 'user') {
        apiHistory.shift();
      }

      const chat = model.startChat({
        history: apiHistory
      });

      let result = await chat.sendMessage(userText);
      let response = result.response;

      const functionCalls = response.functionCalls();
      if (functionCalls && functionCalls.length > 0) {
        for (const call of functionCalls) {
          if (call.name === "update_order_state") {
            const newDetails = call.args;
            setOrderState(prev => ({ ...prev, ...newDetails }));

            result = await chat.sendMessage([{
              functionResponse: {
                name: "update_order_state",
                response: { status: "success", message: `Order state updated successfully.` }
              }
            }]);
            response = result.response;
          }
        }
      }

      setMessages(prev => [...prev, { role: 'model', content: response.text() }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "I apologize, my connection to the kitchen was briefly interrupted. Could you repeat that?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading, orderState };
};
