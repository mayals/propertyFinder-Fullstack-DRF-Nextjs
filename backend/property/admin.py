from django.contrib import admin
from .models import  NewProject, NewProjectDocument, NewProjectImage, NewProjectVideo, PropertyMainType,PropertySubTypes,PropertyPurpose,Country,City,Amenity,Property,PropertyImage,PropertyLike

@admin.register(PropertyMainType)
class PropertyMainTypeAdmin(admin.ModelAdmin):
    list_display  = ("id", "maintype_name")
    list_filter   = ( "maintype_name",)
    search_fields = ( "maintype_name",)


@admin.register(PropertySubTypes)
class PropertySubTypesAdmin(admin.ModelAdmin):
    list_display  = ("id", "subtype_name", "main_type")
    list_filter   = ( "subtype_name",)
    search_fields = ( "subtype_name",)



@admin.register(PropertyPurpose)
class PropertyPurposeAdmin(admin.ModelAdmin):
    list_display  = ("id", "purpose_name" ,)
    search_fields = ( "purpose_name",)
    
    
@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display  = ("id","country_name", "code")
    list_filter   = ( "country_name", "code",)
    search_fields = ( "country_name", "code",)


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display  = ("id", "city_name", "country")
    list_filter   = ( "city_name", "country")
    search_fields = ( "city_name", )



@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display  = ("id", "amenity_name",)
    list_filter   = ( "amenity_name", )
    search_fields = ( "amenity_name", )



@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display  = ("id", "owner", "title", "country", "city", "pmain_type", "psub_type", "purpose" ,"price")
    list_filter   = ( "title", "owner","price", "purpose", "pmain_type", "psub_type",)
    search_fields = ( "title", "owner", "price", "purpose", "pmain_type", "psub_type",)
    
    

@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display  = ("id", "images", "property",)
    list_filter   = ( "images", )
    search_fields = ( "images", )
    
    
@admin.register(PropertyLike)
class PropertyLikeAdmin(admin.ModelAdmin):
    list_display  = ("id", "user", "property", "created_at")
    list_filter   = ( "user", "property",)
    search_fields = ( "user", "property", )
 
 
 
 
 #################  NewProject ############################################3
@admin.register(NewProject)
class NewProjectAdmin(admin.ModelAdmin):
    list_display  = ("id", "user", "nproj_name", "country", "city", "nproj_main_type", "hand_over_year", "status_detail")
    list_filter   = ( "nproj_name", "user", "country", "city", "nproj_main_type", "hand_over_year", "status_detail")
    search_fields = ( "nproj_name", "user", "country", "city", "nproj_main_type", "hand_over_year", "status_detail")
    
@admin.register(NewProjectImage)
class NewProjectImageAdmin(admin.ModelAdmin):
    list_display  = ("id", "images", "new_project",)
    list_filter   = ( "images", )
    search_fields = ( "images", )
    
    
@admin.register(NewProjectVideo)
class NewProjectvideoAdmin(admin.ModelAdmin):
    list_display  = ("id", "videos", "new_project",)
    list_filter   = ( "videos", )
    search_fields = ( "videos", )   
    
    

   
@admin.register(NewProjectDocument)
class NewProjectDocumentAdmin(admin.ModelAdmin):
    list_display  = ("id", "documents", "new_project",)
    list_filter   = ( "documents", )
    search_fields = ( "documents", )   