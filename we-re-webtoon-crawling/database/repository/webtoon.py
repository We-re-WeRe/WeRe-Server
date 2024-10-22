from .. import connection

def getWebtoonById(id):
    conn = connection.connectWithDatabase()
    cur = conn.cursor()

    cur.execute(f"SELECT * FROM webtoon WHERE(id={id})")
    webtoon = cur.fetchone()
    conn.close()
    return webtoon
    
def createWebtoon(webtoons):
    conn = connection.connectWithDatabase()
    cur = conn.cursor()

    def transformDictToKeyValueString(**kwargs):
        keys = list(map(lambda key:f'`{key}`',kwargs.keys()))
        keyString = ', '.join(keys)
        vals = list(map(transformQueryStyleString,kwargs.values()))
        valueString = ', '.join(vals)
        return keyString, valueString

    for webtoon in webtoons:
        keys,values = transformDictToKeyValueString(**webtoon)
        cur.execute(f"INSERT INTO webtoon({keys}) VALUES({values})")
        
    conn.commit()
    conn.close()

def updateWebtoon(webtoons):
    conn = connection.connectWithDatabase()
    cur = conn.cursor()

    def transformDictToKeyEqualsValueString(id,**kwargs):
        keyEqualsValueStringArr = []
        for key,val in kwargs.items():
            tempString = f"`{key}`={transformQueryStyleString(val)}"
            keyEqualsValueStringArr.append(tempString)
        keyEqualsValueString = ', '.join(keyEqualsValueStringArr)
        return keyEqualsValueString
    
    for webtoon in webtoons:
        keyEqualsValueString = transformDictToKeyEqualsValueString(**webtoon)

        cur.execute(f"""
                    UPDATE WEBTOON SET {keyEqualsValueString} WHERE( id={webtoon["id"]})
                    """)
    conn.commit()
    conn.close()

def transformQueryStyleString(val):
    return f"{val}" if type(val) == int else f'\"{val}\"'
