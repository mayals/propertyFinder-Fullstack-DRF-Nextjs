from django.shortcuts import render

from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.conf import settings
from django.contrib import messages
from .forms import ContactForm

def contact_us_view(request):
    """Handle contact form submissions for the contact-us page."""
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            # Collect cleaned data
            cleaned_data = form.cleaned_data

            # Compose the email content to admin
            email_subject = cleaned_data.get('subject', 'Contact Form Submission')

            email_body = f"""
            New Contact Form Submission from Property Finder

            ========================================================

            Customer Details:
            - Full Name:        {cleaned_data['full_name']}
            - Email:            {cleaned_data['email']}
            - Mobile Number:    {cleaned_data['mobile']}
            - WhatsApp Number:  {cleaned_data['whatsapp']}
            - Country Code:     {cleaned_data['country_code']}

            ========================================================

            Reason for Contact: {cleaned_data.get_reason_display()}

            ========================================================

            Subject: {email_subject}

            Message:
            {cleaned_data['message']}

            ========================================================

            This message was submitted through the Property Finder
            contact form on {request.get_host()}.
            """

            # Admin recipient - use settings or fallback
            admin_email = getattr(settings, 'PROPERTY_FINDER_ADMIN_EMAIL', 'admin@propertyfinder.com')

            try:
                send_mail(
                    subject=email_subject,
                    message=email_body,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[admin_email],
                    fail_silently=False,
                )
                # Success message shown to user
                messages.success(request, 'Your message has been sent successfully! We will respond soon.')
                return redirect('contact-us')
            except Exception as e:
                # Handle email errors gracefully
                messages.error(request, 'There was an error sending your message. Please try again.')
                print(f"Email sending error: {e}")
    else:
        form = ContactForm()

    return render(request, 'property_finder/contact_us.html', {
        'form': form,
    })

def contact_success_view(request):
    """Simple success confirmation page."""
    return render(request, 'property_finder/contact_success.html')
