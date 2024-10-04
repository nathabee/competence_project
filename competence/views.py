# competence/views.py


from rest_framework import permissions, viewsets
from .permissions import isAllowed, isAllowedApiView
from rest_framework.permissions import IsAuthenticated

from .models import (
    Niveau, Etape, Annee, Matiere, Eleve, Catalogue, GroupageData,
    Item , Resultat, ResultatDetail,ScoreRule ,ScoreRulePoint,PDFLayout,Report,ReportCatalogue
)
 
from .serializers import (
    NiveauSerializer, EtapeSerializer, AnneeSerializer, MatiereSerializer, EleveSerializer, EleveAnonymizedSerializer, CatalogueSerializer,
    ReportCatalogueSerializer,ResultatDetailSerializer,ReportSerializer,ResultatSerializer,UserSerializer,ScoreRuleSerializer,   ScoreRulePointSerializer,
    PDFLayoutSerializer, ReportFRSerializer,
    GroupageDataSerializer,ItemSerializer
)
 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, action
from django.db.models import F
 
from rest_framework import serializers 
from django.contrib.auth.models import User, Group
from django.shortcuts import render
 
from rest_framework import status
from django.utils import timezone
#from drf_yasg.utils import swagger_auto_schema
#from drf_yasg import openapi
  

@api_view(['GET'])
def api_overview(request):
    return Response({
        "overview": request.build_absolute_uri('/api/overview/'),
        "login": request.build_absolute_uri('/user/token/'),
        "users": request.build_absolute_uri('/api/users/'),
        "users_me": request.build_absolute_uri('/api/users/me/'),
        "user_roles": request.build_absolute_uri('/api/user/roles/'),   
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
        "resultatdetails": request.build_absolute_uri('/api/resultatdetails/'),
        "eleve_reports": request.build_absolute_uri('/api/eleve/{eleve_id}/reports/'),    
        "pdf_layouts": request.build_absolute_uri('/api/pdf-layouts/'),
        "full_report_create": request.build_absolute_uri('/api/reports/full-create/'),  # New addition

    })


 


handler404 = 'yourapp.views.custom_404'


def custom_404(request, exception):
    return render(request, '404.html', status=404)


####################################################################
#  APIView .... in this case we just have defined a GET
##############################################################
 
class UserRolesView(APIView):
    permission_classes = [IsAuthenticated, isAllowedApiView]

    def get(self, request):
        user_groups = request.user.groups.all()  # Get all groups for the user
        roles = [group.name for group in user_groups]  # Collect group names as roles
        return Response({'roles': roles})

 
 # path('eleve/<int:eleve_id>/reports/', EleveReportsView.as_view(), name='eleve-reports'), 


class EleveReportsView(APIView):
    permission_classes = [IsAuthenticated, isAllowedApiView]

    def get(self, request, eleve_id):
        # Check if the Eleve exists
        try:
            eleve = Eleve.objects.get(id=eleve_id)
        except Eleve.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Check if the authenticated user is associated with the Eleve
        if request.user not in eleve.professeurs.all():
            return Response(status=status.HTTP_403_FORBIDDEN)
            #return Response(status=status.HTTP_407_PROXY_AUTHENTICATION_REQUIRED)

        # Retrieve reports for the Eleve
        reports = eleve.reports.all()
        serializer = ReportSerializer(reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
 
    # Note: No 'create' action is implemented here since reports should be created through the api/reports endpoint.

    def post(self, request, eleve_id):
        # Logic for creating a report (if allowed for teachers)
        pass

    def put(self, request, eleve_id):
        # Logic for updating a report (if allowed for teachers)
        pass

    def delete(self, request, eleve_id):
        # Logic for deleting a report (if allowed for teachers)
        pass




####################################################################
#  ViewSet
##############################################################

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, isAllowed]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'list':
            return [permissions.IsAdminUser()]  # Only admins can list users
        elif self.action == 'me':
            return [permissions.IsAuthenticated()]  # Authenticated users can access their own info
        elif self.action == 'teacher_list':
            return [IsAuthenticated()]  # Authenticated users can access the teacher list
        return super().get_permissions()  # Default permissions for other actions

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def teacher_list(self, request):
        # Find all users who belong to the 'teacher' group
        teacher_group = Group.objects.get(name="teacher")
        teachers = User.objects.filter(groups=teacher_group)
        serializer = self.get_serializer(teachers, many=True)
        return Response(serializer.data)
 




