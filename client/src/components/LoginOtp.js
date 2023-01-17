import React, {useRef,useState} from 'react'
import { Form, Button, Card, Alert, Container } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate} from 'react-router-dom'
import { db } from '../firebase'


export default function LoginOtp() {
  const emailRef = useRef()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        
        try{
            setError('')
            setLoading(true)
            // check in collection authenicatedUsers if email exists, then navigating to that particular page
            // else navigate to home page
            const docRef = await db.collection("authenicatedUsers").doc(emailRef.current.value).get()
            if(docRef.exists){
                console.log("Document data:", docRef.data());
                const userRole = await docRef.data().role
                console.log(userRole)
                if(userRole == "student"){
                    navigate(`/student/${emailRef.current.value}`)
                }
                else if(userRole == "instructor"){
                    navigate(`/instructor/${emailRef.current.value}`)
                }
                else if(userRole == "batch-advisior"){
                    navigate(`/batch-advisior`)
                }
                else{
                    navigate("/signup-otp")
                }
            } else {
                console.log("No such document!");
                navigate("/signup-otp")
            }
        } catch {
            setError('Wrong email or password')
        }
        setLoading(false)
    }

  return (
    <>  
    <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
        <div className="w-100" style={{maxWidth: "400px"}}>
        <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Login In</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>
                    <Button disabled={loading} className="w-100 mt-2" type="submit">
                        Login In
                    </Button>
                </Form>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            Need an account? <Link to="/signup-otp">Sign Up</Link>
        </div>
        </div>
    </Container>
    </>
  )
}
