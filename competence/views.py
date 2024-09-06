# views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action 
from .models import Eleve, Resultat, Niveau, Etape, Annee, Catalogue, Item
from django.contrib.auth.models import User
from .serializers import (
    EleveSerializer, ResultatSerializer, NiveauSerializer, EtapeSerializer, AnneeSerializer,
    CatalogueSerializer, ItemSerializer, UserSerializer
)

from django.shortcuts import render

def custom_404(request, exception):
    return render(request, '404.html', status=404)


class EleveViewSet(viewsets.ModelViewSet):
    queryset = Eleve.objects.all()
    serializer_class = EleveSerializer
    permission_classes = [IsAuthenticated]  # Optional: Require authentication

    @action(detail=False, methods=['get'])
    def custom_list(self, request):
        # Custom action to handle special requests
        queryset = Eleve.objects.all()  # Customize query as needed
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)



# ViewSet for Eleve (Student)
#class EleveViewSet(viewsets.ModelViewSet):
#    queryset = Eleve.objects.all()
#    serializer_class = EleveSerializer

# ViewSet for Resultat
class ResultatViewSet(viewsets.ModelViewSet):
    queryset = Resultat.objects.all()
    serializer_class = ResultatSerializer

# ViewSet for Niveau
class NiveauViewSet(viewsets.ModelViewSet):
    queryset = Niveau.objects.all()
    serializer_class = NiveauSerializer

# ViewSet for Etape
class EtapeViewSet(viewsets.ModelViewSet):
    queryset = Etape.objects.all()
    serializer_class = EtapeSerializer

# ViewSet for Annee
class AnneeViewSet(viewsets.ModelViewSet):
    queryset = Annee.objects.all()
    serializer_class = AnneeSerializer

# ViewSet for Catalogue
class CatalogueViewSet(viewsets.ModelViewSet):
    queryset = Catalogue.objects.all()
    serializer_class = CatalogueSerializer

# ViewSet for Item
class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

# ViewSet for User (Professeurs)
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
