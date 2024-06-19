import requests
import json
days = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"]
providingCompany = "kakao"
apiUrl = 'http://localhost:3000'

genreDictionary = { "#드라마":"DRAMA", "#코믹/일상":"COMIC/DAILY","#액션/무협":'ACTION', "#공포/스릴러":'THRILL', "#로맨스":"PURE", "#판타지 드라마":'FANTASY/DRAMA', "#로맨스 판타지":'ROMANSE/FANTASY', "#학원/판타지":"ACADEMY/FANTASY"}
for day in days:
    response = requests.get(f"https://gateway-kw.kakao.com/section/v1/timetables/days?placement=timetable_{day.lower()[:3]}")
    parsedData = json.loads(response.text)
    webtoonsAtThatDay = parsedData["data"][0]["cardGroups"][0]["cards"]
    for webtoon in webtoonsAtThatDay:
        content = webtoon["content"]
        id = content["id"]
        title = content["title"]
        seoId = content["seoId"]
        webtoonUrl = f"https://webtoon.kakao.com/content/{seoId}/{id}"
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

        if requests.patch(f'{apiUrl}/webtoons?id={id}',data={'id':id, 'imageURL': thumbnailUrl,'webtoonURL': webtoonUrl,'author': author,'painter': painter}).status_code == 200:
            print(f"Patch is completed {id}")
        else:
            webtoonInfoUrl = f"https://gateway-kw.kakao.com/decorator/v2/decorator/contents/{id}/profile"
            response = requests.get(webtoonInfoUrl)
            parsedInfoData = json.loads(response.text)["data"]
            
            explain = parsedInfoData["synopsis"]
            genre = genreDictionary[parsedInfoData["seoKeywords"][2]]
            response = requests.post(f'{apiUrl}/webtoons',data={'id':id,'title': title,'imageURL': thumbnailUrl,'webtoonURL': webtoonUrl,'author': author,'painter': painter,'providingCompany': providingCompany, 'day': day,'genre': genre,'explain': explain})
            if response.status_code == 201:
                print(f"Create Webtoon is completed {id}")
            else:
                print(response.text)