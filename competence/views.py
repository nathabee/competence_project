# competence/views.py

from rest_framework import permissions, viewsets
from .permissions import IsTeacher, IsAdmin, IsAnalytics
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import (
    Niveau, Etape, Annee, Matiere, Eleve, Catalogue, GroupageData,
    Item , Resultat, ResultatDetail,ScoreRule ,ScoreRulePoint
)
 
from .serializers import (
    NiveauSerializer, EtapeSerializer, AnneeSerializer, MatiereSerializer, EleveSerializer, EleveAnonymizedSerializer, CatalogueSerializer,
    GroupageDataSerializer, ItemSerializer, ResultatSerializer, ResultatDetailSerializer,UserSerializer,ScoreRuleSerializer,
    ScoreRulePointSerializer
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.decorators import api_view 
from rest_framework.response import Response
 
from rest_framework.decorators import action 
from django.db.models import F
 
from django.contrib.auth.models import User
from django.shortcuts import render
 
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
 

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
        "eleves_anonymized": request.build_absolute_uri('/api/eleves/anonymized/'), 
        "catalogues": request.build_absolute_uri('/api/catalogues/'),
        "groupages": request.build_absolute_uri('/api/groupages/'),
        "items": request.build_absolute_uri('/api/items/'),
        "resultats": request.build_absolute_uri('/api/resultats/'),
        "resultat-details": request.build_absolute_uri('/api/resultat-details/'),
    })


def custom_404(request, exception):
    return render(request, '404.html', status=404)



 
 
class UserRolesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_groups = request.user.groups.all()  # Get all groups for the user
        roles = [group.name for group in user_groups]  # Collect group names as roles
        return Response({'roles': roles})

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'list':
            return [permissions.IsAdminUser()]  # Only admins can list users
        elif self.action == 'me':
            return [permissions.IsAuthenticated()]  # Authenticated users can access their own info
        return super().get_permissions()  # Default permissions for other actions

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

 

class EleveViewSet(viewsets.ModelViewSet):
    serializer_class = EleveSerializer
    permission_classes = [IsAuthenticated]
    queryset = Eleve.objects.none()  # Default queryset

    def get_queryset(self):
        user = self.request.user

        if user.groups.filter(name='admin').exists():
            return Eleve.objects.all()

        elif user.groups.filter(name='teacher').exists():
            return Eleve.objects.filter(professeurs=user)

        return Eleve.objects.none()



class EleveAnonymizedViewSet(viewsets.ModelViewSet):
    serializer_class = EleveAnonymizedSerializer
    permission_classes = [IsAuthenticated]
    queryset = Eleve.objects.none()  # Default queryset

    def get_queryset(self):
        user = self.request.user

        # Admin can see all students
        if user.groups.filter(name='admin').exists():
            return Eleve.objects.all()

        # Analytics/Statistics users can see all students, but without nom and prenom
        elif user.groups.filter(name='analytics').exists():
            return Eleve.objects.all()

        # Other users get no access
        return Eleve.objects.none()


 

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

 
     
 

class ResultatDetailViewSet(viewsets.ModelViewSet):
    queryset = ResultatDetail.objects.select_related('testdetail__groupagedata').order_by('testdetail__itempos')
    serializer_class = ResultatDetailSerializer
    permission_classes = [IsAuthenticated, IsTeacher | IsAdmin | IsAnalytics]
 
    def get_queryset(self):
        resultat_id = self.request.query_params.get('id', None)  # Change to 'id'
        if resultat_id is not None:
            return self.queryset.filter(id=resultat_id)  # Use 'id' here
        return self.queryset
     


class ResultatViewSet(viewsets.ModelViewSet):
    queryset = Resultat.objects.all().order_by('eleve_id', 'groupage__id', 'groupage__position')
    serializer_class = ResultatSerializer
    permission_classes = [IsAuthenticated, IsTeacher | IsAdmin | IsAnalytics]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'eleve_id', openapi.IN_QUERY, 
                description="Filter results by eleve ID", 
                type=openapi.TYPE_INTEGER
            ),
            openapi.Parameter(
                'id', openapi.IN_QUERY, 
                description="Filter result by Resultat ID", 
                type=openapi.TYPE_INTEGER
            )
        ]
    )
    def get_queryset(self):
        queryset = super().get_queryset()
        eleve_id = self.request.query_params.get('eleve_id', None)
        resultat_id = self.request.query_params.get('id', None)  # Fetch 'id' for filtering

        if resultat_id is not None:
            return queryset.filter(id=resultat_id)  # Filter by Resultat ID
        
        if eleve_id is not None:
            # Ensure that the user is associated with the Eleve
            if self.request.user.groups.filter(name='teacher').exists():
                queryset = queryset.filter(eleve__professeurs=self.request.user, eleve__id=eleve_id)
            else:
                queryset = queryset.filter(eleve__id=eleve_id)  # For admins or other roles

        return queryset