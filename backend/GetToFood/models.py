import enum

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.core.mail import send_mail
from django.db import models

from GetToFood.managers import UserManager


class City(models.Model):
    name = models.TextField()

    class Meta:
        verbose_name = 'city'
        verbose_name_plural = 'cities'


class CustomUser(AbstractBaseUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=16)
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone', 'name', 'surname']

    def __str__(self):
        return self.email


class CompanyField(models.Model):
    name = models.TextField()
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)


class Dish(models.Model):
    name = models.TextField()
    price = models.IntegerField()
    shop = models.ForeignKey(CompanyField, on_delete=models.CASCADE)


class Order(models.Model):
    class StatusChoices(models.TextChoices):
        Basket = 'BT', 'basket'
        Queued = 'QD', 'queued'
        Cooking = 'CG', 'cooking'
        Ready = 'RY', 'ready'
        Completed = 'OK', 'completed'
        Cancelled = 'CD', 'cancelled'

    status = models.CharField(choices=StatusChoices.choices, default=StatusChoices.Basket, max_length=10)
    shop = models.ForeignKey(CompanyField, on_delete=models.CASCADE)
    client = models.ForeignKey(CustomUser, on_delete=models.CASCADE)


class OrderItem(models.Model):
    count = models.IntegerField()
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')

    def __str__(self):
        return f"{self.count}"
