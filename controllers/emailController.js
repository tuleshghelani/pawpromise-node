const { validationResult } = require('express-validator');
const { sendEmail: sendMailUtil } = require('../config/email');

const sendEmail = async (req, res) => {
  console.log('sendEmail controller called');
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      mobile,
      company,
      address,
      city,
      state,
      businessType,
      experience,
      investmentCapacity,
      storageFacilities,
      showroomFacilities,
      transportFacilities,
      message
    } = req.body;

    // Create HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Business Enquiry</title>
        <style>
          /* Reset styles */
          body, p, h1, h2, h3, div, span {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
          }

          /* Container styles */
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }

          /* Header styles */
          .header {
            background-color: #178d34;
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }

          .header h1 {
            font-size: 24px;
            margin-bottom: 10px;
          }

          /* Content styles */
          .content {
            background-color: #ffffff;
            padding: 30px;
            border: 1px solid #e0e0e0;
            border-radius: 0 0 8px 8px;
          }

          .section {
            margin-bottom: 25px;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 15px;
          }

          .section:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
          }

          .section-title {
            color: #178d34;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
          }

          .field {
            margin-bottom: 12px;
          }

          .label {
            color: #666666;
            font-size: 14px;
            margin-bottom: 4px;
          }

          .value {
            color: #333333;
            font-size: 16px;
            font-weight: 500;
          }

          .highlight {
            background-color: #e5d34b;
            color: #000000;
            padding: 2px 8px;
            border-radius: 4px;
            display: inline-block;
          }

          /* Responsive styles */
          @media only screen and (max-width: 600px) {
            .container {
              width: 100%;
              padding: 10px;
            }

            .header {
              padding: 20px;
            }

            .content {
              padding: 20px;
            }

            .header h1 {
              font-size: 20px;
            }

            .section-title {
              font-size: 16px;
            }

            .value {
              font-size: 14px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Business Enquiry</h1>
            <p>A new business partnership request has been received</p>
          </div>
          
          <div class="content">
            <div class="section">
              <div class="section-title">Contact Information</div>
              <div class="field">
                <div class="label">Name</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email</div>
                <div class="value">${email}</div>
              </div>
              <div class="field">
                <div class="label">Mobile</div>
                <div class="value">${mobile}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Business Details</div>
              <div class="field">
                <div class="label">Company</div>
                <div class="value">${company || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="label">Business Type</div>
                <div class="value"><span class="highlight">${businessType}</span></div>
              </div>
              <div class="field">
                <div class="label">Experience</div>
                <div class="value">${experience} years</div>
              </div>
              <div class="field">
                <div class="label">Investment Capacity</div>
                <div class="value">${investmentCapacity} Lakhs</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Location & Facilities</div>
              <div class="field">
                <div class="label">Address</div>
                <div class="value">${address}</div>
              </div>
              <div class="field">
                <div class="label">City</div>
                <div class="value">${city}</div>
              </div>
              <div class="field">
                <div class="label">State</div>
                <div class="value">${state}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Available Facilities</div>
              <div class="field">
                <div class="label">Storage Facilities</div>
                <div class="value">${storageFacilities.toUpperCase()}</div>
              </div>
              <div class="field">
                <div class="label">Showroom Facilities</div>
                <div class="value">${showroomFacilities.toUpperCase()}</div>
              </div>
              <div class="field">
                <div class="label">Transport Facilities</div>
                <div class="value">${transportFacilities.toUpperCase()}</div>
              </div>
            </div>

            ${message ? `
            <div class="section">
              <div class="section-title">Additional Message</div>
              <div class="field">
                <div class="value">${message}</div>
              </div>
            </div>
            ` : ''}
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER,
      subject: 'Dealership : New Enquiry',
      html: htmlContent
    };

    const result = await sendMailUtil(mailOptions);
    
    if (!result.success) {
      throw new Error(result.error);
    }

    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: result.messageId 
    });
  } catch (error) {
    console.error('Error in sendEmail controller:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email', 
      error: error.message 
    });
  }
};

const sendContactEmail = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      phone,
      subject,
      message
    } = req.body;

    // Create HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Enquiry</title>
        <style>
          body, p, h1, h2, h3, div, span {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
          }

          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }

          .header {
            background-color: #178d34;
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }

          .header h1 {
            font-size: 24px;
            margin-bottom: 10px;
          }

          .content {
            background-color: #ffffff;
            padding: 30px;
            border: 1px solid #e0e0e0;
            border-radius: 0 0 8px 8px;
          }

          .section {
            margin-bottom: 25px;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 15px;
          }

          .section:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
          }

          .section-title {
            color: #178d34;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
          }

          .field {
            margin-bottom: 12px;
          }

          .label {
            color: #666666;
            font-size: 14px;
            margin-bottom: 4px;
          }

          .value {
            color: #333333;
            font-size: 16px;
            font-weight: 500;
          }

          .highlight {
            background-color: #e5d34b;
            color: #000000;
            padding: 2px 8px;
            border-radius: 4px;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Enquiry</h1>
            <p>A new contact enquiry has been received</p>
          </div>
          
          <div class="content">
            <div class="section">
              <div class="section-title">Contact Information</div>
              <div class="field">
                <div class="label">Name</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email</div>
                <div class="value">${email}</div>
              </div>
              <div class="field">
                <div class="label">Phone</div>
                <div class="value">${phone}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Enquiry Details</div>
              <div class="field">
                <div class="label">Subject</div>
                <div class="value"><span class="highlight">${subject}</span></div>
              </div>
              <div class="field">
                <div class="label">Message</div>
                <div class="value">${message}</div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER,
      subject: 'Contact : New Enquiry',
      html: htmlContent
    };

    const result = await sendMailUtil(mailOptions);
    
    if (!result.success) {
      throw new Error(result.error);
    }

    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: result.messageId 
    });
  } catch (error) {
    console.error('Error in sendContactEmail controller:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email', 
      error: error.message 
    });
  }
};

module.exports = {
  sendEmail,
  sendContactEmail
}; 