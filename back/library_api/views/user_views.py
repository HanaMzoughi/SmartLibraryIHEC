from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta
from django.http import HttpResponseForbidden, JsonResponse
from library_api.repositories.user_repository import UserRepository
from library_api.serializers.user_serializer import UserSerializer
from library_project.settings import SECRET_KEY
import jwt
import bcrypt
import qrcode
from io import BytesIO
from base64 import b64encode


@csrf_exempt

def user_register(request):
    """
    Registers a new user.

    Method: POST
    Body: JSON containing 'email', 'role', 'password', and optionally 'university' and 'speciality' for students

    Returns:
        201: User created successfully
        400: User creation failed (e.g., email already exists or invalid JSON)
        405: Invalid request method
        500: Internal server error
    """
    if request.method == 'POST':
        try:
            data = UserSerializer.deserialize(request.body.decode('utf-8'))
            email = data.get('email')
            role = data.get('role')
            password = data.get('password')

            # Additional attributes for students
            university = data.get('university') if role == 'student' else None
            speciality = data.get('speciality') if role == 'student' else None

            user_repository = UserRepository()
            user_created = user_repository.create_user(
                email=email,
                username=data.get('username'),  # Assuming 'username' is in the data
                password=password,
                role=role
            )

            if user_created:
                return JsonResponse({'message': 'User created successfully'}, status=201)
            else:
                return JsonResponse({'message': 'User creation failed: Email already exists'}, status=400)

        except ValueError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'message': f'An error occurred: {str(e)}'}, status=500)

    return JsonResponse({'message': 'Invalid request method'}, status=405)


@csrf_exempt
def user_login(request):

    """
    Logs in a user.

    Method: POST
    Body: JSON containing 'email' and 'password' or 'qr_code'

    Returns:
        200: JWT token
        400: Invalid JSON
        403: Invalid credentials
        405: Invalid request method
        500: Internal server error
    """

    if request.method == 'POST':
        try:
            data = UserSerializer.deserialize(request.body.decode('utf-8'))
            email = data.get('email')
            password = data.get('password')
            qr_code = data.get('qr_code')

            user_repo = UserRepository()

            if qr_code:
                user_data = user_repo.get_user_by_qr_code(qr_code)
                if user_data:
                    payload = {
                        '_id': str(user_data.get('_id')),
                        'role': user_data.get('role'),
                        'exp': datetime.utcnow() + timedelta(days=1)  # Token expiration time
                    }
                    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
                    return JsonResponse({'token': token}, status=200)
                else:
                    return HttpResponseForbidden('Invalid QR code')

            if email and password:
                user_data = user_repo.get_user_by_email(email)

                if user_data:
                    stored_password = user_data.get('password')
                    if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
                        payload = {
                            '_id': str(user_data.get('_id')),
                            'role': user_data.get('role'),
                            'exp': datetime.utcnow() + timedelta(days=1)  # Token expiration time
                        }
                        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
                        return JsonResponse({'token': token}, status=200)
                    else:
                        return HttpResponseForbidden('Invalid credentials')
                else:
                    return HttpResponseForbidden('Invalid credentials')
            else:
                return JsonResponse({'error': 'Email and password or QR code required'}, status=400)

        except ValueError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def user_delete(request):

    """
    Deletes a user.

    Method: DELETE
    Header: Authorization token

    Returns:
        200: User deleted successfully
        403: User not found or token invalid
        405: Invalid request method
    """

    if request.method == 'DELETE':
        token = request.headers.get('Authorization').split(' ')[1]

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            _id = payload['_id']
            user_repo = UserRepository()
            user_data = user_repo.get_user_by_id(_id)
            
            if user_data:
                user_repo.delete_user(_id)
                return JsonResponse({'message': 'User deleted successfully'})
            else:
                return HttpResponseForbidden('User not found')
        except jwt.ExpiredSignatureError:
            return HttpResponseForbidden('Token expired')
        except jwt.InvalidTokenError:
            return HttpResponseForbidden('Invalid token')

@csrf_exempt
def user_update(request):

    """
    Updates a user's information.

    Method: PUT
    Header: Authorization token
    Body: JSON containing 'email', 'role', and/or 'password'

    Returns:
        200: User updated successfully
        403: User not found or token invalid
        405: Invalid request method
    """

    if request.method == 'PUT':
        token = request.headers.get('Authorization').split(' ')[1]

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            _id = payload['_id']
            user_repo = UserRepository()
            user_data = user_repo.get_user_by_id(_id)
            
            if user_data:
                data = UserSerializer.deserialize(request.body.decode('utf-8'))
                new_email = data.get('email')
                new_role = data.get('role')
                new_password = data.get('password')

                if new_email:
                    user_data['email'] = new_email
                if new_role:
                    user_data['role'] = new_role
                if new_password:
                    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
                    user_data['password'] = hashed_password.decode('utf-8')

                user_repo.update_user(_id, user_data)
                return JsonResponse({'message': 'User updated successfully'})
            else:
                return HttpResponseForbidden('User not found')
        except jwt.ExpiredSignatureError:
            return HttpResponseForbidden('Token expired')
        except jwt.InvalidTokenError:
            return HttpResponseForbidden('Invalid token')

