TODO:: NEW MAIL SERVICE [Specifically for Recieving Emails, No current requirement of sending flow]
Current Limitation: Current Mailgun Account provides 3000 emails per month on free tier

POSSIBLE SOLUTIONS
Option 1: Traditional Mail Server (Recommended)
Use:
Postfix as the SMTP server
A domain with MX records pointing to your server
A script that receives and processes incoming emails
