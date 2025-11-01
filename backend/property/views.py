from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import CountrySerializer, CitySerializer, PropertyMainTypeSerializer, PropertySubTypesSerializer, PropertyPurposeSerializer, AmenitySerializer, PropertySerializer, PropertyImageSerializer
from .models import Country, City, PropertyMainType, PropertySubTypes, PropertyPurpose, Amenity, Property
from rest_framework import  response, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
# permissions
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAllowedToAddProperty
from django.utils.text import slugify



# Country ############
# CreateCountry  -- No pagination
class CreateCountryAPIView(APIView):
    serializer_class = CountrySerializer
    permission_classes = [permissions.IsAdminUser]
    # pagination_class = CustomPagination
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# ListCountry  -- No pagination
class ListCountryAPIView(APIView):
    serializer_class = CountrySerializer
    permission_classes = [permissions.AllowAny]
    def get(self,request):
       queryset = Country.objects.all() 
       serializer = self.serializer_class(queryset,many=True)
       return Response(serializer.data,status=status.HTTP_200_OK)
  
  
  
  
class UpdateCountryAPIView(APIView):
    pass 
class DeleteCountryAPIView(APIView):
    pass 

class PropertyMainTypeAPIView(APIView):
    pass 
    

# City ############
class CreateCityAPIView(APIView):
    serializer_class   = CitySerializer
    permission_classes = [permissions.IsAdminUser]
    # pagination_class = CustomPagination
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ListCountryCitiesAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, country_slug, *args, **kwargs):
        country = get_object_or_404(Country, country_slug=country_slug)
        cities = City.objects.filter(country=country)
        serializer = CitySerializer(cities, many=True)
        return response.Response(serializer.data, status=status.HTTP_200_OK)





class ListCityAPIView(APIView):
    pass 
class UpdateCityAPIView(APIView):
    pass 
class DeleteCityAPIView(APIView):
    pass 


#  PropertyMainType
class CreateMainTypeAPIView(APIView):
    serializer_class   = PropertyMainTypeSerializer
    permission_classes = [permissions.IsAdminUser]
    # pagination_class = CustomPagination
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
    
    
    
class ListMainTypeAPIView(APIView):
    serializer_class   = PropertyMainTypeSerializer
    permission_classes = [permissions.AllowAny]
    def get(self,request):
       queryset = PropertyMainType.objects.all() 
       serializer = self.serializer_class(queryset,many=True)
       return Response(serializer.data,status=status.HTTP_200_OK) 




class ListMaintypeSubTypesAPIView(APIView):
    permission_classes = [permissions.AllowAny]
   
    def get(self, request, main_type_id, *args, **kwargs):
        try:
            mainType = get_object_or_404(PropertyMainType, id=main_type_id)
            subTypes = PropertySubTypes.objects.all().filter(main_type=main_type_id)

        except PropertyMainType.DoesNotExist:
            print('mainType =', "mainType not found")
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = PropertySubTypesSerializer(subTypes, many=True)
        return response.Response(serializer.data, status=status.HTTP_200_OK)



class UpdateMainTypeAPIView(APIView):
    pass 
class DeleteMainTypeAPIView(APIView):
    pass     
   
   
# PropertySubTypes
class CreateSubTypesAPIView(APIView):
    serializer_class   = PropertySubTypesSerializer
    permission_classes = [permissions.IsAdminUser]
    # pagination_class = CustomPagination
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 


class ListSubTypesByCountryMaintypePurposeAPIView(APIView):
    serializer_class = PropertySubTypesSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, maintype_slug, *args, **kwargs):
        pmain_type = get_object_or_404(PropertyMainType, maintype_slug=maintype_slug)
        
        queryset = PropertySubTypes.objects.filter(main_type=pmain_type)
 
        # ✅ Important line
        serializer = PropertySubTypesSerializer(
                        queryset,
                        many=True,
                        context={
                            'request': request,
                            'country_slug': kwargs.get('country_slug'), #  or request.GET.get('country_slug'),
                            'purpose_slug': kwargs.get('purpose_slug')
                        }
        )
        return Response(serializer.data,status=status.HTTP_200_OK)
           


