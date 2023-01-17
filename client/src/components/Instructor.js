import React, {useRef} from 'react'
import { db } from '../firebase'
import { collection, addDoc } from "firebase/firestore";

export default function Instructor() {
    const courseName = useRef()
    const courseCode = useRef()
    const courseDescription = useRef()
    
    const addCourse = async(e) =>{
        e.preventDefault()
        const courseRef = collection(db, "courses");
        await addDoc(courseRef, {
            courseName: courseName.current.value,
            courseCode: courseCode.current.value,
            courseDescription: courseDescription.current.value
        })   
    }
  return (
    <>
    <div className="container">
        <div className="row">
            <div className="col-md-6">
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
    </div>
    </>                        
  )
}
