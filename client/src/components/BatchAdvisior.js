import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { db } from '../firebase'

export default function BatchAdvisior() {
  const [requests, setRequests] = useState()
  
  const getRequests = async() =>{
    const requestRef = collection(db,'requests')
    const data = await getDocs(requestRef)
    setRequests(data.docs.map((doc)=>({...doc.data(),id: doc.id})));
  }

    useEffect(() => {
        getRequests()
    }, [])

    const approveRequest = async(request) =>{
        const userRef = doc(db,'authenicatedUsers',request.email)
        const requestRef = doc(db,'requests',request.id)
        await updateDoc(userRef,{
            courses: arrayUnion(request),
            coursesApproval: arrayRemove(request)
        })
        await deleteDoc(requestRef)
        console.log("Approved")
    }

    const rejectRequest = async(request) =>{
        const requestRef = doc(db,'requests',request.id)
        await deleteDoc(requestRef)
        console.log("Rejected")
    }


  return (
    <>
    <div>BatchAdvisior</div>
    <div>Approval Requests</div>
    <Table>
        <tr>
            <th scope='col'>Serial</th>
            <th scope='col'>Course Name</th>
            <th scope='col'>Course Code</th>
            <th scope='col'>Instructor Email</th>
            <th scope='col'>Student Email</th>
            <th scope='col'>Action</th>
        </tr>
        {requests && requests.map((request, index) => (
            <tr>
                <td scope='row'>{index+1}</td>
                <td>{request && request.courseName}</td>
                <td>{request && request.courseCode}</td>
                <td>{request && request.instructorEmail}</td>
                <td>{request && request.email}</td>
                <td>
                    <Button variant="success" onClick={() => approveRequest(request)}>Approve</Button>
                    <Button variant="danger" onClick={() => rejectRequest(request)}>Reject</Button>
                </td>
            </tr>
        ))}
    </Table>
    </>
  )
}
