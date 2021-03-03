# Projector-BE
----
User:
    id      [PK]
    name
    email   [UK]
    password
    isAdmin
Project:
    id                  [PK]
    name                [UK]
    owner (User.id)     [FK]
Epic:
    id                      [PK]
    name
    project (Project.id)    [FK]
    reporter (User.id)      [FK]
    asignee (User.id)       [FK]
    description
Issue:
    id                      [PK]
    name
    epic (Project.id)       [FK]
    reporter (User.id)      [FK]
    asignee (User.id)       [FK]
    description
    Priority    (Enum ?)
    storyPoints
    sprint (Sprint.id)      [FK]
Sprint:
    id                      [PK]
    startTime
    project (Project.id)    [FK]
Linked Issues:
    blocker_issue (Issue.id)
    blocked_issue (Issue.id)