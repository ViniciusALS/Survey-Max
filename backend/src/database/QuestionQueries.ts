import pool from './Connection';
import { OkPacket, FieldPacket, RowDataPacket } from 'mysql2';
import dbTransaction from './dbTransaction';


interface Question extends RowDataPacket {
	id: number,
	// eslint-disable-next-line camelcase
	survey_id: number,
	question: string
}


export default class QuestionQueries {

	public static async createQuestion(surveyId: number, question: string):Promise<number> {
		const result: OkPacket = await dbTransaction(
			'INSERT INTO questions SET survey_id=?, question=?',
			[surveyId, question]);

		return result.insertId;
	}

	public static async editQuestion(questionId: number, surveyId: number, question: string): Promise<void> {

		await dbTransaction(
			'UPDATE questions SET question=? WHERE id=? AND survey_id=?',
			[question, questionId, surveyId]);
	}

	public static async findQuestionById(questionId:number):Promise<Question|null> {

		const [question, _]: [Question[], FieldPacket[]] = await pool.query(
			'SELECT * FROM questions WHERE id = ?',
			[questionId]);

		if (question.length > 0)
			return question[0];

		return null;
	}
}
