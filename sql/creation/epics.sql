-- Table: public.epics

CREATE SEQUENCE epics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE;

CREATE TABLE public.epics
(
    id integer NOT NULL DEFAULT nextval('epics_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description character varying(255) COLLATE pg_catalog."default",
    project integer NOT NULL,
    reporter integer NOT NULL,
    asignee integer,
    "createdAt" date,
    "updatedAt" date,
    CONSTRAINT epics_pkey PRIMARY KEY (id),
    CONSTRAINT "asignee id" FOREIGN KEY (asignee)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "project id" FOREIGN KEY (project)
        REFERENCES public.projects (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "reporter id" FOREIGN KEY (reporter)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.epics
    OWNER to projector;

COMMENT ON CONSTRAINT "asignee id" ON public.epics
    IS 'the ID of the user asigned to this epic';
COMMENT ON CONSTRAINT "project id" ON public.epics
    IS 'the ID of the project related to this epic';
COMMENT ON CONSTRAINT "reporter id" ON public.epics
    IS 'the ID of the user created this epic';