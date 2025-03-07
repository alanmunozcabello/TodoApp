// TodoItem.js (Componente individual de tarea con subtareas y opciones de completado)
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const TodoItem = ({ task, onToggle, onEdit, onDelete }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleLongPress = () => {
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    return (
        <>
            <TouchableOpacity onLongPress={handleLongPress} onPress={() => onToggle(task.id)}>
                <View style={[styles.item, task.completed && styles.completedItem]}> 
                    <View style={styles.textContainer}>
                        <Text style={[styles.text, task.completed && styles.completedText]}> 
                            {task.text}
                        </Text>
                        <Text style={[styles.text, styles.tag]}>
                            #{task.category}
                        </Text> 
                    </View>

                    {task.subtasks && task.subtasks.length > 0 && (
                        <View style={styles.subtaskContainer}>
                            {task.subtasks.map((subtask, index) => (
                                <Text key={index} style={styles.subtaskText}>- {subtask}</Text>
                            ))}
                        </View>
                    )}
                </View>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={handleCancel}
            >
                <TouchableOpacity style={styles.modalOverlay} onPress={handleCancel}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Opciones de tarea</Text>

                            <TouchableOpacity style={styles.modalButtonEdit} onPress={() => { onEdit(task); handleCancel(); }}>
                                <Text style={styles.modalButtonText}>Editar</Text>
                            </TouchableOpacity>

                            <View style={styles.modalButtonRow}>
                                <TouchableOpacity style={styles.modalButtonDelete} onPress={() => { onDelete(task.id); handleCancel(); }}>
                                    <Text style={styles.modalButtonText}>Eliminar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButtonCancel} onPress={handleCancel}>
                                    <Text style={styles.modalButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    item: { 
        padding: 12, 
        borderBottomWidth: 1,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        marginVertical: 5,
        elevation: 2
    },
    text: { fontSize: 18, color: '#333' },
    completedText: { textDecorationLine: 'line-through', color: 'gray' },
    completedItem: { backgroundColor: '#e0e0e0' },
    subtaskContainer: { paddingLeft: 15, marginTop: 5 },
    subtaskText: { fontSize: 16, color: '#555' },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tag: {
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
    },
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
        alignItems: 'center',
    },
    modalContent: {
        width: '100%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButtonEdit: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#007bff',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalButtonDelete: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'red',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalButtonCancel: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'red',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default TodoItem;