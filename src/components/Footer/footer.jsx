import './footer.css'
import logo from '../../assets/images/coolie-logo.png'
import facebook from '../../assets/images/facebook.svg'
import x from '../../assets/images/x.svg'
import linkedin from '../../assets/images/linkedin.png'
import instagram from '../../assets/images/instagram.svg'
import googleplaystore from '../../assets/images/google-playstore.svg'
import applestore from '../../assets/images/apple-store.svg'
import { useNavigate } from 'react-router-dom'

const Footer=()=>{
    const navigate = useNavigate()
    return(
        <>
          <div className="main-footer">
             <div className="first-footer">
                <div className='f-top-footer'>
                    <div className='f-logo'>
                        <img src={logo} alt='logo'/>
                    </div>
                    <div>
                       <input className='input' placeholder='please enter your email'/>
                    </div>
                    <div>
                        <button className='f-button'>SUBSCRIBE</button>
                    </div>
                </div>
                <div className='f-bottom-footer'>
                     <div>
                            <p>COMPANY </p>
                            <li onClick={()=>{navigate('/aboutus')}}>About us</li>
                            <li>Reviews</li>
                            <li>Contact us</li>
                            <li>Careers</li>
                     </div>
                     <div>
                            <p> OUR SERVICES</p>
                            <li>About us</li>
                            <li>Reviews</li>
                            <li>Contact us</li>
                     </div>
                     <div>
                            <p>TERMS & POLICES</p>
                            <li>About us</li>
                            <li>Reviews</li>
                            <li>Contact us</li>    
                     </div>
                </div>   
             </div>
            
             <div className="last-footer">
                 <p className='follow-us'>Follow us</p>
                 <div className='s-m-icons'>
                     <div className='s-m-i'>
                         <img src={facebook} alt='social media icons'/>
                     </div>
                     <div className='s-m-i'>
                         <img src={instagram} alt='social media icons'/>
                     </div>
                     <div className='s-m-i'>
                         <img src={x} alt='social media icons'/>
                     </div>
                     <div className='s-m-i'>
                         <img src={linkedin} alt='social media icons'/>
                     </div>
                 </div>
                 <div className='play-apple'>
                      <p>Download App</p>
                      <div className='p-a-store'>
                        <img src={googleplaystore} alt='playstore'/>
                        <img src={applestore} alt='playstore'/>
                      </div>
                 </div>
             </div>
          </div>
        </>
    )
}
export default Footer