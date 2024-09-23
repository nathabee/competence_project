# views.py
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action  
from django.contrib.auth.models import User
from django.shortcuts import render

from rest_framework import viewsets
from .permissions import IsTeacher,IsAdmin,IsAnalytics
from .models import (
    Niveau, Etape, Annee, Matiere, Eleve, Catalogue, GroupageData,
    Item , Resultat, ResultatDetail,ScoreRule ,ScoreRulePoint
)
from .serializers import (
    NiveauSerializer, EtapeSerializer, AnneeSerializer, MatiereSerializer, EleveSerializer, CatalogueSerializer,
    GroupageDataSerializer, ItemSerializer, ResultatSerializer, ResultatDetailSerializer,UserSerializer,ScoreRuleSerializer,
    ScoreRulePointSerializer
)
 
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def api_overview(request):
    return Response({
        "niveaux": request.build_absolute_uri('/api/niveaux/'),
        "etapes": request.build_absolute_uri('/api/etapes/'),
        "annees": request.build_absolute_uri('/api/annees/'),
        "matieres": request.build_absolute_uri('/api/matieres/'),
        "scorerules": request.build_absolute_uri('/api/scorerules/'),
        "scorerulepoints": request.build_absolute_uri('/api/scorerulepoints/'),
        "eleves": request.build_absolute_uri('/api/eleves/'),
        "catalogues": request.build_absolute_uri('/api/catalogues/'),
        "groupages": request.build_absolute_uri('/api/groupages/'),
        "items": request.build_absolute_uri('/api/items/'),
        "resultats": request.build_absolute_uri('/api/resultats/'),
        "resultat-details": request.build_absolute_uri('/api/resultat-details/'),
    })


def custom_404(request, exception):
    return render(request, '404.html', status=404)


# competence/views.py

from rest_framework import viewsets
from .permissions import IsTeacher, IsAdmin, IsAnalytics
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import (
    Niveau, Etape, Annee, Matiere, Eleve, Catalogue, GroupageData,
    Item, Resultat, ResultatDetail, ScoreRule, ScoreRulePoint
)
from .serializers import (
    NiveauSerializer, EtapeSerializer, AnneeSerializer, MatiereSerializer, EleveSerializer,
    CatalogueSerializer, GroupageDataSerializer, ItemSerializer, ResultatSerializer,
    ResultatDetailSerializer, UserSerializer, ScoreRuleSerializer, ScoreRulePointSerializer 
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

 
 
class UserRolesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_groups = request.user.groups.all()  # Get all groups for the user
        roles = [group.name for group in user_groups]  # Collect group names as roles
        return Response({'roles': roles})



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class EleveViewSet(viewsets.ModelViewSet):
    queryset = Eleve.objects.all()
    serializer_class = EleveSerializer
    permission_classes = [IsAuthenticated, IsTeacher | IsAdmin | IsAnalytics]

    @action(detail=False, methods=['get'])
    def custom_list(self, request):
        # Custom action to handle special requests
        queryset = Eleve.objects.all()  # Customize query as needed
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

 

class NiveauViewSet(viewsets.ModelViewSet):
    queryset = Niveau.objects.all()
    serializer_class = NiveauSerializer
    permission_classes = [IsAuthenticated, IsTeacher | IsAdmin | IsAnalytics]

class EtapeViewSet(viewsets.ModelViewSet):
    queryset = Etape.objects.all()
    serializer_class = EtapeSerializer
    permission_classes = [IsAuthenticated, IsTeacher | IsAdmin | IsAnalytics]

class AnneeViewSet(viewsets.ModelViewSet):
    queryset = Annee.objects.all()
    serializer_class = AnneeSerializer
    permission_classes = [IsAuthenticated, IsTeacher | IsAdmin | IsAnalytics]

class MatiereViewSet(viewsets.ModelViewSet):
    queryset = Matiere.objects.all()
    serializer_class = MatiereSerializer
    permission_classes = [IsAuthenticated, IsTeacher | IsAdmin | IsAnalytics]

class ScoreRuleViewSet(viewsets.ModelViewSet):
    queryset = ScoreRule.objects.all()
    serializer_class = ScoreRuleSerializer
    permission_classes = [IsAuthenticated, IsTeacher | IsAdmin | IsAnalytics]

class ScoreRulePointViewSet(viewsets.ModelViewSet):
    queryset = ScoreRulePoint.objects.all()
    serializer_class = ScoreRulePointSerializer
    permission_classes = [IsAuthenticated, IsTeacher | IsAdmin | IsAnalytics]

class CatalogueViewSet(viewsets.ModelViewSet):
    queryset = Catalogue.objects.all()
    serializer_class = CatalogueSerializer
    permission_classes = [IsAuthenticated, IsTeacher | IsAdmin | IsAnalytics]

class GroupageDataViewSet(viewsets.ModelViewSet):
    queryset = GroupageData.objects.all()
    serializer_class = GroupageDataSerializer
    permission_classes = [IsAuthenticated, IsTeacher | IsAdmin | IsAnalytics]

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated, IsTeacher | IsAdmin | IsAnalytics]

class ResultatViewSet(viewsets.ModelViewSet):
    queryset = Resultat.objects.all()
    serializer_class = ResultatSerializer
    permission_classes = [IsAuthenticated, IsTeacher | IsAdmin | IsAnalytics]

class ResultatDetailViewSet(viewsets.ModelViewSet):
    queryset = ResultatDetail.objects.all()
    serializer_class = ResultatDetailSerializer
    permission_classes = [IsAuthenticated, IsTeacher | IsAdmin | IsAnalytics]
 
 