from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_str, smart_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.urls import reverse
from django.conf import settings
# DRF
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
# JWT
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
# LOCAL
from .models import  CustomUser, ClientProfile, AdminProfile, UserOTP
from .utils import send_normal_email





############################ Register USER  - contain validation - contain client profiles data ###########################
# create User with Client
class RegisteUserProfileSerializer(serializers.ModelSerializer):
    email          = serializers.EmailField(max_length=None, min_length=None, allow_blank=False)
    first_name     = serializers.CharField(max_length=12, min_length=3, allow_blank=False, trim_whitespace=True)
    last_name      = serializers.CharField(max_length=12, min_length=3, allow_blank=False, trim_whitespace=True)
    password       = serializers.CharField(max_length=68, min_length=6, write_only=True)
    password2      = serializers.CharField(max_length=68, min_length=6, write_only=True)
    client_profile = serializers.SerializerMethodField()
    admin_profile  = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'first_name', 'last_name', 'password', 'password2',
            'client_profile', 'admin_profile', 'is_verifiedEmail', 'is_superuser',
            'is_client', 'is_active', 'is_staff', 'role'
        ]
        extra_kwargs = {
            'password' : {'write_only': True},
            'password2': {'write_only': True},
        }
        read_only_fields = [
            'id', 'is_verifiedEmail', 'client_profile', 'admin_profile',
            'is_superuser', 'is_client', 'is_active', 'is_staff', 'role'
        ]
    
    def get_client_profile(self, obj):
         # user object only has attribute 'client_profile' if the user is a client
        if hasattr(obj, 'client_profile'):
            try:
                cp = obj.client_profile
                return ClientProfileSerializer(cp).data
            except ClientProfile.DoesNotExist:
                return None
        return None
            
        
    def get_admin_profile(self, obj):
        # user object only has attribute 'admin_profile' if the user is an admin
        if obj.is_superuser and hasattr(obj, 'admin_profile'):
            try:
                ap = obj.admin_profile
                return AdminProfileSerializer(ap).data
            except AdminProfile.DoesNotExist:
                return None
        return None
    
    
    def to_representation(self, instance):
        """
        Override the to_representation method to exclude admin_profile if it is None.
        """
        representation = super().to_representation(instance)
        if representation['admin_profile'] is None:
            representation.pop('admin_profile')  # Remove admin_profile from the response
        if representation['client_profile'] is None:
            representation.pop('client_profile')  # Remove client_profile from the response
        return representation
    
     
    def validate(self, attrs):
        print('Validating data:', attrs)
        password = attrs.get('password')
        password2 = attrs.get('password2')
        
        # Check if passwords match
        if password != password2:
            raise serializers.ValidationError("Passwords do not match")
        return attrs


    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("The Email field is required.")
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value
        

    def validate_first_name(self, value):
        """
        Validate that the first_name is not empty.
        """
        if not value:
            raise serializers.ValidationError("The First Name field is required")
        return value

    def validate_last_name(self, value):
        """
        Validate that the last_name is not empty.
        """
        if not value:
            raise serializers.ValidationError("The Last Name field is required")
        return value
     
    def create(self, validated_data):
        print('Creating user with validated_data=', validated_data)
        valid_client_profile_data = validated_data.pop('client_profile', None)
        valid_admin_profile_data  = validated_data.pop('admin_profile', None)
        
        user = CustomUser.objects.create_user(
                                    email      =validated_data['email'],
                                    password   =validated_data['password'],
                                    first_name =validated_data['first_name'],
                                    last_name  =validated_data['last_name']                           
        )
        print("user=",user)
        if valid_client_profile_data:
            if user.is_client:
                ClientProfile.objects.create(user=user, **valid_client_profile_data)
        if valid_admin_profile_data:
            if user.is_superuser:
                AdminProfile.objects.create(user=user, **valid_admin_profile_data)
        return user



########################### Confirm Email BY LINK ###########################
# class ConfirmUserEmailSerializer(serializers.ModelSerializer):
#     token  = serializers.CharField(min_length=1, write_only=True)
#     uidb64 = serializers.CharField(min_length=1, write_only=True)

#     class Meta:
#         model = CustomUser
#         fields = ['token', 'uidb64']
        
   
   
        
        
        
        
 
# login


class LoginUserSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        # email = data.get('email')
        # password = data.get('password')
        # request = self.context.get('request')

        # print("Login attempt:", email)

        user = authenticate(**data) # <-- This calls your backend automatically
        print("LoginUserSerializer user:", user)

        if not user:
            raise serializers.ValidationError("Incorrect credentials.")
        if not user.is_verifiedEmail:
            raise serializers.ValidationError("Email is not verified.")
        if not user.is_active:
            raise serializers.ValidationError("Account is inactive.")

        return user

############################ LOGIN USER - JWT Token Obtain  ###########################
# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer): 

#     def validate(self, attrs):
#         # Let SimpleJWT handle authentication first
#         data = super().validate(attrs)

#         user = self.user

#         if not user.is_verifiedEmail:
#             raise AuthenticationFailed("Email is not verified")
#         if not user.is_active:
#             raise AuthenticationFailed("Email is not active")

#         # Add custom user fields to response
#         data.update({
#             'id'               : user.id,
#             'role'             : user.role,
#             'email'            : user.email,
#             'first_name'       : user.first_name,
#             'last_name'        : user.last_name,
#             'full_name'        : user.get_full_name(),
#             'is_verifiedEmail' : user.is_verifiedEmail,
#             'profile_picture'  : user.profile_picture
#         })

        # return data



    




#####################################   CustomUser  CRUD  ############################################################333
class CustomUserSerializer(serializers.ModelSerializer):
    profile   = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = ['id', 'role','first_name', 'last_name','email','is_verifiedEmail','is_active','date_joined','last_login', 'profile','full_name','is_verifiedEmail']
        read_only_fields = ['id','is_verifiedEmail', 'date_joined', 'last_login',
                           'is_superuser', 'is_active', 'is_staff','is_client', 'is_employee','full_name'
                           ]  

    def get_full_name(self, obj):
        return f"{obj.first_name.title()} {obj.last_name.title()}"
   
    def get_profile(self, obj):  # obj is the user object
        if obj.is_client:
            try:  
                # print(f"Fetching client profile for user: {obj.id}")
                return ClientProfileSerializer(obj.client_profile).data 
            except(ClientProfile.DoesNotExist):
                print(f"Profile does not exist for user")
                return None

        
        if obj.is_superuser:
            try:
                # print(f"Fetching employee profile for user: {obj.id}")
                return AdminProfileSerializer(obj.admin_profile).data
            except(AdminProfile.DoesNotExist):
                print(f"Profile does not exist for user: {obj.id}")
                return None
        
    



################################## Profiles -  Admin - Client ##########################
# dminProfile
class AdminProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = AdminProfile
        exclude = ['user']
        

# ClientProfile
class ClientProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = ClientProfile
        exclude = ['user']


# ClientPublicProfile
class ClientPublicProfileSerializer(ClientProfileSerializer):
    """ Child class that inherit from it's parents and changing Meta class properities """
    class Meta(ClientProfileSerializer.Meta):
        exclude = [
            "date_of_birth","phone_number",
            "address","city","state","country"
        ]





################################## detail user + detail profile ##########################
class RetrieveUserSerializer(serializers.ModelSerializer):
    client_profile = serializers.SerializerMethodField()
    admin_profile = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'is_instructor', 'is_active', 'is_verified', 'created_at', 'student_profile', 'instructor_profile']

    def get_client_profile(self, obj):
        try:
            profile = obj.client_profile
            return ClientProfileSerializer(profile).data
        except ClientProfile.DoesNotExist:
            return None

    def get_admin_profile(self, obj):
        try:
            profile = obj.instructor_profile
            return AdminProfileSerializer(profile).data
        except AdminProfile.DoesNotExist:
            return None






###################################### Authentication-proccess  ####################################################

######## User with user serializer ( user register ) ####################################################
##################################### user Register (for  client and admin profile)###########################################333

    







### OTP-for verified email ###########
# class UserOTPSerializer(serializers.ModelSerializer):
#     otp = serializers.CharField(max_length=6, write_only=True)

#     class Meta:
#         model=UserOTP
#         fields = ['otp']
    
#     def validate_otp(self, value):
#         if value is None:
#             raise serializers.ValidationError("The otp field is required") 
#         return value
    





### logout ###########  used if we want to add token to blacklist using this serializer 
class LogoutSerializer(serializers.Serializer):
    refresh_token = serializers.CharField(
                                    write_only=True,
                                    required=True,
                                    error_messages={
                                        "message": "Refresh token cannot be empty.",
                                    },
    )

    default_error_messages = {
        'bad_token': 'Token is expired or invalid'
    }

    def validate(self, attrs):
        self.token = attrs.get('refresh_token')
        return attrs

    def save(self, **kwargs):
        try:
            token = RefreshToken(self.token)
            print('token will blacklist inside LogoutUserSerializer=',token)
            token.blacklist()
            return {"message": "You have been logged out successfully."}
        
        except TokenError as e:
            # Log the error if needed
            print(f"TokenError: {str(e)}")
            self.fail('bad_token')
