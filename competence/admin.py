from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from django.contrib import admin
from django.contrib.auth.models import User
#from .models import Profile

#class ProfileInline(admin.StackedInline):
#    model = Profile
#    can_delete = False

#class UserAdmin(DefaultUserAdmin):
#    inlines = (ProfileInline,)

#admin.site.unregister(User)
#admin.site.register(User, UserAdmin)


from django.contrib import admin
from .models import Niveau, Etape, Annee, Matiere, ScoreRule, ScoreRulePoint, Eleve, Catalogue, GroupageData, Item, \
                    PDFLayout,Report,ReportCatalogue,Resultat,ResultatDetail


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
    list_display = ('groupagedata', 'temps', 'description', 'observation', 'scorerule', 'max_score', 'itempos', 'link')
    list_filter = ('groupagedata', 'scorerule')
    search_fields = ('temps', 'description', 'observation', 'link')





@admin.register(ResultatDetail)
class ResultatDetailAdmin(admin.ModelAdmin):
    list_display = ('resultat', 'item', 'score', 'scorelabel', 'observation')
    list_filter = ('resultat', 'item')
    search_fields = ('resultat__id', 'item__description', 'scorelabel')

@admin.register(Resultat)
class ResultatAdmin(admin.ModelAdmin):
    list_display = ('report_catalogue', 'groupage', 'score', 'seuil1_percent', 'seuil2_percent', 'seuil3_percent')
    list_filter = ('groupage', 'report_catalogue')
    search_fields = ('report_catalogue__id', 'groupage__description')

@admin.register(ReportCatalogue)
class ReportCatalogueAdmin(admin.ModelAdmin):
    list_display = ('report', 'catalogue')
    search_fields = ('report__id', 'catalogue__id')


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('eleve', 'professeur', 'created_at', 'updated_at', 'pdflayout')
    list_filter = ('professeur', 'created_at')
    search_fields = ('eleve__nom', 'professeur__username', 'pdflayout__id')


@admin.register(PDFLayout)
class PDFLayoutAdmin(admin.ModelAdmin):
    list_display = ('id', 'header_icon', 'footer_message')
    search_fields = ('header_icon', 'footer_message')