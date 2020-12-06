from django.contrib import admin
from django.urls import path, include
from .views import DishView, OrderView, CompanyView, OrderItemView, ChangePasswordView, CitiesView, \
    get_shops_database, UserView, CustomRegisterView, RegisterUserView

app_name = "GetToFood"


urlpatterns = [
    path('dishes/', DishView.as_view()),
    path('dishes/<int:pk>', DishView.as_view()),
    path('orders/', OrderView.as_view()),
    path('orders/<int:pk>', OrderView.as_view()),
    path('companies/', CompanyView.as_view()),
    path('companies/<int:pk>', CompanyView.as_view()),

    path('order-items/', OrderItemView.as_view()),
    path('order-items/<int:pk>', OrderItemView.as_view()),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),

    path('cities/', CitiesView.as_view()),
    path('shops-database', get_shops_database),
    path('account/', UserView.as_view()),
    path('register/', RegisterUserView.as_view()),
]
