import { getDocs } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'

export default function Student() {
    
  const[courseData, setCourseData] = useState()
  const getCourse = async() =>{
    const courseRef = db.collection('courses')
    const data = await getDocs(courseRef)
    setCourseData(data.docs.map((doc)=>({...doc.data(),id: doc.id})));
}

  useEffect(() => {
    getCourse()
    }, [])
    
  return (
    <>
    <div>Student</div>
    <table>
    <tr>
        <th>Serial</th>
        <th>Course Name</th>
        <th>Course Code</th>
        <th>Course Description</th>
    </tr>
    {courseData && courseData.map((course, index) => (
        //table
        <tr>
            <td>{index+1}</td>
            <td>{course.courseName}</td>
            <td>{course.courseCode}</td>
            <td>{course.courseDescription}</td>
        </tr>
    ))}
    </table>
    </>
  )
}
