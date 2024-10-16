// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore"
import { toast } from "react-toastify";


const firebaseConfig = {
    apiKey: "AIzaSyDhmAnWcmynZVkGCHR5vnfKRepDuC0RRjg",
    authDomain: "quick-chat-d138f.firebaseapp.com",
    projectId: "quick-chat-d138f",
    storageBucket: "quick-chat-d138f.appspot.com",
    messagingSenderId: "249467221662",
    appId: "1:249467221662:web:d597794578ca68507cad8f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;

        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username: username.toLowerCase(),
            email,
            name: "",
            avatar: "",
            bio: "Hey there, I am using chat app",
            lastSeen: Date.now()
        });

        await setDoc(doc(db, "chats", user.uid), {
            chatsData: []
        });

        console.log("User document and chat document successfully created!");
    } catch (error) {
        console.error("Error creating user or writing to Firestore:", error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
};

const login = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("logged in successfully");

    } catch (error) {
        console.error("Error creating user or writing to Firestore:", error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logout = async () => {
    try {
        await signOut(auth)
        console.log("logout in successfully");
    } catch (error) {
        console.error("Error creating user or writing to Firestore:", error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const resetPassword = async (email) => {
    if (!email) {
        toast.error("Enter your Email");
        return null;
    }
    try {
        const userRef = collection(db, 'users');
        const q = query(userRef, where("email", "==", email));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
            await sendPasswordResetEmail(auth, email);
            toast.success("Reset Email Sent")
        } else {
            toast.error("Email doesn't exists")
        }
    } catch (error) {
        console.error(error);
        toast.error(error.message);

    }

}



export { signup, login, logout, auth, db, resetPassword }