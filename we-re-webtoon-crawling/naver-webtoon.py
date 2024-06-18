import requests
import json
days = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"]
providingCompany = "naver"
apiUrl = 'http://localhost:3000'

response = requests.get("https://comic.naver.com/api/webtoon/titlelist/weekday")
parsedData = json.loads(response.text)

for day in days:
    webtoonsAtThatDay = parsedData["titleListMap"][day]
    for webtoon in webtoonsAtThatDay:
        titleId = webtoon["titleId"]
        titleName = webtoon["titleName"]
        authorAndPainter = webtoon["author"].split('/')
        author = authorAndPainter[0]
        painter = authorAndPainter[0] if len(authorAndPainter) == 1 else authorAndPainter[1]
        thumbnailUrl = webtoon["thumbnailUrl"]
        webtoonUrl = f"https://comic.naver.com/webtoon/list?titleId={titleId}&tab={day[:3]}"

        if requests.patch(f'{apiUrl}/webtoons?id={titleId}',data={'id':titleId, 'imageURL': thumbnailUrl,'webtoonURL': webtoonUrl,'author': author,'painter': painter}).status_code == 200:
            print(f"Patch is completed {titleId}")
        else:
            webtoonInfoUrl = f"https://comic.naver.com/api/article/list/info?titleId={titleId}"
            response = requests.get(webtoonInfoUrl)
            parsedInfoData = json.loads(response.text)
            
            explain = parsedInfoData["synopsis"]
            genre = ', '.join(parsedInfoData["gfpAdCustomParam"]["genreTypes"])
            response = requests.post(f'{apiUrl}/webtoons',data={'id':titleId,'title': titleName,'imageURL': thumbnailUrl,'webtoonURL': webtoonUrl,'author': author,'painter': painter,'providingCompany': providingCompany, 'day': day,'genre': genre,'explain': explain})
            print(response)
            print(f"Create Webtoon is completed {titleId}")