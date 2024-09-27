# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    NiveauViewSet, EtapeViewSet, AnneeViewSet, EleveViewSet,
    CatalogueViewSet, GroupageDataViewSet, ItemViewSet,
    ResultatViewSet, ResultatDetailViewSet, MatiereViewSet,
    ScoreRuleViewSet, ScoreRulePointViewSet, UserViewSet,
    UserRolesView, api_overview, EleveAnonymizedViewSet
)

router = DefaultRouter()
router.register(r'niveaux', NiveauViewSet)
router.register(r'etapes', EtapeViewSet)
router.register(r'annees', AnneeViewSet)
router.register(r'matieres', MatiereViewSet)
router.register(r'scorerules', ScoreRuleViewSet)
router.register(r'scorerulepoints', ScoreRulePointViewSet)
router.register(r'eleves', EleveViewSet, basename='eleve')  # Specify a basename here
router.register(r'eleves/anonymized', EleveAnonymizedViewSet, basename='eleve-anonymized')  # Unique basename
router.register(r'catalogues', CatalogueViewSet)
router.register(r'groupages', GroupageDataViewSet)
router.register(r'items', ItemViewSet) 
router.register(r'resultats', ResultatViewSet, basename='resultat')  # Specify the basename
router.register(r'resultat-details', ResultatDetailViewSet, basename='resultat-detail')  # Specify the basename


router.register(r'users', UserViewSet)

urlpatterns = [
    path('overview/', api_overview, name='api-overview'),
    path('user/roles/', UserRolesView.as_view(), name='user-roles'),
    path('', include(router.urls)),
]
