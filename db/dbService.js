import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('engima_test_3.db');

export const initDatabase = async () => {
  try {
    db.runSync(`CREATE TABLE IF NOT EXISTS Users (
      phone_number TEXT PRIMARY KEY,
      username TEXT,
      public_key TEXT DEFAULT NULL,
      profile_pic TEXT DEFAULT NULL
    )`);
    console.log('User table created successfully');

    db.runSync(`CREATE TABLE IF NOT EXISTS Conversations (
      conversation_id TEXT PRIMARY KEY,
      user1_id TEXT,
      user2_id TEXT,
      last_message_id TEXT DEFAULT NULL,
      FOREIGN KEY (user1_id) REFERENCES Users(phone_number),
      FOREIGN KEY (user2_id) REFERENCES Users(phone_number)
    )`);
    console.log('Conversations table created successfully');

    db.runSync(`CREATE TABLE IF NOT EXISTS Messages (
      message_id TEXT PRIMARY KEY,
      conversation_id TEXT,
      sender_id TEXT,
      recipient_id TEXT,
      content TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES Conversations(conversation_id),
      FOREIGN KEY (sender_id) REFERENCES Users(phone_number),
      FOREIGN KEY (recipient_id) REFERENCES Users(phone_number)
    )`);
    console.log('Messages table created successfully');
  } catch (error) {
    console.log('Error creating tables:', error);
  }
};

export const wipeDatabase = async () => {
  try {
    db.runSync('DROP TABLE IF EXISTS Messages');
    db.runSync('DROP TABLE IF EXISTS Conversations');
    db.runSync('DROP TABLE IF EXISTS Users');
    console.log('Database wiped successfully');
    await initDatabase();
    console.log("Database Created Successfully");
  } catch (error) {
    console.log('Error wiping database:', error);
  }
};

export const populateSampleData = async () => {
  try {
    // Sample Users
    const sampleUsers = [
      { phone_number: '1234567890', username: 'Alice', public_key: 'alice_key', profile_pic: 'alice_pic' },
      { phone_number: '0987654321', username: 'Bob', public_key: 'bob_key', profile_pic: 'bob_pic' },
      { phone_number: '5555555555', username: 'Charlie', public_key: 'charlie_key', profile_pic: 'charlie_pic' }
    ];

    sampleUsers.forEach(user => {
      createUser(user);
      console.log('Created user:', user);
    });

    console.log('Sample users inserted successfully');

    // Sample Conversations
    const sampleConversations = [
      { conversation_id: 'convo1', user1_id: '1234567890', user2_id: '0987654321', last_message_id: null },
      { conversation_id: 'convo2', user1_id: '1234567890', user2_id: '5555555555', last_message_id: null }
    ];

    sampleConversations.forEach(conversation => {
      createConversation(conversation);
      console.log('Created conversation:', conversation);
    });

    console.log('Sample conversations inserted successfully');

    // Sample Messages
    const sampleMessages = [
      { message_id: 'msg1', conversation_id: 'convo1', sender_id: '1234567890', recipient_id: '0987654321', content: 'Hello, Bob!' },
      { message_id: 'msg2', conversation_id: 'convo1', sender_id: '0987654321', recipient_id: '1234567890', content: 'Hi, Alice!' },
      { message_id: 'msg3', conversation_id: 'convo2', sender_id: '1234567890', recipient_id: '5555555555', content: 'Hey, Charlie!' },
      { message_id: 'msg4', conversation_id: 'convo2', sender_id: '5555555555', recipient_id: '1234567890', content: 'What\'s up, Alice?' }
    ];

    sampleMessages.forEach(message => {
      createMessage(message);
      console.log('Created message:', message);
    });

    console.log('Sample messages inserted successfully');
  } catch (error) {
    console.log('Error inserting sample data:', error);
  }
};

export const checkTableContents = async () => {
  try {
    const users = db.getAllSync('SELECT * FROM Users');
    console.log('Users:', users);

    const conversations = db.getAllSync('SELECT * FROM Conversations');
    console.log('Conversations:', conversations);

    const messages = db.getAllSync('SELECT * FROM Messages');
    console.log('Messages:', messages);
  } catch (error) {
    console.log('Error checking table contents:', error);
  }
};

export const createUser = ({ phone_number, username, public_key, profile_pic }) => {
  try {
    db.runSync('INSERT INTO Users (phone_number, username, public_key, profile_pic) VALUES (?, ?, ?, ?)', [phone_number, username, public_key, profile_pic]);
  } catch (error) {
    console.log('Error creating user', error);
  }
};

