import Dexie, { Table } from 'dexie';

export interface Lesson {
    id?: number;
    subject: string;
    gradeRange: string;
    language: string;
    sourceText: string;
    adaptedContent: any;
    timestamp: number;
}

export interface TeacherHistory {
    id?: number;
    recentChapters: string[];
    preferredLanguage: string;
    classLevel: string;
}

export class EduLocalDB extends Dexie {
    lessons!: Table<Lesson>;
    teacherHistory!: Table<TeacherHistory>;

    constructor() {
        super('EduLocalDB');
        this.version(1).stores({
            lessons: '++id, subject, gradeRange, language, timestamp',
            teacherHistory: '++id, preferredLanguage'
        });
    }
}

export const db = new EduLocalDB();