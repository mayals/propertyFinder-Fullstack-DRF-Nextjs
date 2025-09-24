from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import CountrySerializer,CitySerializer,PropertyMainTypeSerializer
from .models import Country
from rest_framework import  response, permissions, status, generics
from rest_framework.response import Response


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
    pass 
class UpdateMainTypeAPIView(APIView):
    pass 
class DeleteMainTypeAPIView(APIView):
    pass     
   
   
# PropertySubTypes
class CreateSubTypesAPIView(APIView):
    pass  
class ListSubTypesAPIView(APIView):
    pass 
class UpdateSubTypesAPIView(APIView):
    pass 
class DeleteSubTypesAPIView(APIView):
    pass 


# PropertyPurposeSubChoices
class CreatePurposeSubChoicesAPIView(APIView):
    pass  
class ListPurposeSubChoicesAPIView(APIView):
    pass 
class UpdatePurposeSubChoicesAPIView(APIView):
    pass 
class DeletePurposeSubChoicesAPIView(APIView):
    pass



# Amenity
class CreateAmenityAPIView(APIView):
    pass  
class ListAmenityAPIView(APIView):
    pass 
class UpdateAmenityAPIView(APIView):
    pass 
class DeleteAmenityAPIView(APIView):
    pass 


# Property
class CreatePropertyAPIView(APIView):
    pass  
class ListPropertyAPIView(APIView):
    pass 
class UpdatePropertyAPIView(APIView):
    pass 
class DeletePropertyAPIView(APIView):
    pass 


# PropertyImage
class CreatePropertyImageAPIView(APIView):
    pass  
class ListPropertyImageAPIView(APIView):
    pass 
class UpdatePropertyImageAPIView(APIView):
    pass 
class DeletePropertyImageAPIView(APIView):
    pass 