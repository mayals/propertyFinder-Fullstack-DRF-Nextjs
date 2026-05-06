// src/app/utils/message.tsx
import axiosInstance from "../lib/axios";

export interface Message {
  id: string;
  sender: {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
    email: string;
    profile_picture?: string;
  };
  receiver: {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
    email: string;
    profile_picture?: string;
  };
  property?: {
    id: string;
    title: string;
  };
  subject: string;
  body: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface SendMessageData {
  receiver_id: string;
  property_id?: string;
  subject: string;
  body: string;
}

// Get received messages
export const getReceivedMessages = async (): Promise<Message[]> => {
  try {
    const response = await axiosInstance.get("/property/messages/received/");
    return response.data;
  } catch (e) {
    console.log("getReceivedMessages-e=", e);
    throw e;
  }
};

// Get sent messages
export const getSentMessages = async (): Promise<Message[]> => {
  try {
    const response = await axiosInstance.get("/property/messages/sent/");
    return response.data;
  } catch (e) {
    console.log("getSentMessages-e=", e);
    throw e;
  }
};

// Get message detail
export const getMessageDetail = async (messageId: string): Promise<Message> => {
  try {
    const response = await axiosInstance.get(`/property/messages/${messageId}/`);
    return response.data;
  } catch (e) {
    console.log("getMessageDetail-e=", e);
    throw e;
  }
};

// Send a new message
export const sendMessage = async (data: SendMessageData): Promise<Message> => {
  try {
    const response = await axiosInstance.post("/property/messages/send/", data);
    return response.data;
  } catch (e) {
    console.log("sendMessage-e=", e);
    throw e;
  }
};

// Get unread messages count
export const getUnreadCount = async (): Promise<{ unread_count: number }> => {
  try {
    const response = await axiosInstance.get("/property/messages/unread-count/");
    return response.data;
  } catch (e) {
    console.log("getUnreadCount-e=", e);
    throw e;
  }
};
