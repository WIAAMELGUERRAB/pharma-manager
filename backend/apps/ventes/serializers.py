from rest_framework import serializers
from django.db import transaction
from .models import Vente, LigneVente
from apps.medicaments.models import Medicament


class LigneVenteSerializer(serializers.ModelSerializer):
    """Lecture seule — affiché dans le détail d'une vente."""
    medicament_nom = serializers.CharField(source='medicament.nom', read_only=True)

    class Meta:
        model = LigneVente
        fields = ['id', 'medicament', 'medicament_nom', 'quantite', 'prix_unitaire', 'sous_total']


class LigneVenteInputSerializer(serializers.Serializer):
    """Utilisé uniquement pour valider les lignes à la création."""
    medicament = serializers.PrimaryKeyRelatedField(
        queryset=Medicament.objects.filter(est_actif=True)
    )
    quantite = serializers.IntegerField(min_value=1)


class VenteCreateSerializer(serializers.ModelSerializer):
    """Serializer de création d'une vente avec ses lignes."""
    lignes = LigneVenteInputSerializer(many=True, write_only=True)

    class Meta:
        model = Vente
        fields = ['notes', 'lignes']

    def validate_lignes(self, lignes):
        if not lignes:
            raise serializers.ValidationError("La vente doit contenir au moins une ligne.")
        for ligne in lignes:
            med = ligne['medicament']
            if med.stock_actuel < ligne['quantite']:
                raise serializers.ValidationError(
                    f"Stock insuffisant pour '{med.nom}' : "
                    f"{med.stock_actuel} disponible(s), {ligne['quantite']} demandé(s)."
                )
        return lignes

    def create(self, validated_data):
        lignes_data = validated_data.pop('lignes')
        with transaction.atomic():
            vente = Vente.objects.create(**validated_data)
            total = 0
            for ligne_data in lignes_data:
                med      = ligne_data['medicament']
                quantite = ligne_data['quantite']
                prix_snap = med.prix_vente          # snapshot du prix
                LigneVente.objects.create(
                    vente=vente,
                    medicament=med,
                    quantite=quantite,
                    prix_unitaire=prix_snap,
                )
                med.stock_actuel -= quantite
                med.save(update_fields=['stock_actuel'])
                total += quantite * prix_snap
            vente.total_ttc = total
            vente.save(update_fields=['total_ttc'])
        return vente


class VenteDetailSerializer(serializers.ModelSerializer):
    """Serializer de lecture pour le détail et la liste des ventes."""
    lignes = LigneVenteSerializer(many=True, read_only=True)

    class Meta:
        model = Vente
        fields = ['id', 'reference', 'date_vente', 'total_ttc', 'statut', 'notes', 'lignes']