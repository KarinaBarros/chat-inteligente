import styles from './Instructions.module.css';
import TopBar from '../../TopBar';
import Message from '../Message';
import { useChat } from '@/app/context/ChatContext';

export default function Instructions() {
    const { setMessage, nextStep } = useChat();
    const question = [
        'Quais são os horários de atendimento da FinTechX?',
        'Onde estão localizados os escritórios da FinTechX?',
        'Quem fundou a FinTechX e quando?',
        'Como a FinTechX protege as minhas informações pessoais?',
        'Recebi um e-mail suspeito da FinTechX, o que devo fazer?',
        'Como posso aprender mais sobre investimentos e poupança?',
        'Como posso me inscrever para receber promoções e descontos?'
    ]

    return (
        <div className={styles.container}>
            <div className={styles.containerTopbar}>
                <TopBar />
                <div className={styles.brain}>
                    BrainBox
                </div>
            </div>
            <div className={styles.instructions}>
                {question.map((q, index) => (
                    <div key={index} className={styles.question} onClick={() => {setMessage(q); nextStep(); window.scrollTo({top: 0, behavior: "smooth",});}}>
                        <p>{q}</p>
                    </div>
                ))}
            </div>
            <div className={styles.containerMessage}>
                <Message />
            </div>
        </div>

    )
}