import pool from './Connection';
import { OkPacket, FieldPacket, RowDataPacket } from 'mysql2';


interface User extends RowDataPacket {
	id: number,
  fistName: string,
  lastName: string,
	userName: string,
  email: string
  hashPassword: string
}

export default class UserQueries {

	public static async createUser(firstName:string, lastName:string, userName: string, email:string, hashPassword: string):Promise<number> {

		const connection = await pool.getConnection();
		let newUserId:number;

		try {

			await connection.beginTransaction();

			const [userAccount, _]:[OkPacket, FieldPacket[]] = await connection.query(
				'INSERT INTO users SET firstName=?, lastName=?, userName=?, email=?, hashPassword=?',
				[firstName, lastName, userName, email, hashPassword]);

			newUserId = userAccount.insertId;

			await connection.commit();
		}

		catch (error) {
			await connection.rollback();
			throw error;
		}

		finally {
			connection.release();
		}

		return newUserId;
	}

	public static async findAccountByUsername(username:string):Promise<User|null> {

		const [account, _]:[User[], FieldPacket[]] = await pool.query(
			'SELECT * FROM users WHERE userName = ?',
			[username]);

		if (account.length > 0)
			return account[0];

		return null;
	}

	public static async findAccountById(accountId:number):Promise<User|null> {

		const [account, _]:[User[], FieldPacket[]] = await pool.query(
			'SELECT id FROM users WHERE id = ?', accountId);

		if (account.length > 0)
			return account[0];

		return null;
	}
}
