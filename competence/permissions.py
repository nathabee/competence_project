# competence/permissions.py

from rest_framework.permissions import BasePermission

class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        # Teachers can access selected models and perform all CRUD operations on Eleve, Resultat, ResultatDetail
        result = request.user and request.user.groups.filter(name='teacher').exists()
        #print(f"IsTeacher permission result: {result}")
        return result 
            # Allow access to the specific models for teachers 
            # Check if the view is one of the allowed models for teachers
 



        #if request.user and request.user.groups.filter(name='teacher').exists():
            # Allow access to the specific models for teachers 
            # Check if the view is one of the allowed models for teachers
            #if view.basename in [
            #    'niveau', 'etape', 'annee', 'matiere', 'score_rule', 'score_rule_point',
            #    'catalogue', 'groupage_data', 'item','eleve', 'resultat', 'resultat-detail']:
            #    return True
        #return False


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        # Admins have access to all views
        result = request.user and request.user.groups.filter(name='admin').exists()
        #print(f"IsAdmin permission result: {result}")
        return result 
        # return request.user and request.user.groups.filter(name='admin').exists()

class IsAnalytics(BasePermission):
    def has_permission(self, request, view):
        # Analytics can read (GET) but cannot create, update or delete
        if request.user and request.user.groups.filter(name='analytics').exists():
            if request.method in ['GET']:
                # Allow access to all models for reading
                result =  view.basename in [
                    'niveau', 'etape', 'annee', 'matiere', 'score_rule', 'score_rule_point',
                    'catalogue', 'groupage_data', 'item', 'eleve', 'resultat', 'resultat-detail'
                ]
                #print(f"IsAnalytics permission result: {result}")
                return result 
                 
            
        #print(f"IsAnalytics permission result: False")
        return False
