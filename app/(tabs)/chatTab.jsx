import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import ChatList from "../../components/ChatList";
import {
  createConversation,
  getConversations,
  updateLastMessageId,
} from "../../services/conversationService";
import * as socketService from "../../services/socketService";
import { MaterialIcons } from "@expo/vector-icons";
import { createConversationHandler } from "../../handlers/createConversationHandler";
import {
  createMessage,
  createUser,
  getMessages,
  initDatabase,
  wipeDatabase,
} from "../../db/dbService";
import { authService } from "../../services/authService";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import MessageIcon from "../../components/MessageIcon";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const router = useRouter(); // Navigation hook
  const [currentUserId, setCurrentUserId] = useState(null);
  const [newConversationId, setNewConversationId] = useState(null); // State to store conversationId

  const fetchCurrentUserId = async () => {
    const user = await authService.getUser(); // Adjust this function as needed
    setCurrentUserId(user.phone_number);
    const username = user.username;
    console.log("Current Username inside fetch:", username);
  };

  const fetchConversations = async () => {
    try {
      const fetchedConversations = await getConversations();
      setConversations(fetchedConversations);
      console.log(
        "Conversations on device",
        await authService.getUser(),
        ": ",
        fetchedConversations
      );
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //wipeDatabase();
  }, []);
  useEffect(() => {
    const connectSocket = async () => {
      try {
        if (!socketService.socket) {
          socketService.connect();
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleConversationCreated = async ({
      sender_id,
      recipient_id,
      username,
    }) => {
      try {
        // Fetch the current user to ensure we're working with the latest data
        const currentUser = await authService.getUser();
        const currentUsername = currentUser.username;
        console.log(
          "Current Username inside handleConversationCreated:",
          currentUsername
        );

        console.log(
          "Conversation Created Event on device:",
          currentUserId,
          "with data",
          { sender_id, recipient_id, username }
        );
        console.log("Current User ID:", currentUserId);

        const conversationId = [sender_id, recipient_id].sort().join("_");

        if (currentUserId === recipient_id) {
          // Recipient receives the conversationCreated event and confirms it
          socketService.socket.emit("confirmConversation", {
            sender_id,
            recipient_id,
            username: currentUsername,
          });
        }
        // Sender processes the conversation creation
        await createUser({
          phone_number: sender_id,
          username: username,
          public_key: "default_public_key",
          profile_pic: "default_profile_pic",
        });

        await createUser({
          phone_number: recipient_id,
          username: username,
          public_key: "default_public_key",
          profile_pic: "default_profile_pic",
        });

        const newConversation = {
          conversation_id: conversationId,
          user1_id: recipient_id,
          user2_id: sender_id,
          last_message_id: null,
        };
        await createConversation(newConversation);

        await createMessage({
          message_id: "message1",
          conversation_id: conversationId,
          sender_id,
          recipient_id,
          content: "Hello",
        });
        await updateLastMessageId({
          conversation_id: conversationId,
          last_message_id: "message1",
        });

        fetchConversations();
        setNewConversationId(conversationId);
      } catch (error) {
        console.log("Error handling conversation creation:", error);
      }
    };

    const handleConversationConfirmed = async ({
      sender_id,
      recipient_id,
      username,
    }) => {
      try {
        const currentUser = await authService.getUser();
        console.log(
          "Conversation Confirmed Event on device:",
          currentUser,
          "with Data",
          { sender_id, recipient_id, username }
        );
        const conversationId = [sender_id, recipient_id].sort().join("_");

        await createUser({
          phone_number: sender_id,
          username: username,
          public_key: "default_public_key",
          profile_pic: "default_profile_pic",
        });

        await createUser({
          phone_number: recipient_id,
          username: username,
          public_key: "default_public_key",
          profile_pic: "default_profile_pic",
        });

        const newConversation = {
          conversation_id: conversationId,
          user1_id: recipient_id,
          user2_id: sender_id,
          last_message_id: null,
        };
        await createConversation(newConversation);

        await createMessage({
          message_id: "message1",
          conversation_id: conversationId,
          sender_id,
          recipient_id,
          content: "Hello",
        });
        await updateLastMessageId({
          conversation_id: conversationId,
          last_message_id: "message1",
        });

        fetchConversations();
      } catch (error) {
        console.log("Error handling conversation confirmation:", error);
      }
    };

    const handleMessageReceived = async (message) => {
      console.log("Received message:", message);
      await receiveMessage(message);
    };

    const receiveMessage = async (message) => {
      console.log("Received message data in chatTab=", message);
      const { message_id, conversation_id, sender_id, recipient_id, content } =
        message;
      const transformedMessage = {
        id: message_id,
        text: content,
        type: "received",
        time: formatTimestamp(new Date()),
        isRead: false,
      };

      setConversations((prevConversations) => {
        return prevConversations.map((convo) =>
          convo.conversation_id === conversation_id
            ? { ...convo, last_message: transformedMessage }
            : convo
        );
      });

      const storedMessage = {
        message_id: message_id,
        conversation_id: conversation_id,
        sender_id: sender_id,
        recipient_id: recipient_id,
        content: content,
      };
      await createMessage(storedMessage);
      console.log(
        "Updating conversation",
        conversation_id,
        "with last_message_id",
        message_id
      );
      await updateLastMessageId({
        conversation_id: conversation_id,
        last_message_id: message_id,
      });
    };

    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const initialize = async () => {
      await connectSocket();
      await fetchCurrentUserId();
      fetchConversations();

      if (socketService.socket) {
        socketService.socket.on(
          "conversationCreated",
          handleConversationCreated
        );
        socketService.socket.on(
          "conversationConfirmed",
          handleConversationConfirmed
        );
        socketService.socket.on("messageSent", handleMessageReceived);
      }
    };

    initialize();

    return () => {
      if (socketService.socket) {
        socketService.socket.off(
          "conversationCreated",
          handleConversationCreated
        );
        socketService.socket.off(
          "conversationConfirmed",
          handleConversationConfirmed
        );
        socketService.socket.off("messageSent", handleMessageReceived);
      }
    };
  }, [currentUserId]);

  useFocusEffect(
    useCallback(() => {
      console.log("Chat screen is focused!");
      fetchConversations();

      return () => {
        console.log("Chat screen is unfocused.");
      };
    }, [])
  );

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <LinearGradient
        colors={["#100025", "rgba(1, 0, 2, 1)"]}
        style={styles.background}
      />
      <View className="bg-[#141414] h-32 justify-center pl-6 pt-10 mb-5">
        <Text className="text-white font-pmedium text-4xl ">Chat</Text>
      </View>
      {!conversations ? (
        <Text className="text-2xl font-psemibold text-white">
          No Conversations yet
        </Text>
      ) : (
        <ChatList conversations={conversations} />
      )}
      <View className="absolute bottom-28 right-6">
        <TouchableOpacity
          onPress={() => setModalVisible(true)} // Show modal on button press
          className="bg-[#3400A1] p-4 rounded-3xl shadow-lg"
          
        >
        <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Type a number..."
        placeholderTextColor="#ADADAD"
        cursorColor={"#ADADAD"}
        style={styles.phoneInput}
        onChangeText={(text) => setPhoneNumber(text)}
        value={phoneNumber}
      />
      {/* Modal for entering phone number */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior="padding"
          className="flex-1 justify-center items-center bg-black bg-opacity-70"
        >
          <View className="bg-[#141414] p-6 rounded-lg w-4/5">
            <Text className="text-white text-xl mb-4">Enter Phone Number</Text>
            <TextInput
              placeholder="Type a number..."
              placeholderTextColor="#ADADAD"
              cursorColor={"#ADADAD"}
              className="font-pregular h-12 pl-6 w-full bg-[#1a1a1a] rounded-xl mb-4 self-center"
              style={{ color: "white" }}
              onChangeText={(text) => {
                setPhoneNumber(text);
              }}
              value={phoneNumber}
            />
            <TouchableOpacity
              onPress={async () => {
                await createConversationHandler(phoneNumber);
                console.log(phoneNumber);
              }}
              className="bg-[#3400A1] p-4 rounded-full shadow-lg"
            >
              <Text className="text-white font-pmedium text-center">
                Create Conversation
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-4"
            >
              <Text className="text-[#ADADAD] text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const height = Dimensions.get("window").height;
const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height + 100 + Constants.statusBarHeight + 1,
  },
  header: {
    backgroundColor: "#141414",
    height: 128,
    justifyContent: "center",
    paddingLeft: 24,
    paddingTop: 40,
    marginBottom: 20,
  },
  headerText: {
    color: "white",
    fontFamily: "pmedium",
    fontSize: 32,
  },
  noConversations: {
    fontSize: 20,
    fontFamily: "psemibold",
    color: "white",
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 112,
    right: 24,
    backgroundColor: "#3400A1",
    padding: 16,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  phoneInput: {
    height: 48,
    paddingLeft: 16,
    width: "75%",
    color: "white",
    fontFamily: "pregular",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    height: 40,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ADADAD",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalButton: {
    backgroundColor: "#3400A1",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Chat;
