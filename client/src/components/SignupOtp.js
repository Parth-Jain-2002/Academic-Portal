import React, {useRef,useState} from 'react'
import { Form, Button, Card, Alert, Container } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate} from 'react-router-dom'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'


export default function SignupOtp() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const {login} = useAuth()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingVerify, setLoadingVerify] = useState(true)
  const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        
        try{
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            navigate("/")
        } catch {
            setError('Wrong email or password')
        }
        setLoading(false)
    }

    async function sendOTP() {
        setError('')
        setMessage('')
        // check if email is valid
        const email = emailRef.current.value
        const regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        if(!regex.test(email)){
            setError("Invalid Email")
            return
        }

        // check if email is of domain @iitrpr.ac.in
        const domain = email.split("@")[1]
        if(domain != "iitrpr.ac.in"){
            setError("Email must be of domain @iitrpr.ac.in")
            return
        }

        setLoading(true)
        // console.log("Sending OTP")
        const response = await fetch(`https://nodemailer-test.onrender.com/sendmail?to=${emailRef.current.value}`)
        const data = await response.text()
        if(data == "Email sent") {
            setMessage("Mail sent successfully")
            setLoadingVerify(false)
            setLoading(true)
        } else {
            setError("Mail not sent")
            setLoading(false)
        }
    }

    async function verifyOtp(){
        setError('')
        setMessage('')
        setLoadingVerify(true)
        console.log("Verifying OTP")
        const response = await fetch(`https://nodemailer-test.onrender.com/verifyotp?email=${emailRef.current.value}&otp=${passwordRef.current.value}`)
        const data = await response.text()
        if(data == "OTP Verified") {
            setMessage("OTP Verified")
            setLoadingVerify(true)
        }
        else{
            setError("OTP Not Verified")
            setLoadingVerify(false)
        }
    }

    function createUser(){
        setMessage("Creating User")
        
        db.collection("authenicatedUsers").doc(emailRef.current.value).set({
            role: document.querySelector('input[name="user-type"]:checked').value,
        }
        ).then(()=>{
            const userRole = document.querySelector('input[name="user-type"]:checked').value
            if(userRole == "instructor"){
                navigate(`/instructor/${emailRef.current.value}`)
            }
            else if(userRole == "student"){
                navigate(`/student/${emailRef.current.value}`)
            }
            else if(userRole == "batch-advisior"){
                navigate("/batch-advisior")
            }
        })
    }

  return (
    <>  
    <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
        <div className="w-100" style={{maxWidth: "400px"}}>
        <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Signup Using OTP</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
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
                    <Button disabled={loadingVerify} onClick={verifyOtp} className="w-100 mt-2">
                        Verify OTP
                    </Button>
                     {/* Radio button for selecting the type of user: instructor, student, batch-advisior */}
                    <Form.Group id="user-type">
                        <Form.Label>User Type</Form.Label>
                        <Form.Check type="radio" label="Instructor" name="user-type" value="instructor" />
                        <Form.Check type="radio" label="Student" name="user-type" value="student" />
                        <Form.Check type="radio" label="Batch Advisior" name="user-type" value="batch-advisior" />
                    </Form.Group>
                    <Button className='w-100' onClick={createUser}>Create New User</Button>
                </Form>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            Need an account? <Link to="/login-otp">Login</Link>
        </div>
        </div>
    </Container>
    </>
  )
}
