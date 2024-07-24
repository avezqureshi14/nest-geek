import { SendEmailDto } from 'email/dto/send-email.dto';

export function signupTemplate(data: SendEmailDto): string {
  return `
        <!DOCTYPE html>
<html>
<head>
    <title>Welcome to Our Service</title>
</head>
<body>
    <h1>Welcome, {{username}}!</h1>
    <p>Thank you for signing up with us. Your journey to explore amazing features starts here.</p>
    <p>To get started, please verify your email address:</p>
    <a href="{{verification_link}}" target="_blank">Verify Email</a>
    <p>If you did not sign up for this account, please ignore this email.</p>

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
