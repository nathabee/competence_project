# competence/permissions.py

from rest_framework.permissions import BasePermission
  


#class IsAdminOrReadOnly( BasePermission):
#    def has_permission(self, request, view):
#        # Allow read-only access for all users, but restrict write access to admins
#        if request.method in BasePermission.SAFE_METHODS:
#            return True
#        return request.user and request.user.is_staff

############################################################
# permission for viewSet 
############################################################

class isAllowed(BasePermission):

    def has_permission(self, request, view):
        # Get the name of the view
        view_name = view.__class__.__name__

        # Check if the user is an admin
        if request.user.groups.filter(name='admin').exists():
            return True  # Admins have full access

        # Check for analytics permissions
        if request.user.groups.filter(name='analytics').exists() and request.user.is_authenticated:
            return self.is_allowed_for_analytics(view_name, view)

        # Check for teacher permissions
        if request.user.groups.filter(name='teacher').exists() and request.user.is_authenticated:
            return self.is_allowed_for_teacher(view_name, view)

        # Default to deny access
        return False

    def is_allowed_for_analytics(self, view_name, view):
        # Analytics users can only 'view' (list or retrieve)
        allowed_views = { 
            'UserRolesView': ['list', 'retrieve'],               # Can view user roles
            'UserViewSet': ['list', 'retrieve'],                  # Can view users
            'EleveViewSet': ['list', 'retrieve'],                 # Can view students
            'EleveAnonymizedViewSet': ['list', 'retrieve'],       # Can view anonymized students
            'NiveauViewSet': ['list', 'retrieve'],                 # Can view levels
            'EtapeViewSet': ['list', 'retrieve'],                  # Can view steps
            'AnneeViewSet': ['list', 'retrieve'],                  # Can view years
            'MatiereViewSet': ['list', 'retrieve'],                # Can view subjects
            'ScoreRuleViewSet': ['list', 'retrieve'],              # Can view score rules
            'ScoreRulePointViewSet': ['list', 'retrieve'],         # Can view score rule points
            'CatalogueViewSet': ['list', 'retrieve'],              # Can view catalogues
            'GroupageDataViewSet': ['list', 'retrieve'],           # Can view grouping data
            'ItemViewSet': ['list', 'retrieve'],                   # Can view items
            'ResultatViewSet': ['list', 'retrieve'],               # Can view results
            'ResultatDetailViewSet': ['list', 'retrieve'],         # Can view result details
            'PDFLayoutViewSet': ['list', 'retrieve'],              # Can view PDF layouts
            'ReportViewSet': ['list', 'retrieve'],                 # Can view reports
            'EleveReportsView': ['list', 'retrieve'],              # Can view reports for a student
            'ReportCatalogueViewSet': ['list', 'retrieve'],        # Can view report catalogues
        }
 

        if view_name in allowed_views:
            if view.action in allowed_views[view_name]:
                return True

        return False

    def is_allowed_for_teacher(self, view_name, view):
        # Teachers can view all and perform CRUD on allowed models
        allowed_views = { 
            'UserRolesView': ['list', 'retrieve'],                     # Can view user roles
            'UserViewSet': ['list', 'retrieve', 'create', 'update', 'destroy'],  # Can manage users
            'EleveViewSet': ['list', 'retrieve', 'create', 'update', 'destroy'],  # Can manage students
            'EleveAnonymizedViewSet': ['list', 'retrieve'],             # Can view anonymized students
            'NiveauViewSet': ['list', 'retrieve', 'create', 'update', 'destroy'],  # Can manage levels
            'EtapeViewSet': ['list', 'retrieve', 'create', 'update', 'destroy'],   # Can manage steps
            'AnneeViewSet': ['list', 'retrieve', 'create', 'update', 'destroy'],   # Can manage years
            'MatiereViewSet': ['list', 'retrieve', 'create', 'update', 'destroy'],  # Can manage subjects
            'ScoreRuleViewSet': ['list', 'retrieve', 'create', 'update', 'destroy'], # Can manage score rules
            'ScoreRulePointViewSet': ['list', 'retrieve', 'create', 'update', 'destroy'], # Can manage score rule points
            'CatalogueViewSet': ['list', 'retrieve', 'create', 'update', 'destroy'],  # Can manage catalogues
            'GroupageDataViewSet': ['list', 'retrieve', 'create', 'update', 'destroy'], # Can manage grouping data
            'ItemViewSet': ['list', 'retrieve', 'create', 'update', 'destroy'],         # Can manage items
            'ResultatViewSet': ['list', 'retrieve', 'create', 'update', 'destroy'],     # Can manage results
            'ResultatDetailViewSet': ['list', 'retrieve', 'create', 'update', 'destroy'], # Can manage result details
            'PDFLayoutViewSet': ['list', 'retrieve', 'create', 'update', 'destroy'],     # Can manage PDF layouts
            'ReportViewSet': ['list', 'retrieve', 'create', 'update', 'destroy'],        # Can manage reports
            'EleveReportsView': ['list', 'retrieve'],                                   # Can view reports for a student
            'ReportCatalogueViewSet': ['list', 'retrieve', 'create', 'update', 'destroy'], # Can manage report catalogues
            'FullReportViewSet': ['create'],  # Allow full report creation for teachers

        }
 

        # Define excluded models for CRUD operations for teachers
        excluded_models = ['Annee', 'Etape', 'Catalogue', 'Niveau', 'Matiere', 'GroupageData', 'Item', 'User', 'Eleve']
 
        
        # Check if the view is in allowed views and if the action is allowed
        if view_name in allowed_views:
            # Teachers are allowed to perform CRUD on non-excluded models
            if view.action in ['create', 'update', 'destroy']:
                model_name = view.queryset.model.__name__.lower() if hasattr(view.queryset, 'model') else None
                if model_name and model_name in [model.lower() for model in excluded_models]:
                    return False  # Deny access to excluded models
                return True  # Allow CRUD on other models

            # Allow view (list/retrieve) for allowed views
            if view.action in allowed_views[view_name]:
                return True

        return False

############################################################
# permission for ApiView 
############################################################

class isAllowedApiView(BasePermission):
    def has_permission(self, request, view):
        view_name = view.__class__.__name__

        # Check for analytics permissions
        if request.user.groups.filter(name='analytics').exists():
            return self.is_allowed_for_analytics(view_name, request.method)

        # Check for teacher permissions
        if request.user.groups.filter(name='teacher').exists():
            return self.is_allowed_for_teacher(view_name, request.method)


        # Check for teacher permissions
        if request.user.groups.filter(name='admin').exists():
            return True


        return False

    def is_allowed_for_analytics(self, view_name, method):
        allowed_views = {
            'EleveReportsView': ['GET'],  # Analytics can only view reports
            'UserRolesView': ['GET'],  # Analytics can view user roles
            # Add other views for analytics
        }

        return method in allowed_views.get(view_name, [])

    def is_allowed_for_teacher(self, view_name, method):
        allowed_views = {
            'EleveReportsView': ['GET'],  # Teachers can only view reports
            'UserRolesView': ['GET'],  # Teachers can view user roles
            # Add other views for teachers
        }

        return method in allowed_views.get(view_name, [])