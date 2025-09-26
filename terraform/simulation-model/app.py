import json

import boto3
import h5py
import requests, io
import numpy as np
import os
from keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.applications.vgg16 import preprocess_input

# import solubility_models_deployment as model3

print("All modules are loaded!!!!!!!!!!!!!!!!")

# Turbidity value
turbidity_measured = 1017.06 # your measured value

def get_content_from_presigned_url(presigned_url):
    # Send a GET request to the presigned URL
    print("sending get_content_from_presigned_url")
    print("presigned url is ", presigned_url)
    response = requests.get(presigned_url)

    print("got response back for presigned_url ")
    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Convert file content to bytes
        return io.BytesIO(response.content)
    else:
        # If the request was not successful, print an error message
        print(f"Failed to fetch image from presigned URL. Status code: {response.status_code}")
        return None

def generate_presigned_url(api_url, file_path, jwt_token, **kwargs):
    print("JWT token is", jwt_token)

    # Setting up the authorization header with the extracted JWT token for the outgoing request
    headers = {
        "Authorization": jwt_token
    }

    print(" generate_presigned_url start with api_url:", api_url, " and file_path", file_path)
    response = requests.post(f"{api_url}/files/download", json={"file": file_path}, headers=headers)
    print("got response back")
    if response.status_code == 200:
        presigned_url = json.loads(response.content).get('body', None)
        print("presigned_url found anc check for condition")
        if presigned_url is not None:
            return get_content_from_presigned_url(presigned_url)
    else:
        print(f"Failed to generate presigned_url. Status code: {response.status_code}")
    return None

def load_model_path():
    print("inside here, starting to load model path");
    #s3_bucket = os.environ.get('S3_BUCKET_NAME')
    s3_bucket = 'dev-aws-marcos-model'
    s3_key = 'deeplearning_model_v2.h5'

    print("s3_bucket name is", s3_bucket)
    # Local file path for downloading the model
    local_model_path = '/tmp/deeplearning_model_v2.h5'

    # Download the model from S3
    s3_client = boto3.client('s3')
    print("created client");
    try:
        print("starting to download file")
        s3_client.download_file(s3_bucket, s3_key, local_model_path)
        print("downloaded file");
    except Exception as e:
        print("caught exception here", str(e))
        return {
            'statusCode': 500,
            'body': f'Error downloading model from S3: {str(e)}'
        }

        # Load the model using h5py
    try:
        print("opening h5 file")
        with h5py.File(local_model_path, 'r') as file:
            model = load_model(file)
            print("model loaded, returning now..")
            return model
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error loading model: {str(e)}'
        }

    # Now you can use the 'model' object as needed in your Lambda function

    # Example: Print the summary of the loaded model
    model.summary()

def load_and_preprocess_image(image_path):
    img = load_img(image_path, target_size=(224, 224))
    img = img_to_array(img)
    img = preprocess_input(img)
    return img

def lambda_handler(event, context):
    # TODO implement
    print("Inside Lambda Function")
    try:
        print("JSON Data ", event)
        api_url = None
        file_path = None
        turbidity_measured = None
        try:
            json_data = json.loads(event['body'])
            api_url = json_data.get('api_url', None)
            file_path = json_data.get('file_path', None)
            turbidity_measured = json_data.get('turbidity_measured', None)
            event_bridge = json_data.get('event_bridge', None)
        except:
            api_url = event.get('api_url', None)
            file_path = event.get('file_path', None)
            turbidity_measured = event.get('turbidity_measured', None)
            event_bridge = event.get('event_bridge', None)
        if event_bridge is not None:
            return {
                'statusCode': 200,
                'message': 'We are warming up only model3 lambda function.',
                'body': {},
            }
        if api_url is None or file_path is None:
            return {
                'statusCode': 400,
                'message': 'API_URL or File or turbidity is missing.',
                'body': {},
            }
        print("File Path : ", file_path)
        print("type of turbidity before is", type(turbidity_measured))
        turbidity_measured = float(turbidity_measured)
        print("type of turbidity after is", type(turbidity_measured))
        # Load your pre-trained Keras models
        print("starting to load the model now");
        model = load_model_path();
        #model = load_model('./deeplearning_model_v2.h5')
        print("Tensorflow models loaded!!!!!!!!!!!!!!!")
        jwt_token = event['headers']['authorization']
        image = generate_presigned_url(api_url, file_path, jwt_token)
        print("Image Data", image)

        print("turbidity_measured value is ", turbidity_measured)
        turbidity = np.array([turbidity_measured])
        image_data = np.array([image], dtype='O')
        processed_image = [load_and_preprocess_image(image) for image in image_data]
        solubility = model.predict([np.array(processed_image), turbidity])
        formatted_solubility = "{:.2f}".format(float(solubility[0, 0]))
        print("Solubility =", formatted_solubility, "mg/ml")

        return {
            'statusCode': 200,
            'message': 'success',
            'body': json.dumps({
                'predicted_labels': str("test"),
                'solubility': str(formatted_solubility)
            }),
        }
    except Exception as e:
        print('error!!!!!!!!!!!!!!!!!!!')
        print(e)
        return {
            'statusCode': 400,
            'message': 'error',
            'body': json.dumps(str(e))
        }