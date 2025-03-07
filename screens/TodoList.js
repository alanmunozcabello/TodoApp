// TodoList.js (Pantalla principal con soporte para subtareas y tema oscuro)
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal, Button, Image, useColorScheme } from 'react-native';
import TodoItem from '../components/TodoItem';
import { saveTasks, loadTasks, saveUserName, loadUserName } from '../storage';

// Genera un ID aleatorio para cada tarea
const generateId = () => Math.floor(Math.random() * 1000000);

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [settingsModalVisible, setSettingsModalVisible] = useState(false);
    const [taskText, setTaskText] = useState('');
    const [subtasks, setSubtasks] = useState(['']);
    const [category, setCategory] = useState('General');
    const [editingTask, setEditingTask] = useState(null);
    const [userName, setUserName] = useState('User');
    const colorScheme = useColorScheme();

    useEffect(() => {
        loadTasks().then(setTasks);
        loadUserName().then(setUserName);
    }, []);

    useEffect(() => {
        saveTasks(tasks);
    }, [tasks]);

    const addOrUpdateTask = () => {
        if (taskText.trim()) {
            const filteredSubtasks = subtasks.filter(subtask => subtask.trim());
            if (editingTask) {
                setTasks(tasks.map(task => task.id === editingTask.id ? { ...task, text: taskText, subtasks: filteredSubtasks, category } : task));
                setEditingTask(null);
            } else {
                setTasks([...tasks, { id: generateId(), text: taskText, completed: false, category, subtasks: filteredSubtasks }]);
            }
            setTaskText('');
            setSubtasks(['']);
            setCategory('General');
            setModalVisible(false);
        }
    };

    const handleSubtaskChange = (text, index) => {
        const newSubtasks = [...subtasks];
        newSubtasks[index] = text;
        if (text.trim() && index === subtasks.length - 1) {
            newSubtasks.push('');
        }
        setSubtasks(newSubtasks);
    };

    const handleCancel = () => {
        setTaskText('');
        setSubtasks(['']);
        setCategory('General');
        setModalVisible(false);
    };

    const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Bienvenido {userName}!</Text>
                <TouchableOpacity style={styles.settingsButton} onPress={() => setSettingsModalVisible(true)}>
                    <Image source={require('../assets/images/settings-icon-100px.png')} style={styles.settingsIcon} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TodoItem task={item} onToggle={(taskId) => setTasks(tasks.map(task => 
                        task.id === taskId ? { ...task, completed: !task.completed } : task))} 
                        onEdit={(task) => { 
                            setEditingTask(task); 
                            setTaskText(task.text); 
                            setSubtasks(task.subtasks.length ? [...task.subtasks, ''] : ['']); 
                            setCategory(task.category); 
                            setModalVisible(true); 
                        }} 
                        onDelete={(taskId) => 
                            setTasks(tasks.filter(task => task.id !== taskId))} />
                )}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => { setTaskText(''); setCategory(''); setModalVisible(true); }}>
                <Text style={styles.addButtonText}>Añadir Tarea</Text>
            </TouchableOpacity>
            <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={handleCancel}>
                <TouchableOpacity style={styles.modalOverlay} onPress={handleCancel}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Nombre de la tarea" 
                                placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#999'} 
                                value={taskText} 
                                onChangeText={setTaskText} 
                            />
                            {subtasks.map((subtask, index) => (
                                <TextInput
                                    key={index}
                                    style={styles.input}
                                    placeholder={`Subtarea ${index + 1}`}
                                    placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#999'}
                                    value={subtask}
                                    onChangeText={(text) => handleSubtaskChange(text, index)}
                                />
                            ))}
                            <TextInput 
                                style={styles.input} 
                                placeholder="Categoría" 
                                placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#999'} 
                                value={category} 
                                onChangeText={setCategory} 
                            />
                            <View style={styles.textContainer}>
                                <TouchableOpacity style={styles.saveButton} onPress={addOrUpdateTask}>
                                    <Text style={styles.saveButtonText}>Guardar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
            <Modal visible={settingsModalVisible} animationType="slide" transparent={true} onRequestClose={() => setSettingsModalVisible(false)}>
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setSettingsModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Settings</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Tu Nombre" 
                                placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#999'} 
                                value={userName} 
                                onChangeText={setUserName} 
                            />
                            <View style={styles.textContainer}>
                                <TouchableOpacity style={styles.saveButton} onPress={() => { saveUserName(userName); setSettingsModalVisible(false); }}>
                                    <Text style={styles.saveButtonText}>Guardar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setSettingsModalVisible(false)}>
                                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

//NO BORRAR LOS ESTILOS!!!!
const lightStyles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#fff', flex: 1 },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 15 
    },
    title: { fontSize: 26, fontWeight: 'bold', color: '#333' },
    settingsIcon: { width: 24, height: 24 },
    settingsButton: { padding: 10 },
    settingsButtonText: { fontSize: 24, color: '#333' },
    space: { width: '5%', height: '5%' },
    generalButton: { padding: 12 },
    addButton: { backgroundColor: '#007bff', padding: 12, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
    addButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: { 
        width: '80%', 
        backgroundColor: 'white', 
        borderRadius: 10, 
        padding: 20, 
        alignItems: 'center' 
    },
    modalContent: { width: '100%' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    input: { width: '100%', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, marginBottom: 10 },
    textContainer: { width: '80%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    saveButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    cancelButton: { backgroundColor: '#dc3545', padding: 10, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    cancelButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

const darkStyles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#333', flex: 1 },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 15 
    },
    title: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
    settingsIcon: { width: 24, height: 24 },
    settingsButton: { padding: 10 },
    settingsButtonText: { fontSize: 24, color: '#fff' },
    space: { width: '5%', height: '5%' },
    generalButton: { padding: 12 },
    addButton: { backgroundColor: '#007bff', padding: 12, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
    addButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: { 
        width: '80%', 
        backgroundColor: '#444', 
        borderRadius: 10, 
        padding: 20, 
        alignItems: 'center' 
    },
    modalContent: { width: '100%' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#fff' },
    input: { width: '100%', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, marginBottom: 10, color: 'white' },
    textContainer: { width: '80%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    saveButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    cancelButton: { backgroundColor: '#dc3545', padding: 10, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    cancelButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default TodoList;