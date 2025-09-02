#  signals.py
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model

# signal 2
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import smart_bytes
from django.contrib.auth.tokens import default_token_generator
from proj.settings import DEFAULT_FROM_EMAIL
from django.core.mail import send_mail

from .models import ClientProfile, AdminProfile



#signal-1 -- for create user profile
# sender   =   get_user_model()            -------- instance user from django.contrib.auth import get_user_model
# receiver =   create_user_profile function    -------- function to creat new UserProfile in database table for the new registerd user 
@receiver(post_save, sender=get_user_model())
def create_user_profile(sender, instance, created, **kwargs):
    if created:
            instance_user = instance 
            # create ClientProfile instance
            if instance_user.is_client==True:  
               ClientProfile.objects.create(user=instance_user)  
               instance_user.client_profile.id = instance_user.id
            # create AdminProfile instance 
            if instance_user.is_superuser==True:  
               AdminProfile.objects.create(user=instance_user)
               instance_user.admin_profile.id = instance_user.id
               
              
              
              
               

#signal-2 -- for confirm email for the user by send confirm link in email
# sender   =   get_user_model()        -------- instance user from django.contrib.auth import get_user_model
# receiver =   send_confirmation_email function  -------- function to send emailto user.email contain send_confirmation_email link          
@receiver(post_save, sender=get_user_model(), dispatch_uid="unique_identifier")
def send_confirmation_email_link(sender, instance, created, **kwargs):
    if created:
        try:
            subject = 'Confirm Your Email link'
            message = render_to_string('users/confirm-email.html', 
                   {
                        'user'  : instance,
                        'domain': 'localhost:3000',
                        'uid'   : urlsafe_base64_encode(smart_bytes(instance.id)),
                        'token' : default_token_generator.make_token(instance),
                   }
                                       ) 
            from_email = DEFAULT_FROM_EMAIL
            to_email = instance.email
            send_mail(subject, message, from_email, [to_email], fail_silently=False)
        
        except Exception as e:
            print(f'Error sending confirmation email: {e}')
