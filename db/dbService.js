import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('engima_test.db');

export const initDatabase = async () => {
  try {
    db.withTransactionSync(async () => {
      db.execSync( `CREATE TABLE IF NOT EXISTS Users (
        phone_number TEXT PRIMARY KEY,
        username TEXT,
        public_key TEXT DEFAULT NULL,
        profile_pic TEXT DEFAULT NULL,
      )`);
      console.log('User table created successfully');
    });
  } catch (error) {
    console.log('Error creating user table:', error);
  }
  try {
    db.withTransactionSync(async () => {
      db.execSync( 
            `CREATE TABLE IF NOT EXISTS Conversations (
            conversation_id TEXT PRIMARY KEY,
            user1_id INTEGER,
            user2_id INTEGER,
            last_message_id TEXT DEFAULT NULL,
            FOREIGN KEY (user1_id) REFERENCES Users(phone_number),
            FOREIGN KEY (user2_id) REFERENCES Users(phone_number)
          )`
          );
      console.log('User table created successfully');
    });
  } catch (error) {
    console.log('Error creating user table:', error);
  }
  try {
    db.withTransactionSync(async () => {
      db.execSync( 
            `CREATE TABLE IF NOT EXISTS Messages (
            message_id TEXT PRIMARY KEY, 
            conversation_id TEXT,
            sender_id INTEGER,
            recipient_id INTEGER,
            content TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (conversation_id) REFERENCES Conversations(conversation_id),
            FOREIGN KEY (sender_id) REFERENCES Users(phone_number),
            FOREIGN KEY (recipient_id) REFERENCES Users(phone_number)
          )`
          );
      console.log('Messages table created successfully');
    });
  } catch (error) {
    console.log('Error creating user table:', error);
  }
}

export const createUser = ({phone_number, username, public_key, profile_pic}) => {
  try {
    db.withTransactionSync(async () => {
      db.execSync('INSERT INTO Users (phone_number, username, public_key, profile_pic) VALUES (?, ?, ?, ?)', [phone_number, username, public_key, profile_pic]);
    })
  } catch (error) {
    console.log('Error creating user',error);
  }
}

export const getUser = (phone_number) => {
  try {
    const user = this.db.getFirstSync('SELECT * FROM Users WHERE phone_number = ?', phone_number);
    if (user) {
      data = {
        phone_number: user.phone_number,
        username: user.username,
        public_key: user.public_key,
        profile_pic: user.profile_pic
      }
      console.log(data);
      return data;
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
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
      throw new Error("User not found");
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const deleteUser = (phone_number) => {
  try {
    db.withTransactionSync(async () => {
      db.execSync('DELETE FROM Users WHERE phone_number = ?', phone_number);
    })
  } catch (error) {
    console.log(error);
  }
}

export const createConversation = ({ conversation_id, user1_id, user2_id, last_message_id }) => {
  try {
    db.withTransactionSync(async () => {
      db.execSync('INSERT INTO Conversations (conversation_id, user1_id, user2_id, last_message_id) VALUES (?, ?, ?, ?)', [conversation_id, user1_id, user2_id, last_message_id]);
    })
  } catch (error) {
    console.log('Error creating conversation', error);
  }
}

export const getConversation = (conversation_id) => {
  try {
    const conversation = db.getFirstSync('SELECT * FROM Conversations WHERE conversation_id = ?', conversation_id);
    if (conversation) {
      const data = {
        conversation_id: conversation.conversation_id,
        user1_id: conversation.user1_id,
        user2_id: conversation.user2_id,
        last_message_id: conversation.last_message_id
      }
      console.log(data);
      return data;
    } else {
      throw new Error("Conversation not found");
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

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
      throw new Error("Conversations not found");
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const deleteConversation = (conversation_id) => {
  try {
    db.withTransactionSync(async () => {
      db.execSync('DELETE FROM Conversations WHERE conversation_id = ?', conversation_id);
    })
  } catch (error) {
    console.log(error);
  }
}

export const updateConversation = ({ conversation_id, last_message_id }) => {
  try {
    db.withTransactionSync(async () => {
      db.execSync('UPDATE Conversations SET last_message_id = ? WHERE conversation_id = ?', [last_message_id, conversation_id]);
    })
  } catch (error) {
    console.log('Error updating conversation', error);
  }
}

export const createMessage = ({ message_id, conversation_id, sender_id, recipient_id, content }) => {
  try {
    db.withTransactionSync(async () => {
      db.execSync('INSERT INTO Messages (message_id, conversation_id, sender_id, recipient_id, content) VALUES (?, ?, ?, ?, ?)', [message_id, conversation_id, sender_id, recipient_id, content]);
    })
  } catch (error) {
    console.log('Error creating message', error);
  }
}

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
      }
      console.log(data);
      return data;
    } else {
      throw new Error("Message not found");
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

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
      throw new Error("Messages not found for this conversation");
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
export const updateMessage = ({ message_id, content }) => {
  try {
    db.withTransactionSync(async () => {
      db.execSync('UPDATE Messages SET content = ? WHERE message_id = ?', [content, message_id]);
    })
    return true;
  } catch (error) {
    console.log('Error updating message', error);
    return 
  }
}

export const deleteMessage = (message_id) => {
  try {
    db.withTransactionSync(async () => {
      db.execSync('DELETE FROM Messages WHERE message_id = ?', message_id);
    })
  } catch (error) {
    console.log(error);
  }
}


