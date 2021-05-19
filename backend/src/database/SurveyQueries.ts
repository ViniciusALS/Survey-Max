import pool from './Connection';
import { OkPacket, FieldPacket, RowDataPacket } from 'mysql2';
import dbTransaction from './dbTransaction';

interface Survey extends RowDataPacket {
	id: number,
	// eslint-disable-next-line camelcase
	users_id: number,
	title: string,
	createdAt: string
}

export default class SurveyQueries {

	public static async createSurvey(userId: number, title: string): Promise<number> {

		const survey: OkPacket = await dbTransaction(
			'INSERT INTO surveys SET users_id=?, title=?',
			[userId, title]);

		return survey.insertId;
	}

	public static async editSurvey(userId: number, surveyId: number, title: string): Promise<void> {

		await dbTransaction(
			'UPDATE surveys SET title=? WHERE id=? AND users_id=?',
			[title, surveyId, userId]);
	}

	public static async findSurveyById(surveyId:number):Promise<Survey|null> {

		const [survey, _]: [Survey[], FieldPacket[]] = await pool.query(
			'SELECT * FROM surveys WHERE id = ?',
			[surveyId]);

		if (survey.length > 0)
			return survey[0];

		return null;
	}
}
