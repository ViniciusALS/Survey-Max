import pool from './Connection';
import { OkPacket, FieldPacket } from 'mysql2';

export default class SurveyQueries {

	public static async createSurvey(userId: number, title: string): Promise<number> {

		const connection = await pool.getConnection();
		let newSurveyId:number;

		try {

			await connection.beginTransaction();

			const [userAccount, _]:[OkPacket, FieldPacket[]] = await connection.query(
				'INSERT INTO surveys SET users_id=?, title=?',
				[userId, title]);

			newSurveyId = userAccount.insertId;

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
}
