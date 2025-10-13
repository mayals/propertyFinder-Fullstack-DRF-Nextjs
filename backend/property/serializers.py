from rest_framework import serializers
from .models import  Country,City,PropertyMainType,PropertySubTypes,PropertyPurpose,Amenity,Property,PropertyImage
from rest_framework.validators import UniqueValidator




# Country #######################################################################3
class CountrySerializer(serializers.ModelSerializer):
    
    country_name  = serializers.CharField(required=True, 
                                    max_length=100,
                                    help_text='Country name must be unique.',
                                    style={'placeholder': 'Country name here...'},
                                    validators=[UniqueValidator(queryset=Country.objects.all())]
                                    )                   
    
    code =  serializers.CharField(required=True, 
                                    max_length=2,
                                    help_text='ISO code like "SA", "AE"',
                                    style={'placeholder': 'ISO code name here...'},
                                    validators=[UniqueValidator(queryset=Country.objects.all())]
                                    )                   
    # cities group(objects) belong to this country - comes from City table - read only field
    cities = serializers.SlugRelatedField(
                                    many=True,
                                    read_only=True,
                                    slug_field='city_name'
                                    )
    
    class Meta:
        model = Country
        fields = ['id', 'country_name', 'code', 'country_slug', 'cities']
        read_only_fields = ('id', 'country_slug', 'cities', )

    
    
    def validate_country_name(self, value):
        if not value:
            raise serializers.ValidationError("Country name is required.")
        if Country.objects.filter(country_name=value).exists():
            raise serializers.ValidationError("This Country is already added.")
        return value
        

    def validate_code(self, value):
        """
        Validate that the code is not empty.
        """
        if not value:
            raise serializers.ValidationError("The Country code is required")
        return value





class UpdateCountrySerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(required=True, 
                                    max_length=100,
                                    help_text='Country name must be unique.',
                                    validators=[UniqueValidator(queryset=Country.objects.all())]
                                    )                   
    code = serializers.CharField(required=True, 
                                    max_length=3,
                                    help_text='IOS Code must be unique.',
                                    validators=[UniqueValidator(queryset=Country.objects.all())]
                                    ) 
    
    class Meta:
        model = Country
        fields = ['id', 'country_name', 'code']
        read_only_fields = ('id', 'country_slug', 'cities', )






# City ##################################################################
class CitySerializer(serializers.ModelSerializer):
    country = serializers.PrimaryKeyRelatedField(
        queryset=Country.objects.all(),
        help_text='Select a Country id for this city.'
    )
    city_name = serializers.CharField(
        required=True,
        max_length=100,
        help_text='City name must be unique.',
        style={'placeholder': 'City name here...'},
        validators=[UniqueValidator(queryset=City.objects.all())]
    )

    class Meta:
        model = City
        fields = ['id', 'city_name', 'city_slug', 'country']
        read_only_fields = ('id', 'city_slug',)

    def validate(self, attrs):
        """Validate uniqueness of city within the selected country."""
        city_name = attrs.get("city_name")
        country = attrs.get("country")

        if not city_name:
            raise serializers.ValidationError({"city_name": "City name is required."})
        if not country:
            raise serializers.ValidationError({"country": "The selected Country is required."})

        # Check if this city already exists under the same country
        if City.objects.filter(city_name__iexact=city_name, country=country).exists():
            raise serializers.ValidationError({
                "city_name": f"The city '{city_name}' already exists in {country.country_name}."
            })
        return attrs


       




class UpdateCitySerializer(serializers.ModelSerializer):
    
    city_name  = serializers.CharField(required=True, 
                                    max_length=100,
                                    help_text='City name must be unique.',
                                    style={'placeholder': 'City name here...'},
                                    validators=[UniqueValidator(queryset=City.objects.all())]
                                    )
    
    class Meta:
        model = City
        fields = ['id', 'city_name']
        read_only_fields = ('id',)
        
       
        
# PropertyMainType ##################################################################
class PropertyMainTypeSerializer(serializers.ModelSerializer):
    maintype_label = serializers.CharField(source='get_maintype_name_display', read_only=True)
    class Meta:
        model = PropertyMainType
        fields = ['id', 'created_at', 'updated_at', 'maintype_name', 'maintype_label']
        read_only_fields = ('id', 'created_at', 'updated_at', 'maintype_label',)



# PropertySubTypes ##################################################################
class PropertySubTypesSerializer(serializers.ModelSerializer):
    # must select the primary key of main_type - main_type id - before insert subtype_name
    main_type = serializers.PrimaryKeyRelatedField(
                                        queryset=PropertyMainType.objects.all(),
                                        help_text='Select a property main_type id for this sub type.'
                                        )
    subtype_name = serializers.CharField(required=True, 
                                    max_length=100,
                                    help_text='property sub type name must be unique.',
                                    style={'placeholder': 'sub type name here...'},
                                    validators=[UniqueValidator(queryset=PropertySubTypes.objects.all())]
                                    )
    class Meta:
        model = PropertySubTypes
        fields = ['id', 'created_at', 'updated_at', 'main_type','subtype_name']
        read_only_fields = ('id', 'created_at', 'updated_at',)





PropertyPurpose ##################################################################
class PropertyPurposeSerializer(serializers.ModelSerializer):
     
    class Meta:
        model = PropertyPurpose
        fields = ['id', 'created_at', 'updated_at', 'purpose_name' ]
        read_only_fields = ('id', 'created_at', 'updated_at',)





