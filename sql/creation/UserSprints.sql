-- Table: public.UserSprints

-- DROP TABLE public."UserSprints";

CREATE TABLE public."UserSprints"
(
    "SprintId" integer NOT NULL,
    "UserId" integer NOT NULL,
    "story_points" integer NOT NULL,
    "createdAt" date,
    "updatedAt" date,
    CONSTRAINT "UserSprints_pkey" PRIMARY KEY ("SprintId", "UserId"),
    CONSTRAINT "sprint id" FOREIGN KEY ("SprintId")
        REFERENCES public.sprints (id) MATCH SIMPLE
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

ALTER TABLE public."UserSprints"
    OWNER to projector;