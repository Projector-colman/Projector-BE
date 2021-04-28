-- Table: public.projects

CREATE SEQUENCE projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE;

CREATE TABLE public.projects
(
    id integer NOT NULL DEFAULT nextval('projects_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    owner integer NOT NULL,
    "createdAt" date,
    "updatedAt" date,
    CONSTRAINT projects_pkey PRIMARY KEY (id),
    CONSTRAINT name_uqky UNIQUE (name),
    CONSTRAINT owner_id FOREIGN KEY (owner)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.projects
    OWNER to projector;

COMMENT ON CONSTRAINT name_uqky ON public.projects
    IS 'project name shouldn''t be the same for two different projects';

COMMENT ON CONSTRAINT owner_id ON public.projects
    IS 'owner id references to the id of the user who owns the project.';