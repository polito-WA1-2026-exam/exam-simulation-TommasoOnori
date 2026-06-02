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

async function getStudyPlan() {
    const response = await fetch(`${serverURL}/api/studyplan`, {
        credentials: 'include'
    });

    if (response.ok) {
        const studyPlan = await response.json();
        return studyPlan;
    } else if (response.status == 404) {
        return [];
    } else {
        const errMessage = await response.text();
        throw new Error(errMessage);
    }
}

async function saveStudyPlan(courses, planType) {
    const response = await fetch(`${serverURL}/api/studyplan`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ courses: courses, planType: planType })
    });

    if (!response.ok) {
        const errMessage = await response.text();
        throw new Error(errMessage);
    }
    return true;
}

async function deleteStudyPlan() {
    const response = await fetch(`${serverURL}/api/studyplan`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!response.ok) {
        const errMessage = await response.text();
        throw new Error(errMessage);
    }
    return true;
}

const API = { getCourses, logIn, logOut, getStudyPlan, saveStudyPlan, deleteStudyPlan };
export default API;