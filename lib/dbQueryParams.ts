import pool from "@/lib/dbClient";

export default async function dbQueryParams(query: string, values: any[]){//: Promise<{ mensaje: string; } | { rows: any[] }> {
  const client = await pool.connect();
  const result = await client.query(query, values);
  //const total = result.rowCount || 0;
  client.release();

  //if (total === 0)
   // return { rows: 'No se encontraron datos..' };
  // else 
  return { rows: result.rows };
}