from rest_framework import serializers
from .models import Categorie

class CategorieSerializer(serializers.ModelSerializer):
    medicaments_count = serializers.SerializerMethodField()

    class Meta:
        model = Categorie
        fields = ['id', 'nom', 'description', 'medicaments_count', 'date_creation']
        read_only_fields = ['id', 'date_creation']

    def get_medicaments_count(self, obj):
        return obj.medicaments.filter(est_actif=True).count()

    def validate_nom(self, value):
        if not value.strip():
            raise serializers.ValidationError("Le nom ne peut pas être vide.")
        return value.strip()