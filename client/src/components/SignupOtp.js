import React, {useRef,useState} from 'react'
import { Form, Button, Card, Alert, Container } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate} from 'react-router-dom'


export default function SignupOtp() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const {login} = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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
        console.log("Sending OTP")
        const response = await fetch(`https://nodemailer-test.onrender.com/sendmail?to=${emailRef.current.value}`)
        const data = await response.json()
        console.log(data)
        if(data.status == "Email Sent") {
            console.log("Mail sent successfully")
        } else {
            console.log("Mail not sent")
        }
    }

  return (
    <>  
    <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
        <div className="w-100" style={{maxWidth: "400px"}}>
        <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Signup Using OTP</h2>
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
                    <Button disabled={loading} onClick={sendOTP}className="w-100 mt-2">
                        Send OTP
                    </Button>
                    <Button disabled={loading} className="w-100 mt-2" type="submit">
                        Verify OTP
                    </Button>
                </Form>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            Need an account? <Link to="/login">Login</Link>
        </div>
        </div>
    </Container>
    </>
  )
}
