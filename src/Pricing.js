import React from 'react'
import Contact from './Contact.js';

function Pricing() {
    const pricingHeader = {
        
    }
  return (
    <section className="pricing-section" id="pricing">
        <h2 className="pricing-header"><span>Pricin</span>g</h2>
          <div className="pricing-sub-header">* terms and conditions applied</div>

          <div className="pricing-card-cnt">
                <div className="pricing-card">
                    <div className="pricing-card-heading">
                      <h3 className="pricing-card-title">Blog </h3>
                      <div className="pricing-card-price">#80,000</div>
                    </div>
                    <div className="pricing-card-content">
                      <div className="additional-feature">
                          <div className="feature-title">emailing</div>
                          <div className="feature-price">+ #25,000</div>
                        </div>
                      <div className="additional-feature">
                          <div className="feature-title">designed and customized</div>
                          <div className="feature-price">+ #0</div>
                        </div>
                      <div className="additional-feature">
                          <div className="feature-title">designed and customized by client (you)</div>
                          <div className="feature-price">+ #90,000</div>
                        </div>
                      <div className="additional-feature">
                          <div className="feature-title">updating feature</div>
                          <div className="feature-price">+ #0</div>
                        </div>
                    </div>
                    <div className="order-btn-cnt">
                      <a>I want this one</a>

                    </div>

                </div>
                <div className="pricing-card">
                    <div className="pricing-card-heading">
                      <h3 className="pricing-card-title">Company  </h3>
                      <div className="pricing-card-price">#100,000</div>
                    </div>
                    <div className="pricing-card-content">
                      <div className="additional-feature">
                          <div className="feature-title">emailing</div>
                          <div className="feature-price">+ #30,000</div>
                        </div>
                      <div className="additional-feature">
                          <div className="feature-title">designed and customized</div>
                          <div className="feature-price">+ #0</div>
                        </div>
                      <div className="additional-feature">
                          <div className="feature-title">designed and customized by client (you)</div>
                          <div className="feature-price">+ #90,000</div>
                        </div>
                      <div className="additional-feature">
                          <div className="feature-title">updating feature</div>
                          <div className="feature-price">+ #0</div>
                        </div>
                    </div>
                    <div className="order-btn-cnt">
                      <a>I want this one</a>

                    </div>

                </div>
                <div className="pricing-card">
                    <div className="pricing-card-heading">
                      <h3 className="pricing-card-title">Others </h3>
                      <div className="pricing-card-price"></div>

                    </div>
                    <div className="pricing-card-content">
                      <div className="additional-feature">
                          <div className="feature-title">Contact us so that we know what you want</div>
                          <div className="feature-price"></div>
                        </div>
                      
                    </div>
                    <div className="order-btn-cnt">
                      <a href="#contactme">I want this one</a>

                    </div>

                </div>
                
          </div>
          <div className="more-pricing-option">
              <div className="more-pricing-option-heading">Not what you want?</div>
              
              <Contact needid="contactme"></Contact>
          </div>
    </section>
  )
}

export default Pricing