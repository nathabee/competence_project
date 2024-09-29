# competence/permissions.py

from rest_framework.permissions import BasePermission
 


class IsAdminOrOwnsEleve(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Admins can access all
        if request.user.is_admin:
            return True
        # Teachers can only access their own eleves
        return obj.professeur == request.user


class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        # Teachers can access selected models and perform all CRUD operations on Eleve, Resultat, ResultatDetail
        if request.user and request.user.groups.filter(name='teacher').exists():
            # Allow access to the specific models for teachers
            #if view.basename in ['eleve', 'resultat', 'resultatdetail']:
            return True 
        return False

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        # Admins have access to all views
        return request.user and request.user.groups.filter(name='admin').exists()

class IsAnalytics(BasePermission):
    def has_permission(self, request, view):
        # Analytics can read (GET) but cannot create, update or delete
        if request.user and request.user.groups.filter(name='analytics').exists():
            if request.method in ['GET']:
                return True 
                # Allow access to all models for reading
                #return view.basename in [
                #    'niveau', 'etape', 'annee', 'matiere', 'score_rule', 'score_rule_point',
                #    'catalogue', 'groupage_data', 'item', 'eleve', 'resultat', 'resultatdetail'
                #]
        return False