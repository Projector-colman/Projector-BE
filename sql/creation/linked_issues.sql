-- Table: public.linked_issues

-- DROP TABLE public.linked_issues;

CREATE TABLE public.linked_issues
(
    id integer NOT NULL,
    blocker integer NOT NULL,
    blocked integer NOT NULL,
    CONSTRAINT linked_issues_pkey PRIMARY KEY (id),
    CONSTRAINT "blocked id" FOREIGN KEY (id)
        REFERENCES public.issues (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "blocker id" FOREIGN KEY (id)
        REFERENCES public.issues (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.linked_issues
    OWNER to projector;

COMMENT ON CONSTRAINT "blocked id" ON public.linked_issues
    IS 'The ID of the issue that is blocked';
COMMENT ON CONSTRAINT "blocker id" ON public.linked_issues
    IS 'The ID of the blocking issue';