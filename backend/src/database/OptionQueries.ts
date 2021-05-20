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

	public static async editOption(optionId: number, option: string): Promise<void> {

		await dbTransaction(
			'UPDATE options SET optionText=? WHERE id=?',
			[option, optionId]);
	}

	public static async deleteOption(optionId: number): Promise<void> {

		await dbTransaction(
			'DELETE FROM options WHERE id=?',
			[optionId]);
	}

	public static async findOptionById(optionId:number):Promise<Option|null> {

		const [question, _]: [Option[], FieldPacket[]] = await pool.query(
			'SELECT * FROM options WHERE id = ?',
			[optionId]);

		if (question.length > 0)
			return question[0];

		return null;
	}

	public static async listQuestionOptions(questionId:number):Promise<Option[]|null> {

		const [options, _]: [Option[], FieldPacket[]] = await pool.query(
			'SELECT * FROM options WHERE question_id = ?',
			[questionId]);

		if (options.length > 0)
			return options;

		return null;
	}
}
