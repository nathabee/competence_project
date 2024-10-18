from django.contrib import admin
from django.contrib.admin import AdminSite
from django.utils.html import format_html 
 

from django.contrib import admin
from django.contrib.admin import AdminSite
from django.utils.html import format_html

# Custom admin site
class CustomAdminSite(AdminSite):
    site_header = 'Custom Admin'  # Header for the admin site
    site_title = 'Custom Admin Portal'  # Title for the browser tab
    index_title = 'Welcome to Custom Admin Portal'  # Title for the admin index page

    # Custom CSS for the admin site
    class Media:
        css = {
            'all': ('css/admin-custom.css',)  # Ensure this path is correct
        }

    def has_permission(self, request):
        # Check if the user has permission to access the admin site
        has_perm = request.user.is_active and (request.user.is_superuser or request.user.is_staff)
        return has_perm

# Override the default admin site with the custom one
admin.site = CustomAdminSite(name='custom_admin')
 