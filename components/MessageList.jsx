import { View, Text, FlatList } from 'react-native'
import React, { useRef, useEffect } from 'react'
import ChatBubble from './ChatBubble'

const MessageList = ({ messages }) => {
  const flatListRef = useRef(null);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <View className="flex-1 p-4 bg-black">
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const isConsecutive = index > 0 && messages[index - 1].type === item.type;
          return (
            <ChatBubble
              text={item.text}
              type={item.type}
              time={item.time}
              isConsecutive={isConsecutive}
              isRead={item.isRead}
            />
          );
        }}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
    </View>
  );
}

export default MessageList
