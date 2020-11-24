from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group

from .models import *


admin.site.unregister(Group)


# class UserAdmin(ModelAdmin):
#     ordering = ['email']
#     list_display = ['email', 'phone', 'name', 'surname']


# admin.site.register(City)
# admin.site.register(CustomUser, UserAdmin)
# admin.site.register(CompanyField)
# admin.site.register(Dish)
# admin.site.register(Order)
# admin.site.register(OrderItem)
