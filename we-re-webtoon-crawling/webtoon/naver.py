import requests
import json

providingCompany = "naver"
webtoonListURL = "https://comic.naver.com/api/webtoon/titlelist/weekday"
webtoonPageURL = "https://comic.naver.com/webtoon/list"
webtoonDetailURL = "https://comic.naver.com/api/article/list/info"

def getParsedNaverWebtoonList(day):
    webtoonArray = []
    query = f"week={day.lower()[:3]}"
    response = requests.get(f"{webtoonListURL}?{query}")
    parsedData = json.loads(response.text)
    webtoonsAtThatDay = parsedData["titleList"]

    for webtoon in webtoonsAtThatDay:
        id = webtoon["titleId"]
        title = webtoon["titleName"]
        authorArr = list(map(lambda o:o["name"], webtoon["writers"]))
        painterArr = list(map(lambda o:o["name"], webtoon["painters"]))
        author = ', '.join(authorArr)
        painter = ', '.join(painterArr)
        thumbnailUrl = webtoon["thumbnailUrl"]
        webtoonUrl = f"{webtoonPageURL}?titleId={id}&tab={day[:3]}"
        webtoonInfoUrl = f"{webtoonDetailURL}?titleId={id}"
        response = requests.get(webtoonInfoUrl)
        parsedInfoData = json.loads(response.text)
        
        explain = parsedInfoData["synopsis"]
        genre = ', '.join(parsedInfoData["gfpAdCustomParam"]["genreTypes"])
        result={'id':id,'title': title,'imageURL': thumbnailUrl,'webtoonURL': webtoonUrl,'author': author,'painter': painter,'providingCompany': providingCompany, 'day': day,'genre': genre,'explain': explain}
        webtoonArray.append(result)
    return webtoonArray
