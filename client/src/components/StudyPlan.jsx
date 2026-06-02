import { useState, useEffect } from 'react';
import { Table, Row, Col, Button, Container } from 'react-bootstrap';
import API from '../API.js';

function StudyPlan({ user }) {
    const [myCourses, setMyCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([API.getStudyPlan(), API.getCourses()]).then(([studyPlan, courses]) => {
            setMyCourses(studyPlan);
            setAllCourses(courses);
            setLoading(false);
        }).catch((err) => {
            console.error("Error:", err);
            setLoading(true);
        })
    }, []);

    const addCourse = (courseToAdd) => {
        // --- Preparatory Check ---
        if (courseToAdd.PreparatoryCourse) {
            const hasPrepCourse = myCourses.some((c) => c.CID === courseToAdd.PreparatoryCourse);

            if (!hasPrepCourse) {
                alert(`You have to insert its preparatory course ${courseToAdd.PreparatoryCourse} first`);
                return;
            }
        }

        // --- Incompatibilities Check ---
        const hasIncompatible = myCourses.some((c) => courseToAdd.incompatibilities.includes(c.CID));

        if (hasIncompatible) {
            alert(`Cannot add ${courseToAdd.Name}: it is incompatible with a course already in your plan!`);
            return;
        }

        // --- Enrolled Students Check ---
        if (courseToAdd.MaxStudents && (courseToAdd.EnrolledStudents >= courseToAdd.MaxStudents)) {
            alert(`This course is full! (${courseToAdd.EnrolledStudents}/${courseToAdd.MaxStudents} students)`);
            return;
        }

        // --- Total Credits Check ---
        const currentCredits = myCourses.reduce((sum, course) => sum + Number(course.Credits), 0);

        const maxCredits = user.planType === "Full-Time" ? 80 : 40;

        if ((currentCredits + Number(courseToAdd.Credits)) > maxCredits) {
            alert("Too many credits for your plan type!");
            return;
        }

        setMyCourses((oldPlan) => [...oldPlan, courseToAdd]);

        setAllCourses((oldAllCourses) =>
            oldAllCourses.map((c) => c.CID === courseToAdd.CID ? { ...c, EnrolledStudents: c.EnrolledStudents + 1 } : c)
        );
    };

    const removeCourse = (courseToRemove) => {
        const isPrepForAnother = myCourses.some((c) => c.PreparatoryCourse === courseToRemove.CID);

        if (isPrepForAnother) {
            alert("You cannot remove this course since it is preparatory for another course in your plan.")
            return;
        }

        setMyCourses((oldPlan) => oldPlan.filter((c) => c.CID !== courseToRemove.CID));

        setAllCourses((oldAllCourses) =>
            oldAllCourses.map((c) => c.CID === courseToRemove.CID ? { ...c, EnrolledStudents: c.EnrolledStudents - 1 } : c)
        );
    };

    const handleSave = () => {
        const totalCredits = myCourses.reduce((sum, course) => sum + Number(course.Credits), 0);
        const minC = user.planType === 'Full-Time' ? 60 : 20;
        const maxC = user.planType === 'Full-Time' ? 80 : 40;

        if (totalCredits < minC || totalCredits > maxC) {
            alert(`Your plan credits must range in [${minC}, ${maxC}] to be saved.`);
            return;
        }

        API.saveStudyPlan(myCourses, user.planType).then(() => {
            alert("Study plan saved successfully!");
        }).catch((err) => alert("Error: " + err));
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure to delete your study plan? This is an irreversible action.")) {
            API.deleteStudyPlan().then(() => {
                alert("Study plan successfully eliminated!");
                window.location.reload();
            }).catch((err) => alert("Error: " + err));
        }
    };

    if (!user) {
        return <Container className="mt-4"><p>Please log in to view your study plan.</p></Container>;
    }

    if (loading) {
        return <Container className="mt-4"><p>Study plan loading...</p></Container>
    }

    if (!user.planType) {
        return (
            <Container className="mt-4 text-center">
                <p className="mb-4">You don't have a plan type!</p>
                <Row className="justify-content-ceter">
                    <Col md={4}>
                        <Button variant="success" size="lg" className="w-100 mb-3">Create Full-Time Plan</Button>
                        <p className="text-muted">From 60 to 80 credits.</p>
                    </Col>
                    <Col md={4}>
                        <Button variant="warning" size="lg" className="w-100 mb-3">Create Part-Time Plan</Button>
                        <p className="text-muted">From 20 to 40 credits.</p>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Row className="justify-content-ceter">
                <Col>
                    <h2>My Study Plan ({user?.planType})</h2>
                </Col>
                <Col xs="auto">
                    <h4>Total Credits: {myCourses.reduce((sum, course) => sum + course.Credits, 0)}</h4>
                </Col>
                <div className="d-flex gap-3 mb-4 mt-3">
                    <Button variant="success" onClick={handleSave}>
                        <i className="bi bi-save me-2"></i> Save Plan
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        <i className="bi bi-trash me-2"></i> Delete Plan
                    </Button>
                </div>
            </Row>

            {myCourses.length === 0 ? (
                <p>Your study plan in empty. Add some courses!</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Credits</th>
                            <th>Preparatory</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myCourses.map((course) => {
                            return (
                                <tr key={course.CID}>
                                    <td>{course.CID}</td>
                                    <td>{course.Name}</td>
                                    <td>{course.Credits}</td>
                                    <td>{course.PreparatoryCourse}</td>
                                    <td>
                                        <Button variant="danger" size="sm" onClick={() => removeCourse(course)}>
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}

            <hr className="my-5" />

            <h3 className="mb-3">Course Catalog</h3>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Credits</th>
                        <th>Preparatory</th>
                        <th>Enrolled Students</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {allCourses.map((course) => {
                        const isAlreadyInPlan = myCourses.some(c => c.CID === course.CID);

                        return (
                            <tr key={course.CID}>
                                <td>{course.CID}</td>
                                <td>{course.Name}</td>
                                <td>{course.Credits}</td>
                                <td>{course.PreparatoryCourse}</td>
                                <td>{course.EnrolledStudents} {course.MaxStudents ? `/ ${course.MaxStudents}` : ''}</td>
                                <td>
                                    <Button variant="danger" size="sm" onClick={() => addCourse(course)} disabled={isAlreadyInPlan}>
                                        <i className="bi bi-plus-lg"></i>
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </Container>
    );
}

export default StudyPlan