export const getUser = (phone_number) => {
  try {
    const user = db.getFirstSync('SELECT * FROM Users WHERE phone_number = ?', phone_number);
    if (user) {
      const data = {
        phone_number: user.phone_number,
        username: user.username,
        public_key: user.public_key,
        profile_pic: user.profile_pic
      };
      console.log(data);
      return data;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUsers = () => {
  try {
    const users = db.getAllSync('SELECT * FROM Users');
    if (users.length > 0) {
      const userData = users.map(user => ({
        phone_number: user.phone_number,
        username: user.username,
        public_key: user.public_key,
        profile_pic: user.profile_pic
      }));
      console.log(userData);
      return userData;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteUser = (phone_number) => {
  try {
    db.runSync('DELETE FROM Users WHERE phone_number = ?', phone_number);
  } catch (error) {
    console.log(error);
  }
};

export const createConversation = ({ conversation_id, user1_id, user2_id, last_message_id }) => {
  try {
    db.runSync('INSERT INTO Conversations (conversation_id, user1_id, user2_id, last_message_id) VALUES (?, ?, ?, ?)', [conversation_id, user1_id, user2_id, last_message_id]);
  } catch (error) {
    console.log('Error creating conversation', error);
  }
};

export const getConversation = (conversation_id) => {
  try {
    const conversation = db.getFirstSync('SELECT * FROM Conversations WHERE conversation_id = ?', conversation_id);
    if (conversation) {
      const data = {
        conversation_id: conversation.conversation_id,
        user1_id: conversation.user1_id,
        user2_id: conversation.user2_id,
        last_message_id: conversation.last_message_id
      };
      console.log(data);
      return data;
    } else {
      throw new Error('Conversation not found');
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getConversations = () => {
  try {
    const conversations = db.getAllSync('SELECT * FROM Conversations');
    if (conversations.length > 0) {
      const conversationData = conversations.map(conversation => ({
        conversation_id: conversation.conversation_id,
        user1_id: conversation.user1_id,
        user2_id: conversation.user2_id,
        last_message_id: conversation.last_message_id
      }));
      console.log(conversationData);
      return conversationData;
    } else {
      throw new Error('Conversations not found');
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteConversation = (conversation_id) => {
  try {
    db.runSync('DELETE FROM Conversations WHERE conversation_id = ?', conversation_id);
  } catch (error) {
    console.log(error);
  }
};

export const updateConversation = ({ conversation_id, last_message_id }) => {
  try {
    db.runSync('UPDATE Conversations SET last_message_id = ? WHERE conversation_id = ?', [last_message_id, conversation_id]);
  } catch (error) {
    console.log('Error updating conversation', error);
  }
};

export const createMessage = ({ message_id, conversation_id, sender_id, recipient_id, content }) => {
  try {
    db.runSync('INSERT INTO Messages (message_id, conversation_id, sender_id, recipient_id, content) VALUES (?, ?, ?, ?, ?)', [message_id, conversation_id, sender_id, recipient_id, content]);
  } catch (error) {
    console.log('Error creating message', error);
  }
};

export const getMessage = (message_id) => {
  try {
    const message = db.getFirstSync('SELECT * FROM Messages WHERE message_id = ?', message_id);
    if (message) {
      const data = {
        message_id: message.message_id,
        conversation_id: message.conversation_id,
        sender_id: message.sender_id,
        recipient_id: message.recipient_id,
        content: message.content,
        timestamp: message.timestamp
      };
      console.log(data);
      return data;
    } else {
      throw new Error('Message not found');
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getMessages = (conversation_id) => {
  try {
    const messages = db.getAllSync('SELECT * FROM Messages WHERE conversation_id = ?', conversation_id);
    if (messages.length > 0) {
      const messageData = messages.map(message => ({
        message_id: message.message_id,
        conversation_id: message.conversation_id,
        sender_id: message.sender_id,
        recipient_id: message.recipient_id,
        content: message.content,
        timestamp: message.timestamp
      }));
      console.log(messageData);
      return messageData;
    } else {
      throw new Error('Messages not found for this conversation');
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateMessage = ({ message_id, content }) => {
  try {
    db.runSync('UPDATE Messages SET content = ? WHERE message_id = ?', [content, message_id]);
    return true;
  } catch (error) {
    console.log('Error updating message', error);
    return false;
  }
};

export const deleteMessage = (message_id) => {
  try {
    db.runSync('DELETE FROM Messages WHERE message_id = ?', message_id);
  } catch (error) {
    console.log(error);
  }
};
