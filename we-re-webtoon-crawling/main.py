import sys
import datetime as dt
import database.repository.webtoon as webtoon_repository
import webtoon.naver as naver
import webtoon.kakao as kakao

days = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"]

def getRequestDays():
    argLen = len(sys.argv)
    if argLen > 1:
        isInit = sys.argv[1]
        if isInit == "all":
            return days
    x = dt.datetime.now()
    today = days[x.weekday()]
    return [today]

def checkWebtonInDB(id):
    return True if webtoon_repository.getWebtoonById(id) else False

def addWebtoonInDB(webtoons):
    webtoon_repository.createWebtoon(webtoons)
    print(len(webtoons), " webtoons are created.")

def updateWebtoonInDB(webtoons):
    webtoon_repository.updateWebtoon(webtoons)
    print(len(webtoons), " webtoons are updated.")
    
if __name__ == "__main__":
    requestDays = getRequestDays()
    webtoons = []
    create_webtoons = []
    update_webtoons = []

    for day in requestDays:
        webtoons += naver.getParsedNaverWebtoonList(day)
        print(f"{day}'s naver webtoon is found")
        webtoons += kakao.getParsedKakaoWebtoonList(day)
        print(f"{day}'s kakao webtoon is found")

    for webtoon in webtoons:
        if(checkWebtonInDB(webtoon["id"])):
            update_webtoons.append(webtoon)
        else:
            create_webtoons.append(webtoon)
            
    addWebtoonInDB(create_webtoons)
    updateWebtoonInDB(update_webtoons)
