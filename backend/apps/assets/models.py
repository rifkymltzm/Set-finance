from django.db import models
import uuid

class Asset(models.Model):
    ASSET_TYPES = (
        ('STOCK', 'Saham'),
        ('CRYPTO', 'Cryptocurrency'),
        ('GOLD', 'Emas fisik'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    symbol = models.CharField(max_length=20, unique=True, help_text="Contoh: BBCA, BTC, GOLD")
    name = models.CharField(max_length=100, help_text="Contoh: Bank Central Asia, Bitcoin, Emas Antam")
    asset_type = models.CharField(max_length=10, choices=ASSET_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.symbol} - {self.name}"

class HistoricalPrice(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='historical_prices')
    price = models.DecimalField(max_digits=20, decimal_places=8, help_text="Menggunakan 8 desimal untuk akurasi Crypto")
    recorded_at = models.DateTimeField(help_text="Waktu pengambilan harga dari API pihak ke-3")

    class Meta:
        ordering = ['-recorded_at']
        # Memastikan tidak ada duplikasi harga untuk aset yang sama di waktu yang sama
        unique_together = ('asset', 'recorded_at') 

    def __str__(self):
        return f"{self.asset.symbol} - {self.price} at {self.recorded_at}"