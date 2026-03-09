from django.db.models import F
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Medicament
from .serializers import (
    MedicamentListSerializer,
    MedicamentDetailSerializer,
    MedicamentAlerteSerializer,
)

@extend_schema_view(
    list=extend_schema(summary='Lister les médicaments actifs', tags=['Médicaments']),
    create=extend_schema(summary='Créer un médicament', tags=['Médicaments']),
    retrieve=extend_schema(summary='Détail d\'un médicament', tags=['Médicaments']),
    update=extend_schema(summary='Modifier un médicament', tags=['Médicaments']),
    partial_update=extend_schema(summary='Modifier partiellement', tags=['Médicaments']),
    destroy=extend_schema(summary='Archiver un médicament (soft delete)', tags=['Médicaments']),
)
class MedicamentViewSet(viewsets.ModelViewSet):
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categorie', 'ordonnance_requise', 'forme']
    search_fields    = ['nom', 'dci']
    ordering_fields  = ['nom', 'prix_vente', 'stock_actuel', 'date_expiration']

    def get_queryset(self):
        return Medicament.objects.filter(est_actif=True).select_related('categorie')

    def get_serializer_class(self):
        if self.action == 'list':     return MedicamentListSerializer
        if self.action == 'alertes':  return MedicamentAlerteSerializer
        return MedicamentDetailSerializer

    def destroy(self, request, *args, **kwargs):
        """Soft delete : est_actif=False au lieu de DELETE SQL."""
        instance = self.get_object()
        instance.est_actif = False
        instance.save(update_fields=['est_actif'])
        return Response(
            {'detail': f'"{instance.nom}" a été archivé avec succès.'},
            status=status.HTTP_200_OK
        )

    @extend_schema(
        summary='Médicaments en alerte de stock',
        description='Retourne les médicaments dont stock_actuel <= stock_minimum.',
        tags=['Médicaments'],
        responses={200: MedicamentAlerteSerializer(many=True)},
    )
    @action(detail=False, methods=['get'], url_path='alertes')
    def alertes(self, request):
        qs = self.get_queryset().filter(stock_actuel__lte=F('stock_minimum'))
        serializer = MedicamentAlerteSerializer(qs, many=True)
        return Response({'count': qs.count(), 'results': serializer.data})