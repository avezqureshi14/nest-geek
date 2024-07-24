import { SendEmailDto } from 'email/dto/send-email.dto';

export function standardTemplate(data: SendEmailDto): string {
  return `
      <!DOCTYPE html>
<html>
<head>
    <title>Your Subject Here</title>
</head>
<body>
    <h1>Hello {{username}}!</h1>
    <p>This is a standard email template for your general communication needs.</p>
    <p>Include your message here. You can talk about updates, news, information, or any other relevant content that you wish to communicate to your users.</p>
    <p>Feel free to customize this template to suit your specific needs and branding.</p>

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
