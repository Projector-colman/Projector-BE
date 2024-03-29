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
    project integer,
    "startTime" date,
    "createdAt" date,
    "updatedAt" date,
    status character varying COLLATE pg_catalog."default",
    "endTime" date,
    "storyPoints" integer,
    CONSTRAINT sprints_pkey PRIMARY KEY (id),
    CONSTRAINT "project id" FOREIGN KEY (project)
        REFERENCES public.projects (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.sprints
    OWNER to projector;

COMMENT ON CONSTRAINT "project id" ON public.sprints
    IS 'the ID of the project associated with this sprint';