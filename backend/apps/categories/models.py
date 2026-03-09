from django.db import models

class Categorie(models.Model):
    """Catégorie thérapeutique d'un médicament."""
    nom         = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, default='')
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Catégorie'
        ordering = ['nom']

    def __str__(self):
        return self.nom