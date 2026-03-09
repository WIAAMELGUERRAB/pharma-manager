from django.db import models
from django.utils import timezone

class Vente(models.Model):
    """
    Transaction de vente. La référence est auto-générée (ex: VNT-2026-0001).
    prix_unitaire dans LigneVente est un SNAPSHOT — ne jamais faire de FK vers le prix.
    """
    STATUT_CHOICES = [
        ('completee', 'Complétée'),
        ('annulee',   'Annulée'),
    ]
    reference  = models.CharField(max_length=20, unique=True, editable=False)
    date_vente = models.DateTimeField(auto_now_add=True)
    total_ttc  = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    statut     = models.CharField(max_length=10, choices=STATUT_CHOICES, default='completee')
    notes      = models.TextField(blank=True, default='')

    class Meta:
        ordering = ['-date_vente']

    def save(self, *args, **kwargs):
        if not self.reference:
            year = timezone.now().year
            count = Vente.objects.filter(reference__startswith=f'VNT-{year}-').count()
            self.reference = f'VNT-{year}-{str(count + 1).zfill(4)}'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.reference


class LigneVente(models.Model):
    """Ligne d'une vente. prix_unitaire est figé au moment de la vente."""
    vente         = models.ForeignKey(Vente, on_delete=models.CASCADE, related_name='lignes')
    medicament    = models.ForeignKey('medicaments.Medicament', on_delete=models.PROTECT)
    quantite      = models.PositiveIntegerField()
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2)  # snapshot !
    sous_total    = models.DecimalField(max_digits=12, decimal_places=2)

    def save(self, *args, **kwargs):
        self.sous_total = self.quantite * self.prix_unitaire
        super().save(*args, **kwargs)