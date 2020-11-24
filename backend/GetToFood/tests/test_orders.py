import unittest
from rest_framework.test import APIRequestFactory

# import os
#
# os.environ['DJANGO_SETTINGS_MODULE'] = 'GetToFoodBackend.settings'


class TestOrders(unittest.TestCase):
    def test_get_dishes(self):
        factory = APIRequestFactory()
        reuqest = factory.post('/api/token/')
        pass