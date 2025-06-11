export const emailHTMl = ({ email, VerifyId, VerificationCode, FullName }) => {
  const verifyLink = `https://pop-7h18.onrender.com/user/verifyuserdetail/${email}/${VerifyId}/${VerificationCode}`;
  const qrData = encodeURIComponent(verifyLink); // Encode the verifyLink for the QR code
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${qrData}&size=200x200`;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Event Confirmation</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background: #f9fafb;
        font-family: 'Segoe UI', sans-serif;
        color: #333;
      }
      .email-container {
        max-width: 640px;
        margin: 40px auto;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      .email-header {
        background: linear-gradient(135deg, #00b09b, #96c93d);
        color: white;
        padding: 30px 20px;
        text-align: center;
      }
      .email-body {
        padding: 30px 20px;
      }
      .email-body h2 {
        margin-top: 0;
        font-size: 22px;
      }
      .event-details, .code-block {
        background: #f0f4f8;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
      }
      .cta-button {
        display: inline-block;
        padding: 10px 16px;
        margin-top: 10px;
        background-color: #00b09b;
        color: white;
        text-decoration: none;
        border-radius: 5px;
      }
      .email-footer {
        padding: 20px;
        background-color: #f1f1f1;
        text-align: center;
        font-size: 12px;
        color: #777;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h1>Your Event Registration is Confirmed 🎉</h1>
      </div>
      <div class="email-body">
        <h2>Hi ${FullName},</h2>
        <p>We're thrilled to confirm your registration for the upcoming event! Below are your details and access credentials.</p>

        <div class="event-details">
          <p><strong>Event:</strong> {{EventName}}</p>
          <p><strong>Date:</strong> {{EventDate}}</p>
          <p><strong>Time:</strong> {{EventTime}}</p>
          <p><strong>Location:</strong> {{EventLocation}}</p>
        </div>

        <p>Here are your personal credentials for this event:</p>

        <div class="code-block">
          <div><strong>Verify ID:</strong> ${VerifyId}</div>
          <div><strong>Verification Code:</strong> ${VerificationCode}</div>
        </div>

        <p><strong>Your QR Code:</strong></p>
        <p>Scan the QR code below to automatically verify your registration:</p>
        <div style="text-align:center;">
          <img src="${qrUrl}" target="_blank" alt="QR Code" style="margin: 20px auto; display: block;" />
        </div>

        <p>If you prefer to verify manually, use this link:</p>
       

        <p>You can access more details and updates via the link below:</p>
        <a href="{{EventURL}}" class="cta-button">View Event Details</a>
      </div>
      <div class="email-footer">
        © 2025 Eventify Inc. All rights reserved.<br/>
        This is an automated email. Please do not reply.
      </div>
    </div>
  </body>
  </html>
  `;
};


