from typing import Union, Optional

from django.http import JsonResponse, response
from django.shortcuts import render, get_object_or_404
from rest_framework import status, permissions
from rest_framework.decorators import api_view
from rest_framework.generics import GenericAPIView, CreateAPIView, ListAPIView, UpdateAPIView
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Dish, Order, CompanyField, OrderItem, City
from .serializers import DishSerializer, OrderSerializer, CompanySerializer, OrderItemSerializer, \
    OrderItemFullSerializer, ChangePasswordSerializer, MyTokenObtainPairSerializer, CitySerializer, UserSerializer
from rest_framework.fields import CurrentUserDefault
from .models import CustomUser
from rest_auth.registration.views import RegisterView


def company_only(f):
    def a_wrapper_accepting_arguments(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        company = CompanyField.objects.filter(user=request.user).first()
        if company is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return f(self, company, request, *args, **kwargs)
    return a_wrapper_accepting_arguments


def check_client_or_company(f):
    def a_wrapper_accepting_arguments(self, request, *args, **kwargs):
        if request.GET.get('account-type') == 'company':
            company = CompanyField.objects.filter(user=request.user).first()
            if company is None:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            return f(self, request, company, *args, **kwargs)

        else:
            return f(self, request, None, *args, **kwargs)

    return a_wrapper_accepting_arguments


class DishView(CreateAPIView, ListAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = Dish.objects.all()
    serializer_class = DishSerializer

    def list(self, request):
        queryset = self.get_queryset()
        shop_id = request.GET.get('shop')
        if shop_id is not None:
            queryset = queryset.filter(shop_id=shop_id)
        serializer = DishSerializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False)

    @company_only
    def post(self, company: CompanyField, request):
        request_data = dict(request.data)
        request_data['shop'] = company.pk
        serializer = self.serializer_class(data=request_data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return JsonResponse(serializer.data, safe=False)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @company_only
    def delete(self, company: CompanyField, request, pk):
        dish = get_object_or_404(self.queryset, pk=pk)
        if dish.shop != company:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        dish.delete()
        return Response(status=204)

    @company_only
    def patch(self, company: CompanyField, request, pk):
        dish = get_object_or_404(self.queryset, pk=pk)
        if dish.shop != company:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if request.data.get('shop') not in (None, company.pk):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serializer = DishSerializer(instance=dish, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return JsonResponse(serializer.data, safe=False)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class OrderView(CreateAPIView, ListAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = Order.objects.all().reverse()
    serializer_class = OrderSerializer

    @check_client_or_company
    def list(self, request, company_info: Optional[CompanyField]):
        if company_info is None:
            queryset = self.get_queryset().reverse().filter(client=request.user)
        else:
            queryset = self.get_queryset().reverse().filter(shop=company_info)

        include = request.GET.get('include')
        if include is not None:
            fields = include.split(',')
        exclude = request.GET.get('exclude')
        if exclude is not None:
            exclude = exclude.split(',')
        extend = request.GET.get('extend')
        if extend is not None:
            extend = extend.split(',')

        status = request.GET.get('status')
        if status is not None:
            queryset = queryset.filter(status=status)

        serializer = self.serializer_class(queryset, many=True, include=include, exclude=exclude, extend=extend)

        return JsonResponse(serializer.data, safe=False)

    # @check_client_or_company
    # def patch(self, request, company_info: Optional[CompanyField], pk):
    #     status_value = request.data.get('status')
    #
    #     if company_info is None:
    #         if status_value is not None and status_value != "QD":
    #             return Response(status=status.HTTP_400_BAD_REQUEST)
    #     else:
    #         if status_value is not None and status_value == "QD":
    #             return Response(status=status.HTTP_400_BAD_REQUEST)
    #
    #     if len(request.data) != 1:
    #         return Response(status=status.HTTP_400_BAD_REQUEST)
    #
    #     order = self.get_object()
    #     serializer = self.serializer_class(order, data={'status': status_value}, partial=True)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return JsonResponse(data=serializer.data)
    #     return JsonResponse(code=400, data="wrong parameters")

    def patch(self, request, pk):
        status_value = request.data.get('status')
        order = self.get_object()

        if status_value is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if status_value != "QD":
            company = CompanyField.objects.filter(user=request.user).first()
            if company is None:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            if order.shop != company:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            if order.client != request.user:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        if len(request.data) != 1:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        include = request.GET.get('include')
        if include is not None:
            fields = include.split(',')
        exclude = request.GET.get('exclude')
        if exclude is not None:
            exclude = exclude.split(',')
        extend = request.GET.get('extend')
        if extend is not None:
            extend = extend.split(',')

        serializer = self.serializer_class(order, data={'status': status_value}, partial=True, include=include,
                                           exclude=exclude, extend=extend)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(data=serializer.data)
        return JsonResponse(code=400, data="wrong parameters")

    def delete(self, request, pk):
        order = get_object_or_404(Order.objects.all(), pk=pk)
        if order.status != order.StatusChoices.Basket or order.client != request.user:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        order.delete()
        return Response(status=204)


class CompanyView(CreateAPIView, ListAPIView):
    queryset = CompanyField.objects.all()
    serializer_class = CompanySerializer

    def list(self, request, pk=None):
        if pk is not None:
            many = False
            queryset = CompanyField.objects.get(pk=pk)
        else:
            many = True
            queryset = self.get_queryset()

        include = request.GET.get('include')
        if include is not None:
            fields = include.split(',')
        exclude = request.GET.get('exclude')
        if exclude is not None:
            exclude = exclude.split(',')
        extend = request.GET.get('extend')
        if extend is not None:
            extend = extend.split(',')
        serializer = self.serializer_class(queryset, many=many, include=include, exclude=exclude, extend=extend)
        return JsonResponse(serializer.data, safe=False)

    def post(self, request):
        data = request.data
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if data.get('user') is None:
            data['user'] = request.user.pk
        if data.get('user') != request.user.pk:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if CompanyField.objects.all().filter(user=request.user).first() is not None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        ser = CompanySerializer(data=data)
        if ser.is_valid(raise_exception=True):
            ser.save()
            return JsonResponse(data=ser.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    @company_only
    def patch(self, company: CompanyField, request):
        serializer = CompanySerializer(instance=company, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return JsonResponse(serializer.data, safe=False)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class OrderItemView(APIView):

    def post(self, request):
        dish_id = request.data.get('dish_id')
        if dish_id is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        dish = Dish.objects.get(pk=dish_id)

        count = request.data.get('count')
        if count is None:
            request.data.set('count', 1)

        item: OrderItem = OrderItem.objects.filter(dish=dish, order__client=request.user,
                                                   order__status=Order.StatusChoices.Basket).first()
        if item is not None:
            serializer = OrderItemSerializer(item, data={'count': item.count + count}, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(data=serializer.data)
            return JsonResponse(code=400, data="wrong parameters")
        else:
            order: Order = Order.objects.filter(client=request.user, shop=dish.shop, status=Order.StatusChoices.Basket).first()
            if order is None:
                order = Order()
                order.shop_id = dish.shop_id
                order.status = Order.StatusChoices.Basket
                order.client = request.user
                order.save()

            serializer = OrderItemFullSerializer(data={'count': count, 'order': order.pk, 'dish': dish.pk})
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(data=serializer.data)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):

        order_item = OrderItem.objects.get(pk=pk)
        if order_item.order.client != request.user:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if order_item.order.status != Order.StatusChoices.Basket:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        count = request.data.get('count')
        if len(request.data) != 1 or count is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        serializer = OrderItemSerializer(order_item, data={'count': count}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(data=serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        order_item = get_object_or_404(OrderItem.objects.all(), pk=pk)
        if order_item.order.status != Order.StatusChoices.Basket or order_item.order.client != request.user:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        order_item.delete()
        return Response(status=204)


# class AccountView(APIView):
#     def get(self, request):
#         ser = ClientUserSerializer(client_user)
#         return JsonResponse(ser.data)
#
#     @client_only
#     def patch(self, client_user: ClientUser, request):
#         serializer = ClientUserSerializer(client_user, data=request.data, partial=True)
#         if serializer.is_valid(raise_exception=True):
#             serializer.save()
#             return JsonResponse(data=serializer.data)
#         return Response(status=400)


# class ChangePasswordView(UpdateAPIView):
#     """
#     An endpoint for changing password.
#     """
#     serializer_class = ChangePasswordSerializer
#     model = CustomUser
#     permission_classes = (IsAuthenticated,)
#
#     def get_object(self, queryset=None):
#         obj = self.request.user
#         return obj
#
#     def update(self, request, *args, **kwargs):
#         self.object = self.get_object()
#         serializer = self.get_serializer(data=request.data)
#
#         if serializer.is_valid():
#             # Check old password
#             if not self.object.check_password(serializer.data.get("old_password")):
#                 return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
#             # set_password also hashes the password that the user will get
#             self.object.set_password(serializer.data.get("new_password"))
#             self.object.save()
#
#             ser = UserSerializer(self.object)
#             return JsonResponse(data=ser.data)
#
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """
    An endpoint for changing password.
    """
    model = CustomUser
    permission_classes = (IsAuthenticated,)

    def patch(self, request, *args, **kwargs):
        object = request.user
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            object.set_password(serializer.data.get("new_password"))
            object.save()

            ser = UserSerializer(object)
            return JsonResponse(data=ser.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class CitiesView(CreateAPIView, ListAPIView):
    queryset = City.objects.all()
    serializer_class = CitySerializer


@api_view(['GET'])
def get_shops_database(request):
    shops_data = CompanySerializer(CompanyField.objects.all(), many=True)
    cities_data = CitySerializer(City.objects.all(), many=True)
    return Response({"shops": shops_data.data, 'cities': cities_data.data})


class RegisterUserView(APIView):
    def post(self, request):
        params = request.data
        user = CustomUser.objects.create_user(email=params['email'], phone=params['phone'], name=params['name'],
                                              surname=params['surname'], password=params['password'])
        ser = UserSerializer(user)
        return JsonResponse(data=ser.data)


class UserView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

        ser = UserSerializer(request.user)
        return JsonResponse(data=ser.data)

    def patch(self, request):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

        ser = UserSerializer(request.user, data=request.data, partial=True)
        if ser.is_valid():
            ser.save()
            return JsonResponse(data=ser.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class CustomRegisterView(RegisterView):
    queryset = CustomUser.objects.all()
