import {
  createConversation,
  getConversation,
  getUserConversations,
  getMentorConversations,
  addMessage,
  getMessages,
} from "../model/chatModel.js";


export async function startConversation(req, res) {
  try {
    const { userId, mentorId } = req.body;
    if (!userId || !mentorId) {
      return res.status(400).json({ error: "userId and mentorId are required" });
    }
    const conversationId = await createConversation(userId, mentorId);
    res.status(201).json({ message: "Conversation created", conversationId });
  } catch (err) {
    console.error("Error creating conversation:", err);
    res.status(500).json({ error: "Error creating conversation" });
  }
}

export async function fetchConversation(req, res) {
  try {
    const { conversationId } = req.params;
    const conversation = await getConversation(conversationId);
    if (!conversation) return res.status(404).json({ error: "Conversation not found" });
    res.json(conversation);
  } catch (err) {
    console.error("Error fetching conversation:", err);
    res.status(500).json({ error: "Error fetching conversation" });
  }
}

export async function fetchUserConversations(req, res) {
  try {
    const { userId } = req.params;
    const conversations = await getUserConversations(userId);
    res.json(conversations);
  } catch (err) {
    console.error("Error fetching user conversations:", err);
    res.status(500).json({ error: "Error fetching user conversations" });
  }
}

export async function fetchMentorConversations(req, res) {
  try {
    const { mentorId } = req.params;
    const conversations = await getMentorConversations(mentorId);
    res.json(conversations);
  } catch (err) {
    console.error("Error fetching mentor conversations:", err);
    res.status(500).json({ error: "Error fetching mentor conversations" });
  }
}


export async function sendMessage(req, res) {
  try {
    const { conversationId, senderId, senderType, message_text } = req.body;
    if (!conversationId || !senderId || !senderType || !message_text) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const messageId = await addMessage(conversationId, senderId, senderType, message_text);
    res.json({ message: "Message sent", messageId });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Error sending message" });
  }
}

export async function fetchMessages(req, res) {
  try {
    const { conversationId } = req.params;
    const messages = await getMessages(conversationId);
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Error fetching messages" });
  }
}

