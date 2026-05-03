from django import forms

class ContactForm(forms.Form):
    # Basic contact information
    full_name = forms.CharField(
        max_length=100,
        label="Full Name",
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'John Doe'})
    )

    email = forms.EmailField(
        label="Email Address",
        widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'john@example.com'})
    )

    mobile = forms.CharField(
        max_length=20,
        label="Mobile Number",
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': '+1 555 123 4567'})
    )

    whatsapp = forms.CharField(
        max_length=20,
        label="WhatsApp Number",
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': '+1 555 123 4567'})
    )

    country_code = forms.CharField(
        max_length=5,
        label="Country Code",
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': '+1'})
    )

    # Reason selection (radio buttons)
    REASON_CHOICES = [
        ('general', 'General Inquiry'),
        ('property', 'Property Listing Inquiry'),
        ('rental', 'Rental Inquiry'),
        ('other', 'Other'),
    ]

    reason = forms.ChoiceField(
        choices=REASON_CHOICES,
        label="Reason for Contact",
        widget=forms.RadioSelect(attrs={'class': 'form-check-input'})
    )

    # Additional information
    subject = forms.CharField(
        max_length=200,
        label="Subject of Inquiry",
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Property Search Help'})
    )

    message = forms.CharField(
        max_length=2000,
        label="Message to Property Finder Team",
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 5,
            'placeholder': 'I would like to know more about available properties in Chicago...'
        })
    )