# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    NiveauViewSet, EtapeViewSet, AnneeViewSet, EleveViewSet, CatalogueViewSet, GroupageDataViewSet,
    ItemViewSet, ResultatViewSet, ResultatDetailViewSet,MatiereViewSet,ScoreRuleViewSet,ScoreRulePointViewSet
)
from .views import api_overview


# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'niveaux', NiveauViewSet)
router.register(r'etapes', EtapeViewSet)
router.register(r'annees', AnneeViewSet)
router.register(r'matieres', MatiereViewSet)
router.register(r'scorerules', ScoreRuleViewSet)
router.register(r'scorerulepoints', ScoreRulePointViewSet)
router.register(r'eleves', EleveViewSet)
router.register(r'catalogues', CatalogueViewSet)
router.register(r'groupages', GroupageDataViewSet)
router.register(r'items', ItemViewSet)
router.register(r'resultats', ResultatViewSet)
router.register(r'resultat-details', ResultatDetailViewSet)

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('overview/', api_overview, name='api-overview'),  
    path('', include(router.urls)),
]