class SearchListSubTypesByCountryMaintypeAPIView(APIView):
    serializer_class = PropertySubTypesSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        print("SubTypes-query_params=",request.query_params)
        
        # SubTypes
        queryset = PropertySubTypes.objects.all()
        type = request.query_params.get("type")  
        if type:
            type = slugify(type.lower())
            queryset = queryset.filter(main_type__maintype_slug=type)
            print("SubTypes-queryset=",queryset)
            
        serializer = PropertySubTypesSerializer(
            queryset,
            many=True,
            context={
                'request': request,
                'country_slug': "sa",
                
                # pass property filtering parameters
                'filters': {
                    'city': request.query_params.get("selectedCity"),
                    'purpose': request.query_params.get("purpose"),
                    'bedrooms': request.query_params.get("beds"),
                    'bathrooms': request.query_params.get("baths"),
                    'fur': request.query_params.get("fur"),
                    'selectedMinPrice': request.query_params.get("selectedMinPrice"),
                    'selectedMaxPrice': request.query_params.get("selectedMaxPrice"),
                    'selectedMinArea': request.query_params.get("selectedMinArea"),
                    'selectedMaxArea': request.query_params.get("selectedMaxArea"),
                    'amenities': request.query_params.getlist("amenities"),
                }
            }
        )        
        return Response(
            {
                "count": queryset.count(),
                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )




 



class UpdateSubTypesAPIView(APIView):
    pass 
class DeleteSubTypesAPIView(APIView):
    pass 


# PropertyPurpose
class CreatePurposeAPIView(APIView):
    serializer_class   = PropertyPurposeSerializer
    permission_classes = [permissions.IsAdminUser]
    # pagination_class = CustomPagination
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    
     
class ListPurposeAPIView(APIView):
    serializer_class = PropertyPurposeSerializer
    permission_classes = [permissions.AllowAny]
    def get(self,request):
       queryset = PropertyPurpose.objects.all() 
       serializer = self.serializer_class(queryset,many=True)
       return Response(serializer.data,status=status.HTTP_200_OK)
  
  
class UpdatePurposeAPIView(APIView):
    pass 
class DeletePurposeAPIView(APIView):
    pass



# Amenity
class CreateAmenityAPIView(APIView):
    serializer_class = AmenitySerializer
    permission_classes = [permissions.IsAdminUser]
    # pagination_class = CustomPagination
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
      
class ListAmenityAPIView(APIView):
    serializer_class = AmenitySerializer
    permission_classes = [permissions.AllowAny]
    def get(self,request):
       queryset = Amenity.objects.all() 
       serializer = self.serializer_class(queryset,many=True)
       return Response(serializer.data,status=status.HTTP_200_OK)


class UpdateAmenityAPIView(APIView):
    pass 
class DeleteAmenityAPIView(APIView):
    pass 






# Property
class CreatePropertyDataAPIView(APIView): # only property data no images  --step1
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated, IsAllowedToAddProperty]  # 👈 both required
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    
     
