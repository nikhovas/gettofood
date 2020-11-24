from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings

from GetToFood.models import Dish, CustomUser, Order, CompanyField, OrderItem, City
from rest_auth.registration.serializers import RegisterSerializer


class CustomRegisterSerializer(RegisterSerializer):

    email = serializers.EmailField(required=True)
    password1 = serializers.CharField(write_only=True)
    phone = serializers.CharField(required=True)
    name = serializers.CharField(required=True)
    surname = serializers.CharField(required=True)

    def get_cleaned_data(self):
        super(CustomRegisterSerializer, self).get_cleaned_data()

        return {
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
            'name': self.validated_data.get('name', ''),
            'surname': self.validated_data.get('name', ''),
            'phone': self.validated_data.get('phone', '')
        }


class CustomUserDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ['email', 'phone', 'name', 'surname']
        read_only_fields = ('email',)


class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = '__all__'


class DishInOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ['name', 'price', 'id']


class OrderItemSerializer(serializers.ModelSerializer):
    dish = DishInOrderSerializer()

    class Meta:
        model = OrderItem
        fields = ['count', 'dish', 'id']


class OrderItemFullSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderItem
        fields = '__all__'


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('include', None)
        exclude = kwargs.pop('exclude', None)
        extend = kwargs.pop('extend', None)
        self.extend = []
        if extend is not None:
            if hasattr(self.Meta, 'extends'):
                self.extend = [i for i in set(extend) & set(self.fields) if i in self.Meta.extends]

        # Instantiate the superclass normally
        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)
        elif exclude is not None:
            for i in set(exclude) & set(self.fields):
                self.fields.pop(i)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        for i in self.extend:
            if hasattr(self, 'Meta'):
                extend_class = self.Meta.extends[i]
                obj = extend_class.Meta.model.objects.get(pk=ret[i])
                ser = extend_class(obj)
                ret[i] = ser.data
        return ret


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'


class CompanySerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = CompanyField
        fields = '__all__'
        extends = {
            'user': UserSerializer,
            'city': CitySerializer
        }


class OrderSerializer(DynamicFieldsModelSerializer):
    order_items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['status', 'shop', 'order_items', 'id', 'client']
        extends = {
            'client': CustomUserDetailsSerializer,
            'shop': CompanySerializer
        }
        write_only_fields = []


class ChangePasswordSerializer(serializers.Serializer):
    model = CustomUser

    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def authenticate(self, request, email=None, password=None, **kwargs):
        if email is None:
            username = kwargs.get(CustomUser.USERNAME_FIELD)
        if username is None or password is None:
            return
        try:
            user = CustomUser._default_manager.get_by_natural_key(username)
        except CustomUser.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a nonexistent user (#20760).
            CustomUser().set_password(password)
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        company = CompanyField.objects.filter(user=self.user).first()
        data['company'] = company is not None
        data['accountId'] = self.user.pk
        company = CompanyField.objects.filter(user=self.user).first()
        if company is not None:
            data['companyId'] = company.pk
        data['account'] = CustomUserDetailsSerializer(self.user).data
        return data