#####################################################################################################################3
    







        
#  we will use this user serializer in project reviews list page 
class SimplifiedUserSerializer(serializers.ModelSerializer):
    profile   = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model =  CustomUser
        fields = ['id', 'email', 'full_name', 'profile']

    def get_profile(self, obj):
        return CustomUserSerializer.get_profile(self, obj)  # Reuse the logic from UserSerializer

    def get_full_name(self, obj):
        return CustomUserSerializer.get_full_name(self, obj)
    
        
            
        
        
        
##########  update user ptrofile BY REQUEST USER #######################
class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'is_verifiedEmail', 'email', 'is_active', 'is_superuser', 'is_staff', 'role']
        read_only_fields = ('email', 'is_superuser', 'is_staff', 'role')

        def update(self, instance, validated_data): # work ok 
            print('validated_data=',validated_data)
            instance.first_name = validated_data.get('first_name', instance.first_name)
            instance.last_name  = validated_data.get('last_name', instance.last_name)
            instance.is_verifiedEmail  = validated_data.get('is_verifiedEmail', instance.is_verifiedEmail)
            instance.is_active  = validated_data.get('is_active', instance.is_active)
            instance.save()
            user = CustomUser(instance)
            user.save()
            # return user  
            return super().update(instance, validated_data)  
      
 
 




class UpdateClientProfileSerializer(serializers.ModelSerializer):
    user = UpdateUserSerializer(required=True,many=False)
    class Meta:
        model = ClientProfile
        fields = ['user', 'date_of_birth','gender','phone_number','country', 'address','profile_picture']  # replace 'other_profile_fields' with actual fields from EmployeeProfile model

    def update(self, instance, validated_data):
        print('validated_data',validated_data)
        user_data = validated_data.pop('user', None)
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                if attr in ['first_name', 'last_name']:
                    setattr(user, attr, value)
            user.save()
        return super().update(instance, validated_data)       
       
       


class UpdateAdminProfileSerializer(serializers.ModelSerializer):
    user = UpdateUserSerializer(required=True)
    class Meta:
        model = AdminProfile
        fields = ['user','date_of_birth','gender','phone_number','country', 'address','profile_picture']  # replace 'other_profile_fields' with actual fields from EmployeeProfile model

    def update(self, instance, validated_data): # Update AdminProfile fields + User fields
        print('validated_data=',validated_data)
        user_data = validated_data.pop('user', None)
        # updae User fields -- not work because user data_data = None !
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                if attr in ['first_name','last_name']:
                    setattr(user, attr, value)
            user.save()
        return super().update(instance, validated_data)
###########################################################################################################################





class ClientProfileSerializer(serializers.ModelSerializer):
    user = UpdateUserSerializer()
   
    class Meta:
        model = ClientProfile 
        exclude = ['user']
    
    def validate_phone_number(value):
        if not value :
            raise serializers.ValidationError("phone_number field is required")
        return value
    class Meta:
        model = ClientProfile
        fields = ['user', 'date_of_birth','gender','phone_number','country', 'address','profile_picture']  # replace 'other_profile_fields' with actual fields from EmployeeProfile model

class AdminProfileSerializer(serializers.ModelSerializer):
    user = UpdateUserSerializer() 
    
    
    def validate_phone_number(value):
        if not value :
            raise serializers.ValidationError("phone_number field is required")
        return value    
    
    class Meta:
        model = AdminProfile
        fields = ['user', 'date_of_birth','gender','phone_number','country', 'address','profile_picture']  # replace 'other_profile_fields' with actual fields from EmployeeProfile model
    
##################################################################          


















###################################### Forget password Services // you need to reset your password ####################################################333
### 1- Password Reset Request ########### // send password reset request as a link to the user email
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=None, min_length=None, allow_blank=False)

    class Meta:
        fields = ['email']

    def validate(self, attrs):   
        email = attrs.get('email')
        if CustomUser.objects.filter(email=email).exists():
            user= CustomUser.objects.get(email=email)
            # uidb64
            uidb64=urlsafe_base64_encode(smart_bytes(user.id))
            # token
            token = PasswordResetTokenGenerator().make_token(user)
            # current site domain 
            request=self.context.get('request')
            # current_site=get_current_site(request).domain
            current_site = settings.FRONTEND_DOMAIN
            print('current_site',current_site)
            # relative_link // endpoint
            relative_link =reverse('users:password-reset-confirm', kwargs={'uidb64':uidb64, 'token':token})
            print('relative_link',relative_link)
            abslink=f"http://{current_site}{relative_link}"
            print('abslink',abslink)
            email_body=f"Hi {user.first_name} use the link below to reset your password {abslink}"
            data={
                'email_body':email_body, 
                'email_subject':"Reset your Password", 
                'to_email':user.email
                }
            send_normal_email(data)

        return super().validate(attrs)

    
