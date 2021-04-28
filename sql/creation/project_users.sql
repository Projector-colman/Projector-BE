-- Table: public.project_users

-- DROP TABLE public.project_users;

CREATE TABLE public.project_users
(
    id integer NOT NULL,
    project integer NOT NULL,
    "user" integer NOT NULL,
    "createdAt" date,
    "updatedAt" date,
    CONSTRAINT project_users_pkey PRIMARY KEY (id),
    CONSTRAINT "project id" FOREIGN KEY (project)
        REFERENCES public.projects (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "user id" FOREIGN KEY ("user")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.project_users
    OWNER to projector;