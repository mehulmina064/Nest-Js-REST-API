import { ObjectID } from 'typeorm';
export declare class Faq {
    id: ObjectID;
    type: string;
    question: string;
    answer: string;
}