class EleveViewSet(viewsets.ModelViewSet):
    serializer_class = EleveSerializer
    permission_classes = [IsAuthenticated, isAllowed]

    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name='admin').exists():
            return Eleve.objects.all()
        elif user.groups.filter(name='teacher').exists():
            return Eleve.objects.filter(professeurs=user)
        return Eleve.objects.none()



class EleveAnonymizedViewSet(viewsets.ModelViewSet):
    serializer_class = EleveAnonymizedSerializer
    permission_classes = [IsAuthenticated, isAllowed]
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
    permission_classes = [IsAuthenticated, isAllowed]

class EtapeViewSet(viewsets.ModelViewSet):
    queryset = Etape.objects.all()
    serializer_class = EtapeSerializer
    permission_classes = [IsAuthenticated, isAllowed]


 



class AnneeViewSet(viewsets.ModelViewSet):
    queryset = Annee.objects.all()
    serializer_class = AnneeSerializer
    permission_classes = [IsAuthenticated, isAllowed]

    def perform_create(self, serializer):
        # Custom logic when creating a new Annee
        # Note: The default start_date is handled by the model's save method
        serializer.save()

    def perform_update(self, serializer):
        # Custom logic when updating an Annee
        if not serializer.validated_data.get('stop_date') and not serializer.validated_data.get('is_active'):
            serializer.validated_data['stop_date'] = timezone.now().date()
        serializer.save()


class MatiereViewSet(viewsets.ModelViewSet):
    queryset = Matiere.objects.all()
    serializer_class = MatiereSerializer
    permission_classes = [IsAuthenticated, isAllowed]

class ScoreRuleViewSet(viewsets.ModelViewSet):
    queryset = ScoreRule.objects.all()
    serializer_class = ScoreRuleSerializer
    permission_classes = [IsAuthenticated, isAllowed]

class ScoreRulePointViewSet(viewsets.ModelViewSet):
    queryset = ScoreRulePoint.objects.all()
    serializer_class = ScoreRulePointSerializer
    permission_classes = [IsAuthenticated, isAllowed]

class CatalogueViewSet(viewsets.ModelViewSet):
    queryset = Catalogue.objects.all()
    serializer_class = CatalogueSerializer
    permission_classes = [IsAuthenticated, isAllowed]

 


class GroupageDataViewSet(viewsets.ModelViewSet):
    serializer_class = GroupageDataSerializer
    permission_classes = [IsAuthenticated, isAllowed]

    def get_queryset(self):
        catalogue_id = self.request.query_params.get('catalogue', None)
        if catalogue_id:
            return GroupageData.objects.filter(catalogue_id=catalogue_id).prefetch_related('item_set')
        return GroupageData.objects.all()
 

class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated, isAllowed]

    def get_queryset(self):
        groupagedata_id = self.request.query_params.get('groupagedata', None)
        if groupagedata_id:
            # Filter items based on the groupagedata_id
            return Item.objects.filter(groupagedata_id=groupagedata_id)
        return Item.objects.all()



class ResultatViewSet(viewsets.ModelViewSet):
    queryset = Resultat.objects.all()
    serializer_class = ResultatSerializer
    permission_classes = [IsAuthenticated, isAllowed]

    def get_queryset(self):
        queryset = super().get_queryset()
        eleve_id = self.request.query_params.get('eleve_id', None)
        if eleve_id is not None:
            queryset = queryset.filter(eleve_id=eleve_id)
        return queryset

class ResultatDetailViewSet(viewsets.ModelViewSet):
    queryset = ResultatDetail.objects.all()
    serializer_class = ResultatDetailSerializer
 
    permission_classes = [IsAuthenticated, isAllowed]

    def get_queryset(self):
        queryset = super().get_queryset()
        resultat_id = self.request.query_params.get('resultat_id', None)
        if resultat_id is not None:
            queryset = queryset.filter(resultat_id=resultat_id)
        return queryset
  

class PDFLayoutViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, isAllowed]
    queryset = PDFLayout.objects.all()
    serializer_class = PDFLayoutSerializer
 


class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated, isAllowed]



class ReportCatalogueViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, isAllowed]
    queryset = ReportCatalogue.objects.all()
    serializer_class = ReportCatalogueSerializer


############################################################## 


class ReportFRViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportFRSerializer

    def create(self, request, *args, **kwargs):
        # Using the serializer to create the full report with nested data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Return the created report
        return Response(serializer.data, status=status.HTTP_201_CREATED)
 