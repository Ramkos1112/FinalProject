import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router';
import { UsersProvider } from './components/contexts/UserContext.tsx';
import { QuestionsProvider } from './components/contexts/QuestionContext.tsx';
import { AnswersProvider } from './components/contexts/RepliesContext.tsx';

createRoot(document.getElementById('root') as HTMLDivElement).render(
    <BrowserRouter>
        <UsersProvider>
            <QuestionsProvider>
                <AnswersProvider>
                    <App />
                </AnswersProvider>
            </QuestionsProvider>
        </UsersProvider>
    </BrowserRouter>
);
