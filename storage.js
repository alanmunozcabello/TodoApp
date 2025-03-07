// storage.js (Manejo de AsyncStorage para persistencia de tareas)
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'TODO_LIST';
const USER_NAME_KEY = 'USER_NAME';

// Guarda las tareas en el almacenamiento local
export const saveTasks = async (tasks) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving tasks:', error);
    }
};

// Carga las tareas desde el almacenamiento local
export const loadTasks = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading tasks:', error);
        return [];
    }
};

// Guarda el nombre del usuario en el almacenamiento local
export const saveUserName = async (userName) => {
    try {
        await AsyncStorage.setItem(USER_NAME_KEY, userName);
    } catch (error) {
        console.error('Error saving user name:', error);
    }
};

// Carga el nombre del usuario desde el almacenamiento local
export const loadUserName = async () => {
    try {
        const storedUserName = await AsyncStorage.getItem(USER_NAME_KEY);
        return storedUserName || 'User';
    } catch (error) {
        console.error('Error loading user name:', error);
        return 'User';
    }
};