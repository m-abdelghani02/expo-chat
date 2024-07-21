import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('engima_test_4.db');

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
      { phone_number: '5555555555', username: 'Charlie', public_key: 'charlie_key', profile_pic: 'charlie_pic' },
      { phone_number: '1122334455', username: 'David', public_key: 'david_key', profile_pic: 'david_pic' },
      { phone_number: '5566778899', username: 'Eve', public_key: 'eve_key', profile_pic: 'eve_pic' },
      { phone_number: '6677889900', username: 'Frank', public_key: 'frank_key', profile_pic: 'frank_pic' }
    ];

    sampleUsers.forEach(user => {
      createUser(user);
      console.log('Created user:', user);
    });

    console.log('Sample users inserted successfully');

    // Sample Conversations
    const sampleConversations = [
      { conversation_id: 'convo1', user1_id: '1234567890', user2_id: '0987654321', last_message_id: 'msg6' },
      { conversation_id: 'convo2', user1_id: '1234567890', user2_id: '5555555555', last_message_id: 'msg12' },
      { conversation_id: 'convo3', user1_id: '5555555555', user2_id: '1122334455', last_message_id: 'msg18' },
      { conversation_id: 'convo4', user1_id: '5566778899', user2_id: '6677889900', last_message_id: 'msg24' }
    ];

    sampleConversations.forEach(conversation => {
      createConversation(conversation);
      console.log('Created conversation:', conversation);
    });

    console.log('Sample conversations inserted successfully');

    // Sample Messages
    const sampleMessages = [
      // Messages for convo1
      { message_id: 'msg1', conversation_id: 'convo1', sender_id: '1234567890', recipient_id: '0987654321', content: 'Hey Bob, how’s it going?', timestamp: '2024-07-21 09:00:00' },
      { message_id: 'msg2', conversation_id: 'convo1', sender_id: '0987654321', recipient_id: '1234567890', content: 'Hi Alice! I’m doing well, thanks. How about you?', timestamp: '2024-07-21 09:05:00' },
      { message_id: 'msg3', conversation_id: 'convo1', sender_id: '1234567890', recipient_id: '0987654321', content: 'I’m good too! Just wanted to check in and see if we’re still on for lunch later.', timestamp: '2024-07-21 09:10:00' },
      { message_id: 'msg4', conversation_id: 'convo1', sender_id: '0987654321', recipient_id: '1234567890', content: 'Yes, absolutely. Looking forward to it!', timestamp: '2024-07-21 09:15:00' },
      { message_id: 'msg5', conversation_id: 'convo1', sender_id: '1234567890', recipient_id: '0987654321', content: 'Great! See you soon then.', timestamp: '2024-07-21 09:20:00' },
      { message_id: 'msg6', conversation_id: 'convo1', sender_id: '0987654321', recipient_id: '1234567890', content: 'See you! 😊', timestamp: '2024-07-21 09:25:00' },
      
      // Messages for convo2
      { message_id: 'msg7', conversation_id: 'convo2', sender_id: '1234567890', recipient_id: '5555555555', content: 'Hey Charlie, long time no see!', timestamp: '2024-07-21 10:00:00' },
      { message_id: 'msg8', conversation_id: 'convo2', sender_id: '5555555555', recipient_id: '1234567890', content: 'Alice! It’s been a while. How have you been?', timestamp: '2024-07-21 10:05:00' },
      { message_id: 'msg9', conversation_id: 'convo2', sender_id: '1234567890', recipient_id: '5555555555', content: 'I’ve been great, thanks. Just got back from a vacation.', timestamp: '2024-07-21 10:10:00' },
      { message_id: 'msg10', conversation_id: 'convo2', sender_id: '5555555555', recipient_id: '1234567890', content: 'Sounds amazing! Where did you go?', timestamp: '2024-07-21 10:15:00' },
      { message_id: 'msg11', conversation_id: 'convo2', sender_id: '1234567890', recipient_id: '5555555555', content: 'I went to Hawaii. It was incredible. I’ll share some pictures with you soon.', timestamp: '2024-07-21 10:20:00' },
      { message_id: 'msg12', conversation_id: 'convo2', sender_id: '5555555555', recipient_id: '1234567890', content: 'Can’t wait to see them!', timestamp: '2024-07-21 10:25:00' },

      // Messages for convo3
      { message_id: 'msg13', conversation_id: 'convo3', sender_id: '5555555555', recipient_id: '1122334455', content: 'Hi David, ready for the meeting tomorrow?', timestamp: '2024-07-21 11:00:00' },
      { message_id: 'msg14', conversation_id: 'convo3', sender_id: '1122334455', recipient_id: '5555555555', content: 'Yes, I am. Do we have an agenda?', timestamp: '2024-07-21 11:05:00' },
      { message_id: 'msg15', conversation_id: 'convo3', sender_id: '5555555555', recipient_id: '1122334455', content: 'Yes, I’ll send it over to you shortly.', timestamp: '2024-07-21 11:10:00' },
      { message_id: 'msg16', conversation_id: 'convo3', sender_id: '1122334455', recipient_id: '5555555555', content: 'Thanks! Looking forward to it.', timestamp: '2024-07-21 11:15:00' },
      { message_id: 'msg17', conversation_id: 'convo3', sender_id: '5555555555', recipient_id: '1122334455', content: 'No problem! If you have any questions, just let me know.', timestamp: '2024-07-21 11:20:00' },
      { message_id: 'msg18', conversation_id: 'convo3', sender_id: '1122334455', recipient_id: '5555555555', content: 'Will do. Thanks!', timestamp: '2024-07-21 11:25:00' },

      // Messages for convo4
      { message_id: 'msg19', conversation_id: 'convo4', sender_id: '5566778899', recipient_id: '6677889900', content: 'Hey Frank, what’s the update on the project?', timestamp: '2024-07-21 12:00:00' },
      { message_id: 'msg20', conversation_id: 'convo4', sender_id: '6677889900', recipient_id: '5566778899', content: 'We’re almost done. Just need to finalize a few details.', timestamp: '2024-07-21 12:05:00' },
      { message_id: 'msg21', conversation_id: 'convo4', sender_id: '5566778899', recipient_id: '6677889900', content: 'Great. Can we review it together later today?', timestamp: '2024-07-21 12:10:00' },
      { message_id: 'msg22', conversation_id: 'convo4', sender_id: '6677889900', recipient_id: '5566778899', content: 'Sure, I’m available after 3 PM.', timestamp: '2024-07-21 12:15:00' },
      { message_id: 'msg23', conversation_id: 'convo4', sender_id: '5566778899', recipient_id: '6677889900', content: 'Perfect, I’ll schedule a time.', timestamp: '2024-07-21 12:20:00' },
      { message_id: 'msg24', conversation_id: 'convo4', sender_id: '6677889900', recipient_id: '5566778899', content: 'Looking forward to it!', timestamp: '2024-07-21 12:25:00' }
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
