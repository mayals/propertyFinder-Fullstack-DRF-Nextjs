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
   
    def get(self, request, country_id, *args, **kwargs):
        try:
            country = get_object_or_404(Country, id=country_id)
            cities = City.objects.all().filter(country=country_id)

        except Country.DoesNotExist:
            print('country =', "country not found")
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        
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
 


class ListSubTypesAPIView(APIView):
    pass 
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
        
  
        
class ListPropertyAPIView(APIView):
    pass 
class UpdatePropertyAPIView(APIView):
    pass 
class DeletePropertyAPIView(APIView):
    pass 


# PropertyImage
class CreatePropertyImageUploadAPIView(APIView): # only property images for data saved pefore --step2
    serializer_class = PropertyImageSerializer
    permission_classes = [IsAuthenticated, IsAllowedToAddProperty]  # 👈 both required

    def post(self, request, *args, **kwargs):
        property_id = self.kwargs.get("property_id")
        property_obj = get_object_or_404(Property, id=property_id)

        data = request.data.copy()
        data.setlist("images", request.FILES.getlist("images"))

        serializer = self.get_serializer(data=data, context={"property": property_obj})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"detail": "Images uploaded successfully"},
            status=status.HTTP_201_CREATED,
        )




class CreatePropertyImageAPIView(APIView):
    pass  
class ListPropertyImageAPIView(APIView):
    pass 
class UpdatePropertyImageAPIView(APIView):
    pass 
class DeletePropertyImageAPIView(APIView):
    pass 