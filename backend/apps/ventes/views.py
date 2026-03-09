from django.db import transaction
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Vente
from .serializers import VenteCreateSerializer, VenteDetailSerializer

@extend_schema_view(
    list=extend_schema(summary='Historique des ventes', tags=['Ventes']),
    create=extend_schema(summary='Enregistrer une vente', tags=['Ventes']),
    retrieve=extend_schema(summary='Détail d\'une vente', tags=['Ventes']),
)
class VenteViewSet(viewsets.GenericViewSet,
                   viewsets.mixins.ListModelMixin,
                   viewsets.mixins.CreateModelMixin,
                   viewsets.mixins.RetrieveModelMixin):
    """Pas de PUT/DELETE direct sur une vente — utiliser l'action /annuler/."""
    filter_backends  = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['statut']
    ordering_fields  = ['date_vente', 'total_ttc']

    def get_queryset(self):
        return Vente.objects.prefetch_related('lignes__medicament').all()

    def get_serializer_class(self):
        if self.action == 'create': return VenteCreateSerializer
        return VenteDetailSerializer

    @extend_schema(
        summary='Annuler une vente',
        description='Annule la vente et réintègre les quantités dans le stock.',
        tags=['Ventes'],
        request=None,
        responses={200: VenteDetailSerializer},
    )
    @action(detail=True, methods=['post'], url_path='annuler')
    def annuler(self, request, pk=None):
        vente = self.get_object()
        if vente.statut == 'annulee':
            return Response(
                {'detail': 'Cette vente est déjà annulée.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        with transaction.atomic():
            for ligne in vente.lignes.select_related('medicament').all():
                ligne.medicament.stock_actuel += ligne.quantite
                ligne.medicament.save(update_fields=['stock_actuel'])
            vente.statut = 'annulee'
            vente.save(update_fields=['statut'])
        serializer = VenteDetailSerializer(vente)
        return Response(serializer.data, status=status.HTTP_200_OK)