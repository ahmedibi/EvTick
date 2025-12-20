import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { db } from "../../firebase/firebase.config"; // Adjust path if needed
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
} from "firebase/firestore";
import { Send, User } from "lucide-react";

export default function LiveChat() {
    const { currentUser } = useSelector((state) => state.auth);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    // Debug: Monitor currentUser changes
    useEffect(() => {
        if (currentUser) {
            // console.log("LiveChat: currentUser updated:", currentUser);
        }
    }, [currentUser]);

    // Debug: Check currentUser state
    // console.log("LiveChat: currentUser:", currentUser);

    // 1. Real-time listener
    useEffect(() => {
        // console.log("LiveChat: mounting. currentUser:", currentUser);
        const q = query(
            collection(db, "streamChat"),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, []);

    // 2. Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 3. Send Message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;

        try {
            let senderName = currentUser.fullName || currentUser.displayName || "Anonymous";

            // Fallback: If no fullName in Redux, try fetching from Firestore 'users' collection once
            if (!currentUser.fullName && currentUser.uid) {
                try {
                    const { doc, getDoc } = await import("firebase/firestore");
                    const userSnap = await getDoc(doc(db, "users", currentUser.uid));
                    if (userSnap.exists() && userSnap.data().fullName) {
                        senderName = userSnap.data().fullName;
                    }
                } catch (err) {
                    console.error("Error fetching user details for chat:", err);
                }
            }

            await addDoc(collection(db, "streamChat"), {
                text: newMessage,
                uid: currentUser.uid || currentUser.id || "unknown",
                fullName: senderName,
                displayName: senderName, // Keep compatible
                createdAt: serverTimestamp(),
                photoURL: currentUser.photoURL || null,
            });
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                backgroundColor: "#1f1f1f",
                borderLeft: "1px solid #333",
                color: "#fff",
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "16px",
                    borderBottom: "1px solid #333",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    backgroundColor: "#252525",
                }}
            >
                Live Chat
            </div>

            {/* Messages Area */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}
            >
                {messages.map((msg) => (
                    <div key={msg.id} style={{ display: "flex", gap: "10px" }}>
                        {/* Avatar (fallback) */}
                        <div
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                backgroundColor: "#444",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                overflow: "hidden"
                            }}
                        >
                            {msg.photoURL ? (
                                <img src={msg.photoURL} alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <User size={18} color="#aaa" />
                            )}
                        </div>

                        <div>
                            <div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                                    <span style={{ fontWeight: "bold", fontSize: "0.9rem", color: "#a5d8ff" }}>
                                        {msg.fullName || msg.displayName || "Anonymous"}
                                    </span>
                                    {/* Optional: Add timestamp if needed */}
                                </div>              </div>
                            <p style={{ margin: "2px 0 0 0", fontSize: "0.95rem", lineHeight: "1.4" }}>
                                {msg.text}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
                style={{
                    padding: "16px",
                    borderTop: "1px solid #333",
                    backgroundColor: "#252525",
                }}
            >
                {currentUser ? (
                    <form
                        onSubmit={handleSendMessage}
                        style={{ display: "flex", gap: "10px" }}
                    >
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Say something..."
                            style={{
                                flex: 1,
                                padding: "10px 14px",
                                borderRadius: "20px",
                                border: "1px solid #444",
                                backgroundColor: "#1a1a1a",
                                color: "#fff",
                                outline: "none",
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            style={{
                                background: "#e74c3c",
                                color: "#fff",
                                border: "none",
                                borderRadius: "50%",
                                width: "42px",
                                height: "42px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: newMessage.trim() ? "pointer" : "default",
                                opacity: newMessage.trim() ? 1 : 0.5,
                                transition: "0.2s",
                            }}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                ) : (
                    <div
                        style={{
                            textAlign: "center",
                            color: "#aaa",
                            fontSize: "0.9rem",
                            padding: "10px 0",
                        }}
                    >
                        Please <span style={{ color: "#e74c3c", cursor: "pointer" }}>login</span> to chat.
                    </div>
                )}
            </div>
        </div>
    );
}
