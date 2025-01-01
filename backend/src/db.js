import pg from "pg";

const { Client } = pg;
const PG_USER = process.env.POSTGRES_USER || "postgres";
const PG_PASSWORD = process.env.POSTGRES_PASSWORD || "postgres";
const PG_PORT = process.env.PGPORT || 5432;
const PG_DB = process.env.POSTGRES_DB || "Moveo";
const PG_HOST = process.env.DATABASE_URL || "localhost";

export const client = new Client({
  user: PG_USER,
  password: PG_PASSWORD,
  port: PG_PORT,
  database: PG_DB,
  host: PG_HOST,
});

export const connect = async () => {
  await client.connect();
  await client.query(`
CREATE TABLE IF NOT EXISTS public.code_blocks
(
    id integer NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    template character varying COLLATE pg_catalog."default" NOT NULL,
    solution character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT code_blocks_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.code_blocks
    OWNER to postgres;`);
  await client.query(`INSERT INTO public.code_blocks(
	 id, name, template, solution)
	VALUES (1, 'Hello World','How do you write Hello World in an alert box?','alert("Hello World")') ON CONFLICT (id) DO NOTHING`);

  await client.query(`INSERT INTO public.code_blocks(
	 id, name, template, solution)
	VALUES (2, 'functions','How do you create a function in JavaScript?','function myFunction(p1, p2){}') ON CONFLICT (id) DO NOTHING`);

  await client.query(`INSERT INTO public.code_blocks(
	 id, name, template, solution)
	VALUES (3, 'IF statement','How to write an IF statement in JavaScript?','if(x==y)') ON CONFLICT (id) DO NOTHING`);

  await client.query(`INSERT INTO public.code_blocks(
	 id, name, template, solution)
	VALUES (4,'comments','How can you add a comment in a JavaScript?','//') ON CONFLICT (id) DO NOTHING`);
};
