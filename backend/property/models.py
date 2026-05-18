import uuid
from django.db import models
from django.conf import settings
from django.utils.text import slugify


# Country model #######################
from django.db import models
from django.utils.text import slugify

class Country(models.Model):
    country_name = models.CharField(max_length=100, null=True, unique=True)
    code = models.CharField(max_length=3, unique=True)  # ISO code like "SA", "AE"
    country_slug = models.SlugField(max_length=10, blank=True, null=True, unique=True)

    class Meta:
        verbose_name_plural = "Countries"

    def __str__(self):
        return self.country_name

    def save(self, *args, **kwargs):
        if not self.country_slug:
            # make sure slug is lowercase and unique
            self.country_slug = slugify(self.code.lower())
        super().save(*args, **kwargs)

    

# City model #######################
class City(models.Model):
    city_name = models.CharField(max_length=50, null=True, unique=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name="cities")
    city_slug = models.SlugField(max_length=100, blank=True, null=True, unique=True)

    class Meta:
        verbose_name_plural = "Cities"

    def __str__(self):
        return f"{self.city_name}, {self.country.code}"

    def save(self, *args, **kwargs):
        if not self.city_slug:
            self.city_slug = slugify(self.city_name.lower())
        super().save(*args, **kwargs)

    



# Property main type model ###############3
class PropertyMainType(models.Model):
    PROPERTY_MAIN_TYPE_CHOICES = [
        ("residential", "Residential"),
        ("commercial", "Commercial"),
    ]

    maintype_name = models.CharField(
        max_length=20,
        choices=PROPERTY_MAIN_TYPE_CHOICES,
        unique=True,
        blank=False
    )
    maintype_slug = models.SlugField(max_length=30, blank=True, null=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.maintype_name

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.maintype_slug:
            # make sure slug is lowercase and unique
            self.maintype_slug = slugify(self.maintype_name.lower())
        super().save(*args, **kwargs)
    
    
    #  This data will insert in database for PropertyMainType model 
    # ("residential_type", "Residential"),
    # ("commercial_type" , "Commercial"),
     
        

# Property sub type model ########################
class PropertySubTypes(models.Model):
    subtype_name = models.CharField(max_length=100, blank=False, null=False, unique=True)
    main_type    = models.ForeignKey(PropertyMainType, on_delete=models.CASCADE, null=True, related_name='subtypes')
    created_at   = models.DateTimeField(auto_now_add=True, null=True)
    updated_at   = models.DateTimeField(auto_now=True, null=True)
    
    def __str__(self):
        return self.subtype_name   
    class Meta:
       ordering = ['-created_at']
       
       
       
    #  This data will insert in database for PropertySubTypes model 
    
    # ("apartment", "Apartment"),
    # ("villa", "Villa"),
    # ("farm", "Farm"),
    # ("rest_house", "Rest House"),
    # ("compound", "Compound"),
    # ("duplex", "Duplex"),
    # ("whole_building", "Whole Building"),
    # ("hotel_apartment", "Hotel / Hotel Apartment"),
    # ("full_floor", "Full Floor"),

    # # Commercial
    # ("office_space", "Office Space"),
    # ("retail", "Retail"),
    # ("warehouse", "Warehouse"),
    # ("showroom", "Show Room"),
    # ("bulk_units", "Bulk Units"),
    # ("factory", "Factory"),
    # ("labor_camp", "Labor Camp"),
    # ("staff_accommodation", "Staff Accommodation"),
    # ("shop", "Shop"),
    # ("land", "Land"),
   


# Property Purpose model ########################
class PropertyPurpose(models.Model):
    PROPERTY_PURPOSE_CHOICES = [
        ("sale", "Sale"),
        ("rent", "Rent"),
    ]

    purpose_name = models.CharField(
        max_length=100,
        choices=PROPERTY_PURPOSE_CHOICES,
        unique=True,
        blank=False,
        null=False
    )
    purpose_slug = models.SlugField(max_length=50, unique=True, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.purpose_name

    def save(self, *args, **kwargs):
        if not self.purpose_slug:
            # Example: purpose_name="Sale" → slug="sale"
            self.purpose_slug = slugify(self.purpose_name.lower())
        super().save(*args, **kwargs)

    

    # Residential for sale
    # Residential for rent
    # Commercial for sale
    # Commercial for rent










# Amenity model #######################
class Amenity(models.Model):
    """Predefined amenities (e.g., Parking, Balcony, Pool ,gym,Electricity,Waters,Sanitation,Fixed Phone..)."""
    amenity_name    = models.CharField(max_length=100, unique=True)
    created_at      = models.DateTimeField(auto_now_add=True, null=True)
    updated_at      = models.DateTimeField(auto_now=True, null=True)
        
    def __str__(self):
        return self.amenity_name
    class Meta:
       ordering = ['-created_at']
    # This data will insert in database for Amenity model   
    # Electricity
    # Waters
    # Sanitation
    # Fixed Phone





# Property model #######################
class Property(models.Model):
    
    FURNISHING_CHOICES = [
        ("furnished", "Furnished"),
        ("unfurnished", "Unfurnished"),
        ("partly", "Partly Furnished"),
    ]

    FACADE_CHOICES = [
        ("north", "North"),
        ("south", "South"),
        ("east", "East"),
        ("west", "West"),
    ]

    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner       = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="properties" )# can be Admin, Broker, agent or Developer 
    title       = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
     
    # Location
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True)
    area = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    plot_number = models.CharField(max_length=50, blank=True, null=True)
    land_number = models.CharField(max_length=50, blank=True, null=True)
    address_detail = models.CharField(max_length=255, blank=True, null=True)
    
    # on google map location
    latitude = models.DecimalField(max_digits=25, decimal_places=18, null=True, blank=True)
    longitude = models.DecimalField(max_digits=25, decimal_places=18, null=True, blank=True)

    # Status
    is_occupied = models.BooleanField(default=False)
    available_from = models.DateField(blank=True, null=True)
    
    # Property details
    pmain_type   = models.ForeignKey(PropertyMainType,on_delete=models.CASCADE, null=True, related_name='properties')
    psub_type    = models.ForeignKey(PropertySubTypes,on_delete=models.CASCADE, null=True, related_name='properties')  # e.g., Apartment, Villa, Office
    purpose     = models.ForeignKey(PropertyPurpose,on_delete=models.CASCADE, null=True, related_name='properties')
    
    property_size = models.DecimalField(max_digits=10, decimal_places=2, help_text="Size in sqm")
    bedrooms = models.IntegerField(blank=True, null=True)
    bathrooms = models.IntegerField(blank=True, null=True)
    plot_length = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    plot_width = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    street_width = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    facade = models.CharField(max_length=10, choices=FACADE_CHOICES, blank=True, null=True)
    property_age = models.IntegerField(blank=False, null=True, help_text="Age in years")
    # 
    amenities = models.ManyToManyField(Amenity, blank=True)
    
    # Pricing
    price = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default="SAR")
    
    # Furnishing
    furnishing = models.CharField(max_length=20, choices=FURNISHING_CHOICES, default="unfurnished")

    # Read only field
    category    = models.CharField(max_length=100, blank=True, null=True)  # e.g., "Commercial for rent" -- read only field
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    #  to manage displaying the property or not.
    is_published = models.BooleanField(null=True, default=False)
    
    def __str__(self):
        return f"{self.title} - {self.city}"


    def save(self, *args, **kwargs):
        if self.pmain_type and self.purpose:
            self.category = f"{self.pmain_type.maintype_name.capitalize()} for {self.purpose.purpose_name}"
        super().save(*args, **kwargs)






