import { SendEmailDto } from 'email/dto/send-email.dto';

export function forgotPasswordTemplate(data: SendEmailDto): string {
  return `
        <!DOCTYPE html>
<html>
<head>
    <title>Password Reset</title>
</head>
<body>
    <h1>Password Reset Request</h1>
    <p>We received a request to reset the password for your account.</p>
    <p>If you made this request, please click on the link below to reset your password:</p>
    <a href="{{reset_password_link}}" target="_blank">Reset Password</a>
    <p>If you did not request to reset your password, please ignore this email or contact support if you have concerns.</p>

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
