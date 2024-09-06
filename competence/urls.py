# urls.py
from django.urls import path, include 
from rest_framework.routers import DefaultRouter
from .views import (
    EleveViewSet, ResultatViewSet, NiveauViewSet, EtapeViewSet, AnneeViewSet,
    CatalogueViewSet, ItemViewSet, UserViewSet
)
#from .views import EleveViewSet

# Define the router and register your viewsets
router = DefaultRouter() 


 
router.register(r'eleves', EleveViewSet)
router.register(r'resultats', ResultatViewSet)
router.register(r'niveaux', NiveauViewSet)
router.register(r'etapes', EtapeViewSet)
router.register(r'annees', AnneeViewSet)
router.register(r'catalogues', CatalogueViewSet)
router.register(r'items', ItemViewSet)
router.register(r'users', UserViewSet)


# Define the urlpatterns list
urlpatterns = [
    path('', include(router.urls)),  # No 'api/' prefix here
   ]