import { SendEmailDto } from 'email/dto/send-email.dto';

export function otpTemplate(data: SendEmailDto): string {
  return `
        <!DOCTYPE html>
<html>
<head>
    <title>One-Time Password (OTP)</title>
</head>
<body>
    <h1>Your One-Time Password (OTP)</h1>
    <p>Your OTP for accessing your account is:</p>
    <h2>{{otp_code}}</h2>
    <p>Please use this code to complete your transaction or login. Do not share this OTP with anyone.</p>

    <!-- Standard Footer -->
    <footer style="text-align:center; margin-top:20px; font-size:12px; color:grey;">
        <p>Company Name | Address | Contact Info</p>
        <p><a href="{{unsubscribe_link}}">Unsubscribe</a> | <a href="{{privacy_policy_link}}">Privacy Policy</a></p>
        <p>Follow us on:
            <a href="{{facebook_link}}">Facebook</a> |
            <a href="{{twitter_link}}">Twitter</a> |
            <a href="{{instagram_link}}">Instagram</a>
        </p>
    </footer>
</body>
</html>
      `;
}
