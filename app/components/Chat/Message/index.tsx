"use client";
import styles from "./Message.module.css";
import { useChat } from "@/app/context/ChatContext";
import { useEffect, useState } from "react";

export default function Message() {
    const { step, nextStep, setMessage, message } = useChat();
    const [messageState, setMessageState] = useState("");

    function SetMessage() {
        setMessage(messageState)
        if (messageState.trim() === "") return;
        if (step === 3) return;
        nextStep();
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    useEffect(() => {
        setMessageState(message);
    }, [message]);

    return (
        <div className={styles.container}>
            <input
                type="text"
                placeholder="Send a message"
                value={messageState}
                onChange={(e) => setMessageState(e.target.value)}
            />
            <svg onClick={() => SetMessage()} xmlns="http://www.w3.org/2000/svg" width="33" height="34" viewBox="0 0 33 34" fill="none">
                <path className={styles.fill} fillRule="evenodd" clipRule="evenodd" d="M29.3485 17.1303C29.3799 17.0382 29.384 16.9397 29.359 16.8457C28.7652 14.6201 17.7408 8.29342 14.2766 7.22972C13.3741 6.95252 12.7202 7.06414 12.3363 7.56051C11.2235 8.99719 13.5216 13.4646 14.8627 15.8006L21.8107 16.0446C22.2133 16.0587 22.5283 16.3974 22.5142 16.8012C22.5001 17.205 22.1624 17.5209 21.7598 17.5068L14.7452 17.2597C13.2355 19.5262 10.7276 23.7129 11.7221 25.1999C11.7593 25.2557 11.8002 25.3082 11.8446 25.356C12.2119 25.751 12.8136 25.8549 13.634 25.6649C17.1616 24.8482 28.5998 19.3117 29.3485 17.1303Z" fill="currentColor" />
            </svg>
        </div>
    )
}