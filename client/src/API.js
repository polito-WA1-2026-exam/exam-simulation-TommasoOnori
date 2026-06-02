const serverURL = 'http://localhost:3001';

async function getCourses() {
    const response = await fetch(`${serverURL}/api/courses`);

    if (response.ok) {
        const courses = await response.json();
        return courses;
    } else {
        const errMessage = await response.text();
        throw new Error(errMessage);
    }
}

async function logIn(credentials) {
    const response = await fetch(`${serverURL}/api/sessions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
    });

    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const errMessage = await response.text();
        throw new Error(errMessage);
    }
}

async function logOut() {
    await fetch(`${serverURL}/api/sessions/current`, {
        method: 'DELETE',
        credentials: 'include'
    });
}

const API = { getCourses, logIn, logOut };
export default API;