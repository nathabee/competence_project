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
from .models import Niveau, Etape, Annee, Matiere, ScoreRule, ScoreRulePoint, Eleve, Catalogue, GroupageData, Item


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
    list_display = ('annee', 'description')
    search_fields = ('annee', 'description')

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