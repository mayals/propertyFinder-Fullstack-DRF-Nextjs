# https://github.com/django/django/blob/main/django/contrib/auth/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.mail import send_mail
from django.conf import settings

from rest_framework_simplejwt.tokens import RefreshToken
import contextlib
import uuid
from phonenumber_field.modelfields import PhoneNumberField


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        
        if not extra_fields.get("is_staff"):
            raise ValueError("Superuser must have is_staff=True")
        if not extra_fields.get("is_superuser"):
            raise ValueError("Superuser must have is_superuser=True")
        return self.create_user(email, password, **extra_fields)
        
        
        
        
# https://github.com/django/django/blob/8be0c0d6901669661fca578f474cd51cd284d35a/django/contrib/auth/models.py#L517   
    """
    An abstract base class implementing a fully featured User model with
    admin-compliant permissions.

    Username and password are required. Other fields are optional.
    """
class CustomUser(AbstractUser):
    USERNAME_FIELD = 'email'  #USERNAME_FIELD the field used as the unique identifier for the user
    email = models.EmailField(unique=True, blank=False, null=False)
    REQUIRED_FIELDS = ["first_name", "last_name"]
    
    objects = CustomUserManager()
            
    id               = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  
    username         = None
    first_name       = models.CharField(max_length=150, blank=False, null=True)
    last_name        = models.CharField(max_length= 150, blank=False, null=True) 
    date_joined      = models.DateTimeField(auto_now_add=True)
    is_active        = models.BooleanField(default=True, help_text="Designates whether this user should be treated as active." "Unselect this instead of deleting accounts.")
    is_staff         = models.BooleanField(default=False, help_text="Designates whether the user can log into this admin site.")
    is_superuser     = models.BooleanField(default=False)
    # now we can add a few extra fields -- extend with additional custom fields 
    # enable_two_factor_authentication = models.BooleanField(null=True, blank=True)
    is_verifiedEmail  = models.BooleanField(default=False)
    is_client         = models.BooleanField(default=False)
    role              = models.CharField(max_length=100, verbose_name="Role", blank=True, null=True)
   
    def __str__(self):
        return self.email
    
    
    def get_full_name(self):
        """
        Return the first_name plus the last_name, with a space in between.
        """
        full_name = "%s %s" % (self.first_name, self.last_name)
        return full_name.strip()

    
    def get_short_name(self):
        """Return the short name for the user."""
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        """Send an email to this user."""
        send_mail(subject, message, from_email, [self.email], **kwargs)

    
    
    class Meta:
        ordering = ('-date_joined',)
        verbose_name = 'CustomUser'
        verbose_name_plural = 'CustomUser'

    
    def save(self, *args, **kwargs):
        # Only assign defaults if this is a new user and role is not set
        # UUIDField(default=uuid.uuid4) — the id is set before the save() method runs
        if self._state.adding:  # Check if this is a new user # New user
            if self.is_superuser:
                self.role = "admin"
                self.is_client = False
            elif not self.role:  # Only assign if role is not set
                self.role = "client"
                self.is_client = True
        super().save(*args, **kwargs)
        
    
    
    
   
    
    @property
    def profile_picture(self):
        if self.is_client :
            try:
                profile_picture = ClientProfile.objects.get(id=self.id).profile_picture
                print('profile_picture',profile_picture)
                return profile_picture
            except:
                DEFAULT_CLIENT_IMAGE = 'default/client_profile.png'
                return DEFAULT_CLIENT_IMAGE 
                
        if self.is_superuser :
            try:    
                profile_picture = AdminProfile.objects.get(id=self.id).profile_picture
                print('profile_picture',profile_picture)
                return profile_picture
            except:
                DEFAULT_ADMIN_IMAGE = 'default/admin_profile.png'
                return DEFAULT_ADMIN_IMAGE 
                
    
    
    from rest_framework_simplejwt.tokens import RefreshToken
    def tokens(self):    
        refresh = RefreshToken.for_user(self)
        return {
            "refresh":str(refresh),
            "access" :str(refresh.access_token)
        }






################################### PROFILE #######################################################################33
class GenderType(models.TextChoices):
    MALE   = 'Male'
    FEMALE = 'Female'
    
    
class ClientProfile(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  
    user            = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='client_profile')
    phone_number    = PhoneNumberField(blank=False, null=True)
    country         = models.CharField(max_length=50, blank=False, null=True)
    address         = models.CharField(max_length=100, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='client_profile_picture/',default='default-profile/client_default.png', blank=True, null=True)
    date_of_birth   = models.DateField(blank=True, null=True)
    gender          = models.CharField(max_length=60, choices=GenderType.choices, default=GenderType.MALE)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    
    def __str__(self):
        # you must use parentheses when calling a function
        return  self.user.get_full_name()
    
    def get_client_full_name(self):
        return f"{self.user.get_full_name()}"
    
    def save(self, *args, **kwargs):
        # Set the Employee ID to be the same as the user ID
        if not self.id:
            self.id = self.user.id 
        # Deletes old profile_picture when making an update to profile_picture
        with contextlib.suppress(Exception):
            old = ClientProfile.objects.get(id=self.id)
            if old.profile_picture != self.profile_picture:
                old.profile_picture.delete(save=False)
        super().save(*args, **kwargs)
    



class AdminProfile(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  
    user            = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='admin_profile')
    phone_number    = PhoneNumberField(blank=False, null=True)
    country         = models.CharField(max_length=50, blank=True, null=True)
    address         = models.CharField(max_length=100, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='admin_profile_picture/',default='default_profile/admin_default.png', blank=True, null=True)
    date_of_birth   = models.DateField(blank=True, null=True)
    gender          = models.CharField(max_length=60, choices=GenderType.choices, default=GenderType.MALE)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)
   
    def __str__(self):
        return  self.user.get_full_name()
    
    def get_client_full_name(self):
        return f"{self.user.get_full_name()}"
    
    def save(self, *args, **kwargs):
        # Set the Employee ID to be the same as the user ID
        if not self.id:
            self.id = self.user.id  
        # Deletes old profile_picture when making an update to profile_picture
        with contextlib.suppress(Exception):
            old = AdminProfile.objects.get(id=self.id)
            if old.profile_picture != self.profile_picture:
                old.profile_picture.delete(save=False)
        super().save(*args, **kwargs) 








# ################################## OTP  - verifiedEmail #############################################33
# otp need to verify user email 
class UserOTP(models.Model):
    user       = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    otp        = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
     
    def __str__(self):
        return f"{self.user.email} - otp code"