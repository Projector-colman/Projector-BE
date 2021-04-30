CREATE TABLE public.issue_comments
(
    id integer NOT NULL,
    description character varying(255) NOT NULL,
    issue integer NOT NULL,
    "createdAt" date,
    "updatedAt" date,
    PRIMARY KEY (id),
    CONSTRAINT "issue id" FOREIGN KEY (issue)
        REFERENCES public.issues (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public.issue_comments
    OWNER to projector;