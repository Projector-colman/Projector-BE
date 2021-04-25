-- Table: public.issues

CREATE SEQUENCE issues_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE;

CREATE TABLE public.issues
(
    id integer NOT NULL DEFAULT nextval('issues_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description character varying(255) COLLATE pg_catalog."default",
    epic integer NOT NULL,
    reporter integer NOT NULL,
    asignee integer,
    "storyPoints" integer,
    priority integer,
    sprint integer,
    status character varying COLLATE pg_catalog."default" NOT NULL,
    "createdAt" date,
    "updatedAt" date,
    CONSTRAINT issues_pkey PRIMARY KEY (id),
    CONSTRAINT "asignee id" FOREIGN KEY (asignee)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "epic id" FOREIGN KEY (epic)
        REFERENCES public.epics (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "reporter id" FOREIGN KEY (reporter)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.issues
    OWNER to projector;

COMMENT ON CONSTRAINT "asignee id" ON public.issues
    IS 'user assigned with this issue';
COMMENT ON CONSTRAINT "epic id" ON public.issues
    IS 'epic father of this issue';
COMMENT ON CONSTRAINT "reporter id" ON public.issues
    IS 'reporter of this issue';