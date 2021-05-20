import pool from './Connection';
import { OkPacket, FieldPacket, RowDataPacket } from 'mysql2';
import dbTransaction from './dbTransaction';


interface Option extends RowDataPacket {
	id: number,
	// eslint-disable-next-line camelcase
	question_id: number,
	optionText: string
}


export default class OptionQueries {

	public static async createOption(questionId: number, optionText: string):Promise<number> {
		const result: OkPacket = await dbTransaction(
			'INSERT INTO options SET question_id=?, optionText=?',
			[questionId, optionText]);

		return result.insertId;
	}

	public static async editOption(questionId: number, question: string): Promise<void> {

		await dbTransaction(
			'UPDATE questions SET question=? WHERE id=?',
			[question, questionId]);
	}

	public static async findOptionById(questionId:number):Promise<Option|null> {

		const [question, _]: [Option[], FieldPacket[]] = await pool.query(
			'SELECT * FROM questions WHERE id = ?',
			[questionId]);

		if (question.length > 0)
			return question[0];

		return null;
	}
}
