from rest_framework.test import APIClient

class ApiUtil:
    call_counts = {
        "delete_user": 0,
        "get_user": 0,
        "get_user_roles" : 0,
        "get_user_me": 0,
        "get_teacher_list": 0,
        "create_user": 0,
        "login_user": 0,
        "get_user_list": 0,
        "get_eleve_list": 0,
        "get_eleve": 0,
        "delete_eleve": 0,
        "create_eleve":0,
        "create_niveau": 0,
        "get_niveau": 0,
        "get_niveau_list": 0,
        "create_etape": 0,
        "get_etape": 0,     
        "get_etape_list": 0,       
        "create_annee": 0,
        "get_annee": 0,
        "get_annee_list": 0,
        "create_matiere": 0,
        "get_matiere": 0, 
        "get_matiere_list": 0, 
        # Add counters for other methods as needed
    }

    def __init__(self, client: APIClient):
        self.client = client

    def _delete_user(self, user_id):
        self.call_counts["delete_user"] += 1
        return self.client.delete(f"/api/users/{user_id}/")

    def _get_user(self, user_id):
        self.call_counts["get_user"] += 1
        return self.client.get(f"/api/users/{user_id}/")



    def _get_user_list(self):
        self.call_counts["get_user_list"] += 1
        return self.client.get(f"/api/users/")

    def _get_teacher_list(self):
        self.call_counts["get_teacher_list"] += 1
        return self.client.get(f"/api/users/teacher_list/")

 


    def _get_user_me(self):
        self.call_counts["get_user_me"] += 1
        return self.client.get(f"/api/users/me/")


    def _get_user_roles(self):  #all the roles of the authentificated user
        self.call_counts["get_user_roles"] += 1
        return self.client.get(f"/api/user/roles/")


    def _create_user(self, username, password, first_name, last_name, roles):
        self.call_counts["create_user"] += 1
        data = {
            'username': username,
            'password': password,
            'first_name': first_name,
            'last_name': last_name,
            'roles': roles
        }
        return self.client.post('/api/users/', data, format='json')

    def _login_user(self,username,userpassword):
        self.call_counts["login_user"] += 1
        data = {
            'username': username,
            'password': userpassword
        }
        return self.client.post('/api/token/', data, format='json') 


    def _create_eleve(self, nom, prenom, niveau, datenaissance, professeurs):
        self.call_counts["create_eleve"] += 1
        data = {
                "nom": nom,
                "prenom": prenom,
                "niveau": niveau,
                "datenaissance": datenaissance,
                "professeurs": professeurs
        }
        return self.client.post('/api/eleves/', data, format='json')

 
    
    def _get_eleve_list(self):   # all eleves of the user teacher
        self.call_counts["get_eleve_list"] += 1
        return self.client.get(f"/api/eleves/")

 
 
    def _delete_eleve(self,  eleve_id):
        self.call_counts["delete_eleve"] += 1
        return self.client.delete(f"/api/eleves/{eleve_id}/")
 
    def _get_eleve(self,  eleve_id):
        self.call_counts["get_eleve"] += 1
        return self.client.get(f"/api/eleves/{eleve_id}/")
 
    def _create_niveau(self,  niveau, description):
        self.call_counts["create_niveau"] += 1
        data = {
            "niveau": niveau,
            "description": description
        }
        return self.client.post("/api/niveaux/", data, format='json')
 
 
    def _get_niveau_list(self):
        self.call_counts["get_niveau_list"] += 1
        return self.client.get(f"/api/niveaux/")
    

    def _get_niveau(self,  niveau_id):
        self.call_counts["get_niveau"] += 1
        return self.client.get(f"/api/niveaux/{niveau_id}/")


    # Etape-related methods 
    def _create_etape(self,  etape, description):
        self.call_counts["create_etape"] += 1
        data = {
            "etape": etape,
            "description": description
        }
        return self.client.post("/api/etapes/", data, format='json')
 
    def _get_etape(self,  etape_id):
        self.call_counts["get_etape"] += 1
        return self.client.get(f"/api/etapes/{etape_id}/")


    def _get_etape_list(self):
        self.call_counts["get_etape_list"] += 1
        return self.client.get(f"/api/etapes/")
    
    # Annee-related methods
    def _create_annee(self, is_active, start_date, stop_date, description):
        self.call_counts["create_annee"] += 1
        
        data = {
            "is_active": is_active,
            "description": description
        }

        if start_date:
            data["start_date"] = start_date
        
        if stop_date:
            data["stop_date"] = stop_date

        print(f"POST /api/annees/", data)
        return self.client.post("/api/annees/", data, format='json')

 
    def _get_annee(self,  annee_id):
        self.call_counts["get_annee"] += 1
        return self.client.get(f"/api/annees/{annee_id}/")


    def _get_annee_list(self):
        self.call_counts["get_annee_list"] += 1
        return self.client.get(f"/api/annees/")

    # Matiere-related methods 
    def _create_matiere(self,  matiere, description):
        self.call_counts["create_matiere"] += 1
        data = {
            "matiere": matiere,
            "description": description
        }
        return self.client.post("/api/matieres/", data, format='json')
 
 

    def _get_matiere(self, matiere_id):
        self.call_counts["get_matiere"] += 1
        return self.client.get(f"/api/matieres/{matiere_id}/")

    def _get_matiere_list(self):
        self.call_counts["get_matiere_list"] += 1
        return self.client.get(f"/api/matieres/")

###########################################################################

    def get_call_counts(self):
        # Filter counts to return only those greater than zero
        return self.call_counts
        # return {key: count for key, count in self.call_counts.items() if count > 0}