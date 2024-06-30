import requests
import json

providingCompany = "kakao"
genreDictionary = { "#드라마":"DRAMA", "#코믹/일상":"COMIC/DAILY","#액션/무협":'ACTION', "#공포/스릴러":'THRILL', "#로맨스":"PURE", "#판타지 드라마":'FANTASY/DRAMA', "#로맨스 판타지":'ROMANSE/FANTASY', "#학원/판타지":"ACADEMY/FANTASY"}
webtoonListURL = "https://gateway-kw.kakao.com/section/v1/timetables/days"
webtoonPageURL = "https://webtoon.kakao.com/content"
webtoonDetailURL = "https://gateway-kw.kakao.com/decorator/v2/decorator/contents"

def kakaoCrawling(day):
    webtoonArray = []
    query = f"placement=timetable_{day.lower()[:3]}"
    response = requests.get(f"{webtoonListURL}?{query}")
    parsedData = json.loads(response.text)
    
    webtoonsAtThatDay = parsedData["data"][0]["cardGroups"][0]["cards"]
    for webtoon in webtoonsAtThatDay:
        content = webtoon["content"]
        id = content["id"]
        title = content["title"]
        seoId = content["seoId"]
        webtoonUrl = f"{webtoonPageURL}/{seoId}/{id}"
        thumbnailUrl = content["featuredCharacterImageB"]+'.webp'
        authorAndPainter = content["authors"]
        authorArr = []
        painterArr = []
        originalStoryArr = []
        publisherArr = []
        for obj in authorAndPainter:
            if obj["type"] == "AUTHOR":
                authorArr.append(obj["name"])
            elif obj["type"] == "ILLUSTRATOR":
                painterArr.append(obj["name"])
            elif obj["type"] == "ORIGINAL_STORY":
                originalStoryArr.append(obj["name"])
            elif obj["type"] == "PUBLISHER":
                publisherArr.append(obj["name"])
        # author and painter 각각 없는 경우가 있을 수 있넹,,, 이거 토론 좀 해봐야할듯
        author = ', '.join(authorArr if len(authorArr) > 0 else originalStoryArr)
        painter = ', '.join(painterArr if len(painterArr) > 0 else publisherArr)

        webtoonInfoUrl = f"{webtoonDetailURL}/{id}/profile"
        response = requests.get(webtoonInfoUrl)
        parsedInfoData = json.loads(response.text)["data"]
        
        explain = parsedInfoData["synopsis"]
        genre = genreDictionary[parsedInfoData["seoKeywords"][2]]
        result = {'id':id,'title': title,'imageURL': thumbnailUrl,'webtoonURL': webtoonUrl,'author': author,'painter': painter,'providingCompany': providingCompany, 'day': day,'genre': genre,'explain': explain}
        webtoonArray.append(result)
    return webtoonArray