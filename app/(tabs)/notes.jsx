import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons"; 
import uuid from 'react-native-uuid';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [isAddNoteModalVisible, setAddNoteModalVisible] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteBody, setNewNoteBody] = useState('');

  const handleNotePress = (note) => {
    setSelectedNote(note);
    setDetailModalVisible(true);
  };

  const handleAddNote = () => {
    if (newNoteTitle.trim() && newNoteBody.trim()) {
      const newNote = {
        id: uuid.v4(),
        title: newNoteTitle,
        body: newNoteBody,
      };
      setNotes([...notes, newNote]);
      setNewNoteTitle('');
      setNewNoteBody('');
      setAddNoteModalVisible(false);
    } else {
      Alert.alert('Error', 'Please enter both title and body.');
    }
  };

  const handleDeleteNote = (id) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setNotes(notes.filter(note => note.id !== id));
            setDetailModalVisible(false);
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <LinearGradient
        colors={["#100025", "rgba(1, 0, 2, 1)"]}
        style={styles.background}
      />
      <View className="bg-[#141414] h-32 justify-center pl-6 pt-10 mb-5">
        <Text className="text-white font-pmedium text-4xl">Notes</Text>
      </View>
      <ScrollView contentContainerStyle={styles.cardsContainer}>
        <View className="grid grid-cols-2 gap-4">
        {notes.map((note) => (
          <TouchableOpacity
            key={note.id} 
            onPress={() => handleNotePress(note)}
            className="bg-[#1f1f1f] p-4 rounded-lg shadow-lg h-40 w-full"
          >
            <Text className="text-white text-xl font-pbold">{note.title}</Text>
            <Text className="text-gray-400 mt-2 font-pregular">{note.body.substring(0, 50)}...</Text>
          </TouchableOpacity>
        ))}
        
        </View>
      </ScrollView>

      
      <Modal
        visible={isDetailModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View className="flex-1 justify-center items-center">
            <ScrollView contentContainerStyle={styles.modalContent}>
              <View className="bg-[#141414] p-6 rounded-lg w-80">
                {selectedNote && (
                  <>
                    <Text className="text-xl font-pbold text-white">{selectedNote.title}</Text>
                    <Text className="mt-4 text-white">{selectedNote.body}</Text>
                    <View className="flex-row justify-end gap-x-3 mt-4">
                      <TouchableOpacity
                        onPress={() => setDetailModalVisible(false)}
                        className="bg-[#ADADAD] p-2 rounded-lg"
                      >
                        <Text className="text-white text-center font-psemibold">Close</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteNote(selectedNote.id)}
                        className="bg-red-600 p-2 rounded-lg"
                      >
                        <Text className="text-white text-center font-psemibold">Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      
      <Modal
        visible={isAddNoteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAddNoteModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View className="flex-1 justify-center items-center">
            <ScrollView contentContainerStyle={styles.modalContent}>
              <View className="bg-[#141414] p-6 rounded-3xl w-80">
                <Text className="text-xl font-pregular mb-4 text-white">Add New Note</Text>
                <TextInput
                  value={newNoteTitle}
                  onChangeText={setNewNoteTitle}
                  placeholder="Title"
                  placeholderTextColor="#aaa"
                  className="border border-gray-300 p-2 mb-4 rounded text-white font-pregular"
                />
                <TextInput
                  value={newNoteBody}
                  onChangeText={setNewNoteBody}
                  placeholder="Body"
                  placeholderTextColor="#aaa"
                  multiline
                  textAlignVertical="top"
                  className="border border-gray-300 p-2 mb-4 rounded h-32 text-white font-pregular"
                />
                <TouchableOpacity
                  onPress={handleAddNote}
                  className="bg-[#3400A1] p-2 rounded-lg mb-2"
                >
                  <Text className="text-white text-center font-psemibold">Add Note</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setAddNoteModalVisible(false)}
                  className="bg-red-500 p-2 rounded-lg"
                >
                  <Text className="text-white text-center font-psemibold">Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => setAddNoteModalVisible(true)}
        className="absolute bottom-28 right-6 bg-[#3400A1] p-4 rounded-full shadow-lg"
      >
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>
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
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark overlay
  },
  modalContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsContainer: {
    flexGrow: 1,
  },
});

export default Notes;
