import React, {useEffect, useRef,useState} from 'react'
import { db } from '../firebase'
import { collection, addDoc, arrayUnion, updateDoc, getDoc } from "firebase/firestore";
import { useParams } from 'react-router-dom';

export default function Instructor() {
    const courseName = useRef()
    const courseCode = useRef()
    const courseDescription = useRef()
    const email = useParams()
    const [courseInfo, setCourseInfo] = useState([])
    const userRef = db.collection('authenicatedUsers').doc(email.email)
    
    const addCourse = async(e) =>{
        e.preventDefault()
        const courseRef = collection(db, "courses");
        await addDoc(courseRef, {
            instructorEmail: email.email,
            courseName: courseName.current.value,
            courseCode: courseCode.current.value,
            courseDescription: courseDescription.current.value
        })   
        courseInfo.push({courseName: courseName.current.value, courseCode: courseCode.current.value, courseDescription: courseDescription.current.value})
        
        await updateDoc(userRef, {
            courses: arrayUnion({courseName: courseName.current.value, courseCode: courseCode.current.value, courseDescription: courseDescription.current.value})
        })
    }

    useEffect(() => {
        if(email == undefined) return
        const getUserInfo = async() =>{
            const data = await getDoc(userRef)
            setCourseInfo(data.data().courses)
        }
        getUserInfo()
    }, [email,addCourse])
        
  return (
    <>
    <div className="container">
        <div className="row">
            <div className="col-md-9 align-self-center">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Add Course</h5>
                        <form onSubmit={addCourse}> 
                            <div className="form-group">
                                <label for="courseName">Course Name</label>
                                <input ref={courseName} type="text" className="form-control" id="courseName" placeholder="Enter Course Name" />
                            </div>
                            <div className="form-group">
                                <label for="courseCode">Course Code</label>
                                <input ref={courseCode} type="text" className="form-control" id="courseCode" placeholder="Enter Course Code" />
                            </div>
                            <div className="form-group">
                                <label for="courseDescription">Course Description</label>
                                <input ref={courseDescription} type="text" className="form-control" id="courseDescription" placeholder="Enter Course Description" />
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-md-12">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Course List</h5>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Serial</th>
                                    <th scope="col">Course Name</th>
                                    <th scope="col">Course Code</th>
                                    <th scope="col">Course Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courseInfo && courseInfo.map((course, index) => (
                                    <tr>
                                        <th scope="row">{index+1}</th>
                                        <td>{course.courseName}</td>
                                        <td>{course.courseCode}</td>
                                        <td>{course.courseDescription}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>                        
  )
}
