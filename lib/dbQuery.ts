import pool from "@/lib/dbClient";

export default async function dbQuery(query: string){//: Promise<{ mensaje: string; } | { rows: any[] }> {
  const client = await pool.connect();
  const result = await client.query(query);
  
  //const total = result.rowCount || 0;
  client.release();

  //if (total === 0)
   // return { rows: 'No se encontraron datos..' };
  // else 
  return { rows: result.rows, rowCount: result.rowCount };
}