# PropertyImage
class CreatePropertyImageUploadAPIView(APIView):
    serializer_class = PropertyImageSerializer
    permission_classes = [IsAuthenticated, IsAllowedToAddProperty]

    def post(self, request, *args, **kwargs):
        property_id = self.kwargs.get("property_id")
        property_obj = get_object_or_404(Property, id=property_id)

        serializer = self.serializer_class(
            data=request.data,
            context={"property": property_obj, "request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"detail": "Images uploaded successfully"},
            status=status.HTTP_201_CREATED,
        )


    
     
     
        
  
# List all properties in one country only
class ListPropertyByCountryMaintypePurposeAPIView(APIView):
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, country_slug, maintype_slug, purpose_slug, *args, **kwargs):
        country = get_object_or_404(Country, country_slug=country_slug)
        pmain_type = get_object_or_404(PropertyMainType, maintype_slug=maintype_slug)
        purpose = get_object_or_404(PropertyPurpose, purpose_slug=purpose_slug)
        
        queryset = Property.objects.filter(country=country, pmain_type=pmain_type, purpose=purpose, is_published=True)
        serializer = PropertySerializer(queryset, many=True, context={'request': request})

        return Response(
            {
                "count": queryset.count(),
                "country": country.country_name,
                "type": pmain_type.maintype_slug,
                "purpose": purpose.purpose_slug,
                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    
    
    
# http://localhost:3000/sa/search?selectedCity=Riyadh&type=residential&purpose=buy&selectedSubtype=Villa&beds=3&baths=4&selectedMinPrice=400000&selectedMaxPrice=800000&fur=Unfurnished&selectedMinArea=1500&selectedMaxArea=3000&amenities=Waters&amenities=Electricity&amenities=pool
# filtering -- search from frontend
# queryString=
# selectedCity=Riyadh&
# type=residential&
# purpose=buy&
# selectedSubtype=Floor&
# beds=1&
# baths=4&
# selectedMinPrice=400000&
# selectedMaxPrice=700000&
# fur=Unfurnished&
# selectedMinArea=2000&
# selectedMaxArea=2000&
# amenities=Waters&
# amenities=Electricity&
# amenities=pool
# List all properties in one country only
class ListPropertyByParamsFilteringAPIView(APIView):
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, country_slug, *args, **kwargs):
        country = get_object_or_404(Country, country_slug=country_slug)
        queryset = Property.objects.filter(country=country, is_published=True)
        print("without filter-queryset=",queryset)
        print("query_params=",request.query_params)
        
        # from searchParams -- come from filtering by buyer in frontend 
        city_name = request.query_params.get("selectedCity")
        pmain_type = request.query_params.get("type")  
        purpose = request.query_params.get("purpose")
        psub_type = request.query_params.get("selectedSubtype")
        bedrooms = request.query_params.get("beds")
        bathrooms = request.query_params.get("baths")  
        selectedMinPrice = request.query_params.get("selectedMinPrice")
        selectedMaxPrice= request.query_params.get("selectedMaxPrice")
        fur = request.query_params.get("fur")
        selectedMinArea = request.query_params.get("selectedMinArea")
        selectedMaxArea= request.query_params.get("selectedMaxArea")
        amenitiesList = request.query_params.getlist("amenities")  # use getlist  insteade of get
        print("amenitiesList =", amenitiesList)   # ['Waters', 'Electricity', 'pool']
        
        # filtering  -- search
        if city_name:
            city_name = slugify(city_name.lower())
            queryset = queryset.filter(city__city_slug=city_name)
            print("queryset-city_name", queryset)
        
        if pmain_type:
            pmain_type = slugify(pmain_type.lower())
            queryset = queryset.filter(pmain_type__maintype_slug=pmain_type)
            print("queryset-pmain_type", queryset)
        
        if purpose:
            purpose = slugify(purpose.lower())
            queryset = queryset.filter(purpose__purpose_slug=purpose)
            print("queryset-purpose", queryset)
        
        if psub_type:
            psub_type = slugify(psub_type.lower())
            queryset = queryset.filter(psub_type__subtype_name=psub_type)
            print("queryset-psub_type", queryset)
            
        if bedrooms :
            queryset = queryset.filter(bedrooms=bedrooms)
            print("queryset-bedrooms", queryset)
        
        if bathrooms:
            queryset = queryset.filter(bathrooms=bathrooms)
            print("queryset-bathrooms", queryset)
        if fur:
            queryset = queryset.filter(furnishing=fur)
            print("queryset-fur", queryset)
        
        if selectedMinPrice and selectedMaxPrice:
            try:
                min_price = float(selectedMinPrice)
                max_price = float(selectedMaxPrice)
                queryset = queryset.filter(price__range=[min_price, max_price])
                print("queryset-Price", queryset)
            except ValueError:
                print("Invalid price values:", selectedMinPrice, selectedMaxPrice)
                
        
        if selectedMinArea and selectedMaxArea:
            try:
                min_area = float(selectedMinArea)
                max_area = float(selectedMaxArea)
                queryset = queryset.filter(property_size__range=[min_area, max_area])
                print("queryset-Area", queryset)
            except ValueError:
                print("Invalid area values:", selectedMinArea, selectedMaxArea)
        
        if amenitiesList:
            queryset = queryset.filter(amenities__amenity_name__in=amenitiesList).distinct()
            print("queryset-amenities", queryset)
                
        print("Final queryset=",queryset)
        
        
        
        #  ordering -- sort 
        # if order == "latest":
        #     queryset = queryset.order_by("-created_at")
        # elif order == "price-asc":
        #     queryset = queryset.order_by("price")
        # elif order == "price-desc":
        #     queryset = queryset.order_by("-price")

        # ✅ Important line
        serializer = PropertySerializer(queryset, many=True, context={'request': request})

        return Response(
            {
                "count": queryset.count(),
                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )




    
     
class UpdatePropertyAPIView(APIView):
    pass 
class DeletePropertyAPIView(APIView):
    pass 




class CreatePropertyImageAPIView(APIView):
    pass  
class ListPropertyImageAPIView(APIView):
    pass 
class UpdatePropertyImageAPIView(APIView):
    pass 
class DeletePropertyImageAPIView(APIView):
    pass 