# Exam #N: "Exam Title"
## Student: s354269 ONORI TOMMASO

## Database Tables

- Table `Student(SID, Name, Surname, Email, PlanType, HashedPassword, Salt)`
- Table `Courses(CID, Name, Credits, maxStudents,	PreparatoryCourse)`
- Table `StudyPlan(SID, CID)`
- Table `CourseIncompatibilities(CID, IncompatibleCourseID)`

## Data Models

Student: {
  SID: String,
  Name: String,
  Surname: String,
  Email: String,
  studyPlan: StudyPlan
}

Courses: {
  CID: String,
  Name: String,
  Credits: Number,
  maxStudents: Number,
  PreparatoryCourse: String,
  IncompatibleCourses: []
}

StudyPlan: {
  Credits: Number
  Courses: [],
  Type: Enum("Full-Time, "Part-Time")
}

## API Server

GET(api/session/current) -> retrieve current session
GET(api/courses) -> list of courses
GET(api/courses/:id) -> course element
GET(api/studyplan) -> student's study plan

POST(api/session) -> login
- req: { username: "student@polito.it", password: "password123" }
- res: { id: 1, username: "student@polito.it", name: "John", planType: "Full-Time" }

POST(api/studyplan) -> edit study plan
- req: { planType: "Full-Time", courses: ["02GOLOV", "01SQJOV", ...] }
- res: {200 OK}

DELETE(api/session/current) -> logout
DELETE(api/studyplan)

## React Client Application Routes

- Route `/`: List of Coureses. If logged-in the study plan
- Route `*`: Fallback page (home page)

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)

## Use of AI Tools
Briefly describe whether you used any AI tools (e.g., ChatGPT, GitHub Copilot, Claude) while working on this project, for which purposes (e.g., clarifying concepts, debugging, generating code), and how you verified or adapted their output.
If you did not use any AI tools, simply state so.
