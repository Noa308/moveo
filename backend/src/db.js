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
