from django.db import models
from django.conf import settings
from apps.assets.models import Asset
import uuid

class Portfolio(models.Model):
    """Menyimpan ringkasan posisi kepemilikan aset per user (Agregat)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='portfolios')
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='user_portfolios')
    total_quantity = models.DecimalField(max_digits=20, decimal_places=8, default=0.0)
    average_buy_price = models.DecimalField(max_digits=20, decimal_places=8, default=0.0)

    class Meta:
        unique_together = ('user', 'asset') # Satu user hanya punya satu ringkasan per satu jenis aset

    def __str__(self):
        return f"{self.user.email} - {self.asset.symbol} Portfolio"

class Transaction(models.Model):
    """Buku besar (ledger) mutasi transaksi user. Bersifat Immutable (tidak boleh diubah sembarangan)"""
    TRANSACTION_TYPES = (
        ('BUY', 'Beli'),
        ('SELL', 'Jual'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=4, choices=TRANSACTION_TYPES)
    quantity = models.DecimalField(max_digits=20, decimal_places=8)
    price_per_unit = models.DecimalField(max_digits=20, decimal_places=8)
    fee = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    transaction_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-transaction_date']

    def __str__(self):
        return f"{self.transaction_type} {self.quantity} {self.portfolio.asset.symbol}"