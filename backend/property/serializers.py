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
    # cities group(objects) belong to this country - comes from City table
    cities = serializers.SlugRelatedField(
                                    many=True,
                                    read_only=True,
                                    slug_field='city_name'
                                    )
    
    class Meta:
        model = Country
        fields = ['id', 'country_name', 'code']
        read_only_fields = ('id','cities', )




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
    # must select the primary key of country - Country id - before insert city_name
    country = serializers.PrimaryKeyRelatedField(
                                        queryset=Country.objects.all(),
                                        help_text='Select a Country id for this city.'
                                        )
    city_name  = serializers.CharField(required=True, 
                                    max_length=100,
                                    help_text='City name must be unique.',
                                    style={'placeholder': 'City name here...'},
                                    validators=[UniqueValidator(queryset=City.objects.all())]
                                    )
    
    class Meta:
        model = City
        fields = ['id', 'city_name', 'country']
        read_only_fields = ('id',)
        


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




# PropertySubTypes ##################################################################
# PropertyPurposeSubChoices ##################################################################
# Amenity ##################################################################
# Property ##################################################################
# PropertyImage ##################################################################

