# competence/permissions.py

from rest_framework.permissions import BasePermission

class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        # Teachers can access selected models and perform all CRUD operations on Eleve, Resultat, ResultatDetail
        if request.user and request.user.profile.role == 'teacher':
            # Allow access to the specific models for teachers
            if view.basename in ['eleve', 'resultat', 'resultatdetail']:
                return True
            # Check if the view is one of the allowed models for teachers
            if view.basename in [
                'niveau', 'etape', 'annee', 'matiere', 'score_rule', 'score_rule_point',
                'catalogue', 'groupage_data', 'item'
            ]:
                return True
        return False

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        # Admins have access to all views
        return request.user and request.user.profile.role == 'admin'

class IsAnalytics(BasePermission):
    def has_permission(self, request, view):
        # Analytics can read (GET) but cannot create, update or delete
        if request.user and request.user.profile.role == 'analytics':
            if request.method in ['GET']:
                # Allow access to all models for reading
                return view.basename in [
                    'niveau', 'etape', 'annee', 'matiere', 'score_rule', 'score_rule_point',
                    'catalogue', 'groupage_data', 'item', 'eleve', 'resultat', 'resultatdetail'
                ]
        return False
