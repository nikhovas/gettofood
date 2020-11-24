from django.contrib.auth.base_user import BaseUserManager


class UserManager(BaseUserManager):

    use_in_migrations = True

    def create_user(self, email, phone, name, surname, password=None):
        user = self.model(email=self.normalize_email(email), phone=phone, name=name, surname=surname)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_staffuser(self, email, phone, name, surname, password):
        user = self.create_user(email, password=password, phone=phone, name=name, surname=surname)
        user.staff = True
        user.save(using=self._db)
        return user

    def create_superuser(self, email, phone, name, surname, password):
        user = self.create_user(email, password=password, phone=phone, name=name, surname=surname)
        user.staff = True
        user.admin = True
        user.save(using=self._db)
        return user
