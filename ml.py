import requests

url = "https://freeocrapi.com/api"
filename = "/Users/varunsahni/Desktop/myopd-sample-rx-eng.png"
data = {'file': open(filename, 'rb')}
response = requests.request("POST", url, files=data)
print(dict(response.json())['text'].replace('\n', ' '))
# def extract_data(raw_data):
#     data = {
#         'name': '',
#         'dosage': '',
#         'timings': ''
#     }
#     for i range(len(raw_data)):
#         if 