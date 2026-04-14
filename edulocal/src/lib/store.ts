import { create } from 'zustand';
import { db, Lesson, TeacherHistory } from '../db';

interface LessonStore {
    lessons: Lesson[];
    history: TeacherHistory | null;
    loadLessons: () => Promise<void>;
    addLesson: (lesson: Omit<Lesson, 'id' | 'timestamp'>) => Promise<void>;
    loadHistory: () => Promise<void>;
    updateHistory: (updates: Partial<TeacherHistory>) => Promise<void>;
}

export const useLessonStore = create<LessonStore>((set) => ({
    lessons: [],
    history: null,

    loadLessons: async () => {
        const lessons = await db.lessons.orderBy('timestamp').reverse().toArray();
        set({ lessons });
    },

    addLesson: async (lessonData) => {
        const newLesson = {
            ...lessonData,
            timestamp: Date.now()
        };
        await db.lessons.add(newLesson);
        const lessons = await db.lessons.orderBy('timestamp').reverse().toArray();
        set({ lessons });
    },

    loadHistory: async () => {
        const history = await db.teacherHistory.get(1);
        if (history) {
            set({ history });
        } else {
            const defaultHistory: TeacherHistory = {
                id: 1,
                recentChapters: [],
                preferredLanguage: 'English',
                classLevel: '1-5'
            };
            await db.teacherHistory.add(defaultHistory);
            set({ history: defaultHistory });
        }
    },

    updateHistory: async (updates) => {
        await db.teacherHistory.update(1, updates);
        const history = await db.teacherHistory.get(1);
        if (history) {
            set({ history });
        }
    }
}));