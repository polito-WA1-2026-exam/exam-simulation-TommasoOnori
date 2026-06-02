import { useState, useEffect } from 'react';
import { Table, Container } from 'react-bootstrap';
import API from '../API';

function Home() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        API.getCourses().then((data) => {
            setCourses(data);
        }).catch((err) => {
            console.error("Course Retrivial Error.", err);
        });
    }, []);

    return (
        <Container>

            <h2 className="mb-4">All Courses</h2>

            <Table striped bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Credits</th>
                        <th>Max Students</th>
                        <th>Preparatory Course</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.CID}>
                            <td>{course.CID}</td>
                            <td>{course.Name}</td>
                            <td>{course.Credits}</td>
                            <td>{course.MaxStudents ? course.MaxStudents : "No Limit"}</td>
                            <td>{course.PreparatoryCourse ? course.PreparatoryCourse : "None"}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

        </Container>
    );
}

export default Home;