@csrf_exempt
def user_info(request):

    """
    Retrieves a user's information.

    Method: GET
    Header: Authorization token

    Returns:
        200: User information
        403: User not found or token invalid
        405: Invalid request method
    """

    if request.method == 'GET':
        token = request.headers.get('Authorization').split(' ')[1]

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            _id = payload['_id']
            user_data = UserRepository().get_user_by_id(_id)

            if user_data:
                user_data = UserSerializer.sanitize(user_data)
                user_data['_id'] = str(user_data['_id'])
                return JsonResponse(user_data)
            else:
                return HttpResponseForbidden('User not found')
        except jwt.ExpiredSignatureError:
            return HttpResponseForbidden('Token expired')
        except jwt.InvalidTokenError:
            return HttpResponseForbidden('Invalid token')
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def user_open_info(request, _id):
    
    """
    Get user information by user ID.

    Args:
        request (HttpRequest): The request object.
        _id (str): The user ID.

    Returns:
        JsonResponse: User information JSON response.
        HttpResponseForbidden: Forbidden response if user not found or token expired/invalid.
    """
     
    if request.method == 'GET':
        try:
            user_data = UserRepository().get_user_by_id(_id)

            if user_data:
                user_data = UserSerializer.sanitize(user_data)
                user_data['_id'] = str(user_data['_id'])
                return JsonResponse(user_data)
            else:
                return HttpResponseForbidden('User not found')
        except jwt.ExpiredSignatureError:
            return HttpResponseForbidden('Token expired')
        except jwt.InvalidTokenError:
            return HttpResponseForbidden('Invalid token')
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

# Function to generate a QR code for user authentication
def generate_qr_code(user_id, email, role):
    """
    Génère un QR code basé sur l'adresse e-mail et le rôle de l'utilisateur.

    Args:
        user_id (str): L'identifiant de l'utilisateur.
        email (str): L'adresse e-mail de l'utilisateur.
        role (str): Le rôle de l'utilisateur (étudiant, bibliothécaire, administrateur).

    Returns:
        JsonResponse: Une réponse contenant le QR code encodé en base64.
    """
    try:
        # Déterminer la durée de validité selon l'adresse e-mail
        if "@ihec.ucar.tn" in email:
            expiration = timedelta(days=365)  # 1 an
        else:
            expiration = timedelta(days=1)  # 24 heures

        # Créer un payload pour le JWT
        payload = {
            'user_id': user_id,
            'email': email,
            'role': role,
            'exp': datetime.utcnow() + expiration  # Date d'expiration
        }

        # Générer le JWT
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        # Créer un QR Code contenant le token
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(token)
        qr.make(fit=True)

        # Générer l'image du QR Code
        img = qr.make_image(fill='black', back_color='white')

        # Convertir l'image en base64
        img_io = BytesIO()
        img.save(img_io, 'PNG')
        img_io.seek(0)
        img_base64 = b64encode(img_io.getvalue()).decode('utf-8')

        # Retourner le QR Code encodé et le token
        return JsonResponse({'qr_code': img_base64, 'token': token})
    except Exception as e:
        return JsonResponse({'error': f'Erreur lors de la génération du QR Code : {str(e)}'}, status=500)
    # Ajoutez la vue pour générer le QR Code
@csrf_exempt
def generate_user_qr_code(request):
    """
    Génère un QR Code pour un utilisateur basé sur son e-mail et son rôle.

    Méthode: GET
    Paramètres : user_id (str), email (str), role (str)
    """
    if request.method == 'GET':
        try:
            user_id = request.GET.get('user_id')
            email = request.GET.get('email')
            role = request.GET.get('role')

            if not user_id or not email or not role:
                return JsonResponse({'error': 'Les paramètres user_id, email et role sont requis'}, status=400)

            # Générer le QR Code pour cet utilisateur
            return generate_qr_code(user_id, email, role)

        except Exception as e:
            return JsonResponse({'error': f'Erreur lors de la génération du QR Code : {str(e)}'}, status=500)

    else:
        return JsonResponse({'error': 'Méthode HTTP non autorisée'}, status=405)