from django.contrib import admin
from django.contrib.auth.models import User
from .models import Profile

# Define an inline admin descriptor for the Profile model
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False

# Define a new User admin
class UserAdmin(admin.ModelAdmin):
    inlines = (ProfileInline,)

    #class UserAdmin(admin.ModelAdmin):
 #   list_display = ('username', 'email', 'is_staff', 'is_superuser')

 


# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
