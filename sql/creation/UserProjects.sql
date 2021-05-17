-- Table: public.UserProjects

-- DROP TABLE public."UserProjects";

CREATE TABLE public."UserProjects"
(
    "ProjectId" integer NOT NULL,
    "UserId" integer NOT NULL,
    "createdAt" date,
    "updatedAt" date,
    CONSTRAINT "UserProjects_pkey" PRIMARY KEY ("ProjectId", "UserId"),
    CONSTRAINT "project id" FOREIGN KEY ("ProjectId")
        REFERENCES public.projects (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "user id" FOREIGN KEY ("UserId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."UserProjects"
    OWNER to projector;