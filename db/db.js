import { Pool } from 'pg'
import dotenv from 'dotenv';
dotenv.config();
const db = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
});

export default db ; 


