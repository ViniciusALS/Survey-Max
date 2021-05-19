import pool from './Connection';
import { RowDataPacket, OkPacket, FieldPacket, ResultSetHeader } from 'mysql2';

export default async function dbTransaction
	<T extends RowDataPacket[][] |
		RowDataPacket[] |
		OkPacket |
		OkPacket[] |
		ResultSetHeader>(sql: string, value: unknown[]): Promise<T> {

	const connection = await pool.getConnection();
	let result: T;

	try {

		await connection.beginTransaction();

		const [query, _]:[T, FieldPacket[]] = await connection.query(sql, value);
		result = query;

		await connection.commit();
	}

	catch (error) {
		await connection.rollback();
		throw error;
	}

	finally {
		connection.release();
	}

	return result;
}