# PropertyImage model #######################
class PropertyImage(models.Model):
    """
    Multiple images per property
    """
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="images")
    images = models.ImageField(upload_to="property_images/%Y/%m/%d/", null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.images)


    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Always mark property as published when an image is uploaded
        if self.property and not self.property.is_published:
            self.property.is_published = True
            self.property.save(update_fields=["is_published"])




class PropertyLike(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "property")


class Message(models.Model):
    """
    In-app messaging between users (buyer, broker, agent, developer, admin).
    Messages can be linked to a property for context.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name="sent_messages"
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name="received_messages"
    )
    property = models.ForeignKey(
        Property, on_delete=models.SET_NULL,
        null=True, blank=True, related_name="messages"
    )
    subject = models.CharField(max_length=255)
    body = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"From {self.sender} to {self.receiver} - {self.subject}"



#  Another way of coding 
# class Amenity(models.Model):
#     """
#     Extra features (e.g., parking, pool, gym)
#     """
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     name = models.CharField(max_length=100, unique=True)

#     def __str__(self):
#         return self.name


# class PropertyAmenity(models.Model):
#     """
#     M2M table between Property and Amenity
#     """
#     property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="property_amenities")
#     amenity = models.ForeignKey(Amenity, on_delete=models.CASCADE)

#     class Meta:
#         unique_together = ("property", "amenity")






