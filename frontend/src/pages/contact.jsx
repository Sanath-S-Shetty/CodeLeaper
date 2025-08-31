import { FaEnvelope, FaLinkedin } from "react-icons/fa";

function Contact() {
  return (
    <div>
      <h1>Contact Us</h1>
      <p>If you have any questions or feedback feel free to reach out!</p>

      <a href="mailto:sanathshetty370@gmail.com?subject=Hello&body=I%20wanted%20to%20contact%20you"
      target="_blank" 
  rel="noopener noreferrer"
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    textDecoration: "none",
    color: "",
    fontSize: "20px",
    marginTop: "20px"
  }}>
        <FaEnvelope  size={30} style={{ marginRight: "8px" }}/> 
         <span>Email</span>
      </a>


       <a href="https://www.linkedin.com/in/sanath-s-shetty-411472302"
      target="_blank" 
  rel="noopener noreferrer"
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    textDecoration: "none",
    color: "",
    fontSize: "20px",
    marginTop: "20px"
  }}>
        <FaLinkedin size={30} style={{ marginRight: "8px" }}/> 
         <span>LinkedIn</span>
    
      </a>
    </div>
  );
}

export default Contact;
