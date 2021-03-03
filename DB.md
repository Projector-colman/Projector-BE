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
    description  
    epic (Project.id)       [FK]  
    reporter (User.id)      [FK]  
    asignee (User.id)       [FK]  
    storyPoints  
    Priority    (Enum ?)  
    sprint (Sprint.id)      [FK]  
Sprint:  
    id                      [PK]  
    startTime  
    project (Project.id)    [FK]  
Linked Issues:  
    id                          [PK]
    blocker_issue (Issue.id)    [FK]
    blocked_issue (Issue.id)    [FK]