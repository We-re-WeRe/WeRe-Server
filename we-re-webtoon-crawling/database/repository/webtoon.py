from .. import connection

def transformDictToKeyValueString(**kwargs):
    def transformQueryStyleString(val):
        return f"{val}" if type(val) == int else f'\'{val}\''
    
    keys = list(map(lambda key:f'`{key}`',kwargs.keys()))
    keyString = ', '.join(keys)
    vals = list(map(transformQueryStyleString,kwargs.values()))
    valueString = ', '.join(vals)
    return keyString, valueString

def createWebtoon(webtoon):
    conn = connection.connectWithDatabase()
    cur = conn.cursor()
    key,value = transformDictToKeyValueString(**webtoon)
    cur.execute(f"INSERT INTO webtoon({key}) VALUES({value})")
    conn.commit()
    conn.close()