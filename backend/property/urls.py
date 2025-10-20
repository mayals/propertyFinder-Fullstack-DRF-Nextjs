# In foo/urls/blog.py
from django.urls import path
from . import views


app_name="property"

urlpatterns = [
    
    # Country
    path('create-country/', views.CreateCountryAPIView.as_view(), name='create-country'),
    path('list-country/', views.ListCountryAPIView.as_view(), name='list-country'),
    path('update-country/<str:id>/', views.UpdateCountryAPIView.as_view(), name='update-country'), 
    path('delete-country/<str:id>/', views.DeleteCountryAPIView.as_view(), name='delete-country'), 

    # City
    path('create-city/', views.CreateCityAPIView.as_view(), name='create-city'),
    path('list-city/', views.ListCityAPIView.as_view(), name='list-city'),
    path('<str:country_id>/cities/', views.ListCountryCitiesAPIView.as_view(), name='list-country-cities'),
    path('update-city/<str:id>/', views.UpdateCityAPIView.as_view(), name='update-city'), 
    path('delete-city/<str:id>/', views.DeleteCityAPIView.as_view(), name='delete-city'),

    # PropertyMainType
    path('create-main-type/', views.CreateMainTypeAPIView.as_view(), name='create-main-type'),
    path('list-main-type/', views.ListMainTypeAPIView.as_view(), name='list-main-type'),
    
    path('update-main-type/<str:id>/', views.UpdateMainTypeAPIView.as_view(), name='update-main-type'), 
    path('delete-main-type/<str:id>/', views.DeleteMainTypeAPIView.as_view(), name='delete-main-type'),

    # PropertySubTypes
    path('<slug:country_slug>/<slug:maintype_slug>-for-<slug:purpose_slug>/subtypes/', views.ListSubTypesByCountryMaintypePurposeAPIView.as_view(), name='list-subtypes-by-country-maintype-purpose'),
    
    path('create-sub-types/', views.CreateSubTypesAPIView.as_view(), name='create-sub-types'),
    # path('list-sub-types/', views.ListSubTypesAPIView.as_view(), name='list-sub-types'),
    path('<str:main_type_id>/sub-types/', views.ListMaintypeSubTypesAPIView.as_view(), name='list-maintype-subtypes'),
    path('update-sub-types/<str:id>/', views.UpdateSubTypesAPIView.as_view(), name='update-sub-types'), 
    path('delete-sub-types/<str:id>/', views.DeleteSubTypesAPIView.as_view(), name='delete-sub-types'),

    # PropertyPurpose
    path('create-purpose/', views.CreatePurposeAPIView.as_view(), name='create-purpose'),
    path('list-purposes/', views.ListPurposeAPIView.as_view(), name='list-purpose'),
    path('update-purpose/<str:id>/', views.UpdatePurposeAPIView.as_view(), name='update-purpose'), 
    path('delete-purpose/<str:id>/', views.DeletePurposeAPIView.as_view(), name='delete-purpose'),

    # Amenity
    path('create-amenity/', views.CreateAmenityAPIView.as_view(), name='create-amenity'),
    path('list-amenity/', views.ListAmenityAPIView.as_view(), name='list-amenity'),
    path('update-amenity/<str:id>/', views.UpdateAmenityAPIView.as_view(), name='update-amenity'), 
    path('delete-amenity/<str:id>/', views.DeleteAmenityAPIView.as_view(), name='delete-amenity'),

    # return 4 main type - purpose  Properties in one country --- sa
    # -1 residential-properties-for-sale 
    # -2 residential-properties-for-rent
    # -3 commercial-properties-for-sale 
    # -4 commercial-properties-for-rent
    path('<slug:country_slug>/<slug:maintype_slug>-for-<slug:purpose_slug>/', views.ListPropertyByCountryMaintypePurposeAPIView.as_view(), name='list-property-by-country-maintype-purpose'),
    
    # Property
    path('create-property-data/', views.CreatePropertyDataAPIView.as_view(), name='create-property-data'),
    path('update-property/<str:id>/', views.UpdatePropertyAPIView.as_view(), name='update-property'), 
    path('delete-property/<str:id>/', views.DeletePropertyAPIView.as_view(), name='delete-property'),

    # PropertyImage
    path('<uuid:property_id>/upload-images/', views.CreatePropertyImageUploadAPIView.as_view(), name="create-property-upload-images"),
    
    # path('create-property-image/', views.CreatePropertyImageAPIView.as_view(), name='create-property-image'),
    path('list-property-image/', views.ListPropertyImageAPIView.as_view(), name='list-property-image'),
    path('update-property-image/<str:id>/', views.UpdatePropertyImageAPIView.as_view(), name='update-property-image'), 
    path('delete-property-image/<str:id>/',views. DeletePropertyImageAPIView.as_view(), name='delete-property-image'),
]