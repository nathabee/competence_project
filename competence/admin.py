from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from django.contrib import admin
from django.contrib.auth.models import User
  
#from django.db import connection   #for debug developpement
#import logging  #for debug developpement


from django.utils.html import format_html

from django.contrib import admin
from .models import Niveau, Etape, Annee, Matiere, ScoreRule, ScoreRulePoint, Eleve, Catalogue, GroupageData, Item, \
                    PDFLayout,Report,ReportCatalogue,Resultat,ResultatDetail

from django.contrib import admin
from .models import Report, ReportCatalogue, Resultat, ResultatDetail
import base64


class ResultatDetailInline(admin.TabularInline):
    model = ResultatDetail
    extra = 1  # Number of empty forms to display

class ResultatInline(admin.TabularInline):
    model = Resultat
    extra = 1
    inlines = [ResultatDetailInline]

class ReportCatalogueInline(admin.TabularInline):
    model = ReportCatalogue
    extra = 1
    inlines = [ResultatInline]


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
    search_fields = ('description',)

@admin.register(GroupageData)
class GroupageDataAdmin(admin.ModelAdmin):
    list_display = ('catalogue', 'position', 'desc_groupage', 'label_groupage', 'link', 'max_point', 'seuil1', 'seuil2', 'max_item')
    list_filter = ('catalogue',)
    search_fields = ('desc_groupage', 'label_groupage', 'link')

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


############



#@admin.register(ResultatDetail)
#class ResultatDetailAdmin(admin.ModelAdmin):
#    list_display = ('id', 'resultat', 'item', 'score', 'scorelabel', 'observation')  # Display these fields
#    list_filter = ('resultat', 'item')  # Filters on these foreign keys
#    search_fields = ('item__description', 'scorelabel', 'resultat_id')  # Search on item description, score label, and resultat ID
#    
#    def get_queryset(self, request):
#        # Optimize queryset using select_related
#        qs = super().get_queryset(request)
#        return qs.select_related('resultat', 'item')
#
#    def changelist_view(self, request, extra_context=None):
##        # Log SQL queries for debugging
#        response = super().changelist_view(request, extra_context)
#        logger = logging.getLogger('django.db.backends')
#        for query in connection.queries:
#            logger.debug(query['sql'])  # Log each SQL query
#        return response



#@admin.register(Resultat)
#class ResultatAdmin(admin.ModelAdmin):
#    list_display = ('report_catalogue', 'groupage', 'score', 'seuil1_percent', 'seuil2_percent', 'seuil3_percent')
#    list_filter = ('groupage', 'report_catalogue')
#    search_fields = ('report_catalogue__id', 'groupage__description')#

#@admin.register(ReportCatalogue)
#class ReportCatalogueAdmin(admin.ModelAdmin):
#    list_display = ('report', 'catalogue')
#    search_fields = ('report__id', 'catalogue__id')


#@admin.register(Report)
#class ReportAdmin(admin.ModelAdmin):
#    list_display = ('eleve', 'professeur', 'created_at', 'updated_at', 'pdflayout')
#    list_filter = ('professeur', 'created_at')
#    search_fields = ('eleve__nom', 'professeur__username', 'pdflayout__id')