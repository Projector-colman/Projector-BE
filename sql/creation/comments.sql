-- Table: public.comments

-- DROP TABLE public.comments;

CREATE TABLE public.comments
(
    id integer NOT NULL,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    issue integer NOT NULL,
    "createdAt" date,
    "updatedAt" date,
    writer integer NOT NULL,
    CONSTRAINT issue_comments_pkey PRIMARY KEY (id),
    CONSTRAINT "issue id" FOREIGN KEY (issue)
        REFERENCES public.issues (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "writer id" FOREIGN KEY (writer)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.comments
    OWNER to projector;