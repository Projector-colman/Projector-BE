const axios = require('axios');

let headers = { headers: { 
    'x-auth-token': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNjIwNTU5MDY0fQ.cJyxz_29kw7hh_8mnKWLqkGTfVFnGDHs1dsxW4rUvJY` 
    }
}

const addToDB = async (url, data) => {
    data.forEach(item => {
        axios.post(url, item , headers).then(res => {
            console.log('added')
        }).catch(err => {
            console.log(err)
        });
    })
}

let projects = [{ name : 'Chat App', key: 'PRJ' },
                { name : 'Android Application', key: 'PRJ' },
                { name : 'Open cafe', key: 'PRJ' },
                { name : 'Home renovation', key: 'PRJ' },
                { name : 'Write a Novel', key: 'PRJ' }];

let users = [{name: 'or', email: 'or123@gmail.com', password: 'or123123'},
             {name: 'yotam', email: 'yotam@gmail.com', password: 'yotam123123'},
             {name: 'shahar', email: 'shahar@gmail.com', password: 'shahar123123'},
             {name: 'shiraz', email: 'shiraz@gmail.com', password: 'shiraz123123'},
             {name: 'itamar', email: 'itamar@gmail.com', password: 'itamar123123'},
             {name: 'user', email: 'user@gmail.com', password: 'user123123'}];

let epics = [{name : 'android studio', description : 'everything android studio', project : 5, asignee : 1},
             {name : 'best epic', description : 'epic epic best epic', project : 5, asignee : 2},
             {name : 'we are epic', description : 'we are epic', project : 6, asignee : 2},
             {name : 'write chapter 1', description : 'best novel', project : 9, asignee : 1},
             {name : 'paint walls', description : 'everything paint related', project : 8, asignee : 2},
             {name : 'chairs', description : 'select chairs', project : 7, asignee : 2},
];
let issues = [	{name : 'create characters', description : 'call one of them Bobby', epic : 1, asignee : 1, storyPoints : 4, priority: 1, sprint: undefined, status: 'to-do', blockerId: undefined},
				{name : 'paint a wall', description : 'west wall facing the window', epic : 1, asignee : 1, storyPoints : 1, priority: 5, sprint: undefined, status: 'to-do', blockerId: undefined},
				{name : 'buy paint', description : 'pink paint from tambur', epic : 3, asignee : 2, storyPoints : 4, priority: 2, sprint: undefined, status: 'to-do', blockerId: undefined},
				{name : 'create merge request', description : 'in projector git', epic : 3, asignee : 2, storyPoints : 23, priority: 3, sprint: undefined, status: 'in-progress', blockerId: undefined},
				{name : 'buy computing equipment', description : 'rtx3080', epic : 4, asignee : 1, storyPoints : 44, priority: 1, sprint: undefined, status: 'in-progress', blockerId: undefined},
				{name : 'big issue', description : 'the biggest issue', epic : 4, asignee : 2, storyPoints : 22, priority: 4, sprint: undefined, status: 'verify', blockerId: undefined},
				{name : 'make coffee', description : 'for every employee', epic : 5, asignee : 1, storyPoints : 69, priority: 2, sprint: undefined, status: 'verify', blockerId: undefined},
				{name : 'hire workers', description : '2 workers for hr dpt', epic : 2, asignee : 1, storyPoints : 10, priority: 2, sprint: undefined, status: 'done', blockerId: undefined},
				{name : 'get certified', description : 'aws certification', epic : 2, asignee : 2, storyPoints : 100, priority: 1, sprint: undefined, status: 'done', blockerId: undefined},
				{name : 'create kanban', description : 'for projector project in projector project', epic : 1, asignee : 1, storyPoints : 1, priority: 5, sprint: undefined, status: 'to-do', blockerId: undefined},
				{name : 'buy gcp subscription', description : '5$ a month without using spotinst', epic : 3, asignee : 2, storyPoints : 4, priority: 2, sprint: undefined, status: 'to-do', blockerId: undefined},
				{name : 'activate pgadmin', description : 'port 5432', epic : 3, asignee : 2, storyPoints : 23, priority: 3, sprint: undefined, status: 'in-progress', blockerId: undefined},
				{name : 'fill db with stub data', description : 'yotam has the best stub data in the entire west', epic : 4, asignee : 1, storyPoints : 44, priority: 1, sprint: undefined, status: 'in-progress', blockerId: undefined},
				{name : 'love docker', description : 'we actually use podman', epic : 4, asignee : 2, storyPoints : 22, priority: 4, sprint: undefined, status: 'verify', blockerId: undefined},
				{name : 'create openshift cluster', description : 'first we need kubernetes crds', epic : 5, asignee : 1, storyPoints : 69, priority: 2, sprint: undefined, status: 'verify', blockerId: undefined},
				{name : 'user aks for runnin front end', description : 'redundancy of two datacenters', epic : 2, asignee : 1, storyPoints : 10, priority: 2, sprint: undefined, status: 'done', blockerId: undefined},
				{name : 'smallest issue', description : 'very tiny', epic : 2, asignee : 2, storyPoints : 100, priority: 1, sprint: undefined, status: 'done', blockerId: undefined},
];

//addToDB('http://localhost:3000/api/projects', projects);
//addToDB('http://localhost:3000/api/users', users);
//addToDB('http://localhost:3000/api/epics', epics);
//addToDB('http://localhost:3000/api/issues', issues);
//addToDB('http://localhost:3000/api/projects/1/users', [{userId : 1}])
//addToDB('http://localhost:3000/api/projects/2/users', [{userId : 1}])
//addToDB('http://localhost:3000/api/projects/3/users', [{userId : 1}])
//addToDB('http://localhost:3000/api/projects/2/users', [{userId : 2}])
//addToDB('http://localhost:3000/api/projects/3/users', [{userId : 2}])
addToDB('http://localhost:3000/api/projects/4/users', [{userId : 2}])
/*addToDB('http://localhost:3000/api/projects/5/users', [{userId : 3}])
addToDB('http://localhost:3000/api/projects/4/users', [{userId : 3}])
addToDB('http://localhost:3000/api/projects/3/users', [{userId : 3}])
addToDB('http://localhost:3000/api/projects/4/users', [{userId : 4}])
addToDB('http://localhost:3000/api/projects/3/users', [{userId : 4}])
addToDB('http://localhost:3000/api/projects/2/users', [{userId : 4}])
addToDB('http://localhost:3000/api/projects/1/users', [{userId : 5}])
addToDB('http://localhost:3000/api/projects/2/users', [{userId : 5}])
addToDB('http://localhost:3000/api/projects/3/users', [{userId : 5}])
addToDB('http://localhost:3000/api/projects/4/users', [{userId : 5}])*/