CREATE DATABASE simple_db
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "firstName" character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    "lastName" character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    email character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    "passwordDigest" character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    created timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.records
(
    id integer NOT NULL DEFAULT nextval('records_id_seq'::regclass),
    "userId" integer NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    content text COLLATE pg_catalog."default" NOT NULL,
    created timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT records_pkey PRIMARY KEY (id),
    CONSTRAINT "records_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.records
    OWNER to postgres;
-- Index: records_userId_index

-- DROP INDEX IF EXISTS public."records_userId_index";

CREATE INDEX IF NOT EXISTS "records_userId_index"
    ON public.records USING btree
    ("userId" ASC NULLS LAST)
    TABLESPACE pg_default;