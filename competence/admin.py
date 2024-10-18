from django.contrib import admin 
from django.utils.html import format_html
from .models import Niveau, Etape, Annee, Matiere, ScoreRule, ScoreRulePoint, Eleve, Catalogue, GroupageData, Item, \
                    PDFLayout, Report, ReportCatalogue, Resultat, ResultatDetail, MyImage 

import base64

from django import forms 
 

# Inline classes
class ResultatDetailInline(admin.TabularInline):
    model = ResultatDetail
    extra = 1

class ResultatInline(admin.TabularInline):
    model = Resultat
    extra = 1
    inlines = [ResultatDetailInline]

class ReportCatalogueInline(admin.TabularInline):
    model = ReportCatalogue
    extra = 1
    inlines = [ResultatInline]

 

class IconPreviewSelect(forms.Select):
    def render_options(self, choices, selected_choices):
        options = []
        for value, label in choices:
            try:
                # Check if the value corresponds to an actual MyImage object
                icon_instance = MyImage.objects.get(pk=value)
                if icon_instance.icon:
                    # Create an HTML representation of the image
                    image_preview = format_html(
                        '<img src="{}" style="width: 20px; height: 20px; margin-right: 5px; vertical-align: middle;"/>',
                        icon_instance.icon.url  # Use the URL of the image
                    )
                    # Format the option with the image
                    option_html = format_html(
                        '<option value="{}"{}>{} {}</option>',
                        value, ' selected="selected"' if str(value) in selected_choices else '', image_preview, label
                    )
                    options.append(option_html)
                else:
                    # In case there's no icon, fall back to the default label
                    options.append(format_html('<option value="{}"{}>{}</option>', value, ' selected="selected"' if str(value) in selected_choices else '', label))
            except MyImage.DoesNotExist:
                # Handle cases where the icon does not exist
                options.append(format_html('<option value="{}"{}>{}</option>', value, ' selected="selected"' if str(value) in selected_choices else '', label))

        return format_html(''.join(options))


@admin.register(GroupageData)
class GroupageDataAdmin(admin.ModelAdmin):
    list_display = ('catalogue', 'display_groupage_icon', 'position', 'desc_groupage', 'label_groupage', 'link', 'max_point', 'seuil1', 'seuil2', 'max_item')
    list_filter = ('catalogue',)
    search_fields = ('desc_groupage', 'label_groupage', 'link')

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "groupage_icon":
            # Use the custom widget for the groupage_icon field in the admin
            kwargs['widget'] = IconPreviewSelect
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def display_groupage_icon(self, obj):
        if obj.groupage_icon_id:  # Check if groupage_icon ID is not None
            try:
                # Fetch the MyImage instance using the groupage_icon ID
                my_image = MyImage.objects.get(pk=obj.groupage_icon_id)  # Use the ID attribute
                if my_image.icon:
                    return format_html('<img src="{}" style="width: 30px; height: 30px;"/>', my_image.icon.url)
            except MyImage.DoesNotExist:
                return "Image not found"
        return "-"

    display_groupage_icon.short_description = "Groupage Icon"

from django.utils.safestring import mark_safe
class ImagePreviewWidget(forms.ClearableFileInput):
    """Custom Widget to display image preview in the form."""

    def render(self, name, value, attrs=None, renderer=None):
        # Default file input widget rendering
        input_html = super().render(name, value, attrs, renderer)

        # Check if an existing image is present and display the preview
        if value and hasattr(value, "url"):
            img_html = format_html('<img src="{}" style="max-height: 200px;"/>', value.url)
            # Render image preview and file input field
            return mark_safe(f'{img_html}<br>{input_html}')
        
        # If no image is present, render only the file input field
        return input_html


@admin.register(MyImage)
class MyImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'display_icon']
    search_fields = ['id', 'icon']  # Allows search by ID and icon file name
    #readonly_fields = ['icon_base64']  # Make base64 icon read-only

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        """Customize the form field for the 'icon' to include the preview."""
        if db_field.name == 'icon':  # Assuming 'icon' is your image field
            kwargs['widget'] = ImagePreviewWidget  # Use the custom preview widget
        return super().formfield_for_dbfield(db_field, request, **kwargs)

    def display_icon(self, obj):
        """Displays a small icon preview in the list display."""
        if obj.icon:
            return format_html('<img src="{}" style="width: 50px; height: 50px;"/>', obj.icon.url)
        return "-"

    display_icon.short_description = "Icon"

    #def icon_base64(self, obj):
    #    """Display the Base64 representation of the image."""
    #    if obj.icon:
    #        with open(obj.icon.path, 'rb') as image_file:
    #            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    #            return f'data:image/png;base64,{encoded_string}'
    #    return None

    #icon_base64.short_description = "Base64 Icon"


@admin.register(Niveau)
class NiveauAdmin(admin.ModelAdmin):
    list_display = ('niveau', 'description')
    list_filter = ('niveau',)
    search_fields = ('niveau', 'description')

