from rest_framework import serializers
from .models import  Country,City,PropertyMainType,PropertySubTypes,PropertyPurposeSubChoices,Amenity,Property,PropertyImage
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
        fields = ['id', 'country_name', 'code', 'cities']
        read_only_fields = ('id','cities', )

    
    
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
        fields = ('id', 'country_name', 'code')
        read_only_fields = ['id']  






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
        fields = ['id', 'city_name', 'country']
        read_only_fields = ('id',)

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
    class Meta:
        model = PropertyMainType
        fields = ['id', 'created_at', 'updated_at', 'maintype_name']
        read_only_fields = ('id', 'created_at', 'updated_at',)



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


# PropertyPurposeSubChoices ##################################################################
class PropertySubTypesSerializer(serializers.ModelSerializer):
    # must select the primary key of main_type - main_type id - before insert subtype_name
    main_type = serializers.PrimaryKeyRelatedField(
                                        queryset=PropertyMainType.objects.all(),
                                        help_text='Select a property main_type id for this sub type.'
                                        )
     
    class Meta:
        model = PropertyMainType
        fields = ['id', 'created_at', 'updated_at', 'main_type', 'purpose_sub_choice_name' ]
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





# PropertyImage ##################################################################
class PropertyImageSerializer(serializers.ModelSerializer): 
    # must select the primary key of property id - before insert an image for it
    property = serializers.PrimaryKeyRelatedField(
                                        queryset=Property.objects.all(),
                                        help_text='Select a property id for this image.'
                                        )
    class Meta:
        model = PropertyImage
        fields = ['id','property','images','uploaded_at']




# Property ##################################################################
class PropertySerializer(serializers.ModelSerializer):
    title            = serializers.CharField(max_length=200, min_length=None,required=True, allow_blank=False,validators=[UniqueValidator(queryset=Property.objects.all())])
    images_Property  = PropertyImageSerializer(many=True,read_only=True)                                     
    uploaded_images = serializers.ListField(child = serializers.ImageField(max_length = 1000000, allow_empty_file = False, use_url = False), write_only=True)
     
    class Meta:
        model = Property
        fields = ['id','owner','title','description','country','city','Area',
                  'district','plot_number','land_number','address_detail',
                  ' latitude','longitude','is_occupied','available_from',
                  'psub_type','purpose','property_size',
                  'bedrooms','bathrooms','plot_length','plot_width','street_width',
                  'facade','property_age','amenities','price','currency','furnishing',
                  'category']
                  
        read_only_fields = ['id', 'images_project', 'created_at', 'updated_at', 'ratings_count', 'average_ratings']
        write_only_fields = ['uploaded_images', 'uploaded_images']                   
    
    def validate_title(self, value):
        print('value in serializer=',value)
        if value is None  or value == "" :
            raise serializers.ValidationError("The Property's title is required") 
        if Property.objects.filter(name=value).exists():
            raise serializers.ValidationError("The Property's title must be unique")     
        print('value of validated title =',value)
        return value
   
    
    def validate_uploaded_images(self, value):
        allowed_extensions = ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'webp', 'tiff']
        if not value.name.split('.')[-1].lower() in allowed_extensions:
            raise serializers.ValidationError("Invalid file extension. Allowed extensions are: bmp, gif, jpg, jpeg, png, webp, tiff.")
        return value
    
    
    def create(self,validated_data):
        print('validated_data in serializer=',validated_data) 
        uploaded_images = validated_data.pop('uploaded_images', [])
        print('uploaded_images in serializer=',uploaded_images) 
        property = Property.objects.create(**validated_data)
        for image in uploaded_images:
            PropertyImage.objects.create(property=property, images=image)
        return property



