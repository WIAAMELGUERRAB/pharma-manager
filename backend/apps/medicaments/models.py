from django.db import models

class Medicament(models.Model):
    """
    Médicament dans l'inventaire.
    est_actif=False = soft delete (archivé, jamais supprimé physiquement).
    """
    nom                = models.CharField(max_length=200)
    dci                = models.CharField(max_length=200, blank=True, default='')
    categorie          = models.ForeignKey(
                            'categories.Categorie',
                            on_delete=models.PROTECT,
                            related_name='medicaments')
    forme              = models.CharField(max_length=100)
    dosage             = models.CharField(max_length=100)
    prix_achat         = models.DecimalField(max_digits=10, decimal_places=2)
    prix_vente         = models.DecimalField(max_digits=10, decimal_places=2)
    stock_actuel       = models.PositiveIntegerField(default=0)
    stock_minimum      = models.PositiveIntegerField(default=10)
    date_expiration    = models.DateField()
    ordonnance_requise = models.BooleanField(default=False)
    date_creation      = models.DateTimeField(auto_now_add=True)
    est_actif          = models.BooleanField(default=True)

    class Meta:
        ordering = ['nom']

    def __str__(self):
        return f'{self.nom} ({self.dosage})'

    @property
    def est_en_alerte(self):
        """True si stock_actuel <= stock_minimum."""
        return self.stock_actuel <= self.stock_minimum