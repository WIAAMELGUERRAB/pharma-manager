from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Categorie
from .serializers import CategorieSerializer

@extend_schema_view(
    list=extend_schema(summary='Lister les catégories', tags=['Catégories']),
    create=extend_schema(summary='Créer une catégorie', tags=['Catégories']),
    retrieve=extend_schema(summary='Détail d\'une catégorie', tags=['Catégories']),
    update=extend_schema(summary='Modifier une catégorie', tags=['Catégories']),
    partial_update=extend_schema(summary='Modifier partiellement', tags=['Catégories']),
    destroy=extend_schema(summary='Supprimer une catégorie', tags=['Catégories']),
)
class CategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nom', 'description']
    ordering_fields = ['nom', 'date_creation']

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.medicaments.filter(est_actif=True).exists():
            return Response(
                {'detail': 'Impossible de supprimer : des médicaments actifs sont liés à cette catégorie.'},
                status=status.HTTP_409_CONFLICT
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)