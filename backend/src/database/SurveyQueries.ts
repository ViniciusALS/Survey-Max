import pool from './Connection';
import { OkPacket, FieldPacket, RowDataPacket } from 'mysql2';

interface Survey extends RowDataPacket {
	id: number,
	// eslint-disable-next-line camelcase
	users_id: number,
	title: string,
	createdAt: string
}

export default class SurveyQueries {

	public static async createSurvey(userId: number, title: string): Promise<number> {

		const connection = await pool.getConnection();
		let newSurveyId:number;

		try {

			await connection.beginTransaction();

			const [survey, _]:[OkPacket, FieldPacket[]] = await connection.query(
				'INSERT INTO surveys SET users_id=?, title=?',
				[userId, title]);

			newSurveyId = survey.insertId;

			await connection.commit();
		}

		catch (error) {
			await connection.rollback();
			throw error;
		}

		finally {
			connection.release();
		}

		return newSurveyId;
	}

	public static async editSurvey(userId: number, surveyId: number, title: string): Promise<void> {

		const connection = await pool.getConnection();

		try {

			await connection.beginTransaction();

			const survey = await SurveyQueries.findSurveyById(surveyId);

			if (survey!.users_id !== userId)
				throw Error;

			await connection.query(
				'UPDATE surveys SET title=? WHERE id=? AND users_id=?',
				[title, surveyId, userId]);

			await connection.commit();
		}

		catch (error) {
			await connection.rollback();
			throw error;
		}

		finally {
			connection.release();
		}
	}

	private static async findSurveyById(id:number):Promise<Survey|null> {

		const [survey, _]: [Survey[], FieldPacket[]] = await pool.query(
			'SELECT * FROM surveys WHERE id = ?',
			[id]);

		if (survey.length > 0)
			return survey[0];

		return null;
	}
}
