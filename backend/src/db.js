import pg from "pg";

const { Client } = pg;

export const client = new Client({
  user: "postgres",
  password: "postgres",
  port: 5432,
  database: "Moveo",
  host: "localhost",
});

export const connect = async () => {
  await client.connect();
};
