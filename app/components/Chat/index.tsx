"use client";
import styles from "./Chat.module.css";
import Onboarding from "./Onboarding";
import Instructions from "./Instructions";
import ChatAi from "./ChatAi";
import { useChat } from "@/app/context/ChatContext";

export default function Chat() {
    const { step } = useChat();

    return (
        <div className={styles.full}>
            <div className={styles.container}>
                <div className={styles.slider} style={{ transform: `translateX(-${(step - 1) * 100}%)` }}>
                    <div className={styles.page}>
                        <Onboarding />
                    </div>

                    <div className={styles.page}>
                        <Instructions />
                    </div>

                    <div className={styles.page}>
                        <ChatAi />
                    </div>
                </div>
            </div>
        </div>
    );
}