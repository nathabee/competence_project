from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.views.generic import TemplateView
from competence.views import custom_404  # Import your custom 404 view
from django.urls import path, re_path
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf.urls import handler404
from competence.views import custom_404  # Adjust the import based on your app structure

handler404 = custom_404


#handler404 = 'competence.views.custom_404'


# Define the schema view for drf-yasg
schema_view = get_schema_view(
    openapi.Info(
        title="Competence at school API",
        default_version='v0',
        description="REST API to test competence at school",
        terms_of_service="/static/html/tos/tos_rest_api.html",
        contact=openapi.Contact(email="nathabe123@gmail.com"),
        license=openapi.License(name="BSD License", url="https://github.com/nathabee/competence_project/blob/main/LICENSE")
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/', admin.site.urls),   
    path('api/', include('competence.urls')),  
]

# Serve Swagger UI only in DEBUG mode
if settings.DEBUG:
    urlpatterns += [
        path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-ui'),
        path('schema/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    ]
else:
    # Serve custom HTML when not in DEBUG mode
    urlpatterns += [
        path('swagger/', TemplateView.as_view(template_name='swagger_unavailable.html'), name='swagger-unavailable'),
    ]

# Serve static files only in DEBUG mode
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
# Redirect all unknown routes to static/html/index.html
 
urlpatterns += [
    # Ensure the redirect applies only for certain paths, excluding admin and API URLs
    re_path(r'^(?!admin|api|static).*$', RedirectView.as_view(url='/static/html/index.html', permanent=False), name='index')
]

 


#if settings.DEBUG:
#    import debug_toolbar
#    urlpatterns += [
#        path('__debug__/', include(debug_toolbar.urls))
#    ]