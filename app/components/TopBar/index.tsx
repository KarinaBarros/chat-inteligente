import styles from './TopBar.module.css';
import { useChat } from '@/app/context/ChatContext';

export default function TopBar() {
    const { prevStep } = useChat();

    return (
        <div className={styles.container}>
            <div className={styles.back} onClick={prevStep}>
                <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg" >

                    <path className={styles.iconStroke} d="M7.10513 1.18408L1.18408 6.73084L7.10513 12.6519" fill='none' stroke="currentColor" strokeWidth="2.36842" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <span>Health</span>
            <div className={styles.containerIcon}>
                <svg width="36" height="8" viewBox="0 0 36 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.6252 5.87516C18.7067 5.87516 19.5835 4.99839 19.5835 3.91683C19.5835 2.83527 18.7067 1.9585 17.6252 1.9585C16.5436 1.9585 15.6668 2.83527 15.6668 3.91683C15.6668 4.99839 16.5436 5.87516 17.6252 5.87516Z" stroke="#757474" strokeWidth="3.91667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M31.3335 5.87516C32.4151 5.87516 33.2918 4.99839 33.2918 3.91683C33.2918 2.83527 32.4151 1.9585 31.3335 1.9585C30.2519 1.9585 29.3752 2.83527 29.3752 3.91683C29.3752 4.99839 30.2519 5.87516 31.3335 5.87516Z" stroke="#757474" strokeWidth="3.91667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3.91683 5.87516C4.99839 5.87516 5.87516 4.99839 5.87516 3.91683C5.87516 2.83527 4.99839 1.9585 3.91683 1.9585C2.83527 1.9585 1.9585 2.83527 1.9585 3.91683C1.9585 4.99839 2.83527 5.87516 3.91683 5.87516Z" stroke="#757474" strokeWidth="3.91667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    )
}