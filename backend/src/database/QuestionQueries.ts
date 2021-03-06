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

	public static async editQuestion(questionId: number, question: string): Promise<void> {

		await dbTransaction(
			'UPDATE questions SET question=? WHERE id=?',
			[question, questionId]);
	}

	public static async deleteQuestion(questionId: number): Promise<void> {

		await dbTransaction(
			'DELETE FROM questions WHERE id=?',
			[questionId]);
	}

	public static async findQuestionById(questionId:number):Promise<Question|null> {

		const [question, _]: [Question[], FieldPacket[]] = await pool.query(
			'SELECT * FROM questions WHERE id = ?',
			[questionId]);

		if (question.length > 0)
			return question[0];

		return null;
	}

	public static async listSurveyQuestions(surveyId:number):Promise<Question[]|null> {

		const [questions, _]: [Question[], FieldPacket[]] = await pool.query(
			'SELECT * FROM questions WHERE survey_id = ?',
			[surveyId]);

		if (questions.length > 0)
			return questions;

		return null;
	}
}
