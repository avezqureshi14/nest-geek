import { SendEmailDto } from 'email/dto/send-email.dto';

export function marketingTemplate(data: SendEmailDto): string {
  return `
       <!DOCTYPE html>
<html>
<head>
    <title>Special Offer Just for You!</title>
</head>
<body>
    <h1>Exclusive Deal!</h1>
    <p>Hi {{username}}, we have an exciting offer for you!</p>
    <p>Check out our latest products and enjoy a special discount just for our loyal customers.</p>
    <a href="{{offer_link}}" target="_blank">View Offer</a>

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