export const VerificationemailHTMl = ({ FullName }) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Verification Success</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background: #eef3f9;
        font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #333;
      }
      .email-container {
        max-width: 640px;
        margin: 40px auto;
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        overflow: hidden;
      }
      .email-header {
        background: linear-gradient(135deg, #0f66d0, #00c6fb);
        color: white;
        padding: 30px 24px;
        text-align: center;
      }
      .email-header h1 {
        margin: 0;
        font-size: 28px;
        letter-spacing: 1px;
      }
      .email-body {
        padding: 30px 24px;
      }
      .email-body h2 {
        margin-top: 0;
        font-size: 22px;
        color: #0f66d0;
      }
      .email-body p {
        font-size: 15px;
        line-height: 1.8;
        margin: 16px 0;
      }
      .email-footer {
        padding: 20px;
        background-color: #f0f4f8;
        font-size: 13px;
        text-align: center;
        color: #888;
      }

      @media only screen and (max-width: 640px) {
        .email-body, .email-header {
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>

    <div class="email-container">
      <div class="email-header">
        <h1>🎉 Congratulations, You're Verified!</h1>
      </div>
      <div class="email-body">
        <h2>Hello ${FullName},</h2>
        <p>We are absolutely delighted to inform you that your verification process has been successfully completed. 🎉 Your journey with us has officially begun, and we couldn't be more excited to have you on board!</p>

        <p>Thank you for confirming your details. This verification ensures you now have full access to all the exciting features and experiences lined up for the upcoming event. Whether it's the engaging sessions, interactive workshops, or the festive atmosphere, we are confident you’ll have a memorable time.</p>

        <p>We’ve designed this event to bring people together, share meaningful insights, and most importantly, to celebrate moments that matter. From the stunning venue decor to carefully curated activities, our team has worked tirelessly to make sure everything is perfect for you.</p>

        <p>We encourage you to take full advantage of this experience. Meet new people, join the discussions, and don’t forget to capture and share those fun moments. It's your time to shine and enjoy every second!</p>

        <p>Once again, congratulations on being a verified participant. If you have any questions or need further information, our support team is always ready to help. We’re here to make sure your experience is smooth and unforgettable.</p>

        <p>Get ready to enjoy an event like never before. 🎊</p>

        <p>With warm regards,</p>
        <p><strong>The Eventify Team</strong></p>
      </div>
      <div class="email-footer">
        © 2025 Eventify Inc. All rights reserved.<br/>
        This is an automated email. Please do not reply.
      </div>
    </div>

  </body>
  </html>
  `;
};


export const VerifyConfirm= () => {
  return `
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Page</title>
    <style>
        /* Reset default styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
        }

        /* Body with gradient background and flex centering */
        body {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #6e8efb, #a777e3);
            overflow: hidden;
        }

        /* Container for the verification box */
        .container {
            background: rgba(255, 255, 255, 0.95);
            padding: 2rem 3rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            text-align: center;
            max-width: 400px;
            width: 90%;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        /* Active state for container after load */
        .container.loaded {
            opacity: 1;
            transform: translateY(0);
        }

        /* Heading styles with animation */
        h1 {
            color: #333;
            font-size: 2rem;
            margin-bottom: 1rem;
            animation: fadeIn 0.8s ease-in;
        }

        /* Paragraph styles */
        p {
            color: #555;
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
        }

        /* Success icon with checkmark animation */
        .success-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem;
            border-radius: 50%;
            background:rgb(255, 38, 0);
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .success-icon::before {
            content: '';
            position: absolute;
            width: 40px;
            height: 20px;
            border-left: 6px solid #fff;
            border-bottom: 6px solid #fff;
            transform: rotate(-45deg);
            animation: checkmark 0.5s ease-in forwards;
        }

        /* Loading spinner */
        .loader {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solidrgb(221, 72, 13);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1.5rem;
        }

        /* Hide loader when loaded */
        .loaded .loader {
            display: none;
        }

        /* Keyframes for animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes checkmark {
            from { width: 0; height: 0; }
            to { width: 40px; height: 20px; }
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Responsive design for smaller screens */
        @media (max-width: 480px) {
            .container {
                padding: 1.5rem;
            }
            h1 {
                font-size: 1.5rem;
            }
            p {
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="loader"></div>
        <div class="success-icon"></div>
        <h1>Verification Failed</h1>
        <p>Failed</p>
    </div>

    <script>
        // Simulate a loading delay and then show success
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.querySelector('.container').classList.add('loaded');
            }, 2000); // 2-second delay to simulate loading
        });
    </script>
</body>
</html>
  `;
};
export const VerifyUserDetail = ({ email, VerifyId, VerificationCode }) => {
  return `
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px; display: flex; justify-content: center;">
    <div style="max-width: 500px; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
      
      
      <div style="padding: 30px; text-align: center;">
        <h2 style="color: #333;">Verify Your Email</h2>
        <p style="font-size: 16px; color: #666;">We received a request to verify your email account.</p>

        <div style="margin: 20px 0; text-align: left; font-size: 15px; color: #444;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Verification ID:</strong> ${VerifyId}</p>
          <p><strong>Verification Code:</strong> ${VerificationCode}</p>
        </div>

        <button id="submit" 
          style="background-color: #4CAF50; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; cursor: pointer;">
          Confirm Now
        </button>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
  <script>
    document.getElementById("submit").addEventListener('click', async () => {
      try {
        const response = await axios.get("http://localhost:3333/user/verifyconfirmuser/${email}/${VerifyId}/${VerificationCode}", {
          withCredentials: true
        });

        if (response.status === 200) {
          Toastify({
            text: "User Verified Successfully",
            duration: 2000,
            gravity: "top",
            position: "right",
            backgroundColor: "green",
          }).showToast();
        } else {
          Toastify({
            text: response.data.message,
            duration: 2000,
            gravity: "top",
            position: "right",
            backgroundColor: "red",
          }).showToast();
        }
      } catch (error) {
        Toastify({
          text: "Error verifying user",
          duration: 2000,
          gravity: "top",
          position: "right",
          backgroundColor: "red",
        }).showToast();
        console.log("VerifyUser error", error);
      }
    });
  </script>
  `;
};
