import requests

url = "https://freeocrapi.com/api"
filename = "myopd-sample-rx-eng.png"
data = {'file': open(filename, 'rb')}
response = requests.request("POST", url, files=data)
# print(response.text)
print(dict(response.json())['text'].replace('\n', ' '))

def get_data(filename):
    url = "https://freeocrapi.com/api"
    data = {'file': open(filename, 'rb')}

    response = requests.request("POST", url, files=data)
    data = dict(response.json())['text'].replace('\n', ' ')
    return data

def extract_data(raw_data):
    data = {
        'names': [],
        'dosages': []
    }
    for i in range(len(raw_data)):
        if raw_data[i:i+2] == 'mg':
            start_index = i - 2
            cur_dosage = ''
            while raw_data[start_index] != ' ':
                cur_dosage += raw_data[start_index]
                start_index -= 1
            data['dosages'].append(cur_dosage[::-1])
            start_index -= 1
            cur_name = ''
            while raw_data[start_index] != ' ':
                cur_name += raw_data[start_index]
                start_index -= 1
            data['names'].append(cur_name[::-1])

    return data

url = 'https://ez-med.herokuapp.com/login'
print(requests.post(url=url, data={'email': 'varun'}))
