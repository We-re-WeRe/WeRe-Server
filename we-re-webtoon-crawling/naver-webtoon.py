import requests
import json
days = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"]
response = requests.get("https://comic.naver.com/api/webtoon/titlelist/weekday")
parsedData = json.loads(response.text)
providingCompany = "naver"
for day in days:
    webtoonsAtThatDay = parsedData["titleListMap"][day]
    for webtoon in webtoonsAtThatDay:
        titleId = webtoon["titleId"]
        titleName = webtoon["titleName"]
        author = webtoon["author"]
        thumbnailUrl = webtoon["thumbnailUrl"]
        webtoonUrl = f"https://comic.naver.com/webtoon/list?titleId={titleId}&tab={day[:3]}"
        webtoonInfoUrl = f"https://comic.naver.com/api/article/list/info?titleId={titleId}"
        response = requests.get(webtoonInfoUrl)
        parsedInfoData = json.loads(response.text)
        explain = parsedInfoData["synopsis"]
        genre = ', '.join(parsedInfoData["gfpAdCustomParam"]["genreTypes"])
