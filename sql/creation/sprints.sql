CREATE SEQUENCE sprints_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE;

-- Table: public.sprints

-- DROP TABLE public.sprints;

CREATE TABLE public.sprints
(
    id integer NOT NULL DEFAULT nextval('sprints_id_seq'::regclass),
    project integer NOT NULL,
    "startTime" date NOT NULL,
    "createdAt" date,
    "updatedAt" date,
    status character varying COLLATE pg_catalog."default",
    CONSTRAINT sprints_pkey PRIMARY KEY (id),
    CONSTRAINT "project id" FOREIGN KEY (id)
        REFERENCES public.projects (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.sprints
    OWNER to projector;

COMMENT ON CONSTRAINT "project id" ON public.sprints
    IS 'the ID of the project associated with this sprint';