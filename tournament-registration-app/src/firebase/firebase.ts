import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp, getDocs } from 'firebase/firestore';

// Firebase configuration - Replace with your project's config
const firebaseConfig = {
    apiKey: "AIzaSyCUwf6uWki4BwSqRALgQsSEDtisUaxyL-E",
    authDomain: "mmci-8b042.firebaseapp.com",
    projectId: "mmci-8b042",
    storageBucket: "mmci-8b042.firebasestorage.app",
    messagingSenderId: "824822454208",
    appId: "1:824822454208:web:774b01e8d5fd0a721d5a25",
    measurementId: "G-N8MDG5ZHYX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const saveTeamRegistration = async (formData) => {
    // Add a timestamp to the registration
    const registrationData = {
        ...formData,
        registrationDate: Timestamp.now()
    };

    try {
        const docRef = await addDoc(collection(db, "teamRegistrations"), registrationData);
        console.log("Registration saved with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding document:", error);
        throw error;
    }
};



export const getMinistries = async () => {
    let ministriesCache = null;
    if (ministriesCache) {
        console.log('Returning ministries from cache:', ministriesCache);
        return ministriesCache;
    }

    try {
        const response = await getDocs(collection(db, "ministries"));

        // Check if the response is valid
        if (!response || !response.docs) {
            throw new Error('Invalid response from Firestore');
        }
        
        // Assuming the data is structured as a map of ministries
       // Convert the data to an array of ministry objects
        ministriesCache = response.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log('Fetched ministries from Firestore:', ministriesCache);
        return ministriesCache;

    } catch (error) {
        console.error('Error fetching ministries:', error);
        throw error;
    }
};