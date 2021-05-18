import pool from './Connection';


export default class TokensQueries {

	public static async addRefreshToken(usersId:number, refreshToken:string):Promise<void> {

		await pool.query(
			'INSERT INTO refreshTokens SET users_id=?, refreshToken=?',
			[usersId, refreshToken]);
	}


	public static async removeRefreshToken(usersId:number, refreshToken:string):Promise<void> {

		await pool.query(
			'DELETE FROM refreshTokens WHERE users_id=? AND refreshToken=?',
			[usersId, refreshToken]);
	}
}
