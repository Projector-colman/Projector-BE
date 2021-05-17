-- Table: public.linked_issues

-- DROP TABLE public.linked_issues;

CREATE TABLE public.linked_issues
(
    blocker integer NOT NULL,
    blocked integer NOT NULL,
    "createdAt" date,
    "updatedAt" date,
    CONSTRAINT "linked_issues_pkey" PRIMARY KEY ("blocker", "blocked"),
    CONSTRAINT "blocked id" FOREIGN KEY (blocked)
        REFERENCES public.issues (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT "blocker id" FOREIGN KEY (blocker)
        REFERENCES public.issues (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.linked_issues
    OWNER to projector;