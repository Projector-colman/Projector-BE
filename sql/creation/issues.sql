-- Table: public.issues

-- DROP TABLE public.issues;

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
    "createdAt" date,
    "updatedAt" date,
    CONSTRAINT issues_pkey PRIMARY KEY (id),
    CONSTRAINT "asignee id" FOREIGN KEY (id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "epic id" FOREIGN KEY (id)
        REFERENCES public.epics (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "reporter id" FOREIGN KEY (id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "sprint id" FOREIGN KEY (id)
        REFERENCES public.sprints (id) MATCH SIMPLE
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
    IS 'the ID of the user who is doing this issue';
COMMENT ON CONSTRAINT "epic id" ON public.issues
    IS 'the epic holding this issue';
COMMENT ON CONSTRAINT "reporter id" ON public.issues
    IS 'the ID of the user who opened (or resplnsible on) this issue';
COMMENT ON CONSTRAINT "sprint id" ON public.issues
    IS 'the id of the sprint this issue belongs to at the moment';