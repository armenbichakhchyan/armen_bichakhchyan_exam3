import mysql2 from 'mysql2/promise';

export const pool = mysql2.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,

    ssl: {
        rejectUnauthorized: false
    },

    connectionLimit: 10,
})

export async function connect() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ DB connected successfully!');
        connection.release();
    } catch (error) {
        console.error('❌ DB connection failed:', error.message);
        process.exit(1);
    }
}