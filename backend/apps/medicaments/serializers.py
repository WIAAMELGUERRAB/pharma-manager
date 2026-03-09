from rest_framework import serializers
from .models import Medicament
from apps.categories.serializers import CategorieSerializer

class MedicamentListSerializer(serializers.ModelSerializer):
    """Serializer léger pour la liste."""
    categorie_nom = serializers.CharField(source='categorie.nom', read_only=True)
    est_en_alerte = serializers.BooleanField(read_only=True)

    class Meta:
        model = Medicament
        fields = [
            'id', 'nom', 'dci', 'categorie', 'categorie_nom',
            'forme', 'dosage', 'prix_vente', 'stock_actuel',
            'stock_minimum', 'est_en_alerte', 'ordonnance_requise', 'est_actif',
        ]


class MedicamentDetailSerializer(serializers.ModelSerializer):
    """Serializer complet pour création/modification/détail."""
    categorie_detail = CategorieSerializer(source='categorie', read_only=True)
    est_en_alerte    = serializers.BooleanField(read_only=True)

    class Meta:
        model = Medicament
        fields = [
            'id', 'nom', 'dci', 'categorie', 'categorie_detail',
            'forme', 'dosage', 'prix_achat', 'prix_vente',
            'stock_actuel', 'stock_minimum', 'est_en_alerte',
            'date_expiration', 'ordonnance_requise', 'date_creation', 'est_actif',
        ]
        read_only_fields = ['id', 'date_creation']

    def validate(self, data):
        prix_achat = data.get('prix_achat', getattr(self.instance, 'prix_achat', None))
        prix_vente = data.get('prix_vente', getattr(self.instance, 'prix_vente', None))
        if prix_achat and prix_vente and prix_vente < prix_achat:
            raise serializers.ValidationError({
                'prix_vente': "Le prix de vente ne peut pas être inférieur au prix d'achat."
            })
        return data


class MedicamentAlerteSerializer(serializers.ModelSerializer):
    """Serializer pour l'endpoint /alertes/."""
    categorie_nom = serializers.CharField(source='categorie.nom', read_only=True)
    deficit_stock = serializers.SerializerMethodField()

    class Meta:
        model = Medicament
        fields = ['id', 'nom', 'dci', 'categorie_nom', 'forme',
                  'dosage', 'stock_actuel', 'stock_minimum', 'deficit_stock']

    def get_deficit_stock(self, obj):
        return max(0, obj.stock_minimum - obj.stock_actuel)