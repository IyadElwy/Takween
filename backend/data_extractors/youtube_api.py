import requests
import json
from time import sleep

base_url = "https://youtube.googleapis.com/youtube/v3/search?part=snippet"
comments_base_url = "https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies"


def extract_data_from_youtube_api(parameters, file_path):
    api_key = parameters['apiKey']
    query = parameters['query'].replace(" ", "+")
    language = 'ar' if parameters['language'] == 'Arabic' else 'en'
    order = parameters['order']
    number_of_pages = 10_000_000 if parameters['numberOfPages'] == 'Until Pages Or Quota Exceeded' else int(
        parameters['numberOfPages'])
    comments_per_video = 10_000_000 if parameters['commentsPerVideo'] == 'Please Select Comments Per Video' else int(
        parameters['commentsPerVideo'])

    search_url = f'{base_url}&key={api_key}&q={query}&order={order}&relevanceLanguage={language}'
    for _page_index in range(number_of_pages):
        videos = requests.get(search_url)
        if videos.status_code != 200:
            continue
        videos = videos.json()

        for video in videos['items']:
            if video['id']['kind'] != 'youtube#video':
                continue
            curr_video_info: dict = {
                'title': video['snippet']['title'],
                'publishedAt': video['snippet']['publishedAt'],
                'description': video['snippet']['description'],
                'channelTitle': video.get('channelTitle'),
                "comments": []}
            comment_count = 0
            video_id = video['id']['videoId']
            comments_url = f'{comments_base_url}&key={api_key}&videoId={video_id}'

            while comment_count < comments_per_video:
                comments = requests.get(comments_url)
                if comments.status_code != 200:
                    comment_count += 1
                    continue
                comments = comments.json()

                comments_to_save = [{
                    'authorDisplayName': comment.get('snippet').get('topLevelComment').get('snippet').get('authorDisplayName'),
                    'textOriginal':   comment.get('snippet').get('topLevelComment').get('snippet').get('textOriginal'),
                } for comment in comments.get('items')]
                curr_video_info['comments'].append(comments_to_save)

                nextPageTokenComments = comments.get('nextPageToken')
                if nextPageTokenComments and comment_count == 0:
                    search_url = f'{search_url}&pageToken={nextPageTokenComments}'
                elif nextPageTokenComments and comment_count > 0:
                    search_url = f'{search_url.split("&pageToken")[0]}&pageToken={nextPageTokenComments}'

                comment_count += 1

            with open(file_path, '+a') as file:
                file.write(json.dumps(curr_video_info) + '\n')

        nextPageTokenVideos = videos.get('nextPageToken')
        if nextPageTokenVideos and _page_index == 0:
            search_url = f'{search_url}&pageToken={nextPageTokenVideos}'
        elif nextPageTokenVideos and _page_index > 0:
            search_url = f'{search_url.split("&pageToken")[0]}&pageToken={nextPageTokenVideos}'
        else:
            break