### 2- password reset confirm ###### no need serializer
    
### 3- Set New Password ###########   
class SetNewPasswordSerializer(serializers.Serializer):
    password=serializers.CharField(max_length=100, min_length=6, write_only=True)
    confirm_password=serializers.CharField(max_length=100, min_length=6, write_only=True)
    uidb64=serializers.CharField(min_length=1, write_only=True)
    token=serializers.CharField(min_length=3, write_only=True)

    class Meta:
        fields = ['password', 'confirm_password', 'uidb64', 'token']

    def validate(self, attrs):
        try:
            token=attrs.get('token')
            # print("SetNewPasswordSerializer- token=",token)
            uidb64=attrs.get('uidb64')
            # print("SetNewPasswordSerializer- uidb64=",uidb64)
            password=attrs.get('password')
            # print("SetNewPasswordSerializer- password=",password)
            confirm_password=attrs.get('confirm_password')
            # print("SetNewPasswordSerializer- confirm_password=",confirm_password)
            
            user_id=force_str(urlsafe_base64_decode(uidb64))
            user=CustomUser.objects.get(id=user_id)
            # print("SetNewPasswordSerializer- user=",user)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed("reset link is invalid or has expired", 401)
            if password != confirm_password:
                raise AuthenticationFailed("passwords do not match")
            
            user.set_password(password)
            user.save()
            return user
        
        except Exception as e:
            return AuthenticationFailed("link is invalid or has expired")




    

###################################### Change password Services  ####################################################333
### Change Password ###########    
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    
    def validate_new_password(self, value):
        # Validate the password meets strength requirements
        validate_password(value)
        return value

    def validate_old_password(self, value):
        print("self.context",self.context)
        user = self.context['request'].user
        # Check if the old password matches the current password of the user
        if not check_password(value, user.password):
            raise serializers.ValidationError("Old password does not match.")
        return value
    
    def validate(self, data):
        old_password = data.get('old_password', None)
        new_password = data.get('new_password', None)

        if old_password and new_password and old_password == new_password:
            raise serializers.ValidationError("New password cannot be the same as old password.")

        return data

    



# class InstructorSkillSerializer(serializers.ModelSerializer):
#     instructor = serializers.StringRelatedField()
    
#     class Meta:
#         model = InstructorSkill
#         fields = "__all__"


# class SkillCertificationSerializer(serializers.ModelSerializer):
#     instructor = serializers.SerializerMethodField()
    
#     def get_instructor(self, obj):
#         return obj.skill.instructor.user.email  
    
#     class Meta:
#         model = SkillCertification
#         fields = "__all__"
        
        
        
        
      
# class ConfirmPhoneNumberSerializer(serializers.ModelSerializer):
#     number = serializers.CharField(max_length=6, required=True,
#                                     validators=[MinValueValidator(100000),
#                                                 MaxValueValidator(999999)])
#     def validate_number(self, value):
#         if not value.isdigit():
#             raise serializers.ValidationError("Number must be a string of digits.")
  
#         # Retrieve the SMSCode instance for the authenticated user
#         sms_code = SMSCode.objects.filter(user=self.context['request'].user).first()
#         if not sms_code:
#             raise serializers.ValidationError("No SMS verification code found for this user.")
        
#         # Compare the user-provided number with the number in the SMSCode instance
#         if value != sms_code.number:
#             raise serializers.ValidationError("Incorrect SMS verification code.")
        
#         return value
        
#     class Meta:
#         model = SMSCode
#         fields = ['number']
        
        






 

# class InstructorProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = InstructorProfile
#         exclude = ['user']

# class InstructorPublicProfileSerializer(InstructorProfileSerializer):
#     """ Child class that inherit from it's parents and changing Meta class properities """
#     class Meta(InstructorProfileSerializer.Meta):
#         exclude = [
#             "date_of_birth","phone_number",
#             "address","city","state","country"
        # ]  
    