class NewProject(models.Model):
    
    PROJECT_MAIN_TYPE_CHOICES = [
        ("residential", "Residential"),
        ("commercial", "Commercial"),
        ("mixed_use", "Mixed Use"),
    ]
    
    HAND_OVER_YEAR_QUARTER_CHOICES = [
        ("Q1", "Q1"),
        ("Q2", "Q2"),
        ("Q3", "Q3"),
        ("Q4", "Q4"),
    ]
    STATUS_DETAIL = [
        ("ready_to_move", "Ready to Move"),
        ("under_construction", "Under Construction"),
        ("off_plan", "Off Plan"),
        ("completed", "Completed"),
        ("handed_over", "Handed Over"),
        ("launching_soon", "Launching Soon")
    ]

    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user         = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="new_projects")# can be Admin, Broker, agent or Developer 
    nproj_name    = models.CharField(max_length=255, blank=False , unique=True)
    description  = models.TextField(blank=False, null=True)
    nproj_main_type = models.CharField(max_length=225, choices=PROJECT_MAIN_TYPE_CHOICES, blank=False, null=True)
    nproj_main_type_slug = models.SlugField(max_length=30, blank=True, null=True)
    
    # PROJECT_Location
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, blank=False, null=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    address_detail = models.CharField(max_length=255, blank=True, null=True)
    
    full_area = models.DecimalField(max_digits=10, decimal_places=2, help_text="Size in sqm")
    units = models.IntegerField(blank=True, null=True)
    
    # on google map location
    latitude = models.DecimalField(max_digits=25, decimal_places=18, null=True, blank=True)
    longitude = models.DecimalField(max_digits=25, decimal_places=18, null=True, blank=True)

    # Status
    hand_over_year = models.DateField(blank=True, null=True)
    hand_over_year_quarter = models.CharField(max_length=20, choices=HAND_OVER_YEAR_QUARTER_CHOICES, blank=False, null=True)
    status_detail = models.CharField(max_length=20, choices=STATUS_DETAIL, blank=False, null=True) 
   
    # Property details
    amenities = models.ManyToManyField(Amenity, blank=False, null=True)
    
    # Pricing
    lunch_price = models.DecimalField(max_digits=12, decimal_places=2)
    currency    = models.CharField(max_length=10, default="SAR")

    # Read only field
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # to manage displaying the property or not.
    is_published = models.BooleanField(null=True, default=False)
    
    def __str__(self):
        return f"{self.nproj_name} - {self.city}"

    def save(self, *args, **kwargs):
        if not self.nproj_main_type_slug:
            # make sure slug is lowercase and unique
            self.nproj_main_type_slug = slugify(self.nproj_main_type.lower())
        super().save(*args, **kwargs)
    




class NewProjectImage(models.Model):
    """
    Multiple images per project
    """
    new_project = models.ForeignKey(NewProject, on_delete=models.CASCADE, related_name="new_project_images")
    images = models.ImageField(upload_to="new_project_images/%Y/%m/%d/", null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.images)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Always mark new project as published when an image is uploaded
        if self.new_project and not self.new_project.is_published:
            self.new_project.is_published = True
            self.new_project.save(update_fields=["is_published"])
    



class NewProjectVideo(models.Model):
    """
    Multiple videos per project
    """
    new_project = models.ForeignKey(NewProject, on_delete=models.CASCADE, related_name="new_project_videos")
    video = models.FileField(upload_to="project_videos/%Y/%m/%d/", null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.video)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Always mark new project as published when an image is uploaded
        if self.new_project and not self.new_project.is_published:
            self.new_project.is_published = True
            self.new_project.save(update_fields=["is_published"])