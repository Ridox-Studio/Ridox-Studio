import React from 'react'

function Contact(props) {
    let needid= "";
    if (props.needid){
        needid= props.needid;
    }
  return (
      <div id={needid}>
          <div className="more-pricing-option-sub-heading">contact us on any of these platforms</div>
          <ul className="more-pricing-option-list">
              <li>message us on WhatsApp. <a href="https://github.com/">Click here</a></li>
              <li>message us on  Instagram. <a href="https://github.com/">Click here</a></li>
              <li>message us on Facebook. <a href="https://github.com/">Click here</a></li>
          </ul>
          <div className="more-pricing-option-sub-heading">Send us an email</div>
          <div className="more-pricing-option-list email-us-cnt">
              <form>
                  <label for="contactname">Name</label>
                  <input type="text" name="" id="contactname" placeholder="Type name or company name here" />
                  <label for="contactmail">Work or Company Email</label>
                  <input type="text" name="" id="contactmail" placeholder="Type name email here" />
                  <label for="contactmsg">Tell us the website you want</label>
                  <textarea id="contactmsg" placeholder="type description">

                  </textarea>
                  <div class="submit-box"><button type="submit">SUBMIT</button></div>

              </form>

          </div>
          </div>
  )
}

export default Contact