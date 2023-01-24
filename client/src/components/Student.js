import { arrayUnion, getDocs,addDoc, updateDoc, collection, doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { Table, Button, Container, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

export default function Student() {
  const email = useParams()
  const[courseData, setCourseData] = useState()
  const[coursesApproved, setCoursesApproved] = useState()
  const getCourse = async() =>{
    const courseRef = collection(db,'courses')
    const data = await getDocs(courseRef)
    setCourseData(data.docs.map((doc)=>({...doc.data(),id: doc.id})));
}

const enrollCourse = async(course) =>{
    const userRef = doc(db,'authenicatedUsers',email.email)
    const requestRef = collection(db,'requests')
    const result = await addDoc(requestRef,{
        courseName: course.courseName,
        courseCode: course.courseCode,
        courseDescription: course.courseDescription,
        instructorEmail: course.instructorEmail,
        email: email.email,
    })
    await updateDoc(userRef,{
        coursesApproval: arrayUnion(course)
    })
    console.log("Enrolled")
}    

  useEffect(() => {
    const approvedCourses = async() =>{
        const userRef = doc(db,'authenicatedUsers',email.email)
        const data = await getDoc(userRef)
        console.log(data.data().courses)
        setCoursesApproved(data.data().courses)
    }
    getCourse()
    approvedCourses()
    }, [])

    

  return (
    <>
    <h5 className="display-5" align='center'> Student </h5>
    <Container className='justify-content-md-center align-items-center text-center'>
            <Row>
                <h5 className="card-title">Courses</h5>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th scope='col'>Serial</th>
                            <th scope='col'>Course Name</th>
                            <th scope='col'>Course Code</th>
                            <th scope='col'>Course Description</th>
                            <th scope='col'>Instructor Email</th>
                            <th scope='col'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {courseData && courseData.map((course, index) => (
                        <tr>
                            <td scope='row'>{index+1}</td>
                            <td>{course && course.courseName}</td>
                            <td>{course && course.courseCode}</td>
                            <td>{course && course.courseDescription}</td>
                            <td>{course && course.instructorEmail}</td>
                            <td><Button variant="success" onClick={()=>enrollCourse(course)}>Enroll</Button></td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <h5 className="card-title m-2"> Enrolled Courses</h5>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th scope='col'>Serial</th>
                        <th scope='col'>Course Name</th>
                        <th scope='col'>Course Code</th>
                        <th scope='col'>Course Description</th>
                        <th scope='col'>Instructor Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {coursesApproved && coursesApproved.map((course, index) => (
                        <tr>
                            <td scope='row'>{index+1}</td>
                            <td>{course && course.courseName}</td>
                            <td>{course && course.courseCode}</td>
                            <td>{course && course.courseDescription}</td>
                            <td>{course && course.instructorEmail}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Row>
        </Container>
    </>
    
  )
}