# Amenity ##################################################################
class AmenitySerializer(serializers.ModelSerializer):
    
    amenity_name  = serializers.CharField(required=True, 
                                    max_length=100,
                                    help_text='Amenity name must be unique.',
                                    style={'placeholder': 'Amenity name here...'},
                                    validators=[UniqueValidator(queryset=Amenity.objects.all())]
                                    )
    class Meta:
            model = Amenity
            fields = ['id', 'amenity_name']
            read_only_fields = ('id', 'created_at', 'updated_at',)








####################################################################################################################################

## CREATE PROPERTY  way-1 ##################################################################################################################################
#  add images to property selected of params property.id
class PropertyImageSerializer(serializers.ModelSerializer):
    images = serializers.ImageField()

    class Meta:
        model = PropertyImage
        fields = ["id", "images"]

    def create(self, validated_data):
        # Get the property from the context
        property_obj = self.context.get("property")
        if not property_obj:
            raise serializers.ValidationError("Property is required to upload images.")

        # Handle multiple files
        request = self.context.get("request")
        files = request.FILES.getlist("images") if request else None

        if files:
            images = [PropertyImage.objects.create(property=property_obj, images=file) for file in files]
            return images

        # Single image fallback
        return PropertyImage.objects.create(property=property_obj, **validated_data)

    def to_representation(self, instance):
        request = self.context.get("request")
        representation = super().to_representation(instance)
        if request and instance.images:
            representation["images"] = request.build_absolute_uri(instance.images.url)
        return representation
    
    





# Creater Property data #######  if we want to create new property with 1 step(data form only-first form) - and at 2step(images form only-second next form)  ###########################################
class PropertySerializer(serializers.ModelSerializer):
    title = serializers.CharField(
                                    max_length=200,
                                    required=True,
                                    allow_blank=False,
                                    validators=[UniqueValidator(queryset=Property.objects.all())]
    )
    images = PropertyImageSerializer(many=True, read_only=True) # to get images with response.data
    
    
    class Meta:
        model = Property
        fields = [
            'id', 'owner', 'title', 'description', 'country', 'city', 'area',
            'district', 'plot_number', 'land_number', 'address_detail',
            'latitude', 'longitude', 'is_occupied', 'available_from',
            'pmain_type','psub_type', 'purpose', 'property_size',
            'bedrooms', 'bathrooms', 'plot_length', 'plot_width', 'street_width',
            'facade', 'property_age', 'amenities', 'price', 'currency',
            'furnishing', 'category', 'is_published','images'
        ]
        read_only_fields = ['id', 'is_published', 'owner']  # 👈 add 'owner' here because it come from backend -- request.user -- serializer.save(owner=self.request.user) in view.py

    
    def validate_title(self, value):
        if not value:
            raise serializers.ValidationError("The Property title is required")
        if Property.objects.filter(title=value).exists():
            raise serializers.ValidationError("The Property title must be unique")
        return value
    
    
    
    











## CREATE PROPERTY  way-2 ##################################################################################################################################
 
# Property #######################  if we want to create new property with (data + images) in the same form - at one step  ###########################################
####################### not applied this type of form

# PropertyImage ##################################################################
# class PropertyImageSerializer(serializers.ModelSerializer): 
#     # must select the primary key of property id - before insert an image for it
#     property = serializers.PrimaryKeyRelatedField(
#                                         queryset=Property.objects.all(),
#                                         help_text='Select a property id for this image.'
#                                         )
#     class Meta:
#         model = PropertyImage
#         fields = ['id','property','images','uploaded_at']




# class PropertySerializer(serializers.ModelSerializer):
#     title            = serializers.CharField(max_length=200, min_length=None,required=True, allow_blank=False,validators=[UniqueValidator(queryset=Property.objects.all())])
#     images_Property  = PropertyImageSerializer(many=True,read_only=True)                                     
#     uploaded_images = serializers.ListField(child = serializers.ImageField(max_length = 1000000, allow_empty_file = False, use_url = False), write_only=True)
     
#     class Meta:
#         model = Property
#         fields = ['id','owner','title','description','country','city','area',
#                   'district','plot_number','land_number','address_detail',
#                   ' latitude','longitude','is_occupied','available_from',
#                   'psub_type','purpose','property_size',
#                   'bedrooms','bathrooms','plot_length','plot_width','street_width',
#                   'facade','property_age','amenities','price','currency','furnishing',
#                   'category']
                  
#         read_only_fields = ['id', 'images_project', 'created_at', 'updated_at']
#         write_only_fields = ['uploaded_images']                   
    
#     def validate_title(self, value):
#         print('value in serializer=',value)
#         if value is None  or value == "" :
#             raise serializers.ValidationError("The Property's title is required") 
#         if Property.objects.filter(name=value).exists():
#             raise serializers.ValidationError("The Property's title must be unique")     
#         print('value of validated title =',value)
#         return value
   
    
#     def validate_uploaded_images(self, value):
#         allowed_extensions = ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'webp', 'tiff']
#         if not value.name.split('.')[-1].lower() in allowed_extensions:
#             raise serializers.ValidationError("Invalid file extension. Allowed extensions are: bmp, gif, jpg, jpeg, png, webp, tiff.")
#         return value
    
    
#     def create(self,validated_data):
#         print('validated_data in serializer=',validated_data) 
#         uploaded_images = validated_data.pop('uploaded_images', [])
#         print('uploaded_images in serializer=',uploaded_images) 
#         property = Property.objects.create(**validated_data)
#         for image in uploaded_images:
#             PropertyImage.objects.create(property=property, images=image)
#         return property