@admin.register(Etape)
class EtapeAdmin(admin.ModelAdmin):
    list_display = ('etape', 'description')
    list_filter = ('etape',)
    search_fields = ('etape', 'description')

@admin.register(Annee) 
class AnneeAdmin(admin.ModelAdmin):
    list_display = ('is_active', 'start_date', 'stop_date', 'description')  # Replace 'annee' with valid fields
 

@admin.register(Matiere)
class MatiereAdmin(admin.ModelAdmin):
    list_display = ('matiere', 'description')
    search_fields = ('matiere', 'description')

@admin.register(ScoreRule)
class ScoreRuleAdmin(admin.ModelAdmin):
    list_display = ('id', 'description')
    search_fields = ('description',)

@admin.register(ScoreRulePoint)
class ScoreRulePointAdmin(admin.ModelAdmin):
    list_display = ('scorerule', 'scorelabel', 'score', 'description')
    list_filter = ('scorerule',)
    search_fields = ('scorelabel', 'description')



@admin.register(Eleve)
class EleveAdmin(admin.ModelAdmin):
    list_display = ('nom', 'prenom', 'niveau')
    search_fields = ('nom', 'prenom', 'niveau')
    filter_horizontal = ('professeurs',)  # For ManyToMany fields

@admin.register(Catalogue)
class CatalogueAdmin(admin.ModelAdmin):
    list_display = ('niveau', 'etape', 'annee', 'matiere', 'description')
    list_filter = ('niveau', 'etape', 'annee', 'matiere')
    ordering = ('niveau', 'etape')

    search_fields = ('description',)
    filter_horizontal = ('professeurs',)  # For ManyToMany fields


#@admin.register(GroupageData)
#class GroupageDataAdmin(admin.ModelAdmin):
 ##   list_display = ('catalogue', 'display_groupage_icon', 'position', 'desc_groupage', 'label_groupage', 'link', 'max_point', 'seuil1', 'seuil2', 'max_item')
 #   list_filter = ('catalogue',)
 #   autocomplete_fields = ['groupage_icon']  # References MyImage and requires search_fields
 #   search_fields = ('desc_groupage', 'label_groupage', 'link', 'groupage_icon__icon')  # Note the double underscore for the related field
##
 #   def formfield_for_foreignkey(self, db_field, request, **kwargs):
 #       if db_field.name == "groupage_icon":
 #           kwargs['widget'] = IconPreviewWidget
 #       return super().formfield_for_foreignkey(db_field, request, **kwargs)#

    #def display_groupage_icon(self, obj):
    #    if obj.groupage_icon and hasattr(obj.groupage_icon, 'url'):
    #        try:
    #            return format_html('<img src="{}" style="width: 30px; height: 30px;"/>', obj.groupage_icon.icon.url)
    #        except FileNotFoundError:
    #            return "Image not found"
    #    return "-"
    
    #display_groupage_icon.short_description = "Groupage Icon"


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'description', 'temps', 'max_score', 'itempos')  # Customize fields to display
    list_filter = ('groupagedata',)  # Allows filtering by groupagedata
    search_fields = ('description', 'temps')  # Enable search by description and temps

 



@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('eleve', 'professeur', 'created_at', 'updated_at')
    list_filter = ('professeur', 'created_at')
    search_fields = ('eleve__nom', 'eleve__prenom')

    inlines = [ReportCatalogueInline]
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('eleve', 'professeur').prefetch_related(
            'report_catalogues__catalogue',
            'report_catalogues__resultats__resultat_details'
        )
    
    
@admin.register(ReportCatalogue)
class ReportCatalogueAdmin(admin.ModelAdmin):
    list_display = ('report', 'catalogue')
    list_filter = ('report',)
    search_fields = ('report__eleve__nom', 'catalogue__description')

@admin.register(Resultat)
class ResultatAdmin(admin.ModelAdmin):
    list_display = ('report_catalogue', 'groupage', 'score')
    list_filter = ('report_catalogue',)
    search_fields = ('report_catalogue__report__eleve__nom',)

@admin.register(ResultatDetail)
class ResultatDetailAdmin(admin.ModelAdmin):
    list_display = ('resultat', 'item', 'score')
    list_filter = ('resultat', 'item')
    search_fields = ('resultat__report_catalogue__report__eleve__nom', 'item__description')

 
 

@admin.register(PDFLayout)
class PDFLayoutAdmin(admin.ModelAdmin):
    list_display = ('id', 'display_header_icon', 'schule_name', 'header_message', 'footer_message1', 'footer_message2')
    search_fields = ('header_icon', 'schule_name', 'header_message', 'footer_message1', 'footer_message2')

    def display_header_icon(self, obj):
        if obj.header_icon:
            with open(obj.header_icon.path, 'rb') as img_file:
                encoded_string = base64.b64encode(img_file.read()).decode('utf-8')
                return format_html('<img src="data:image/png;base64,{}" style="width: 50px; height: 50px;"/>', encoded_string)
        return "-"
    
    display_header_icon.short_description = "Header Icon"

