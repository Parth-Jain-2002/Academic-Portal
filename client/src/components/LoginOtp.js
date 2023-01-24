import React, {useRef,useState} from 'react'
import { Form, Button, Card, Alert, Container } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate} from 'react-router-dom'
import { db } from '../firebase'


export default function LoginOtp() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingVerify, setLoadingVerify] = useState(true)
  const navigate = useNavigate()

  async function sendOTP() {
    setLoading(true)
    // console.log("Sending OTP")
    const response = await fetch(`https://nodemailer-test.onrender.com/sendmail?to=${emailRef.current.value}`)
    const data = await response.text()
    if(data == "Email sent") {
        console.log("Mail sent successfully")
        setLoadingVerify(false)
        setLoading(true)
    } else {
        console.log("Mail not sent")
        setLoading(false)
    }
   }

    async function handleSubmit(e) {
        e.preventDefault()
        
        try{
            setError('')
            setLoading(true)
            setLoadingVerify(true)
            console.log("Verifying OTP")
            const response = await fetch(`https://nodemailer-test.onrender.com/verifyotp?email=${emailRef.current.value}&otp=${passwordRef.current.value}`)
            const data = await response.text()
            if(data == "OTP Verified") {
                setMessage("OTP Verified")
                setLoadingVerify(true)
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
            }
            else{
                console.log("OTP Not Verified")
                setLoadingVerify(false)
            }
            // check in collection authenicatedUsers if email exists, then navigating to that particular page
            // else navigate to home page
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
                    <Form.Group id="password">
                        <Form.Label>OTP</Form.Label>
                        <Form.Control type="text" ref={passwordRef} required/>
                    </Form.Group>
                    <Button disabled={loading} onClick={sendOTP} className="w-100 mt-2">
                        Send OTP
                    </Button>
                    <Button disabled={loadingVerify} className="w-100 mt-2" type="submit">
                        Login In
                    </Button>
                </Form>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            Need an account? <Link to="/">Sign Up</Link>
        </div>
        </div>
    </Container>
    </>
  )
}
